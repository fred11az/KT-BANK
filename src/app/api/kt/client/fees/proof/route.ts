import { NextRequest, NextResponse } from "next/server";
import { getSupabase, getSupabaseAdmin } from "@/lib/supabase";
import { sendAdminTransferFee } from "@/lib/email/send";

async function getProfile(req: NextRequest) {
  const auth = req.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  const token = auth.slice(7);
  const supabase = getSupabase();
  const { data: session } = await supabase
    .from("kt_sessions")
    .select("email")
    .eq("token", token)
    .gt("expires_at", new Date().toISOString())
    .single();
  if (!session?.email) return null;
  const { data: profile } = await supabase
    .from("kt_profiles")
    .select("id, prenom, nom, email")
    .eq("email", session.email)
    .single();
  return profile ?? null;
}

// Client submits a proof of payment for a fee invoice
export async function POST(req: NextRequest) {
  const profile = await getProfile(req);
  if (!profile) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const invoice_id = formData.get("invoice_id") as string | null;
  const method = (formData.get("method") as string | null) ?? null;
  const reference = (formData.get("reference") as string | null) ?? null;

  if (!invoice_id) return NextResponse.json({ error: "invoice_id requis" }, { status: 400 });

  const admin = getSupabaseAdmin();

  const { data: invoice } = await admin
    .from("kt_fee_invoices")
    .select("id, amount, currency, title")
    .eq("id", invoice_id)
    .eq("profile_id", profile.id)
    .single();
  if (!invoice) return NextResponse.json({ error: "Rechnung nicht gefunden" }, { status: 404 });

  let proofUrl: string | null = null;
  if (file && file.size > 0) {
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `fees/${invoice_id}/${Date.now()}.${ext}`;
    const bytes = await file.arrayBuffer();
    const { error: uploadError } = await admin.storage
      .from("transfer-proofs")
      .upload(path, bytes, { contentType: file.type, upsert: true });
    if (uploadError) {
      console.error("[fee proof upload]", uploadError);
      return NextResponse.json({ error: "Upload fehlgeschlagen" }, { status: 500 });
    }
    proofUrl = path;
  } else {
    return NextResponse.json({ error: "Beleg erforderlich" }, { status: 400 });
  }

  await admin
    .from("kt_fee_invoices")
    .update({
      status: "proof_submitted",
      proof_url: proofUrl,
      proof_reference: reference,
      proof_method: method,
      proof_submitted_at: new Date().toISOString(),
    })
    .eq("id", invoice_id);

  // Notify the bank that a fee proof was submitted (reuses the existing admin alert)
  try {
    await sendAdminTransferFee({
      prenom: profile.prenom ?? "",
      nom: profile.nom ?? "",
      email: profile.email,
      amount: Number(invoice.amount),
      to_name: invoice.title || "Frais",
      to_iban: "—",
      fee_amount: Number(invoice.amount),
      reference: reference ?? undefined,
      payment_reference: method ?? undefined,
      transfer_id: invoice_id,
    });
  } catch (e) {
    console.error("[fee proof admin email]", e);
  }

  return NextResponse.json({ ok: true });
}
