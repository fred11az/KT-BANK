import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const secret = process.env.CF_WEBHOOK_SECRET;
  if (secret && req.headers.get("x-webhook-secret") !== secret) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await req.json();
  const { from, to, subject, bodyText, bodyHtml, messageId, inReplyTo } = body;
  if (!from || !subject) return NextResponse.json({ error: "Données manquantes" }, { status: 400 });

  const supabase = getSupabase();

  // Find existing thread via In-Reply-To or create new
  let threadId: string | null = null;

  if (inReplyTo) {
    const { data: existing } = await supabase
      .from("kt_email_messages")
      .select("thread_id")
      .eq("message_id", inReplyTo)
      .single();
    if (existing) threadId = existing.thread_id;
  }

  if (!threadId) {
    const clientName = from.includes("<")
      ? from.split("<")[0].trim()
      : from.split("@")[0];
    const { data: thread } = await supabase
      .from("kt_email_threads")
      .insert({ subject, client_email: from, client_name: clientName, status: "open", unread: true })
      .select("id").single();
    threadId = thread?.id ?? null;
  }

  if (!threadId) return NextResponse.json({ error: "Erreur thread" }, { status: 500 });

  await supabase.from("kt_email_messages").insert({
    thread_id: threadId, direction: "inbound",
    from_email: from, to_email: to ?? "support@kt-bank-ag.com",
    subject, body_text: bodyText, body_html: bodyHtml,
    message_id: messageId, in_reply_to: inReplyTo,
  });

  await supabase.from("kt_email_threads").update({
    last_message_at: new Date().toISOString(),
    unread: true,
  }).eq("id", threadId);

  return NextResponse.json({ ok: true });
}
