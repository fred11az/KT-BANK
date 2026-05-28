/* ─── Shared brand styles ─── */
const base = (content: string) => `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>KT Bank</title>
</head>
<body style="margin:0;padding:0;background:#F4F4F4;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F4F4;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:white;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.07);">
        <!-- Header -->
        <tr>
          <td style="background:#005F2D;padding:28px 32px;text-align:center;">
            <table cellpadding="0" cellspacing="0" style="display:inline-block;">
              <tr>
                <td style="background:rgba(255,255,255,0.18);border-radius:50%;width:36px;height:36px;text-align:center;vertical-align:middle;">
                  <span style="color:white;font-weight:900;font-size:13px;line-height:36px;">KT</span>
                </td>
                <td style="padding-left:8px;vertical-align:middle;">
                  <span style="color:white;font-weight:900;font-size:20px;letter-spacing:-0.5px;">Bank</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Body -->
        <tr><td style="padding:32px;">${content}</td></tr>
        <!-- Footer -->
        <tr>
          <td style="background:#F9F9F9;padding:20px 32px;border-top:1px solid #F0F0F0;text-align:center;">
            <p style="margin:0 0 6px;font-size:11px;color:#9CA3AF;">KT Bank AG · BaFin-reguliert · BIC: KTAGDEFF</p>
            <p style="margin:0;font-size:11px;color:#9CA3AF;">
              <a href="#" style="color:#9CA3AF;text-decoration:none;">Datenschutz</a> &nbsp;·&nbsp;
              <a href="#" style="color:#9CA3AF;text-decoration:none;">Impressum</a> &nbsp;·&nbsp;
              <a href="https://kt-bank.de" style="color:#9CA3AF;text-decoration:none;">kt-bank.de</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
`;

/* ─── OTP – Registration ─── */
export function otpRegistrationEmail(code: string, email: string, lang: "de" | "fr" = "de") {
  const de = {
    subject: "Ihr Bestätigungscode – KT Bank",
    greeting: "Willkommen bei KT Bank!",
    intro: "Nutzen Sie den folgenden Code, um Ihre E-Mail-Adresse zu bestätigen:",
    validity: "Dieser Code ist <strong>10 Minuten</strong> gültig.",
    ignore: "Wenn Sie kein Konto bei KT Bank erstellt haben, ignorieren Sie diese E-Mail bitte.",
    security: "Teilen Sie diesen Code niemals mit Dritten.",
  };
  const fr = {
    subject: "Votre code de vérification – KT Bank",
    greeting: "Bienvenue chez KT Bank !",
    intro: "Utilisez le code suivant pour vérifier votre adresse e-mail :",
    validity: "Ce code est valable <strong>10 minutes</strong>.",
    ignore: "Si vous n'avez pas créé de compte KT Bank, ignorez cet e-mail.",
    security: "Ne partagez jamais ce code avec qui que ce soit.",
  };
  const s = lang === "fr" ? fr : de;
  return {
    subject: s.subject,
    html: base(`
      <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#111827;">${s.greeting}</h1>
      <p style="margin:0 0 28px;font-size:15px;color:#6B7280;line-height:1.6;">${s.intro}</p>
      <div style="text-align:center;margin:0 0 28px;">
        <div style="display:inline-block;background:#F0FAF4;border:2px dashed #005F2D;border-radius:16px;padding:20px 40px;">
          <span style="font-size:40px;font-weight:900;letter-spacing:10px;color:#005F2D;font-family:monospace;">${code}</span>
        </div>
      </div>
      <p style="margin:0 0 10px;font-size:13px;color:#9CA3AF;">${s.validity}</p>
      <p style="margin:0 0 10px;font-size:13px;color:#9CA3AF;">${s.ignore}</p>
      <p style="margin:0;font-size:13px;color:#EF4444;font-weight:600;">⚠️ ${s.security}</p>
    `),
  };
}

/* ─── OTP – Login ─── */
export function otpLoginEmail(code: string, lang: "de" | "fr" = "de") {
  const de = {
    subject: "Ihr Anmeldecode – KT Bank",
    title: "Ihr Anmeldecode",
    intro: "Verwenden Sie diesen Code, um sich in Ihr KT Bank Konto einzuloggen:",
    validity: "Gültig für <strong>10 Minuten</strong>. Wenn Sie sich nicht angemeldet haben, ignorieren Sie diese E-Mail.",
    security: "Teilen Sie diesen Code niemals mit Dritten.",
  };
  const fr = {
    subject: "Votre code de connexion – KT Bank",
    title: "Votre code de connexion",
    intro: "Utilisez ce code pour vous connecter à votre espace KT Bank :",
    validity: "Valable <strong>10 minutes</strong>. Si vous n'avez pas tenté de connexion, ignorez cet e-mail.",
    security: "Ne partagez jamais ce code avec qui que ce soit.",
  };
  const s = lang === "fr" ? fr : de;
  return {
    subject: s.subject,
    html: base(`
      <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#111827;">${s.title}</h1>
      <p style="margin:0 0 28px;font-size:15px;color:#6B7280;line-height:1.6;">${s.intro}</p>
      <div style="text-align:center;margin:0 0 28px;">
        <div style="display:inline-block;background:#F0FAF4;border:2px dashed #005F2D;border-radius:16px;padding:20px 40px;">
          <span style="font-size:40px;font-weight:900;letter-spacing:10px;color:#005F2D;font-family:monospace;">${code}</span>
        </div>
      </div>
      <p style="margin:0 0 10px;font-size:13px;color:#9CA3AF;">${s.validity}</p>
      <p style="margin:0;font-size:13px;color:#EF4444;font-weight:600;">⚠️ ${s.security}</p>
    `),
  };
}

/* ─── Welcome (after registration completed) ─── */
export function welcomeEmail(prenom: string, iban: string, lang: "de" | "fr" = "de") {
  const de = {
    subject: `Willkommen bei KT Bank, ${prenom}!`,
    title: `Herzlich willkommen, ${prenom}!`,
    intro: "Ihr KT Bank Girokonto ist eröffnet. Sie können jetzt alle Banking-Services nutzen.",
    ibanLabel: "Ihre IBAN",
    bicLabel: "BIC",
    ctaText: "Zu meinem Konto",
    features: [
      "✓ Kostenloses Girokonto ohne Kontoführungsgebühren",
      "✓ SEPA Instant Payment – Geld in unter 10 Sekunden",
      "✓ Kostenlose Visa-Debitkarte",
      "✓ 100% halal – zertifiziert durch unser Shariah Board",
    ],
  };
  const fr = {
    subject: `Bienvenue chez KT Bank, ${prenom} !`,
    title: `Bienvenue, ${prenom} !`,
    intro: "Votre compte courant KT Bank est ouvert. Vous pouvez dès à présent accéder à tous vos services bancaires.",
    ibanLabel: "Votre IBAN",
    bicLabel: "BIC",
    ctaText: "Accéder à mon espace",
    features: [
      "✓ Compte courant gratuit sans frais de tenue",
      "✓ SEPA Instant Payment – argent reçu en moins de 10 secondes",
      "✓ Carte Visa Débit gratuite",
      "✓ 100% halal – certifié par notre Shariah Board",
    ],
  };
  const s = lang === "fr" ? fr : de;
  return {
    subject: s.subject,
    html: base(`
      <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#111827;">${s.title}</h1>
      <p style="margin:0 0 24px;font-size:15px;color:#6B7280;line-height:1.6;">${s.intro}</p>
      <div style="background:#F0FAF4;border-radius:12px;padding:20px 24px;margin:0 0 24px;">
        <p style="margin:0 0 6px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#005F2D;">${s.ibanLabel}</p>
        <p style="margin:0 0 12px;font-size:17px;font-weight:700;font-family:monospace;color:#111827;letter-spacing:0.05em;">${iban}</p>
        <p style="margin:0;font-size:12px;color:#6B7280;">${s.bicLabel}: <strong>KTAGDEFF</strong></p>
      </div>
      <div style="margin:0 0 28px;">
        ${s.features.map((f) => `<p style="margin:0 0 8px;font-size:14px;color:#374151;">${f}</p>`).join("")}
      </div>
      <div style="text-align:center;">
        <a href="https://kt-bank.de/client/dashboard" style="display:inline-block;background:#005F2D;color:white;font-weight:700;font-size:15px;padding:14px 32px;border-radius:999px;text-decoration:none;">${s.ctaText}</a>
      </div>
    `),
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
  const de = {
    subject: isCredit
      ? `Gutschrift von ${amount.toFixed(2)} ${currency} erhalten`
      : `Abbuchung von ${amount.toFixed(2)} ${currency}`,
    title: isCredit ? "Geldeingang" : "Kontoabbuchung",
    intro: isCredit
      ? `Auf Ihrem Konto ist ein Betrag eingegangen, ${prenom}.`
      : `Eine Abbuchung wurde auf Ihrem Konto ausgeführt, ${prenom}.`,
    amountLabel: isCredit ? "Eingegangener Betrag" : "Abgebuchter Betrag",
    descLabel: "Verwendungszweck",
    balanceLabel: "Aktueller Kontostand",
    ctaText: "Transaktionen ansehen",
  };
  const fr = {
    subject: isCredit
      ? `Virement reçu de ${amount.toFixed(2)} ${currency}`
      : `Débit de ${amount.toFixed(2)} ${currency}`,
    title: isCredit ? "Virement reçu" : "Débit effectué",
    intro: isCredit
      ? `Un montant a été crédité sur votre compte, ${prenom}.`
      : `Un débit a été effectué sur votre compte, ${prenom}.`,
    amountLabel: isCredit ? "Montant reçu" : "Montant débité",
    descLabel: "Motif",
    balanceLabel: "Solde actuel",
    ctaText: "Voir mes transactions",
  };
  const s = lang === "fr" ? fr : de;
  const amountColor = isCredit ? "#005F2D" : "#DC2626";
  const sign = isCredit ? "+" : "-";
  return {
    subject: s.subject,
    html: base(`
      <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#111827;">${s.title}</h1>
      <p style="margin:0 0 24px;font-size:15px;color:#6B7280;line-height:1.6;">${s.intro}</p>
      <div style="background:#F9F9F9;border-radius:12px;padding:20px 24px;margin:0 0 24px;border-left:4px solid ${amountColor};">
        <p style="margin:0 0 4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#9CA3AF;">${s.amountLabel}</p>
        <p style="margin:0 0 16px;font-size:32px;font-weight:900;color:${amountColor};">${sign}${amount.toFixed(2)} ${currency}</p>
        <p style="margin:0 0 4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#9CA3AF;">${s.descLabel}</p>
        <p style="margin:0 0 16px;font-size:14px;color:#374151;">${description}</p>
        <p style="margin:0 0 4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#9CA3AF;">${s.balanceLabel}</p>
        <p style="margin:0;font-size:16px;font-weight:700;color:#111827;">${balance.toFixed(2)} ${currency}</p>
      </div>
      <div style="text-align:center;">
        <a href="https://kt-bank.de/client/dashboard" style="display:inline-block;background:#005F2D;color:white;font-weight:700;font-size:14px;padding:13px 28px;border-radius:999px;text-decoration:none;">${s.ctaText}</a>
      </div>
    `),
  };
}

/* ─── Bank message / chat notification ─── */
export function bankMessageEmail(opts: {
  prenom: string;
  messagePreview: string;
  lang?: "de" | "fr";
}) {
  const { prenom, messagePreview, lang = "de" } = opts;
  const de = {
    subject: "Neue Nachricht von KT Bank",
    title: `Neue Nachricht, ${prenom}`,
    intro: "Sie haben eine neue Nachricht von Ihrem Berater bei KT Bank erhalten:",
    ctaText: "Nachricht lesen",
    unsubscribe: "Sie erhalten diese Benachrichtigungen, weil Sie KT Bank-Kunde sind.",
  };
  const fr = {
    subject: "Nouveau message de KT Bank",
    title: `Nouveau message, ${prenom}`,
    intro: "Vous avez reçu un nouveau message de votre conseiller KT Bank :",
    ctaText: "Lire le message",
    unsubscribe: "Vous recevez ces notifications en tant que client KT Bank.",
  };
  const s = lang === "fr" ? fr : de;
  return {
    subject: s.subject,
    html: base(`
      <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#111827;">${s.title}</h1>
      <p style="margin:0 0 20px;font-size:15px;color:#6B7280;line-height:1.6;">${s.intro}</p>
      <div style="background:#F0FAF4;border-left:4px solid #005F2D;border-radius:0 12px 12px 0;padding:16px 20px;margin:0 0 28px;">
        <p style="margin:0;font-size:15px;color:#374151;line-height:1.6;font-style:italic;">"${messagePreview}…"</p>
      </div>
      <div style="text-align:center;">
        <a href="https://kt-bank.de/client/dashboard" style="display:inline-block;background:#005F2D;color:white;font-weight:700;font-size:14px;padding:13px 28px;border-radius:999px;text-decoration:none;">${s.ctaText}</a>
      </div>
      <p style="margin:24px 0 0;font-size:11px;color:#9CA3AF;text-align:center;">${s.unsubscribe}</p>
    `),
  };
}

/* ─── Account frozen / security alert ─── */
export function securityAlertEmail(prenom: string, reason: string, lang: "de" | "fr" = "de") {
  const de = {
    subject: "⚠️ Sicherheitshinweis – KT Bank",
    title: `Sicherheitshinweis, ${prenom}`,
    intro: "Wir möchten Sie auf folgendes aufmerksam machen:",
    ctaText: "Support kontaktieren",
    phone: "📞 +49 69 255 10 200",
  };
  const fr = {
    subject: "⚠️ Alerte sécurité – KT Bank",
    title: `Alerte sécurité, ${prenom}`,
    intro: "Nous souhaitons vous informer de ce qui suit :",
    ctaText: "Contacter le support",
    phone: "📞 +49 69 255 10 200",
  };
  const s = lang === "fr" ? fr : de;
  return {
    subject: s.subject,
    html: base(`
      <div style="text-align:center;margin:0 0 20px;">
        <div style="display:inline-block;background:#FEE2E2;border-radius:50%;width:56px;height:56px;line-height:56px;font-size:24px;">⚠️</div>
      </div>
      <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#111827;text-align:center;">${s.title}</h1>
      <p style="margin:0 0 20px;font-size:15px;color:#6B7280;line-height:1.6;text-align:center;">${s.intro}</p>
      <div style="background:#FEF2F2;border:1px solid #FECACA;border-radius:12px;padding:16px 20px;margin:0 0 24px;">
        <p style="margin:0;font-size:15px;color:#991B1B;line-height:1.6;">${reason}</p>
      </div>
      <div style="text-align:center;margin:0 0 16px;">
        <a href="https://kt-bank.de/contact" style="display:inline-block;background:#DC2626;color:white;font-weight:700;font-size:14px;padding:13px 28px;border-radius:999px;text-decoration:none;">${s.ctaText}</a>
      </div>
      <p style="text-align:center;font-size:14px;color:#005F2D;font-weight:600;">${s.phone}</p>
    `),
  };
}
