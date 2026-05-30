import { NextRequest, NextResponse } from "next/server";
import { getSupabase, getSupabaseAdmin } from "@/lib/supabase";

const BUCKET = "client-docs";
const MAX_MB = 20;
const ALLOWED = new Set([
  "image/jpeg", "image/png", "image/gif", "image/webp",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);

async function getClientId(req: NextRequest): Promise<string | null> {
  const auth = req.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  const token = auth.slice(7);
  const supabase = getSupabase();
  const { data: session } = await supabase
    .from("kt_sessions").select("email")
    .eq("token", token).gt("expires_at", new Date().toISOString()).single();
  if (!session?.email) return null;
  const { data: profile } = await supabase.from("kt_profiles").select("id").eq("email", session.email).single();
  return profile?.id ?? null;
}

export async function POST(req: NextRequest) {
  const clientId = await getClientId(req);
  if (!clientId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const type = formData.get("type") as string | null;
  const title = formData.get("title") as string | null;

  if (!file || !type || !title)
    return NextResponse.json({ error: "Fehlende Felder" }, { status: 400 });

  if (!ALLOWED.has(file.type))
    return NextResponse.json({ error: "Dateityp nicht erlaubt" }, { status: 400 });

  if (file.size > MAX_MB * 1024 * 1024)
    return NextResponse.json({ error: `Datei zu groß (max ${MAX_MB} MB)` }, { status: 400 });

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const path = `${clientId}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;

  const supabase = getSupabaseAdmin();
  const bytes = await file.arrayBuffer();

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, bytes, { contentType: file.type, upsert: false });

  if (uploadError) {
    console.error("[docs/submit upload]", uploadError);
    return NextResponse.json({ error: "Upload fehlgeschlagen" }, { status: 500 });
  }

  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path);

  const { error: dbError } = await supabase.from("kt_client_submissions").insert({
    client_id: clientId,
    type,
    title,
    file_url: publicUrl,
    file_name: file.name,
    file_size: file.size,
    status: "pending",
  });

  if (dbError) {
    console.error("[docs/submit db]", dbError);
    return NextResponse.json({ error: "Datenbankfehler" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
