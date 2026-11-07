import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { adminGuard } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  const denied = await adminGuard(req);
  if (denied) return denied;

  const path = new URL(req.url).searchParams.get("path");
  if (!path) return NextResponse.json({ error: "path requis" }, { status: 400 });

  const admin = getSupabaseAdmin();
  const { data, error } = await admin.storage
    .from("transfer-proofs")
    .createSignedUrl(path, 300); // 5 min expiry

  if (error || !data?.signedUrl) {
    return NextResponse.json({ error: "Impossible de générer le lien" }, { status: 500 });
  }

  return NextResponse.json({ url: data.signedUrl });
}
