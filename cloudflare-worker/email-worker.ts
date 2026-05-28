/**
 * KT Bank – Cloudflare Email Worker
 *
 * Déploiement :
 *   cd cloudflare-worker && npx wrangler deploy
 *
 * Variables à configurer dans Cloudflare Dashboard → Worker → Settings → Variables :
 *   WEBHOOK_URL    = https://kt-bank-ag.com/api/kt/webhook/email
 *   WEBHOOK_SECRET = (même valeur que CF_WEBHOOK_SECRET dans Vercel)
 *
 * Email Routing dans Cloudflare :
 *   support@kt-bank-ag.com → ce Worker
 *   contact@kt-bank-ag.com → ce Worker
 */

interface Env {
  WEBHOOK_URL: string;
  WEBHOOK_SECRET: string;
}

interface EmailMessage {
  from: string;
  to: string;
  headers: Headers;
  raw: ReadableStream;
  forward: (address: string) => Promise<void>;
}

function decodeQuotedPrintable(input: string): string {
  try {
    return input
      .replace(/=\r\n/g, "")
      .replace(/=\n/g, "")
      .replace(/=([0-9A-Fa-f]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
  } catch {
    return input;
  }
}

function decodeBase64Safe(input: string): string {
  try {
    return atob(input.replace(/\s+/g, ""));
  } catch {
    return input;
  }
}

function parseMime(raw: string, depth = 0): { bodyText: string; bodyHtml: string } {
  if (depth > 5) return { bodyText: "", bodyHtml: "" };

  try {
    // Normalize line endings
    const text = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

    let bodyText = "";
    let bodyHtml = "";

    // Look for multipart boundary
    const boundaryMatch = text.match(/Content-Type:\s*multipart\/[^;\n]+;\s*(?:[^;\n]+;\s*)*boundary=["']?([^"'\n\s;]+)["']?/im);

    if (boundaryMatch && boundaryMatch[1]) {
      const boundary = boundaryMatch[1].trim();
      // Escape for use in regex
      const escaped = boundary.replace(/[$()*+.?[\\\]^{|}]/g, "\\$&");
      let parts: string[];
      try {
        parts = text.split(new RegExp(`\n--${escaped}(?:--)?(?=\n|$)`));
      } catch {
        // Fallback: simple string split
        parts = text.split(`\n--${boundary}`);
      }

      for (const part of parts) {
        if (!part.trim() || part.trim() === "--") continue;

        const divider = part.indexOf("\n\n");
        if (divider === -1) continue;

        const headers = part.slice(0, divider);
        const body = part.slice(divider + 2);

        const ctMatch = headers.match(/Content-Type:\s*([^;\n]+)/i);
        const ceMatch = headers.match(/Content-Transfer-Encoding:\s*(\S+)/i);
        const contentType = (ctMatch?.[1] ?? "").trim().toLowerCase();
        const encoding = (ceMatch?.[1] ?? "").trim().toLowerCase();

        let decoded = body.trim();
        if (encoding === "quoted-printable") decoded = decodeQuotedPrintable(decoded);
        else if (encoding === "base64") decoded = decodeBase64Safe(decoded);

        if (contentType.startsWith("multipart/") && !bodyText && !bodyHtml) {
          // Recurse into nested multipart
          const sub = parseMime(headers + "\n\n" + body, depth + 1);
          if (sub.bodyText) bodyText = sub.bodyText;
          if (sub.bodyHtml) bodyHtml = sub.bodyHtml;
        } else if (contentType === "text/plain" && !bodyText) {
          bodyText = decoded;
        } else if (contentType === "text/html" && !bodyHtml) {
          bodyHtml = decoded;
        }
      }
    } else {
      // Simple (non-multipart) email: everything after the first blank line
      const split = text.indexOf("\n\n");
      if (split !== -1) {
        const headers = text.slice(0, split);
        const body = text.slice(split + 2).trim();
        const ceMatch = headers.match(/Content-Transfer-Encoding:\s*(\S+)/i);
        const encoding = (ceMatch?.[1] ?? "").trim().toLowerCase();
        if (encoding === "quoted-printable") bodyText = decodeQuotedPrintable(body);
        else if (encoding === "base64") bodyText = decodeBase64Safe(body);
        else bodyText = body;
      }
    }

    return { bodyText, bodyHtml };
  } catch {
    return { bodyText: "", bodyHtml: "" };
  }
}

export default {
  async email(message: EmailMessage, env: Env, _ctx: ExecutionContext) {
    // Forward to Gmail first — non-blocking backup regardless of what happens below
    try { await message.forward("KTBANKAGDE@GMAIL.COM"); } catch { /* ignore */ }

    const from = message.from ?? "";
    const to = message.to ?? "";
    const subject = message.headers.get("subject") ?? "(sans objet)";
    const messageId = message.headers.get("message-id") ?? undefined;
    const inReplyTo = message.headers.get("in-reply-to") ?? undefined;
    const references = message.headers.get("references") ?? undefined;

    let bodyText = "";
    let bodyHtml = "";

    try {
      const reader = message.raw.getReader();
      const decoder = new TextDecoder();
      const chunks: string[] = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) chunks.push(decoder.decode(value, { stream: true }));
      }
      const raw = chunks.join("");
      const parsed = parseMime(raw);
      bodyText = parsed.bodyText;
      bodyHtml = parsed.bodyHtml;
    } catch (err) {
      console.error("[KT Email Worker] MIME parse error:", err);
    }

    try {
      const webhookUrl = env.WEBHOOK_URL;
      const secret = env.WEBHOOK_SECRET ?? "";
      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-webhook-secret": secret,
          },
          body: JSON.stringify({ from, to, subject, bodyText, bodyHtml, messageId, inReplyTo, references }),
        });
      }
    } catch (err) {
      console.error("[KT Email Worker] Webhook failed:", err);
    }
  },
};
