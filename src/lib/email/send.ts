import { Resend } from "resend";
import {
  otpRegistrationEmail,
  otpLoginEmail,
  welcomeEmail,
  transactionEmail,
  bankMessageEmail,
  securityAlertEmail,
} from "./templates";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL ?? "KT Bank <noreply@kt-bank.de>";

type Lang = "de" | "fr";

async function send(to: string, subject: string, html: string) {
  const { error } = await resend.emails.send({ from: FROM, to, subject, html });
  if (error) console.error("[Resend error]", error);
  return !error;
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

export async function sendBankMessage(
  email: string,
  prenom: string,
  messagePreview: string,
  lang: Lang = "de"
) {
  const { subject, html } = bankMessageEmail({ prenom, messagePreview, lang });
  return send(email, subject, html);
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
