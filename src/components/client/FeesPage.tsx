"use client";
import { useEffect, useState, useCallback } from "react";
import QRCode from "qrcode";
import {
  Check,
  Copy,
  Receipt,
  Building2,
  Wallet,
  AlertCircle,
  Clock,
  Upload,
  FileText,
  ShieldCheck,
} from "lucide-react";

/* ─────────────────────────  Types  ───────────────────────── */

type Lang = "de" | "fr" | "en" | "ar" | "tr" | "es" | "it" | "pt" | "nl";

type InvoiceStatus = "pending" | "proof_submitted" | "paid" | "cancelled";

type Invoice = {
  id: string;
  title: string | null;
  description: string | null;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  proof_url: string | null;
  created_at: string;
};

type CryptoWallet = {
  coin: string;
  label: string;
  network: string;
  address: string;
  qr_url?: string | null;
};

type Sepa = {
  name?: string;
  iban?: string;
  bic?: string;
  bank?: string;
  reference?: string;
};

type FeesResponse = {
  invoices: Invoice[];
  crypto_wallets: CryptoWallet[];
  sepa: Sepa | null;
};

type Method = "sepa" | "crypto";

/* ─────────────────────────  i18n  ───────────────────────── */

function tr(
  lang: string,
  variants: Partial<Record<Lang, string>> & { de: string },
): string {
  return variants[lang as Lang] ?? variants.de;
}

const LOCALE_MAP: Record<Lang, string> = {
  de: "de-DE",
  fr: "fr-FR",
  en: "en-GB",
  ar: "ar-SA",
  tr: "tr-TR",
  es: "es-ES",
  it: "it-IT",
  pt: "pt-PT",
  nl: "nl-NL",
};

const T = {
  heading: (l: string) =>
    tr(l, {
      de: "Gebühren begleichen",
      fr: "Règlement de frais",
      en: "Settle fees",
      ar: "تسوية الرسوم",
      tr: "Ücretleri öde",
      es: "Liquidación de tasas",
      it: "Saldo delle commissioni",
      pt: "Regularização de taxas",
      nl: "Kosten voldoen",
    }),
  subtitle: (l: string) =>
    tr(l, {
      de: "Begleichen Sie offene Gebühren sicher per SEPA-Überweisung oder Krypto und laden Sie Ihren Zahlungsnachweis hoch.",
      fr: "Réglez vos frais en toute sécurité par virement SEPA ou en crypto, puis téléchargez votre justificatif de paiement.",
      en: "Settle outstanding fees securely by SEPA transfer or crypto, then upload your proof of payment.",
      ar: "سدِّد الرسوم المستحقة بأمان عبر تحويل SEPA أو العملات المشفّرة، ثم قم بتحميل إثبات الدفع.",
      tr: "Açık ücretleri SEPA havalesi veya kripto ile güvenle ödeyin ve ödeme kanıtınızı yükleyin.",
      es: "Liquide las tasas pendientes de forma segura mediante transferencia SEPA o cripto y suba su comprobante de pago.",
      it: "Salda le commissioni in sospeso in modo sicuro tramite bonifico SEPA o cripto e carica la ricevuta di pagamento.",
      pt: "Regularize as taxas em aberto com segurança por transferência SEPA ou cripto e carregue o seu comprovativo de pagamento.",
      nl: "Voldoe openstaande kosten veilig via SEPA-overschrijving of crypto en upload uw betalingsbewijs.",
    }),
  empty: (l: string) =>
    tr(l, {
      de: "Keine Gebühren zu begleichen",
      fr: "Aucun frais à régler",
      en: "No fees to settle",
      ar: "لا توجد رسوم للتسوية",
      tr: "Ödenecek ücret yok",
      es: "No hay tasas que liquidar",
      it: "Nessuna commissione da saldare",
      pt: "Nenhuma taxa a regularizar",
      nl: "Geen kosten te voldoen",
    }),
  emptySub: (l: string) =>
    tr(l, {
      de: "Sobald eine Gebühr anfällt, erscheint sie hier.",
      fr: "Dès qu'un frais sera émis, il apparaîtra ici.",
      en: "As soon as a fee is issued, it will appear here.",
      ar: "بمجرد إصدار أي رسوم، ستظهر هنا.",
      tr: "Bir ücret oluştuğunda burada görünecektir.",
      es: "En cuanto se emita una tasa, aparecerá aquí.",
      it: "Non appena verrà emessa una commissione, apparirà qui.",
      pt: "Assim que uma taxa for emitida, aparecerá aqui.",
      nl: "Zodra er kosten worden uitgegeven, verschijnen ze hier.",
    }),
  defaultTitle: (l: string) =>
    tr(l, {
      de: "Gebühr",
      fr: "Frais",
      en: "Fee",
      ar: "رسوم",
      tr: "Ücret",
      es: "Tasa",
      it: "Commissione",
      pt: "Taxa",
      nl: "Kosten",
    }),
  statusPending: (l: string) =>
    tr(l, {
      de: "Zu begleichen",
      fr: "À régler",
      en: "To pay",
      ar: "مستحقة الدفع",
      tr: "Ödenecek",
      es: "Por pagar",
      it: "Da saldare",
      pt: "A pagar",
      nl: "Te voldoen",
    }),
  statusProof: (l: string) =>
    tr(l, {
      de: "Nachweis eingereicht / in Prüfung",
      fr: "Preuve envoyée / en vérification",
      en: "Proof submitted / under review",
      ar: "تم إرسال الإثبات / قيد المراجعة",
      tr: "Kanıt gönderildi / inceleniyor",
      es: "Comprobante enviado / en revisión",
      it: "Ricevuta inviata / in verifica",
      pt: "Comprovativo enviado / em verificação",
      nl: "Bewijs ingediend / in controle",
    }),
  statusPaid: (l: string) =>
    tr(l, {
      de: "Bezahlt",
      fr: "Payé",
      en: "Paid",
      ar: "مدفوعة",
      tr: "Ödendi",
      es: "Pagado",
      it: "Pagato",
      pt: "Pago",
      nl: "Betaald",
    }),
  statusCancelled: (l: string) =>
    tr(l, {
      de: "Storniert",
      fr: "Annulé",
      en: "Cancelled",
      ar: "ملغاة",
      tr: "İptal edildi",
      es: "Cancelado",
      it: "Annullato",
      pt: "Cancelado",
      nl: "Geannuleerd",
    }),
  paySepa: (l: string) =>
    tr(l, {
      de: "Per SEPA-Überweisung zahlen",
      fr: "Payer par virement SEPA",
      en: "Pay by SEPA transfer",
      ar: "الدفع عبر تحويل SEPA",
      tr: "SEPA havalesi ile öde",
      es: "Pagar por transferencia SEPA",
      it: "Paga con bonifico SEPA",
      pt: "Pagar por transferência SEPA",
      nl: "Betalen via SEPA-overschrijving",
    }),
  payCrypto: (l: string) =>
    tr(l, {
      de: "Mit Krypto zahlen",
      fr: "Payer en crypto",
      en: "Pay with crypto",
      ar: "الدفع بالعملات المشفّرة",
      tr: "Kripto ile öde",
      es: "Pagar con cripto",
      it: "Paga in cripto",
      pt: "Pagar com cripto",
      nl: "Betalen met crypto",
    }),
  beneficiary: (l: string) =>
    tr(l, {
      de: "Begünstigter",
      fr: "Bénéficiaire",
      en: "Beneficiary",
      ar: "المستفيد",
      tr: "Alıcı",
      es: "Beneficiario",
      it: "Beneficiario",
      pt: "Beneficiário",
      nl: "Begunstigde",
    }),
  iban: () => "IBAN",
  bic: () => "BIC",
  bank: (l: string) =>
    tr(l, {
      de: "Bank",
      fr: "Banque",
      en: "Bank",
      ar: "البنك",
      tr: "Banka",
      es: "Banco",
      it: "Banca",
      pt: "Banco",
      nl: "Bank",
    }),
  reference: (l: string) =>
    tr(l, {
      de: "Verwendungszweck",
      fr: "Référence",
      en: "Reference",
      ar: "المرجع",
      tr: "Açıklama",
      es: "Concepto",
      it: "Causale",
      pt: "Referência",
      nl: "Omschrijving",
    }),
  amount: (l: string) =>
    tr(l, {
      de: "Betrag",
      fr: "Montant",
      en: "Amount",
      ar: "المبلغ",
      tr: "Tutar",
      es: "Importe",
      it: "Importo",
      pt: "Montante",
      nl: "Bedrag",
    }),
  network: (l: string) =>
    tr(l, {
      de: "Netzwerk",
      fr: "Réseau",
      en: "Network",
      ar: "الشبكة",
      tr: "Ağ",
      es: "Red",
      it: "Rete",
      pt: "Rede",
      nl: "Netwerk",
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
  scanToPay: (l: string) =>
    tr(l, {
      de: "Zum Bezahlen scannen",
      fr: "Scanner pour payer",
      en: "Scan to pay",
      ar: "امسح للدفع",
      tr: "Ödemek için tarayın",
      es: "Escanear para pagar",
      it: "Scansiona per pagare",
      pt: "Digitalize para pagar",
      nl: "Scan om te betalen",
    }),
  copy: (l: string) =>
    tr(l, {
      de: "Kopieren",
      fr: "Copier",
      en: "Copy",
      ar: "نسخ",
      tr: "Kopyala",
      es: "Copiar",
      it: "Copia",
      pt: "Copiar",
      nl: "Kopiëren",
    }),
  copied: (l: string) =>
    tr(l, {
      de: "Kopiert",
      fr: "Copié",
      en: "Copied",
      ar: "تم النسخ",
      tr: "Kopyalandı",
      es: "Copiado",
      it: "Copiato",
      pt: "Copiado",
      nl: "Gekopieerd",
    }),
  refOptional: (l: string) =>
    tr(l, {
      de: "Referenz (optional)",
      fr: "Référence (optionnel)",
      en: "Reference (optional)",
      ar: "المرجع (اختياري)",
      tr: "Referans (isteğe bağlı)",
      es: "Referencia (opcional)",
      it: "Riferimento (facoltativo)",
      pt: "Referência (opcional)",
      nl: "Referentie (optioneel)",
    }),
  proofTitle: (l: string) =>
    tr(l, {
      de: "Zahlungsnachweis",
      fr: "Justificatif de paiement",
      en: "Proof of payment",
      ar: "إثبات الدفع",
      tr: "Ödeme kanıtı",
      es: "Comprobante de pago",
      it: "Ricevuta di pagamento",
      pt: "Comprovativo de pagamento",
      nl: "Betalingsbewijs",
    }),
  chooseFile: (l: string) =>
    tr(l, {
      de: "Datei auswählen",
      fr: "Choisir un fichier",
      en: "Choose a file",
      ar: "اختر ملفاً",
      tr: "Dosya seç",
      es: "Elegir un archivo",
      it: "Scegli un file",
      pt: "Escolher um ficheiro",
      nl: "Bestand kiezen",
    }),
  submitProof: (l: string) =>
    tr(l, {
      de: "Zahlungsnachweis einreichen",
      fr: "Soumettre la preuve de paiement",
      en: "Submit proof of payment",
      ar: "إرسال إثبات الدفع",
      tr: "Ödeme kanıtını gönder",
      es: "Enviar comprobante de pago",
      it: "Invia la ricevuta di pagamento",
      pt: "Submeter o comprovativo de pagamento",
      nl: "Betalingsbewijs indienen",
    }),
  sending: (l: string) =>
    tr(l, {
      de: "Wird gesendet…",
      fr: "Envoi…",
      en: "Sending…",
      ar: "جارٍ الإرسال…",
      tr: "Gönderiliyor…",
      es: "Enviando…",
      it: "Invio…",
      pt: "A enviar…",
      nl: "Verzenden…",
    }),
  instantNote: (l: string) =>
    tr(l, {
      de: "Wir empfehlen eine Echtzeitüberweisung (SEPA Instant), damit Ihre Zahlung sofort gutgeschrieben wird.",
      fr: "Nous recommandons un virement instantané (SEPA Instant) afin que votre paiement soit crédité immédiatement.",
      en: "We recommend an instant transfer (SEPA Instant) so your payment is credited immediately.",
      ar: "نوصي بإجراء تحويل فوري (SEPA Instant) ليتم إيداع دفعتك على الفور.",
      tr: "Ödemenizin anında hesaba geçmesi için anlık havale (SEPA Instant) öneririz.",
      es: "Recomendamos una transferencia instantánea (SEPA Instant) para que su pago se acredite de inmediato.",
      it: "Consigliamo un bonifico istantaneo (SEPA Instant) affinché il pagamento venga accreditato subito.",
      pt: "Recomendamos uma transferência instantânea (SEPA Instant) para que o seu pagamento seja creditado de imediato.",
      nl: "Wij raden een directe overschrijving (SEPA Instant) aan zodat uw betaling direct wordt bijgeschreven.",
    }),
  verifyNote: (l: string) =>
    tr(l, {
      de: "Ihr Nachweis wird derzeit geprüft. Die Bearbeitung erfolgt innerhalb von 48 Stunden.",
      fr: "Votre preuve est en cours de vérification. Le traitement se fait sous 48h.",
      en: "Your proof is being verified. Processing takes place within 48 hours.",
      ar: "يتم التحقق من إثباتك حالياً. تتم المعالجة خلال 48 ساعة.",
      tr: "Kanıtınız doğrulanıyor. İşlem 48 saat içinde gerçekleştirilir.",
      es: "Su comprobante está siendo verificado. El procesamiento se realiza en un plazo de 48 horas.",
      it: "La sua ricevuta è in fase di verifica. L'elaborazione avviene entro 48 ore.",
      pt: "O seu comprovativo está a ser verificado. O processamento ocorre no prazo de 48 horas.",
      nl: "Uw bewijs wordt geverifieerd. Verwerking vindt binnen 48 uur plaats.",
    }),
  loadError: (l: string) =>
    tr(l, {
      de: "Gebühren konnten nicht geladen werden.",
      fr: "Impossible de charger les frais.",
      en: "Could not load fees.",
      ar: "تعذّر تحميل الرسوم.",
      tr: "Ücretler yüklenemedi.",
      es: "No se pudieron cargar las tasas.",
      it: "Impossibile caricare le commissioni.",
      pt: "Não foi possível carregar as taxas.",
      nl: "Kosten konden niet worden geladen.",
    }),
  loading: (l: string) =>
    tr(l, {
      de: "Wird geladen…",
      fr: "Chargement…",
      en: "Loading…",
      ar: "جارٍ التحميل…",
      tr: "Yükleniyor…",
      es: "Cargando…",
      it: "Caricamento…",
      pt: "A carregar…",
      nl: "Laden…",
    }),
};

/* ─────────────────────────  Status badge meta  ───────────────────────── */

const STATUS_META: Record<
  InvoiceStatus,
  { bg: string; border: string; color: string; label: (l: string) => string }
> = {
  pending: {
    bg: "#FFFBEB",
    border: "#FCD34D",
    color: "#92400E",
    label: T.statusPending,
  },
  proof_submitted: {
    bg: "#EFF6FF",
    border: "#93C5FD",
    color: "#1E40AF",
    label: T.statusProof,
  },
  paid: {
    bg: "#F0FDF4",
    border: "#86EFAC",
    color: "#166534",
    label: T.statusPaid,
  },
  cancelled: {
    bg: "#F1F5F9",
    border: "#CBD5E1",
    color: "#475569",
    label: T.statusCancelled,
  },
};

/* ─────────────────────────  Copy row  ───────────────────────── */

function CopyRow({
  label,
  value,
  mono = false,
  lang,
}: {
  label: string;
  value: string;
  mono?: boolean;
  lang: string;
}) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard
      .writeText(value)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {});
  }
  return (
    <div style={{ marginBottom: 10 }}>
      <p
        style={{
          color: "#94A3B8",
          fontSize: "0.68rem",
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          margin: "0 0 4px",
          fontWeight: 700,
        }}
      >
        {label}
      </p>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "#F8FAFC",
          border: "1px solid #E2E8F0",
          borderRadius: 10,
          padding: "10px 12px",
        }}
      >
        <span
          style={{
            flex: 1,
            color: "#0F172A",
            fontFamily: mono ? "monospace" : "inherit",
            fontSize: "0.88rem",
            fontWeight: 600,
            wordBreak: "break-all",
            minWidth: 0,
          }}
        >
          {value}
        </span>
        <button
          type="button"
          onClick={copy}
          style={{
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            gap: 4,
            background: copied ? "rgba(0,95,45,0.1)" : "white",
            border: `1px solid ${copied ? "#86EFAC" : "#E2E8F0"}`,
            borderRadius: 8,
            padding: "6px 10px",
            color: copied ? "#166534" : "#64748B",
            fontSize: "0.72rem",
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.2s",
            whiteSpace: "nowrap",
          }}
        >
          {copied ? (
            <>
              <Check size={12} /> {T.copied(lang)}
            </>
          ) : (
            <>
              <Copy size={12} /> {T.copy(lang)}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────  Crypto QR  ───────────────────────── */

function CryptoQR({
  wallet,
  lang,
}: {
  wallet: CryptoWallet;
  lang: string;
}) {
  const [qr, setQr] = useState("");

  useEffect(() => {
    let active = true;
    if (wallet.qr_url) {
      setQr("");
      return;
    }
    QRCode.toDataURL(wallet.address, { width: 180, margin: 1 })
      .then((url) => {
        if (active) setQr(url);
      })
      .catch(() => {
        if (active) setQr("");
      });
    return () => {
      active = false;
    };
  }, [wallet]);

  const src = wallet.qr_url || qr;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        marginTop: 12,
      }}
    >
      <div
        style={{
          background: "white",
          border: "1px solid #E2E8F0",
          borderRadius: 14,
          padding: 12,
          width: 204,
          height: 204,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={`${wallet.label} QR`}
            width={180}
            height={180}
            style={{ display: "block", width: 180, height: 180 }}
          />
        ) : (
          <span style={{ color: "#94A3B8", fontSize: "0.78rem" }}>…</span>
        )}
      </div>
      <p
        style={{
          color: "#64748B",
          fontSize: "0.74rem",
          margin: 0,
          textAlign: "center",
        }}
      >
        {T.scanToPay(lang)}
      </p>
    </div>
  );
}

/* ─────────────────────────  Payment panel  ───────────────────────── */

function PaymentPanel({
  invoice,
  sepa,
  wallets,
  lang,
  locale,
  method,
  setMethod,
  selectedCoin,
  setSelectedCoin,
}: {
  invoice: Invoice;
  sepa: Sepa | null;
  wallets: CryptoWallet[];
  lang: string;
  locale: string;
  method: Method;
  setMethod: (m: Method) => void;
  selectedCoin: string;
  setSelectedCoin: (c: string) => void;
}) {
  const hasSepa = !!sepa;
  const hasCrypto = wallets.length > 0;
  const amountStr =
    invoice.amount.toLocaleString(locale, { minimumFractionDigits: 2 }) +
    " " +
    invoice.currency;

  const selectedWallet =
    wallets.find((w) => w.coin === selectedCoin) ?? wallets[0];

  const tabBtn = (active: boolean): React.CSSProperties => ({
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: "10px 12px",
    borderRadius: 10,
    border: `1px solid ${active ? "#005F2D" : "#E2E8F0"}`,
    background: active ? "#005F2D" : "white",
    color: active ? "white" : "#475569",
    fontSize: "0.82rem",
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.2s",
  });

  return (
    <div style={{ marginTop: 16 }}>
      {hasSepa && hasCrypto && (
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <button
            type="button"
            style={tabBtn(method === "sepa")}
            onClick={() => setMethod("sepa")}
          >
            <Building2 size={15} /> {T.paySepa(lang)}
          </button>
          <button
            type="button"
            style={tabBtn(method === "crypto")}
            onClick={() => setMethod("crypto")}
          >
            <Wallet size={15} /> {T.payCrypto(lang)}
          </button>
        </div>
      )}

      {method === "sepa" && hasSepa && sepa && (
        <div>
          {sepa.name && (
            <CopyRow label={T.beneficiary(lang)} value={sepa.name} lang={lang} />
          )}
          {sepa.iban && (
            <CopyRow label={T.iban()} value={sepa.iban} mono lang={lang} />
          )}
          {sepa.bic && (
            <CopyRow label={T.bic()} value={sepa.bic} mono lang={lang} />
          )}
          {sepa.bank && (
            <CopyRow label={T.bank(lang)} value={sepa.bank} lang={lang} />
          )}
          {sepa.reference && (
            <CopyRow
              label={T.reference(lang)}
              value={sepa.reference}
              mono
              lang={lang}
            />
          )}
          <CopyRow label={T.amount(lang)} value={amountStr} lang={lang} />

          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "flex-start",
              background: "#FFFBEB",
              border: "1px solid #FCD34D",
              borderRadius: 10,
              padding: "10px 12px",
              marginTop: 6,
            }}
          >
            <AlertCircle
              size={16}
              color="#D97706"
              style={{ flexShrink: 0, marginTop: 1 }}
            />
            <span
              style={{ color: "#92400E", fontSize: "0.8rem", lineHeight: 1.5 }}
            >
              {T.instantNote(lang)}
            </span>
          </div>
        </div>
      )}

      {method === "crypto" && hasCrypto && selectedWallet && (
        <div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginBottom: 14,
            }}
          >
            {wallets.map((w) => {
              const active = w.coin === selectedWallet.coin;
              return (
                <button
                  key={w.coin}
                  type="button"
                  onClick={() => setSelectedCoin(w.coin)}
                  style={{
                    padding: "7px 14px",
                    borderRadius: 999,
                    border: `1px solid ${active ? "#005F2D" : "#E2E8F0"}`,
                    background: active ? "rgba(0,95,45,0.08)" : "white",
                    color: active ? "#005F2D" : "#475569",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {w.label}
                </button>
              );
            })}
          </div>

          <p
            style={{
              color: "#475569",
              fontSize: "0.85rem",
              margin: "0 0 12px",
              fontWeight: 600,
            }}
          >
            {T.network(lang)} : {selectedWallet.network}
          </p>

          <CopyRow
            label={T.address(lang)}
            value={selectedWallet.address}
            mono
            lang={lang}
          />

          <CopyRow label={T.amount(lang)} value={amountStr} lang={lang} />

          <CryptoQR wallet={selectedWallet} lang={lang} />
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────  Proof uploader  ───────────────────────── */

function ProofUploader({
  invoice,
  method,
  selectedCoin,
  token,
  lang,
  onSuccess,
}: {
  invoice: Invoice;
  method: Method;
  selectedCoin: string;
  token: string;
  lang: string;
  onSuccess: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [reference, setReference] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    if (!file) return;
    setSubmitting(true);
    const methodValue = method === "crypto" ? `crypto:${selectedCoin}` : "sepa";
    const fd = new FormData();
    fd.append("invoice_id", invoice.id);
    fd.append("file", file);
    fd.append("reference", reference);
    fd.append("method", methodValue);
    try {
      await fetch("/api/kt/client/fees/proof", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      onSuccess();
    } finally {
      setSubmitting(false);
    }
  }

  const inputId = `fee-proof-${invoice.id}`;

  return (
    <div
      style={{
        marginTop: 18,
        paddingTop: 18,
        borderTop: "1px solid #F1F5F9",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 12,
        }}
      >
        <FileText size={16} color="#005F2D" />
        <span style={{ color: "#0F172A", fontWeight: 700, fontSize: "0.9rem" }}>
          {T.proofTitle(lang)}
        </span>
      </div>

      <label
        style={{
          display: "block",
          color: "#94A3B8",
          fontSize: "0.68rem",
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          fontWeight: 700,
          margin: "0 0 4px",
        }}
        htmlFor={`fee-ref-${invoice.id}`}
      >
        {T.refOptional(lang)}
      </label>
      <input
        id={`fee-ref-${invoice.id}`}
        type="text"
        value={reference}
        onChange={(e) => setReference(e.target.value)}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "10px 12px",
          borderRadius: 10,
          border: "1px solid #E2E8F0",
          fontSize: "0.88rem",
          color: "#0F172A",
          marginBottom: 12,
          outline: "none",
          background: "white",
        }}
      />

      <input
        id={inputId}
        type="file"
        accept="image/*,application/pdf"
        style={{ display: "none" }}
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      <label
        htmlFor={inputId}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "11px 14px",
          borderRadius: 10,
          border: "1px dashed #CBD5E1",
          background: "#F8FAFC",
          cursor: "pointer",
          marginBottom: 14,
        }}
      >
        <Upload size={16} color="#64748B" style={{ flexShrink: 0 }} />
        <span
          style={{
            color: file ? "#0F172A" : "#64748B",
            fontSize: "0.85rem",
            fontWeight: file ? 600 : 500,
            wordBreak: "break-all",
            minWidth: 0,
          }}
        >
          {file ? file.name : T.chooseFile(lang)}
        </span>
      </label>

      <button
        type="button"
        onClick={submit}
        disabled={!file || submitting}
        style={{
          width: "100%",
          padding: "12px 16px",
          borderRadius: 12,
          border: "none",
          background: !file || submitting ? "#94A3B8" : "#005F2D",
          color: "white",
          fontSize: "0.9rem",
          fontWeight: 700,
          cursor: !file || submitting ? "not-allowed" : "pointer",
          transition: "background 0.2s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <ShieldCheck size={16} />
        {submitting ? T.sending(lang) : T.submitProof(lang)}
      </button>
    </div>
  );
}

/* ─────────────────────────  Invoice card  ───────────────────────── */

function InvoiceCard({
  invoice,
  sepa,
  wallets,
  token,
  lang,
  locale,
  onProofSuccess,
}: {
  invoice: Invoice;
  sepa: Sepa | null;
  wallets: CryptoWallet[];
  token: string;
  lang: string;
  locale: string;
  onProofSuccess: () => void;
}) {
  const hasSepa = !!sepa;
  const hasCrypto = wallets.length > 0;

  const [method, setMethod] = useState<Method>(hasSepa ? "sepa" : "crypto");
  const [selectedCoin, setSelectedCoin] = useState<string>(
    wallets[0]?.coin ?? "",
  );

  const meta = STATUS_META[invoice.status];
  const dateStr = new Date(invoice.created_at).toLocaleDateString(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const amountStr =
    invoice.amount.toLocaleString(locale, { minimumFractionDigits: 2 }) +
    " " +
    invoice.currency;

  return (
    <div
      style={{
        background: "white",
        border: "1px solid #E2E8F0",
        borderRadius: 16,
        padding: "20px 22px",
        boxShadow: "0 1px 4px rgba(15,23,42,0.04)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <h3
            style={{
              color: "#0F172A",
              fontSize: "1rem",
              fontWeight: 700,
              margin: "0 0 4px",
            }}
          >
            {invoice.title || T.defaultTitle(lang)}
          </h3>
          <p style={{ color: "#94A3B8", fontSize: "0.78rem", margin: 0 }}>
            {dateStr}
          </p>
        </div>
        <span
          style={{
            background: meta.bg,
            border: `1px solid ${meta.border}`,
            color: meta.color,
            fontSize: "0.72rem",
            fontWeight: 700,
            padding: "5px 11px",
            borderRadius: 999,
            whiteSpace: "nowrap",
          }}
        >
          {meta.label(lang)}
        </span>
      </div>

      <p
        style={{
          color: "#005F2D",
          fontWeight: 800,
          fontSize: "1.7rem",
          margin: "12px 0 0",
          lineHeight: 1.1,
        }}
      >
        {amountStr}
      </p>

      {invoice.description && (
        <p
          style={{
            color: "#475569",
            fontSize: "0.88rem",
            lineHeight: 1.55,
            margin: "10px 0 0",
          }}
        >
          {invoice.description}
        </p>
      )}

      {invoice.status === "pending" && (hasSepa || hasCrypto) && (
        <>
          <PaymentPanel
            invoice={invoice}
            sepa={sepa}
            wallets={wallets}
            lang={lang}
            locale={locale}
            method={method}
            setMethod={setMethod}
            selectedCoin={selectedCoin}
            setSelectedCoin={setSelectedCoin}
          />
          <ProofUploader
            invoice={invoice}
            method={method}
            selectedCoin={selectedCoin}
            token={token}
            lang={lang}
            onSuccess={onProofSuccess}
          />
        </>
      )}

      {invoice.status === "proof_submitted" && (
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "flex-start",
            background: "#EFF6FF",
            border: "1px solid #BFDBFE",
            borderRadius: 10,
            padding: "11px 13px",
            marginTop: 14,
          }}
        >
          <Clock
            size={16}
            color="#2563EB"
            style={{ flexShrink: 0, marginTop: 1 }}
          />
          <span
            style={{ color: "#1E40AF", fontSize: "0.82rem", lineHeight: 1.5 }}
          >
            {T.verifyNote(lang)}
          </span>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────  Main component  ───────────────────────── */

export default function FeesPage({
  token,
  lang,
}: {
  token: string;
  lang: string;
}) {
  const locale = LOCALE_MAP[lang as Lang] ?? "de-DE";

  const [data, setData] = useState<FeesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/kt/client/fees", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        setError(true);
        return;
      }
      const json: FeesResponse = await res.json();
      setData({
        invoices: Array.isArray(json.invoices) ? json.invoices : [],
        crypto_wallets: Array.isArray(json.crypto_wallets)
          ? json.crypto_wallets
          : [],
        sepa: json.sepa ?? null,
      });
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const invoices = data
    ? [...data.invoices].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
    : [];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F5F7FA",
        fontFamily: "'Inter',sans-serif",
        padding: "28px 16px 80px",
      }}
    >
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 8,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 11,
                background: "rgba(0,95,45,0.08)",
                border: "1px solid rgba(0,95,45,0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Receipt size={19} color="#005F2D" />
            </div>
            <h1
              style={{
                color: "#0F172A",
                fontSize: "1.45rem",
                fontWeight: 800,
                margin: 0,
              }}
            >
              {T.heading(lang)}
            </h1>
          </div>
          <p
            style={{
              color: "#64748B",
              fontSize: "0.9rem",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {T.subtitle(lang)}
          </p>
        </div>

        {/* States */}
        {loading && (
          <p
            style={{
              color: "#94A3B8",
              fontSize: "0.9rem",
              textAlign: "center",
              padding: "40px 0",
            }}
          >
            {T.loading(lang)}
          </p>
        )}

        {!loading && error && (
          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              borderRadius: 14,
              padding: "14px 16px",
            }}
          >
            <AlertCircle
              size={18}
              color="#DC2626"
              style={{ flexShrink: 0, marginTop: 1 }}
            />
            <p style={{ color: "#B91C1C", fontSize: "0.88rem", margin: 0 }}>
              {T.loadError(lang)}
            </p>
          </div>
        )}

        {!loading && !error && invoices.length === 0 && (
          <div
            style={{
              background: "white",
              border: "1px solid #E2E8F0",
              borderRadius: 16,
              padding: "48px 24px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "#F0FDF4",
                border: "2px solid #BBF7D0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <Check size={26} color="#16A34A" />
            </div>
            <p
              style={{
                color: "#0F172A",
                fontSize: "1.05rem",
                fontWeight: 700,
                margin: "0 0 6px",
              }}
            >
              {T.empty(lang)}
            </p>
            <p style={{ color: "#64748B", fontSize: "0.88rem", margin: 0 }}>
              {T.emptySub(lang)}
            </p>
          </div>
        )}

        {!loading && !error && invoices.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {invoices.map((inv) => (
              <InvoiceCard
                key={inv.id}
                invoice={inv}
                sepa={data?.sepa ?? null}
                wallets={data?.crypto_wallets ?? []}
                token={token}
                lang={lang}
                locale={locale}
                onProofSuccess={load}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
