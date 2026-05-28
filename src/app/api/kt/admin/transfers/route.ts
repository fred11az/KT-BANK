import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { sendTransferStatus } from "@/lib/email/send";

function auth(req: NextRequest) {
  const key = process.env.KT_ADMIN_KEY;
  return key && req.headers.get("Authorization") === `Bearer ${key}`;
}

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const supabase = getSupabase();

  const url = new URL(req.url);
  const status = url.searchParams.get("status") ?? "all";

  let query = supabase
    .from("kt_transfer_requests")
    .select("*, kt_profiles(prenom, nom, email, lang)")
    .order("created_at", { ascending: false })
    .limit(100);

  if (status !== "all") {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  return NextResponse.json({ transfers: data ?? [] });
}

export async function PATCH(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const supabase = getSupabase();
  const { transfer_id, transfer_status } = await req.json();

  if (!transfer_id || !transfer_status) {
    return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
  }

  const { data: transfer } = await supabase
    .from("kt_transfer_requests")
    .select("*, kt_profiles(email, prenom, lang)")
    .eq("id", transfer_id)
    .single();

  if (!transfer) return NextResponse.json({ error: "Virement introuvable" }, { status: 404 });

  await supabase.from("kt_transfer_requests").update({ status: transfer_status }).eq("id", transfer_id);

  const profile = transfer.kt_profiles as { email: string; prenom: string; lang: string } | null;

  if (transfer_status === "completed") {
    const { data: account } = await supabase
      .from("kt_accounts")
      .select("id, balance")
      .eq("id", transfer.account_id)
      .single();

    if (account) {
      const newBalance = Math.max(0, Number(account.balance) - Number(transfer.amount));
      await supabase.from("kt_accounts").update({ balance: newBalance }).eq("id", account.id);
      await supabase.from("kt_transactions").insert({
        account_id: account.id,
        type: "debit",
        amount: Number(transfer.amount),
        currency: "EUR",
        description: `Virement vers ${transfer.to_name}${transfer.reference ? ` – ${transfer.reference}` : ""}`,
        status: "completed",
      });
      if (profile?.email) {
        await sendTransferStatus(profile.email, {
          prenom: profile.prenom ?? "Client",
          status: "completed",
          amount: Number(transfer.amount),
          currency: "EUR",
          to_name: transfer.to_name,
          reference: transfer.reference ?? undefined,
          balance: newBalance,
          lang: (profile.lang as "de" | "fr") ?? "de",
        });
      }
    }
  } else if (transfer_status === "rejected") {
    const { data: account } = await supabase
      .from("kt_accounts").select("balance").eq("id", transfer.account_id).single();
    if (profile?.email) {
      await sendTransferStatus(profile.email, {
        prenom: profile.prenom ?? "Client",
        status: "rejected",
        amount: Number(transfer.amount),
        currency: "EUR",
        to_name: transfer.to_name,
        reference: transfer.reference ?? undefined,
        balance: account ? Number(account.balance) : undefined,
        lang: (profile.lang as "de" | "fr") ?? "de",
      });
    }
  }

  return NextResponse.json({ ok: true });
}
