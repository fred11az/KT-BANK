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
  SEND_EMAIL: {
    send: (msg: {
      from: string;
      to: string;
      subject: string;
      text?: string;
      html?: string;
    }) => Promise<void>;
  };
}

interface EmailMessage {
  from: string;
  to: string;
  headers: Map<string, string>;
  raw: ReadableStream;
  forward: (address: string) => Promise<void>;
  reply: (msg: { subject: string; text?: string; html?: string }) => Promise<void>;
}

export default {
  async email(message: EmailMessage, env: Env, _ctx: ExecutionContext) {
    const from = message.from;
    const to = message.to;
    const subject = message.headers.get("subject") ?? "(sans objet)";
    const messageId = message.headers.get("message-id") ?? undefined;
    const inReplyTo = message.headers.get("in-reply-to") ?? undefined;
    const references = message.headers.get("references") ?? undefined;

    // Read raw body (text)
    let bodyText = "";
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
      // Extract plain text body (basic MIME parsing)
      const textMatch = raw.match(/Content-Type: text\/plain[\s\S]*?\r?\n\r?\n([\s\S]*?)(?:\r?\n--|\s*$)/i);
      bodyText = textMatch ? textMatch[1].trim() : raw.slice(raw.lastIndexOf("\r\n\r\n") + 4).trim();
    } catch {
      bodyText = "(contenu non lisible)";
    }

    // Store in Next.js app via webhook
    try {
      await fetch(env.WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-webhook-secret": env.WEBHOOK_SECRET,
        },
        body: JSON.stringify({
          from,
          to,
          subject,
          bodyText,
          messageId,
          inReplyTo,
          references,
        }),
      });
    } catch (err) {
      console.error("[KT Email Worker] Webhook failed:", err);
    }

    // Auto-forward backup to Gmail
    try {
      await message.forward("KTBANKAGDE@GMAIL.COM");
    } catch {
      // Non-blocking
    }
  },
};
