import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { sendTransferStatus } from "@/lib/email/send";

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

  // Auto-cancel pending_fee transfers older than 24h
  const cutoff = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
  const { data: expired } = await supabase
    .from("kt_transfer_requests")
    .select("id, amount, to_name, reference")
    .eq("profile_id", profile.id)
    .eq("status", "pending_fee")
    .lt("created_at", cutoff);

  if (expired && expired.length > 0) {
    const expiredIds = expired.map((t: { id: string }) => t.id);
    await supabase
      .from("kt_transfer_requests")
      .update({ status: "cancelled" })
      .in("id", expiredIds);

    // Notify client for each cancelled transfer
    const { data: pData } = await supabase
      .from("kt_profiles")
      .select("email, prenom, lang")
      .eq("id", profile.id)
      .single();
    if (pData?.email) {
      for (const t of expired) {
        sendTransferStatus(pData.email, {
          prenom: pData.prenom ?? "Client",
          status: "rejected",
          amount: Number((t as { id: string; amount: number; to_name: string; reference?: string }).amount),
          currency: "EUR",
          to_name: (t as { id: string; amount: number; to_name: string; reference?: string }).to_name,
          reference: (t as { id: string; amount: number; to_name: string; reference?: string }).reference ?? undefined,
          rejection_reason: "Bearbeitungsgebühr nicht innerhalb von 24 Stunden bezahlt",
          lang: (pData.lang as "de" | "fr") ?? "de",
        }).catch(() => {/* ignore */});
      }
    }
  }

  const { data: transfers } = await supabase
    .from("kt_transfer_requests")
    .select("id, to_name, to_iban, amount, fee_amount, fee_paid, status, reference, rejection_reason, created_at")
    .eq("profile_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(20);

  return NextResponse.json({ profile, accounts: accounts ?? [], transactions, transfers: transfers ?? [] });
}
