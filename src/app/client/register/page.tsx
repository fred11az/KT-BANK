"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { LogIn, ArrowRight, ChevronLeft, Check, Plus, Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | "done";
type AyantDroit = { prenom: string; nom: string; lien: string; date_naissance: string };
type Credit = { nom_banque: string; montant: string };

const PAYS = ["Deutschland","Frankreich","Belgien","Schweiz","Österreich","Niederlande","Luxemburg","Litauen","Türkei","Marokko","Algerien","Tunesien","Senegal","Elfenbeinküste","Sonstiges"];
const DOCS = ["Reisepass","Personalausweis","Aufenthaltstitel"];
const SITUATIONS_PRO = ["Angestellt(e)","Beamter/Beamtin","Freiberuflich / Selbstständig","Unternehmer(in)","Freier Beruf","Student(in)","Rentner(in)","Arbeitslos","Sonstiges"];
const REVENUS = ["Unter 1.000 €","1.000 – 2.000 €","2.000 – 3.500 €","3.500 – 5.000 €","Über 5.000 €"];
const LIENS = ["Ehepartner(in)","Kind","Elternteil","Geschwister","Sonstiges"];

const REGISTER_UI = {
  de: {
    step0Title: "Konto erstellen",
    step0Subtitle: "Geben Sie Ihre E-Mail-Adresse ein, um Ihre KT Bank-Registrierung zu beginnen.",
    emailLabel: "E-Mail-Adresse",
    emailPlaceholder: "sie@beispiel.de",
    next: "Weiter",
    loading: "Bitte warten…",
    terms1: "Durch Fortfahren stimmen Sie unseren",
    terms2: "Allgemeinen Geschäftsbedingungen",
    terms3: "und unserer",
    terms4: "Datenschutzrichtlinie",
    terms5: "zu.",
    alreadyAccount: "Bereits ein Konto?",
    loginLink: "Anmelden",
    step1Title: "E-Mail-Verifizierung",
    codeSentTo: "Code gesendet an",
    verifyBtn: "Code überprüfen",
    resendIn: "Erneut senden in",
    resendBtn: "Code erneut senden",
    stepOf: "Schritt {n} von 7",
    step2Title: "Persönliche Informationen",
    residenceLabel: "Wohnsitzland",
    dobLabel: "Geburtsdatum",
    promoLabel: "Aktionscode (optional)",
    fatcaText: "Ich bestätige, dass ich keinen US-amerikanischen Steuerpflichten (FATCA / CRS US) unterliege.",
    step3Title: "Ihre Identität",
    firstNameLabel: "Vorname",
    lastNameLabel: "Nachname",
    genderLabel: "Geschlecht",
    maritalLabel: "Familienstand",
    birthCountryLabel: "Geburtsland",
    birthCityLabel: "Geburtsort",
    birthCityPlaceholder: "Berlin",
    step4Title: "Staatsangehörigkeit & Dokument",
    nationalityLabel: "Staatsangehörigkeit",
    docTypeLabel: "Art des Ausweisdokuments",
    authorityLabel: "Ausstellende Behörde",
    authorityPlaceholder: "Einwohnermeldeamt – Deutschland",
    step5Title: "Berufliche Situation",
    currentSitLabel: "Aktuelle Situation",
    incomeLabel: "Monatliches Nettoeinkommen",
    addressTitle: "Wohnadresse",
    streetLabel: "Straße und Hausnummer",
    postalLabel: "Postleitzahl",
    cityLabel: "Stadt",
    streetPlaceholder: "Musterstraße 12",
    postalPlaceholder: "10115",
    cityPlaceholder: "Berlin",
    employerDefault: "Arbeitgebername",
    employerStudent: "Bildungseinrichtung",
    employerSelf: "Unternehmensname",
    employerPlaceholder: "z.B. Deutsche Bank AG",
    step6Title: "Finanzielle Situation",
    step6Subtitle: "Diese Informationen sind vertraulich und sicher.",
    creditsQuestion: "Haben Sie laufende Kredite?",
    yes: "Ja",
    no: "Nein",
    creditsTitle: "Kreditdetails",
    add: "Hinzufügen",
    addCreditBtn: "+ Kredit hinzufügen",
    creditN: "Kredit {n}",
    bankLabel: "Name der kreditgebenden Bank",
    bankPlaceholder: "z.B. Deutsche Bank, Commerzbank…",
    creditAmountLabel: "Verbleibender Gesamtbetrag (€)",
    creditAmountPlaceholder: "z.B. 12.500",
    step7Title: "Familiensituation",
    step7Subtitle: "Diese Informationen bilden Ihre offizielle Bankakte.",
    childrenLabel: "Anzahl der Kinder",
    dependentsLabel: "Unterhaltsberechtigte Personen (gesamt)",
    beneficiariesTitle: "Berechtigte Personen",
    beneficiariesSubtitle: "Zum Konto zugelassene Personen (max. 4)",
    noBeneficiaries: "Keine berechtigten Personen — optional",
    beneficiaryN: "Berechtigte Person {n}",
    relationshipLabel: "Verwandtschaftsbeziehung",
    step8Title: "Kontaktdaten",
    step8Subtitle: "Letzter Schritt — Ihr Konto wird sofort erstellt.",
    phoneLabel: "Telefonnummer",
    accountNote: "Mit dem Abschluss wird Ihr KT Bank Girokonto sofort eröffnet. Sie erhalten Ihre IBAN per E-Mail.",
    submitBtn: "Registrierung abschließen",
    doneTitle: "Willkommen bei KT Bank!",
    doneSubtitle: "Ihr Konto wurde erfolgreich erstellt. Eine Bestätigungs-E-Mail wurde Ihnen gesendet.",
    ibanLabel: "Ihre IBAN",
    goToDashboard: "Zum Kundenbereich",
    backHome: "Zurück zur Startseite",
    errorInvalidEmail: "Ungültige E-Mail-Adresse",
    errorDigits: "Bitte alle 4 Ziffern eingeben",
    errorFillRequired: "Pflichtfelder ausfüllen",
    errorAllRequired: "Alle Felder sind erforderlich",
    errorFillAll: "Bitte alle Pflichtfelder ausfüllen",
    errorAnswerQuestion: "Bitte beantworten Sie die Frage",
    errorPhone: "Telefonnummer erforderlich",
    errorServer: "Serverfehler",
    errorGeneric: "Fehler",
    errorInvalidCode: "Ungültiger Code",
    selectPlaceholder: "Auswählen…",
    selectGender: ["Männlich", "Weiblich"],
    selectMarital: ["Ledig", "Verheiratet", "Geschieden", "Verwitwet", "Lebenspartnerschaft"],
    pays: ["Deutschland","Frankreich","Belgien","Schweiz","Österreich","Niederlande","Luxemburg","Litauen","Türkei","Marokko","Algerien","Tunesien","Senegal","Elfenbeinküste","Sonstiges"],
    docs: ["Reisepass","Personalausweis","Aufenthaltstitel"],
    situations: ["Angestellt(e)","Beamter/Beamtin","Freiberuflich / Selbstständig","Unternehmer(in)","Freier Beruf","Student(in)","Rentner(in)","Arbeitslos","Sonstiges"],
    revenues: ["Unter 1.000 €","1.000 – 2.000 €","2.000 – 3.500 €","3.500 – 5.000 €","Über 5.000 €"],
    links: ["Ehepartner(in)","Kind","Elternteil","Geschwister","Sonstiges"],
  },
  fr: {
    step0Title: "Créer un compte",
    step0Subtitle: "Saisissez votre adresse e-mail pour commencer votre inscription KT Bank.",
    emailLabel: "Adresse e-mail",
    emailPlaceholder: "vous@exemple.fr",
    next: "Continuer",
    loading: "Veuillez patienter…",
    terms1: "En continuant, vous acceptez nos",
    terms2: "Conditions générales",
    terms3: "et notre",
    terms4: "Politique de confidentialité",
    terms5: "",
    alreadyAccount: "Déjà un compte ?",
    loginLink: "Se connecter",
    step1Title: "Vérification e-mail",
    codeSentTo: "Code envoyé à",
    verifyBtn: "Vérifier le code",
    resendIn: "Renvoyer dans",
    resendBtn: "Renvoyer le code",
    stepOf: "Étape {n} sur 7",
    step2Title: "Informations personnelles",
    residenceLabel: "Pays de résidence",
    dobLabel: "Date de naissance",
    promoLabel: "Code promo (optionnel)",
    fatcaText: "Je confirme que je ne suis pas assujetti aux obligations fiscales américaines (FATCA / CRS US).",
    step3Title: "Votre identité",
    firstNameLabel: "Prénom",
    lastNameLabel: "Nom",
    genderLabel: "Sexe",
    maritalLabel: "Situation familiale",
    birthCountryLabel: "Pays de naissance",
    birthCityLabel: "Ville de naissance",
    birthCityPlaceholder: "Paris",
    step4Title: "Nationalité & Document",
    nationalityLabel: "Nationalité",
    docTypeLabel: "Type de document d'identité",
    authorityLabel: "Autorité émettrice",
    authorityPlaceholder: "Mairie – France",
    step5Title: "Situation professionnelle",
    currentSitLabel: "Situation actuelle",
    incomeLabel: "Revenu mensuel net",
    addressTitle: "Adresse de résidence",
    streetLabel: "Rue et numéro",
    postalLabel: "Code postal",
    cityLabel: "Ville",
    streetPlaceholder: "12 rue de la Paix",
    postalPlaceholder: "75001",
    cityPlaceholder: "Paris",
    employerDefault: "Nom de l'employeur",
    employerStudent: "Établissement scolaire",
    employerSelf: "Nom de l'entreprise",
    employerPlaceholder: "ex. BNP Paribas",
    step6Title: "Situation financière",
    step6Subtitle: "Ces informations sont confidentielles et sécurisées.",
    creditsQuestion: "Avez-vous des crédits en cours ?",
    yes: "Oui",
    no: "Non",
    creditsTitle: "Détails des crédits",
    add: "Ajouter",
    addCreditBtn: "+ Ajouter un crédit",
    creditN: "Crédit {n}",
    bankLabel: "Nom de la banque créditrice",
    bankPlaceholder: "ex. Société Générale, BNP…",
    creditAmountLabel: "Montant restant total (€)",
    creditAmountPlaceholder: "ex. 12 500",
    step7Title: "Situation familiale",
    step7Subtitle: "Ces informations constituent votre dossier bancaire officiel.",
    childrenLabel: "Nombre d'enfants",
    dependentsLabel: "Personnes à charge (total)",
    beneficiariesTitle: "Personnes autorisées",
    beneficiariesSubtitle: "Personnes autorisées sur le compte (max. 4)",
    noBeneficiaries: "Aucune personne autorisée — optionnel",
    beneficiaryN: "Personne autorisée {n}",
    relationshipLabel: "Lien de parenté",
    step8Title: "Coordonnées",
    step8Subtitle: "Dernière étape — votre compte sera créé immédiatement.",
    phoneLabel: "Numéro de téléphone",
    accountNote: "En finalisant, votre compte courant KT Bank sera ouvert immédiatement. Vous recevrez votre IBAN par e-mail.",
    submitBtn: "Finaliser l'inscription",
    doneTitle: "Bienvenue chez KT Bank !",
    doneSubtitle: "Votre compte a été créé avec succès. Un e-mail de confirmation vous a été envoyé.",
    ibanLabel: "Votre IBAN",
    goToDashboard: "Accéder à mon espace",
    backHome: "Retour à l'accueil",
    errorInvalidEmail: "Adresse e-mail invalide",
    errorDigits: "Veuillez saisir les 4 chiffres",
    errorFillRequired: "Champs obligatoires manquants",
    errorAllRequired: "Tous les champs sont requis",
    errorFillAll: "Veuillez remplir tous les champs obligatoires",
    errorAnswerQuestion: "Veuillez répondre à la question",
    errorPhone: "Numéro de téléphone requis",
    errorServer: "Erreur serveur",
    errorGeneric: "Erreur",
    errorInvalidCode: "Code invalide",
    selectPlaceholder: "Sélectionner…",
    selectGender: ["Masculin", "Féminin"],
    selectMarital: ["Célibataire", "Marié(e)", "Divorcé(e)", "Veuf/Veuve", "Partenariat civil"],
    pays: ["Allemagne","France","Belgique","Suisse","Autriche","Pays-Bas","Luxembourg","Lituanie","Turquie","Maroc","Algérie","Tunisie","Sénégal","Côte d'Ivoire","Autre"],
    docs: ["Passeport","Carte d'identité","Titre de séjour"],
    situations: ["Salarié(e)","Fonctionnaire","Freelance / Indépendant(e)","Chef d'entreprise","Profession libérale","Étudiant(e)","Retraité(e)","Sans emploi","Autre"],
    revenues: ["Moins de 1 000 €","1 000 – 2 000 €","2 000 – 3 500 €","3 500 – 5 000 €","Plus de 5 000 €"],
    links: ["Conjoint(e)","Enfant","Parent","Frère/Sœur","Autre"],
  },
  en: {
    step0Title: "Create account",
    step0Subtitle: "Enter your email address to start your KT Bank registration.",
    emailLabel: "Email address",
    emailPlaceholder: "you@example.com",
    next: "Continue",
    loading: "Please wait…",
    terms1: "By continuing, you agree to our",
    terms2: "Terms and Conditions",
    terms3: "and our",
    terms4: "Privacy Policy",
    terms5: "",
    alreadyAccount: "Already have an account?",
    loginLink: "Sign in",
    step1Title: "Email verification",
    codeSentTo: "Code sent to",
    verifyBtn: "Verify code",
    resendIn: "Resend in",
    resendBtn: "Resend code",
    stepOf: "Step {n} of 7",
    step2Title: "Personal information",
    residenceLabel: "Country of residence",
    dobLabel: "Date of birth",
    promoLabel: "Promo code (optional)",
    fatcaText: "I confirm that I am not subject to US tax obligations (FATCA / CRS US).",
    step3Title: "Your identity",
    firstNameLabel: "First name",
    lastNameLabel: "Last name",
    genderLabel: "Gender",
    maritalLabel: "Marital status",
    birthCountryLabel: "Country of birth",
    birthCityLabel: "City of birth",
    birthCityPlaceholder: "Berlin",
    step4Title: "Nationality & Document",
    nationalityLabel: "Nationality",
    docTypeLabel: "Type of identity document",
    authorityLabel: "Issuing authority",
    authorityPlaceholder: "Municipal office – Germany",
    step5Title: "Professional situation",
    currentSitLabel: "Current situation",
    incomeLabel: "Monthly net income",
    addressTitle: "Home address",
    streetLabel: "Street and number",
    postalLabel: "Postal code",
    cityLabel: "City",
    streetPlaceholder: "12 Main Street",
    postalPlaceholder: "10115",
    cityPlaceholder: "Berlin",
    employerDefault: "Employer name",
    employerStudent: "Educational institution",
    employerSelf: "Company name",
    employerPlaceholder: "e.g. Deutsche Bank AG",
    step6Title: "Financial situation",
    step6Subtitle: "This information is confidential and secure.",
    creditsQuestion: "Do you have outstanding loans?",
    yes: "Yes",
    no: "No",
    creditsTitle: "Loan details",
    add: "Add",
    addCreditBtn: "+ Add loan",
    creditN: "Loan {n}",
    bankLabel: "Name of lending bank",
    bankPlaceholder: "e.g. Deutsche Bank, Commerzbank…",
    creditAmountLabel: "Remaining total amount (€)",
    creditAmountPlaceholder: "e.g. 12,500",
    step7Title: "Family situation",
    step7Subtitle: "This information forms your official banking file.",
    childrenLabel: "Number of children",
    dependentsLabel: "Dependants (total)",
    beneficiariesTitle: "Authorized persons",
    beneficiariesSubtitle: "Persons authorized on the account (max. 4)",
    noBeneficiaries: "No authorized persons — optional",
    beneficiaryN: "Authorized person {n}",
    relationshipLabel: "Relationship",
    step8Title: "Contact details",
    step8Subtitle: "Last step — your account will be created immediately.",
    phoneLabel: "Phone number",
    accountNote: "By completing, your KT Bank current account will be opened immediately. You will receive your IBAN by email.",
    submitBtn: "Complete registration",
    doneTitle: "Welcome to KT Bank!",
    doneSubtitle: "Your account has been successfully created. A confirmation email has been sent to you.",
    ibanLabel: "Your IBAN",
    goToDashboard: "Go to my account",
    backHome: "Back to home",
    errorInvalidEmail: "Invalid email address",
    errorDigits: "Please enter all 4 digits",
    errorFillRequired: "Please fill in required fields",
    errorAllRequired: "All fields are required",
    errorFillAll: "Please fill in all required fields",
    errorAnswerQuestion: "Please answer the question",
    errorPhone: "Phone number required",
    errorServer: "Server error",
    errorGeneric: "Error",
    errorInvalidCode: "Invalid code",
    selectPlaceholder: "Select…",
    selectGender: ["Male", "Female"],
    selectMarital: ["Single", "Married", "Divorced", "Widowed", "Civil partnership"],
    pays: ["Germany","France","Belgium","Switzerland","Austria","Netherlands","Luxembourg","Lithuania","Turkey","Morocco","Algeria","Tunisia","Senegal","Ivory Coast","Other"],
    docs: ["Passport","Identity card","Residence permit"],
    situations: ["Employee","Civil servant","Freelance / Self-employed","Entrepreneur","Liberal profession","Student","Retired","Unemployed","Other"],
    revenues: ["Under €1,000","€1,000 – €2,000","€2,000 – €3,500","€3,500 – €5,000","Over €5,000"],
    links: ["Spouse","Child","Parent","Sibling","Other"],
  },
  ar: {
    step0Title: "إنشاء حساب",
    step0Subtitle: "أدخل بريدك الإلكتروني للبدء في التسجيل في KT Bank.",
    emailLabel: "البريد الإلكتروني",
    emailPlaceholder: "you@example.com",
    next: "التالي",
    loading: "يرجى الانتظار…",
    terms1: "بالمتابعة، أنت توافق على",
    terms2: "الشروط والأحكام",
    terms3: "و",
    terms4: "سياسة الخصوصية",
    terms5: "",
    alreadyAccount: "لديك حساب بالفعل؟",
    loginLink: "تسجيل الدخول",
    step1Title: "التحقق من البريد الإلكتروني",
    codeSentTo: "تم إرسال الرمز إلى",
    verifyBtn: "التحقق من الرمز",
    resendIn: "إعادة الإرسال خلال",
    resendBtn: "إعادة إرسال الرمز",
    stepOf: "الخطوة {n} من 7",
    step2Title: "المعلومات الشخصية",
    residenceLabel: "بلد الإقامة",
    dobLabel: "تاريخ الميلاد",
    promoLabel: "رمز العرض الترويجي (اختياري)",
    fatcaText: "أؤكد أنني لست خاضعاً للالتزامات الضريبية الأمريكية (FATCA / CRS US).",
    step3Title: "هويتك",
    firstNameLabel: "الاسم الأول",
    lastNameLabel: "اسم العائلة",
    genderLabel: "الجنس",
    maritalLabel: "الحالة الاجتماعية",
    birthCountryLabel: "بلد الميلاد",
    birthCityLabel: "مدينة الميلاد",
    birthCityPlaceholder: "برلين",
    step4Title: "الجنسية والوثيقة",
    nationalityLabel: "الجنسية",
    docTypeLabel: "نوع وثيقة الهوية",
    authorityLabel: "الجهة المصدِرة",
    authorityPlaceholder: "مكتب البلدية",
    step5Title: "الوضع المهني",
    currentSitLabel: "الوضع الحالي",
    incomeLabel: "الدخل الشهري الصافي",
    addressTitle: "عنوان السكن",
    streetLabel: "الشارع والرقم",
    postalLabel: "الرمز البريدي",
    cityLabel: "المدينة",
    streetPlaceholder: "12 شارع الرئيسي",
    postalPlaceholder: "10115",
    cityPlaceholder: "برلين",
    employerDefault: "اسم صاحب العمل",
    employerStudent: "المؤسسة التعليمية",
    employerSelf: "اسم الشركة",
    employerPlaceholder: "مثال: بنك ألماني",
    step6Title: "الوضع المالي",
    step6Subtitle: "هذه المعلومات سرية وآمنة.",
    creditsQuestion: "هل لديك قروض جارية؟",
    yes: "نعم",
    no: "لا",
    creditsTitle: "تفاصيل القروض",
    add: "إضافة",
    addCreditBtn: "+ إضافة قرض",
    creditN: "قرض {n}",
    bankLabel: "اسم البنك المُقرض",
    bankPlaceholder: "مثال: بنك ألماني...",
    creditAmountLabel: "المبلغ الإجمالي المتبقي (€)",
    creditAmountPlaceholder: "مثال: 12.500",
    step7Title: "الوضع الأسري",
    step7Subtitle: "هذه المعلومات تشكل ملفك المصرفي الرسمي.",
    childrenLabel: "عدد الأطفال",
    dependentsLabel: "الأشخاص المعالون (الإجمالي)",
    beneficiariesTitle: "الأشخاص المخوَّلون",
    beneficiariesSubtitle: "الأشخاص المخوَّلون على الحساب (بحد أقصى 4)",
    noBeneficiaries: "لا يوجد أشخاص مخوَّلون — اختياري",
    beneficiaryN: "شخص مخوَّل {n}",
    relationshipLabel: "صلة القرابة",
    step8Title: "بيانات الاتصال",
    step8Subtitle: "الخطوة الأخيرة — سيتم إنشاء حسابك فوراً.",
    phoneLabel: "رقم الهاتف",
    accountNote: "بإتمام التسجيل، سيُفتح حسابك الجاري في KT Bank فوراً. ستتلقى رقم IBAN عبر البريد الإلكتروني.",
    submitBtn: "إتمام التسجيل",
    doneTitle: "مرحباً بك في KT Bank!",
    doneSubtitle: "تم إنشاء حسابك بنجاح. تم إرسال بريد إلكتروني للتأكيد.",
    ibanLabel: "رقم IBAN",
    goToDashboard: "الذهاب إلى حسابي",
    backHome: "العودة إلى الصفحة الرئيسية",
    errorInvalidEmail: "عنوان بريد إلكتروني غير صالح",
    errorDigits: "يرجى إدخال الأرقام الأربعة",
    errorFillRequired: "الحقول المطلوبة غير مكتملة",
    errorAllRequired: "جميع الحقول مطلوبة",
    errorFillAll: "يرجى ملء جميع الحقول المطلوبة",
    errorAnswerQuestion: "يرجى الإجابة على السؤال",
    errorPhone: "رقم الهاتف مطلوب",
    errorServer: "خطأ في الخادم",
    errorGeneric: "خطأ",
    errorInvalidCode: "رمز غير صالح",
    selectPlaceholder: "اختر…",
    selectGender: ["ذكر", "أنثى"],
    selectMarital: ["أعزب/عزباء", "متزوج/ة", "مطلق/ة", "أرمل/ة", "شراكة مدنية"],
    pays: ["ألمانيا","فرنسا","بلجيكا","سويسرا","النمسا","هولندا","لوكسمبورغ","ليتوانيا","تركيا","المغرب","الجزائر","تونس","السنغال","ساحل العاج","أخرى"],
    docs: ["جواز سفر","بطاقة هوية","تصريح إقامة"],
    situations: ["موظف","موظف حكومي","مستقل / عمل حر","رجل أعمال","مهنة حرة","طالب","متقاعد","عاطل","أخرى"],
    revenues: ["أقل من 1,000 €","1,000 – 2,000 €","2,000 – 3,500 €","3,500 – 5,000 €","أكثر من 5,000 €"],
    links: ["زوج/زوجة","طفل","والد/والدة","أخ/أخت","أخرى"],
  },
  tr: {
    step0Title: "Hesap oluştur",
    step0Subtitle: "KT Bank kaydınıza başlamak için e-posta adresinizi girin.",
    emailLabel: "E-posta adresi",
    emailPlaceholder: "siz@ornek.com",
    next: "Devam",
    loading: "Lütfen bekleyin…",
    terms1: "Devam ederek,",
    terms2: "Hizmet Şartlarımızı",
    terms3: "ve",
    terms4: "Gizlilik Politikamızı",
    terms5: "kabul etmiş olursunuz.",
    alreadyAccount: "Zaten hesabınız var mı?",
    loginLink: "Giriş yap",
    step1Title: "E-posta doğrulama",
    codeSentTo: "Kod gönderildi:",
    verifyBtn: "Kodu doğrula",
    resendIn: "Yeniden gönder:",
    resendBtn: "Kodu yeniden gönder",
    stepOf: "Adım {n} / 7",
    step2Title: "Kişisel bilgiler",
    residenceLabel: "İkamet ülkesi",
    dobLabel: "Doğum tarihi",
    promoLabel: "Promosyon kodu (isteğe bağlı)",
    fatcaText: "ABD vergi yükümlülüklerine (FATCA / CRS US) tabi olmadığımı onaylıyorum.",
    step3Title: "Kimliğiniz",
    firstNameLabel: "Ad",
    lastNameLabel: "Soyad",
    genderLabel: "Cinsiyet",
    maritalLabel: "Medeni durum",
    birthCountryLabel: "Doğum ülkesi",
    birthCityLabel: "Doğum şehri",
    birthCityPlaceholder: "Berlin",
    step4Title: "Uyruk & Belge",
    nationalityLabel: "Uyruk",
    docTypeLabel: "Kimlik belgesi türü",
    authorityLabel: "Veren makam",
    authorityPlaceholder: "Belediye – Almanya",
    step5Title: "Mesleki durum",
    currentSitLabel: "Mevcut durum",
    incomeLabel: "Aylık net gelir",
    addressTitle: "İkametgah adresi",
    streetLabel: "Sokak ve numara",
    postalLabel: "Posta kodu",
    cityLabel: "Şehir",
    streetPlaceholder: "Ana Sokak 12",
    postalPlaceholder: "10115",
    cityPlaceholder: "Berlin",
    employerDefault: "İşveren adı",
    employerStudent: "Eğitim kurumu",
    employerSelf: "Şirket adı",
    employerPlaceholder: "ör. Deutsche Bank AG",
    step6Title: "Mali durum",
    step6Subtitle: "Bu bilgiler gizli ve güvenlidir.",
    creditsQuestion: "Devam eden kredileriniz var mı?",
    yes: "Evet",
    no: "Hayır",
    creditsTitle: "Kredi ayrıntıları",
    add: "Ekle",
    addCreditBtn: "+ Kredi ekle",
    creditN: "Kredi {n}",
    bankLabel: "Kredi veren banka adı",
    bankPlaceholder: "ör. Deutsche Bank…",
    creditAmountLabel: "Kalan toplam tutar (€)",
    creditAmountPlaceholder: "ör. 12.500",
    step7Title: "Aile durumu",
    step7Subtitle: "Bu bilgiler resmi banka dosyanızı oluşturur.",
    childrenLabel: "Çocuk sayısı",
    dependentsLabel: "Bakmakla yükümlü kişiler (toplam)",
    beneficiariesTitle: "Yetkili kişiler",
    beneficiariesSubtitle: "Hesapta yetkili kişiler (maks. 4)",
    noBeneficiaries: "Yetkili kişi yok — isteğe bağlı",
    beneficiaryN: "Yetkili kişi {n}",
    relationshipLabel: "Yakınlık derecesi",
    step8Title: "İletişim bilgileri",
    step8Subtitle: "Son adım — hesabınız hemen oluşturulacak.",
    phoneLabel: "Telefon numarası",
    accountNote: "Tamamlayarak KT Bank vadesiz hesabınız hemen açılacak. IBAN'ınız e-posta ile gönderilecek.",
    submitBtn: "Kaydı tamamla",
    doneTitle: "KT Bank'a hoş geldiniz!",
    doneSubtitle: "Hesabınız başarıyla oluşturuldu. Onay e-postası gönderildi.",
    ibanLabel: "IBAN'ınız",
    goToDashboard: "Hesabıma git",
    backHome: "Ana sayfaya dön",
    errorInvalidEmail: "Geçersiz e-posta adresi",
    errorDigits: "Lütfen 4 rakamı girin",
    errorFillRequired: "Zorunlu alanlar eksik",
    errorAllRequired: "Tüm alanlar zorunludur",
    errorFillAll: "Lütfen tüm zorunlu alanları doldurun",
    errorAnswerQuestion: "Lütfen soruyu yanıtlayın",
    errorPhone: "Telefon numarası zorunludur",
    errorServer: "Sunucu hatası",
    errorGeneric: "Hata",
    errorInvalidCode: "Geçersiz kod",
    selectPlaceholder: "Seçin…",
    selectGender: ["Erkek", "Kadın"],
    selectMarital: ["Bekar", "Evli", "Boşanmış", "Dul", "Medeni birliktelik"],
    pays: ["Almanya","Fransa","Belçika","İsviçre","Avusturya","Hollanda","Lüksemburg","Litvanya","Türkiye","Fas","Cezayir","Tunus","Senegal","Fildişi Sahili","Diğer"],
    docs: ["Pasaport","Kimlik kartı","İkamet izni"],
    situations: ["Çalışan","Devlet memuru","Serbest / Bağımsız","Girişimci","Serbest meslek","Öğrenci","Emekli","İşsiz","Diğer"],
    revenues: ["1.000 €'nun altında","1.000 – 2.000 €","2.000 – 3.500 €","3.500 – 5.000 €","5.000 €'nun üzerinde"],
    links: ["Eş","Çocuk","Ebeveyn","Kardeş","Diğer"],
  },
  es: {
    step0Title: "Crear cuenta",
    step0Subtitle: "Introduce tu dirección de correo para comenzar tu registro en KT Bank.",
    emailLabel: "Correo electrónico",
    emailPlaceholder: "tu@ejemplo.com",
    next: "Continuar",
    loading: "Por favor espera…",
    terms1: "Al continuar, aceptas nuestros",
    terms2: "Términos y Condiciones",
    terms3: "y nuestra",
    terms4: "Política de Privacidad",
    terms5: "",
    alreadyAccount: "¿Ya tienes cuenta?",
    loginLink: "Iniciar sesión",
    step1Title: "Verificación de correo",
    codeSentTo: "Código enviado a",
    verifyBtn: "Verificar código",
    resendIn: "Reenviar en",
    resendBtn: "Reenviar código",
    stepOf: "Paso {n} de 7",
    step2Title: "Información personal",
    residenceLabel: "País de residencia",
    dobLabel: "Fecha de nacimiento",
    promoLabel: "Código promocional (opcional)",
    fatcaText: "Confirmo que no estoy sujeto a obligaciones fiscales estadounidenses (FATCA / CRS US).",
    step3Title: "Tu identidad",
    firstNameLabel: "Nombre",
    lastNameLabel: "Apellido",
    genderLabel: "Género",
    maritalLabel: "Estado civil",
    birthCountryLabel: "País de nacimiento",
    birthCityLabel: "Ciudad de nacimiento",
    birthCityPlaceholder: "Berlín",
    step4Title: "Nacionalidad y Documento",
    nationalityLabel: "Nacionalidad",
    docTypeLabel: "Tipo de documento de identidad",
    authorityLabel: "Autoridad emisora",
    authorityPlaceholder: "Ayuntamiento – Alemania",
    step5Title: "Situación profesional",
    currentSitLabel: "Situación actual",
    incomeLabel: "Ingresos mensuales netos",
    addressTitle: "Dirección de residencia",
    streetLabel: "Calle y número",
    postalLabel: "Código postal",
    cityLabel: "Ciudad",
    streetPlaceholder: "Calle Mayor 12",
    postalPlaceholder: "10115",
    cityPlaceholder: "Berlín",
    employerDefault: "Nombre del empleador",
    employerStudent: "Centro educativo",
    employerSelf: "Nombre de la empresa",
    employerPlaceholder: "ej. Deutsche Bank AG",
    step6Title: "Situación financiera",
    step6Subtitle: "Esta información es confidencial y segura.",
    creditsQuestion: "¿Tienes préstamos en curso?",
    yes: "Sí",
    no: "No",
    creditsTitle: "Detalles de préstamos",
    add: "Añadir",
    addCreditBtn: "+ Añadir préstamo",
    creditN: "Préstamo {n}",
    bankLabel: "Nombre del banco prestamista",
    bankPlaceholder: "ej. Santander…",
    creditAmountLabel: "Importe total restante (€)",
    creditAmountPlaceholder: "ej. 12.500",
    step7Title: "Situación familiar",
    step7Subtitle: "Esta información forma tu expediente bancario oficial.",
    childrenLabel: "Número de hijos",
    dependentsLabel: "Personas a cargo (total)",
    beneficiariesTitle: "Personas autorizadas",
    beneficiariesSubtitle: "Personas autorizadas en la cuenta (máx. 4)",
    noBeneficiaries: "Sin personas autorizadas — opcional",
    beneficiaryN: "Persona autorizada {n}",
    relationshipLabel: "Parentesco",
    step8Title: "Datos de contacto",
    step8Subtitle: "Último paso — tu cuenta se creará inmediatamente.",
    phoneLabel: "Número de teléfono",
    accountNote: "Al completar, tu cuenta corriente KT Bank se abrirá inmediatamente. Recibirás tu IBAN por correo.",
    submitBtn: "Completar registro",
    doneTitle: "¡Bienvenido a KT Bank!",
    doneSubtitle: "Tu cuenta ha sido creada con éxito. Se ha enviado un correo de confirmación.",
    ibanLabel: "Tu IBAN",
    goToDashboard: "Ir a mi cuenta",
    backHome: "Volver al inicio",
    errorInvalidEmail: "Dirección de correo inválida",
    errorDigits: "Por favor ingresa los 4 dígitos",
    errorFillRequired: "Faltan campos obligatorios",
    errorAllRequired: "Todos los campos son obligatorios",
    errorFillAll: "Por favor rellena todos los campos obligatorios",
    errorAnswerQuestion: "Por favor responde la pregunta",
    errorPhone: "Número de teléfono requerido",
    errorServer: "Error del servidor",
    errorGeneric: "Error",
    errorInvalidCode: "Código inválido",
    selectPlaceholder: "Seleccionar…",
    selectGender: ["Masculino", "Femenino"],
    selectMarital: ["Soltero/a", "Casado/a", "Divorciado/a", "Viudo/a", "Pareja de hecho"],
    pays: ["Alemania","Francia","Bélgica","Suiza","Austria","Países Bajos","Luxemburgo","Lituania","Turquía","Marruecos","Argelia","Túnez","Senegal","Costa de Marfil","Otro"],
    docs: ["Pasaporte","Tarjeta de identidad","Permiso de residencia"],
    situations: ["Empleado/a","Funcionario/a","Freelance / Autónomo/a","Empresario/a","Profesión liberal","Estudiante","Jubilado/a","Desempleado/a","Otro"],
    revenues: ["Menos de 1.000 €","1.000 – 2.000 €","2.000 – 3.500 €","3.500 – 5.000 €","Más de 5.000 €"],
    links: ["Cónyuge","Hijo/a","Padre/Madre","Hermano/a","Otro"],
  },
  it: {
    step0Title: "Crea account",
    step0Subtitle: "Inserisci il tuo indirizzo e-mail per iniziare la registrazione su KT Bank.",
    emailLabel: "Indirizzo e-mail",
    emailPlaceholder: "tu@esempio.it",
    next: "Continua",
    loading: "Attendere prego…",
    terms1: "Continuando, accetti i nostri",
    terms2: "Termini e Condizioni",
    terms3: "e la nostra",
    terms4: "Informativa sulla Privacy",
    terms5: "",
    alreadyAccount: "Hai già un account?",
    loginLink: "Accedi",
    step1Title: "Verifica e-mail",
    codeSentTo: "Codice inviato a",
    verifyBtn: "Verifica codice",
    resendIn: "Reinvia tra",
    resendBtn: "Reinvia codice",
    stepOf: "Passo {n} di 7",
    step2Title: "Informazioni personali",
    residenceLabel: "Paese di residenza",
    dobLabel: "Data di nascita",
    promoLabel: "Codice promozionale (opzionale)",
    fatcaText: "Confermo di non essere soggetto agli obblighi fiscali statunitensi (FATCA / CRS US).",
    step3Title: "La tua identità",
    firstNameLabel: "Nome",
    lastNameLabel: "Cognome",
    genderLabel: "Sesso",
    maritalLabel: "Stato civile",
    birthCountryLabel: "Paese di nascita",
    birthCityLabel: "Città di nascita",
    birthCityPlaceholder: "Berlino",
    step4Title: "Nazionalità e Documento",
    nationalityLabel: "Nazionalità",
    docTypeLabel: "Tipo di documento d'identità",
    authorityLabel: "Autorità emittente",
    authorityPlaceholder: "Comune – Germania",
    step5Title: "Situazione professionale",
    currentSitLabel: "Situazione attuale",
    incomeLabel: "Reddito mensile netto",
    addressTitle: "Indirizzo di residenza",
    streetLabel: "Via e numero civico",
    postalLabel: "Codice postale",
    cityLabel: "Città",
    streetPlaceholder: "Via Roma 12",
    postalPlaceholder: "10115",
    cityPlaceholder: "Berlino",
    employerDefault: "Nome del datore di lavoro",
    employerStudent: "Istituto scolastico",
    employerSelf: "Nome dell'azienda",
    employerPlaceholder: "es. Deutsche Bank AG",
    step6Title: "Situazione finanziaria",
    step6Subtitle: "Queste informazioni sono riservate e sicure.",
    creditsQuestion: "Hai prestiti in corso?",
    yes: "Sì",
    no: "No",
    creditsTitle: "Dettagli prestiti",
    add: "Aggiungi",
    addCreditBtn: "+ Aggiungi prestito",
    creditN: "Prestito {n}",
    bankLabel: "Nome della banca creditrice",
    bankPlaceholder: "es. UniCredit, Intesa…",
    creditAmountLabel: "Importo totale residuo (€)",
    creditAmountPlaceholder: "es. 12.500",
    step7Title: "Situazione familiare",
    step7Subtitle: "Queste informazioni costituiscono il tuo fascicolo bancario ufficiale.",
    childrenLabel: "Numero di figli",
    dependentsLabel: "Persone a carico (totale)",
    beneficiariesTitle: "Persone autorizzate",
    beneficiariesSubtitle: "Persone autorizzate sul conto (max. 4)",
    noBeneficiaries: "Nessuna persona autorizzata — opzionale",
    beneficiaryN: "Persona autorizzata {n}",
    relationshipLabel: "Grado di parentela",
    step8Title: "Dati di contatto",
    step8Subtitle: "Ultimo passo — il tuo conto verrà creato immediatamente.",
    phoneLabel: "Numero di telefono",
    accountNote: "Completando la registrazione, il tuo conto corrente KT Bank verrà aperto immediatamente. Riceverai il tuo IBAN via e-mail.",
    submitBtn: "Completa la registrazione",
    doneTitle: "Benvenuto in KT Bank!",
    doneSubtitle: "Il tuo conto è stato creato con successo. Ti è stata inviata una e-mail di conferma.",
    ibanLabel: "Il tuo IBAN",
    goToDashboard: "Vai al mio conto",
    backHome: "Torna alla home",
    errorInvalidEmail: "Indirizzo e-mail non valido",
    errorDigits: "Inserisci tutte e 4 le cifre",
    errorFillRequired: "Compila i campi obbligatori",
    errorAllRequired: "Tutti i campi sono obbligatori",
    errorFillAll: "Compila tutti i campi obbligatori",
    errorAnswerQuestion: "Rispondi alla domanda",
    errorPhone: "Numero di telefono obbligatorio",
    errorServer: "Errore del server",
    errorGeneric: "Errore",
    errorInvalidCode: "Codice non valido",
    selectPlaceholder: "Seleziona…",
    selectGender: ["Maschio", "Femmina"],
    selectMarital: ["Celibe/Nubile", "Sposato/a", "Divorziato/a", "Vedovo/a", "Unione civile"],
    pays: ["Germania","Francia","Belgio","Svizzera","Austria","Paesi Bassi","Lussemburgo","Lituania","Turchia","Marocco","Algeria","Tunisia","Senegal","Costa d'Avorio","Altro"],
    docs: ["Passaporto","Carta d'identità","Permesso di soggiorno"],
    situations: ["Dipendente","Funzionario pubblico","Freelance / Autonomo","Imprenditore","Libero professionista","Studente","Pensionato","Disoccupato","Altro"],
    revenues: ["Meno di 1.000 €","1.000 – 2.000 €","2.000 – 3.500 €","3.500 – 5.000 €","Più di 5.000 €"],
    links: ["Coniuge","Figlio/a","Genitore","Fratello/Sorella","Altro"],
  },
  pt: {
    step0Title: "Criar conta",
    step0Subtitle: "Insira o seu endereço de e-mail para iniciar o seu registo no KT Bank.",
    emailLabel: "Endereço de e-mail",
    emailPlaceholder: "voce@exemplo.pt",
    next: "Continuar",
    loading: "Por favor aguarde…",
    terms1: "Ao continuar, aceita os nossos",
    terms2: "Termos e Condições",
    terms3: "e a nossa",
    terms4: "Política de Privacidade",
    terms5: "",
    alreadyAccount: "Já tem uma conta?",
    loginLink: "Entrar",
    step1Title: "Verificação de e-mail",
    codeSentTo: "Código enviado para",
    verifyBtn: "Verificar código",
    resendIn: "Reenviar em",
    resendBtn: "Reenviar código",
    stepOf: "Passo {n} de 7",
    step2Title: "Informações pessoais",
    residenceLabel: "País de residência",
    dobLabel: "Data de nascimento",
    promoLabel: "Código promocional (opcional)",
    fatcaText: "Confirmo que não estou sujeito a obrigações fiscais americanas (FATCA / CRS US).",
    step3Title: "A sua identidade",
    firstNameLabel: "Primeiro nome",
    lastNameLabel: "Apelido",
    genderLabel: "Género",
    maritalLabel: "Estado civil",
    birthCountryLabel: "País de nascimento",
    birthCityLabel: "Cidade de nascimento",
    birthCityPlaceholder: "Berlim",
    step4Title: "Nacionalidade e Documento",
    nationalityLabel: "Nacionalidade",
    docTypeLabel: "Tipo de documento de identidade",
    authorityLabel: "Autoridade emissora",
    authorityPlaceholder: "Câmara Municipal – Alemanha",
    step5Title: "Situação profissional",
    currentSitLabel: "Situação atual",
    incomeLabel: "Rendimento mensal líquido",
    addressTitle: "Morada de residência",
    streetLabel: "Rua e número",
    postalLabel: "Código postal",
    cityLabel: "Cidade",
    streetPlaceholder: "Rua Principal 12",
    postalPlaceholder: "10115",
    cityPlaceholder: "Berlim",
    employerDefault: "Nome do empregador",
    employerStudent: "Instituição de ensino",
    employerSelf: "Nome da empresa",
    employerPlaceholder: "ex. Deutsche Bank AG",
    step6Title: "Situação financeira",
    step6Subtitle: "Estas informações são confidenciais e seguras.",
    creditsQuestion: "Tem empréstimos em curso?",
    yes: "Sim",
    no: "Não",
    creditsTitle: "Detalhes dos empréstimos",
    add: "Adicionar",
    addCreditBtn: "+ Adicionar empréstimo",
    creditN: "Empréstimo {n}",
    bankLabel: "Nome do banco credor",
    bankPlaceholder: "ex. Millennium BCP…",
    creditAmountLabel: "Montante total restante (€)",
    creditAmountPlaceholder: "ex. 12.500",
    step7Title: "Situação familiar",
    step7Subtitle: "Estas informações constituem o seu processo bancário oficial.",
    childrenLabel: "Número de filhos",
    dependentsLabel: "Pessoas dependentes (total)",
    beneficiariesTitle: "Pessoas autorizadas",
    beneficiariesSubtitle: "Pessoas autorizadas na conta (máx. 4)",
    noBeneficiaries: "Sem pessoas autorizadas — opcional",
    beneficiaryN: "Pessoa autorizada {n}",
    relationshipLabel: "Grau de parentesco",
    step8Title: "Dados de contacto",
    step8Subtitle: "Último passo — a sua conta será criada imediatamente.",
    phoneLabel: "Número de telefone",
    accountNote: "Ao concluir, a sua conta à ordem KT Bank será aberta imediatamente. Receberá o seu IBAN por e-mail.",
    submitBtn: "Concluir registo",
    doneTitle: "Bem-vindo ao KT Bank!",
    doneSubtitle: "A sua conta foi criada com sucesso. Foi enviado um e-mail de confirmação.",
    ibanLabel: "O seu IBAN",
    goToDashboard: "Ir para a minha conta",
    backHome: "Voltar ao início",
    errorInvalidEmail: "Endereço de e-mail inválido",
    errorDigits: "Por favor insira os 4 dígitos",
    errorFillRequired: "Preencha os campos obrigatórios",
    errorAllRequired: "Todos os campos são obrigatórios",
    errorFillAll: "Por favor preencha todos os campos obrigatórios",
    errorAnswerQuestion: "Por favor responda à questão",
    errorPhone: "Número de telefone obrigatório",
    errorServer: "Erro no servidor",
    errorGeneric: "Erro",
    errorInvalidCode: "Código inválido",
    selectPlaceholder: "Selecionar…",
    selectGender: ["Masculino", "Feminino"],
    selectMarital: ["Solteiro/a", "Casado/a", "Divorciado/a", "Viúvo/a", "União de facto"],
    pays: ["Alemanha","França","Bélgica","Suíça","Áustria","Países Baixos","Luxemburgo","Lituânia","Turquia","Marrocos","Argélia","Tunísia","Senegal","Costa do Marfim","Outro"],
    docs: ["Passaporte","Bilhete de identidade","Título de residência"],
    situations: ["Empregado/a","Funcionário público","Freelance / Independente","Empresário/a","Profissão liberal","Estudante","Aposentado/a","Desempregado/a","Outro"],
    revenues: ["Menos de 1.000 €","1.000 – 2.000 €","2.000 – 3.500 €","3.500 – 5.000 €","Mais de 5.000 €"],
    links: ["Cônjuge","Filho/a","Pai/Mãe","Irmão/Irmã","Outro"],
  },
  nl: {
    step0Title: "Account aanmaken",
    step0Subtitle: "Voer uw e-mailadres in om te beginnen met uw KT Bank-registratie.",
    emailLabel: "E-mailadres",
    emailPlaceholder: "u@voorbeeld.nl",
    next: "Doorgaan",
    loading: "Even geduld…",
    terms1: "Door verder te gaan, gaat u akkoord met onze",
    terms2: "Algemene Voorwaarden",
    terms3: "en ons",
    terms4: "Privacybeleid",
    terms5: "",
    alreadyAccount: "Al een account?",
    loginLink: "Inloggen",
    step1Title: "E-mailverificatie",
    codeSentTo: "Code verzonden naar",
    verifyBtn: "Code verifiëren",
    resendIn: "Opnieuw verzenden over",
    resendBtn: "Code opnieuw verzenden",
    stepOf: "Stap {n} van 7",
    step2Title: "Persoonlijke informatie",
    residenceLabel: "Land van verblijf",
    dobLabel: "Geboortedatum",
    promoLabel: "Promotiecode (optioneel)",
    fatcaText: "Ik bevestig dat ik niet onderworpen ben aan Amerikaanse belastingverplichtingen (FATCA / CRS US).",
    step3Title: "Uw identiteit",
    firstNameLabel: "Voornaam",
    lastNameLabel: "Achternaam",
    genderLabel: "Geslacht",
    maritalLabel: "Burgerlijke staat",
    birthCountryLabel: "Geboorteland",
    birthCityLabel: "Geboorteplaats",
    birthCityPlaceholder: "Berlijn",
    step4Title: "Nationaliteit & Document",
    nationalityLabel: "Nationaliteit",
    docTypeLabel: "Type identiteitsdocument",
    authorityLabel: "Uitgevende instantie",
    authorityPlaceholder: "Gemeente – Duitsland",
    step5Title: "Professionele situatie",
    currentSitLabel: "Huidige situatie",
    incomeLabel: "Maandelijks netto-inkomen",
    addressTitle: "Woonadres",
    streetLabel: "Straat en huisnummer",
    postalLabel: "Postcode",
    cityLabel: "Stad",
    streetPlaceholder: "Hoofdstraat 12",
    postalPlaceholder: "10115",
    cityPlaceholder: "Berlijn",
    employerDefault: "Naam werkgever",
    employerStudent: "Onderwijsinstelling",
    employerSelf: "Bedrijfsnaam",
    employerPlaceholder: "bijv. Deutsche Bank AG",
    step6Title: "Financiële situatie",
    step6Subtitle: "Deze informatie is vertrouwelijk en veilig.",
    creditsQuestion: "Heeft u lopende leningen?",
    yes: "Ja",
    no: "Nee",
    creditsTitle: "Leningdetails",
    add: "Toevoegen",
    addCreditBtn: "+ Lening toevoegen",
    creditN: "Lening {n}",
    bankLabel: "Naam van de kredietverlenende bank",
    bankPlaceholder: "bijv. ING, Rabobank…",
    creditAmountLabel: "Resterend totaalbedrag (€)",
    creditAmountPlaceholder: "bijv. 12.500",
    step7Title: "Gezinssituatie",
    step7Subtitle: "Deze informatie vormt uw officiële bankdossier.",
    childrenLabel: "Aantal kinderen",
    dependentsLabel: "Personen ten laste (totaal)",
    beneficiariesTitle: "Gemachtigde personen",
    beneficiariesSubtitle: "Personen gemachtigd op de rekening (max. 4)",
    noBeneficiaries: "Geen gemachtigde personen — optioneel",
    beneficiaryN: "Gemachtigde persoon {n}",
    relationshipLabel: "Familierelatie",
    step8Title: "Contactgegevens",
    step8Subtitle: "Laatste stap — uw account wordt onmiddellijk aangemaakt.",
    phoneLabel: "Telefoonnummer",
    accountNote: "Na voltooiing wordt uw KT Bank betaalrekening onmiddellijk geopend. U ontvangt uw IBAN per e-mail.",
    submitBtn: "Registratie voltooien",
    doneTitle: "Welkom bij KT Bank!",
    doneSubtitle: "Uw account is succesvol aangemaakt. Er is een bevestigingsmail naar u verzonden.",
    ibanLabel: "Uw IBAN",
    goToDashboard: "Naar mijn account",
    backHome: "Terug naar home",
    errorInvalidEmail: "Ongeldig e-mailadres",
    errorDigits: "Voer alle 4 cijfers in",
    errorFillRequired: "Vul de verplichte velden in",
    errorAllRequired: "Alle velden zijn verplicht",
    errorFillAll: "Vul alle verplichte velden in",
    errorAnswerQuestion: "Beantwoord de vraag",
    errorPhone: "Telefoonnummer verplicht",
    errorServer: "Serverfout",
    errorGeneric: "Fout",
    errorInvalidCode: "Ongeldige code",
    selectPlaceholder: "Selecteren…",
    selectGender: ["Man", "Vrouw"],
    selectMarital: ["Ongehuwd", "Gehuwd", "Gescheiden", "Weduwe/Weduwnaar", "Geregistreerd partnerschap"],
    pays: ["Duitsland","Frankrijk","België","Zwitserland","Oostenrijk","Nederland","Luxemburg","Litouwen","Turkije","Marokko","Algerije","Tunesië","Senegal","Ivoorkust","Anders"],
    docs: ["Paspoort","Identiteitskaart","Verblijfsvergunning"],
    situations: ["Werknemer","Ambtenaar","Freelance / Zelfstandige","Ondernemer","Vrij beroep","Student","Gepensioneerde","Werkloos","Anders"],
    revenues: ["Minder dan €1.000","€1.000 – €2.000","€2.000 – €3.500","€3.500 – €5.000","Meer dan €5.000"],
    links: ["Echtgenoot/echtgenote","Kind","Ouder","Broer/Zus","Anders"],
  },
} as const;

type RUILang = keyof typeof REGISTER_UI;

function getRUI(lang: string) {
  if (lang in REGISTER_UI) return REGISTER_UI[lang as RUILang];
  if ("en" in REGISTER_UI) return REGISTER_UI["en"];
  return REGISTER_UI["de"];
}

const wrap: React.CSSProperties = {
  minHeight:"100vh", background:"#1C1C1E", display:"flex",
  flexDirection:"column", padding:"0 24px 60px", boxSizing:"border-box",
};

function FInput({ label, type="text", placeholder, value, onChange, max }: {
  label:string; type?:string; placeholder?:string; value:string;
  onChange:(v:string)=>void; max?:string;
}) {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:6}}>
      <label style={{color:"rgba(255,255,255,0.6)",fontSize:"0.8rem",fontWeight:500}}>{label}</label>
      <input type={type} placeholder={placeholder} value={value} max={max}
        onChange={(e)=>onChange(e.target.value)}
        style={{width:"100%",height:52,background:"#2A2A35",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,color:"white",fontSize:"1rem",padding:"0 16px",boxSizing:"border-box",outline:"none"}}/>
    </div>
  );
}

function FSelect({ label, value, onChange, options, placeholder }: {
  label:string; value:string; onChange:(v:string)=>void; options:string[]; placeholder?:string;
}) {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:6}}>
      <label style={{color:"rgba(255,255,255,0.6)",fontSize:"0.8rem",fontWeight:500}}>{label}</label>
      <select value={value} onChange={(e)=>onChange(e.target.value)}
        style={{width:"100%",height:52,background:"#2A2A35",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,color:value?"white":"rgba(255,255,255,0.35)",fontSize:"1rem",padding:"0 16px",boxSizing:"border-box",outline:"none",appearance:"none"}}>
        <option value="" disabled>{placeholder ?? "Select…"}</option>
        {options.map((o)=><option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function FSelectT({ label, value, onChange, canonicalOptions, displayOptions, placeholder }: {
  label:string; value:string; onChange:(v:string)=>void; canonicalOptions:string[]; displayOptions:readonly string[]; placeholder?:string;
}) {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:6}}>
      <label style={{color:"rgba(255,255,255,0.6)",fontSize:"0.8rem",fontWeight:500}}>{label}</label>
      <select value={value} onChange={(e)=>onChange(e.target.value)}
        style={{width:"100%",height:52,background:"#2A2A35",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,color:value?"white":"rgba(255,255,255,0.35)",fontSize:"1rem",padding:"0 16px",boxSizing:"border-box",outline:"none",appearance:"none"}}>
        <option value="" disabled>{placeholder ?? "Select…"}</option>
        {canonicalOptions.map((canonical,idx)=>(
          <option key={canonical} value={canonical}>{displayOptions[idx] ?? canonical}</option>
        ))}
      </select>
    </div>
  );
}

function FNumber({ label, value, onChange, max=20 }: {
  label:string; value:number; onChange:(v:number)=>void; max?:number;
}) {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:6}}>
      <label style={{color:"rgba(255,255,255,0.6)",fontSize:"0.8rem",fontWeight:500}}>{label}</label>
      <div style={{display:"flex",alignItems:"center",gap:16}}>
        <button type="button" onClick={()=>onChange(Math.max(0,value-1))}
          style={{width:44,height:44,borderRadius:12,background:"#2A2A35",border:"1px solid rgba(255,255,255,0.1)",color:"white",fontSize:"1.4rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
        <span style={{color:"white",fontSize:"1.4rem",fontWeight:700,minWidth:32,textAlign:"center"}}>{value}</span>
        <button type="button" onClick={()=>onChange(Math.min(max,value+1))}
          style={{width:44,height:44,borderRadius:12,background:"#2A2A35",border:"1px solid rgba(255,255,255,0.1)",color:"white",fontSize:"1.4rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
      </div>
    </div>
  );
}

function Btn({ children, onClick, loading, loadingText }: {
  children:React.ReactNode; onClick?:()=>void; loading?:boolean; loadingText?:string;
}) {
  return (
    <button type="button" onClick={onClick} disabled={loading}
      style={{width:"100%",height:54,borderRadius:999,background:"white",color:"#005F2D",fontWeight:700,fontSize:"1rem",border:"none",cursor:loading?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,opacity:loading?0.6:1}}>
      {loading?(loadingText ?? "Please wait…"):children}
    </button>
  );
}

function PageHeader({ onBack }: { onBack?:()=>void }) {
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"20px 0 8px"}}>
      {onBack
        ?<button onClick={onBack} style={{background:"none",border:"none",color:"rgba(255,255,255,0.6)",cursor:"pointer",padding:4}}><ChevronLeft size={24}/></button>
        :<div style={{width:32}}/>}
      <span style={{color:"white",fontWeight:800,fontSize:"1.1rem"}}>KT Bank</span>
      <div style={{width:32}}/>
    </div>
  );
}

function ProgressBar({ step, label }: { step:Step; label:string }) {
  if (step===0||step===1||step==="done") return null;
  const n = step as number;
  const pct = Math.round(((n-1)/7)*100);
  return (
    <div style={{marginBottom:8}}>
      <div style={{height:3,background:"rgba(255,255,255,0.1)",borderRadius:99,marginBottom:6}}>
        <div style={{height:"100%",width:`${pct}%`,background:"#005F2D",borderRadius:99,transition:"width 0.4s ease"}}/>
      </div>
      <p style={{color:"rgba(255,255,255,0.35)",fontSize:"0.75rem",margin:0}}>{label}</p>
    </div>
  );
}

export default function RegisterPage() {
  const { lang } = useLanguage();
  const ui = getRUI(lang);

  const [step,setStep] = useState<Step>(0);
  const [email,setEmail] = useState("");
  const [otp,setOtp] = useState(["","","",""]);
  const [timer,setTimer] = useState(120);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");
  const [iban,setIban] = useState("");

  // Step 2
  const [pays,setPays] = useState("");
  const [dob,setDob] = useState("");
  const [promo,setPromo] = useState("");
  const [fatca,setFatca] = useState(false);

  // Step 3
  const [prenom,setPrenom] = useState("");
  const [nom,setNom] = useState("");
  const [sexe,setSexe] = useState("");
  const [situation,setSituation] = useState("");
  const [paysNaissance,setPaysNaissance] = useState("");
  const [villeNaissance,setVilleNaissance] = useState("");

  // Step 4
  const [nationalite,setNationalite] = useState("");
  const [typeDoc,setTypeDoc] = useState("");
  const [autorite,setAutorite] = useState("");

  // Step 5
  const [situationPro,setSituationPro] = useState("");
  const [nomEmployeur,setNomEmployeur] = useState("");
  const [revenuMensuel,setRevenuMensuel] = useState("");
  const [adresse,setAdresse] = useState("");
  const [codePostal,setCodePostal] = useState("");
  const [ville,setVille] = useState("");

  // Step 6
  const [aCredits,setACredits] = useState<boolean|null>(null);
  const [credits,setCredits] = useState<Credit[]>([]);

  // Step 7
  const [nbEnfants,setNbEnfants] = useState(0);
  const [personnesCharge,setPersonnesCharge] = useState(0);
  const [ayantsDroit,setAyantsDroit] = useState<AyantDroit[]>([]);

  // Step 8
  const [phone,setPhone] = useState("");

  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Restore saved progress on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("kt_reg");
      if (!saved) return;
      const s = JSON.parse(saved);
      if (s.email) setEmail(s.email);
      if (s.step && s.step !== 0 && s.step !== 1) setStep(s.step);
      if (s.pays) setPays(s.pays);
      if (s.dob) setDob(s.dob);
      if (s.promo) setPromo(s.promo);
      if (s.fatca !== undefined) setFatca(s.fatca);
      if (s.prenom) setPrenom(s.prenom);
      if (s.nom) setNom(s.nom);
      if (s.sexe) setSexe(s.sexe);
      if (s.situation) setSituation(s.situation);
      if (s.paysNaissance) setPaysNaissance(s.paysNaissance);
      if (s.villeNaissance) setVilleNaissance(s.villeNaissance);
      if (s.nationalite) setNationalite(s.nationalite);
      if (s.typeDoc) setTypeDoc(s.typeDoc);
      if (s.autorite) setAutorite(s.autorite);
      if (s.situationPro) setSituationPro(s.situationPro);
      if (s.nomEmployeur) setNomEmployeur(s.nomEmployeur);
      if (s.revenuMensuel) setRevenuMensuel(s.revenuMensuel);
      if (s.adresse) setAdresse(s.adresse);
      if (s.codePostal) setCodePostal(s.codePostal);
      if (s.ville) setVille(s.ville);
      if (s.aCredits !== undefined) setACredits(s.aCredits);
      if (s.credits) setCredits(s.credits);
      if (s.nbEnfants !== undefined) setNbEnfants(s.nbEnfants);
      if (s.personnesCharge !== undefined) setPersonnesCharge(s.personnesCharge);
      if (s.ayantsDroit) setAyantsDroit(s.ayantsDroit);
      if (s.phone) setPhone(s.phone);
    } catch { /* ignore */ }
  }, []);

  // Save progress to sessionStorage whenever key state changes
  useEffect(() => {
    if (step === "done") { sessionStorage.removeItem("kt_reg"); return; }
    try {
      sessionStorage.setItem("kt_reg", JSON.stringify({
        step, email, pays, dob, promo, fatca,
        prenom, nom, sexe, situation, paysNaissance, villeNaissance,
        nationalite, typeDoc, autorite,
        situationPro, nomEmployeur, revenuMensuel, adresse, codePostal, ville,
        aCredits, credits, nbEnfants, personnesCharge, ayantsDroit, phone,
      }));
    } catch { /* ignore */ }
  }, [step, email, pays, dob, promo, fatca, prenom, nom, sexe, situation, paysNaissance, villeNaissance,
     nationalite, typeDoc, autorite, situationPro, nomEmployeur, revenuMensuel, adresse, codePostal, ville,
     aCredits, credits, nbEnfants, personnesCharge, ayantsDroit, phone]);

  function startTimer() {
    setTimer(120);
    const id = setInterval(()=>setTimer((t)=>{if(t<=1){clearInterval(id);return 0;}return t-1;}),1000);
  }

  async function sendOtp() {
    if(!email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){setError(ui.errorInvalidEmail);return;}
    setLoading(true);setError("");
    const res = await fetch("/api/kt/otp-send",{method:"POST",body:JSON.stringify({email,lang}),headers:{"Content-Type":"application/json"}});
    const data = await res.json();
    setLoading(false);
    if(!res.ok){setError(data.error||ui.errorGeneric);return;}
    startTimer();setStep(1);
  }

  async function verifyOtp() {
    const code = otp.join("");
    if(code.length<4){setError(ui.errorDigits);return;}
    setLoading(true);setError("");
    const res = await fetch("/api/kt/otp-verify",{method:"POST",body:JSON.stringify({email,code}),headers:{"Content-Type":"application/json"}});
    const data = await res.json();
    setLoading(false);
    if(!res.ok){setError(data.error||ui.errorInvalidCode);return;}
    setStep(2);
  }

  async function save(s:2|3|4|5|6|7|8) {
    setLoading(true);setError("");
    const bodies:Record<number,object> = {
      2:{step:2,email,pays_residence:pays,date_naissance:dob,code_promo:promo,is_fatca:fatca,lang},
      3:{step:3,email,prenom,nom,sexe,situation_familiale:situation,pays_naissance:paysNaissance,ville_naissance:villeNaissance},
      4:{step:4,email,nationalite,type_document:typeDoc,autorite_document:autorite},
      5:{step:5,email,situation_professionnelle:situationPro,nom_employeur:nomEmployeur,revenu_mensuel:revenuMensuel,adresse,code_postal:codePostal,ville},
      6:{step:6,email,a_credits_en_cours:aCredits??false,credits_details:credits},
      7:{step:7,email,nombre_enfants:nbEnfants,personnes_a_charge:personnesCharge,ayants_droit:ayantsDroit},
      8:{step:8,email,telephone:phone},
    };
    const res = await fetch("/api/kt/register",{method:"POST",body:JSON.stringify(bodies[s]),headers:{"Content-Type":"application/json"}});
    const data = await res.json();
    setLoading(false);
    if(!res.ok){setError(data.error||ui.errorServer);return;}
    if(s===8){setIban(data.iban||"");setStep("done");}
    else setStep((s+1) as Step);
  }

  function handleOtp(idx:number,val:string) {
    const digit = val.replace(/\D/,"").slice(-1);
    const next=[...otp];next[idx]=digit;setOtp(next);
    if(digit&&idx<3)otpRefs[idx+1].current?.focus();
    if(!digit&&idx>0)otpRefs[idx-1].current?.focus();
  }

  function addCredit() {
    if(credits.length>=5)return;
    setCredits([...credits,{nom_banque:"",montant:""}]);
  }
  function updateCredit(i:number,f:keyof Credit,v:string) {
    const n=[...credits];n[i]={...n[i],[f]:v};setCredits(n);
  }
  function removeCredit(i:number){setCredits(credits.filter((_,j)=>j!==i));}

  function addAyantDroit() {
    if(ayantsDroit.length>=4)return;
    setAyantsDroit([...ayantsDroit,{prenom:"",nom:"",lien:"",date_naissance:""}]);
  }
  function updateAyantDroit(i:number,f:keyof AyantDroit,v:string) {
    const n=[...ayantsDroit];n[i]={...n[i],[f]:v};setAyantsDroit(n);
  }
  function removeAyantDroit(i:number){setAyantsDroit(ayantsDroit.filter((_,j)=>j!==i));}

  const employeurLabel = ["Rentner(in)","Arbeitslos"].includes(situationPro)?null
    :situationPro==="Student(in)"?ui.employerStudent
    :["Unternehmer(in)","Freiberuflich / Selbstständig"].includes(situationPro)?ui.employerSelf
    :ui.employerDefault;

  /* ── Step 0 ── */
  if(step===0) return (
    <div style={wrap}>
      <PageHeader/>
      <div style={{flex:1,display:"flex",flexDirection:"column",paddingTop:32}}>
        <div style={{width:56,height:56,borderRadius:16,background:"rgba(0,95,45,0.2)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:24}}>
          <LogIn size={24} color="#005F2D"/>
        </div>
        <h1 style={{color:"white",fontWeight:800,fontSize:"1.75rem",marginBottom:8}}>{ui.step0Title}</h1>
        <p style={{color:"rgba(255,255,255,0.5)",fontSize:"0.95rem",marginBottom:32,lineHeight:1.6}}>
          {ui.step0Subtitle}
        </p>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <FInput label={ui.emailLabel} type="email" placeholder={ui.emailPlaceholder} value={email} onChange={setEmail}/>
          {error&&<p style={{color:"#FF6B6B",fontSize:"0.85rem"}}>{error}</p>}
          <Btn onClick={sendOtp} loading={loading} loadingText={ui.loading}>{ui.next} <ArrowRight size={18}/></Btn>
        </div>
        <p style={{color:"rgba(255,255,255,0.3)",fontSize:"0.78rem",marginTop:24,lineHeight:1.6,textAlign:"center"}}>
          {ui.terms1}{" "}
          <Link href="/legal" style={{color:"rgba(255,255,255,0.55)",textDecoration:"underline"}}>{ui.terms2}</Link>{" "}
          {ui.terms3}{" "}
          <Link href="/legal" style={{color:"rgba(255,255,255,0.55)",textDecoration:"underline"}}>{ui.terms4}</Link>{" "}
          {ui.terms5}
        </p>
        <p style={{color:"rgba(255,255,255,0.4)",fontSize:"0.85rem",marginTop:"auto",textAlign:"center",paddingTop:24}}>
          {ui.alreadyAccount}{" "}
          <Link href="/client/login" style={{color:"white",fontWeight:600,textDecoration:"none"}}>{ui.loginLink}</Link>
        </p>
      </div>
    </div>
  );

  /* ── Step 1 – OTP ── */
  if(step===1) return (
    <div style={wrap}>
      <PageHeader onBack={()=>setStep(0)}/>
      <div style={{flex:1,display:"flex",flexDirection:"column",paddingTop:32}}>
        <h1 style={{color:"white",fontWeight:800,fontSize:"1.75rem",marginBottom:8}}>{ui.step1Title}</h1>
        <p style={{color:"rgba(255,255,255,0.5)",fontSize:"0.95rem",marginBottom:4,lineHeight:1.6}}>{ui.codeSentTo}</p>
        <p style={{color:"white",fontWeight:600,marginBottom:32}}>{email}</p>
        <div style={{display:"flex",gap:12,justifyContent:"center",marginBottom:32}}>
          {otp.map((d,i)=>(
            <input key={i} ref={otpRefs[i]} value={d}
              onChange={(e)=>handleOtp(i,e.target.value)}
              onKeyDown={(e)=>{if(e.key==="Backspace"&&!d&&i>0)otpRefs[i-1].current?.focus();}}
              maxLength={1} inputMode="numeric"
              style={{width:64,height:72,textAlign:"center",fontSize:"1.75rem",fontWeight:700,background:"#2A2A35",border:`2px solid ${d?"#005F2D":"rgba(255,255,255,0.1)"}`,borderRadius:16,color:"white",outline:"none"}}/>
          ))}
        </div>
        {error&&<p style={{color:"#FF6B6B",fontSize:"0.85rem",marginBottom:16,textAlign:"center"}}>{error}</p>}
        <Btn onClick={verifyOtp} loading={loading} loadingText={ui.loading}>{ui.verifyBtn}</Btn>
        <div style={{textAlign:"center",marginTop:24}}>
          {timer>0
            ?<p style={{color:"rgba(255,255,255,0.4)",fontSize:"0.85rem"}}>{ui.resendIn} {Math.floor(timer/60)}:{String(timer%60).padStart(2,"0")}</p>
            :<button onClick={sendOtp} style={{background:"none",border:"none",color:"#005F2D",fontWeight:600,cursor:"pointer",fontSize:"0.9rem"}}>{ui.resendBtn}</button>}
        </div>
      </div>
    </div>
  );

  /* ── Step 2 : Personal Information ── */
  if(step===2) return (
    <div style={wrap}>
      <PageHeader onBack={()=>setStep(1)}/><ProgressBar step={step} label={ui.stepOf.replace("{n}", String((step as number)-1))}/>
      <div style={{flex:1,paddingTop:20}}>
        <h1 style={{color:"white",fontWeight:800,fontSize:"1.5rem",marginBottom:20}}>{ui.step2Title}</h1>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <FSelectT label={ui.residenceLabel} value={pays} onChange={setPays} canonicalOptions={PAYS} displayOptions={ui.pays} placeholder={ui.selectPlaceholder}/>
          <FInput label={ui.dobLabel} type="date" value={dob} onChange={setDob}
            max={new Date(Date.now()-18*365.25*86400000).toISOString().split("T")[0]}/>
          <FInput label={ui.promoLabel} placeholder="KT2024" value={promo} onChange={setPromo}/>
          <label style={{display:"flex",gap:12,alignItems:"flex-start",background:"#2A2A35",borderRadius:14,padding:16,cursor:"pointer"}}>
            <input type="checkbox" checked={fatca} onChange={(e)=>setFatca(e.target.checked)}
              style={{width:20,height:20,marginTop:2,accentColor:"#005F2D",flexShrink:0}}/>
            <span style={{color:"rgba(255,255,255,0.7)",fontSize:"0.82rem",lineHeight:1.5}}>
              {ui.fatcaText}
            </span>
          </label>
          {error&&<p style={{color:"#FF6B6B",fontSize:"0.85rem"}}>{error}</p>}
          <Btn onClick={()=>{if(!pays||!dob){setError(ui.errorFillRequired);return;}save(2);}} loading={loading} loadingText={ui.loading}>
            {ui.next} <ArrowRight size={18}/>
          </Btn>
        </div>
      </div>
    </div>
  );

  /* ── Step 3 : Identity ── */
  if(step===3) return (
    <div style={wrap}>
      <PageHeader onBack={()=>setStep(2)}/><ProgressBar step={step} label={ui.stepOf.replace("{n}", String((step as number)-1))}/>
      <div style={{flex:1,paddingTop:20}}>
        <h1 style={{color:"white",fontWeight:800,fontSize:"1.5rem",marginBottom:20}}>{ui.step3Title}</h1>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <FInput label={ui.firstNameLabel} placeholder="Mohammed" value={prenom} onChange={setPrenom}/>
            <FInput label={ui.lastNameLabel} placeholder="Al-Rashid" value={nom} onChange={setNom}/>
          </div>
          <FSelect label={ui.genderLabel} value={sexe} onChange={setSexe} options={[...ui.selectGender]} placeholder={ui.selectPlaceholder}/>
          <FSelect label={ui.maritalLabel} value={situation} onChange={setSituation}
            options={[...ui.selectMarital]} placeholder={ui.selectPlaceholder}/>
          <FSelectT label={ui.birthCountryLabel} value={paysNaissance} onChange={setPaysNaissance} canonicalOptions={PAYS} displayOptions={ui.pays} placeholder={ui.selectPlaceholder}/>
          <FInput label={ui.birthCityLabel} placeholder={ui.birthCityPlaceholder} value={villeNaissance} onChange={setVilleNaissance}/>
          {error&&<p style={{color:"#FF6B6B",fontSize:"0.85rem"}}>{error}</p>}
          <Btn onClick={()=>{if(!prenom||!nom||!sexe||!situation||!paysNaissance||!villeNaissance){setError(ui.errorAllRequired);return;}save(3);}} loading={loading} loadingText={ui.loading}>
            {ui.next} <ArrowRight size={18}/>
          </Btn>
        </div>
      </div>
    </div>
  );

  /* ── Step 4 : Nationality & Document ── */
  if(step===4) return (
    <div style={wrap}>
      <PageHeader onBack={()=>setStep(3)}/><ProgressBar step={step} label={ui.stepOf.replace("{n}", String((step as number)-1))}/>
      <div style={{flex:1,paddingTop:20}}>
        <h1 style={{color:"white",fontWeight:800,fontSize:"1.5rem",marginBottom:20}}>{ui.step4Title}</h1>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <FSelectT label={ui.nationalityLabel} value={nationalite} onChange={setNationalite} canonicalOptions={PAYS} displayOptions={ui.pays} placeholder={ui.selectPlaceholder}/>
          <FSelectT label={ui.docTypeLabel} value={typeDoc} onChange={setTypeDoc} canonicalOptions={DOCS} displayOptions={ui.docs} placeholder={ui.selectPlaceholder}/>
          <FInput label={ui.authorityLabel} placeholder={ui.authorityPlaceholder} value={autorite} onChange={setAutorite}/>
          {error&&<p style={{color:"#FF6B6B",fontSize:"0.85rem"}}>{error}</p>}
          <Btn onClick={()=>{if(!nationalite||!typeDoc||!autorite){setError(ui.errorAllRequired);return;}save(4);}} loading={loading} loadingText={ui.loading}>
            {ui.next} <ArrowRight size={18}/>
          </Btn>
        </div>
      </div>
    </div>
  );

  /* ── Step 5 : Professional Situation & Address ── */
  if(step===5) return (
    <div style={wrap}>
      <PageHeader onBack={()=>setStep(4)}/><ProgressBar step={step} label={ui.stepOf.replace("{n}", String((step as number)-1))}/>
      <div style={{flex:1,paddingTop:20}}>
        <h1 style={{color:"white",fontWeight:800,fontSize:"1.5rem",marginBottom:20}}>{ui.step5Title}</h1>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <FSelectT label={ui.currentSitLabel} value={situationPro} onChange={setSituationPro} canonicalOptions={SITUATIONS_PRO} displayOptions={ui.situations} placeholder={ui.selectPlaceholder}/>
          {employeurLabel&&(
            <FInput label={employeurLabel} placeholder={ui.employerPlaceholder} value={nomEmployeur} onChange={setNomEmployeur}/>
          )}
          <FSelectT label={ui.incomeLabel} value={revenuMensuel} onChange={setRevenuMensuel} canonicalOptions={REVENUS} displayOptions={ui.revenues} placeholder={ui.selectPlaceholder}/>
          <div style={{height:1,background:"rgba(255,255,255,0.07)",margin:"4px 0"}}/>
          <p style={{color:"rgba(255,255,255,0.5)",fontSize:"0.82rem",margin:0}}>{ui.addressTitle}</p>
          <FInput label={ui.streetLabel} placeholder={ui.streetPlaceholder} value={adresse} onChange={setAdresse}/>
          <div style={{display:"grid",gridTemplateColumns:"100px 1fr",gap:12}}>
            <FInput label={ui.postalLabel} placeholder={ui.postalPlaceholder} value={codePostal} onChange={setCodePostal}/>
            <FInput label={ui.cityLabel} placeholder={ui.cityPlaceholder} value={ville} onChange={setVille}/>
          </div>
          {error&&<p style={{color:"#FF6B6B",fontSize:"0.85rem"}}>{error}</p>}
          <Btn onClick={()=>{if(!situationPro||!revenuMensuel||!adresse||!codePostal||!ville||(employeurLabel&&!nomEmployeur)){setError(ui.errorFillAll);return;}save(5);}} loading={loading} loadingText={ui.loading}>
            {ui.next} <ArrowRight size={18}/>
          </Btn>
        </div>
      </div>
    </div>
  );

  /* ── Step 6 : Financial Situation ── */
  if(step===6) return (
    <div style={wrap}>
      <PageHeader onBack={()=>setStep(5)}/><ProgressBar step={step} label={ui.stepOf.replace("{n}", String((step as number)-1))}/>
      <div style={{flex:1,paddingTop:20}}>
        <h1 style={{color:"white",fontWeight:800,fontSize:"1.5rem",marginBottom:6}}>{ui.step6Title}</h1>
        <p style={{color:"rgba(255,255,255,0.4)",fontSize:"0.82rem",marginBottom:24}}>{ui.step6Subtitle}</p>
        <div style={{display:"flex",flexDirection:"column",gap:20}}>

          <div>
            <p style={{color:"rgba(255,255,255,0.6)",fontSize:"0.85rem",fontWeight:500,marginBottom:12}}>{ui.creditsQuestion}</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {([{label:ui.yes,val:true},{label:ui.no,val:false}] as const).map(({label,val})=>(
                <button key={String(val)} type="button" onClick={()=>{setACredits(val);if(!val)setCredits([]);}}
                  style={{height:52,borderRadius:14,border:`2px solid ${aCredits===val?"#005F2D":"rgba(255,255,255,0.1)"}`,background:aCredits===val?"rgba(0,95,45,0.2)":"#2A2A35",color:"white",fontWeight:aCredits===val?700:400,fontSize:"0.95rem",cursor:"pointer"}}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {aCredits===true&&(
            <div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
                <p style={{color:"rgba(255,255,255,0.6)",fontSize:"0.85rem",fontWeight:500,margin:0}}>{ui.creditsTitle}</p>
                {credits.length<5&&(
                  <button type="button" onClick={addCredit}
                    style={{display:"flex",alignItems:"center",gap:6,background:"rgba(0,95,45,0.2)",border:"1px solid rgba(0,95,45,0.4)",borderRadius:10,padding:"6px 12px",color:"#4CAF82",fontSize:"0.8rem",fontWeight:600,cursor:"pointer"}}>
                    <Plus size={13}/> {ui.add}
                  </button>
                )}
              </div>

              {credits.length===0&&(
                <button type="button" onClick={addCredit}
                  style={{width:"100%",height:48,background:"#2A2A35",border:"1px dashed rgba(255,255,255,0.15)",borderRadius:14,color:"rgba(255,255,255,0.35)",fontSize:"0.85rem",cursor:"pointer"}}>
                  {ui.addCreditBtn}
                </button>
              )}

              {credits.map((c,i)=>(
                <div key={i} style={{background:"#2A2A35",borderRadius:14,padding:14,marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                    <span style={{color:"rgba(255,255,255,0.5)",fontSize:"0.8rem"}}>{ui.creditN.replace("{n}", String(i+1))}</span>
                    <button type="button" onClick={()=>removeCredit(i)} style={{background:"none",border:"none",color:"rgba(255,100,100,0.7)",cursor:"pointer"}}><Trash2 size={15}/></button>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:10}}>
                    <FInput label={ui.bankLabel} placeholder={ui.bankPlaceholder} value={c.nom_banque} onChange={(v)=>updateCredit(i,"nom_banque",v)}/>
                    <FInput label={ui.creditAmountLabel} placeholder={ui.creditAmountPlaceholder} value={c.montant} onChange={(v)=>updateCredit(i,"montant",v)}/>
                  </div>
                </div>
              ))}
            </div>
          )}

          {error&&<p style={{color:"#FF6B6B",fontSize:"0.85rem"}}>{error}</p>}
          <Btn onClick={()=>{if(aCredits===null){setError(ui.errorAnswerQuestion);return;}save(6);}} loading={loading} loadingText={ui.loading}>
            {ui.next} <ArrowRight size={18}/>
          </Btn>
        </div>
      </div>
    </div>
  );

  /* ── Step 7 : Family Situation ── */
  if(step===7) return (
    <div style={wrap}>
      <PageHeader onBack={()=>setStep(6)}/><ProgressBar step={step} label={ui.stepOf.replace("{n}", String((step as number)-1))}/>
      <div style={{flex:1,paddingTop:20}}>
        <h1 style={{color:"white",fontWeight:800,fontSize:"1.5rem",marginBottom:6}}>{ui.step7Title}</h1>
        <p style={{color:"rgba(255,255,255,0.4)",fontSize:"0.82rem",marginBottom:20}}>{ui.step7Subtitle}</p>
        <div style={{display:"flex",flexDirection:"column",gap:20}}>
          <FNumber label={ui.childrenLabel} value={nbEnfants} onChange={setNbEnfants} max={15}/>
          <FNumber label={ui.dependentsLabel} value={personnesCharge} onChange={setPersonnesCharge} max={20}/>

          <div style={{height:1,background:"rgba(255,255,255,0.07)"}}/>

          <div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
              <div>
                <p style={{color:"white",fontWeight:600,fontSize:"0.95rem",margin:0}}>{ui.beneficiariesTitle}</p>
                <p style={{color:"rgba(255,255,255,0.4)",fontSize:"0.78rem",margin:"4px 0 0"}}>{ui.beneficiariesSubtitle}</p>
              </div>
              {ayantsDroit.length<4&&(
                <button type="button" onClick={addAyantDroit}
                  style={{display:"flex",alignItems:"center",gap:6,background:"rgba(0,95,45,0.2)",border:"1px solid rgba(0,95,45,0.4)",borderRadius:10,padding:"8px 14px",color:"#4CAF82",fontSize:"0.82rem",fontWeight:600,cursor:"pointer"}}>
                  <Plus size={14}/> {ui.add}
                </button>
              )}
            </div>
            {ayantsDroit.length===0&&(
              <div style={{background:"#2A2A35",borderRadius:14,padding:16,textAlign:"center"}}>
                <p style={{color:"rgba(255,255,255,0.3)",fontSize:"0.85rem",margin:0}}>{ui.noBeneficiaries}</p>
              </div>
            )}
            {ayantsDroit.map((ad,i)=>(
              <div key={i} style={{background:"#2A2A35",borderRadius:14,padding:16,marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                  <span style={{color:"rgba(255,255,255,0.6)",fontSize:"0.82rem",fontWeight:600}}>{ui.beneficiaryN.replace("{n}", String(i+1))}</span>
                  <button type="button" onClick={()=>removeAyantDroit(i)} style={{background:"none",border:"none",color:"rgba(255,100,100,0.7)",cursor:"pointer"}}><Trash2 size={16}/></button>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                    <FInput label={ui.firstNameLabel} placeholder="Sarah" value={ad.prenom} onChange={(v)=>updateAyantDroit(i,"prenom",v)}/>
                    <FInput label={ui.lastNameLabel} placeholder="Müller" value={ad.nom} onChange={(v)=>updateAyantDroit(i,"nom",v)}/>
                  </div>
                  <FSelectT label={ui.relationshipLabel} value={ad.lien} onChange={(v)=>updateAyantDroit(i,"lien",v)} canonicalOptions={LIENS} displayOptions={ui.links} placeholder={ui.selectPlaceholder}/>
                  <FInput label={ui.dobLabel} type="date" value={ad.date_naissance} onChange={(v)=>updateAyantDroit(i,"date_naissance",v)}/>
                </div>
              </div>
            ))}
          </div>

          {error&&<p style={{color:"#FF6B6B",fontSize:"0.85rem"}}>{error}</p>}
          <Btn onClick={()=>save(7)} loading={loading} loadingText={ui.loading}>{ui.next} <ArrowRight size={18}/></Btn>
        </div>
      </div>
    </div>
  );

  /* ── Step 8 : Contact Details ── */
  if(step===8) return (
    <div style={wrap}>
      <PageHeader onBack={()=>setStep(7)}/><ProgressBar step={step} label={ui.stepOf.replace("{n}", String((step as number)-1))}/>
      <div style={{flex:1,paddingTop:20}}>
        <h1 style={{color:"white",fontWeight:800,fontSize:"1.5rem",marginBottom:6}}>{ui.step8Title}</h1>
        <p style={{color:"rgba(255,255,255,0.4)",fontSize:"0.82rem",marginBottom:20}}>{ui.step8Subtitle}</p>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            <label style={{color:"rgba(255,255,255,0.6)",fontSize:"0.8rem",fontWeight:500}}>{ui.emailLabel}</label>
            <div style={{height:52,background:"#1E1E28",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,color:"rgba(255,255,255,0.4)",fontSize:"1rem",padding:"0 16px",display:"flex",alignItems:"center"}}>{email}</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            <label style={{color:"rgba(255,255,255,0.6)",fontSize:"0.8rem",fontWeight:500}}>{ui.phoneLabel}</label>
            <input type="tel" placeholder="+49 152 345 6789" value={phone} onChange={(e)=>setPhone(e.target.value)}
              style={{width:"100%",height:52,background:"#2A2A35",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,color:"white",fontSize:"1rem",padding:"0 16px",boxSizing:"border-box",outline:"none"}}/>
          </div>
          <div style={{background:"rgba(0,95,45,0.1)",border:"1px solid rgba(0,95,45,0.25)",borderRadius:14,padding:16}}>
            <p style={{color:"rgba(255,255,255,0.6)",fontSize:"0.8rem",margin:0,lineHeight:1.6}}>
              {ui.accountNote.split("KT Bank").map((part, idx, arr) =>
                idx < arr.length - 1
                  ? <span key={idx}>{part}<strong style={{color:"white"}}>KT Bank</strong></span>
                  : <span key={idx}>{part}</span>
              )}
            </p>
          </div>
          {error&&<p style={{color:"#FF6B6B",fontSize:"0.85rem"}}>{error}</p>}
          <Btn onClick={()=>{if(!phone){setError(ui.errorPhone);return;}save(8);}} loading={loading} loadingText={ui.loading}>
            {ui.submitBtn} <ArrowRight size={18}/>
          </Btn>
        </div>
      </div>
    </div>
  );

  /* ── Done ── */
  return (
    <div style={wrap}>
      <PageHeader/>
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",gap:20}}>
        <div style={{width:80,height:80,borderRadius:"50%",background:"rgba(0,95,45,0.2)",border:"2px solid #005F2D",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Check size={36} color="#005F2D"/>
        </div>
        <div>
          <h1 style={{color:"white",fontWeight:800,fontSize:"1.75rem",marginBottom:10}}>{ui.doneTitle}</h1>
          <p style={{color:"rgba(255,255,255,0.55)",fontSize:"0.95rem",lineHeight:1.7}}>
            {ui.doneSubtitle}
          </p>
          {iban&&(
            <div style={{background:"#2A2A35",borderRadius:16,padding:"16px 20px",marginTop:16,textAlign:"left"}}>
              <p style={{color:"rgba(255,255,255,0.5)",fontSize:"0.75rem",marginBottom:4}}>{ui.ibanLabel}</p>
              <p style={{color:"white",fontFamily:"monospace",fontSize:"0.9rem",letterSpacing:"0.05em",wordBreak:"break-all"}}>{iban}</p>
              <p style={{color:"rgba(255,255,255,0.4)",fontSize:"0.75rem",marginTop:4}}>BIC: KTAGDEFF</p>
            </div>
          )}
        </div>
        <Link href="/client/dashboard" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,width:"100%",maxWidth:340,height:54,borderRadius:999,background:"#005F2D",color:"white",fontWeight:700,textDecoration:"none"}}>
          {ui.goToDashboard} <ArrowRight size={18}/>
        </Link>
        <Link href="/" style={{color:"rgba(255,255,255,0.4)",fontSize:"0.85rem",textDecoration:"none"}}>
          {ui.backHome}
        </Link>
      </div>
    </div>
  );
}
