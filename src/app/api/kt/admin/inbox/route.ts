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
  const threadId = new URL(req.url).searchParams.get("thread_id");

  // Single-thread mode: full messages for the currently open conversation only.
  if (threadId) {
    const { data } = await supabase
      .from("kt_email_threads")
      .select("*, kt_email_messages(id, direction, from_email, to_email, subject, body_text, body_html, created_at)")
      .eq("id", threadId)
      .single();
    return NextResponse.json({ thread: data ?? null });
  }

  // Lightweight list: thread metadata only (no message bodies) — keeps the
  // polling payload small so it doesn't slow the app / saturate the DB.
  const mailbox = new URL(req.url).searchParams.get("mailbox");
  let listQ = supabase
    .from("kt_email_threads")
    .select("id, subject, client_email, client_name, status, unread, message_count, last_message_at, system_email")
    .order("last_message_at", { ascending: false })
    .limit(50);
  if (mailbox) listQ = listQ.eq("system_email", mailbox);
  const { data, error } = await listQ;
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
  const { to, subject, body, body_html, thread_id, client_name, attachments, raw, from_email } = await req.json() as {
    to: string; subject: string; body?: string; body_html?: string;
    thread_id?: string; client_name?: string;
    attachments?: AttachmentMeta[];
    raw?: boolean;   // when true, body_html is a complete email — send it verbatim
    from_email?: string;  // chosen system sender address
  };
  if (!to || !subject || (!body && !body_html))
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });

  // Resolve the chosen sender against active identities (security: only known
  // addresses may be used as From). Falls back to the default support mailbox.
  let senderEmail = "support@kt-bank-ag.com";
  let fromHeader: string | undefined;
  if (from_email) {
    const { data: ident } = await supabase
      .from("kt_sender_identities")
      .select("email, label, active")
      .eq("email", String(from_email).toLowerCase())
      .maybeSingle();
    if (ident?.active) {
      senderEmail = ident.email;
      fromHeader = `${ident.label} <${ident.email}>`;
    }
  }

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
        system_email: senderEmail,
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
      from_email: senderEmail,
      to_email: to,
      subject,
      body_text: body ?? "",
      body_html: storedHtml,
    });
  }

  // Raw mode: the admin pasted a complete HTML email → send it exactly as-is,
  // without wrapping it in the bank template (which would nest <html>/<body>).
  const emailHtml = raw && body_html
    ? body_html
    : bankAdminMessageEmail({ subject, body: body ?? "", body_html: storedHtml ?? undefined }).html;
  const resendAttachments = attachments?.map((a) => ({ filename: a.name, path: a.url }));
  await sendEmail(to, subject, emailHtml, resendAttachments, fromHeader);

  return NextResponse.json({ ok: true });
}

// Delete a single message (?message_id=) or a whole thread (?thread_id=).
// Only removes the local inbox record — the already-sent email is not recalled.
export async function DELETE(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const supabase = getSupabase();
  const url = new URL(req.url);
  const messageId = url.searchParams.get("message_id");
  const threadId = url.searchParams.get("thread_id");

  if (messageId) {
    await supabase.from("kt_email_messages").delete().eq("id", messageId);
    return NextResponse.json({ ok: true });
  }
  if (threadId) {
    await supabase.from("kt_email_messages").delete().eq("thread_id", threadId);
    await supabase.from("kt_email_threads").delete().eq("id", threadId);
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "message_id ou thread_id requis" }, { status: 400 });
}
