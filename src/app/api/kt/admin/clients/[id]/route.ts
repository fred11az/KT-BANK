import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

function auth(req: NextRequest) {
  const key = process.env.KT_ADMIN_KEY;
  return key && req.headers.get("Authorization") === `Bearer ${key}`;
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  if (!auth(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const supabase = getSupabase();

  const { data: profile, error } = await supabase
    .from("kt_profiles")
    .select("*")
    .eq("id", params.id)
    .single();
  if (error || !profile) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

  const { data: accounts } = await supabase
    .from("kt_accounts")
    .select("*, kt_cards(*), kt_transactions(*)")
    .eq("profile_id", params.id);

  const { data: transfers } = await supabase
    .from("kt_transfer_requests")
    .select("*")
    .eq("profile_id", params.id)
    .order("created_at", { ascending: false });

  return NextResponse.json({ profile, accounts: accounts ?? [], transfers: transfers ?? [] });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!auth(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const supabase = getSupabase();
  const body = await req.json();

  // Profile fields
  const profileFields = ["status", "kyc_status"];
  const profileUpdate = Object.fromEntries(Object.entries(body).filter(([k]) => profileFields.includes(k)));
  if (Object.keys(profileUpdate).length > 0) {
    const { error } = await supabase.from("kt_profiles").update(profileUpdate).eq("id", params.id);
    if (error) return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }

  // Credit balance to main account
  if (body.credit_amount !== undefined) {
    const { data: account } = await supabase
      .from("kt_accounts")
      .select("id, balance")
      .eq("profile_id", params.id)
      .single();
    if (account) {
      const newBalance = Number(account.balance) + Number(body.credit_amount);
      await supabase.from("kt_accounts").update({ balance: newBalance }).eq("id", account.id);
      // Log as transaction
      if (Number(body.credit_amount) !== 0) {
        await supabase.from("kt_transactions").insert({
          account_id: account.id,
          type: Number(body.credit_amount) > 0 ? "credit" : "debit",
          amount: Math.abs(Number(body.credit_amount)),
          currency: "EUR",
          description: body.credit_label || (Number(body.credit_amount) > 0 ? "Crédit administratif" : "Débit administratif"),
          status: "completed",
        });
      }
    }
  }

  // Update transfer request status
  if (body.transfer_id && body.transfer_status) {
    await supabase.from("kt_transfer_requests")
      .update({ status: body.transfer_status })
      .eq("id", body.transfer_id);
  }

  return NextResponse.json({ ok: true });
}
