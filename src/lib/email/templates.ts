const LOGO_URL = "https://kt-bank-ag.com/kt-logo.png";
const DASHBOARD_URL = "https://kt-bank-ag.com/client/dashboard";
const CONTACT_URL = "https://kt-bank-ag.com/contact";

const base = (content: string, lang: "de" | "fr" = "de") => `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>KT Bank AG</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" style="max-width:520px;background:#ffffff;border-radius:8px;overflow:hidden;">

  <!-- Logo header -->
  <tr>
    <td align="center" style="background:#1a2332;padding:24px 32px;">
      <img src="${LOGO_URL}" alt="KT Bank AG" width="140" height="40" style="display:block;max-width:140px;height:auto;" onerror="this.style.display='none'"/>
    </td>
  </tr>

  <!-- Content -->
  <tr><td style="padding:36px 32px 28px;">${content}</td></tr>

  <!-- Footer -->
  <tr>
    <td style="background:#f9f9f9;padding:18px 32px;border-top:1px solid #eeeeee;text-align:center;">
      <p style="margin:0 0 4px;font-size:11px;color:#999999;">KT Bank AG &middot; BaFin-reguliert &middot; BIC: KTAGDEFF</p>
      <p style="margin:0;font-size:11px;color:#bbbbbb;">kt-bank-ag.com</p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`;

/* ─── OTP – Registration ─── */
export function otpRegistrationEmail(code: string, _email: string, lang: "de" | "fr" = "de") {
  const s = lang === "fr" ? {
    subject: "Votre code de vérification – KT Bank",
    title: "Confirmez votre adresse e-mail",
    intro: "Saisissez le code ci-dessous dans les champs de saisie.",
    expiry: "Valable 10 minutes.",
    security: "Ne communiquez jamais ce code à personne.",
  } : {
    subject: "Bestätigen Sie Ihre E-Mail-Adresse – KT Bank",
    title: "Bestätigen Sie Ihre E-Mail-Adresse",
    intro: "Bitte geben Sie den Bestätigungscode in die Felder ein.",
    expiry: "Gültig für 10 Minuten.",
    security: "Teilen Sie diesen Code niemals mit Dritten.",
  };
  return {
    subject: s.subject,
    html: base(`
<h1 style="margin:0 0 10px;font-size:22px;font-weight:700;color:#111111;text-align:center;">${s.title}</h1>
<p style="margin:0 0 32px;font-size:14px;color:#666666;text-align:center;line-height:1.5;">${s.intro}</p>
<div style="text-align:center;margin:0 0 28px;">
  <span style="display:inline-block;font-size:44px;font-weight:700;letter-spacing:12px;color:#005F2D;font-family:'Courier New',monospace;">${code}</span>
</div>
<p style="margin:0 0 6px;font-size:12px;color:#999999;text-align:center;">${s.expiry}</p>
<p style="margin:0;font-size:12px;color:#999999;text-align:center;">${s.security}</p>
`, lang),
  };
}

/* ─── OTP – Login ─── */
export function otpLoginEmail(code: string, lang: "de" | "fr" = "de") {
  const s = lang === "fr" ? {
    subject: "Votre code de connexion – KT Bank",
    title: "Votre code de connexion",
    intro: "Utilisez ce code pour accéder à votre espace KT Bank.",
    expiry: "Valable 10 minutes.",
    security: "Ne communiquez jamais ce code à personne.",
  } : {
    subject: "Ihr Anmeldecode – KT Bank",
    title: "Ihr Anmeldecode",
    intro: "Verwenden Sie diesen Code, um sich in Ihr KT Bank Konto einzuloggen.",
    expiry: "Gültig für 10 Minuten.",
    security: "Teilen Sie diesen Code niemals mit Dritten.",
  };
  return {
    subject: s.subject,
    html: base(`
<h1 style="margin:0 0 10px;font-size:22px;font-weight:700;color:#111111;text-align:center;">${s.title}</h1>
<p style="margin:0 0 32px;font-size:14px;color:#666666;text-align:center;line-height:1.5;">${s.intro}</p>
<div style="text-align:center;margin:0 0 28px;">
  <span style="display:inline-block;font-size:44px;font-weight:700;letter-spacing:12px;color:#005F2D;font-family:'Courier New',monospace;">${code}</span>
</div>
<p style="margin:0 0 6px;font-size:12px;color:#999999;text-align:center;">${s.expiry}</p>
<p style="margin:0;font-size:12px;color:#999999;text-align:center;">${s.security}</p>
`, lang),
  };
}

/* ─── Welcome ─── */
export function welcomeEmail(prenom: string, iban: string, lang: "de" | "fr" = "de") {
  const s = lang === "fr" ? {
    subject: `Bienvenue chez KT Bank, ${prenom} !`,
    title: `Bienvenue, ${prenom} !`,
    intro: "Votre compte courant KT Bank est ouvert. Vous avez accès à tous vos services bancaires.",
    ibanLabel: "Votre IBAN",
    bic: "BIC",
    cta: "Accéder à mon espace",
    features: [
      "Compte courant gratuit sans frais de tenue",
      "SEPA Instant Payment en moins de 10 secondes",
      "Carte Visa Débit gratuite",
      "100 % halal &mdash; certifié par notre Shariah Board",
    ],
  } : {
    subject: `Willkommen bei KT Bank, ${prenom}!`,
    title: `Herzlich willkommen, ${prenom}!`,
    intro: "Ihr KT Bank Girokonto ist eröffnet. Sie können jetzt alle Banking-Services nutzen.",
    ibanLabel: "Ihre IBAN",
    bic: "BIC",
    cta: "Zu meinem Konto",
    features: [
      "Kostenloses Girokonto ohne Kontoführungsgebühren",
      "SEPA Instant Payment in unter 10 Sekunden",
      "Kostenlose Visa-Debitkarte",
      "100 % halal &mdash; zertifiziert durch unser Shariah Board",
    ],
  };
  return {
    subject: s.subject,
    html: base(`
<h1 style="margin:0 0 10px;font-size:22px;font-weight:700;color:#111111;">${s.title}</h1>
<p style="margin:0 0 24px;font-size:14px;color:#666666;line-height:1.5;">${s.intro}</p>
<div style="background:#f0faf4;border-radius:8px;padding:18px 20px;margin:0 0 24px;">
  <p style="margin:0 0 4px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#005F2D;">${s.ibanLabel}</p>
  <p style="margin:0 0 10px;font-size:16px;font-weight:700;font-family:'Courier New',monospace;color:#111111;word-break:break-all;">${iban}</p>
  <p style="margin:0;font-size:12px;color:#666666;">${s.bic}: <strong>KTAGDEFF</strong></p>
</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
  ${s.features.map(f => `<tr><td style="padding:4px 0;font-size:13px;color:#444444;">&#10003; &nbsp;${f}</td></tr>`).join("")}
</table>
<div style="text-align:center;">
  <a href="${DASHBOARD_URL}" style="display:inline-block;background:#005F2D;color:#ffffff;font-weight:700;font-size:14px;padding:13px 28px;border-radius:6px;text-decoration:none;">${s.cta}</a>
</div>
`, lang),
  };
}

/* ─── Transaction notification ─── */
export function transactionEmail(opts: {
  prenom: string;
  type: "credit" | "debit";
  amount: number;
  currency: string;
  description: string;
  balance: number;
  lang?: "de" | "fr";
}) {
  const { prenom, type, amount, currency, description, balance, lang = "de" } = opts;
  const isCredit = type === "credit";
  const s = lang === "fr" ? {
    subject: isCredit ? `Virement reçu : +${amount.toFixed(2)} ${currency}` : `Débit : -${amount.toFixed(2)} ${currency}`,
    title: isCredit ? "Virement reçu" : "Débit effectué",
    intro: isCredit ? `Un montant a été crédité sur votre compte, ${prenom}.` : `Un débit a été effectué sur votre compte, ${prenom}.`,
    amountLabel: isCredit ? "Montant reçu" : "Montant débité",
    descLabel: "Motif",
    balanceLabel: "Solde actuel",
    cta: "Voir mes transactions",
  } : {
    subject: isCredit ? `Gutschrift: +${amount.toFixed(2)} ${currency}` : `Abbuchung: -${amount.toFixed(2)} ${currency}`,
    title: isCredit ? "Geldeingang" : "Kontoabbuchung",
    intro: isCredit ? `Auf Ihrem Konto ist ein Betrag eingegangen, ${prenom}.` : `Eine Abbuchung wurde ausgeführt, ${prenom}.`,
    amountLabel: isCredit ? "Eingegangener Betrag" : "Abgebuchter Betrag",
    descLabel: "Verwendungszweck",
    balanceLabel: "Kontostand",
    cta: "Transaktionen ansehen",
  };
  const color = isCredit ? "#005F2D" : "#dc2626";
  const sign = isCredit ? "+" : "-";
  return {
    subject: s.subject,
    html: base(`
<h1 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#111111;">${s.title}</h1>
<p style="margin:0 0 24px;font-size:14px;color:#666666;line-height:1.5;">${s.intro}</p>
<div style="border-left:4px solid ${color};padding:14px 18px;background:#f9f9f9;border-radius:0 6px 6px 0;margin:0 0 24px;">
  <p style="margin:0 0 2px;font-size:11px;color:#999999;text-transform:uppercase;letter-spacing:0.06em;">${s.amountLabel}</p>
  <p style="margin:0 0 14px;font-size:30px;font-weight:700;color:${color};">${sign}${amount.toFixed(2)} ${currency}</p>
  <p style="margin:0 0 2px;font-size:11px;color:#999999;text-transform:uppercase;letter-spacing:0.06em;">${s.descLabel}</p>
  <p style="margin:0 0 14px;font-size:13px;color:#444444;">${description}</p>
  <p style="margin:0 0 2px;font-size:11px;color:#999999;text-transform:uppercase;letter-spacing:0.06em;">${s.balanceLabel}</p>
  <p style="margin:0;font-size:14px;font-weight:700;color:#111111;">${balance.toFixed(2)} ${currency}</p>
</div>
<div style="text-align:center;">
  <a href="${DASHBOARD_URL}" style="display:inline-block;background:#005F2D;color:#ffffff;font-weight:700;font-size:13px;padding:12px 24px;border-radius:6px;text-decoration:none;">${s.cta}</a>
</div>
`, lang),
  };
}

/* ─── Bank message notification ─── */
export function bankMessageEmail(opts: { prenom: string; messagePreview: string; lang?: "de" | "fr" }) {
  const { prenom, messagePreview, lang = "de" } = opts;
  const s = lang === "fr" ? {
    subject: "Nouveau message de KT Bank",
    title: `Nouveau message, ${prenom}`,
    intro: "Vous avez reçu un nouveau message de votre conseiller KT Bank :",
    cta: "Lire le message",
  } : {
    subject: "Neue Nachricht von KT Bank",
    title: `Neue Nachricht, ${prenom}`,
    intro: "Sie haben eine neue Nachricht von Ihrem Berater bei KT Bank erhalten:",
    cta: "Nachricht lesen",
  };
  return {
    subject: s.subject,
    html: base(`
<h1 style="margin:0 0 10px;font-size:20px;font-weight:700;color:#111111;">${s.title}</h1>
<p style="margin:0 0 20px;font-size:14px;color:#666666;line-height:1.5;">${s.intro}</p>
<div style="border-left:4px solid #005F2D;padding:14px 18px;background:#f0faf4;border-radius:0 6px 6px 0;margin:0 0 28px;">
  <p style="margin:0;font-size:14px;color:#444444;line-height:1.6;font-style:italic;">"${messagePreview}&hellip;"</p>
</div>
<div style="text-align:center;">
  <a href="${DASHBOARD_URL}" style="display:inline-block;background:#005F2D;color:#ffffff;font-weight:700;font-size:13px;padding:12px 24px;border-radius:6px;text-decoration:none;">${s.cta}</a>
</div>
`, lang),
  };
}

/* ─── Security alert ─── */
export function securityAlertEmail(prenom: string, reason: string, lang: "de" | "fr" = "de") {
  const s = lang === "fr" ? {
    subject: "Alerte sécurité – KT Bank",
    title: `Alerte sécurité, ${prenom}`,
    intro: "Nous souhaitons vous informer de ce qui suit :",
    cta: "Contacter le support",
    phone: "+49 69 255 10 200",
  } : {
    subject: "Sicherheitshinweis – KT Bank",
    title: `Sicherheitshinweis, ${prenom}`,
    intro: "Wir möchten Sie auf folgendes aufmerksam machen:",
    cta: "Support kontaktieren",
    phone: "+49 69 255 10 200",
  };
  return {
    subject: s.subject,
    html: base(`
<h1 style="margin:0 0 10px;font-size:20px;font-weight:700;color:#111111;text-align:center;">${s.title}</h1>
<p style="margin:0 0 20px;font-size:14px;color:#666666;text-align:center;line-height:1.5;">${s.intro}</p>
<div style="border:1px solid #fecaca;background:#fef2f2;border-radius:6px;padding:14px 18px;margin:0 0 24px;">
  <p style="margin:0;font-size:14px;color:#991b1b;line-height:1.5;">${reason}</p>
</div>
<div style="text-align:center;margin:0 0 14px;">
  <a href="${CONTACT_URL}" style="display:inline-block;background:#dc2626;color:#ffffff;font-weight:700;font-size:13px;padding:12px 24px;border-radius:6px;text-decoration:none;">${s.cta}</a>
</div>
<p style="text-align:center;font-size:13px;font-weight:700;color:#005F2D;margin:0;">${s.phone}</p>
`, lang),
  };
}
