import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

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

  const supabase = getSupabase();
  const { to_name, to_iban, amount, reference } = await req.json();

  if (!to_name || !to_iban || !amount || Number(amount) <= 0) {
    return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
  }

  const { data: profile } = await supabase
    .from("kt_profiles")
    .select("id, status")
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

  // Get fee settings
  const { data: feeRow } = await supabase.from("kt_settings").select("value").eq("key", "transfer_fee").single();
  const { data: payRow } = await supabase.from("kt_settings").select("value").eq("key", "fee_payment").single();
  const fee = feeRow?.value ?? { amount: 50, currency: "EUR" };
  const feePayment = payRow?.value ?? { name: "KT Bank AG", iban: "DE89370400440532013000", bic: "KTAGDEFF" };

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

  return NextResponse.json({ ok: true });
}
