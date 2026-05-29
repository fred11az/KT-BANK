import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { sendTransferStatus, sendTransferPendingFee } from "@/lib/email/send";

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

export async function GET(req: NextRequest) {
  const email = await getSessionEmail(req);
  if (!email) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const transferId = new URL(req.url).searchParams.get("id");
  if (!transferId) return NextResponse.json({ error: "id requis" }, { status: 400 });

  const supabase = getSupabase();
  const { data: profile } = await supabase.from("kt_profiles").select("id, custom_fee, custom_fee_payment").eq("email", email).single();
  if (!profile) return NextResponse.json({ error: "Profil introuvable" }, { status: 404 });

  const { data: transfer } = await supabase
    .from("kt_transfer_requests")
    .select("id, to_name, to_iban, amount, fee_amount, status, reference, rejection_reason, created_at")
    .eq("id", transferId)
    .eq("profile_id", profile.id)
    .single();

  if (!transfer) return NextResponse.json({ error: "Virement introuvable" }, { status: 404 });

  let feePayment = profile.custom_fee_payment as Record<string, string> | null;
  if (!feePayment) {
    const { data: payRow } = await supabase.from("kt_settings").select("value").eq("key", "fee_payment").single();
    feePayment = payRow?.value ?? { name: "KT Bank AG", iban: "DE89370400440532013000", bic: "KTAGDEFF", bank: "", reference: "FRAIS-VIREMENT" };
  }

  return NextResponse.json({ transfer, fee_payment: feePayment });
}

export async function POST(req: NextRequest) {
  const email = await getSessionEmail(req);
  if (!email) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const supabase = getSupabase();
  const { to_name, to_iban, amount, reference } = await req.json();

  if (!to_name || !to_iban || !amount || Number(amount) <= 0) {
    return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
  }

  const { data: profile } = await supabase
    .from("kt_profiles")
    .select("id, status, custom_fee, custom_fee_payment, prenom, lang")
    .eq("email", email)
    .single();

  if (!profile) return NextResponse.json({ error: "Profil introuvable" }, { status: 404 });

  if (profile.status !== "active") {
    return NextResponse.json({ error: "Compte désactivé", code: "ACCOUNT_SUSPENDED" }, { status: 403 });
  }

  const { data: account } = await supabase
    .from("kt_accounts")
    .select("id, balance, status")
    .eq("profile_id", profile.id)
    .eq("status", "active")
    .single();

  if (!account) return NextResponse.json({ error: "Aucun compte actif" }, { status: 404 });

  if (Number(account.balance) < Number(amount)) {
    return NextResponse.json({ error: "Solde insuffisant", code: "INSUFFICIENT_FUNDS", balance: account.balance }, { status: 422 });
  }

  // Get fee settings: per-client overrides take priority over global settings
  let fee = profile.custom_fee;
  let feePayment = profile.custom_fee_payment;

  if (!fee || !feePayment) {
    const [{ data: feeRow }, { data: payRow }] = await Promise.all([
      supabase.from("kt_settings").select("value").eq("key", "transfer_fee").single(),
      supabase.from("kt_settings").select("value").eq("key", "fee_payment").single(),
    ]);
    if (!fee) fee = feeRow?.value ?? { amount: 50, currency: "EUR" };
    if (!feePayment) feePayment = payRow?.value ?? { name: "KT Bank AG", iban: "DE89370400440532013000", bic: "KTAGDEFF" };
  }

  // Save transfer request
  const { data: transfer } = await supabase
    .from("kt_transfer_requests")
    .insert({
      profile_id: profile.id,
      account_id: account.id,
      to_name,
      to_iban,
      amount: Number(amount),
      reference: reference || null,
      fee_amount: Number(fee.amount),
      status: "pending_fee",
    })
    .select("id")
    .single();

  // Send pending-fee email — must be awaited before return or serverless runtime kills it
  if (transfer?.id) {
    try {
      await sendTransferPendingFee(email, {
        prenom: (profile as { prenom?: string }).prenom ?? "Client",
        amount: Number(amount),
        currency: "EUR",
        to_name,
        to_iban,
        reference: reference || undefined,
        fee_amount: Number(fee.amount),
        fee_currency: fee.currency ?? "EUR",
        fee_payment: feePayment as Record<string, string>,
        transfer_id: transfer.id,
        lang: ((profile as { lang?: string }).lang as "de" | "fr") ?? "de",
      });
    } catch (e) {
      console.error("[transfer pending-fee email failed]", e);
    }
  }

  return NextResponse.json({
    ok: true,
    transfer_id: transfer?.id,
    fee: { amount: fee.amount, currency: fee.currency ?? "EUR" },
    fee_payment: feePayment,
  });
}

// Client confirms fee payment
export async function PATCH(req: NextRequest) {
  const email = await getSessionEmail(req);
  if (!email) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const supabase = getSupabase();
  const { transfer_id } = await req.json();

  const { data: profile } = await supabase.from("kt_profiles").select("id").eq("email", email).single();
  if (!profile) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

  await supabase.from("kt_transfer_requests")
    .update({ fee_paid: true, status: "processing" })
    .eq("id", transfer_id)
    .eq("profile_id", profile.id);

  // Send "processing" email to client
  const { data: transfer } = await supabase
    .from("kt_transfer_requests")
    .select("amount, to_name, reference")
    .eq("id", transfer_id)
    .single();

  const { data: profileData } = await supabase
    .from("kt_profiles")
    .select("email, prenom, lang")
    .eq("id", profile.id)
    .single();

  if (transfer && profileData?.email) {
    await sendTransferStatus(profileData.email, {
      prenom: profileData.prenom ?? "Client",
      status: "processing",
      amount: Number(transfer.amount),
      currency: "EUR",
      to_name: transfer.to_name,
      reference: transfer.reference ?? undefined,
      lang: profileData.lang ?? "de",
    });
  }

  return NextResponse.json({ ok: true });
}
