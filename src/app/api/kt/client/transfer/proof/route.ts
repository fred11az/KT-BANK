import { NextRequest, NextResponse } from "next/server";
import { getSupabase, getSupabaseAdmin } from "@/lib/supabase";
import { sendAdminTransferFee, sendTransferStatus } from "@/lib/email/send";

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

  // Fetch profile + transfer details for admin notification
  const { data: profile } = await supabase
    .from("kt_profiles")
    .select("id, prenom, nom, email")
    .eq("email", email)
    .single();

  if (!profile) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

  const { data: transfer } = await supabase
    .from("kt_transfer_requests")
    .select("id, status, amount, to_name, to_iban, fee_amount, reference")
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

  const update: Record<string, unknown> = { status: "processing", fee_paid: true };
  if (proofUrl) update.payment_proof_url = proofUrl;
  if (payment_reference) update.payment_reference = payment_reference;

  await admin
    .from("kt_transfer_requests")
    .update(update)
    .eq("id", transfer_id);

  // Notify admin
  await sendAdminTransferFee({
    prenom: profile.prenom ?? "",
    nom: profile.nom ?? "",
    email: profile.email,
    amount: Number(transfer.amount),
    to_name: transfer.to_name,
    to_iban: transfer.to_iban,
    fee_amount: Number(transfer.fee_amount),
    reference: transfer.reference ?? undefined,
    payment_reference: payment_reference ?? undefined,
    transfer_id,
  });

  // Notify client: transfer is now processing, 48h delay
  const { data: profileFull } = await supabase
    .from("kt_profiles")
    .select("lang")
    .eq("id", profile.id)
    .single();

  await sendTransferStatus(profile.email, {
    prenom: profile.prenom ?? "Client",
    status: "processing",
    amount: Number(transfer.amount),
    currency: "EUR",
    to_name: transfer.to_name,
    reference: transfer.reference ?? undefined,
    lang: (profileFull?.lang as "de" | "fr") ?? "de",
  });

  return NextResponse.json({ ok: true });
}
