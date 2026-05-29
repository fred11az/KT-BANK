import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

function auth(req: NextRequest) {
  const key = process.env.KT_ADMIN_KEY;
  return key && req.headers.get("Authorization") === `Bearer ${key}`;
}

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const path = new URL(req.url).searchParams.get("path");
  if (!path) return NextResponse.json({ error: "path requis" }, { status: 400 });

  const admin = getSupabaseAdmin();
  const { data, error } = await admin.storage
    .from("kt-kyc-docs")
    .createSignedUrl(path, 300);

  if (error || !data?.signedUrl) {
    return NextResponse.json({ error: "Impossible de générer le lien" }, { status: 500 });
  }

  return NextResponse.json({ url: data.signedUrl });
}
