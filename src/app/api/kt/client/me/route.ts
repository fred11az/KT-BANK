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

  // Auto-cancel pending_fee transfers older than 24h and refund amounts
  const cutoff = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
  const { data: expired } = await supabase
    .from("kt_transfer_requests")
    .select("id, account_id, amount, to_name, reference")
    .eq("profile_id", profile.id)
    .eq("status", "pending_fee")
    .lt("created_at", cutoff);

  if (expired && expired.length > 0) {
    type Expired = { id: string; account_id: string; amount: number; to_name: string; reference?: string };

    // Cancel the transfers
    const expiredIds = expired.map((t) => (t as Expired).id);
    await supabase
      .from("kt_transfer_requests")
      .update({ status: "cancelled", rejection_reason: "Bearbeitungsgebühr nicht innerhalb von 24 Stunden bezahlt" })
      .in("id", expiredIds);

    // Refund each expired transfer: credit back to account + create transaction
    for (const rawT of expired) {
      const t = rawT as Expired;
      const { data: acc } = await supabase
        .from("kt_accounts")
        .select("id, balance")
        .eq("id", t.account_id)
        .single();

      if (acc) {
        const refundedBalance = Number(acc.balance) + Number(t.amount);
        await supabase.from("kt_accounts").update({ balance: refundedBalance }).eq("id", acc.id);
        await supabase.from("kt_transactions").insert({
          account_id: acc.id,
          type: "credit",
          amount: Number(t.amount),
          currency: "EUR",
          description: `Rückbuchung Überweisung → ${t.to_name}${t.reference ? ` – ${t.reference}` : ""} (Gebühren nicht bezahlt)`,
          status: "completed",
        });

        // Send refund + cancellation email (awaited so it completes before serverless terminates)
        sendTransferStatus(profile.email, {
          prenom: profile.prenom ?? "Client",
          status: "rejected",
          amount: Number(t.amount),
          currency: "EUR",
          to_name: t.to_name,
          reference: t.reference ?? undefined,
          balance: refundedBalance,
          rejection_reason: "Bearbeitungsgebühr nicht innerhalb von 24 Stunden bezahlt",
          lang: (profile.lang as "de" | "fr") ?? "de",
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
