import { NextRequest, NextResponse } from "next/server";
import { getSupabase, getSupabaseAdmin } from "@/lib/supabase";
import {
  sendTransactionNotification, sendTransferStatus,
  sendKycApproved, sendAccountActivationRequired, sendKycRejected, sendAccountActivated,
  sendBusinessApproved, sendBusinessRejected,
} from "@/lib/email/send";
import { createNotification } from "@/lib/notify";

function auth(req: NextRequest) {
  const key = process.env.KT_ADMIN_KEY;
  return key && req.headers.get("Authorization") === `Bearer ${key}`;
}

function generateIban() {
  const bban = Array.from({ length: 18 }, () => Math.floor(Math.random() * 10)).join("");
  return `DE${Math.floor(10 + Math.random() * 90)}3704${bban}`;
}

// Localized in-app notification copy for business-account decisions
function bizNotif(lang: string, approved: boolean, company?: string) {
  const c = company ? ` „${company}"` : "";
  const map: Record<string, { okT: string; okB: string; noT: string; noB: string }> = {
    de: { okT: "Geschäftskonto genehmigt", okB: `Ihr Geschäftskonto${c} ist jetzt aktiv und in Ihrem Dashboard verfügbar.`, noT: "Geschäftskontoantrag abgelehnt", noB: `Ihr Antrag auf ein Geschäftskonto${c} konnte nicht genehmigt werden.` },
    fr: { okT: "Compte entreprise approuvé", okB: `Votre compte entreprise${c} est désormais actif et accessible dans votre tableau de bord.`, noT: "Demande de compte entreprise refusée", noB: `Votre demande de compte entreprise${c} n'a pas pu être approuvée.` },
    en: { okT: "Business account approved", okB: `Your business account${c} is now active and available in your dashboard.`, noT: "Business account request declined", noB: `Your business account request${c} could not be approved.` },
    ar: { okT: "تمت الموافقة على حساب الأعمال", okB: `حساب أعمالك${c} نشط الآن ومتاح في لوحة التحكم.`, noT: "تم رفض طلب حساب الأعمال", noB: `تعذرت الموافقة على طلب حساب الأعمال${c}.` },
    tr: { okT: "Ticari hesap onaylandı", okB: `Ticari hesabınız${c} artık aktif ve panelinizde mevcut.`, noT: "Ticari hesap talebi reddedildi", noB: `Ticari hesap talebiniz${c} onaylanamadı.` },
    es: { okT: "Cuenta de empresa aprobada", okB: `Su cuenta de empresa${c} ya está activa y disponible en su panel.`, noT: "Solicitud de cuenta de empresa rechazada", noB: `Su solicitud de cuenta de empresa${c} no pudo ser aprobada.` },
    it: { okT: "Conto aziendale approvato", okB: `Il suo conto aziendale${c} è ora attivo e disponibile nella sua dashboard.`, noT: "Richiesta di conto aziendale rifiutata", noB: `La sua richiesta di conto aziendale${c} non è stata approvata.` },
    pt: { okT: "Conta empresarial aprovada", okB: `A sua conta empresarial${c} está agora ativa e disponível no seu painel.`, noT: "Pedido de conta empresarial recusado", noB: `O seu pedido de conta empresarial${c} não pôde ser aprovado.` },
    nl: { okT: "Zakelijke rekening goedgekeurd", okB: `Uw zakelijke rekening${c} is nu actief en beschikbaar in uw dashboard.`, noT: "Aanvraag zakelijke rekening afgewezen", noB: `Uw aanvraag voor een zakelijke rekening${c} kon niet worden goedgekeurd.` },
  };
  const m = map[lang] ?? map.en;
  return approved ? { title: m.okT, body: m.okB } : { title: m.noT, body: m.noB };
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
    .eq("profile_id", id)
    .order("balance", { ascending: false })
    .order("created_at", { ascending: true });

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

  // Credit / debit balance — optionally targeting a specific account
  // (body.account_id, e.g. a business account); defaults to the main account.
  if (body.credit_amount !== undefined) {
    const adminDb = getSupabaseAdmin();
    let account: { id: string; balance: number } | null = null;
    if (body.account_id) {
      const { data: a } = await adminDb
        .from("kt_accounts")
        .select("id, balance")
        .eq("id", body.account_id)
        .eq("profile_id", id)
        .single();
      account = a ?? null;
    } else {
      const { data: accounts } = await adminDb
        .from("kt_accounts")
        .select("id, balance")
        .eq("profile_id", id)
        .order("balance", { ascending: false })
        .order("created_at", { ascending: true });
      account = accounts?.[0] ?? null;
    }
    if (account) {
      const delta = Number(body.credit_amount);
      const newBalance = Number(account.balance) + delta;
      await adminDb.from("kt_accounts").update({ balance: newBalance }).eq("id", account.id);

      if (delta !== 0) {
        const txType = delta > 0 ? "credit" : "debit";
        const label = body.credit_label || (delta > 0 ? "Crédit administratif" : "Débit administratif");
        await adminDb.from("kt_transactions").insert({
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
          await adminDb.from("kt_profiles").update({ status: "active" }).eq("id", id);
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

  // Approve / reject a business account
  if (body.business_account_id && (body.business_action === "approve" || body.business_action === "reject")) {
    const adminDb = getSupabaseAdmin();
    const { data: acct } = await adminDb
      .from("kt_accounts")
      .select("id, status, business_info")
      .eq("id", body.business_account_id)
      .eq("profile_id", id)
      .single();

    if (acct) {
      const company = (acct.business_info as { company_name?: string } | null)?.company_name;
      const lang = profile?.lang ?? "de";

      if (body.business_action === "approve") {
        const iban = generateIban();
        await adminDb.from("kt_accounts").update({
          status: "active",
          iban,
          bic: "KTAGDEFF",
          approved_at: new Date().toISOString(),
        }).eq("id", acct.id);

        if (profile?.email) {
          await sendBusinessApproved(profile.email, {
            prenom: profile.prenom ?? "Client",
            companyName: company,
            iban,
            lang,
          });
        }
        const n = bizNotif(lang, true, company);
        await createNotification(id, { type: "business_approved", title: n.title, body: n.body, link: "accounts" });
      } else {
        await adminDb.from("kt_accounts").update({ status: "rejected" }).eq("id", acct.id);
        if (profile?.email) {
          await sendBusinessRejected(profile.email, {
            prenom: profile.prenom ?? "Client",
            companyName: company,
            reason: body.rejection_reason,
            lang,
          });
        }
        const n = bizNotif(lang, false, company);
        await createNotification(id, { type: "business_rejected", title: n.title, body: n.body, link: "accounts" });
      }
    }
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!auth(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;
  const adminDb = getSupabaseAdmin();

  const { data: accounts } = await adminDb
    .from("kt_accounts")
    .select("id")
    .eq("profile_id", id);

  const accountIds = (accounts ?? []).map((a: { id: string }) => a.id);

  if (accountIds.length > 0) {
    await adminDb.from("kt_transfer_requests").delete().in("account_id", accountIds);
    await adminDb.from("kt_transactions").delete().in("account_id", accountIds);
    await adminDb.from("kt_cards").delete().in("account_id", accountIds);
  }

  // Clean up all profile-related data
  await adminDb.from("kt_transfer_requests").delete().eq("profile_id", id);
  await adminDb.from("kt_credit_requests").delete().eq("profile_id", id);
  await adminDb.from("kt_kyc_documents").delete().eq("profile_id", id);
  await adminDb.from("kt_documents").delete().eq("client_id", id);
  await adminDb.from("kt_client_submissions").delete().eq("profile_id", id);
  await adminDb.from("kt_accounts").delete().eq("profile_id", id);

  const { data: profileRow } = await adminDb.from("kt_profiles").select("email").eq("id", id).single();
  if (profileRow?.email) {
    await adminDb.from("kt_sessions").delete().eq("email", profileRow.email);
  }

  const { error } = await adminDb.from("kt_profiles").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Erreur suppression" }, { status: 500 });

  return NextResponse.json({ ok: true });
}
