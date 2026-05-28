import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { send as sendEmail } from "@/lib/email/send";

function auth(req: NextRequest) {
  const key = process.env.KT_ADMIN_KEY;
  return key && req.headers.get("Authorization") === `Bearer ${key}`;
}

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("kt_email_threads")
    .select("*, kt_email_messages(id, direction, from_email, to_email, subject, body_text, created_at)")
    .order("last_message_at", { ascending: false })
    .limit(50);
  if (error) return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  return NextResponse.json({ threads: data });
}

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const supabase = getSupabase();
  const { to, subject, body, thread_id } = await req.json();
  if (!to || !subject || !body) return NextResponse.json({ error: "Champs manquants" }, { status: 400 });

  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "support@kt-bank-ag.com";
  const fromClean = fromEmail.includes("<") ? fromEmail.match(/<(.+)>/)?.[1] ?? fromEmail : fromEmail;

  let threadId = thread_id;
  if (!threadId) {
    const { data: thread } = await supabase.from("kt_email_threads")
      .insert({ subject, client_email: to, status: "open", last_message_at: new Date().toISOString() })
      .select("id").single();
    threadId = thread?.id;
  }

  if (threadId) {
    await supabase.from("kt_email_messages").insert({
      thread_id: threadId, direction: "outbound",
      from_email: fromClean, to_email: to, subject, body_text: body,
    });
    await supabase.from("kt_email_threads").update({
      last_message_at: new Date().toISOString(),
      unread: false,
      message_count: supabase.rpc ? undefined : undefined,
    }).eq("id", threadId);
  }

  await sendEmail(to, subject, `<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#333;">${body.replace(/\n/g, "<br/>")}</div>`);

  return NextResponse.json({ ok: true });
}
