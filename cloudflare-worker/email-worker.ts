/**
 * KT Bank – Cloudflare Email Worker
 *
 * Déploiement :
 *   cd cloudflare-worker && npx wrangler deploy
 *
 * Variables à configurer dans Cloudflare Dashboard → Worker → Settings → Variables :
 *   WEBHOOK_URL    = https://kt-bank-ag.com/api/kt/webhook/email
 *   WEBHOOK_SECRET = (même valeur que CF_WEBHOOK_SECRET dans Vercel)
 *   RESEND_API_KEY = re_xxxxxxx  ← AJOUTER cette clé (même que dans Vercel)
 *
 * Email Routing dans Cloudflare :
 *   support@kt-bank-ag.com → ce Worker
 *   contact@kt-bank-ag.com → ce Worker
 */

interface Env {
  WEBHOOK_URL: string;
  WEBHOOK_SECRET: string;
  RESEND_API_KEY: string;
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
  data: string;
  size: number;
  tooLarge?: boolean;
}

// Decode RFC 2047 encoded email headers (e.g. =?UTF-8?Q?...?= or =?UTF-8?B?...?=)
function decodeRfc2047(str: string): string {
  if (!str) return str;
  return str.replace(/=\?([^?]+)\?([BbQq])\?([^?=]*)\?=/g, (match, charset: string, encoding: string, text: string) => {
    try {
      if (encoding.toUpperCase() === "Q") {
        const unescaped = text.replace(/_/g, " ").replace(/=([0-9A-Fa-f]{2})/g, (_: string, h: string) => String.fromCharCode(parseInt(h, 16)));
        return new TextDecoder(charset.toLowerCase()).decode(new Uint8Array([...unescaped].map((c: string) => c.charCodeAt(0))));
      } else {
        const bin = atob(text.replace(/\s+/g, ""));
        return new TextDecoder(charset.toLowerCase()).decode(new Uint8Array([...bin].map((c: string) => c.charCodeAt(0))));
      }
    } catch {
      return match;
    }
  });
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

// Parse MIME email. CID images are stored in cidMap (not embedded in bodyHtml).
// bodyHtml is returned raw (with original cid: refs) to keep the webhook payload small.
function parseMime(
  raw: string,
  depth = 0,
): { bodyText: string; bodyHtml: string; attachments: Attachment[]; cidMap: Map<string, { data: string; mimeType: string }> } {
  if (depth > 5) return { bodyText: "", bodyHtml: "", attachments: [], cidMap: new Map() };

  try {
    const text = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

    let bodyText = "";
    let bodyHtml = "";
    const attachments: Attachment[] = [];
    const cidMap = new Map<string, { data: string; mimeType: string }>();

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

        const ctMatch   = headers.match(/Content-Type:\s*([^\n;]+)/i);
        const ceMatch   = headers.match(/Content-Transfer-Encoding:\s*(\S+)/i);
        const cidMatch  = headers.match(/Content-ID:\s*<?([^>\n\s]+)>?/i);
        const dispMatch = headers.match(/Content-Disposition:\s*([^;\n]+)/i);
        const nameMatch = headers.match(/(?:filename\*?|name)=["']?([^"'\n;]+)["']?/i);

        const contentType = (ctMatch?.[1] ?? "").trim().toLowerCase();
        const encoding    = (ceMatch?.[1] ?? "").trim().toLowerCase();
        const cid         = cidMatch?.[1]?.trim().replace(/^<|>$/g, "");
        const disposition = (dispMatch?.[1] ?? "").trim().toLowerCase();
        const filename    = nameMatch?.[1]?.trim().replace(/^["']|["']$/g, "") ?? "";

        if (contentType.startsWith("multipart/")) {
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
          let rawBase64 = "";
          if (encoding === "base64") {
            rawBase64 = body.replace(/\s+/g, "");
          } else if (encoding === "quoted-printable") {
            try { rawBase64 = btoa(decodeQuotedPrintable(body.trim())); } catch { continue; }
          } else {
            try { rawBase64 = btoa(unescape(encodeURIComponent(body.trim()))); } catch { continue; }
          }

          if (!rawBase64) continue;

          const mimeType   = contentType.split(";")[0].trim() || "application/octet-stream";
          const approxSize = Math.floor(rawBase64.length * 0.75);

          // Limit: 4 MB per attachment (~5.5 MB base64)
          if (rawBase64.length > 5_500_000) {
            attachments.push({ filename: filename || "pièce-jointe", mimeType, data: "", size: approxSize, tooLarge: true });
            continue;
          }

          if (cid) {
            // Inline image — store in cidMap, will be sent as attachment to Gmail
            cidMap.set(cid, { data: rawBase64, mimeType });
          } else {
            attachments.push({ filename: filename || "pièce-jointe", mimeType, data: rawBase64, size: approxSize });
          }
        }
      }
    } else {
      const split = text.indexOf("\n\n");
      if (split !== -1) {
        const headers = text.slice(0, split);
        const body    = text.slice(split + 2).trim();
        const ceMatch = headers.match(/Content-Transfer-Encoding:\s*(\S+)/i);
        const encoding = (ceMatch?.[1] ?? "").trim().toLowerCase();
        if (encoding === "quoted-printable") bodyText = decodeQuotedPrintable(body);
        else if (encoding === "base64") bodyText = decodeBase64Safe(body);
        else bodyText = body;
      }
    }

    return { bodyText, bodyHtml, attachments, cidMap };
  } catch {
    return { bodyText: "", bodyHtml: "", attachments: [], cidMap: new Map() };
  }
}

/* ── Forward vers Gmail via Resend ──
 * Images inline et fichiers joints sont envoyés comme pièces jointes classiques.
 * Gmail bloque les data URIs dans le HTML, donc on n'intègre rien dans le body.
 */
async function forwardViaResend(
  env: Env,
  from: string,
  subject: string,
  bodyHtml: string,
  bodyText: string,
  attachments: Attachment[],
  cidMap: Map<string, { data: string; mimeType: string }>,
): Promise<void> {
  if (!env.RESEND_API_KEY) return;

  const header = `
    <div style="background:#f4f4f4;border-left:4px solid #005F2D;padding:12px 16px;
                margin-bottom:20px;border-radius:4px;font-family:sans-serif;font-size:13px;color:#333;">
      <strong>📧 Nouveau message client reçu</strong><br>
      <strong>De :</strong> ${from}<br>
      <strong>Objet :</strong> ${subject}
    </div>
  `;

  // Clean bodyHtml: remove unresolvable cid: src refs
  const cleanHtml = bodyHtml
    ? bodyHtml.replace(/src=["']cid:[^"']*["']/gi, 'src=""')
    : "";

  const htmlBody = cleanHtml
    ? `${header}${cleanHtml}`
    : `${header}<pre style="font-family:sans-serif;font-size:14px;white-space:pre-wrap;">${bodyText}</pre>`;

  // Collect all attachments for Gmail:
  // 1) Inline CID images → send as regular attachments
  // 2) Regular file attachments
  const resendAttachments: { filename: string; content: string }[] = [];

  let imgIndex = 1;
  cidMap.forEach(({ data, mimeType }, _cid) => {
    const ext = mimeType.split("/")[1]?.replace(/[^a-z0-9]/g, "") || "jpg";
    resendAttachments.push({ filename: `image-${imgIndex++}.${ext}`, content: data });
  });

  for (const a of attachments) {
    if (a.data && !a.tooLarge) {
      resendAttachments.push({ filename: a.filename, content: a.data });
    }
  }

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "KT Bank Inbox <support@kt-bank-ag.com>",
      to: ["KTBANKAGDE@GMAIL.COM"],
      subject: `[Message client] ${from}: ${subject}`,
      html: htmlBody,
      ...(resendAttachments.length > 0 ? { attachments: resendAttachments } : {}),
    }),
  });
}

export default {
  async email(message: EmailMessage, env: Env, _ctx: ExecutionContext) {
    const from       = message.from ?? "";
    const to         = message.to ?? "";
    // Decode RFC 2047 encoded subject (e.g. =?UTF-8?Q?...?=)
    const subject    = decodeRfc2047(message.headers.get("subject") ?? "(sans objet)");
    const messageId  = message.headers.get("message-id") ?? undefined;
    const inReplyTo  = message.headers.get("in-reply-to") ?? undefined;
    const references = message.headers.get("references") ?? undefined;

    let bodyText  = "";
    let bodyHtml  = "";
    let attachments: Attachment[] = [];
    let cidMap = new Map<string, { data: string; mimeType: string }>();

    try {
      const reader  = message.raw.getReader();
      const decoder = new TextDecoder();
      const chunks: string[] = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) chunks.push(decoder.decode(value, { stream: true }));
      }
      const raw    = chunks.join("");
      const parsed = parseMime(raw);
      bodyText     = parsed.bodyText;
      bodyHtml     = parsed.bodyHtml;   // raw HTML — no embedded data URIs
      attachments  = parsed.attachments;
      cidMap       = parsed.cidMap;
    } catch (err) {
      console.error("[KT Email Worker] MIME parse error:", err);
    }

    // ── 1. Forward vers Gmail via Resend (images + fichiers en pièces jointes) ──
    try {
      await forwardViaResend(env, from, subject, bodyHtml, bodyText, attachments, cidMap);
    } catch (err) {
      console.error("[KT Email Worker] Resend forward failed:", err);
    }

    // ── 2. Webhook → base de données KT Bank ──
    // bodyHtml is raw (no data URIs) — payload stays small and fits Vercel's body limit
    try {
      const webhookUrl = env.WEBHOOK_URL;
      const secret     = env.WEBHOOK_SECRET ?? "";
      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-webhook-secret": secret,
          },
          body: JSON.stringify({
            from, to, subject, bodyText, bodyHtml,
            messageId, inReplyTo, references, attachments,
          }),
        });
      }
    } catch (err) {
      console.error("[KT Email Worker] Webhook failed:", err);
    }
  },
};
