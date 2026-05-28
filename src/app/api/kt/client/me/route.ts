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

export async function GET(req: NextRequest) {
  const email = await getSessionEmail(req);
  if (!email) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const supabase = getSupabase();

  const { data: profile } = await supabase
    .from("kt_profiles")
    .select("*")
    .eq("email", email)
    .single();

  if (!profile) return NextResponse.json({ error: "Profil introuvable" }, { status: 404 });

  const { data: accounts } = await supabase
    .from("kt_accounts")
    .select("*, kt_cards(*)")
    .eq("profile_id", profile.id);

  const accountIds = (accounts ?? []).map((a: { id: string }) => a.id);
  let transactions: unknown[] = [];
  if (accountIds.length > 0) {
    const { data: txs } = await supabase
      .from("kt_transactions")
      .select("*")
      .in("account_id", accountIds)
      .order("created_at", { ascending: false })
      .limit(20);
    transactions = txs ?? [];
  }

  const { data: transfers } = await supabase
    .from("kt_transfer_requests")
    .select("id, to_name, to_iban, amount, fee_amount, fee_paid, status, reference, rejection_reason, created_at")
    .eq("profile_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(20);

  return NextResponse.json({ profile, accounts: accounts ?? [], transactions, transfers: transfers ?? [] });
}
