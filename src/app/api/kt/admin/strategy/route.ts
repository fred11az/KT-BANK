import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

const BUCKET = "admin-strategy";
const SIGNED_TTL = 3600; // 1h

function auth(req: NextRequest) {
  const key = process.env.KT_ADMIN_KEY;
  return key && req.headers.get("Authorization") === `Bearer ${key}`;
}

type Row = {
  id: string; code_name: string; kind: string; body: string | null;
  media_path: string | null; media_name: string | null; media_mime: string | null;
  duration_ms: number | null; created_at: string;
};

// List messages (oldest → newest) with fresh signed media URLs.
export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const admin = getSupabaseAdmin();

  const sinceId = new URL(req.url).searchParams.get("since"); // optional: only newer than a created_at
  let q = admin
    .from("kt_admin_chat")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(300);
  if (sinceId) q = q.gt("created_at", sinceId);

  const { data, error } = await q;
  if (error) return NextResponse.json({ error: "Erreur serveur", detail: error.message }, { status: 500 });

  const rows = (data ?? []) as Row[];
  const withMedia = rows.filter((r) => r.media_path);
  const signed: Record<string, string> = {};
  if (withMedia.length) {
    const { data: urls } = await admin.storage
      .from(BUCKET)
      .createSignedUrls(withMedia.map((r) => r.media_path as string), SIGNED_TTL);
    (urls ?? []).forEach((u, i) => {
      if (u.signedUrl) signed[withMedia[i].media_path as string] = u.signedUrl;
    });
  }

  const messages = rows.map((r) => ({
    ...r,
    media_url: r.media_path ? (signed[r.media_path] ?? null) : null,
  }));

  return NextResponse.json({ messages });
}

// Post a message (text, image, file or voice note).
export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const admin = getSupabaseAdmin();
  const body = await req.json().catch(() => ({}));
  const { code_name, kind, body: text, media_path, media_name, media_mime, duration_ms } = body as Record<string, unknown>;

  if (!code_name) return NextResponse.json({ error: "code_name requis" }, { status: 400 });
  if (!text && !media_path) return NextResponse.json({ error: "Message vide" }, { status: 400 });

  const { data, error } = await admin
    .from("kt_admin_chat")
    .insert({
      code_name,
      kind: (kind as string) || "text",
      body: (text as string) ?? null,
      media_path: (media_path as string) ?? null,
      media_name: (media_name as string) ?? null,
      media_mime: (media_mime as string) ?? null,
      duration_ms: typeof duration_ms === "number" ? duration_ms : null,
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: "Envoi échoué", detail: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, id: data?.id });
}

// Delete a message (and its media file).
export async function DELETE(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const admin = getSupabaseAdmin();
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id requis" }, { status: 400 });

  const { data: row } = await admin.from("kt_admin_chat").select("media_path").eq("id", id).single();
  if (row?.media_path) {
    try { await admin.storage.from(BUCKET).remove([row.media_path as string]); } catch { /* ignore */ }
  }
  await admin.from("kt_admin_chat").delete().eq("id", id);
  return NextResponse.json({ ok: true });
}
