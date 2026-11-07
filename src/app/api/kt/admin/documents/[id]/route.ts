import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { adminGuard } from "@/lib/adminAuth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await adminGuard(req);
  if (denied) return denied;
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
