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
  headers: Map<string, string>;
  raw: ReadableStream;
  forward: (address: string) => Promise<void>;
}

function decodeQuotedPrintable(input: string): string {
  return input
    .replace(/=\r\n/g, "")
    .replace(/=\n/g, "")
    .replace(/=([0-9A-Fa-f]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

function decodeBase64(input: string): string {
  try {
    return atob(input.replace(/\s+/g, ""));
  } catch {
    return input;
  }
}

function parseMime(raw: string): { bodyText: string; bodyHtml: string } {
  // Normalize line endings
  const text = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  let bodyText = "";
  let bodyHtml = "";

  // Check for multipart boundary in the top-level headers
  const boundaryMatch = text.match(/^Content-Type:[^\n]*?boundary=["']?([^"'\n\s;]+)["']?/im);

  if (boundaryMatch) {
    const boundary = boundaryMatch[1].trim();
    const escaped = boundary.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // Split on --boundary (not the closing --)
    const parts = text.split(new RegExp(`\n--${escaped}(?:--)?(?:\n|$)`));

    for (const part of parts) {
      if (!part.trim()) continue;

      // Each part: headers block + blank line + body
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
      else if (encoding === "base64") decoded = decodeBase64(decoded);

      // Recurse into nested multipart (e.g. multipart/alternative inside multipart/mixed)
      if (contentType.startsWith("multipart/") && !bodyText && !bodyHtml) {
        const sub = parseMime(headers + "\n\n" + body);
        if (sub.bodyText) bodyText = sub.bodyText;
        if (sub.bodyHtml) bodyHtml = sub.bodyHtml;
      } else if (contentType === "text/plain" && !bodyText) {
        bodyText = decoded;
      } else if (contentType === "text/html" && !bodyHtml) {
        bodyHtml = decoded;
      }
    }
  } else {
    // Simple (non-multipart) email: everything after the first blank line is the body
    const split = text.indexOf("\n\n");
    if (split !== -1) {
      const headers = text.slice(0, split);
      const body = text.slice(split + 2).trim();
      const ceMatch = headers.match(/Content-Transfer-Encoding:\s*(\S+)/i);
      const encoding = (ceMatch?.[1] ?? "").trim().toLowerCase();
      if (encoding === "quoted-printable") bodyText = decodeQuotedPrintable(body);
      else if (encoding === "base64") bodyText = decodeBase64(body);
      else bodyText = body;
    }
  }

  return { bodyText, bodyHtml };
}

export default {
  async email(message: EmailMessage, env: Env, _ctx: ExecutionContext) {
    const from = message.from;
    const to = message.to;
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
        chunks.push(decoder.decode(value, { stream: true }));
      }
      const raw = chunks.join("");
      const parsed = parseMime(raw);
      bodyText = parsed.bodyText;
      bodyHtml = parsed.bodyHtml;
    } catch (err) {
      console.error("[KT Email Worker] MIME parse error:", err);
      bodyText = "(contenu non lisible)";
    }

    try {
      await fetch(env.WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-webhook-secret": env.WEBHOOK_SECRET ?? "",
        },
        body: JSON.stringify({ from, to, subject, bodyText, bodyHtml, messageId, inReplyTo, references }),
      });
    } catch (err) {
      console.error("[KT Email Worker] Webhook failed:", err);
    }

    // Forward backup to Gmail
    try {
      await message.forward("KTBANKAGDE@GMAIL.COM");
    } catch {
      // Non-blocking
    }
  },
};
