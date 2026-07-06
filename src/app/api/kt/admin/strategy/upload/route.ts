import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

const BUCKET = "admin-strategy";
const MAX_MB = 25;
const ALLOWED_PREFIX = ["image/", "audio/", "video/"];
const ALLOWED_EXACT = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "text/plain",
]);

function auth(req: NextRequest) {
  const key = process.env.KT_ADMIN_KEY;
  return key && req.headers.get("Authorization") === `Bearer ${key}`;
}

async function ensureBucket() {
  const admin = getSupabaseAdmin();
  // Idempotent: createBucket errors if it already exists — ignore that.
  const { error } = await admin.storage.createBucket(BUCKET, { public: false, fileSizeLimit: `${MAX_MB}MB` });
  if (error && !/exist/i.test(error.message)) console.error("[strategy bucket]", error);
}

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });

  const mime = file.type || "application/octet-stream";
  const ok = ALLOWED_PREFIX.some((p) => mime.startsWith(p)) || ALLOWED_EXACT.has(mime);
  if (!ok) return NextResponse.json({ error: "Type non autorisé" }, { status: 400 });
  if (file.size > MAX_MB * 1024 * 1024)
    return NextResponse.json({ error: `Fichier trop volumineux (max ${MAX_MB} Mo)` }, { status: 400 });

  await ensureBucket();

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const admin = getSupabaseAdmin();
  const bytes = await file.arrayBuffer();
  const { error } = await admin.storage.from(BUCKET).upload(path, bytes, { contentType: mime, upsert: false });
  if (error) {
    console.error("[strategy upload]", error);
    return NextResponse.json({ error: "Upload échoué", detail: error.message }, { status: 500 });
  }

  return NextResponse.json({ path, name: file.name, mime });
}
