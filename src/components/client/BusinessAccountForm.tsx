"use client";

import { useState, type CSSProperties } from "react";
import { Building2, CheckCircle2, AlertCircle } from "lucide-react";

/* ─────────────────────────  i18n  ───────────────────────── */

type Lang = "de" | "fr" | "en" | "ar" | "tr" | "es" | "it" | "pt" | "nl";

type Strings = Record<Lang, string>;

/** Pick the localized string for `lang`, falling back to German. */
function tr(lang: string, s: Strings): string {
  return s[(lang as Lang)] ?? s.de;
}

const T = {
  heading: (l: string) =>
    tr(l, {
      de: "Geschäftskonto eröffnen",
      fr: "Ouvrir un compte entreprise",
      en: "Open a business account",
      ar: "فتح حساب تجاري",
      tr: "Kurumsal hesap açın",
      es: "Abrir una cuenta de empresa",
      it: "Apri un conto aziendale",
      pt: "Abrir uma conta empresarial",
      nl: "Een zakelijke rekening openen",
    }),
  intro: (l: string) =>
    tr(l, {
      de: "Das Konto wird erst aktiv, nachdem die Bank Ihren Antrag geprüft und freigegeben hat.",
      fr: "Le compte ne devient actif qu'après validation de votre demande par la banque.",
      en: "The account becomes active only after the bank validates your request.",
      ar: "لا يصبح الحساب نشطًا إلا بعد أن تتحقق البنك من طلبك وتوافق عليه.",
      tr: "Hesap, yalnızca banka talebinizi doğrulayıp onayladıktan sonra etkinleşir.",
      es: "La cuenta solo se activa después de que el banco valide su solicitud.",
      it: "Il conto diventa attivo solo dopo che la banca ha convalidato la richiesta.",
      pt: "A conta só fica ativa depois de o banco validar o seu pedido.",
      nl: "De rekening wordt pas actief nadat de bank uw aanvraag heeft gevalideerd.",
    }),
  companyName: (l: string) =>
    tr(l, {
      de: "Firmenname",
      fr: "Nom de l'entreprise",
      en: "Company name",
      ar: "اسم الشركة",
      tr: "Şirket adı",
      es: "Nombre de la empresa",
      it: "Nome dell'azienda",
      pt: "Nome da empresa",
      nl: "Bedrijfsnaam",
    }),
  legalForm: (l: string) =>
    tr(l, {
      de: "Rechtsform",
      fr: "Forme juridique",
      en: "Legal form",
      ar: "الشكل القانوني",
      tr: "Hukuki şekil",
      es: "Forma jurídica",
      it: "Forma giuridica",
      pt: "Forma jurídica",
      nl: "Rechtsvorm",
    }),
  registrationNumber: (l: string) =>
    tr(l, {
      de: "Handelsregisternummer (HRB)",
      fr: "Numéro d'immatriculation (RCS/HRB)",
      en: "Registration number (RCS/HRB)",
      ar: "رقم التسجيل التجاري (RCS/HRB)",
      tr: "Ticaret sicil numarası (RCS/HRB)",
      es: "Número de registro (RCS/HRB)",
      it: "Numero di registrazione (RCS/HRB)",
      pt: "Número de registo (RCS/HRB)",
      nl: "Registratienummer (RCS/HRB)",
    }),
  vatNumber: (l: string) =>
    tr(l, {
      de: "Umsatzsteuer-Identifikationsnummer",
      fr: "Numéro de TVA",
      en: "VAT number",
      ar: "رقم ضريبة القيمة المضافة",
      tr: "KDV numarası",
      es: "Número de IVA",
      it: "Partita IVA",
      pt: "Número de IVA",
      nl: "Btw-nummer",
    }),
  activity: (l: string) =>
    tr(l, {
      de: "Tätigkeitsbereich",
      fr: "Secteur d'activité",
      en: "Business sector",
      ar: "قطاع النشاط",
      tr: "Faaliyet alanı",
      es: "Sector de actividad",
      it: "Settore di attività",
      pt: "Setor de atividade",
      nl: "Activiteitensector",
    }),
  address: (l: string) =>
    tr(l, {
      de: "Adresse",
      fr: "Adresse",
      en: "Address",
      ar: "العنوان",
      tr: "Adres",
      es: "Dirección",
      it: "Indirizzo",
      pt: "Endereço",
      nl: "Adres",
    }),
  postalCode: (l: string) =>
    tr(l, {
      de: "Postleitzahl",
      fr: "Code postal",
      en: "Postal code",
      ar: "الرمز البريدي",
      tr: "Posta kodu",
      es: "Código postal",
      it: "Codice postale",
      pt: "Código postal",
      nl: "Postcode",
    }),
  city: (l: string) =>
    tr(l, {
      de: "Stadt",
      fr: "Ville",
      en: "City",
      ar: "المدينة",
      tr: "Şehir",
      es: "Ciudad",
      it: "Città",
      pt: "Cidade",
      nl: "Stad",
    }),
  country: (l: string) =>
    tr(l, {
      de: "Land",
      fr: "Pays",
      en: "Country",
      ar: "البلد",
      tr: "Ülke",
      es: "País",
      it: "Paese",
      pt: "País",
      nl: "Land",
    }),
  legalFormPlaceholder: (l: string) =>
    tr(l, {
      de: "z. B. GmbH, SARL, SAS…",
      fr: "p. ex. GmbH, SARL, SAS…",
      en: "e.g. GmbH, SARL, SAS…",
      ar: "مثال: GmbH، SARL، SAS…",
      tr: "örn. GmbH, SARL, SAS…",
      es: "p. ej. GmbH, SARL, SAS…",
      it: "es. GmbH, SARL, SAS…",
      pt: "ex. GmbH, SARL, SAS…",
      nl: "bijv. GmbH, SARL, SAS…",
    }),
  submit: (l: string) =>
    tr(l, {
      de: "Antrag einreichen",
      fr: "Soumettre la demande",
      en: "Submit the request",
      ar: "إرسال الطلب",
      tr: "Talebi gönder",
      es: "Enviar la solicitud",
      it: "Invia la richiesta",
      pt: "Enviar o pedido",
      nl: "Aanvraag indienen",
    }),
  sending: (l: string) =>
    tr(l, {
      de: "Wird gesendet…",
      fr: "Envoi…",
      en: "Sending…",
      ar: "جارٍ الإرسال…",
      tr: "Gönderiliyor…",
      es: "Enviando…",
      it: "Invio in corso…",
      pt: "A enviar…",
      nl: "Verzenden…",
    }),
  validation: (l: string) =>
    tr(l, {
      de: "Bitte geben Sie den Firmennamen und den Tätigkeitsbereich an.",
      fr: "Veuillez renseigner le nom de l'entreprise et le secteur d'activité.",
      en: "Please provide the company name and the business sector.",
      ar: "يرجى إدخال اسم الشركة وقطاع النشاط.",
      tr: "Lütfen şirket adını ve faaliyet alanını girin.",
      es: "Indique el nombre de la empresa y el sector de actividad.",
      it: "Inserisci il nome dell'azienda e il settore di attività.",
      pt: "Indique o nome da empresa e o setor de atividade.",
      nl: "Vul de bedrijfsnaam en de activiteitensector in.",
    }),
  kycRequired: (l: string) =>
    tr(l, {
      de: "Ihr KYC muss freigegeben sein, bevor Sie ein Geschäftskonto eröffnen können.",
      fr: "Votre KYC doit être validé avant d'ouvrir un compte entreprise.",
      en: "Your KYC must be approved before you can open a business account.",
      ar: "يجب اعتماد إجراءات اعرف عميلك (KYC) قبل أن تتمكن من فتح حساب تجاري.",
      tr: "Kurumsal hesap açabilmeniz için KYC'nizin onaylanmış olması gerekir.",
      es: "Su KYC debe estar validado antes de poder abrir una cuenta de empresa.",
      it: "Il tuo KYC deve essere approvato prima di poter aprire un conto aziendale.",
      pt: "O seu KYC deve estar validado antes de poder abrir uma conta empresarial.",
      nl: "Uw KYC moet zijn goedgekeurd voordat u een zakelijke rekening kunt openen.",
    }),
  alreadyPending: (l: string) =>
    tr(l, {
      de: "Sie haben bereits einen ausstehenden Geschäftskontoantrag.",
      fr: "Vous avez déjà une demande de compte entreprise en attente.",
      en: "You already have a pending business account request.",
      ar: "لديك بالفعل طلب حساب تجاري قيد الانتظار.",
      tr: "Zaten beklemede olan bir kurumsal hesap talebiniz var.",
      es: "Ya tiene una solicitud de cuenta de empresa pendiente.",
      it: "Hai già una richiesta di conto aziendale in sospeso.",
      pt: "Já tem um pedido de conta empresarial pendente.",
      nl: "U heeft al een openstaande aanvraag voor een zakelijke rekening.",
    }),
  genericError: (l: string) =>
    tr(l, {
      de: "Der Antrag konnte nicht gesendet werden. Bitte versuchen Sie es erneut.",
      fr: "Impossible d'envoyer la demande. Veuillez réessayer.",
      en: "The request could not be sent. Please try again.",
      ar: "تعذّر إرسال الطلب. يرجى المحاولة مرة أخرى.",
      tr: "Talep gönderilemedi. Lütfen tekrar deneyin.",
      es: "No se pudo enviar la solicitud. Inténtelo de nuevo.",
      it: "Impossibile inviare la richiesta. Riprova.",
      pt: "Não foi possível enviar o pedido. Tente novamente.",
      nl: "De aanvraag kon niet worden verzonden. Probeer het opnieuw.",
    }),
  successTitle: (l: string) =>
    tr(l, {
      de: "Antrag gesendet",
      fr: "Demande envoyée",
      en: "Request sent",
      ar: "تم إرسال الطلب",
      tr: "Talep gönderildi",
      es: "Solicitud enviada",
      it: "Richiesta inviata",
      pt: "Pedido enviado",
      nl: "Aanvraag verzonden",
    }),
  successBody: (l: string) =>
    tr(l, {
      de: "Ihr Antrag auf ein Geschäftskonto wurde übermittelt. Die Bank wird ihn in Kürze prüfen und Sie erhalten eine Benachrichtigung.",
      fr: "Votre demande de compte entreprise a été transmise. La banque la validera sous peu et vous recevrez une notification.",
      en: "Your business account request has been submitted. The bank will validate it shortly and you will receive a notification.",
      ar: "تم إرسال طلب حسابك التجاري. ستتحقق منه البنك قريبًا وستتلقى إشعارًا.",
      tr: "Kurumsal hesap talebiniz iletildi. Banka kısa süre içinde onaylayacak ve bir bildirim alacaksınız.",
      es: "Su solicitud de cuenta de empresa se ha enviado. El banco la validará en breve y recibirá una notificación.",
      it: "La tua richiesta di conto aziendale è stata inviata. La banca la convaliderà a breve e riceverai una notifica.",
      pt: "O seu pedido de conta empresarial foi enviado. O banco irá validá-lo em breve e receberá uma notificação.",
      nl: "Uw aanvraag voor een zakelijke rekening is verzonden. De bank valideert deze binnenkort en u ontvangt een melding.",
    }),
};

/* ─────────────────────────  Component  ───────────────────────── */

interface BusinessAccountFormProps {
  token: string;
  lang: string;
  onCreated?: () => void;
}

interface FormState {
  company_name: string;
  legal_form: string;
  registration_number: string;
  vat_number: string;
  activity: string;
  address: string;
  postal_code: string;
  city: string;
  country: string;
}

const EMPTY_FORM: FormState = {
  company_name: "",
  legal_form: "",
  registration_number: "",
  vat_number: "",
  activity: "",
  address: "",
  postal_code: "",
  city: "",
  country: "",
};

const GREEN = "#005F2D";
const GOLD = "#C9A84C";

export default function BusinessAccountForm({ token, lang, onCreated }: BusinessAccountFormProps) {
  const rtl = lang === "ar";
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.company_name.trim() || !form.activity.trim()) {
      setError(T.validation(lang));
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/kt/client/accounts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...form, label: form.company_name }),
      });

      if (res.ok) {
        setSuccess(true);
        onCreated?.();
        return;
      }

      const data = (await res.json().catch(() => ({}))) as { code?: string; error?: string };
      if (data.code === "KYC_REQUIRED") setError(T.kycRequired(lang));
      else if (data.code === "ALREADY_PENDING") setError(T.alreadyPending(lang));
      else setError(data.error || T.genericError(lang));
    } catch {
      setError(T.genericError(lang));
    } finally {
      setSubmitting(false);
    }
  }

  const card: CSSProperties = {
    background: "#FFFFFF",
    borderRadius: 16,
    border: "1px solid #E5E7EB",
    boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)",
    padding: "clamp(20px, 4vw, 32px)",
    maxWidth: 720,
    width: "100%",
    boxSizing: "border-box",
    direction: rtl ? "rtl" : "ltr",
    textAlign: rtl ? "right" : "left",
  };

  const labelStyle: CSSProperties = {
    display: "block",
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "#374151",
    marginBottom: 6,
  };

  const inputStyle: CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #D1D5DB",
    fontSize: "0.92rem",
    color: "#111827",
    background: "#FFFFFF",
    outline: "none",
  };

  if (success) {
    return (
      <div style={card}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "16px 0", gap: 12 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "#ECFDF3",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CheckCircle2 size={36} color={GREEN} strokeWidth={2.2} />
          </div>
          <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700, color: GREEN }}>{T.successTitle(lang)}</h2>
          <p style={{ margin: 0, fontSize: "0.92rem", color: "#4B5563", maxWidth: 440, lineHeight: 1.55 }}>
            {T.successBody(lang)}
          </p>
        </div>
      </div>
    );
  }

  const fields: { key: keyof FormState; label: string; required?: boolean; placeholder?: string }[] = [
    { key: "company_name", label: T.companyName(lang), required: true },
    { key: "legal_form", label: T.legalForm(lang), placeholder: T.legalFormPlaceholder(lang) },
    { key: "registration_number", label: T.registrationNumber(lang) },
    { key: "vat_number", label: T.vatNumber(lang) },
    { key: "activity", label: T.activity(lang), required: true },
    { key: "address", label: T.address(lang) },
    { key: "postal_code", label: T.postalCode(lang) },
    { key: "city", label: T.city(lang) },
    { key: "country", label: T.country(lang) },
  ];

  return (
    <div style={card}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: "#ECFDF3",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Building2 size={22} color={GREEN} />
        </div>
        <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700, color: "#111827" }}>{T.heading(lang)}</h2>
      </div>
      <p style={{ margin: "0 0 20px", fontSize: "0.88rem", color: "#6B7280", lineHeight: 1.55 }}>{T.intro(lang)}</p>

      <form onSubmit={handleSubmit} noValidate>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          {fields.map((f) => (
            <div key={f.key}>
              <label htmlFor={`ba-${f.key}`} style={labelStyle}>
                {f.label}
                {f.required && <span style={{ color: GOLD, marginInlineStart: 4 }}>*</span>}
              </label>
              <input
                id={`ba-${f.key}`}
                type="text"
                value={form[f.key]}
                onChange={set(f.key)}
                placeholder={f.placeholder}
                style={inputStyle}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = GREEN;
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,95,45,0.12)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#D1D5DB";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>
          ))}
        </div>

        {error && (
          <div
            role="alert"
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
              marginTop: 18,
              padding: "10px 14px",
              borderRadius: 10,
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              color: "#B91C1C",
              fontSize: "0.86rem",
              lineHeight: 1.45,
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          style={{
            marginTop: 22,
            width: "100%",
            padding: "13px 20px",
            borderRadius: 12,
            border: "none",
            background: submitting ? "#3E8C63" : GREEN,
            color: "#FFFFFF",
            fontSize: "0.95rem",
            fontWeight: 700,
            cursor: submitting ? "default" : "pointer",
            transition: "background 0.15s",
          }}
        >
          {submitting ? T.sending(lang) : T.submit(lang)}
        </button>
      </form>
    </div>
  );
}
