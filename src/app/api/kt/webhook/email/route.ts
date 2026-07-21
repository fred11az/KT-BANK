import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function POST(req: NextRequest) {
  const secret = process.env.CF_WEBHOOK_SECRET;
  if (secret && req.headers.get("x-webhook-secret") !== secret) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await req.json();
  const { from, to, subject, bodyText, bodyHtml, messageId, inReplyTo, attachments } = body;
  if (!from || !subject) return NextResponse.json({ error: "Données manquantes" }, { status: 400 });

  // Ignore Resend system emails (bounce/delivery notifications from send.kt-bank-ag.com)
  // and any auto-generated addresses — these are not real client messages
  if (
    from.includes("@send.kt-bank-ag.com") ||
    from.includes("@resend.dev") ||
    from.toLowerCase().startsWith("mailer-daemon") ||
    from.toLowerCase().startsWith("no-reply") ||
    from.toLowerCase().startsWith("noreply") ||
    from.toLowerCase().startsWith("postmaster")
  ) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const supabase = getSupabase();

  // Deduplication: skip if this message_id already processed
  if (messageId) {
    const { data: existing } = await supabase
      .from("kt_email_messages")
      .select("id")
      .eq("message_id", messageId)
      .maybeSingle();
    if (existing) return NextResponse.json({ ok: true, duplicate: true });
  }

  // Resolve body text — append file attachments as a marker so the inbox UI can display them
  const fileAttachments = Array.isArray(attachments) ? attachments.filter((a: { cid?: string }) => !a.cid) : [];
  const baseText = bodyText?.trim() || (bodyHtml ? stripHtml(bodyHtml) : "");
  const resolvedBody = fileAttachments.length > 0
    ? `${baseText}\n###KT_ATTACHMENTS###${JSON.stringify(fileAttachments)}`
    : baseText;

  // Find existing thread via In-Reply-To or by client email + subject
  let threadId: string | null = null;

  if (inReplyTo) {
    const { data: existing } = await supabase
      .from("kt_email_messages")
      .select("thread_id")
      .eq("message_id", inReplyTo)
      .single();
    if (existing) threadId = existing.thread_id;
  }

  // Also try to find an existing open thread from same sender
  if (!threadId) {
    const { data: existingThread } = await supabase
      .from("kt_email_threads")
      .select("id")
      .eq("client_email", from)
      .eq("status", "open")
      .eq("subject", subject)
      .maybeSingle();
    if (existingThread) threadId = existingThread.id;
  }

  if (!threadId) {
    const clientName = from.includes("<")
      ? from.split("<")[0].trim().replace(/"/g, "")
      : from.split("@")[0];
    // The KT system address this client wrote to (groups replies by mailbox).
    const toRaw = String(to ?? "");
    const toMatch = toRaw.match(/<([^>]+)>/);
    const systemEmail = (toMatch ? toMatch[1] : toRaw).trim().toLowerCase() || "support@kt-bank-ag.com";
    const { data: thread } = await supabase
      .from("kt_email_threads")
      .insert({ subject, client_email: from, client_name: clientName, status: "open", unread: true, system_email: systemEmail })
      .select("id").single();
    threadId = thread?.id ?? null;
  }

  if (!threadId) return NextResponse.json({ error: "Erreur thread" }, { status: 500 });

  await supabase.from("kt_email_messages").insert({
    thread_id: threadId, direction: "inbound",
    from_email: from, to_email: to ?? "support@kt-bank-ag.com",
    subject, body_text: resolvedBody, body_html: bodyHtml ?? null,
    message_id: messageId ?? null, in_reply_to: inReplyTo ?? null,
  });

  await supabase.from("kt_email_threads").update({
    last_message_at: new Date().toISOString(),
    unread: true,
  }).eq("id", threadId);

  return NextResponse.json({ ok: true });
}
