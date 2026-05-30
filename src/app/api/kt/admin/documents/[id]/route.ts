import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

function auth(req: NextRequest) {
  const key = process.env.KT_ADMIN_KEY;
  return key && req.headers.get("Authorization") === `Bearer ${key}`;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!auth(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const { status, notes, table } = body as { status: string; notes?: string; table?: string };

  const supabase = getSupabaseAdmin();
  const targetTable = table === "submission" ? "kt_client_submissions" : "kt_documents";

  await supabase.from(targetTable).update({
    status,
    ...(notes !== undefined ? { notes } : {}),
  }).eq("id", id);

  return NextResponse.json({ ok: true });
}
