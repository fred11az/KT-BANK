import { Resend } from "resend";
import {
  otpRegistrationEmail,
  otpLoginEmail,
  welcomeEmail,
  transactionEmail,
  transferStatusEmail,
  transferPendingFeeEmail,
  bankMessageEmail,
  securityAlertEmail,
  adminNewClientEmail,
  adminTransferFeeEmail,
  kycApprovedEmail,
  accountActivationRequiredEmail,
  accountActivatedEmail,
  kycRejectedEmail,
  adminKycSubmittedEmail,
  documentNotificationEmail,
} from "./templates";

type Lang = "de" | "fr" | "en" | "ar" | "tr" | "es" | "it" | "pt" | "nl";

// Lazy init — Resend is only instantiated at call time, not at build time
function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  return new Resend(key);
}

const FROM = () => "KT Bank AG <support@kt-bank-ag.com>";

type Attachment = { filename: string; path: string };

export async function send(to: string, subject: string, html: string, attachments?: Attachment[]) {
  try {
    const payload: Record<string, unknown> = { from: FROM(), to, subject, html };
    if (attachments?.length) payload.attachments = attachments;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await getResend().emails.send(payload as any);
    if (error) console.error("[Resend error]", error);
    return !error;
  } catch (err) {
    console.error("[Resend send failed]", err);
    return false;
  }
}

export async function sendOtpRegistration(email: string, code: string, lang: Lang = "de") {
  const { subject, html } = otpRegistrationEmail(code, email, lang);
  return send(email, subject, html);
}

export async function sendOtpLogin(email: string, code: string, lang: Lang = "de") {
  const { subject, html } = otpLoginEmail(code, lang);
  return send(email, subject, html);
}

export async function sendWelcome(email: string, prenom: string, iban: string, lang: Lang = "de") {
  const { subject, html } = welcomeEmail(prenom, iban, lang);
  return send(email, subject, html);
}

export async function sendTransactionNotification(
  email: string,
  opts: {
    prenom: string;
    type: "credit" | "debit";
    amount: number;
    currency: string;
    description: string;
    balance: number;
    lang?: Lang;
  }
) {
  const { subject, html } = transactionEmail(opts);
  return send(email, subject, html);
}

export async function sendTransferStatus(
  email: string,
  opts: {
    prenom: string;
    status: "completed" | "rejected" | "processing";
    amount: number;
    currency: string;
    to_name: string;
    reference?: string;
    balance?: number;
    rejection_reason?: string;
    lang?: Lang;
  }
) {
  const { subject, html } = transferStatusEmail(opts);
  return send(email, subject, html);
}

export async function sendTransferPendingFee(
  email: string,
  opts: {
    prenom: string;
    amount: number;
    currency: string;
    to_name: string;
    to_iban: string;
    reference?: string;
    fee_amount: number;
    fee_currency: string;
    fee_payment: { name?: string; iban?: string; bic?: string; bank?: string; reference?: string };
    transfer_id: string;
    lang?: Lang;
  }
) {
  const { subject, html } = transferPendingFeeEmail(opts);
  return send(email, subject, html);
}

export async function sendBankMessage(
  email: string,
  prenom: string,
  messagePreview: string,
  lang: Lang = "de"
) {
  const { subject, html } = bankMessageEmail({ prenom, messagePreview, lang });
  return send(email, subject, html);
}

export async function sendAdminTransferFee(opts: {
  prenom: string; nom: string; email: string;
  amount: number; to_name: string; to_iban: string;
  fee_amount: number; reference?: string;
  payment_reference?: string; transfer_id: string;
}) {
  const { subject, html } = adminTransferFeeEmail(opts);
  const adminEmails = [
    "KTBANKAGDE@GMAIL.COM",
    process.env.RESEND_ADMIN_EMAIL ?? "support@kt-bank-ag.com",
  ];
  await Promise.all(adminEmails.map((to) => send(to, subject, html)));
}

export async function sendAdminNewClient(client: {
  prenom: string; nom: string; email: string; telephone: string;
  pays_residence: string; nationalite: string; situation_professionnelle: string;
  revenu_mensuel: string; iban: string;
}) {
  const { subject, html } = adminNewClientEmail(client);
  const adminEmails = [
    "KTBANKAGDE@GMAIL.COM",
    process.env.RESEND_ADMIN_EMAIL ?? "support@kt-bank-ag.com",
  ];
  await Promise.all(adminEmails.map((to) => send(to, subject, html)));
}

export async function sendKycApproved(email: string, opts: { prenom: string; lang?: Lang }) {
  const { subject, html } = kycApprovedEmail(opts);
  return send(email, subject, html);
}

export async function sendAccountActivationRequired(
  email: string,
  opts: { prenom: string; bank_name: string; bank_iban: string; bank_bic: string; lang?: Lang }
) {
  const { subject, html } = accountActivationRequiredEmail(opts);
  return send(email, subject, html);
}

export async function sendAccountActivated(email: string, opts: { prenom: string; balance: number; lang?: Lang }) {
  const { subject, html } = accountActivatedEmail(opts);
  return send(email, subject, html);
}

export async function sendKycRejected(email: string, opts: { prenom: string; notes?: string; lang?: Lang }) {
  const { subject, html } = kycRejectedEmail(opts);
  return send(email, subject, html);
}

export async function sendAdminKycSubmitted(opts: {
  prenom: string; nom: string; email: string; document_type: string;
}) {
  const { subject, html } = adminKycSubmittedEmail(opts);
  const adminEmails = [
    "KTBANKAGDE@GMAIL.COM",
    process.env.RESEND_ADMIN_EMAIL ?? "support@kt-bank-ag.com",
  ];
  await Promise.all(adminEmails.map((to) => send(to, subject, html)));
}

export async function sendSecurityAlert(
  email: string,
  prenom: string,
  reason: string,
  lang: Lang = "de"
) {
  const { subject, html } = securityAlertEmail(prenom, reason, lang);
  return send(email, subject, html);
}

export async function sendDocumentToClient(
  email: string,
  opts: { prenom: string; docTitle: string; docType: string; lang?: Lang; contentHtml?: string }
) {
  const { subject, html } = documentNotificationEmail(opts);
  return send(email, subject, html);
}
