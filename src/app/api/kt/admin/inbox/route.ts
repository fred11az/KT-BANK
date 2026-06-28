import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { send as sendEmail } from "@/lib/email/send";
import { bankAdminMessageEmail } from "@/lib/email/templates";

function auth(req: NextRequest) {
  const key = process.env.KT_ADMIN_KEY;
  return key && req.headers.get("Authorization") === `Bearer ${key}`;
}

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("kt_email_threads")
    .select("*, kt_email_messages(id, direction, from_email, to_email, subject, body_text, body_html, created_at)")
    .order("last_message_at", { ascending: false })
    .limit(50);
  if (error) return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  return NextResponse.json({ threads: data });
}

export async function PATCH(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const supabase = getSupabase();
  const body = await req.json();
  const { thread_id, status } = body;
  if (!thread_id) return NextResponse.json({ error: "thread_id requis" }, { status: 400 });

  const update: Record<string, unknown> = {};
  if (status !== undefined) update.status = status;
  else update.unread = false;

  await supabase.from("kt_email_threads").update(update).eq("id", thread_id);
  return NextResponse.json({ ok: true });
}

type AttachmentMeta = { url: string; name: string; type: string };

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const supabase = getSupabase();
  const { to, subject, body, body_html, thread_id, client_name, attachments } = await req.json() as {
    to: string; subject: string; body?: string; body_html?: string;
    thread_id?: string; client_name?: string;
    attachments?: AttachmentMeta[];
  };
  if (!to || !subject || (!body && !body_html))
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });

  // Append attachment section to HTML body for thread view display
  let storedHtml = body_html ?? null;
  if (attachments?.length) {
    const attSection = `<div data-attachments style="margin-top:12px;padding-top:10px;border-top:1px solid rgba(255,255,255,0.12);">`
      + attachments.map((a) => {
          const icon = a.type === "application/pdf" ? "📄" : a.type.startsWith("image/") ? "🖼️" : "📎";
          return `<a href="${a.url}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:5px;margin:3px 4px 3px 0;padding:4px 10px;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.15);border-radius:6px;font-size:12px;color:#4CAF82;text-decoration:none;">${icon} ${a.name}</a>`;
        }).join("")
      + `</div>`;
    storedHtml = (storedHtml ?? "") + attSection;
  }

  let threadId = thread_id;
  if (!threadId) {
    const { data: thread } = await supabase
      .from("kt_email_threads")
      .insert({
        subject,
        client_email: to,
        client_name: client_name ?? to.split("@")[0],
        status: "open",
        last_message_at: new Date().toISOString(),
      })
      .select("id")
      .single();
    threadId = thread?.id;
  } else {
    await supabase.from("kt_email_threads")
      .update({ last_message_at: new Date().toISOString(), unread: false })
      .eq("id", threadId);
  }

  if (threadId) {
    await supabase.from("kt_email_messages").insert({
      thread_id: threadId,
      direction: "outbound",
      from_email: "support@kt-bank-ag.com",
      to_email: to,
      subject,
      body_text: body ?? "",
      body_html: storedHtml,
    });
  }

  const { html } = bankAdminMessageEmail({ subject, body: body ?? "", body_html: storedHtml ?? undefined });
  const resendAttachments = attachments?.map((a) => ({ filename: a.name, path: a.url }));
  await sendEmail(to, subject, html, resendAttachments);

  return NextResponse.json({ ok: true });
}
