import { NextRequest, NextResponse } from "next/server";
import { getSupabase, getSupabaseAdmin } from "@/lib/supabase";

async function getSessionEmail(req: NextRequest): Promise<string | null> {
  const auth = req.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  const token = auth.slice(7);
  const supabase = getSupabase();
  const { data } = await supabase
    .from("kt_sessions")
    .select("email")
    .eq("token", token)
    .gt("expires_at", new Date().toISOString())
    .single();
  return data?.email ?? null;
}

export async function POST(req: NextRequest) {
  const email = await getSessionEmail(req);
  if (!email) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const transfer_id = formData.get("transfer_id") as string | null;
  const payment_reference = formData.get("payment_reference") as string | null;

  if (!transfer_id) return NextResponse.json({ error: "transfer_id requis" }, { status: 400 });

  const supabase = getSupabase();
  const admin = getSupabaseAdmin();

  // Verify the transfer belongs to this client
  const { data: profile } = await supabase
    .from("kt_profiles")
    .select("id")
    .eq("email", email)
    .single();

  if (!profile) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

  const { data: transfer } = await supabase
    .from("kt_transfer_requests")
    .select("id, status")
    .eq("id", transfer_id)
    .eq("profile_id", profile.id)
    .single();

  if (!transfer) return NextResponse.json({ error: "Virement introuvable" }, { status: 404 });

  let proofUrl: string | null = null;

  if (file && file.size > 0) {
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${transfer_id}/${Date.now()}.${ext}`;
    const bytes = await file.arrayBuffer();
    const { error: uploadError } = await admin.storage
      .from("transfer-proofs")
      .upload(path, bytes, { contentType: file.type, upsert: true });

    if (uploadError) {
      console.error("[proof upload]", uploadError);
      return NextResponse.json({ error: "Erreur upload" }, { status: 500 });
    }
    proofUrl = path;
  }

  const update: Record<string, string> = { status: "processing", fee_paid: "true" };
  if (proofUrl) update.payment_proof_url = proofUrl;
  if (payment_reference) update.payment_reference = payment_reference;

  await admin
    .from("kt_transfer_requests")
    .update(update)
    .eq("id", transfer_id);

  return NextResponse.json({ ok: true });
}
