import { Resend } from "resend";
import {
  otpRegistrationEmail,
  otpLoginEmail,
  welcomeEmail,
  transactionEmail,
  transferStatusEmail,
  bankMessageEmail,
  securityAlertEmail,
  adminNewClientEmail,
  adminTransferFeeEmail,
} from "./templates";

type Lang = "de" | "fr";

// Lazy init — Resend is only instantiated at call time, not at build time
function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  return new Resend(key);
}

const FROM = () => process.env.RESEND_FROM_EMAIL ?? "KT Bank AG <support@kt-bank-ag.com>";

export async function send(to: string, subject: string, html: string) {
  try {
    const { error } = await getResend().emails.send({ from: FROM(), to, subject, html });
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
    lang?: Lang;
  }
) {
  const { subject, html } = transferStatusEmail(opts);
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

export async function sendSecurityAlert(
  email: string,
  prenom: string,
  reason: string,
  lang: Lang = "de"
) {
  const { subject, html } = securityAlertEmail(prenom, reason, lang);
  return send(email, subject, html);
}
