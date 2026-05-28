import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { sendTransactionNotification, sendTransferStatus } from "@/lib/email/send";

function auth(req: NextRequest) {
  const key = process.env.KT_ADMIN_KEY;
  return key && req.headers.get("Authorization") === `Bearer ${key}`;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!auth(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;
  const supabase = getSupabase();

  const { data: profile, error } = await supabase
    .from("kt_profiles")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !profile) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

  const { data: accounts } = await supabase
    .from("kt_accounts")
    .select("*, kt_cards(*), kt_transactions(*)")
    .eq("profile_id", id);

  const { data: transfers } = await supabase
    .from("kt_transfer_requests")
    .select("*")
    .eq("profile_id", id)
    .order("created_at", { ascending: false });

  return NextResponse.json({ profile, accounts: accounts ?? [], transfers: transfers ?? [] });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!auth(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;
  const supabase = getSupabase();
  const body = await req.json();

  // Fetch profile for email/prenom/lang
  const { data: profile } = await supabase
    .from("kt_profiles")
    .select("email, prenom, lang, status")
    .eq("id", id)
    .single();

  // Profile fields (status, kyc_status)
  const profileFields = ["status", "kyc_status"];
  const profileUpdate = Object.fromEntries(Object.entries(body).filter(([k]) => profileFields.includes(k)));
  if (Object.keys(profileUpdate).length > 0) {
    const { error } = await supabase.from("kt_profiles").update(profileUpdate).eq("id", id);
    if (error) return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }

  // Credit / debit balance
  if (body.credit_amount !== undefined) {
    const { data: account } = await supabase
      .from("kt_accounts")
      .select("id, balance")
      .eq("profile_id", id)
      .single();
    if (account) {
      const delta = Number(body.credit_amount);
      const newBalance = Number(account.balance) + delta;
      await supabase.from("kt_accounts").update({ balance: newBalance }).eq("id", account.id);

      if (delta !== 0) {
        const txType = delta > 0 ? "credit" : "debit";
        const label = body.credit_label || (delta > 0 ? "Crédit administratif" : "Débit administratif");
        await supabase.from("kt_transactions").insert({
          account_id: account.id,
          type: txType,
          amount: Math.abs(delta),
          currency: "EUR",
          description: label,
          status: "completed",
        });

        // Email notification to client
        if (profile?.email) {
          await sendTransactionNotification(profile.email, {
            prenom: profile.prenom ?? "Client",
            type: txType,
            amount: Math.abs(delta),
            currency: "EUR",
            description: label,
            balance: newBalance,
            lang: profile.lang ?? "de",
          });
        }
      }
    }
  }

  // Update transfer request status
  if (body.transfer_id && body.transfer_status) {
    const { data: transfer } = await supabase
      .from("kt_transfer_requests")
      .select("*")
      .eq("id", body.transfer_id)
      .single();

    await supabase
      .from("kt_transfer_requests")
      .update({ status: body.transfer_status })
      .eq("id", body.transfer_id);

    if (transfer && profile?.email) {
      if (body.transfer_status === "completed") {
        // Deduct balance from account
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

          await sendTransferStatus(profile.email, {
            prenom: profile.prenom ?? "Client",
            status: "completed",
            amount: Number(transfer.amount),
            currency: "EUR",
            to_name: transfer.to_name,
            reference: transfer.reference ?? undefined,
            balance: newBalance,
            lang: profile.lang ?? "de",
          });
        }
      } else if (body.transfer_status === "rejected") {
        // Get current balance for email
        const { data: account } = await supabase
          .from("kt_accounts")
          .select("balance")
          .eq("id", transfer.account_id)
          .single();

        await sendTransferStatus(profile.email, {
          prenom: profile.prenom ?? "Client",
          status: "rejected",
          amount: Number(transfer.amount),
          currency: "EUR",
          to_name: transfer.to_name,
          reference: transfer.reference ?? undefined,
          balance: account ? Number(account.balance) : undefined,
          lang: profile.lang ?? "de",
        });
      }
    }
  }

  return NextResponse.json({ ok: true });
}
