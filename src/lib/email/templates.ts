const LOGO_URL = "https://kt-bank-ag.com/kt-logo.png";
const DASHBOARD_URL = "https://kt-bank-ag.com/client/dashboard";
const CONTACT_URL = "https://kt-bank-ag.com/contact";

type EL = "de" | "fr" | "en" | "ar" | "tr" | "es" | "it" | "pt" | "nl";

function L<T extends object>(lang: string, variants: { de: T } & Partial<Record<EL, T>>): T {
  return (variants as Record<string, T>)[lang] ?? (variants as Record<string, T>).en ?? variants.de;
}

const base = (content: string, lang: string = "de") => `<!DOCTYPE html>
<html lang="${lang}" dir="${lang === "ar" ? "rtl" : "ltr"}">
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
    <td align="center" style="background:linear-gradient(135deg,#002d15,#005F2D);padding:24px 32px;">
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
export function otpRegistrationEmail(code: string, _email: string, lang: string = "de") {
  const s = L(lang, {
    de: {
      subject: "Bestätigen Sie Ihre E-Mail-Adresse – KT Bank",
      title: "Bestätigen Sie Ihre E-Mail-Adresse",
      intro: "Bitte geben Sie den Bestätigungscode in die Felder ein.",
      expiry: "Gültig für 10 Minuten.",
      security: "Teilen Sie diesen Code niemals mit Dritten.",
    },
    fr: {
      subject: "Votre code de vérification – KT Bank",
      title: "Confirmez votre adresse e-mail",
      intro: "Saisissez le code ci-dessous dans les champs de saisie.",
      expiry: "Valable 10 minutes.",
      security: "Ne communiquez jamais ce code à personne.",
    },
    en: {
      subject: "Verify your email – KT Bank",
      title: "Verify your email address",
      intro: "Enter the verification code in the fields below.",
      expiry: "Valid for 10 minutes.",
      security: "Never share this code with anyone.",
    },
    ar: {
      subject: "تأكيد بريدك الإلكتروني – KT Bank",
      title: "أكّد عنوان بريدك الإلكتروني",
      intro: "أدخل رمز التحقق في الحقول أدناه.",
      expiry: "صالح لمدة 10 دقائق.",
      security: "لا تشارك هذا الرمز مع أي شخص أبداً.",
    },
    tr: {
      subject: "E-postanızı doğrulayın – KT Bank",
      title: "E-posta adresinizi doğrulayın",
      intro: "Doğrulama kodunu aşağıdaki alanlara girin.",
      expiry: "10 dakika geçerlidir.",
      security: "Bu kodu asla kimseyle paylaşmayın.",
    },
    es: {
      subject: "Verifica tu correo – KT Bank",
      title: "Verifica tu dirección de correo",
      intro: "Enter the verification code in the fields below.",
      expiry: "Valid for 10 minutes.",
      security: "Never share this code with anyone.",
    },
    it: {
      subject: "Verifica la tua email – KT Bank",
      title: "Verifica il tuo indirizzo email",
      intro: "Enter the verification code in the fields below.",
      expiry: "Valid for 10 minutes.",
      security: "Never share this code with anyone.",
    },
    pt: {
      subject: "Verifique seu e-mail – KT Bank",
      title: "Verifique seu endereço de e-mail",
      intro: "Enter the verification code in the fields below.",
      expiry: "Valid for 10 minutes.",
      security: "Never share this code with anyone.",
    },
    nl: {
      subject: "Bevestig uw e-mail – KT Bank",
      title: "Bevestig uw e-mailadres",
      intro: "Enter the verification code in the fields below.",
      expiry: "Valid for 10 minutes.",
      security: "Never share this code with anyone.",
    },
  });
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
export function otpLoginEmail(code: string, lang: string = "de") {
  const s = L(lang, {
    de: {
      subject: "Ihr Anmeldecode – KT Bank",
      title: "Ihr Anmeldecode",
      intro: "Verwenden Sie diesen Code, um sich in Ihr KT Bank Konto einzuloggen.",
      expiry: "Gültig für 10 Minuten.",
      security: "Teilen Sie diesen Code niemals mit Dritten.",
    },
    fr: {
      subject: "Votre code de connexion – KT Bank",
      title: "Votre code de connexion",
      intro: "Utilisez ce code pour accéder à votre espace KT Bank.",
      expiry: "Valable 10 minutes.",
      security: "Ne communiquez jamais ce code à personne.",
    },
    en: {
      subject: "Your login code – KT Bank",
      title: "Your login code",
      intro: "Use this code to access your KT Bank account.",
      expiry: "Valid for 10 minutes.",
      security: "Never share this code with anyone.",
    },
    ar: {
      subject: "رمز تسجيل الدخول – KT Bank",
      title: "رمز تسجيل الدخول",
      intro: "استخدم هذا الرمز للوصول إلى حسابك في KT Bank.",
      expiry: "صالح لمدة 10 دقائق.",
      security: "لا تشارك هذا الرمز مع أي شخص أبداً.",
    },
    tr: {
      subject: "Giriş kodunuz – KT Bank",
      title: "Giriş kodunuz",
      intro: "KT Bank hesabınıza giriş yapmak için bu kodu kullanın.",
      expiry: "10 dakika geçerlidir.",
      security: "Bu kodu asla kimseyle paylaşmayın.",
    },
    es: {
      subject: "Tu código de acceso – KT Bank",
      title: "Tu código de acceso",
      intro: "Use this code to access your KT Bank account.",
      expiry: "Valid for 10 minutes.",
      security: "Never share this code with anyone.",
    },
    it: {
      subject: "Il tuo codice di accesso – KT Bank",
      title: "Il tuo codice di accesso",
      intro: "Use this code to access your KT Bank account.",
      expiry: "Valid for 10 minutes.",
      security: "Never share this code with anyone.",
    },
    pt: {
      subject: "Seu código de acesso – KT Bank",
      title: "Seu código de acesso",
      intro: "Use this code to access your KT Bank account.",
      expiry: "Valid for 10 minutes.",
      security: "Never share this code with anyone.",
    },
    nl: {
      subject: "Uw inlogcode – KT Bank",
      title: "Uw inlogcode",
      intro: "Use this code to access your KT Bank account.",
      expiry: "Valid for 10 minutes.",
      security: "Never share this code with anyone.",
    },
  });
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
export function welcomeEmail(prenom: string, iban: string, lang: string = "de") {
  const s = L(lang, {
    de: {
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
    },
    fr: {
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
    },
    en: {
      subject: `Welcome to KT Bank, ${prenom}!`,
      title: `Welcome, ${prenom}!`,
      intro: "Your KT Bank current account is open. You now have access to all your banking services.",
      ibanLabel: "Your IBAN",
      bic: "BIC",
      cta: "Go to my account",
      features: [
        "Free current account with no maintenance fees",
        "SEPA Instant Payment in under 10 seconds",
        "Free Visa Debit card",
        "100% halal — certified by our Shariah Board",
      ],
    },
    ar: {
      subject: `مرحباً بك في KT Bank، ${prenom}!`,
      title: `مرحباً بك، ${prenom}!`,
      intro: "تم فتح حسابك الجاري في KT Bank. يمكنك الآن الوصول إلى جميع خدماتك المصرفية.",
      ibanLabel: "رقم IBAN الخاص بك",
      bic: "BIC",
      cta: "الذهاب إلى حسابي",
      features: [
        "حساب جاري مجاني بدون رسوم إدارة",
        "SEPA Instant Payment في أقل من 10 ثوانٍ",
        "بطاقة Visa Debit مجانية",
        "100% حلال — معتمد من مجلس الشريعة لدينا",
      ],
    },
    tr: {
      subject: `KT Bank'a Hoş Geldiniz, ${prenom}!`,
      title: `Hoş Geldiniz, ${prenom}!`,
      intro: "KT Bank vadesiz hesabınız açıldı. Tüm bankacılık hizmetlerinize artık erişebilirsiniz.",
      ibanLabel: "IBAN numaranız",
      bic: "BIC",
      cta: "Hesabıma git",
      features: [
        "Ücretsiz vadesiz hesap, işletim ücreti yok",
        "10 saniyeden kısa sürede SEPA Instant Payment",
        "Ücretsiz Visa Debit kartı",
        "100% helal — Şeria Kurulumuz tarafından sertifikalı",
      ],
    },
    es: {
      subject: `Bienvenido a KT Bank, ${prenom}!`,
      title: `Bienvenido, ${prenom}!`,
      intro: "Your KT Bank account is open. You can now access all your banking services.",
      ibanLabel: "Your IBAN",
      bic: "BIC",
      cta: "Go to my account",
      features: [
        "Free current account with no maintenance fees",
        "SEPA Instant Payment in under 10 seconds",
        "Free Visa Debit card",
        "100% halal — certified by our Shariah Board",
      ],
    },
    it: {
      subject: `Benvenuto in KT Bank, ${prenom}!`,
      title: `Benvenuto, ${prenom}!`,
      intro: "Your KT Bank account is open. You can now access all your banking services.",
      ibanLabel: "Your IBAN",
      bic: "BIC",
      cta: "Go to my account",
      features: [
        "Free current account with no maintenance fees",
        "SEPA Instant Payment in under 10 seconds",
        "Free Visa Debit card",
        "100% halal — certified by our Shariah Board",
      ],
    },
    pt: {
      subject: `Bem-vindo ao KT Bank, ${prenom}!`,
      title: `Bem-vindo, ${prenom}!`,
      intro: "Your KT Bank account is open. You can now access all your banking services.",
      ibanLabel: "Your IBAN",
      bic: "BIC",
      cta: "Go to my account",
      features: [
        "Free current account with no maintenance fees",
        "SEPA Instant Payment in under 10 seconds",
        "Free Visa Debit card",
        "100% halal — certified by our Shariah Board",
      ],
    },
    nl: {
      subject: `Welkom bij KT Bank, ${prenom}!`,
      title: `Welkom, ${prenom}!`,
      intro: "Your KT Bank account is open. You can now access all your banking services.",
      ibanLabel: "Your IBAN",
      bic: "BIC",
      cta: "Go to my account",
      features: [
        "Free current account with no maintenance fees",
        "SEPA Instant Payment in under 10 seconds",
        "Free Visa Debit card",
        "100% halal — certified by our Shariah Board",
      ],
    },
  });
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
  lang?: string;
}) {
  const { prenom, type, amount, currency, description, balance, lang = "de" } = opts;
  const isCredit = type === "credit";
  const s = L(lang, {
    de: {
      subject: isCredit ? `Gutschrift: +${amount.toFixed(2)} ${currency}` : `Abbuchung: -${amount.toFixed(2)} ${currency}`,
      title: isCredit ? "Geldeingang" : "Kontoabbuchung",
      intro: isCredit ? `Auf Ihrem Konto ist ein Betrag eingegangen, ${prenom}.` : `Eine Abbuchung wurde ausgeführt, ${prenom}.`,
      amountLabel: isCredit ? "Eingegangener Betrag" : "Abgebuchter Betrag",
      descLabel: "Verwendungszweck",
      balanceLabel: "Kontostand",
      cta: "Transaktionen ansehen",
    },
    fr: {
      subject: isCredit ? `Virement reçu : +${amount.toFixed(2)} ${currency}` : `Débit : -${amount.toFixed(2)} ${currency}`,
      title: isCredit ? "Virement reçu" : "Débit effectué",
      intro: isCredit ? `Un montant a été crédité sur votre compte, ${prenom}.` : `Un débit a été effectué sur votre compte, ${prenom}.`,
      amountLabel: isCredit ? "Montant reçu" : "Montant débité",
      descLabel: "Motif",
      balanceLabel: "Solde actuel",
      cta: "Voir mes transactions",
    },
    en: {
      subject: isCredit ? `KT Bank — Credit received on your account` : `KT Bank — Debit on your account`,
      title: isCredit ? "A credit has been applied to your account" : "A debit has been applied to your account",
      intro: isCredit ? `A credit has been applied to your account, ${prenom}.` : `A debit has been applied to your account, ${prenom}.`,
      amountLabel: isCredit ? "Amount received" : "Amount debited",
      descLabel: "Description",
      balanceLabel: "New balance",
      cta: "View my account",
    },
    ar: {
      subject: isCredit ? `KT Bank — تم قيد مبلغ في حسابك` : `KT Bank — تم خصم مبلغ من حسابك`,
      title: isCredit ? "تم إضافة مبلغ إلى حسابك" : "تم خصم مبلغ من حسابك",
      intro: isCredit ? `تم إضافة مبلغ إلى حسابك، ${prenom}.` : `تم خصم مبلغ من حسابك، ${prenom}.`,
      amountLabel: isCredit ? "المبلغ المستلم" : "المبلغ المخصوم",
      descLabel: "الوصف",
      balanceLabel: "الرصيد الجديد",
      cta: "عرض حسابي",
    },
    tr: {
      subject: isCredit ? `KT Bank — Hesabınıza para yatırıldı` : `KT Bank — Hesabınızdan para çıktı`,
      title: isCredit ? "Hesabınıza para yatırıldı" : "Hesabınızdan para çıktı",
      intro: isCredit ? `Hesabınıza para yatırıldı, ${prenom}.` : `Hesabınızdan para çıktı, ${prenom}.`,
      amountLabel: isCredit ? "Yatırılan tutar" : "Çekilen tutar",
      descLabel: "Açıklama",
      balanceLabel: "Yeni bakiye",
      cta: "Hesabımı görüntüle",
    },
    es: {
      subject: isCredit ? `KT Bank — Crédito recibido en su cuenta` : `KT Bank — Débito en su cuenta`,
      title: isCredit ? "A credit has been applied to your account" : "A debit has been applied to your account",
      intro: isCredit ? `A credit has been applied to your account, ${prenom}.` : `A debit has been applied to your account, ${prenom}.`,
      amountLabel: isCredit ? "Amount received" : "Amount debited",
      descLabel: "Description",
      balanceLabel: "New balance",
      cta: "View my account",
    },
    it: {
      subject: isCredit ? `KT Bank — Credito ricevuto sul conto` : `KT Bank — Addebito sul conto`,
      title: isCredit ? "A credit has been applied to your account" : "A debit has been applied to your account",
      intro: isCredit ? `A credit has been applied to your account, ${prenom}.` : `A debit has been applied to your account, ${prenom}.`,
      amountLabel: isCredit ? "Amount received" : "Amount debited",
      descLabel: "Description",
      balanceLabel: "New balance",
      cta: "View my account",
    },
    pt: {
      subject: isCredit ? `KT Bank — Crédito recebido em sua conta` : `KT Bank — Débito em sua conta`,
      title: isCredit ? "A credit has been applied to your account" : "A debit has been applied to your account",
      intro: isCredit ? `A credit has been applied to your account, ${prenom}.` : `A debit has been applied to your account, ${prenom}.`,
      amountLabel: isCredit ? "Amount received" : "Amount debited",
      descLabel: "Description",
      balanceLabel: "New balance",
      cta: "View my account",
    },
    nl: {
      subject: isCredit ? `KT Bank — Bijschrijving op uw rekening` : `KT Bank — Afschrijving van uw rekening`,
      title: isCredit ? "A credit has been applied to your account" : "A debit has been applied to your account",
      intro: isCredit ? `A credit has been applied to your account, ${prenom}.` : `A debit has been applied to your account, ${prenom}.`,
      amountLabel: isCredit ? "Amount received" : "Amount debited",
      descLabel: "Description",
      balanceLabel: "New balance",
      cta: "View my account",
    },
  });
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
export function bankMessageEmail(opts: { prenom: string; messagePreview: string; lang?: string }) {
  const { prenom, messagePreview, lang = "de" } = opts;
  const s = L(lang, {
    de: {
      subject: "Neue Nachricht von KT Bank",
      title: `Neue Nachricht, ${prenom}`,
      intro: "Sie haben eine neue Nachricht von Ihrem Berater bei KT Bank erhalten:",
      cta: "Nachricht lesen",
    },
    fr: {
      subject: "Nouveau message de KT Bank",
      title: `Nouveau message, ${prenom}`,
      intro: "Vous avez reçu un nouveau message de votre conseiller KT Bank :",
      cta: "Lire le message",
    },
    en: {
      subject: "New message from KT Bank",
      title: `New message, ${prenom}`,
      intro: "You have received a new message from your KT Bank advisor:",
      cta: "Read message",
    },
    ar: {
      subject: "رسالة جديدة من KT Bank",
      title: `رسالة جديدة، ${prenom}`,
      intro: "لقد تلقيت رسالة جديدة من مستشارك في KT Bank:",
      cta: "قراءة الرسالة",
    },
    tr: {
      subject: "KT Bank'tan yeni mesaj",
      title: `Yeni mesaj, ${prenom}`,
      intro: "KT Bank danışmanınızdan yeni bir mesaj aldınız:",
      cta: "Mesajı oku",
    },
  });
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

/* ─── Admin: transfer fee paid notification ─── */
export function adminTransferFeeEmail(opts: {
  prenom: string; nom: string; email: string;
  amount: number; to_name: string; to_iban: string;
  fee_amount: number; reference?: string;
  payment_reference?: string; transfer_id: string;
}) {
  const ADMIN_URL = "https://kt-bank-ag.com/kt-admin";
  const rows = [
    ["Client", `${opts.prenom} ${opts.nom}`],
    ["E-mail", opts.email],
    ["Montant du virement", `${opts.amount.toFixed(2)} EUR`],
    ["Bénéficiaire", opts.to_name],
    ["IBAN bénéficiaire", opts.to_iban],
    ["Frais déclarés payés", `${opts.fee_amount.toFixed(2)} EUR`],
    ...(opts.reference ? [["Référence virement", opts.reference]] : []),
    ...(opts.payment_reference ? [["Référence paiement frais", opts.payment_reference]] : []),
    ["ID demande", opts.transfer_id],
  ];
  const tableRows = rows.map(([k, v]) => `
    <tr>
      <td style="padding:8px 12px;font-size:12px;color:#666666;border-bottom:1px solid #eeeeee;white-space:nowrap;">${k}</td>
      <td style="padding:8px 12px;font-size:13px;color:#111111;border-bottom:1px solid #eeeeee;font-weight:600;">${v || "—"}</td>
    </tr>`).join("");
  return {
    subject: `✅ Frais payés – virement ${opts.amount.toFixed(2)} € de ${opts.prenom} ${opts.nom}`,
    html: base(`
<h1 style="margin:0 0 6px;font-size:20px;font-weight:700;color:#111111;">Paiement des frais confirmé</h1>
<p style="margin:0 0 20px;font-size:13px;color:#666666;">Un client vient de confirmer le paiement de ses frais de virement. À valider dans l'espace admin.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eeeeee;border-radius:6px;overflow:hidden;margin:0 0 20px;">
  ${tableRows}
</table>
<div style="text-align:center;">
  <a href="${ADMIN_URL}/clients" style="display:inline-block;background:#005F2D;color:#ffffff;font-weight:700;font-size:13px;padding:12px 24px;border-radius:6px;text-decoration:none;">Voir le dossier client</a>
</div>
`, "fr"),
  };
}

/* ─── Admin: new client notification ─── */
export function adminNewClientEmail(client: {
  prenom: string; nom: string; email: string; telephone: string;
  pays_residence: string; nationalite: string; situation_professionnelle: string;
  revenu_mensuel: string; iban: string;
}) {
  const rows = [
    ["Prénom / Nom", `${client.prenom} ${client.nom}`],
    ["E-mail", client.email],
    ["Téléphone", client.telephone],
    ["Pays de résidence", client.pays_residence],
    ["Nationalité", client.nationalite],
    ["Situation professionnelle", client.situation_professionnelle],
    ["Revenu mensuel", client.revenu_mensuel],
    ["IBAN attribué", client.iban],
  ];
  const tableRows = rows.map(([k, v]) => `
    <tr>
      <td style="padding:8px 12px;font-size:12px;color:#666666;border-bottom:1px solid #eeeeee;white-space:nowrap;">${k}</td>
      <td style="padding:8px 12px;font-size:13px;color:#111111;border-bottom:1px solid #eeeeee;font-weight:600;">${v || "—"}</td>
    </tr>`).join("");
  return {
    subject: `Nouveau client inscrit : ${client.prenom} ${client.nom}`,
    html: base(`
<h1 style="margin:0 0 6px;font-size:20px;font-weight:700;color:#111111;">Nouveau client inscrit</h1>
<p style="margin:0 0 20px;font-size:13px;color:#666666;">Un nouveau client vient de finaliser son inscription sur KT Bank.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eeeeee;border-radius:6px;overflow:hidden;margin:0 0 20px;">
  ${tableRows}
</table>
<div style="text-align:center;">
  <a href="${DASHBOARD_URL.replace('/client','/kt-admin')}/clients" style="display:inline-block;background:#005F2D;color:#ffffff;font-weight:700;font-size:13px;padding:12px 24px;border-radius:6px;text-decoration:none;">Voir le dossier client</a>
</div>
`, "de"),
  };
}

/* ─── Admin → Client message (branded) ─── */
export function bankAdminMessageEmail(opts: { subject: string; body: string; body_html?: string }) {
  const { subject, body, body_html } = opts;

  // If rich HTML provided by admin editor, use it directly (already sanitized client-side)
  const bodyContent = body_html
    ? `<div style="font-size:14px;color:#333333;line-height:1.8;">${body_html}</div>`
    : `<div style="font-size:14px;color:#333333;line-height:1.7;margin:0 0 28px;">${body
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n/g, "<br/>")
      }</div>`;

  return {
    subject,
    html: base(`
<h2 style="margin:0 0 20px;font-size:17px;font-weight:700;color:#111111;">${subject.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}</h2>
${bodyContent}
<hr style="border:none;border-top:1px solid #eeeeee;margin:24px 0 20px;"/>
<p style="margin:0;font-size:12px;color:#999999;line-height:1.6;">
  KT Bank AG &mdash; BaFin-reguliert<br/>
  <a href="${DASHBOARD_URL}" style="color:#005F2D;text-decoration:none;">Mon espace client</a>
  &nbsp;&middot;&nbsp;
  <a href="mailto:support@kt-bank-ag.com" style="color:#005F2D;text-decoration:none;">support@kt-bank-ag.com</a>
</p>
`, "de"),
  };
}

/* ─── Transfer status ─── */
export function transferStatusEmail(opts: {
  prenom: string;
  status: "completed" | "rejected" | "processing";
  amount: number;
  currency: string;
  to_name: string;
  reference?: string;
  balance?: number;
  rejection_reason?: string;
  lang?: string;
}) {
  const { prenom, status, amount, currency, to_name, reference, balance, rejection_reason, lang = "de" } = opts;
  type Strings = { subject: string; title: string; intro: string; amountLabel: string; toLabel: string; refLabel: string; balanceLabel: string; cta: string };
  const byStatus: Record<typeof status, { fr: Strings; de: Strings }> = {
    completed: {
      fr: {
        subject: `Virement validé : -${amount.toFixed(2)} ${currency}`,
        title: "Virement validé",
        intro: `Votre virement a été approuvé par KT Bank, ${prenom}. Votre compte a été débité et le bénéficiaire recevra les fonds sous <strong>1 à 3 jours ouvrés</strong>.`,
        amountLabel: "Montant viré", toLabel: "Bénéficiaire", refLabel: "Référence", balanceLabel: "Solde actuel", cta: "Voir mes transactions",
      },
      de: {
        subject: `Überweisung genehmigt: -${amount.toFixed(2)} ${currency}`,
        title: "Überweisung genehmigt",
        intro: `Ihre Überweisung wurde von KT Bank genehmigt, ${prenom}. Ihr Konto wurde belastet. Der Empfänger erhält den Betrag innerhalb von <strong>1–3 Werktagen</strong>.`,
        amountLabel: "Überweisungsbetrag", toLabel: "Empfänger", refLabel: "Verwendungszweck", balanceLabel: "Aktueller Kontostand", cta: "Transaktionen ansehen",
      },
    },
    rejected: {
      fr: {
        subject: `Virement refusé — remboursement effectué : ${amount.toFixed(2)} ${currency}`,
        title: "Virement refusé",
        intro: `Votre demande de virement a été refusée, ${prenom}. ${rejection_reason ? `<strong>Motif :</strong> ${rejection_reason}` : "Contactez votre conseiller pour plus d'informations."}<br/><br/>Le montant de <strong>${amount.toFixed(2)} ${currency}</strong> a été <strong>remboursé sur votre compte</strong> immédiatement.`,
        amountLabel: "Montant remboursé", toLabel: "Bénéficiaire concerné", refLabel: "Référence", balanceLabel: "Solde après remboursement", cta: "Voir mon compte",
      },
      de: {
        subject: `Überweisung abgelehnt — Betrag zurückgebucht: ${amount.toFixed(2)} ${currency}`,
        title: "Überweisung abgelehnt",
        intro: `Ihr Überweisungsauftrag wurde abgelehnt, ${prenom}. ${rejection_reason ? `<strong>Ablehnungsgrund:</strong> ${rejection_reason}` : "Bitte kontaktieren Sie Ihren Berater für weitere Informationen."}<br/><br/>Der Betrag von <strong>${amount.toFixed(2)} ${currency}</strong> wurde sofort auf Ihr Konto <strong>zurückgebucht</strong>.`,
        amountLabel: "Zurückgebuchter Betrag", toLabel: "Empfänger", refLabel: "Verwendungszweck", balanceLabel: "Kontostand nach Rückbuchung", cta: "Kontostand prüfen",
      },
    },
    processing: {
      fr: {
        subject: `Virement en cours : ${amount.toFixed(2)} ${currency}`,
        title: "Virement en cours de traitement",
        intro: `Votre virement est en cours de traitement, ${prenom}. Vous recevrez une confirmation dès qu'il sera exécuté.`,
        amountLabel: "Montant", toLabel: "Bénéficiaire", refLabel: "Référence", balanceLabel: "Solde actuel", cta: "Voir mon compte",
      },
      de: {
        subject: `Überweisung in Bearbeitung: ${amount.toFixed(2)} ${currency}`,
        title: "Überweisung in Bearbeitung",
        intro: `Ihre Überweisung wird bearbeitet, ${prenom}. Sie erhalten eine Bestätigung sobald sie ausgeführt wurde.`,
        amountLabel: "Betrag", toLabel: "Empfänger", refLabel: "Verwendungszweck", balanceLabel: "Aktueller Kontostand", cta: "Konto ansehen",
      },
    },
  };
  const s = lang === "fr" ? byStatus[status].fr : byStatus[status].de;
  const color = status === "completed" ? "#005F2D" : status === "rejected" ? "#dc2626" : "#d97706";
  const ctaUrl = DASHBOARD_URL;
  const rows = [
    [s.amountLabel, `${status === "completed" ? "-" : ""}${amount.toFixed(2)} ${currency}`],
    [s.toLabel, to_name],
    ...(reference ? [[s.refLabel, reference]] : []),
    ...(balance !== undefined ? [[s.balanceLabel, `${balance.toFixed(2)} ${currency}`]] : []),
  ];
  const tableRows = rows.map(([k, v]) => `
    <tr>
      <td style="padding:8px 12px;font-size:12px;color:#999999;border-bottom:1px solid #eeeeee;white-space:nowrap;">${k}</td>
      <td style="padding:8px 12px;font-size:13px;color:#111111;border-bottom:1px solid #eeeeee;font-weight:600;">${v}</td>
    </tr>`).join("");
  return {
    subject: s.subject,
    html: base(`
<h1 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#111111;">${s.title}</h1>
<p style="margin:0 0 24px;font-size:14px;color:#666666;line-height:1.5;">${s.intro}</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eeeeee;border-radius:6px;overflow:hidden;margin:0 0 24px;">
  ${tableRows}
</table>
<div style="text-align:center;">
  <a href="${ctaUrl}" style="display:inline-block;background:${color};color:#ffffff;font-weight:700;font-size:13px;padding:12px 24px;border-radius:6px;text-decoration:none;">${s.cta}</a>
</div>
`, lang),
  };
}

/* ─── Transfer pending fee (client notification) ─── */
export function transferPendingFeeEmail(opts: {
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
  lang?: string;
}) {
  const { prenom, amount, currency, to_name, to_iban, reference, fee_amount, fee_currency, fee_payment, transfer_id, lang = "de" } = opts;
  const PAYMENT_URL = `https://kt-bank-ag.com/client/transfer-payment?id=${transfer_id}`;
  const s = lang === "fr" ? {
    subject: `Action requise : réglez les frais de traitement (${fee_amount.toFixed(2)} ${fee_currency})`,
    title: `Frais de traitement requis, ${prenom}`,
    intro: `Votre demande de virement est en attente. Pour la traiter, veuillez régler les frais de dossier ci-dessous dans les <strong>24 heures</strong>. Passé ce délai, la demande sera automatiquement annulée.`,
    summaryTitle: "Récapitulatif du virement",
    feeTitle: "Coordonnées pour le règlement des frais",
    amountLabel: "Montant", toLabel: "Bénéficiaire", ibanLabel: "IBAN bénéficiaire", refLabel: "Référence",
    feeAmountLabel: "Frais de traitement",
    bankNameLabel: "Banque / Titulaire", feeIbanLabel: "IBAN", feeBicLabel: "BIC", feeRefLabel: "Référence",
    warning: "⚠ Délai : 24 heures. Passé ce délai, votre virement sera automatiquement annulé.",
    cta: "Régler les frais maintenant",
  } : {
    subject: `Gebühr erforderlich: Bearbeitungsgebühr zahlen (${fee_amount.toFixed(2)} ${fee_currency})`,
    title: `Bearbeitungsgebühr erforderlich, ${prenom}`,
    intro: `Ihre Überweisung liegt zur Bearbeitung bereit. Um sie auszuführen, überweisen Sie bitte die Bearbeitungsgebühr innerhalb von <strong>24 Stunden</strong>. Danach wird der Auftrag automatisch storniert.`,
    summaryTitle: "Zusammenfassung Ihrer Überweisung",
    feeTitle: "Bankdaten für die Gebührenzahlung",
    amountLabel: "Betrag", toLabel: "Empfänger", ibanLabel: "IBAN Empfänger", refLabel: "Verwendungszweck",
    feeAmountLabel: "Bearbeitungsgebühr",
    bankNameLabel: "Bank / Inhaber", feeIbanLabel: "IBAN", feeBicLabel: "BIC", feeRefLabel: "Referenz",
    warning: "⚠ Frist: 24 Stunden. Danach wird Ihre Überweisung automatisch storniert.",
    cta: "Gebühr jetzt bezahlen",
  };

  const summaryRows = [
    [s.amountLabel, `${amount.toFixed(2)} ${currency}`],
    [s.toLabel, to_name],
    [s.ibanLabel, to_iban],
    ...(reference ? [[s.refLabel, reference]] : []),
  ];
  const feeRows = [
    ...(fee_payment.name ? [[s.bankNameLabel, fee_payment.name]] : []),
    ...(fee_payment.iban ? [[s.feeIbanLabel, fee_payment.iban]] : []),
    ...(fee_payment.bic ? [[s.feeBicLabel, fee_payment.bic]] : []),
    ...(fee_payment.reference ? [[s.feeRefLabel, fee_payment.reference]] : []),
    [s.feeAmountLabel, `${fee_amount.toFixed(2)} ${fee_currency}`],
  ];
  const makeRows = (rows: string[][]) => rows.map(([k, v]) => `
    <tr>
      <td style="padding:8px 12px;font-size:12px;color:#999999;border-bottom:1px solid #eeeeee;white-space:nowrap;">${k}</td>
      <td style="padding:8px 12px;font-size:13px;color:#111111;border-bottom:1px solid #eeeeee;font-weight:600;font-family:'Courier New',monospace;">${v}</td>
    </tr>`).join("");

  return {
    subject: s.subject,
    html: base(`
<h1 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#111111;">${s.title}</h1>
<p style="margin:0 0 24px;font-size:14px;color:#555555;line-height:1.6;">${s.intro}</p>

<p style="margin:0 0 8px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#666666;">${s.summaryTitle}</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eeeeee;border-radius:6px;overflow:hidden;margin:0 0 20px;">
  ${makeRows(summaryRows)}
</table>

<p style="margin:0 0 8px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#d97706;">${s.feeTitle}</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:2px solid #fde68a;border-radius:6px;overflow:hidden;margin:0 0 20px;background:#fffbf0;">
  ${makeRows(feeRows)}
</table>

<div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:6px;padding:12px 16px;margin:0 0 24px;">
  <p style="margin:0;font-size:13px;color:#92400e;font-weight:600;">${s.warning}</p>
</div>

<div style="text-align:center;">
  <a href="${PAYMENT_URL}" style="display:inline-block;background:#d97706;color:#ffffff;font-weight:700;font-size:14px;padding:13px 28px;border-radius:6px;text-decoration:none;">${s.cta}</a>
</div>
`, lang),
  };
}

/* ─── KYC approved (account now active) ─── */
export function kycApprovedEmail(opts: { prenom: string; lang?: string }) {
  const { prenom, lang = "de" } = opts;
  const s = L(lang, {
    de: {
      subject: "✅ Ihre Identität wurde verifiziert — Konto aktiv",
      title: `Identität verifiziert, ${prenom}!`,
      intro: "Ihr KYC-Verfahren wurde erfolgreich abgeschlossen. Ihr Konto ist jetzt <strong>vollständig aktiv</strong>.",
      items: ["SEPA-Überweisungen verfügbar", "Vollzugriff auf alle Dienste", "Bankkarte verfügbar"],
      cta: "Zu meinem Konto",
    },
    fr: {
      subject: "✅ Votre identité a été vérifiée — Compte actif",
      title: `Identité vérifiée, ${prenom} !`,
      intro: "Votre procédure de vérification d'identité (KYC) a été complétée avec succès. Votre compte est maintenant <strong>pleinement actif</strong>.",
      items: ["Virements SEPA disponibles", "Accès complet à tous les services", "Carte bancaire disponible"],
      cta: "Accéder à mon compte",
    },
    en: {
      subject: "KT Bank — Your identity has been verified ✓",
      title: `Your identity has been verified`,
      intro: "Your KYC verification has been approved. Your account is now fully active.",
      items: ["SEPA transfers available", "Full access to all services", "Bank card available"],
      cta: "Access my account",
    },
    ar: {
      subject: "KT Bank — تم التحقق من هويتك ✓",
      title: "تم التحقق من هويتك",
      intro: "تمت الموافقة على التحقق من هويتك. حسابك الآن نشط بالكامل.",
      items: ["التحويلات SEPA متاحة", "وصول كامل إلى جميع الخدمات", "البطاقة المصرفية متاحة"],
      cta: "الوصول إلى حسابي",
    },
    tr: {
      subject: "KT Bank — Kimliğiniz doğrulandı ✓",
      title: "Kimliğiniz doğrulandı",
      intro: "KYC doğrulamanız onaylandı. Hesabınız artık tamamen aktif.",
      items: ["SEPA transferleri mevcut", "Tüm hizmetlere tam erişim", "Banka kartı mevcut"],
      cta: "Hesabıma eriş",
    },
  });
  return {
    subject: s.subject,
    html: base(`
<h1 style="margin:0 0 10px;font-size:22px;font-weight:700;color:#111111;text-align:center;">${s.title}</h1>
<p style="margin:0 0 24px;font-size:14px;color:#555555;line-height:1.6;text-align:center;">${s.intro}</p>
<div style="background:#f0faf4;border-radius:8px;padding:18px 20px;margin:0 0 28px;">
  ${s.items.map(i => `<p style="margin:0 0 8px;font-size:13px;color:#166534;">&#10003; &nbsp;${i}</p>`).join("")}
</div>
<div style="text-align:center;">
  <a href="${DASHBOARD_URL}" style="display:inline-block;background:#005F2D;color:#ffffff;font-weight:700;font-size:14px;padding:13px 28px;border-radius:6px;text-decoration:none;">${s.cta}</a>
</div>
`, lang),
  };
}

/* ─── KYC approved but activation deposit required ─── */
export function accountActivationRequiredEmail(opts: {
  prenom: string;
  bank_name: string;
  bank_iban: string;
  bank_bic: string;
  lang?: string;
}) {
  const { prenom, bank_name, bank_iban, bank_bic, lang = "de" } = opts;
  const s = lang === "fr" ? {
    subject: "✅ Identité vérifiée — Dépôt d'activation requis (250 €)",
    title: `Identité vérifiée, ${prenom}`,
    intro: "Votre identité a été vérifiée avec succès. Pour activer votre compte et accéder à tous les services, veuillez effectuer un <strong>dépôt initial d'au moins 250 €</strong>.",
    coordTitle: "Coordonnées de virement",
    nameLabel: "Bénéficiaire", ibanLabel: "IBAN", bicLabel: "BIC",
    refLabel: "Référence", refValue: `ACTIVATION-${prenom.toUpperCase()}`,
    warning: "Votre compte sera activé automatiquement dès réception du virement.",
    cta: "Accéder à mon espace",
  } : {
    subject: "✅ Identität verifiziert — Aktivierungseinzahlung erforderlich (250 €)",
    title: `Identität verifiziert, ${prenom}`,
    intro: "Ihre Identität wurde erfolgreich verifiziert. Um Ihr Konto zu aktivieren und auf alle Dienste zuzugreifen, überweisen Sie bitte einen <strong>Mindestbetrag von 250 €</strong>.",
    coordTitle: "Überweisungsdaten",
    nameLabel: "Empfänger", ibanLabel: "IBAN", bicLabel: "BIC",
    refLabel: "Verwendungszweck", refValue: `AKTIVIERUNG-${prenom.toUpperCase()}`,
    warning: "Ihr Konto wird automatisch aktiviert sobald die Überweisung eingegangen ist.",
    cta: "Zu meinem Bereich",
  };
  const rows = [
    [s.nameLabel, bank_name],
    [s.ibanLabel, bank_iban],
    [s.bicLabel, bank_bic],
    [s.refLabel, s.refValue],
    [lang === "fr" ? "Montant minimum" : "Mindestbetrag", "250,00 EUR"],
  ];
  const tableRows = rows.map(([k, v]) => `
    <tr>
      <td style="padding:8px 12px;font-size:12px;color:#999999;border-bottom:1px solid #eeeeee;white-space:nowrap;">${k}</td>
      <td style="padding:8px 12px;font-size:13px;color:#111111;border-bottom:1px solid #eeeeee;font-weight:600;font-family:'Courier New',monospace;">${v}</td>
    </tr>`).join("");
  return {
    subject: s.subject,
    html: base(`
<h1 style="margin:0 0 10px;font-size:20px;font-weight:700;color:#111111;">${s.title}</h1>
<p style="margin:0 0 24px;font-size:14px;color:#555555;line-height:1.6;">${s.intro}</p>
<p style="margin:0 0 8px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#d97706;">${s.coordTitle}</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:2px solid #fde68a;border-radius:6px;overflow:hidden;margin:0 0 20px;background:#fffbf0;">
  ${tableRows}
</table>
<div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:6px;padding:12px 16px;margin:0 0 24px;">
  <p style="margin:0;font-size:13px;color:#92400e;font-weight:600;">${s.warning}</p>
</div>
<div style="text-align:center;">
  <a href="${DASHBOARD_URL}" style="display:inline-block;background:#005F2D;color:#ffffff;font-weight:700;font-size:13px;padding:12px 24px;border-radius:6px;text-decoration:none;">${s.cta}</a>
</div>
`, lang),
  };
}

/* ─── Account activated after deposit ─── */
export function accountActivatedEmail(opts: { prenom: string; balance: number; lang?: string }) {
  const { prenom, balance, lang = "de" } = opts;
  const s = L(lang, {
    de: {
      subject: "🎉 Ihr Konto ist jetzt aktiv!",
      title: `Konto aktiviert, ${prenom}!`,
      intro: "Ihre Einzahlung ist eingegangen. Ihr KT Bank Konto ist jetzt <strong>vollständig aktiv</strong>. Sie können alle Funktionen nutzen.",
      balanceLabel: "Aktueller Kontostand",
      cta: "Zu meinem Konto",
    },
    fr: {
      subject: "🎉 Votre compte est maintenant actif !",
      title: `Compte activé, ${prenom} !`,
      intro: "Votre dépôt a bien été reçu. Votre compte KT Bank est maintenant <strong>entièrement actif</strong>. Vous pouvez utiliser toutes les fonctionnalités.",
      balanceLabel: "Solde actuel",
      cta: "Accéder à mon compte",
    },
    en: {
      subject: "KT Bank — Your account is now active!",
      title: `Your account is active!`,
      intro: "Your KT Bank account has been activated. You can now use all features.",
      balanceLabel: "Current balance",
      cta: "Access my account",
    },
    ar: {
      subject: "KT Bank — حسابك الآن نشط!",
      title: "حسابك نشط!",
      intro: "تم تفعيل حسابك في KT Bank. يمكنك الآن استخدام جميع الميزات.",
      balanceLabel: "الرصيد الحالي",
      cta: "الوصول إلى حسابي",
    },
    tr: {
      subject: "KT Bank — Hesabınız aktif!",
      title: "Hesabınız aktif!",
      intro: "KT Bank hesabınız aktive edildi. Artık tüm özellikleri kullanabilirsiniz.",
      balanceLabel: "Mevcut bakiye",
      cta: "Hesabıma eriş",
    },
  });
  return {
    subject: s.subject,
    html: base(`
<h1 style="margin:0 0 10px;font-size:22px;font-weight:700;color:#111111;text-align:center;">${s.title}</h1>
<p style="margin:0 0 24px;font-size:14px;color:#555555;line-height:1.6;text-align:center;">${s.intro}</p>
<div style="background:#f0faf4;border-radius:8px;padding:18px 20px;margin:0 0 28px;text-align:center;">
  <p style="margin:0 0 4px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#005F2D;">${s.balanceLabel}</p>
  <p style="margin:0;font-size:28px;font-weight:800;color:#005F2D;">${balance.toFixed(2)} EUR</p>
</div>
<div style="text-align:center;">
  <a href="${DASHBOARD_URL}" style="display:inline-block;background:#005F2D;color:#ffffff;font-weight:700;font-size:14px;padding:13px 28px;border-radius:6px;text-decoration:none;">${s.cta}</a>
</div>
`, lang),
  };
}

/* ─── KYC rejected ─── */
export function kycRejectedEmail(opts: { prenom: string; notes?: string; lang?: string }) {
  const { prenom, notes, lang = "de" } = opts;
  const s = L(lang, {
    de: {
      subject: "Identitätsverifizierung abgelehnt — Aktion erforderlich",
      title: `Verifizierung abgelehnt, ${prenom}`,
      intro: "Ihr KYC-Antrag konnte nicht bestätigt werden.",
      notesLabel: "Grund / Anmerkungen",
      nextSteps: "Bitte laden Sie Ihre Dokumente erneut hoch und stellen Sie sicher, dass sie lesbar, nicht abgelaufen sind und mit Ihren Profildaten übereinstimmen.",
      cta: "Dokumente erneut einreichen",
    },
    fr: {
      subject: "Vérification d'identité refusée — Action requise",
      title: `Vérification refusée, ${prenom}`,
      intro: "Votre demande de vérification d'identité n'a pas pu être validée.",
      notesLabel: "Motif / remarques",
      nextSteps: "Veuillez soumettre à nouveau vos documents en vous assurant qu'ils sont lisibles, non expirés et correspondent aux informations de votre profil.",
      cta: "Soumettre mes documents",
    },
    en: {
      subject: "KT Bank — Your documents could not be verified",
      title: "Verification unsuccessful",
      intro: "Unfortunately, we could not verify the documents you submitted. Please contact our support team.",
      notesLabel: "Notes",
      nextSteps: "Please resubmit your documents ensuring they are legible, not expired, and match your profile information.",
      cta: "Contact support",
    },
    ar: {
      subject: "KT Bank — تعذّر التحقق من وثائقك",
      title: "التحقق غير ناجح",
      intro: "لم نتمكن للأسف من التحقق من الوثائق التي أرسلتها. يرجى التواصل مع فريق الدعم.",
      notesLabel: "ملاحظات",
      nextSteps: "يرجى إعادة تقديم مستنداتك مع التأكد من أنها واضحة وغير منتهية الصلاحية وتتطابق مع معلومات ملفك الشخصي.",
      cta: "التواصل مع الدعم",
    },
    tr: {
      subject: "KT Bank — Belgeleriniz doğrulanamadı",
      title: "Doğrulama başarısız",
      intro: "Maalesef gönderdiğiniz belgeler doğrulanamadı. Lütfen destek ekibimizle iletişime geçin.",
      notesLabel: "Notlar",
      nextSteps: "Lütfen belgelerinizi yeniden gönderin ve okunabilir, süresi dolmamış ve profil bilgilerinizle eşleşen belgeler olduğundan emin olun.",
      cta: "Desteğe başvur",
    },
  });
  return {
    subject: s.subject,
    html: base(`
<h1 style="margin:0 0 10px;font-size:20px;font-weight:700;color:#111111;">${s.title}</h1>
<p style="margin:0 0 20px;font-size:14px;color:#555555;line-height:1.6;">${s.intro}</p>
${notes ? `
<div style="border:1px solid #fecaca;background:#fef2f2;border-radius:6px;padding:14px 18px;margin:0 0 20px;">
  <p style="margin:0 0 4px;font-size:11px;color:#991b1b;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;">${s.notesLabel}</p>
  <p style="margin:0;font-size:13px;color:#991b1b;">${notes}</p>
</div>` : ""}
<p style="margin:0 0 24px;font-size:13px;color:#555555;line-height:1.6;">${s.nextSteps}</p>
<div style="text-align:center;">
  <a href="${DASHBOARD_URL}" style="display:inline-block;background:#dc2626;color:#ffffff;font-weight:700;font-size:13px;padding:12px 24px;border-radius:6px;text-decoration:none;">${s.cta}</a>
</div>
`, lang),
  };
}

/* ─── Admin: KYC documents submitted ─── */
export function adminKycSubmittedEmail(opts: {
  prenom: string; nom: string; email: string; document_type: string;
}) {
  const ADMIN_URL = "https://kt-bank-ag.com/kt-admin";
  const typeLabels: Record<string, string> = {
    id_front: "Recto de la pièce d'identité",
    id_back: "Verso de la pièce d'identité",
    selfie: "Selfie avec pièce d'identité",
  };
  return {
    subject: `KYC — Document soumis : ${opts.prenom} ${opts.nom}`,
    html: base(`
<h1 style="margin:0 0 6px;font-size:20px;font-weight:700;color:#111111;">Nouveau document KYC soumis</h1>
<p style="margin:0 0 20px;font-size:13px;color:#666666;">Un client vient de soumettre un document d'identité.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eeeeee;border-radius:6px;overflow:hidden;margin:0 0 20px;">
  <tr><td style="padding:8px 12px;font-size:12px;color:#666666;border-bottom:1px solid #eeeeee;white-space:nowrap;">Client</td>
      <td style="padding:8px 12px;font-size:13px;color:#111111;border-bottom:1px solid #eeeeee;font-weight:600;">${opts.prenom} ${opts.nom}</td></tr>
  <tr><td style="padding:8px 12px;font-size:12px;color:#666666;border-bottom:1px solid #eeeeee;">E-mail</td>
      <td style="padding:8px 12px;font-size:13px;color:#111111;border-bottom:1px solid #eeeeee;">${opts.email}</td></tr>
  <tr><td style="padding:8px 12px;font-size:12px;color:#666666;">Document</td>
      <td style="padding:8px 12px;font-size:13px;color:#111111;font-weight:600;">${typeLabels[opts.document_type] ?? opts.document_type}</td></tr>
</table>
<div style="text-align:center;">
  <a href="${ADMIN_URL}/clients" style="display:inline-block;background:#005F2D;color:#ffffff;font-weight:700;font-size:13px;padding:12px 24px;border-radius:6px;text-decoration:none;">Voir le dossier client</a>
</div>
`, "fr"),
  };
}

/* ─── Security alert ─── */
export function securityAlertEmail(prenom: string, reason: string, lang: string = "de") {
  const s = L(lang, {
    de: {
      subject: "Sicherheitshinweis – KT Bank",
      title: `Sicherheitshinweis, ${prenom}`,
      intro: "Wir möchten Sie auf folgendes aufmerksam machen:",
      cta: "Support kontaktieren",
      phone: "+49 69 255 10 200",
    },
    fr: {
      subject: "Alerte sécurité – KT Bank",
      title: `Alerte sécurité, ${prenom}`,
      intro: "Nous souhaitons vous informer de ce qui suit :",
      cta: "Contacter le support",
      phone: "+49 69 255 10 200",
    },
    en: {
      subject: "Security alert – KT Bank",
      title: `Security alert, ${prenom}`,
      intro: "We would like to inform you of the following:",
      cta: "Contact support",
      phone: "+49 69 255 10 200",
    },
    ar: {
      subject: "تنبيه أمني – KT Bank",
      title: `تنبيه أمني، ${prenom}`,
      intro: "نود إبلاغك بما يلي:",
      cta: "التواصل مع الدعم",
      phone: "+49 69 255 10 200",
    },
    tr: {
      subject: "Güvenlik uyarısı – KT Bank",
      title: `Güvenlik uyarısı, ${prenom}`,
      intro: "Aşağıdaki konuda sizi bilgilendirmek istiyoruz:",
      cta: "Desteğe başvur",
      phone: "+49 69 255 10 200",
    },
  });
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
