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

interface Attachment {
  filename: string;
  mimeType: string;
  cid?: string;
  data: string;   // base64-encoded content (empty if tooLarge)
  size: number;   // approximate decoded bytes
  tooLarge?: boolean;
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

function parseMime(
  raw: string,
  depth = 0,
): { bodyText: string; bodyHtml: string; attachments: Attachment[]; cidMap: Map<string, string> } {
  if (depth > 5) return { bodyText: "", bodyHtml: "", attachments: [], cidMap: new Map() };

  try {
    const text = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

    let bodyText = "";
    let bodyHtml = "";
    const attachments: Attachment[] = [];
    const cidMap = new Map<string, string>(); // cid -> data URI

    const boundaryMatch = text.match(
      /Content-Type:\s*multipart\/[^;\n]+;\s*(?:[^;\n]+;\s*)*boundary=["']?([^"'\n\s;]+)["']?/im,
    );

    if (boundaryMatch && boundaryMatch[1]) {
      const boundary = boundaryMatch[1].trim();
      const escaped = boundary.replace(/[$()*+.?[\\\]^{|}]/g, "\\$&");
      let parts: string[];
      try {
        parts = text.split(new RegExp(`\n--${escaped}(?:--)?(?=\n|$)`));
      } catch {
        parts = text.split(`\n--${boundary}`);
      }

      for (const part of parts) {
        if (!part.trim() || part.trim() === "--") continue;

        const divider = part.indexOf("\n\n");
        if (divider === -1) continue;

        const headers = part.slice(0, divider);
        const body = part.slice(divider + 2);

        const ctMatch = headers.match(/Content-Type:\s*([^\n;]+)/i);
        const ceMatch = headers.match(/Content-Transfer-Encoding:\s*(\S+)/i);
        const cidMatch = headers.match(/Content-ID:\s*<?([^>\n\s]+)>?/i);
        const dispMatch = headers.match(/Content-Disposition:\s*([^;\n]+)/i);
        const nameMatch = headers.match(/(?:filename\*?|name)=["']?([^"'\n;]+)["']?/i);

        const contentType = (ctMatch?.[1] ?? "").trim().toLowerCase();
        const encoding = (ceMatch?.[1] ?? "").trim().toLowerCase();
        const cid = cidMatch?.[1]?.trim().replace(/^<|>$/g, "");
        const disposition = (dispMatch?.[1] ?? "").trim().toLowerCase();
        const filename = nameMatch?.[1]?.trim().replace(/^["']|["']$/g, "") ?? "";

        if (contentType.startsWith("multipart/")) {
          // Recurse into nested multipart
          const sub = parseMime(headers + "\n\n" + body, depth + 1);
          if (sub.bodyText && !bodyText) bodyText = sub.bodyText;
          if (sub.bodyHtml && !bodyHtml) bodyHtml = sub.bodyHtml;
          for (const a of sub.attachments) attachments.push(a);
          sub.cidMap.forEach((v, k) => cidMap.set(k, v));
        } else if (contentType === "text/plain" && !bodyText && disposition !== "attachment") {
          let decoded = body.trim();
          if (encoding === "quoted-printable") decoded = decodeQuotedPrintable(decoded);
          else if (encoding === "base64") decoded = decodeBase64Safe(decoded);
          bodyText = decoded;
        } else if (contentType === "text/html" && !bodyHtml && disposition !== "attachment") {
          let decoded = body.trim();
          if (encoding === "quoted-printable") decoded = decodeQuotedPrintable(decoded);
          else if (encoding === "base64") decoded = decodeBase64Safe(decoded);
          bodyHtml = decoded;
        } else if (
          cid ||
          disposition === "attachment" ||
          disposition === "inline" ||
          contentType.startsWith("image/") ||
          contentType.startsWith("application/") ||
          contentType.startsWith("video/") ||
          contentType.startsWith("audio/")
        ) {
          // Binary attachment or inline image
          let rawBase64 = "";
          if (encoding === "base64") {
            rawBase64 = body.replace(/\s+/g, "");
          } else if (encoding === "quoted-printable") {
            try { rawBase64 = btoa(decodeQuotedPrintable(body.trim())); } catch { continue; }
          } else {
            try { rawBase64 = btoa(unescape(encodeURIComponent(body.trim()))); } catch { continue; }
          }

          if (!rawBase64) continue;

          const mimeType = contentType.split(";")[0].trim() || "application/octet-stream";
          const approxSize = Math.floor(rawBase64.length * 0.75);

          // Size cap: 4MB per attachment (~5.5MB base64)
          if (rawBase64.length > 5_500_000) {
            if (!cid) {
              attachments.push({ filename: filename || "pièce-jointe", mimeType, data: "", size: approxSize, tooLarge: true });
            }
            continue;
          }

          if (cid) {
            // Inline image: register in cidMap for HTML replacement
            cidMap.set(cid, `data:${mimeType};base64,${rawBase64}`);
          } else {
            // File attachment
            attachments.push({ filename: filename || "pièce-jointe", mimeType, data: rawBase64, size: approxSize });
          }
        }
      }
    } else {
      // Simple non-multipart email
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

    // Replace all CID references in HTML with data URIs
    if (bodyHtml && cidMap.size > 0) {
      cidMap.forEach((dataUri, cid) => {
        const escapedCid = cid.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        bodyHtml = bodyHtml.replace(new RegExp(`cid:<?${escapedCid}>?`, "gi"), dataUri);
      });
    }

    return { bodyText, bodyHtml, attachments, cidMap };
  } catch {
    return { bodyText: "", bodyHtml: "", attachments: [], cidMap: new Map() };
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
    let attachments: Attachment[] = [];

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
      attachments = parsed.attachments;
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
          body: JSON.stringify({ from, to, subject, bodyText, bodyHtml, messageId, inReplyTo, references, attachments }),
        });
      }
    } catch (err) {
      console.error("[KT Email Worker] Webhook failed:", err);
    }
  },
};
