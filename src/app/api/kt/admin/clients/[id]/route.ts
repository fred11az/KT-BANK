import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import {
  sendTransactionNotification, sendTransferStatus,
  sendKycApproved, sendAccountActivationRequired, sendKycRejected, sendAccountActivated,
} from "@/lib/email/send";

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

  const { data: kycDocuments } = await supabase
    .from("kt_kyc_documents")
    .select("id, document_type, file_path, status, notes, created_at")
    .eq("profile_id", id)
    .order("created_at", { ascending: true });

  return NextResponse.json({ profile, accounts: accounts ?? [], transfers: transfers ?? [], kyc_documents: kycDocuments ?? [] });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!auth(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;
  const supabase = getSupabase();
  const body = await req.json();

  // Fetch profile for email/prenom/lang/activation state
  const { data: profile } = await supabase
    .from("kt_profiles")
    .select("email, prenom, lang, status, activation_required, kyc_status")
    .eq("id", id)
    .single();

  // Profile fields (non-KYC updates)
  const profileFields = ["status", "custom_fee", "custom_fee_payment", "activation_required", "fee_free"];
  const profileUpdate = Object.fromEntries(Object.entries(body).filter(([k]) => profileFields.includes(k)));
  if (Object.keys(profileUpdate).length > 0) {
    const { error } = await supabase.from("kt_profiles").update(profileUpdate).eq("id", id);
    if (error) return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }

  // KYC status update (with auto-activation + email logic)
  if (body.kyc_status && ["approved", "rejected", "pending", "unverified"].includes(body.kyc_status as string)) {
    const activationRequired = profile?.activation_required ?? false;
    const kycUpdate: Record<string, unknown> = { kyc_status: body.kyc_status };

    if (body.kyc_status === "approved" && !activationRequired) {
      kycUpdate.status = "active";
    }
    await supabase.from("kt_profiles").update(kycUpdate).eq("id", id);

    if (profile?.email) {
      if (body.kyc_status === "approved") {
        if (!activationRequired) {
          await sendKycApproved(profile.email, { prenom: profile.prenom ?? "Client", lang: profile.lang ?? "de" });
        } else {
          const { data: payRow } = await supabase.from("kt_settings").select("value").eq("key", "fee_payment").single();
          const fp = (payRow?.value ?? {}) as Record<string, string>;
          await sendAccountActivationRequired(profile.email, {
            prenom: profile.prenom ?? "Client",
            bank_name: fp.name ?? "KT Bank AG",
            bank_iban: fp.iban ?? "DE89370400440532013000",
            bank_bic: fp.bic ?? "KTAGDEFF",
            lang: profile.lang ?? "de",
          });
        }
      } else if (body.kyc_status === "rejected") {
        await sendKycRejected(profile.email, {
          prenom: profile.prenom ?? "Client",
          notes: body.kyc_notes as string | undefined,
          lang: profile.lang ?? "de",
        });
      }
    }
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

        // Auto-activate if activation_required, KYC approved, and balance now >= 250
        if (
          delta > 0 &&
          profile?.activation_required &&
          (profile?.kyc_status ?? "") === "approved" &&
          (profile?.status ?? "") !== "active" &&
          newBalance >= 250
        ) {
          await supabase.from("kt_profiles").update({ status: "active" }).eq("id", id);
          if (profile?.email) {
            await sendAccountActivated(profile.email, {
              prenom: profile.prenom ?? "Client",
              balance: newBalance,
              lang: profile.lang ?? "de",
            });
          }
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

    const transferUpdate: Record<string, unknown> = { status: body.transfer_status };
    if (body.rejection_reason) transferUpdate.rejection_reason = body.rejection_reason;
    await supabase
      .from("kt_transfer_requests")
      .update(transferUpdate)
      .eq("id", body.transfer_id);

    if (transfer && profile?.email) {
      if (body.transfer_status === "completed") {
        // Funds already debited at transfer creation — just send confirmation email
        const { data: account } = await supabase
          .from("kt_accounts")
          .select("balance")
          .eq("id", transfer.account_id)
          .single();

        await sendTransferStatus(profile.email, {
          prenom: profile.prenom ?? "Client",
          status: "completed",
          amount: Number(transfer.amount),
          currency: "EUR",
          to_name: transfer.to_name,
          reference: transfer.reference ?? undefined,
          balance: account ? Number(account.balance) : undefined,
          lang: profile.lang ?? "de",
        });
      } else if (body.transfer_status === "rejected" || body.transfer_status === "cancelled") {
        // Credit the amount back to client's account
        const { data: account } = await supabase
          .from("kt_accounts")
          .select("id, balance")
          .eq("id", transfer.account_id)
          .single();

        if (account) {
          const refundedBalance = Number(account.balance) + Number(transfer.amount);
          await supabase.from("kt_accounts").update({ balance: refundedBalance }).eq("id", account.id);
          const label = body.transfer_status === "cancelled" ? "annulé" : "abgelehnt";
          await supabase.from("kt_transactions").insert({
            account_id: account.id,
            type: "credit",
            amount: Number(transfer.amount),
            currency: "EUR",
            description: `Rückbuchung Überweisung → ${transfer.to_name}${transfer.reference ? ` – ${transfer.reference}` : ""} (${label})`,
            status: "completed",
          });

          await sendTransferStatus(profile.email, {
            prenom: profile.prenom ?? "Client",
            status: "rejected",
            amount: Number(transfer.amount),
            currency: "EUR",
            to_name: transfer.to_name,
            reference: transfer.reference ?? undefined,
            balance: refundedBalance,
            rejection_reason: body.rejection_reason,
            lang: profile.lang ?? "de",
          });
        }
      }
    }
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!auth(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;
  const supabase = getSupabase();

  const { data: accounts } = await supabase
    .from("kt_accounts")
    .select("id")
    .eq("profile_id", id);

  const accountIds = (accounts ?? []).map((a: { id: string }) => a.id);

  if (accountIds.length > 0) {
    await supabase.from("kt_transfer_requests").delete().in("account_id", accountIds);
    await supabase.from("kt_transactions").delete().in("account_id", accountIds);
    await supabase.from("kt_cards").delete().in("account_id", accountIds);
  }
  await supabase.from("kt_transfer_requests").delete().eq("profile_id", id);
  await supabase.from("kt_accounts").delete().eq("profile_id", id);

  const { data: profileRow } = await supabase.from("kt_profiles").select("email").eq("id", id).single();
  if (profileRow?.email) {
    await supabase.from("kt_sessions").delete().eq("email", profileRow.email);
  }

  const { error } = await supabase.from("kt_profiles").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Erreur suppression" }, { status: 500 });

  return NextResponse.json({ ok: true });
}
