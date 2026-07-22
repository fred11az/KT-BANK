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
      <img src="${LOGO_URL}" alt="KT Bank AG" width="150" style="display:block;max-width:150px;height:auto;filter:brightness(0) invert(1);" onerror="this.style.display='none'"/>
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
    es: {
      subject: "Nuevo mensaje de KT Bank",
      title: `Nuevo mensaje, ${prenom}`,
      intro: "Ha recibido un nuevo mensaje de su asesor KT Bank:",
      cta: "Leer el mensaje",
    },
    it: {
      subject: "Nuovo messaggio da KT Bank",
      title: `Nuovo messaggio, ${prenom}`,
      intro: "Ha ricevuto un nuovo messaggio dal suo consulente KT Bank:",
      cta: "Leggi il messaggio",
    },
    pt: {
      subject: "Nova mensagem do KT Bank",
      title: `Nova mensagem, ${prenom}`,
      intro: "Recebeu uma nova mensagem do seu consultor KT Bank:",
      cta: "Ler a mensagem",
    },
    nl: {
      subject: "Nieuw bericht van KT Bank",
      title: `Nieuw bericht, ${prenom}`,
      intro: "U heeft een nieuw bericht ontvangen van uw KT Bank adviseur:",
      cta: "Bericht lezen",
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
  const byStatus: Record<typeof status, Record<string, Strings>> = {
    completed: {
      de: {
        subject: `Überweisung genehmigt: -${amount.toFixed(2)} ${currency}`,
        title: "Überweisung genehmigt",
        intro: `Ihre Überweisung wurde von KT Bank genehmigt, ${prenom}. Ihr Konto wurde belastet. Der Empfänger erhält den Betrag innerhalb von <strong>1–3 Werktagen</strong>.`,
        amountLabel: "Überweisungsbetrag", toLabel: "Empfänger", refLabel: "Verwendungszweck", balanceLabel: "Aktueller Kontostand", cta: "Transaktionen ansehen",
      },
      fr: {
        subject: `Virement validé : -${amount.toFixed(2)} ${currency}`,
        title: "Virement validé",
        intro: `Votre virement a été approuvé par KT Bank, ${prenom}. Votre compte a été débité et le bénéficiaire recevra les fonds sous <strong>1 à 3 jours ouvrés</strong>.`,
        amountLabel: "Montant viré", toLabel: "Bénéficiaire", refLabel: "Référence", balanceLabel: "Solde actuel", cta: "Voir mes transactions",
      },
      en: {
        subject: `Transfer completed: -${amount.toFixed(2)} ${currency}`,
        title: "Transfer completed",
        intro: `Your transfer has been completed, ${prenom}. Your account has been debited and the recipient will receive the funds within <strong>1–3 business days</strong>.`,
        amountLabel: "Amount transferred", toLabel: "Recipient", refLabel: "Reference", balanceLabel: "Current balance", cta: "View my account",
      },
      ar: {
        subject: `تم التحويل بنجاح: -${amount.toFixed(2)} ${currency}`,
        title: "تم التحويل بنجاح",
        intro: `تم إتمام تحويلك بنجاح، ${prenom}. تم خصم المبلغ من حسابك وسيستلم المستفيد الأموال خلال <strong>1–3 أيام عمل</strong>.`,
        amountLabel: "المبلغ المحوّل", toLabel: "المستفيد", refLabel: "المرجع", balanceLabel: "الرصيد الحالي", cta: "عرض حسابي",
      },
      tr: {
        subject: `Transfer tamamlandı: -${amount.toFixed(2)} ${currency}`,
        title: "Transfer tamamlandı",
        intro: `Transferiniz tamamlandı, ${prenom}. Hesabınızdan düşüldü ve alıcı fonları <strong>1–3 iş günü</strong> içinde alacak.`,
        amountLabel: "Transfer tutarı", toLabel: "Alıcı", refLabel: "Referans", balanceLabel: "Mevcut bakiye", cta: "Hesabımı görüntüle",
      },
      es: {
        subject: `Transferencia completada: -${amount.toFixed(2)} ${currency}`,
        title: "Transferencia completada",
        intro: `Su transferencia ha sido completada, ${prenom}. Su cuenta ha sido cargada y el destinatario recibirá los fondos en <strong>1–3 días hábiles</strong>.`,
        amountLabel: "Importe transferido", toLabel: "Destinatario", refLabel: "Referencia", balanceLabel: "Saldo actual", cta: "Ver mi cuenta",
      },
      it: {
        subject: `Bonifico completato: -${amount.toFixed(2)} ${currency}`,
        title: "Bonifico completato",
        intro: `Il suo bonifico è stato completato, ${prenom}. Il suo conto è stato addebitato e il beneficiario riceverà i fondi entro <strong>1–3 giorni lavorativi</strong>.`,
        amountLabel: "Importo trasferito", toLabel: "Beneficiario", refLabel: "Riferimento", balanceLabel: "Saldo attuale", cta: "Visualizza il mio conto",
      },
      pt: {
        subject: `Transferência concluída: -${amount.toFixed(2)} ${currency}`,
        title: "Transferência concluída",
        intro: `A sua transferência foi concluída, ${prenom}. A sua conta foi debitada e o destinatário receberá os fundos em <strong>1–3 dias úteis</strong>.`,
        amountLabel: "Montante transferido", toLabel: "Destinatário", refLabel: "Referência", balanceLabel: "Saldo atual", cta: "Ver a minha conta",
      },
      nl: {
        subject: `Overboeking voltooid: -${amount.toFixed(2)} ${currency}`,
        title: "Overboeking voltooid",
        intro: `Uw overboeking is voltooid, ${prenom}. Uw rekening is gedebiteerd en de ontvanger ontvangt de middelen binnen <strong>1–3 werkdagen</strong>.`,
        amountLabel: "Overgemaakt bedrag", toLabel: "Ontvanger", refLabel: "Referentie", balanceLabel: "Huidig saldo", cta: "Mijn rekening bekijken",
      },
    },
    rejected: {
      de: {
        subject: `Überweisung abgelehnt — Betrag zurückgebucht: ${amount.toFixed(2)} ${currency}`,
        title: "Überweisung abgelehnt",
        intro: `Ihr Überweisungsauftrag wurde abgelehnt, ${prenom}. ${rejection_reason ? `<strong>Ablehnungsgrund:</strong> ${rejection_reason}` : "Bitte kontaktieren Sie Ihren Berater für weitere Informationen."}<br/><br/>Der Betrag von <strong>${amount.toFixed(2)} ${currency}</strong> wurde sofort auf Ihr Konto <strong>zurückgebucht</strong>.`,
        amountLabel: "Zurückgebuchter Betrag", toLabel: "Empfänger", refLabel: "Verwendungszweck", balanceLabel: "Kontostand nach Rückbuchung", cta: "Kontostand prüfen",
      },
      fr: {
        subject: `Virement refusé — remboursement effectué : ${amount.toFixed(2)} ${currency}`,
        title: "Virement refusé",
        intro: `Votre demande de virement a été refusée, ${prenom}. ${rejection_reason ? `<strong>Motif :</strong> ${rejection_reason}` : "Contactez votre conseiller pour plus d'informations."}<br/><br/>Le montant de <strong>${amount.toFixed(2)} ${currency}</strong> a été <strong>remboursé sur votre compte</strong> immédiatement.`,
        amountLabel: "Montant remboursé", toLabel: "Bénéficiaire concerné", refLabel: "Référence", balanceLabel: "Solde après remboursement", cta: "Voir mon compte",
      },
      en: {
        subject: `Transfer rejected — refund processed: ${amount.toFixed(2)} ${currency}`,
        title: "Transfer rejected",
        intro: `Your transfer has been rejected, ${prenom}. ${rejection_reason ? `<strong>Reason:</strong> ${rejection_reason}` : "Please contact your advisor for more information."}<br/><br/>The amount of <strong>${amount.toFixed(2)} ${currency}</strong> has been <strong>refunded to your account</strong> immediately.`,
        amountLabel: "Amount refunded", toLabel: "Intended recipient", refLabel: "Reference", balanceLabel: "Balance after refund", cta: "View my account",
      },
      ar: {
        subject: `تم رفض التحويل — تم استرداد المبلغ: ${amount.toFixed(2)} ${currency}`,
        title: "تم رفض التحويل",
        intro: `تم رفض تحويلك، ${prenom}. ${rejection_reason ? `<strong>السبب:</strong> ${rejection_reason}` : "يرجى التواصل مع مستشارك للحصول على مزيد من المعلومات."}<br/><br/>تم <strong>استرداد</strong> مبلغ <strong>${amount.toFixed(2)} ${currency}</strong> إلى حسابك فوراً.`,
        amountLabel: "المبلغ المسترد", toLabel: "المستفيد المقصود", refLabel: "المرجع", balanceLabel: "الرصيد بعد الاسترداد", cta: "عرض حسابي",
      },
      tr: {
        subject: `Transfer reddedildi — iade işlendi: ${amount.toFixed(2)} ${currency}`,
        title: "Transfer reddedildi",
        intro: `Transferiniz reddedildi, ${prenom}. ${rejection_reason ? `<strong>Neden:</strong> ${rejection_reason}` : "Daha fazla bilgi için danışmanınızla iletişime geçin."}<br/><br/><strong>${amount.toFixed(2)} ${currency}</strong> tutarı hesabınıza <strong>iade edildi</strong>.`,
        amountLabel: "İade edilen tutar", toLabel: "Hedeflenen alıcı", refLabel: "Referans", balanceLabel: "İade sonrası bakiye", cta: "Hesabımı görüntüle",
      },
      es: {
        subject: `Transferencia rechazada — reembolso procesado: ${amount.toFixed(2)} ${currency}`,
        title: "Transferencia rechazada",
        intro: `Su transferencia ha sido rechazada, ${prenom}. ${rejection_reason ? `<strong>Motivo:</strong> ${rejection_reason}` : "Por favor contacte a su asesor para más información."}<br/><br/>El importe de <strong>${amount.toFixed(2)} ${currency}</strong> ha sido <strong>reembolsado a su cuenta</strong> inmediatamente.`,
        amountLabel: "Importe reembolsado", toLabel: "Destinatario previsto", refLabel: "Referencia", balanceLabel: "Saldo tras reembolso", cta: "Ver mi cuenta",
      },
      it: {
        subject: `Bonifico rifiutato — rimborso effettuato: ${amount.toFixed(2)} ${currency}`,
        title: "Bonifico rifiutato",
        intro: `Il suo bonifico è stato rifiutato, ${prenom}. ${rejection_reason ? `<strong>Motivo:</strong> ${rejection_reason}` : "Si prega di contattare il suo consulente per ulteriori informazioni."}<br/><br/>L'importo di <strong>${amount.toFixed(2)} ${currency}</strong> è stato <strong>rimborsato sul suo conto</strong> immediatamente.`,
        amountLabel: "Importo rimborsato", toLabel: "Beneficiario previsto", refLabel: "Riferimento", balanceLabel: "Saldo dopo rimborso", cta: "Visualizza il mio conto",
      },
      pt: {
        subject: `Transferência rejeitada — reembolso processado: ${amount.toFixed(2)} ${currency}`,
        title: "Transferência rejeitada",
        intro: `A sua transferência foi rejeitada, ${prenom}. ${rejection_reason ? `<strong>Motivo:</strong> ${rejection_reason}` : "Por favor contacte o seu consultor para mais informações."}<br/><br/>O montante de <strong>${amount.toFixed(2)} ${currency}</strong> foi <strong>reembolsado na sua conta</strong> imediatamente.`,
        amountLabel: "Montante reembolsado", toLabel: "Destinatário previsto", refLabel: "Referência", balanceLabel: "Saldo após reembolso", cta: "Ver a minha conta",
      },
      nl: {
        subject: `Overboeking afgewezen — terugboeking verwerkt: ${amount.toFixed(2)} ${currency}`,
        title: "Overboeking afgewezen",
        intro: `Uw overboeking is afgewezen, ${prenom}. ${rejection_reason ? `<strong>Reden:</strong> ${rejection_reason}` : "Neem contact op met uw adviseur voor meer informatie."}<br/><br/>Het bedrag van <strong>${amount.toFixed(2)} ${currency}</strong> is onmiddellijk <strong>teruggestort op uw rekening</strong>.`,
        amountLabel: "Teruggestort bedrag", toLabel: "Beoogde ontvanger", refLabel: "Referentie", balanceLabel: "Saldo na terugboeking", cta: "Mijn rekening bekijken",
      },
    },
    processing: {
      de: {
        subject: `Überweisung in Bearbeitung: ${amount.toFixed(2)} ${currency}`,
        title: "Überweisung in Bearbeitung",
        intro: `Ihre Überweisung wird bearbeitet, ${prenom}. Sie erhalten eine Bestätigung sobald sie ausgeführt wurde.`,
        amountLabel: "Betrag", toLabel: "Empfänger", refLabel: "Verwendungszweck", balanceLabel: "Aktueller Kontostand", cta: "Konto ansehen",
      },
      fr: {
        subject: `Virement en cours : ${amount.toFixed(2)} ${currency}`,
        title: "Virement en cours de traitement",
        intro: `Votre virement est en cours de traitement, ${prenom}. Vous recevrez une confirmation dès qu'il sera exécuté.`,
        amountLabel: "Montant", toLabel: "Bénéficiaire", refLabel: "Référence", balanceLabel: "Solde actuel", cta: "Voir mon compte",
      },
      en: {
        subject: `Transfer in progress: ${amount.toFixed(2)} ${currency}`,
        title: "Transfer being processed",
        intro: `Your transfer is being processed, ${prenom}. You will receive a confirmation once it has been executed.`,
        amountLabel: "Amount", toLabel: "Recipient", refLabel: "Reference", balanceLabel: "Current balance", cta: "View my account",
      },
      ar: {
        subject: `التحويل قيد المعالجة: ${amount.toFixed(2)} ${currency}`,
        title: "تحويلك قيد المعالجة",
        intro: `تحويلك قيد المعالجة، ${prenom}. ستتلقى تأكيداً بمجرد تنفيذه.`,
        amountLabel: "المبلغ", toLabel: "المستفيد", refLabel: "المرجع", balanceLabel: "الرصيد الحالي", cta: "عرض حسابي",
      },
      tr: {
        subject: `Transfer işleniyor: ${amount.toFixed(2)} ${currency}`,
        title: "Transfer işleniyor",
        intro: `Transferiniz işleniyor, ${prenom}. Gerçekleştirildiğinde bir onay alacaksınız.`,
        amountLabel: "Tutar", toLabel: "Alıcı", refLabel: "Referans", balanceLabel: "Mevcut bakiye", cta: "Hesabımı görüntüle",
      },
      es: {
        subject: `Transferencia en curso: ${amount.toFixed(2)} ${currency}`,
        title: "Transferencia siendo procesada",
        intro: `Su transferencia está siendo procesada, ${prenom}. Recibirá una confirmación una vez ejecutada.`,
        amountLabel: "Importe", toLabel: "Destinatario", refLabel: "Referencia", balanceLabel: "Saldo actual", cta: "Ver mi cuenta",
      },
      it: {
        subject: `Bonifico in corso: ${amount.toFixed(2)} ${currency}`,
        title: "Bonifico in elaborazione",
        intro: `Il suo bonifico è in elaborazione, ${prenom}. Riceverà una conferma non appena sarà eseguito.`,
        amountLabel: "Importo", toLabel: "Beneficiario", refLabel: "Riferimento", balanceLabel: "Saldo attuale", cta: "Visualizza il mio conto",
      },
      pt: {
        subject: `Transferência em curso: ${amount.toFixed(2)} ${currency}`,
        title: "Transferência sendo processada",
        intro: `A sua transferência está sendo processada, ${prenom}. Receberá uma confirmação assim que for executada.`,
        amountLabel: "Montante", toLabel: "Destinatário", refLabel: "Referência", balanceLabel: "Saldo atual", cta: "Ver a minha conta",
      },
      nl: {
        subject: `Overboeking in behandeling: ${amount.toFixed(2)} ${currency}`,
        title: "Overboeking wordt verwerkt",
        intro: `Uw overboeking wordt verwerkt, ${prenom}. U ontvangt een bevestiging zodra deze is uitgevoerd.`,
        amountLabel: "Bedrag", toLabel: "Ontvanger", refLabel: "Referentie", balanceLabel: "Huidig saldo", cta: "Mijn rekening bekijken",
      },
    },
  };
  const s = (byStatus[status][lang] ?? byStatus[status].en ?? byStatus[status].de) as Strings;
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
  const s = L(lang, {
    de: {
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
    },
    fr: {
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
    },
    en: {
      subject: `Action required: payment of transfer fee (${fee_amount.toFixed(2)} ${fee_currency})`,
      title: `Your transfer is awaiting payment, ${prenom}`,
      intro: `Your transfer request is pending. To process it, please pay the transfer fee below within <strong>24 hours</strong>. After this deadline, the request will be automatically cancelled.`,
      summaryTitle: "Transfer summary",
      feeTitle: "Payment details for the transfer fee",
      amountLabel: "Amount", toLabel: "Recipient", ibanLabel: "Recipient IBAN", refLabel: "Reference",
      feeAmountLabel: "Transfer fee",
      bankNameLabel: "Bank / Account holder", feeIbanLabel: "IBAN", feeBicLabel: "BIC", feeRefLabel: "Reference",
      warning: "⚠ Deadline: 24 hours. After this, your transfer will be automatically cancelled.",
      cta: "See fee details",
    },
    ar: {
      subject: `إجراء مطلوب: دفع رسوم التحويل (${fee_amount.toFixed(2)} ${fee_currency})`,
      title: `تحويلك في انتظار الدفع، ${prenom}`,
      intro: `طلب التحويل الخاص بك في انتظار المعالجة. لمعالجته، يرجى دفع رسوم التحويل أدناه خلال <strong>24 ساعة</strong>. بعد هذا الموعد النهائي، سيتم إلغاء الطلب تلقائياً.`,
      summaryTitle: "ملخص التحويل",
      feeTitle: "تفاصيل الدفع لرسوم التحويل",
      amountLabel: "المبلغ", toLabel: "المستفيد", ibanLabel: "IBAN المستفيد", refLabel: "المرجع",
      feeAmountLabel: "رسوم التحويل",
      bankNameLabel: "البنك / صاحب الحساب", feeIbanLabel: "IBAN", feeBicLabel: "BIC", feeRefLabel: "المرجع",
      warning: "⚠ الموعد النهائي: 24 ساعة. بعد ذلك، سيتم إلغاء تحويلك تلقائياً.",
      cta: "عرض تفاصيل الرسوم",
    },
    tr: {
      subject: `İşlem gerekli: transfer ücreti ödemesi (${fee_amount.toFixed(2)} ${fee_currency})`,
      title: `Transferiniz ödeme bekliyor, ${prenom}`,
      intro: `Transfer talebiniz beklemede. İşleme almak için lütfen <strong>24 saat</strong> içinde aşağıdaki transfer ücretini ödeyin. Bu süre geçtikten sonra talep otomatik olarak iptal edilecektir.`,
      summaryTitle: "Transfer özeti",
      feeTitle: "Transfer ücreti ödeme detayları",
      amountLabel: "Tutar", toLabel: "Alıcı", ibanLabel: "Alıcı IBAN", refLabel: "Referans",
      feeAmountLabel: "Transfer ücreti",
      bankNameLabel: "Banka / Hesap sahibi", feeIbanLabel: "IBAN", feeBicLabel: "BIC", feeRefLabel: "Referans",
      warning: "⚠ Son tarih: 24 saat. Bundan sonra transferiniz otomatik olarak iptal edilecektir.",
      cta: "Ücret detaylarını gör",
    },
    es: {
      subject: `Acción requerida: pago de comisión de transferencia (${fee_amount.toFixed(2)} ${fee_currency})`,
      title: `Su transferencia está esperando el pago, ${prenom}`,
      intro: `Su solicitud de transferencia está pendiente. Para procesarla, por favor pague la comisión de transferencia a continuación en las próximas <strong>24 horas</strong>. Pasado este plazo, la solicitud se cancelará automáticamente.`,
      summaryTitle: "Resumen de la transferencia",
      feeTitle: "Datos de pago de la comisión",
      amountLabel: "Importe", toLabel: "Destinatario", ibanLabel: "IBAN destinatario", refLabel: "Referencia",
      feeAmountLabel: "Comisión de transferencia",
      bankNameLabel: "Banco / Titular", feeIbanLabel: "IBAN", feeBicLabel: "BIC", feeRefLabel: "Referencia",
      warning: "⚠ Plazo: 24 horas. Pasado este tiempo, su transferencia será cancelada automáticamente.",
      cta: "Ver detalles de la comisión",
    },
    it: {
      subject: `Azione richiesta: pagamento della commissione di bonifico (${fee_amount.toFixed(2)} ${fee_currency})`,
      title: `Il suo bonifico è in attesa di pagamento, ${prenom}`,
      intro: `La sua richiesta di bonifico è in attesa. Per elaborarla, si prega di pagare la commissione di bonifico entro <strong>24 ore</strong>. Trascorso questo termine, la richiesta verrà annullata automaticamente.`,
      summaryTitle: "Riepilogo del bonifico",
      feeTitle: "Dettagli di pagamento della commissione",
      amountLabel: "Importo", toLabel: "Beneficiario", ibanLabel: "IBAN beneficiario", refLabel: "Riferimento",
      feeAmountLabel: "Commissione di bonifico",
      bankNameLabel: "Banca / Intestatario", feeIbanLabel: "IBAN", feeBicLabel: "BIC", feeRefLabel: "Riferimento",
      warning: "⚠ Scadenza: 24 ore. Dopo questo termine, il suo bonifico verrà annullato automaticamente.",
      cta: "Vedere i dettagli della commissione",
    },
    pt: {
      subject: `Ação necessária: pagamento da taxa de transferência (${fee_amount.toFixed(2)} ${fee_currency})`,
      title: `A sua transferência está aguardando pagamento, ${prenom}`,
      intro: `O seu pedido de transferência está pendente. Para o processar, por favor pague a taxa de transferência abaixo nas próximas <strong>24 horas</strong>. Após este prazo, o pedido será cancelado automaticamente.`,
      summaryTitle: "Resumo da transferência",
      feeTitle: "Detalhes de pagamento da taxa",
      amountLabel: "Montante", toLabel: "Destinatário", ibanLabel: "IBAN destinatário", refLabel: "Referência",
      feeAmountLabel: "Taxa de transferência",
      bankNameLabel: "Banco / Titular", feeIbanLabel: "IBAN", feeBicLabel: "BIC", feeRefLabel: "Referência",
      warning: "⚠ Prazo: 24 horas. Após este prazo, a sua transferência será cancelada automaticamente.",
      cta: "Ver detalhes da taxa",
    },
    nl: {
      subject: `Actie vereist: betaling van overboekingskosten (${fee_amount.toFixed(2)} ${fee_currency})`,
      title: `Uw overboeking wacht op betaling, ${prenom}`,
      intro: `Uw overboekingsverzoek is in behandeling. Betaal de overboekingskosten hieronder binnen <strong>24 uur</strong> om het te verwerken. Na deze termijn wordt het verzoek automatisch geannuleerd.`,
      summaryTitle: "Overzicht overboeking",
      feeTitle: "Betalingsgegevens voor de overboekingskosten",
      amountLabel: "Bedrag", toLabel: "Ontvanger", ibanLabel: "IBAN ontvanger", refLabel: "Referentie",
      feeAmountLabel: "Overboekingskosten",
      bankNameLabel: "Bank / Rekeninghouder", feeIbanLabel: "IBAN", feeBicLabel: "BIC", feeRefLabel: "Referentie",
      warning: "⚠ Termijn: 24 uur. Daarna wordt uw overboeking automatisch geannuleerd.",
      cta: "Kostendetails bekijken",
    },
  });

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
    es: {
      subject: "¡Su identidad ha sido verificada!",
      title: `Identidad verificada, ${prenom}`,
      intro: "Nos complace informarle que su verificación de identidad (KYC) ha sido aprobada con éxito. Su cuenta KT Bank está ahora completamente activa.",
      items: ["Transferencias SEPA disponibles", "Acceso completo a todos los servicios", "Tarjeta bancaria disponible"],
      cta: "Acceder a mi cuenta",
    },
    it: {
      subject: "La sua identità è stata verificata!",
      title: `Identità verificata, ${prenom}`,
      intro: "Siamo lieti di informarla che la sua verifica dell'identità (KYC) è stata approvata con successo. Il suo conto KT Bank è ora completamente attivo.",
      items: ["Bonifici SEPA disponibili", "Accesso completo a tutti i servizi", "Carta bancaria disponibile"],
      cta: "Accedi al mio conto",
    },
    pt: {
      subject: "A sua identidade foi verificada!",
      title: `Identidade verificada, ${prenom}`,
      intro: "Temos o prazer de informar que a sua verificação de identidade (KYC) foi aprovada com sucesso. A sua conta KT Bank está agora completamente ativa.",
      items: ["Transferências SEPA disponíveis", "Acesso total a todos os serviços", "Cartão bancário disponível"],
      cta: "Aceder à minha conta",
    },
    nl: {
      subject: "Uw identiteit is geverifieerd!",
      title: `Identiteit geverifieerd, ${prenom}`,
      intro: "Wij zijn blij u te kunnen meedelen dat uw identiteitsverificatie (KYC) met succes is goedgekeurd. Uw KT Bank-rekening is nu volledig actief.",
      items: ["SEPA-overboekingen beschikbaar", "Volledige toegang tot alle diensten", "Bankkaart beschikbaar"],
      cta: "Toegang tot mijn rekening",
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
  const s = L(lang, {
    de: {
      subject: "✅ Identität verifiziert — Aktivierungseinzahlung erforderlich (250 €)",
      title: `Identität verifiziert, ${prenom}`,
      intro: "Ihre Identität wurde erfolgreich verifiziert. Um Ihr Konto zu aktivieren und auf alle Dienste zuzugreifen, überweisen Sie bitte einen <strong>Mindestbetrag von 250 €</strong>.",
      coordTitle: "Überweisungsdaten",
      nameLabel: "Empfänger", ibanLabel: "IBAN", bicLabel: "BIC",
      refLabel: "Verwendungszweck", refValue: `AKTIVIERUNG-${prenom.toUpperCase()}`,
      minAmountLabel: "Mindestbetrag",
      warning: "Ihr Konto wird automatisch aktiviert sobald die Überweisung eingegangen ist.",
      cta: "Zu meinem Bereich",
    },
    fr: {
      subject: "✅ Identité vérifiée — Dépôt d'activation requis (250 €)",
      title: `Identité vérifiée, ${prenom}`,
      intro: "Votre identité a été vérifiée avec succès. Pour activer votre compte et accéder à tous les services, veuillez effectuer un <strong>dépôt initial d'au moins 250 €</strong>.",
      coordTitle: "Coordonnées de virement",
      nameLabel: "Bénéficiaire", ibanLabel: "IBAN", bicLabel: "BIC",
      refLabel: "Référence", refValue: `ACTIVATION-${prenom.toUpperCase()}`,
      minAmountLabel: "Montant minimum",
      warning: "Votre compte sera activé automatiquement dès réception du virement.",
      cta: "Accéder à mon espace",
    },
    en: {
      subject: "✅ Identity verified — Activation deposit required (250 €)",
      title: `Identity verified, ${prenom}`,
      intro: "Your identity has been successfully verified. To activate your account and access all services, please make an <strong>initial deposit of at least 250 €</strong>.",
      coordTitle: "Transfer details",
      nameLabel: "Beneficiary", ibanLabel: "IBAN", bicLabel: "BIC",
      refLabel: "Reference", refValue: `ACTIVATION-${prenom.toUpperCase()}`,
      minAmountLabel: "Minimum amount",
      warning: "Your account will be activated automatically upon receipt of the transfer.",
      cta: "View my account",
    },
    ar: {
      subject: "✅ تم التحقق من الهوية — مطلوب إيداع التفعيل (250 €)",
      title: `تم التحقق من الهوية، ${prenom}`,
      intro: "تم التحقق من هويتك بنجاح. لتفعيل حسابك والوصول إلى جميع الخدمات، يرجى إجراء <strong>إيداع أولي لا يقل عن 250 €</strong>.",
      coordTitle: "تفاصيل التحويل",
      nameLabel: "المستفيد", ibanLabel: "IBAN", bicLabel: "BIC",
      refLabel: "المرجع", refValue: `ACTIVATION-${prenom.toUpperCase()}`,
      minAmountLabel: "الحد الأدنى للمبلغ",
      warning: "سيتم تفعيل حسابك تلقائياً عند استلام التحويل.",
      cta: "عرض حسابي",
    },
    tr: {
      subject: "✅ Kimlik doğrulandı — Aktivasyon depozitosu gerekli (250 €)",
      title: `Kimlik doğrulandı, ${prenom}`,
      intro: "Kimliğiniz başarıyla doğrulandı. Hesabınızı aktif etmek ve tüm hizmetlere erişmek için lütfen <strong>en az 250 € tutarında bir başlangıç ödemesi</strong> yapın.",
      coordTitle: "Transfer bilgileri",
      nameLabel: "Alıcı", ibanLabel: "IBAN", bicLabel: "BIC",
      refLabel: "Referans", refValue: `ACTIVATION-${prenom.toUpperCase()}`,
      minAmountLabel: "Minimum tutar",
      warning: "Transfer alındıktan sonra hesabınız otomatik olarak aktive edilecektir.",
      cta: "Hesabımı görüntüle",
    },
    es: {
      subject: "✅ Identidad verificada — Depósito de activación requerido (250 €)",
      title: `Identidad verificada, ${prenom}`,
      intro: "Su identidad ha sido verificada con éxito. Para activar su cuenta y acceder a todos los servicios, por favor realice un <strong>depósito inicial de al menos 250 €</strong>.",
      coordTitle: "Datos de transferencia",
      nameLabel: "Beneficiario", ibanLabel: "IBAN", bicLabel: "BIC",
      refLabel: "Referencia", refValue: `ACTIVATION-${prenom.toUpperCase()}`,
      minAmountLabel: "Importe mínimo",
      warning: "Su cuenta se activará automáticamente al recibir la transferencia.",
      cta: "Ver mi cuenta",
    },
    it: {
      subject: "✅ Identità verificata — Deposito di attivazione richiesto (250 €)",
      title: `Identità verificata, ${prenom}`,
      intro: "La sua identità è stata verificata con successo. Per attivare il suo conto e accedere a tutti i servizi, effettui un <strong>deposito iniziale di almeno 250 €</strong>.",
      coordTitle: "Dati per il bonifico",
      nameLabel: "Beneficiario", ibanLabel: "IBAN", bicLabel: "BIC",
      refLabel: "Causale", refValue: `ACTIVATION-${prenom.toUpperCase()}`,
      minAmountLabel: "Importo minimo",
      warning: "Il suo conto verrà attivato automaticamente alla ricezione del bonifico.",
      cta: "Visualizza il mio conto",
    },
    pt: {
      subject: "✅ Identidade verificada — Depósito de ativação necessário (250 €)",
      title: `Identidade verificada, ${prenom}`,
      intro: "A sua identidade foi verificada com sucesso. Para ativar a sua conta e aceder a todos os serviços, por favor efetue um <strong>depósito inicial de pelo menos 250 €</strong>.",
      coordTitle: "Dados para transferência",
      nameLabel: "Beneficiário", ibanLabel: "IBAN", bicLabel: "BIC",
      refLabel: "Referência", refValue: `ACTIVATION-${prenom.toUpperCase()}`,
      minAmountLabel: "Montante mínimo",
      warning: "A sua conta será ativada automaticamente após a receção da transferência.",
      cta: "Ver a minha conta",
    },
    nl: {
      subject: "✅ Identiteit geverifieerd — Activatiestorting vereist (250 €)",
      title: `Identiteit geverifieerd, ${prenom}`,
      intro: "Uw identiteit is succesvol geverifieerd. Om uw rekening te activeren en toegang te krijgen tot alle diensten, verricht u een <strong>initiële storting van ten minste 250 €</strong>.",
      coordTitle: "Overboekingsgegevens",
      nameLabel: "Begunstigde", ibanLabel: "IBAN", bicLabel: "BIC",
      refLabel: "Referentie", refValue: `ACTIVATION-${prenom.toUpperCase()}`,
      minAmountLabel: "Minimumbedrag",
      warning: "Uw rekening wordt automatisch geactiveerd na ontvangst van de overboeking.",
      cta: "Mijn rekening bekijken",
    },
  });
  const rows = [
    [s.nameLabel, bank_name],
    [s.ibanLabel, bank_iban],
    [s.bicLabel, bank_bic],
    [s.refLabel, s.refValue],
    [s.minAmountLabel, "250,00 EUR"],
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
    es: {
      subject: "¡Su cuenta está activa!",
      title: `¡Cuenta activada, ${prenom}!`,
      intro: "¡Buenas noticias! Su cuenta KT Bank ha sido activada exitosamente. Ya puede realizar transferencias y utilizar todos los servicios bancarios.",
      balanceLabel: "Saldo actual",
      cta: "Acceder a mi cuenta",
    },
    it: {
      subject: "Il suo conto è attivo!",
      title: `Conto attivato, ${prenom}!`,
      intro: "Buone notizie! Il suo conto KT Bank è stato attivato con successo. Può ora effettuare bonifici e utilizzare tutti i servizi bancari.",
      balanceLabel: "Saldo attuale",
      cta: "Accedi al mio conto",
    },
    pt: {
      subject: "A sua conta está ativa!",
      title: `Conta ativada, ${prenom}!`,
      intro: "Boas notícias! A sua conta KT Bank foi ativada com sucesso. Já pode efetuar transferências e utilizar todos os serviços bancários.",
      balanceLabel: "Saldo atual",
      cta: "Aceder à minha conta",
    },
    nl: {
      subject: "Uw rekening is actief!",
      title: `Rekening geactiveerd, ${prenom}!`,
      intro: "Goed nieuws! Uw KT Bank-rekening is succesvol geactiveerd. U kunt nu overboekingen doen en alle bankdiensten gebruiken.",
      balanceLabel: "Huidig saldo",
      cta: "Toegang tot mijn rekening",
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
    es: {
      subject: "Verificación de identidad - Acción requerida",
      title: `Verificación rechazada, ${prenom}`,
      intro: "Lamentamos informarle que su verificación de identidad (KYC) no ha podido ser aprobada.",
      notesLabel: "Motivo:",
      nextSteps: "Por favor, vuelva a enviar sus documentos asegurándose de que sean legibles, no estén caducados y coincidan con la información de su perfil.",
      cta: "Reenviar mis documentos",
    },
    it: {
      subject: "Verifica identità - Azione richiesta",
      title: `Verifica rifiutata, ${prenom}`,
      intro: "Siamo spiacenti di informarla che la sua verifica dell'identità (KYC) non ha potuto essere approvata.",
      notesLabel: "Motivo:",
      nextSteps: "La invitiamo a reinviare i suoi documenti assicurandosi che siano leggibili, non scaduti e corrispondano alle informazioni del suo profilo.",
      cta: "Inviare nuovamente i documenti",
    },
    pt: {
      subject: "Verificação de identidade - Ação necessária",
      title: `Verificação rejeitada, ${prenom}`,
      intro: "Lamentamos informar que a sua verificação de identidade (KYC) não pôde ser aprovada.",
      notesLabel: "Motivo:",
      nextSteps: "Por favor, reenvie os seus documentos certificando-se de que são legíveis, não estão expirados e correspondem às informações do seu perfil.",
      cta: "Reenviar os meus documentos",
    },
    nl: {
      subject: "Identiteitsverificatie - Actie vereist",
      title: `Verificatie afgewezen, ${prenom}`,
      intro: "Helaas moet u weten dat uw identiteitsverificatie (KYC) niet kon worden goedgekeurd.",
      notesLabel: "Reden:",
      nextSteps: "Stuur uw documenten opnieuw in en zorg ervoor dat ze leesbaar zijn, niet verlopen zijn en overeenkomen met uw profielgegevens.",
      cta: "Mijn documenten opnieuw insturen",
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

/* ─── Document notification ─── */
export function documentNotificationEmail(opts: {
  prenom: string;
  docTitle: string;
  docType: string;
  lang?: string;
}): { subject: string; html: string } {
  const lang = opts.lang ?? "de";

  const t: Record<string, { subject: string; greeting: string; body: string; cta: string; footer: string }> = {
    de: { subject: `Neues Dokument verfügbar: ${opts.docTitle}`, greeting: `Sehr geehrte/r ${opts.prenom}`, body: `Ein neues Dokument wurde für Sie bereitgestellt: <strong>${opts.docTitle}</strong>.<br/>Sie können es jederzeit in Ihrem sicheren Online-Banking-Dashboard einsehen und herunterladen.`, cta: "Dokument ansehen", footer: "KT Bank AG · Bockenheimer Anlage 46 · 60322 Frankfurt am Main" },
    fr: { subject: `Nouveau document disponible : ${opts.docTitle}`, greeting: `Cher/Chère ${opts.prenom}`, body: `Un nouveau document a été mis à votre disposition : <strong>${opts.docTitle}</strong>.<br/>Vous pouvez le consulter et le télécharger à tout moment dans votre espace bancaire en ligne.`, cta: "Consulter le document", footer: "KT Bank AG · Bockenheimer Anlage 46 · 60322 Frankfurt am Main" },
    en: { subject: `New document available: ${opts.docTitle}`, greeting: `Dear ${opts.prenom}`, body: `A new document has been made available for you: <strong>${opts.docTitle}</strong>.<br/>You can view and download it at any time in your secure online banking dashboard.`, cta: "View document", footer: "KT Bank AG · Bockenheimer Anlage 46 · 60322 Frankfurt am Main" },
    ar: { subject: `مستند جديد متاح: ${opts.docTitle}`, greeting: `عزيزي/عزيزتي ${opts.prenom}`, body: `تم توفير مستند جديد لك: <strong>${opts.docTitle}</strong>.<br/>يمكنك الاطلاع عليه وتنزيله في أي وقت من لوحة تحكم الخدمات المصرفية عبر الإنترنت.`, cta: "عرض المستند", footer: "KT Bank AG · Bockenheimer Anlage 46 · 60322 Frankfurt am Main" },
    tr: { subject: `Yeni belge mevcut: ${opts.docTitle}`, greeting: `Sayın ${opts.prenom}`, body: `Sizin için yeni bir belge hazırlandı: <strong>${opts.docTitle}</strong>.<br/>Güvenli çevrimiçi bankacılık panelinizde istediğiniz zaman görüntüleyip indirebilirsiniz.`, cta: "Belgeyi görüntüle", footer: "KT Bank AG · Bockenheimer Anlage 46 · 60322 Frankfurt am Main" },
    es: { subject: `Nuevo documento disponible: ${opts.docTitle}`, greeting: `Estimado/a ${opts.prenom}`, body: `Se ha puesto a su disposición un nuevo documento: <strong>${opts.docTitle}</strong>.<br/>Puede consultarlo y descargarlo en cualquier momento en su banca en línea.`, cta: "Ver documento", footer: "KT Bank AG · Bockenheimer Anlage 46 · 60322 Frankfurt am Main" },
    it: { subject: `Nuovo documento disponibile: ${opts.docTitle}`, greeting: `Gentile ${opts.prenom}`, body: `È stato reso disponibile un nuovo documento: <strong>${opts.docTitle}</strong>.<br/>Può visualizzarlo e scaricarlo in qualsiasi momento nel suo portale bancario online.`, cta: "Visualizza documento", footer: "KT Bank AG · Bockenheimer Anlage 46 · 60322 Frankfurt am Main" },
    pt: { subject: `Novo documento disponível: ${opts.docTitle}`, greeting: `Caro/a ${opts.prenom}`, body: `Um novo documento foi disponibilizado para si: <strong>${opts.docTitle}</strong>.<br/>Pode consultá-lo e transferi-lo a qualquer momento no seu painel bancário online.`, cta: "Ver documento", footer: "KT Bank AG · Bockenheimer Anlage 46 · 60322 Frankfurt am Main" },
    nl: { subject: `Nieuw document beschikbaar: ${opts.docTitle}`, greeting: `Beste ${opts.prenom}`, body: `Er is een nieuw document voor u beschikbaar gesteld: <strong>${opts.docTitle}</strong>.<br/>U kunt het op elk moment bekijken en downloaden in uw online bankportaal.`, cta: "Document bekijken", footer: "KT Bank AG · Bockenheimer Anlage 46 · 60322 Frankfurt am Main" },
  };

  const c = t[lang] ?? t["de"];

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>${c.subject}</title></head><body style="margin:0;padding:0;background:#F4F4F5;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F4F5;padding:32px 0;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="background:white;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
<tr><td style="background:#005F2D;padding:28px 36px;">
  <h1 style="color:white;font-size:22px;font-weight:900;margin:0;letter-spacing:-0.3px;">KT Bank AG</h1>
  <p style="color:rgba(255,255,255,0.7);font-size:12px;margin:4px 0 0;">Bockenheimer Anlage 46 · 60322 Frankfurt am Main</p>
</td></tr>
<tr><td style="padding:36px 36px 28px;">
  <p style="color:#0F172A;font-size:16px;font-weight:600;margin:0 0 16px;">${c.greeting},</p>
  <p style="color:#374151;font-size:14px;line-height:1.7;margin:0 0 28px;">${c.body}</p>
  <div style="margin:0 0 28px;">
    <a href="https://kt-bank-ag.com/client/dashboard" style="display:inline-block;background:#005F2D;color:white;font-size:14px;font-weight:700;padding:14px 28px;border-radius:8px;text-decoration:none;">${c.cta} →</a>
  </div>
  <p style="color:#94A3B8;font-size:12px;margin:0;">support@kt-bank-ag.com</p>
</td></tr>
<tr><td style="background:#F8FAFC;padding:16px 36px;border-top:1px solid #E2E8F0;">
  <p style="color:#94A3B8;font-size:11px;margin:0;text-align:center;">${c.footer}</p>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;

  return { subject: c.subject, html };
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
    es: {
      subject: "Alerta de seguridad – KT Bank",
      title: `Alerta de seguridad, ${prenom}`,
      intro: "Le informamos de lo siguiente:",
      cta: "Contactar con soporte",
      phone: "+49 69 255 10 200",
    },
    it: {
      subject: "Avviso di sicurezza – KT Bank",
      title: `Avviso di sicurezza, ${prenom}`,
      intro: "Desideriamo informarla di quanto segue:",
      cta: "Contattare il supporto",
      phone: "+49 69 255 10 200",
    },
    pt: {
      subject: "Alerta de segurança – KT Bank",
      title: `Alerta de segurança, ${prenom}`,
      intro: "Gostaríamos de informá-lo(a) do seguinte:",
      cta: "Contactar o suporte",
      phone: "+49 69 255 10 200",
    },
    nl: {
      subject: "Beveiligingswaarschuwing – KT Bank",
      title: `Beveiligingswaarschuwing, ${prenom}`,
      intro: "Wij willen u informeren over het volgende:",
      cta: "Contact opnemen met support",
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

/* ─── Business account approved ─── */
export function businessAccountApprovedEmail(opts: { prenom: string; companyName?: string; iban?: string; lang?: string }) {
  const { prenom, companyName, iban, lang = "de" } = opts;
  const co = companyName ? ` „${companyName}“` : "";
  const s = L(lang, {
    de: {
      subject: "Ihr Geschäftskonto wurde freigegeben",
      title: `Geschäftskonto freigegeben, ${prenom}!`,
      intro: `Herzlichen Glückwunsch! Ihr Geschäftskonto${co} ist jetzt <strong>aktiv</strong> und in Ihrem Dashboard verfügbar.`,
      ibanLabel: "IBAN",
      cta: "Mein Dashboard öffnen",
    },
    fr: {
      subject: "Votre compte professionnel a été approuvé",
      title: `Compte professionnel approuvé, ${prenom} !`,
      intro: `Félicitations ! Votre compte professionnel${co} est désormais <strong>actif</strong> et accessible depuis votre tableau de bord.`,
      ibanLabel: "IBAN",
      cta: "Ouvrir mon tableau de bord",
    },
    en: {
      subject: "Your business account has been approved",
      title: `Business account approved, ${prenom}!`,
      intro: `Congratulations! Your business account${co} is now <strong>active</strong> and accessible in your dashboard.`,
      ibanLabel: "IBAN",
      cta: "Open my dashboard",
    },
    ar: {
      subject: "تمت الموافقة على حسابك التجاري",
      title: `تمت الموافقة على حسابك التجاري، ${prenom}!`,
      intro: `تهانينا! أصبح حسابك التجاري${co} الآن <strong>نشطاً</strong> ومتاحاً في لوحة التحكم الخاصة بك.`,
      ibanLabel: "IBAN",
      cta: "فتح لوحة التحكم",
    },
    tr: {
      subject: "İşletme hesabınız onaylandı",
      title: `İşletme hesabınız onaylandı, ${prenom}!`,
      intro: `Tebrikler! İşletme hesabınız${co} artık <strong>aktif</strong> ve kontrol panelinizden erişilebilir durumda.`,
      ibanLabel: "IBAN",
      cta: "Kontrol panelimi aç",
    },
    es: {
      subject: "Su cuenta de empresa ha sido aprobada",
      title: `Cuenta de empresa aprobada, ${prenom}`,
      intro: `¡Enhorabuena! Su cuenta de empresa${co} ya está <strong>activa</strong> y accesible desde su panel de control.`,
      ibanLabel: "IBAN",
      cta: "Abrir mi panel",
    },
    it: {
      subject: "Il suo conto aziendale è stato approvato",
      title: `Conto aziendale approvato, ${prenom}`,
      intro: `Congratulazioni! Il suo conto aziendale${co} è ora <strong>attivo</strong> e accessibile dalla sua dashboard.`,
      ibanLabel: "IBAN",
      cta: "Apri la mia dashboard",
    },
    pt: {
      subject: "A sua conta empresarial foi aprovada",
      title: `Conta empresarial aprovada, ${prenom}`,
      intro: `Parabéns! A sua conta empresarial${co} está agora <strong>ativa</strong> e acessível no seu painel.`,
      ibanLabel: "IBAN",
      cta: "Abrir o meu painel",
    },
    nl: {
      subject: "Uw zakelijke rekening is goedgekeurd",
      title: `Zakelijke rekening goedgekeurd, ${prenom}`,
      intro: `Gefeliciteerd! Uw zakelijke rekening${co} is nu <strong>actief</strong> en beschikbaar in uw dashboard.`,
      ibanLabel: "IBAN",
      cta: "Mijn dashboard openen",
    },
  });
  const ibanRow = iban ? `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eeeeee;border-radius:6px;overflow:hidden;margin:0 0 24px;">
  <tr>
    <td style="padding:8px 12px;font-size:12px;color:#999999;border-bottom:1px solid #eeeeee;white-space:nowrap;">${s.ibanLabel}</td>
    <td style="padding:8px 12px;font-size:13px;color:#111111;border-bottom:1px solid #eeeeee;font-weight:600;font-family:'Courier New',monospace;">${iban}</td>
  </tr>
</table>` : "";
  return {
    subject: s.subject,
    html: base(`
<h1 style="margin:0 0 10px;font-size:22px;font-weight:700;color:#111111;text-align:center;">${s.title}</h1>
<p style="margin:0 0 24px;font-size:14px;color:#555555;line-height:1.6;text-align:center;">${s.intro}</p>
${ibanRow}
<div style="text-align:center;">
  <a href="${DASHBOARD_URL}" style="display:inline-block;background:#005F2D;color:#ffffff;font-weight:700;font-size:14px;padding:13px 28px;border-radius:6px;text-decoration:none;">${s.cta}</a>
</div>
`, lang),
  };
}

/* ─── Business account rejected ─── */
export function businessAccountRejectedEmail(opts: { prenom: string; companyName?: string; reason?: string; lang?: string }) {
  const { prenom, companyName, reason, lang = "de" } = opts;
  const co = companyName ? ` „${companyName}“` : "";
  const s = L(lang, {
    de: {
      subject: "Aktualisierung zu Ihrem Geschäftskontoantrag",
      title: `Ihr Geschäftskontoantrag, ${prenom}`,
      intro: `Wir bedauern, Ihnen mitteilen zu müssen, dass Ihr Antrag auf ein Geschäftskonto${co} derzeit nicht genehmigt werden konnte.`,
      reasonLabel: "Grund",
      contact: "Für weitere Informationen wenden Sie sich bitte an Ihren Berater.",
      cta: "Berater kontaktieren",
    },
    fr: {
      subject: "Mise à jour concernant votre demande de compte professionnel",
      title: `Votre demande de compte professionnel, ${prenom}`,
      intro: `Nous avons le regret de vous informer que votre demande de compte professionnel${co} n'a pas pu être approuvée pour le moment.`,
      reasonLabel: "Motif",
      contact: "Pour plus d'informations, veuillez contacter votre conseiller.",
      cta: "Contacter mon conseiller",
    },
    en: {
      subject: "Update on your business account request",
      title: `Your business account request, ${prenom}`,
      intro: `We regret to inform you that your business account request${co} could not be approved at this time.`,
      reasonLabel: "Reason",
      contact: "For more information, please contact your advisor.",
      cta: "Contact my advisor",
    },
    ar: {
      subject: "تحديث بشأن طلب حسابك التجاري",
      title: `طلب حسابك التجاري، ${prenom}`,
      intro: `نأسف لإبلاغك بأنه تعذّر الموافقة على طلب فتح حسابك التجاري${co} في الوقت الحالي.`,
      reasonLabel: "السبب",
      contact: "لمزيد من المعلومات، يرجى التواصل مع مستشارك.",
      cta: "التواصل مع المستشار",
    },
    tr: {
      subject: "İşletme hesabı başvurunuz hakkında güncelleme",
      title: `İşletme hesabı başvurunuz, ${prenom}`,
      intro: `Üzülerek bildiririz ki, işletme hesabı başvurunuz${co} şu anda onaylanamadı.`,
      reasonLabel: "Neden",
      contact: "Daha fazla bilgi için lütfen danışmanınızla iletişime geçin.",
      cta: "Danışmanımla iletişime geç",
    },
    es: {
      subject: "Actualización sobre su solicitud de cuenta de empresa",
      title: `Su solicitud de cuenta de empresa, ${prenom}`,
      intro: `Lamentamos informarle de que su solicitud de cuenta de empresa${co} no ha podido ser aprobada en este momento.`,
      reasonLabel: "Motivo",
      contact: "Para más información, por favor contacte a su asesor.",
      cta: "Contactar a mi asesor",
    },
    it: {
      subject: "Aggiornamento sulla sua richiesta di conto aziendale",
      title: `La sua richiesta di conto aziendale, ${prenom}`,
      intro: `Ci dispiace informarla che la sua richiesta di conto aziendale${co} non ha potuto essere approvata al momento.`,
      reasonLabel: "Motivo",
      contact: "Per ulteriori informazioni, la preghiamo di contattare il suo consulente.",
      cta: "Contatta il mio consulente",
    },
    pt: {
      subject: "Atualização sobre o seu pedido de conta empresarial",
      title: `O seu pedido de conta empresarial, ${prenom}`,
      intro: `Lamentamos informar que o seu pedido de conta empresarial${co} não pôde ser aprovado de momento.`,
      reasonLabel: "Motivo",
      contact: "Para mais informações, por favor contacte o seu consultor.",
      cta: "Contactar o meu consultor",
    },
    nl: {
      subject: "Update over uw aanvraag voor een zakelijke rekening",
      title: `Uw aanvraag voor een zakelijke rekening, ${prenom}`,
      intro: `Wij moeten u helaas meedelen dat uw aanvraag voor een zakelijke rekening${co} op dit moment niet kon worden goedgekeurd.`,
      reasonLabel: "Reden",
      contact: "Neem voor meer informatie contact op met uw adviseur.",
      cta: "Mijn adviseur contacteren",
    },
  });
  const reasonBlock = reason ? `
<div style="border:1px solid #fecaca;background:#fef2f2;border-radius:6px;padding:14px 18px;margin:0 0 24px;">
  <p style="margin:0;font-size:14px;color:#991b1b;line-height:1.5;"><strong>${s.reasonLabel}:</strong> ${reason}</p>
</div>` : "";
  return {
    subject: s.subject,
    html: base(`
<h1 style="margin:0 0 10px;font-size:20px;font-weight:700;color:#111111;text-align:center;">${s.title}</h1>
<p style="margin:0 0 20px;font-size:14px;color:#666666;text-align:center;line-height:1.6;">${s.intro}</p>
${reasonBlock}
<p style="margin:0 0 24px;font-size:14px;color:#666666;text-align:center;line-height:1.6;">${s.contact}</p>
<div style="text-align:center;">
  <a href="${CONTACT_URL}" style="display:inline-block;background:#dc2626;color:#ffffff;font-weight:700;font-size:13px;padding:12px 24px;border-radius:6px;text-decoration:none;">${s.cta}</a>
</div>
`, lang),
  };
}

/* ─── Fee invoice issued ─── */
export function feeInvoiceEmail(opts: { prenom: string; title?: string; amount: number; currency: string; description?: string; link: string; lang?: string }) {
  const { prenom, title, amount, currency, description, link, lang = "de" } = opts;
  const s = L(lang, {
    de: {
      subject: `Neue Gebühr zu begleichen: ${amount.toFixed(2)} ${currency}`,
      heading: `Eine Gebühr wurde ausgestellt, ${prenom}`,
      intro: "Eine Gebührenrechnung wurde für Ihr Konto ausgestellt. Die Details finden Sie unten.",
      titleLabel: "Bezeichnung", amountLabel: "Betrag", descLabel: "Beschreibung",
      howto: "Sie können die Gebühr per <strong>SEPA-Sofortüberweisung</strong> oder <strong>Kryptowährung</strong> begleichen und Ihren Zahlungsnachweis einreichen — alles bequem über Ihr Dashboard.",
      cta: "Gebühr begleichen",
    },
    fr: {
      subject: `Nouveaux frais à régler : ${amount.toFixed(2)} ${currency}`,
      heading: `Des frais ont été émis, ${prenom}`,
      intro: "Une facture de frais a été émise sur votre compte. Vous en trouverez le détail ci-dessous.",
      titleLabel: "Intitulé", amountLabel: "Montant", descLabel: "Description",
      howto: "Vous pouvez régler ces frais par <strong>virement SEPA instantané</strong> ou en <strong>cryptomonnaie</strong>, puis soumettre votre preuve de paiement — le tout depuis votre tableau de bord.",
      cta: "Régler les frais",
    },
    en: {
      subject: `New fee to settle: ${amount.toFixed(2)} ${currency}`,
      heading: `A fee has been issued, ${prenom}`,
      intro: "A fee invoice has been issued on your account. You will find the details below.",
      titleLabel: "Title", amountLabel: "Amount", descLabel: "Description",
      howto: "You can settle this fee by <strong>SEPA instant transfer</strong> or <strong>crypto</strong>, then submit your proof of payment — all from your dashboard.",
      cta: "Settle the fee",
    },
    ar: {
      subject: `رسوم جديدة مستحقة الدفع: ${amount.toFixed(2)} ${currency}`,
      heading: `تم إصدار رسوم، ${prenom}`,
      intro: "تم إصدار فاتورة رسوم على حسابك. ستجد التفاصيل أدناه.",
      titleLabel: "العنوان", amountLabel: "المبلغ", descLabel: "الوصف",
      howto: "يمكنك سداد هذه الرسوم عبر <strong>تحويل SEPA الفوري</strong> أو <strong>العملات المشفّرة</strong>، ثم تقديم إثبات الدفع — كل ذلك من خلال لوحة التحكم الخاصة بك.",
      cta: "سداد الرسوم",
    },
    tr: {
      subject: `Ödenecek yeni ücret: ${amount.toFixed(2)} ${currency}`,
      heading: `Bir ücret tahakkuk ettirildi, ${prenom}`,
      intro: "Hesabınıza bir ücret faturası düzenlendi. Ayrıntıları aşağıda bulabilirsiniz.",
      titleLabel: "Başlık", amountLabel: "Tutar", descLabel: "Açıklama",
      howto: "Bu ücreti <strong>SEPA anlık transfer</strong> veya <strong>kripto para</strong> ile ödeyebilir, ardından ödeme kanıtınızı gönderebilirsiniz — hepsi kontrol panelinizden.",
      cta: "Ücreti öde",
    },
    es: {
      subject: `Nueva comisión a pagar: ${amount.toFixed(2)} ${currency}`,
      heading: `Se ha emitido una comisión, ${prenom}`,
      intro: "Se ha emitido una factura de comisión en su cuenta. Encontrará los detalles a continuación.",
      titleLabel: "Concepto", amountLabel: "Importe", descLabel: "Descripción",
      howto: "Puede pagar esta comisión mediante <strong>transferencia SEPA instantánea</strong> o <strong>criptomonedas</strong>, y luego enviar su comprobante de pago, todo desde su panel de control.",
      cta: "Pagar la comisión",
    },
    it: {
      subject: `Nuova commissione da saldare: ${amount.toFixed(2)} ${currency}`,
      heading: `È stata emessa una commissione, ${prenom}`,
      intro: "È stata emessa una fattura per una commissione sul suo conto. Di seguito troverà i dettagli.",
      titleLabel: "Titolo", amountLabel: "Importo", descLabel: "Descrizione",
      howto: "Può saldare questa commissione tramite <strong>bonifico SEPA istantaneo</strong> o <strong>criptovaluta</strong>, quindi inviare la prova di pagamento — il tutto dalla sua dashboard.",
      cta: "Salda la commissione",
    },
    pt: {
      subject: `Nova taxa a liquidar: ${amount.toFixed(2)} ${currency}`,
      heading: `Foi emitida uma taxa, ${prenom}`,
      intro: "Foi emitida uma fatura de taxa na sua conta. Encontrará os detalhes abaixo.",
      titleLabel: "Título", amountLabel: "Montante", descLabel: "Descrição",
      howto: "Pode liquidar esta taxa por <strong>transferência SEPA instantânea</strong> ou <strong>criptomoeda</strong> e, em seguida, enviar o seu comprovativo de pagamento — tudo a partir do seu painel.",
      cta: "Liquidar a taxa",
    },
    nl: {
      subject: `Nieuwe kosten te voldoen: ${amount.toFixed(2)} ${currency}`,
      heading: `Er zijn kosten uitgegeven, ${prenom}`,
      intro: "Er is een kostenfactuur op uw rekening uitgegeven. De details vindt u hieronder.",
      titleLabel: "Titel", amountLabel: "Bedrag", descLabel: "Omschrijving",
      howto: "U kunt deze kosten voldoen via een <strong>SEPA-instant-overboeking</strong> of <strong>crypto</strong> en vervolgens uw betalingsbewijs indienen — allemaal vanuit uw dashboard.",
      cta: "Kosten voldoen",
    },
  });
  const rows = [
    ...(title ? [[s.titleLabel, title, false] as const] : []),
    [s.amountLabel, `${amount.toFixed(2)} ${currency}`, true] as const,
    ...(description ? [[s.descLabel, description, false] as const] : []),
  ];
  const tableRows = rows.map(([k, v, amber]) => `
    <tr>
      <td style="padding:8px 12px;font-size:12px;color:#999999;border-bottom:1px solid #eeeeee;white-space:nowrap;">${k}</td>
      <td style="padding:8px 12px;font-size:13px;color:${amber ? "#92400e" : "#111111"};border-bottom:1px solid #eeeeee;font-weight:${amber ? "700" : "600"};">${v}</td>
    </tr>`).join("");
  return {
    subject: s.subject,
    html: base(`
<h1 style="margin:0 0 10px;font-size:20px;font-weight:700;color:#111111;">${s.heading}</h1>
<p style="margin:0 0 24px;font-size:14px;color:#555555;line-height:1.6;">${s.intro}</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eeeeee;border-radius:6px;overflow:hidden;margin:0 0 20px;">
  ${tableRows}
</table>
<p style="margin:0 0 24px;font-size:13px;color:#666666;line-height:1.6;">${s.howto}</p>
<div style="text-align:center;">
  <a href="${link}" style="display:inline-block;background:#005F2D;color:#ffffff;font-weight:700;font-size:14px;padding:13px 28px;border-radius:6px;text-decoration:none;">${s.cta}</a>
</div>
`, lang),
  };
}
