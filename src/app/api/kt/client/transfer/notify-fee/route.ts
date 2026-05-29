import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { sendTransferPendingFee } from "@/lib/email/send";

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

  const { transfer_id } = await req.json();
  if (!transfer_id) return NextResponse.json({ error: "transfer_id requis" }, { status: 400 });

  const supabase = getSupabase();

  const { data: profile } = await supabase
    .from("kt_profiles")
    .select("id, prenom, lang, custom_fee, custom_fee_payment")
    .eq("email", email)
    .single();
  if (!profile) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

  const { data: transfer } = await supabase
    .from("kt_transfer_requests")
    .select("id, status, amount, to_name, to_iban, fee_amount, reference")
    .eq("id", transfer_id)
    .eq("profile_id", profile.id)
    .single();

  // Only send if still waiting for fee payment
  if (!transfer || transfer.status !== "pending_fee") {
    return NextResponse.json({ ok: true, skipped: true });
  }

  let feePayment = profile.custom_fee_payment as Record<string, string> | null;
  if (!feePayment) {
    const { data: payRow } = await supabase.from("kt_settings").select("value").eq("key", "fee_payment").single();
    feePayment = payRow?.value ?? { name: "KT Bank AG", iban: "DE89370400440532013000", bic: "KTAGDEFF" };
  }

  await sendTransferPendingFee(email, {
    prenom: profile.prenom ?? "Client",
    amount: Number(transfer.amount),
    currency: "EUR",
    to_name: transfer.to_name,
    to_iban: transfer.to_iban,
    reference: transfer.reference ?? undefined,
    fee_amount: Number(transfer.fee_amount),
    fee_currency: "EUR",
    fee_payment: feePayment as Record<string, string>,
    transfer_id: transfer.id,
    lang: (profile.lang as "de" | "fr") ?? "de",
  });

  return NextResponse.json({ ok: true });
}
