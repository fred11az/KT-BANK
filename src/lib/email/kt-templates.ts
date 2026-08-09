/**
 * KT Bank AG — Ready-made HTML email templates (admin messaging).
 *
 * Design/CSS come verbatim from the templates supplied by KT Bank Operations
 * (template_welcome_email_fr.html, template_promo_islamic_fr.html,
 * template_contact_manager_fr.html) — only the copy is translated.
 *
 * Languages: the 9 supported by the platform (de, fr, en, ar, tr, es, it, pt, nl).
 * Every dictionary is typed as Record<TplLang, …> so a missing translation is a
 * compile error rather than a silent fallback to German.
 *
 * Logo: served from the site URL, NOT base64 — Gmail (and most webmail clients)
 * refuse to render `data:` URIs in email bodies.
 */

export type TplLang = "de" | "fr" | "en" | "ar" | "tr" | "es" | "it" | "pt" | "nl";
export type TplId = "welcome" | "promo_islamic" | "contact_manager" | "financing_proposal" | "document_request" | "account_funding";

/* ── Brand constants ── */
const LOGO_URL = "https://www.kt-bank-ag.com/kt-logo.png";
const PORTAL_URL = "https://www.kt-bank-ag.com/client/login";
const PORTAL_LABEL = "kt-bank-ag.com/client/login";
const WA_NUMBER = "436703015148";
const WA_DISPLAY = "+43 670 3015148";
const SUPPORT_EMAIL = "support@kt-bank-ag.com";
const DEFAULT_MANAGER = "David LENIAN";
const GREEN = "#226644";
const GOLD = "#B8860B";

/* ── Helpers ── */
function esc(v: string): string {
  return String(v)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const isRtl = (lang: TplLang) => lang === "ar";

/** Shared CSS — merged from the three supplied templates, unchanged. */
function css(lang: TplLang): string {
  const align = isRtl(lang) ? "right" : "left";
  return `
        body {font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; margin: 0; padding: 20px; text-align: ${align};}
        .container {max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);}
        .header {background-color: ${GREEN}; padding: 30px 20px; text-align: center; border-bottom: 4px solid ${GOLD};}
        .logo {max-width: 120px; margin: 0 auto 15px; display: block;}
        .header h1 {color: #ffffff; margin: 0; font-size: 22px; font-weight: bold;}
        .header-subtitle {color: #e8e8e8; margin: 8px 0 0; font-size: 14px;}
        .content {padding: 30px 25px;}
        .greeting {font-size: 16px; color: ${GREEN}; font-weight: bold; margin-bottom: 15px;}
        .message {font-size: 15px; line-height: 1.8; color: #555; margin-bottom: 20px;}
        .features {background-color: #f5f5f5; padding: 20px; border-radius: 6px; margin: 25px 0;}
        .feature {margin: 12px 0; color: #555; font-size: 14px;}
        .offer-box {background-color: #f5f5f5; border-${align}: 4px solid ${GOLD}; padding: 20px; border-radius: 6px; margin: 25px 0;}
        .offer-title {font-size: 16px; font-weight: bold; color: ${GREEN}; margin-bottom: 12px;}
        .offer-detail {margin: 8px 0; color: #555; font-size: 14px;}
        .benefits {background-color: #f9f9f9; padding: 18px 20px; border-radius: 6px; margin: 20px 0;}
        .benefit {margin: 10px 0; color: #555; font-size: 14px;}
        .manager-box {background-color: #f5f5f5; border-${align}: 4px solid ${GREEN}; padding: 20px; border-radius: 6px; margin: 25px 0; text-align: center;}
        .manager-name {font-size: 18px; font-weight: bold; color: ${GREEN}; margin-bottom: 4px;}
        .manager-detail {color: #555; font-size: 14px; line-height: 1.8;}
        .cta-button {display: inline-block; background: linear-gradient(135deg, ${GREEN} 0%, #1a5c3a 100%); color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px; margin: 10px auto; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);}
        .cta-label {font-size: 12px; color: #888; margin-top: 10px;}
        .footer {background-color: #f5f5f5; padding: 20px 25px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #888; text-align: center;}
        .prop-row {display: flex; justify-content: space-between; padding: 9px 0; border-bottom: 1px solid #e6e6e6; font-size: 14px;}
        .prop-key {color: #777;}
        .prop-val {color: #333; font-weight: bold;}`;
}

function shell(opts: {
  lang: TplLang;
  title: string;
  h1: string;
  subtitle?: string;
  content: string;
  footer: string;
}): string {
  const { lang, title, h1, subtitle, content, footer } = opts;
  return `<!DOCTYPE html>
<html lang="${lang}" dir="${isRtl(lang) ? "rtl" : "ltr"}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>${css(lang)}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="${LOGO_URL}" alt="KT Bank AG" class="logo">
            <h1>${h1}</h1>${subtitle ? `\n            <p class="header-subtitle">${subtitle}</p>` : ""}
        </div>
        <div class="content">
${content}
        </div>
        <div class="footer">
            © 2026 KT Bank AG | ${footer}
        </div>
    </div>
</body>
</html>`;
}

/* ── Shared strings ── */
const FOOTER: Record<TplLang, string> = {
  de: "Beaufsichtigt durch die BaFin",
  fr: "Supervisée par la BaFin",
  en: "Supervised by BaFin",
  ar: "تحت إشراف الهيئة الألمانية BaFin",
  tr: "BaFin tarafından denetlenmektedir",
  es: "Supervisada por la BaFin",
  it: "Vigilata dalla BaFin",
  pt: "Supervisionada pela BaFin",
  nl: "Onder toezicht van de BaFin",
};

const HELLO: Record<TplLang, string> = {
  de: "Guten Tag", fr: "Bonjour", en: "Hello", ar: "مرحباً",
  tr: "Merhaba", es: "Hola", it: "Buongiorno", pt: "Olá", nl: "Hallo",
};

/* ══════════════════════════ 1. WELCOME ══════════════════════════ */
type WelcomeC = {
  subject: string; h1: string; msg1: string; msg2: string;
  featuresTitle: string; features: [string, string, string, string];
  msg3: string; cta: string; msg4: string;
};

const WELCOME: Record<TplLang, WelcomeC> = {
  fr: {
    subject: "Bienvenue chez KT Bank AG",
    h1: "Bienvenue !",
    msg1: "Nous vous remercions d'avoir choisi KT Bank AG. Nous sommes ravis de vous accueillir au sein de notre communauté de clients satisfaits.",
    msg2: "<strong>Votre compte est maintenant actif !</strong> Vous pouvez accéder à votre espace client pour gérer votre compte et explorer nos offres de financement.",
    featuresTitle: "✅ Que pouvez-vous faire maintenant ?",
    features: [
      "Accéder à votre Espace Client",
      "Consulter nos offres de financement islamique (Murabaha 0 %)",
      "Soumettre une demande de prêt personnel",
      "Contacter votre gestionnaire de compte",
    ],
    msg3: "Si vous avez des questions ou besoin d'assistance, n'hésitez pas à nous contacter. Votre satisfaction est notre priorité.",
    cta: "Accéder à mon Espace Client",
    msg4: "Bienvenue à bord ! 🎉",
  },
  de: {
    subject: "Willkommen bei der KT Bank AG",
    h1: "Herzlich willkommen!",
    msg1: "Vielen Dank, dass Sie sich für die KT Bank AG entschieden haben. Wir freuen uns sehr, Sie in unserer Gemeinschaft zufriedener Kunden begrüßen zu dürfen.",
    msg2: "<strong>Ihr Konto ist jetzt aktiv!</strong> Sie können sich in Ihrem Kundenbereich anmelden, um Ihr Konto zu verwalten und unsere Finanzierungsangebote zu entdecken.",
    featuresTitle: "✅ Was können Sie jetzt tun?",
    features: [
      "Ihren Kundenbereich aufrufen",
      "Unsere islamischen Finanzierungsangebote ansehen (Murabaha 0 %)",
      "Einen Privatkreditantrag stellen",
      "Ihren Kundenbetreuer kontaktieren",
    ],
    msg3: "Bei Fragen oder wenn Sie Unterstützung benötigen, wenden Sie sich jederzeit gerne an uns. Ihre Zufriedenheit ist unsere Priorität.",
    cta: "Zum Kundenbereich",
    msg4: "Willkommen an Bord! 🎉",
  },
  en: {
    subject: "Welcome to KT Bank AG",
    h1: "Welcome!",
    msg1: "Thank you for choosing KT Bank AG. We are delighted to welcome you to our community of satisfied clients.",
    msg2: "<strong>Your account is now active!</strong> You can sign in to your client area to manage your account and explore our financing offers.",
    featuresTitle: "✅ What can you do now?",
    features: [
      "Access your Client Area",
      "View our Islamic financing offers (Murabaha 0%)",
      "Submit a personal loan application",
      "Contact your account manager",
    ],
    msg3: "If you have any questions or need assistance, please do not hesitate to contact us. Your satisfaction is our priority.",
    cta: "Access my Client Area",
    msg4: "Welcome aboard! 🎉",
  },
  ar: {
    subject: "مرحباً بكم في KT Bank AG",
    h1: "مرحباً بكم!",
    msg1: "نشكركم على اختيار KT Bank AG. يسعدنا أن نرحب بكم في مجتمع عملائنا.",
    msg2: "<strong>حسابكم مُفعَّل الآن!</strong> يمكنكم الدخول إلى منطقة العملاء لإدارة حسابكم واستكشاف عروض التمويل الخاصة بنا.",
    featuresTitle: "✅ ما الذي يمكنكم فعله الآن؟",
    features: [
      "الدخول إلى منطقة العملاء",
      "الاطلاع على عروض التمويل الإسلامي (مرابحة 0%)",
      "تقديم طلب قرض شخصي",
      "التواصل مع مدير حسابكم",
    ],
    msg3: "إذا كانت لديكم أي أسئلة أو كنتم بحاجة إلى مساعدة، لا تتردّدوا في التواصل معنا. رضاكم هو أولويتنا.",
    cta: "الدخول إلى منطقة العملاء",
    msg4: "مرحباً بكم معنا! 🎉",
  },
  tr: {
    subject: "KT Bank AG'ye hoş geldiniz",
    h1: "Hoş geldiniz!",
    msg1: "KT Bank AG'yi tercih ettiğiniz için teşekkür ederiz. Memnun müşterilerimizden oluşan topluluğumuza sizi katmaktan büyük mutluluk duyuyoruz.",
    msg2: "<strong>Hesabınız artık aktif!</strong> Hesabınızı yönetmek ve finansman tekliflerimizi keşfetmek için müşteri alanınıza giriş yapabilirsiniz.",
    featuresTitle: "✅ Şimdi neler yapabilirsiniz?",
    features: [
      "Müşteri alanınıza erişmek",
      "İslami finansman tekliflerimizi incelemek (Murabaha %0)",
      "Bireysel kredi başvurusu yapmak",
      "Hesap yöneticinizle iletişime geçmek",
    ],
    msg3: "Sorularınız olması veya desteğe ihtiyaç duymanız hâlinde bizimle iletişime geçmekten çekinmeyin. Memnuniyetiniz bizim önceliğimizdir.",
    cta: "Müşteri alanıma giriş",
    msg4: "Aramıza hoş geldiniz! 🎉",
  },
  es: {
    subject: "Bienvenido/a a KT Bank AG",
    h1: "¡Bienvenido/a!",
    msg1: "Le agradecemos que haya elegido KT Bank AG. Nos complace darle la bienvenida a nuestra comunidad de clientes satisfechos.",
    msg2: "<strong>¡Su cuenta ya está activa!</strong> Puede acceder a su área de cliente para gestionar su cuenta y descubrir nuestras ofertas de financiación.",
    featuresTitle: "✅ ¿Qué puede hacer ahora?",
    features: [
      "Acceder a su Área de Cliente",
      "Consultar nuestras ofertas de financiación islámica (Murabaha 0 %)",
      "Presentar una solicitud de préstamo personal",
      "Contactar con su gestor de cuenta",
    ],
    msg3: "Si tiene alguna pregunta o necesita ayuda, no dude en ponerse en contacto con nosotros. Su satisfacción es nuestra prioridad.",
    cta: "Acceder a mi Área de Cliente",
    msg4: "¡Bienvenido/a a bordo! 🎉",
  },
  it: {
    subject: "Benvenuto/a in KT Bank AG",
    h1: "Benvenuto/a!",
    msg1: "La ringraziamo per aver scelto KT Bank AG. Siamo lieti di accoglierla nella nostra comunità di clienti soddisfatti.",
    msg2: "<strong>Il suo conto è ora attivo!</strong> Può accedere alla sua area clienti per gestire il conto e scoprire le nostre offerte di finanziamento.",
    featuresTitle: "✅ Cosa può fare adesso?",
    features: [
      "Accedere alla sua Area Clienti",
      "Consultare le nostre offerte di finanziamento islamico (Murabaha 0 %)",
      "Presentare una richiesta di prestito personale",
      "Contattare il suo gestore di conto",
    ],
    msg3: "Per qualsiasi domanda o necessità di assistenza, non esiti a contattarci. La sua soddisfazione è la nostra priorità.",
    cta: "Accedi alla mia Area Clienti",
    msg4: "Benvenuto/a a bordo! 🎉",
  },
  pt: {
    subject: "Bem-vindo/a ao KT Bank AG",
    h1: "Bem-vindo/a!",
    msg1: "Agradecemos por ter escolhido o KT Bank AG. É com grande satisfação que o/a acolhemos na nossa comunidade de clientes.",
    msg2: "<strong>A sua conta está agora ativa!</strong> Pode aceder à sua área de cliente para gerir a sua conta e explorar as nossas ofertas de financiamento.",
    featuresTitle: "✅ O que pode fazer agora?",
    features: [
      "Aceder à sua Área de Cliente",
      "Consultar as nossas ofertas de financiamento islâmico (Murabaha 0 %)",
      "Submeter um pedido de crédito pessoal",
      "Contactar o seu gestor de conta",
    ],
    msg3: "Se tiver alguma questão ou necessitar de assistência, não hesite em contactar-nos. A sua satisfação é a nossa prioridade.",
    cta: "Aceder à minha Área de Cliente",
    msg4: "Bem-vindo/a a bordo! 🎉",
  },
  nl: {
    subject: "Welkom bij KT Bank AG",
    h1: "Welkom!",
    msg1: "Hartelijk dank dat u voor KT Bank AG hebt gekozen. Wij verwelkomen u met genoegen in onze gemeenschap van tevreden klanten.",
    msg2: "<strong>Uw rekening is nu actief!</strong> U kunt inloggen op uw klantomgeving om uw rekening te beheren en onze financieringsaanbiedingen te bekijken.",
    featuresTitle: "✅ Wat kunt u nu doen?",
    features: [
      "Naar uw klantomgeving gaan",
      "Onze islamitische financieringsaanbiedingen bekijken (Murabaha 0 %)",
      "Een aanvraag voor een persoonlijke lening indienen",
      "Contact opnemen met uw accountmanager",
    ],
    msg3: "Heeft u vragen of hulp nodig? Neem dan gerust contact met ons op. Uw tevredenheid is onze prioriteit.",
    cta: "Naar mijn klantomgeving",
    msg4: "Welkom aan boord! 🎉",
  },
};

function renderWelcome(lang: TplLang, clientName: string): { subject: string; html: string } {
  const c = WELCOME[lang];
  const content = `            <div class="greeting">${HELLO[lang]} ${clientName},</div>
            <div class="message">
                ${c.msg1}
            </div>
            <div class="message">
                ${c.msg2}
            </div>
            <div class="features">
                <div><strong>${c.featuresTitle}</strong></div>
                <div class="feature">• ${c.features[0]}: <a href="${PORTAL_URL}" style="color: ${GREEN}; font-weight: bold;">${PORTAL_LABEL}</a></div>
                <div class="feature">• ${c.features[1]}</div>
                <div class="feature">• ${c.features[2]}</div>
                <div class="feature">• ${c.features[3]}</div>
            </div>
            <div class="message">
                ${c.msg3}
            </div>
            <div style="text-align: center; margin: 20px 0;">
                <a href="${PORTAL_URL}" class="cta-button">${c.cta}</a>
            </div>
            <div class="message">
                ${c.msg4}
            </div>`;
  return {
    subject: c.subject,
    html: shell({ lang, title: c.subject, h1: c.h1, content, footer: FOOTER[lang] }),
  };
}

/* ══════════════════════ 2. PROMO ISLAMIC ══════════════════════ */
type PromoC = {
  subject: string; h1: string; subtitle: string; intro: string;
  offerTitle: string; offerDetails: [string, string, string, string];
  whyTitle: string; benefits: [string, string, string, string];
  cta: string; closing: string;
};

const PROMO: Record<TplLang, PromoC> = {
  fr: {
    subject: "Financement Islamique 0 % — KT Bank AG",
    h1: "Financement Islamique",
    subtitle: "Murabaha 0 % — Conforme à vos valeurs",
    intro: "Découvrez notre solution de financement conforme aux principes islamiques : <strong>Murabaha 0 %</strong>",
    offerTitle: "💰 Offre Spéciale Murabaha",
    offerDetails: ["Taux d'intérêt : 0 %", "Financement automobile ou personnel", "Pas de frais de dossier", "Approbation rapide en 24–48 h"],
    whyTitle: "Pourquoi choisir notre financement islamique ?",
    benefits: ["Conforme aux principes islamiques (sans Riba)", "Transparent et juste pour tous les clients", "Conditions flexibles adaptées à votre situation", "Accompagnement personnel de votre gestionnaire de compte"],
    cta: "Faire une Demande de Financement",
    closing: "Intéressé ? Contactez-nous dès maintenant pour une consultation gratuite !",
  },
  de: {
    subject: "Islamische Finanzierung 0 % — KT Bank AG",
    h1: "Islamische Finanzierung",
    subtitle: "Murabaha 0 % — im Einklang mit Ihren Werten",
    intro: "Entdecken Sie unsere Finanzierungslösung nach islamischen Grundsätzen: <strong>Murabaha 0 %</strong>",
    offerTitle: "💰 Sonderangebot Murabaha",
    offerDetails: ["Zinssatz: 0 %", "Fahrzeug- oder Privatfinanzierung", "Keine Bearbeitungsgebühren", "Schnelle Zusage in 24–48 Stunden"],
    whyTitle: "Warum unsere islamische Finanzierung?",
    benefits: ["Konform mit islamischen Grundsätzen (ohne Riba)", "Transparent und fair für alle Kunden", "Flexible, auf Ihre Situation abgestimmte Konditionen", "Persönliche Betreuung durch Ihren Kundenbetreuer"],
    cta: "Finanzierung beantragen",
    closing: "Interessiert? Kontaktieren Sie uns jetzt für eine kostenlose Beratung!",
  },
  en: {
    subject: "0% Islamic Financing — KT Bank AG",
    h1: "Islamic Financing",
    subtitle: "Murabaha 0% — aligned with your values",
    intro: "Discover our financing solution compliant with Islamic principles: <strong>Murabaha 0%</strong>",
    offerTitle: "💰 Special Murabaha Offer",
    offerDetails: ["Interest rate: 0%", "Vehicle or personal financing", "No arrangement fees", "Fast approval within 24–48 hours"],
    whyTitle: "Why choose our Islamic financing?",
    benefits: ["Compliant with Islamic principles (Riba-free)", "Transparent and fair for every client", "Flexible terms tailored to your situation", "Personal support from your account manager"],
    cta: "Apply for Financing",
    closing: "Interested? Contact us today for a free consultation!",
  },
  ar: {
    subject: "تمويل إسلامي 0% — KT Bank AG",
    h1: "التمويل الإسلامي",
    subtitle: "مرابحة 0% — بما يتوافق مع قيمكم",
    intro: "اكتشفوا حل التمويل المتوافق مع أحكام الشريعة الإسلامية: <strong>مرابحة 0%</strong>",
    offerTitle: "💰 عرض مرابحة خاص",
    offerDetails: ["نسبة الفائدة: 0%", "تمويل السيارات أو التمويل الشخصي", "بدون رسوم إدارية", "موافقة سريعة خلال 24–48 ساعة"],
    whyTitle: "لماذا تختارون تمويلنا الإسلامي؟",
    benefits: ["متوافق مع أحكام الشريعة (خالٍ من الربا)", "شفاف وعادل لجميع العملاء", "شروط مرنة تلائم وضعكم", "متابعة شخصية من مدير حسابكم"],
    cta: "تقديم طلب تمويل",
    closing: "مهتمون؟ تواصلوا معنا الآن للحصول على استشارة مجانية!",
  },
  tr: {
    subject: "%0 İslami Finansman — KT Bank AG",
    h1: "İslami Finansman",
    subtitle: "Murabaha %0 — değerlerinize uygun",
    intro: "İslami prensiplere uygun finansman çözümümüzü keşfedin: <strong>Murabaha %0</strong>",
    offerTitle: "💰 Özel Murabaha Teklifi",
    offerDetails: ["Faiz oranı: %0", "Taşıt veya bireysel finansman", "Dosya masrafı yok", "24–48 saat içinde hızlı onay"],
    whyTitle: "Neden İslami finansmanımızı seçmelisiniz?",
    benefits: ["İslami prensiplere uygun (Riba içermez)", "Tüm müşteriler için şeffaf ve adil", "Durumunuza uygun esnek koşullar", "Hesap yöneticinizden kişisel destek"],
    cta: "Finansman Başvurusu Yap",
    closing: "İlgileniyor musunuz? Ücretsiz danışmanlık için hemen bizimle iletişime geçin!",
  },
  es: {
    subject: "Financiación Islámica 0 % — KT Bank AG",
    h1: "Financiación Islámica",
    subtitle: "Murabaha 0 % — acorde con sus valores",
    intro: "Descubra nuestra solución de financiación conforme a los principios islámicos: <strong>Murabaha 0 %</strong>",
    offerTitle: "💰 Oferta Especial Murabaha",
    offerDetails: ["Tipo de interés: 0 %", "Financiación de vehículo o personal", "Sin gastos de apertura", "Aprobación rápida en 24–48 h"],
    whyTitle: "¿Por qué elegir nuestra financiación islámica?",
    benefits: ["Conforme a los principios islámicos (sin Riba)", "Transparente y justa para todos los clientes", "Condiciones flexibles adaptadas a su situación", "Acompañamiento personal de su gestor de cuenta"],
    cta: "Solicitar Financiación",
    closing: "¿Le interesa? Contáctenos hoy mismo para una consulta gratuita.",
  },
  it: {
    subject: "Finanziamento Islamico 0 % — KT Bank AG",
    h1: "Finanziamento Islamico",
    subtitle: "Murabaha 0 % — in linea con i suoi valori",
    intro: "Scopra la nostra soluzione di finanziamento conforme ai principi islamici: <strong>Murabaha 0 %</strong>",
    offerTitle: "💰 Offerta Speciale Murabaha",
    offerDetails: ["Tasso d'interesse: 0 %", "Finanziamento auto o personale", "Nessuna spesa di istruttoria", "Approvazione rapida in 24–48 ore"],
    whyTitle: "Perché scegliere il nostro finanziamento islamico?",
    benefits: ["Conforme ai principi islamici (senza Riba)", "Trasparente ed equo per tutti i clienti", "Condizioni flessibili adatte alla sua situazione", "Assistenza personale del suo gestore di conto"],
    cta: "Richiedi il Finanziamento",
    closing: "Interessato? Ci contatti subito per una consulenza gratuita!",
  },
  pt: {
    subject: "Financiamento Islâmico 0 % — KT Bank AG",
    h1: "Financiamento Islâmico",
    subtitle: "Murabaha 0 % — em linha com os seus valores",
    intro: "Descubra a nossa solução de financiamento em conformidade com os princípios islâmicos: <strong>Murabaha 0 %</strong>",
    offerTitle: "💰 Oferta Especial Murabaha",
    offerDetails: ["Taxa de juro: 0 %", "Financiamento automóvel ou pessoal", "Sem despesas de processo", "Aprovação rápida em 24–48 horas"],
    whyTitle: "Porque escolher o nosso financiamento islâmico?",
    benefits: ["Em conformidade com os princípios islâmicos (sem Riba)", "Transparente e justo para todos os clientes", "Condições flexíveis adaptadas à sua situação", "Acompanhamento pessoal do seu gestor de conta"],
    cta: "Pedir Financiamento",
    closing: "Interessado? Contacte-nos hoje mesmo para uma consulta gratuita!",
  },
  nl: {
    subject: "Islamitische Financiering 0 % — KT Bank AG",
    h1: "Islamitische Financiering",
    subtitle: "Murabaha 0 % — in lijn met uw waarden",
    intro: "Ontdek onze financieringsoplossing volgens islamitische principes: <strong>Murabaha 0 %</strong>",
    offerTitle: "💰 Speciale Murabaha-aanbieding",
    offerDetails: ["Rentepercentage: 0 %", "Auto- of persoonlijke financiering", "Geen dossierkosten", "Snelle goedkeuring binnen 24–48 uur"],
    whyTitle: "Waarom onze islamitische financiering?",
    benefits: ["Conform islamitische principes (Riba-vrij)", "Transparant en eerlijk voor alle klanten", "Flexibele voorwaarden afgestemd op uw situatie", "Persoonlijke begeleiding door uw accountmanager"],
    cta: "Financiering aanvragen",
    closing: "Interesse? Neem vandaag nog contact met ons op voor een gratis consult!",
  },
};

function renderPromo(lang: TplLang, clientName: string): { subject: string; html: string } {
  const c = PROMO[lang];
  const content = `            <div class="greeting">${HELLO[lang]} ${clientName},</div>
            <div class="message">
                ${c.intro}
            </div>
            <div class="offer-box">
                <div class="offer-title">${c.offerTitle}</div>
                <div class="offer-detail">✓ ${c.offerDetails[0]}</div>
                <div class="offer-detail">✓ ${c.offerDetails[1]}</div>
                <div class="offer-detail">✓ ${c.offerDetails[2]}</div>
                <div class="offer-detail">✓ ${c.offerDetails[3]}</div>
            </div>
            <div class="message">
                <strong>${c.whyTitle}</strong>
            </div>
            <div class="benefits">
                <div class="benefit">✅ ${c.benefits[0]}</div>
                <div class="benefit">✅ ${c.benefits[1]}</div>
                <div class="benefit">✅ ${c.benefits[2]}</div>
                <div class="benefit">✅ ${c.benefits[3]}</div>
            </div>
            <div style="text-align: center; margin: 20px 0;">
                <a href="${PORTAL_URL}" class="cta-button">${c.cta}</a>
            </div>
            <div class="message">
                ${c.closing}
            </div>`;
  return {
    subject: c.subject,
    html: shell({ lang, title: c.subject, h1: c.h1, subtitle: c.subtitle, content, footer: FOOTER[lang] }),
  };
}

/* ══════════════════ 3. CONTACT MANAGER (WhatsApp) ══════════════════ */
type ManagerC = {
  subject: string; h1: string; intro: string; role: string;
  waLabel: string; emailLabel: string; availLabel: string; avail: string;
  cta: string; ctaLabel: string; closing: string; waMsg: string;
};

const MANAGER: Record<TplLang, ManagerC> = {
  fr: {
    subject: "Votre Gestionnaire est Disponible", h1: "Votre Gestionnaire",
    intro: "Avez-vous des questions sur votre compte ou nos services ? Votre gestionnaire de compte est là pour vous aider !",
    role: "Senior Gestionnaire de Compte",
    waLabel: "📞 WhatsApp :", emailLabel: "✉️ E-mail :", availLabel: "⏰ Disponible :", avail: "Lun–Ven, 9h–18h",
    cta: "💬 Contacter sur WhatsApp", ctaLabel: "Cliquez pour ouvrir WhatsApp directement",
    closing: "Ne tardez pas — {MANAGER_NAME} est là pour vous aider rapidement et efficacement ! 😊",
    waMsg: "Bonjour, j'ai une question sur mon compte",
  },
  de: {
    subject: "Ihr Kundenbetreuer ist für Sie da", h1: "Ihr Kundenbetreuer",
    intro: "Haben Sie Fragen zu Ihrem Konto oder unseren Leistungen? Ihr Kundenbetreuer ist für Sie da!",
    role: "Senior Kundenbetreuer",
    waLabel: "📞 WhatsApp:", emailLabel: "✉️ E-Mail:", availLabel: "⏰ Erreichbar:", avail: "Mo–Fr, 9–18 Uhr",
    cta: "💬 Über WhatsApp kontaktieren", ctaLabel: "Klicken, um WhatsApp direkt zu öffnen",
    closing: "Warten Sie nicht — {MANAGER_NAME} hilft Ihnen schnell und zuverlässig weiter! 😊",
    waMsg: "Guten Tag, ich habe eine Frage zu meinem Konto",
  },
  en: {
    subject: "Your Account Manager Is Available", h1: "Your Account Manager",
    intro: "Do you have questions about your account or our services? Your account manager is here to help!",
    role: "Senior Account Manager",
    waLabel: "📞 WhatsApp:", emailLabel: "✉️ Email:", availLabel: "⏰ Available:", avail: "Mon–Fri, 9 am–6 pm",
    cta: "💬 Contact via WhatsApp", ctaLabel: "Click to open WhatsApp directly",
    closing: "Don't wait — {MANAGER_NAME} is ready to help you quickly and efficiently! 😊",
    waMsg: "Hello, I have a question about my account",
  },
  ar: {
    subject: "مدير حسابكم متاح لخدمتكم", h1: "مدير حسابكم",
    intro: "هل لديكم أسئلة بخصوص حسابكم أو خدماتنا؟ مدير حسابكم هنا لمساعدتكم!",
    role: "مدير حسابات أول",
    waLabel: "📞 واتساب:", emailLabel: "✉️ البريد الإلكتروني:", availLabel: "⏰ أوقات التواصل:", avail: "الاثنين–الجمعة، 9 صباحاً–6 مساءً",
    cta: "💬 التواصل عبر واتساب", ctaLabel: "اضغطوا لفتح واتساب مباشرة",
    closing: "لا تتأخروا — {MANAGER_NAME} جاهز لمساعدتكم بسرعة وفعالية! 😊",
    waMsg: "مرحباً، لدي سؤال بخصوص حسابي",
  },
  tr: {
    subject: "Hesap Yöneticiniz Hizmetinizde", h1: "Hesap Yöneticiniz",
    intro: "Hesabınız veya hizmetlerimiz hakkında sorularınız mı var? Hesap yöneticiniz size yardımcı olmak için burada!",
    role: "Kıdemli Hesap Yöneticisi",
    waLabel: "📞 WhatsApp:", emailLabel: "✉️ E-posta:", availLabel: "⏰ Ulaşılabilir:", avail: "Pzt–Cum, 09:00–18:00",
    cta: "💬 WhatsApp'tan iletişime geç", ctaLabel: "WhatsApp'ı doğrudan açmak için tıklayın",
    closing: "Beklemeyin — {MANAGER_NAME} size hızlı ve etkili şekilde yardımcı olmaya hazır! 😊",
    waMsg: "Merhaba, hesabımla ilgili bir sorum var",
  },
  es: {
    subject: "Su Gestor de Cuenta está Disponible", h1: "Su Gestor de Cuenta",
    intro: "¿Tiene preguntas sobre su cuenta o nuestros servicios? Su gestor de cuenta está aquí para ayudarle.",
    role: "Gestor de Cuenta Senior",
    waLabel: "📞 WhatsApp:", emailLabel: "✉️ Correo:", availLabel: "⏰ Disponible:", avail: "Lun–Vie, 9:00–18:00",
    cta: "💬 Contactar por WhatsApp", ctaLabel: "Haga clic para abrir WhatsApp directamente",
    closing: "No espere: {MANAGER_NAME} está listo para ayudarle de forma rápida y eficaz. 😊",
    waMsg: "Hola, tengo una pregunta sobre mi cuenta",
  },
  it: {
    subject: "Il suo Gestore di Conto è disponibile", h1: "Il suo Gestore di Conto",
    intro: "Ha domande sul suo conto o sui nostri servizi? Il suo gestore di conto è a sua disposizione!",
    role: "Gestore di Conto Senior",
    waLabel: "📞 WhatsApp:", emailLabel: "✉️ E-mail:", availLabel: "⏰ Disponibile:", avail: "Lun–Ven, 9:00–18:00",
    cta: "💬 Contatta su WhatsApp", ctaLabel: "Clicchi per aprire WhatsApp direttamente",
    closing: "Non attenda: {MANAGER_NAME} è pronto ad aiutarla in modo rapido ed efficace! 😊",
    waMsg: "Buongiorno, ho una domanda sul mio conto",
  },
  pt: {
    subject: "O seu Gestor de Conta está Disponível", h1: "O seu Gestor de Conta",
    intro: "Tem questões sobre a sua conta ou os nossos serviços? O seu gestor de conta está aqui para ajudar!",
    role: "Gestor de Conta Sénior",
    waLabel: "📞 WhatsApp:", emailLabel: "✉️ E-mail:", availLabel: "⏰ Disponível:", avail: "Seg–Sex, 9h–18h",
    cta: "💬 Contactar via WhatsApp", ctaLabel: "Clique para abrir o WhatsApp diretamente",
    closing: "Não espere — {MANAGER_NAME} está pronto para o ajudar de forma rápida e eficaz! 😊",
    waMsg: "Olá, tenho uma questão sobre a minha conta",
  },
  nl: {
    subject: "Uw Accountmanager is Beschikbaar", h1: "Uw Accountmanager",
    intro: "Heeft u vragen over uw rekening of onze diensten? Uw accountmanager staat voor u klaar!",
    role: "Senior Accountmanager",
    waLabel: "📞 WhatsApp:", emailLabel: "✉️ E-mail:", availLabel: "⏰ Bereikbaar:", avail: "Ma–Vr, 9:00–18:00",
    cta: "💬 Contact via WhatsApp", ctaLabel: "Klik om WhatsApp direct te openen",
    closing: "Wacht niet — {MANAGER_NAME} helpt u graag snel en efficiënt! 😊",
    waMsg: "Hallo, ik heb een vraag over mijn rekening",
  },
};

function renderManager(lang: TplLang, clientName: string, managerName: string): { subject: string; html: string } {
  const c = MANAGER[lang];
  const waHref = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(c.waMsg)}`;
  const content = `            <div class="greeting">${HELLO[lang]} ${clientName},</div>
            <div class="message">
                ${c.intro}
            </div>
            <div class="manager-box">
                <div class="manager-name">${managerName}</div>
                <div class="manager-detail">${c.role}</div>
                <div class="manager-detail" style="margin-top: 12px; font-weight: bold;">
                    ${c.waLabel} ${WA_DISPLAY}<br/>
                    ${c.emailLabel} ${SUPPORT_EMAIL}<br/>
                    ${c.availLabel} ${c.avail}
                </div>
            </div>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${waHref}" class="cta-button">
                    ${c.cta}
                </a>
                <div class="cta-label">${c.ctaLabel}</div>
            </div>
            <div class="message">
                ${c.closing.replace(/\{MANAGER_NAME\}/g, managerName)}
            </div>`;
  return {
    subject: c.subject,
    html: shell({ lang, title: c.subject, h1: c.h1, content, footer: FOOTER[lang] }),
  };
}

/* ═════════════════ 4. FINANCING PROPOSAL ═════════════════ */
type ProposalC = {
  subject: string; h1: string; subtitle: string; intro: string; offerTitle: string;
  kAmount: string; kDuration: string; kMonthly: string; kType: string; kFees: string; kValidity: string;
  vType: string; vFees: string; months: string; days: string;
  cta: string; closing: string;
};

const PROPOSAL: Record<TplLang, ProposalC> = {
  fr: {
    subject: "Votre Proposition de Financement Personnalisée", h1: "Votre Proposition",
    subtitle: "Financement personnalisé Murabaha 0 %",
    intro: "Suite à l'étude de votre dossier, nous avons le plaisir de vous présenter votre proposition de financement personnalisée.",
    offerTitle: "📋 Votre Offre de Financement",
    kAmount: "Montant du financement", kDuration: "Durée", kMonthly: "Mensualité",
    kType: "Type de financement", kFees: "Frais de dossier", kValidity: "Validité de l'offre",
    vType: "Murabaha 0 % (sans intérêts)", vFees: "AUCUN", months: "mois", days: "jours",
    cta: "Consulter mon Offre Complète",
    closing: "Pour toute question, {MANAGER_NAME} reste à votre entière disposition.",
  },
  de: {
    subject: "Ihr persönliches Finanzierungsangebot", h1: "Ihr Angebot",
    subtitle: "Persönliche Finanzierung Murabaha 0 %",
    intro: "Nach Prüfung Ihrer Unterlagen freuen wir uns, Ihnen Ihr persönliches Finanzierungsangebot zu unterbreiten.",
    offerTitle: "📋 Ihr Finanzierungsangebot",
    kAmount: "Finanzierungsbetrag", kDuration: "Laufzeit", kMonthly: "Monatsrate",
    kType: "Finanzierungsart", kFees: "Bearbeitungsgebühren", kValidity: "Gültigkeit des Angebots",
    vType: "Murabaha 0 % (zinsfrei)", vFees: "KEINE", months: "Monate", days: "Tage",
    cta: "Mein vollständiges Angebot ansehen",
    closing: "Für alle Fragen steht Ihnen {MANAGER_NAME} jederzeit gerne zur Verfügung.",
  },
  en: {
    subject: "Your Personalised Financing Proposal", h1: "Your Proposal",
    subtitle: "Personalised Murabaha 0% financing",
    intro: "Following the review of your file, we are pleased to present your personalised financing proposal.",
    offerTitle: "📋 Your Financing Offer",
    kAmount: "Financing amount", kDuration: "Term", kMonthly: "Monthly payment",
    kType: "Financing type", kFees: "Arrangement fees", kValidity: "Offer validity",
    vType: "Murabaha 0% (interest-free)", vFees: "NONE", months: "months", days: "days",
    cta: "View my Full Offer",
    closing: "Should you have any questions, {MANAGER_NAME} remains entirely at your disposal.",
  },
  ar: {
    subject: "عرض التمويل المخصص لكم", h1: "عرضكم",
    subtitle: "تمويل مخصص — مرابحة 0%",
    intro: "بعد دراسة ملفكم، يسعدنا أن نقدم لكم عرض التمويل المخصص الخاص بكم.",
    offerTitle: "📋 عرض التمويل الخاص بكم",
    kAmount: "مبلغ التمويل", kDuration: "المدة", kMonthly: "القسط الشهري",
    kType: "نوع التمويل", kFees: "الرسوم الإدارية", kValidity: "صلاحية العرض",
    vType: "مرابحة 0% (بدون فوائد)", vFees: "لا توجد", months: "شهراً", days: "يوماً",
    cta: "الاطلاع على العرض الكامل",
    closing: "لأي استفسار، يبقى {MANAGER_NAME} رهن إشارتكم.",
  },
  tr: {
    subject: "Size Özel Finansman Teklifiniz", h1: "Teklifiniz",
    subtitle: "Size özel Murabaha %0 finansman",
    intro: "Dosyanızın incelenmesinin ardından, size özel finansman teklifimizi sunmaktan memnuniyet duyarız.",
    offerTitle: "📋 Finansman Teklifiniz",
    kAmount: "Finansman tutarı", kDuration: "Vade", kMonthly: "Aylık taksit",
    kType: "Finansman türü", kFees: "Dosya masrafı", kValidity: "Teklif geçerliliği",
    vType: "Murabaha %0 (faizsiz)", vFees: "YOK", months: "ay", days: "gün",
    cta: "Teklifimin Tamamını Görüntüle",
    closing: "Sorularınız için {MANAGER_NAME} her zaman hizmetinizdedir.",
  },
  es: {
    subject: "Su Propuesta de Financiación Personalizada", h1: "Su Propuesta",
    subtitle: "Financiación personalizada Murabaha 0 %",
    intro: "Tras el estudio de su expediente, nos complace presentarle su propuesta de financiación personalizada.",
    offerTitle: "📋 Su Oferta de Financiación",
    kAmount: "Importe de la financiación", kDuration: "Plazo", kMonthly: "Cuota mensual",
    kType: "Tipo de financiación", kFees: "Gastos de apertura", kValidity: "Validez de la oferta",
    vType: "Murabaha 0 % (sin intereses)", vFees: "NINGUNO", months: "meses", days: "días",
    cta: "Consultar mi Oferta Completa",
    closing: "Para cualquier consulta, {MANAGER_NAME} queda a su entera disposición.",
  },
  it: {
    subject: "La sua Proposta di Finanziamento Personalizzata", h1: "La sua Proposta",
    subtitle: "Finanziamento personalizzato Murabaha 0 %",
    intro: "A seguito dell'esame della sua pratica, siamo lieti di presentarle la sua proposta di finanziamento personalizzata.",
    offerTitle: "📋 La sua Offerta di Finanziamento",
    kAmount: "Importo del finanziamento", kDuration: "Durata", kMonthly: "Rata mensile",
    kType: "Tipo di finanziamento", kFees: "Spese di istruttoria", kValidity: "Validità dell'offerta",
    vType: "Murabaha 0 % (senza interessi)", vFees: "NESSUNA", months: "mesi", days: "giorni",
    cta: "Consulta la mia Offerta Completa",
    closing: "Per qualsiasi domanda, {MANAGER_NAME} resta a sua completa disposizione.",
  },
  pt: {
    subject: "A sua Proposta de Financiamento Personalizada", h1: "A sua Proposta",
    subtitle: "Financiamento personalizado Murabaha 0 %",
    intro: "Após a análise do seu processo, temos o prazer de lhe apresentar a sua proposta de financiamento personalizada.",
    offerTitle: "📋 A sua Oferta de Financiamento",
    kAmount: "Montante do financiamento", kDuration: "Prazo", kMonthly: "Prestação mensal",
    kType: "Tipo de financiamento", kFees: "Despesas de processo", kValidity: "Validade da oferta",
    vType: "Murabaha 0 % (sem juros)", vFees: "NENHUMA", months: "meses", days: "dias",
    cta: "Consultar a minha Oferta Completa",
    closing: "Para qualquer questão, {MANAGER_NAME} permanece à sua inteira disposição.",
  },
  nl: {
    subject: "Uw Persoonlijke Financieringsvoorstel", h1: "Uw Voorstel",
    subtitle: "Persoonlijke Murabaha 0 %-financiering",
    intro: "Na beoordeling van uw dossier bieden wij u met genoegen uw persoonlijke financieringsvoorstel aan.",
    offerTitle: "📋 Uw Financieringsaanbod",
    kAmount: "Financieringsbedrag", kDuration: "Looptijd", kMonthly: "Maandelijkse betaling",
    kType: "Soort financiering", kFees: "Dossierkosten", kValidity: "Geldigheid van het aanbod",
    vType: "Murabaha 0 % (rentevrij)", vFees: "GEEN", months: "maanden", days: "dagen",
    cta: "Mijn Volledige Aanbod Bekijken",
    closing: "Voor vragen staat {MANAGER_NAME} volledig tot uw beschikking.",
  },
};

function renderProposal(
  lang: TplLang,
  v: { clientName: string; managerName: string; amount: string; duration: string; monthly: string; validityDays: string },
): { subject: string; html: string } {
  const c = PROPOSAL[lang];
  const row = (k: string, val: string) =>
    `                <div class="prop-row"><span class="prop-key">${k}</span><span class="prop-val">${val}</span></div>`;
  const content = `            <div class="greeting">${HELLO[lang]} ${v.clientName},</div>
            <div class="message">
                ${c.intro}
            </div>
            <div class="offer-box">
                <div class="offer-title">${c.offerTitle}</div>
${row(c.kAmount, v.amount)}
${row(c.kDuration, `${v.duration} ${c.months}`)}
${row(c.kMonthly, v.monthly)}
${row(c.kType, c.vType)}
${row(c.kFees, c.vFees)}
${row(c.kValidity, `${v.validityDays} ${c.days}`)}
            </div>
            <div style="text-align: center; margin: 20px 0;">
                <a href="${PORTAL_URL}" class="cta-button">${c.cta}</a>
            </div>
            <div class="message">
                ${c.closing.replace(/\{MANAGER_NAME\}/g, v.managerName)}
            </div>`;
  return {
    subject: c.subject,
    html: shell({ lang, title: c.subject, h1: c.h1, subtitle: c.subtitle, content, footer: FOOTER[lang] }),
  };
}

/* ═════════════ 5. DOCUMENT REQUEST (credit application) ═════════════ */
type DocReqC = {
  subject: string; h1: string; subtitle: string; intro: string; freeNote: string;
  docsTitle: string; docs: [string, string, string];
  optLabel: string; optDoc: string;
  how: string; cta: string; closing: string;
};

const DOCREQ: Record<TplLang, DocReqC> = {
  fr: {
    subject: "Étude préliminaire gratuite — documents à fournir",
    h1: "Étude préliminaire gratuite", subtitle: "Faisabilité de votre financement — sans frais",
    intro: "Nous avons bien reçu votre demande de financement et vous en remercions. Nous procédons dès à présent à l'étude préliminaire de faisabilité de votre dossier, entièrement gratuite. Pour la réaliser, nous avons besoin des documents suivants.",
    freeNote: "Cette étude préliminaire de faisabilité est <strong>entièrement gratuite et sans engagement</strong> de votre part.",
    docsTitle: "📎 Documents nécessaires à l'étude",
    docs: [
      "<strong>Justificatif d'identité</strong> — carte d'identité ou passeport en cours de validité (inutile si vous l'avez déjà téléversé dans votre Espace Client)",
      "<strong>Relevé de compte</strong> — vos relevés bancaires des trois derniers mois",
      "<strong>Preuve de revenus réguliers</strong> — bulletins de salaire, attestation d'employeur ou avis d'imposition",
    ],
    optLabel: "Optionnel",
    optDoc: "<strong>Facture pro forma ou devis</strong> du bien à financer (véhicule, équipement, projet…), si vous en disposez",
    how: "Vous pouvez téléverser ces documents directement dans votre Espace Client ou, plus simplement, répondre à cet e-mail en les joignant.",
    cta: "Téléverser mes documents",
    closing: "Dès réception, nous poursuivrons l'étude de votre dossier dans les meilleurs délais. {MANAGER_NAME} reste à votre entière disposition pour toute question.",
  },
  de: {
    subject: "Kostenlose Vorprüfung — erforderliche Unterlagen",
    h1: "Kostenlose Vorprüfung", subtitle: "Machbarkeit Ihrer Finanzierung — gebührenfrei",
    intro: "Wir haben Ihren Finanzierungsantrag erhalten und bedanken uns dafür. Wir nehmen nun die Vorprüfung der Machbarkeit Ihres Antrags vor — für Sie vollständig kostenlos. Dafür benötigen wir die folgenden Unterlagen.",
    freeNote: "Diese Vorprüfung der Machbarkeit ist für Sie <strong>vollständig kostenlos und unverbindlich</strong>.",
    docsTitle: "📎 Für die Prüfung erforderliche Unterlagen",
    docs: [
      "<strong>Identitätsnachweis</strong> — gültiger Personalausweis oder Reisepass (nicht erforderlich, wenn Sie ihn bereits in Ihrem Kundenbereich hochgeladen haben)",
      "<strong>Kontoauszüge</strong> — Ihre Kontoauszüge der letzten drei Monate",
      "<strong>Nachweis regelmäßiger Einkünfte</strong> — Lohnabrechnungen, Arbeitgeberbescheinigung oder Steuerbescheid",
    ],
    optLabel: "Optional",
    optDoc: "<strong>Pro-forma-Rechnung oder Kostenangebot</strong> für das zu finanzierende Objekt (Fahrzeug, Ausstattung, Projekt …), sofern vorhanden",
    how: "Sie können diese Unterlagen direkt in Ihrem Kundenbereich hochladen oder einfach auf diese E-Mail antworten und sie als Anhang beifügen.",
    cta: "Unterlagen hochladen",
    closing: "Nach Erhalt setzen wir die Prüfung Ihres Antrags zeitnah fort. {MANAGER_NAME} steht Ihnen für Fragen jederzeit gerne zur Verfügung.",
  },
  en: {
    subject: "Free preliminary assessment — documents required",
    h1: "Free Preliminary Assessment", subtitle: "Feasibility of your financing — at no cost",
    intro: "We have received your financing application and thank you for it. We are now carrying out the preliminary feasibility assessment of your file, entirely free of charge. To do so, we need the following documents.",
    freeNote: "This preliminary feasibility assessment is <strong>entirely free of charge and without obligation</strong> on your part.",
    docsTitle: "📎 Documents required for the assessment",
    docs: [
      "<strong>Proof of identity</strong> — valid ID card or passport (not needed if you have already uploaded it in your Client Area)",
      "<strong>Bank statements</strong> — your account statements for the last three months",
      "<strong>Proof of regular income</strong> — payslips, employer's certificate or tax assessment",
    ],
    optLabel: "Optional",
    optDoc: "<strong>Pro forma invoice or quotation</strong> for the item to be financed (vehicle, equipment, project…), if available",
    how: "You can upload these documents directly in your Client Area, or simply reply to this email with them attached.",
    cta: "Upload my documents",
    closing: "Once received, we will continue reviewing your file as quickly as possible. {MANAGER_NAME} remains at your disposal for any questions.",
  },
  ar: {
    subject: "دراسة أولية مجانية — المستندات المطلوبة",
    h1: "دراسة أولية مجانية", subtitle: "دراسة جدوى تمويلكم — دون أي رسوم",
    intro: "لقد استلمنا طلب التمويل الخاص بكم ونشكركم عليه. نبدأ الآن بالدراسة الأولية لجدوى ملفكم، وهي مجانية بالكامل. ولإجرائها، نحتاج إلى المستندات التالية.",
    freeNote: "هذه الدراسة الأولية للجدوى <strong>مجانية بالكامل وغير مُلزِمة</strong> لكم.",
    docsTitle: "📎 المستندات اللازمة للدراسة",
    docs: [
      "<strong>إثبات الهوية</strong> — بطاقة هوية أو جواز سفر ساري المفعول (لا حاجة لذلك إذا كنتم قد حمّلتموه مسبقاً في منطقة العملاء)",
      "<strong>كشف الحساب البنكي</strong> — كشوف حسابكم لآخر ثلاثة أشهر",
      "<strong>إثبات دخل منتظم</strong> — قسائم الراتب أو شهادة من صاحب العمل أو الإقرار الضريبي",
    ],
    optLabel: "اختياري",
    optDoc: "<strong>فاتورة مبدئية (Pro forma) أو عرض سعر</strong> للأصل المطلوب تمويله (سيارة، معدات، مشروع…)، إن توفّر",
    how: "يمكنكم تحميل هذه المستندات مباشرة في منطقة العملاء، أو ببساطة الرد على هذا البريد الإلكتروني وإرفاقها.",
    cta: "تحميل مستنداتي",
    closing: "بعد الاستلام، سنواصل دراسة ملفكم في أسرع وقت ممكن. ويبقى {MANAGER_NAME} رهن إشارتكم لأي استفسار.",
  },
  tr: {
    subject: "Ücretsiz ön inceleme — gerekli belgeler",
    h1: "Ücretsiz Ön İnceleme", subtitle: "Finansmanınızın uygunluğu — ücretsiz",
    intro: "Finansman başvurunuzu aldık, teşekkür ederiz. Dosyanızın uygunluğuna ilişkin ön incelemeyi şimdi başlatıyoruz; bu inceleme tamamen ücretsizdir. Bunun için aşağıdaki belgelere ihtiyacımız var.",
    freeNote: "Bu ön uygunluk incelemesi sizin için <strong>tamamen ücretsizdir ve hiçbir bağlayıcılığı yoktur</strong>.",
    docsTitle: "📎 İnceleme için gerekli belgeler",
    docs: [
      "<strong>Kimlik belgesi</strong> — geçerli kimlik kartı veya pasaport (müşteri alanınıza daha önce yüklediyseniz gerekmez)",
      "<strong>Hesap dökümü</strong> — son üç aya ait banka hesap ekstreleriniz",
      "<strong>Düzenli gelir belgesi</strong> — maaş bordroları, işveren yazısı veya vergi beyannamesi",
    ],
    optLabel: "İsteğe bağlı",
    optDoc: "<strong>Proforma fatura veya teklif</strong> — finanse edilecek varlık için (taşıt, ekipman, proje…), mevcutsa",
    how: "Bu belgeleri doğrudan müşteri alanınıza yükleyebilir veya bu e-postayı yanıtlayarak ek olarak gönderebilirsiniz.",
    cta: "Belgelerimi yükle",
    closing: "Belgeleri aldıktan sonra dosyanızın incelenmesine en kısa sürede devam edeceğiz. Sorularınız için {MANAGER_NAME} her zaman hizmetinizdedir.",
  },
  es: {
    subject: "Estudio preliminar gratuito — documentos necesarios",
    h1: "Estudio Preliminar Gratuito", subtitle: "Viabilidad de su financiación — sin coste",
    intro: "Hemos recibido su solicitud de financiación y le agradecemos su confianza. Procedemos ya al estudio preliminar de viabilidad de su expediente, totalmente gratuito. Para realizarlo, necesitamos los siguientes documentos.",
    freeNote: "Este estudio preliminar de viabilidad es <strong>totalmente gratuito y sin compromiso</strong> por su parte.",
    docsTitle: "📎 Documentos necesarios para el estudio",
    docs: [
      "<strong>Documento de identidad</strong> — DNI o pasaporte en vigor (no es necesario si ya lo ha subido en su Área de Cliente)",
      "<strong>Extractos bancarios</strong> — sus extractos de cuenta de los últimos tres meses",
      "<strong>Justificante de ingresos regulares</strong> — nóminas, certificado de la empresa o declaración de la renta",
    ],
    optLabel: "Opcional",
    optDoc: "<strong>Factura pro forma o presupuesto</strong> del bien a financiar (vehículo, equipamiento, proyecto…), si dispone de él",
    how: "Puede subir estos documentos directamente en su Área de Cliente o, más sencillo, responder a este correo adjuntándolos.",
    cta: "Subir mis documentos",
    closing: "Una vez recibidos, continuaremos con el estudio de su expediente lo antes posible. {MANAGER_NAME} queda a su disposición para cualquier consulta.",
  },
  it: {
    subject: "Studio preliminare gratuito — documenti necessari",
    h1: "Studio Preliminare Gratuito", subtitle: "Fattibilità del suo finanziamento — senza spese",
    intro: "Abbiamo ricevuto la sua richiesta di finanziamento e la ringraziamo. Procediamo sin da ora allo studio preliminare di fattibilità della sua pratica, del tutto gratuito. Per realizzarlo, abbiamo bisogno dei seguenti documenti.",
    freeNote: "Questo studio preliminare di fattibilità è <strong>completamente gratuito e senza impegno</strong> da parte sua.",
    docsTitle: "📎 Documenti necessari per lo studio",
    docs: [
      "<strong>Documento d'identità</strong> — carta d'identità o passaporto in corso di validità (non necessario se lo ha già caricato nella sua Area Clienti)",
      "<strong>Estratti conto</strong> — i suoi estratti conto degli ultimi tre mesi",
      "<strong>Prova di redditi regolari</strong> — buste paga, attestazione del datore di lavoro o dichiarazione dei redditi",
    ],
    optLabel: "Facoltativo",
    optDoc: "<strong>Fattura pro forma o preventivo</strong> del bene da finanziare (veicolo, attrezzatura, progetto…), se disponibile",
    how: "Può caricare questi documenti direttamente nella sua Area Clienti oppure, più semplicemente, rispondere a questa e-mail allegandoli.",
    cta: "Carica i miei documenti",
    closing: "Alla ricezione, proseguiremo l'esame della sua pratica nel più breve tempo possibile. {MANAGER_NAME} resta a sua disposizione per qualsiasi domanda.",
  },
  pt: {
    subject: "Estudo preliminar gratuito — documentos necessários",
    h1: "Estudo Preliminar Gratuito", subtitle: "Viabilidade do seu financiamento — sem custos",
    intro: "Recebemos o seu pedido de financiamento e agradecemos a sua confiança. Vamos agora proceder ao estudo preliminar de viabilidade do seu processo, totalmente gratuito. Para o realizar, necessitamos dos seguintes documentos.",
    freeNote: "Este estudo preliminar de viabilidade é <strong>totalmente gratuito e sem qualquer compromisso</strong> da sua parte.",
    docsTitle: "📎 Documentos necessários para o estudo",
    docs: [
      "<strong>Documento de identificação</strong> — cartão de cidadão ou passaporte válido (não é necessário se já o carregou na sua Área de Cliente)",
      "<strong>Extratos bancários</strong> — os seus extratos de conta dos últimos três meses",
      "<strong>Comprovativo de rendimentos regulares</strong> — recibos de vencimento, declaração da entidade patronal ou declaração de IRS",
    ],
    optLabel: "Opcional",
    optDoc: "<strong>Fatura pro forma ou orçamento</strong> do bem a financiar (veículo, equipamento, projeto…), se disponível",
    how: "Pode carregar estes documentos diretamente na sua Área de Cliente ou, mais simplesmente, responder a este e-mail anexando-os.",
    cta: "Carregar os meus documentos",
    closing: "Após a receção, prosseguiremos com a análise do seu processo com a maior brevidade. {MANAGER_NAME} permanece à sua disposição para qualquer questão.",
  },
  nl: {
    subject: "Gratis voorstudie — benodigde documenten",
    h1: "Gratis Voorstudie", subtitle: "Haalbaarheid van uw financiering — kosteloos",
    intro: "Wij hebben uw financieringsaanvraag ontvangen en danken u daarvoor. Wij starten nu de voorstudie naar de haalbaarheid van uw dossier, volledig kosteloos. Daarvoor hebben wij de volgende documenten nodig.",
    freeNote: "Deze voorstudie naar de haalbaarheid is voor u <strong>volledig gratis en zonder verplichting</strong>.",
    docsTitle: "📎 Voor de studie benodigde documenten",
    docs: [
      "<strong>Identiteitsbewijs</strong> — geldig identiteitsbewijs of paspoort (niet nodig als u dit al in uw klantomgeving hebt geüpload)",
      "<strong>Rekeningafschriften</strong> — uw bankafschriften van de afgelopen drie maanden",
      "<strong>Bewijs van regelmatig inkomen</strong> — loonstroken, werkgeversverklaring of belastingaanslag",
    ],
    optLabel: "Optioneel",
    optDoc: "<strong>Pro forma factuur of prijsopgave</strong> van het te financieren object (voertuig, apparatuur, project…), indien beschikbaar",
    how: "U kunt deze documenten rechtstreeks in uw klantomgeving uploaden of eenvoudig op deze e-mail antwoorden met de bijlagen.",
    cta: "Mijn documenten uploaden",
    closing: "Na ontvangst zetten wij de beoordeling van uw dossier zo snel mogelijk voort. {MANAGER_NAME} blijft tot uw beschikking voor vragen.",
  },
};

function renderDocRequest(lang: TplLang, clientName: string, managerName: string): { subject: string; html: string } {
  const c = DOCREQ[lang];
  const content = `            <div class="greeting">${HELLO[lang]} ${clientName},</div>
            <div class="message">
                ${c.intro}
            </div>
            <div style="background:#f0f7f3; border-${isRtl(lang) ? "right" : "left"}:4px solid ${GREEN}; padding:14px 18px; border-radius:6px; margin:0 0 22px; font-size:14px; color:#1a5c3a; line-height:1.7;">
                ✅ ${c.freeNote}
            </div>
            <div class="features">
                <div><strong>${c.docsTitle}</strong></div>
                <div class="feature">1. ${c.docs[0]}</div>
                <div class="feature">2. ${c.docs[1]}</div>
                <div class="feature">3. ${c.docs[2]}</div>
            </div>
            <div class="benefits">
                <div class="benefit"><span style="display:inline-block;background:${GOLD};color:#ffffff;font-size:11px;font-weight:bold;padding:2px 8px;border-radius:10px;margin-bottom:6px;">${c.optLabel}</span><br/>${c.optDoc}</div>
            </div>
            <div class="message">
                ${c.how}
            </div>
            <div style="text-align: center; margin: 20px 0;">
                <a href="${PORTAL_URL}" class="cta-button">${c.cta}</a>
            </div>
            <div class="message">
                ${c.closing.replace(/\{MANAGER_NAME\}/g, managerName)}
            </div>`;
  return {
    subject: c.subject,
    html: shell({ lang, title: c.subject, h1: c.h1, subtitle: c.subtitle, content, footer: FOOTER[lang] }),
  };
}

/* ═════════════ 6. ACCOUNT FUNDING (activation deposit) ═════════════ */
type FundC = {
  subject: string; h1: string; subtitle: string; intro: string;
  detailsTitle: string; kBenef: string; kPurpose: string; kMin: string; vPurpose: string;
  reassure: string; how: string; cta: string; closing: string;
};

const FUNDING: Record<TplLang, FundC> = {
  fr: {
    subject: "Approvisionnement de votre compte — activation",
    h1: "Approvisionnement de votre compte", subtitle: "Activez votre compte KT Bank AG",
    intro: "Votre compte KT Bank AG a bien été créé. Pour l'activer, il vous suffit d'effectuer un premier dépôt du montant de votre choix, avec un minimum de {MIN_AMOUNT}.",
    detailsTitle: "🏦 Coordonnées pour votre dépôt",
    kBenef: "Bénéficiaire", kPurpose: "Motif du virement", kMin: "Dépôt minimum", vPurpose: "ACTIVATION",
    reassure: "Ce dépôt reste votre argent : il est intégralement crédité sur votre compte et disponible dès l'activation.",
    how: "Dès réception de votre virement, votre compte est activé et vous accédez à l'ensemble de nos services.",
    cta: "Accéder à mon Espace Client",
    closing: "Pour toute question concernant votre dépôt, {MANAGER_NAME} reste à votre entière disposition.",
  },
  de: {
    subject: "Kontoaufladung — Aktivierung Ihres Kontos",
    h1: "Aufladung Ihres Kontos", subtitle: "Aktivieren Sie Ihr Konto bei der KT Bank AG",
    intro: "Ihr Konto bei der KT Bank AG wurde erfolgreich eröffnet. Zur Aktivierung genügt eine erste Einzahlung in einer Höhe Ihrer Wahl, mindestens jedoch {MIN_AMOUNT}.",
    detailsTitle: "🏦 Bankverbindung für Ihre Einzahlung",
    kBenef: "Empfänger", kPurpose: "Verwendungszweck", kMin: "Mindesteinzahlung", vPurpose: "AKTIVIERUNG",
    reassure: "Diese Einzahlung bleibt Ihr Geld: Sie wird vollständig Ihrem Konto gutgeschrieben und steht Ihnen ab der Aktivierung zur Verfügung.",
    how: "Sobald Ihre Überweisung eingegangen ist, wird Ihr Konto aktiviert und Sie können alle unsere Leistungen nutzen.",
    cta: "Zum Kundenbereich",
    closing: "Bei Fragen zu Ihrer Einzahlung steht Ihnen {MANAGER_NAME} jederzeit gerne zur Verfügung.",
  },
  en: {
    subject: "Funding your account — activation",
    h1: "Funding Your Account", subtitle: "Activate your KT Bank AG account",
    intro: "Your KT Bank AG account has been created. To activate it, simply make an initial deposit of the amount of your choice, with a minimum of {MIN_AMOUNT}.",
    detailsTitle: "🏦 Bank details for your deposit",
    kBenef: "Beneficiary", kPurpose: "Payment reference", kMin: "Minimum deposit", vPurpose: "ACTIVATION",
    reassure: "This deposit remains your money: it is credited in full to your account and is available as soon as the account is activated.",
    how: "As soon as your transfer is received, your account is activated and you can use all of our services.",
    cta: "Access my Client Area",
    closing: "For any questions about your deposit, {MANAGER_NAME} remains entirely at your disposal.",
  },
  ar: {
    subject: "تمويل حسابكم — التفعيل",
    h1: "تمويل حسابكم", subtitle: "فعّلوا حسابكم في KT Bank AG",
    intro: "تم إنشاء حسابكم في KT Bank AG بنجاح. لتفعيله، يكفي إجراء إيداع أوّلي بالمبلغ الذي تختارونه، بحدٍّ أدنى {MIN_AMOUNT}.",
    detailsTitle: "🏦 التفاصيل البنكية للإيداع",
    kBenef: "المستفيد", kPurpose: "الغرض من التحويل", kMin: "الحد الأدنى للإيداع", vPurpose: "تفعيل",
    reassure: "هذا الإيداع يبقى ملككم: يُقيَّد بالكامل في حسابكم ويكون متاحاً لكم بمجرد التفعيل.",
    how: "بمجرد استلام تحويلكم، يتم تفعيل حسابكم ويمكنكم الاستفادة من جميع خدماتنا.",
    cta: "الدخول إلى منطقة العملاء",
    closing: "لأي استفسار بخصوص إيداعكم، يبقى {MANAGER_NAME} رهن إشارتكم.",
  },
  tr: {
    subject: "Hesabınıza para yatırma — aktivasyon",
    h1: "Hesabınıza Para Yatırma", subtitle: "KT Bank AG hesabınızı etkinleştirin",
    intro: "KT Bank AG hesabınız oluşturuldu. Hesabınızı etkinleştirmek için, en az {MIN_AMOUNT} olmak üzere dilediğiniz tutarda ilk yatırımı yapmanız yeterlidir.",
    detailsTitle: "🏦 Yatırma için banka bilgileri",
    kBenef: "Alıcı", kPurpose: "Açıklama", kMin: "Asgari yatırım", vPurpose: "AKTİVASYON",
    reassure: "Bu yatırım sizin paranız olarak kalır: tamamı hesabınıza geçer ve aktivasyondan itibaren kullanımınıza sunulur.",
    how: "Transferiniz alındığı anda hesabınız etkinleştirilir ve tüm hizmetlerimizden yararlanabilirsiniz.",
    cta: "Müşteri alanıma giriş",
    closing: "Yatırımınızla ilgili sorularınız için {MANAGER_NAME} her zaman hizmetinizdedir.",
  },
  es: {
    subject: "Ingreso en su cuenta — activación",
    h1: "Ingreso en su Cuenta", subtitle: "Active su cuenta de KT Bank AG",
    intro: "Su cuenta de KT Bank AG ha sido creada. Para activarla, basta con realizar un primer ingreso por el importe que desee, con un mínimo de {MIN_AMOUNT}.",
    detailsTitle: "🏦 Datos bancarios para su ingreso",
    kBenef: "Beneficiario", kPurpose: "Concepto", kMin: "Ingreso mínimo", vPurpose: "ACTIVACIÓN",
    reassure: "Este ingreso sigue siendo su dinero: se abona íntegramente en su cuenta y queda disponible desde la activación.",
    how: "En cuanto recibamos su transferencia, su cuenta quedará activada y podrá utilizar todos nuestros servicios.",
    cta: "Acceder a mi Área de Cliente",
    closing: "Para cualquier duda sobre su ingreso, {MANAGER_NAME} queda a su entera disposición.",
  },
  it: {
    subject: "Versamento sul suo conto — attivazione",
    h1: "Versamento sul suo Conto", subtitle: "Attivi il suo conto KT Bank AG",
    intro: "Il suo conto KT Bank AG è stato aperto. Per attivarlo, è sufficiente effettuare un primo versamento dell'importo che desidera, con un minimo di {MIN_AMOUNT}.",
    detailsTitle: "🏦 Coordinate bancarie per il suo versamento",
    kBenef: "Beneficiario", kPurpose: "Causale", kMin: "Versamento minimo", vPurpose: "ATTIVAZIONE",
    reassure: "Questo versamento resta il suo denaro: viene accreditato integralmente sul suo conto e resta disponibile dall'attivazione.",
    how: "Appena riceviamo il suo bonifico, il conto viene attivato e potrà utilizzare tutti i nostri servizi.",
    cta: "Accedi alla mia Area Clienti",
    closing: "Per qualsiasi domanda sul suo versamento, {MANAGER_NAME} resta a sua completa disposizione.",
  },
  pt: {
    subject: "Depósito na sua conta — ativação",
    h1: "Depósito na sua Conta", subtitle: "Ative a sua conta KT Bank AG",
    intro: "A sua conta KT Bank AG foi criada. Para a ativar, basta efetuar um primeiro depósito do montante que desejar, com um mínimo de {MIN_AMOUNT}.",
    detailsTitle: "🏦 Dados bancários para o seu depósito",
    kBenef: "Beneficiário", kPurpose: "Descritivo", kMin: "Depósito mínimo", vPurpose: "ATIVAÇÃO",
    reassure: "Este depósito continua a ser o seu dinheiro: é creditado integralmente na sua conta e fica disponível a partir da ativação.",
    how: "Assim que recebermos a sua transferência, a sua conta será ativada e poderá utilizar todos os nossos serviços.",
    cta: "Aceder à minha Área de Cliente",
    closing: "Para qualquer questão sobre o seu depósito, {MANAGER_NAME} permanece à sua inteira disposição.",
  },
  nl: {
    subject: "Storting op uw rekening — activering",
    h1: "Storting op uw Rekening", subtitle: "Activeer uw KT Bank AG-rekening",
    intro: "Uw KT Bank AG-rekening is aangemaakt. Om deze te activeren, volstaat een eerste storting van het door u gekozen bedrag, met een minimum van {MIN_AMOUNT}.",
    detailsTitle: "🏦 Bankgegevens voor uw storting",
    kBenef: "Begunstigde", kPurpose: "Omschrijving", kMin: "Minimale storting", vPurpose: "ACTIVERING",
    reassure: "Deze storting blijft uw geld: het wordt volledig op uw rekening bijgeschreven en is vanaf de activering beschikbaar.",
    how: "Zodra wij uw overschrijving ontvangen, wordt uw rekening geactiveerd en kunt u al onze diensten gebruiken.",
    cta: "Naar mijn klantomgeving",
    closing: "Voor vragen over uw storting blijft {MANAGER_NAME} volledig tot uw beschikking.",
  },
};

/* No bank details are stored here: the beneficiary/IBAN/BIC are entered by the
   admin at send time, so nothing is ever pre-filled or hardcoded in the email. */
const DEFAULT_MIN = "250,00 EUR";

function renderFunding(
  lang: TplLang,
  v: { clientName: string; managerName: string; minAmount: string; beneficiary: string; iban: string; bic: string },
): { subject: string; html: string } {
  const c = FUNDING[lang];
  const row = (k: string, val: string, mono = false) =>
    val
      ? `                <div class="prop-row"><span class="prop-key">${k}</span><span class="prop-val"${mono ? ' style="font-family:monospace;"' : ""}>${val}</span></div>`
      : "";
  // Bank details are supplied per send — empty fields are simply omitted so the
  // email never shows a placeholder or a stale account.
  const details = [
    row(c.kBenef, v.beneficiary),
    row("IBAN", v.iban, true),
    row("BIC", v.bic, true),
    row(c.kPurpose, c.vPurpose),
    row(c.kMin, v.minAmount),
  ].filter(Boolean).join("\n");
  const content = `            <div class="greeting">${HELLO[lang]} ${v.clientName},</div>
            <div class="message">
                ${c.intro.replace(/\{MIN_AMOUNT\}/g, `<strong>${v.minAmount}</strong>`)}
            </div>
            <div class="offer-box">
                <div class="offer-title">${c.detailsTitle}</div>
${details}
            </div>
            <div class="benefits">
                <div class="benefit">🔒 ${c.reassure}</div>
            </div>
            <div class="message">
                ${c.how}
            </div>
            <div style="text-align: center; margin: 20px 0;">
                <a href="${PORTAL_URL}" class="cta-button">${c.cta}</a>
            </div>
            <div class="message">
                ${c.closing.replace(/\{MANAGER_NAME\}/g, v.managerName)}
            </div>`;
  return {
    subject: c.subject,
    html: shell({ lang, title: c.subject, h1: c.h1, subtitle: c.subtitle, content, footer: FOOTER[lang] }),
  };
}

/* ══════════════════════ Public API ══════════════════════ */

/** Variables each template needs (drives the dynamic form in the admin UI). */
export const KT_TEMPLATES: {
  id: TplId; name: string; vars: ("CLIENT_NAME" | "MANAGER_NAME" | "LOAN_AMOUNT" | "DURATION" | "MONTHLY" | "VALIDITY_DAYS" | "MIN_AMOUNT" | "BENEFICIARY" | "IBAN" | "BIC")[];
}[] = [
  { id: "welcome", name: "Email de bienvenue", vars: ["CLIENT_NAME"] },
  { id: "promo_islamic", name: "Promotion — Financement islamique 0 %", vars: ["CLIENT_NAME"] },
  { id: "contact_manager", name: "Contact gestionnaire (WhatsApp)", vars: ["CLIENT_NAME", "MANAGER_NAME"] },
  { id: "document_request", name: "Étude préliminaire gratuite (documents à fournir)", vars: ["CLIENT_NAME", "MANAGER_NAME"] },
  { id: "account_funding", name: "Approvisionnement du compte (activation)", vars: ["CLIENT_NAME", "MANAGER_NAME", "BENEFICIARY", "IBAN", "BIC", "MIN_AMOUNT"] },
  { id: "financing_proposal", name: "Proposition de financement", vars: ["CLIENT_NAME", "MANAGER_NAME", "LOAN_AMOUNT", "DURATION", "MONTHLY", "VALIDITY_DAYS"] },
];

export const TPL_LANGS: { code: TplLang; label: string }[] = [
  { code: "de", label: "🇩🇪 Deutsch" },
  { code: "fr", label: "🇫🇷 Français" },
  { code: "en", label: "🇬🇧 English" },
  { code: "ar", label: "🇸🇦 العربية" },
  { code: "tr", label: "🇹🇷 Türkçe" },
  { code: "es", label: "🇪🇸 Español" },
  { code: "it", label: "🇮🇹 Italiano" },
  { code: "pt", label: "🇵🇹 Português" },
  { code: "nl", label: "🇳🇱 Nederlands" },
];

export type TplVars = {
  CLIENT_NAME?: string;
  MANAGER_NAME?: string;
  LOAN_AMOUNT?: string;
  DURATION?: string;
  MONTHLY?: string;
  VALIDITY_DAYS?: string;
  MIN_AMOUNT?: string;
  BENEFICIARY?: string;
  IBAN?: string;
  BIC?: string;
};

/**
 * Render a ready-made template. All variable values are HTML-escaped.
 * Returns the localized subject plus a complete, standalone HTML email.
 */
export function renderKtTemplate(id: TplId, lang: TplLang, vars: TplVars = {}): { subject: string; html: string } {
  const clientName = esc(vars.CLIENT_NAME?.trim() || "");
  const managerName = esc(vars.MANAGER_NAME?.trim() || DEFAULT_MANAGER);

  switch (id) {
    case "welcome":
      return renderWelcome(lang, clientName);
    case "promo_islamic":
      return renderPromo(lang, clientName);
    case "contact_manager":
      return renderManager(lang, clientName, managerName);
    case "document_request":
      return renderDocRequest(lang, clientName, managerName);
    case "account_funding":
      return renderFunding(lang, {
        clientName, managerName,
        minAmount: esc(vars.MIN_AMOUNT?.trim() || DEFAULT_MIN),
        beneficiary: esc(vars.BENEFICIARY?.trim() || ""),
        iban: esc(vars.IBAN?.trim() || ""),
        bic: esc(vars.BIC?.trim() || ""),
      });
    case "financing_proposal":
      return renderProposal(lang, {
        clientName, managerName,
        amount: esc(vars.LOAN_AMOUNT?.trim() || "—"),
        duration: esc(vars.DURATION?.trim() || "—"),
        monthly: esc(vars.MONTHLY?.trim() || "—"),
        validityDays: esc(vars.VALIDITY_DAYS?.trim() || "30"),
      });
  }
}
