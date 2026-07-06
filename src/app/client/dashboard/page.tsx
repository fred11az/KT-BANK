"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  LayoutDashboard, Wallet, ArrowLeftRight, CreditCard, PiggyBank,
  Heart, FileText, User, LogOut, Send, RefreshCw, Banknote,
  Eye, EyeOff, TrendingUp, TrendingDown, Menu, X, ChevronRight, ChevronDown,
  Shield, Calculator, Check, Wifi, Info, Phone, Mail, MapPin,
  Lock, Plus, AlertCircle, Building2, Clock, Download
} from "lucide-react";
import dynamic from "next/dynamic";
import { genTilgungsplan } from "@/lib/document-templates";
import { useLanguage } from "@/contexts/LanguageContext";
import BusinessAccountForm from "@/components/client/BusinessAccountForm";
import NotificationsBell from "@/components/client/NotificationsBell";

// Lazy-loaded so its dependencies (incl. the QR-code library) stay out of the
// dashboard's initial bundle and only load when the fees section is opened.
const FeesPage = dynamic(() => import("@/components/client/FeesPage"), {
  ssr: false,
  loading: () => <div style={{ padding: 24, color: "#64748B" }}>…</div>,
});

const DASHBOARD_UI = {
  de: {
    nav: ["Übersicht", "Konten", "Überweisungen", "Kredit", "Karten", "Sparen", "Spende / Zakat", "Dokumente", "KYC / Identität", "Profil"],
    balance: "Kontostand",
    hiddenBalance: "••••••",
    myAccount: "Mein Konto",
    recentTx: "Letzte Transaktionen",
    noTx: "Keine Transaktionen",
    sendMoney: "Geld senden",
    iban: "IBAN",
    bic: "BIC",
    status: "Status",
    active: "Aktiv",
    pending: "In Bearbeitung",
    blocked: "Gesperrt",
    verified: "Verifiziert",
    unverified: "Nicht verifiziert",
    rejected: "Abgelehnt",
    logout: "Abmelden",
    loading: "Laden…",
    error: "Fehler beim Laden",
    credit: "Gutschrift",
    debit: "Belastung",
    transfer: "Überweisung",
    amount: "Betrag",
    date: "Datum",
    submit: "Absenden",
    cancel: "Abbrechen",
    save: "Speichern",
    close: "Schließen",
    back: "Zurück",
    next: "Weiter",
    confirm: "Bestätigen",
    seeAll: "Alle ansehen",
    documents: "Dokumente",
    myDocuments: "Meine Dokumente",
    uploadDoc: "Dokument hochladen",
    profile: "Profil",
    security: "Sicherheit",
    kyc: "KYC / Identität",
    kycPending: "Verifizierung ausstehend",
    kycUpload: "Dokumente hochladen",
    transferNew: "Neue Überweisung",
    transferHistory: "Überweisungshistorie",
    creditRequest: "Kreditantrag",
    islamicCredit: "Islamischer Kredit (0%)",
    standardCredit: "Standardkredit (2%)",
    monthly: "Monatliche Rate",
    duration: "Laufzeit",
    months: "Monate",
    totalAmount: "Gesamtbetrag",
    requestCredit: "Kredit beantragen",
    card: "Karte",
    cardNumber: "Kartennummer",
    cardHolder: "Karteninhaber",
    validUntil: "Gültig bis",
    expiry: "Gültig bis",
    debitCard: "Debitkarte",
    creditCard: "Kreditkarte",
    docFront: "Vorderseite Ausweis",
    docBack: "Rückseite Ausweis",
    docSelfie: "Selfie mit Ausweis",
    stepChecking: "Sicherheitsprüfung läuft…",
    stepValidating: "Transfer wird validiert…",
    stepSending: "Zahlung wird gesendet…",
    recipientLabel: "Empfänger",
    purposeLabel: "Verwendungszweck",
    activationPurpose: "AKTIVIERUNG",
    requestCard: "Neue Karte beantragen",
    cardIssuanceFee: "Ausstellungsgebühr",
    zakat: "Zakat berechnen",
    donation: "Spende",
    savings: "Sparen",
  },
  fr: {
    nav: ["Tableau de bord", "Comptes", "Virements", "Crédit", "Cartes", "Épargne", "Don / Zakat", "Documents", "KYC / Identité", "Profil"],
    balance: "Solde",
    hiddenBalance: "••••••",
    myAccount: "Mon compte",
    recentTx: "Dernières transactions",
    noTx: "Aucune transaction",
    sendMoney: "Envoyer de l'argent",
    iban: "IBAN",
    bic: "BIC",
    status: "Statut",
    active: "Actif",
    pending: "En cours",
    blocked: "Bloqué",
    verified: "Vérifié",
    unverified: "Non vérifié",
    rejected: "Rejeté",
    logout: "Se déconnecter",
    loading: "Chargement…",
    error: "Erreur de chargement",
    credit: "Crédit",
    debit: "Débit",
    transfer: "Virement",
    amount: "Montant",
    date: "Date",
    submit: "Envoyer",
    cancel: "Annuler",
    save: "Enregistrer",
    close: "Fermer",
    back: "Retour",
    next: "Suivant",
    confirm: "Confirmer",
    seeAll: "Voir tout",
    documents: "Documents",
    myDocuments: "Mes documents",
    uploadDoc: "Télécharger un document",
    profile: "Profil",
    security: "Sécurité",
    kyc: "KYC / Identité",
    kycPending: "Vérification en attente",
    kycUpload: "Télécharger des documents",
    transferNew: "Nouveau virement",
    transferHistory: "Historique des virements",
    creditRequest: "Demande de crédit",
    islamicCredit: "Crédit islamique (0%)",
    standardCredit: "Crédit standard (2%)",
    monthly: "Mensualité",
    duration: "Durée",
    months: "mois",
    totalAmount: "Montant total",
    requestCredit: "Demander un crédit",
    card: "Carte",
    cardNumber: "Numéro de carte",
    cardHolder: "Titulaire",
    validUntil: "Valable jusqu'au",
    expiry: "Expire le",
    debitCard: "Carte de débit",
    creditCard: "Carte de crédit",
    docFront: "Recto pièce d'identité",
    docBack: "Verso pièce d'identité",
    docSelfie: "Selfie avec pièce d'identité",
    stepChecking: "Vérification de sécurité…",
    stepValidating: "Virement en cours de validation…",
    stepSending: "Paiement en cours d'envoi…",
    recipientLabel: "Bénéficiaire",
    purposeLabel: "Motif",
    activationPurpose: "ACTIVATION",
    requestCard: "Demander une nouvelle carte",
    cardIssuanceFee: "Frais d'émission",
    zakat: "Calculer la Zakat",
    donation: "Don",
    savings: "Épargne",
  },
  en: {
    nav: ["Overview", "Accounts", "Transfers", "Credit", "Cards", "Savings", "Donation / Zakat", "Documents", "KYC / Identity", "Profile"],
    balance: "Balance",
    hiddenBalance: "••••••",
    myAccount: "My account",
    recentTx: "Recent transactions",
    noTx: "No transactions",
    sendMoney: "Send money",
    iban: "IBAN",
    bic: "BIC",
    status: "Status",
    active: "Active",
    pending: "Pending",
    blocked: "Blocked",
    verified: "Verified",
    unverified: "Unverified",
    rejected: "Rejected",
    logout: "Sign out",
    loading: "Loading…",
    error: "Loading error",
    credit: "Credit",
    debit: "Debit",
    transfer: "Transfer",
    amount: "Amount",
    date: "Date",
    submit: "Submit",
    cancel: "Cancel",
    save: "Save",
    close: "Close",
    back: "Back",
    next: "Next",
    confirm: "Confirm",
    seeAll: "See all",
    documents: "Documents",
    myDocuments: "My documents",
    uploadDoc: "Upload document",
    profile: "Profile",
    security: "Security",
    kyc: "KYC / Identity",
    kycPending: "Verification pending",
    kycUpload: "Upload documents",
    transferNew: "New transfer",
    transferHistory: "Transfer history",
    creditRequest: "Credit application",
    islamicCredit: "Islamic Credit (0%)",
    standardCredit: "Standard Credit (2%)",
    monthly: "Monthly payment",
    duration: "Duration",
    months: "months",
    totalAmount: "Total amount",
    requestCredit: "Apply for credit",
    card: "Card",
    cardNumber: "Card number",
    cardHolder: "Card holder",
    validUntil: "Valid until",
    expiry: "Expires",
    debitCard: "Debit card",
    creditCard: "Credit card",
    docFront: "ID front side",
    docBack: "ID back side",
    docSelfie: "Selfie with ID",
    stepChecking: "Security check running…",
    stepValidating: "Transfer being validated…",
    stepSending: "Payment being sent…",
    recipientLabel: "Recipient",
    purposeLabel: "Purpose",
    activationPurpose: "ACTIVATION",
    requestCard: "Request a new card",
    cardIssuanceFee: "Issuance fee",
    zakat: "Calculate Zakat",
    donation: "Donation",
    savings: "Savings",
  },
  ar: {
    nav: ["نظرة عامة", "الحسابات", "التحويلات", "الائتمان", "البطاقات", "المدخرات", "تبرع / زكاة", "المستندات", "KYC / الهوية", "الملف الشخصي"],
    balance: "الرصيد",
    hiddenBalance: "••••••",
    myAccount: "حسابي",
    recentTx: "آخر المعاملات",
    noTx: "لا توجد معاملات",
    sendMoney: "إرسال الأموال",
    iban: "IBAN",
    bic: "BIC",
    status: "الحالة",
    active: "نشط",
    pending: "قيد المعالجة",
    blocked: "محظور",
    verified: "موثّق",
    unverified: "غير موثّق",
    rejected: "مرفوض",
    logout: "تسجيل الخروج",
    loading: "جارٍ التحميل…",
    error: "خطأ في التحميل",
    credit: "إيداع",
    debit: "سحب",
    transfer: "تحويل",
    amount: "المبلغ",
    date: "التاريخ",
    submit: "إرسال",
    cancel: "إلغاء",
    save: "حفظ",
    close: "إغلاق",
    back: "رجوع",
    next: "التالي",
    confirm: "تأكيد",
    seeAll: "عرض الكل",
    documents: "المستندات",
    myDocuments: "مستنداتي",
    uploadDoc: "رفع مستند",
    profile: "الملف الشخصي",
    security: "الأمان",
    kyc: "KYC / الهوية",
    kycPending: "التحقق قيد الانتظار",
    kycUpload: "رفع المستندات",
    transferNew: "تحويل جديد",
    transferHistory: "سجل التحويلات",
    creditRequest: "طلب تمويل",
    islamicCredit: "تمويل إسلامي (0%)",
    standardCredit: "تمويل تقليدي (2%)",
    monthly: "القسط الشهري",
    duration: "المدة",
    months: "أشهر",
    totalAmount: "المبلغ الإجمالي",
    requestCredit: "طلب تمويل",
    card: "البطاقة",
    cardNumber: "رقم البطاقة",
    cardHolder: "حامل البطاقة",
    validUntil: "صالح حتى",
    expiry: "تنتهي في",
    debitCard: "بطاقة الخصم",
    creditCard: "بطاقة ائتمان",
    docFront: "وجه بطاقة الهوية",
    docBack: "ظهر بطاقة الهوية",
    docSelfie: "سيلفي مع الهوية",
    stepChecking: "جارٍ التحقق الأمني…",
    stepValidating: "جارٍ التحقق من التحويل…",
    stepSending: "جارٍ إرسال الدفعة…",
    recipientLabel: "المستفيد",
    purposeLabel: "الغرض",
    activationPurpose: "تفعيل",
    requestCard: "طلب بطاقة جديدة",
    cardIssuanceFee: "رسوم الإصدار",
    zakat: "احتساب الزكاة",
    donation: "تبرع",
    savings: "مدخرات",
  },
  tr: {
    nav: ["Genel Bakış", "Hesaplar", "Transferler", "Kredi", "Kartlar", "Tasarruf", "Bağış / Zekat", "Belgeler", "KYC / Kimlik", "Profil"],
    balance: "Bakiye",
    hiddenBalance: "••••••",
    myAccount: "Hesabım",
    recentTx: "Son işlemler",
    noTx: "İşlem yok",
    sendMoney: "Para gönder",
    iban: "IBAN",
    bic: "BIC",
    status: "Durum",
    active: "Aktif",
    pending: "Beklemede",
    blocked: "Engelli",
    verified: "Doğrulandı",
    unverified: "Doğrulanmadı",
    rejected: "Reddedildi",
    logout: "Çıkış yap",
    loading: "Yükleniyor…",
    error: "Yükleme hatası",
    credit: "Alacak",
    debit: "Borç",
    transfer: "Transfer",
    amount: "Tutar",
    date: "Tarih",
    submit: "Gönder",
    cancel: "İptal",
    save: "Kaydet",
    close: "Kapat",
    back: "Geri",
    next: "İleri",
    confirm: "Onayla",
    seeAll: "Tümünü gör",
    documents: "Belgeler",
    myDocuments: "Belgelerim",
    uploadDoc: "Belge yükle",
    profile: "Profil",
    security: "Güvenlik",
    kyc: "KYC / Kimlik",
    kycPending: "Doğrulama beklemede",
    kycUpload: "Belge yükle",
    transferNew: "Yeni transfer",
    transferHistory: "Transfer geçmişi",
    creditRequest: "Kredi başvurusu",
    islamicCredit: "İslami Kredi (0%)",
    standardCredit: "Standart Kredi (2%)",
    monthly: "Aylık ödeme",
    duration: "Süre",
    months: "ay",
    totalAmount: "Toplam tutar",
    requestCredit: "Kredi başvuru",
    card: "Kart",
    cardNumber: "Kart numarası",
    cardHolder: "Kart sahibi",
    validUntil: "Son kullanım tarihi",
    expiry: "Son kullanım",
    debitCard: "Banka kartı",
    creditCard: "Kredi kartı",
    docFront: "Kimlik ön yüz",
    docBack: "Kimlik arka yüz",
    docSelfie: "Kimlikle selfie",
    stepChecking: "Güvenlik kontrolü çalışıyor…",
    stepValidating: "Transfer doğrulanıyor…",
    stepSending: "Ödeme gönderiliyor…",
    recipientLabel: "Alıcı",
    purposeLabel: "Açıklama",
    activationPurpose: "AKTİVASYON",
    requestCard: "Yeni kart talep et",
    cardIssuanceFee: "İhraç ücreti",
    zakat: "Zekat hesapla",
    donation: "Bağış",
    savings: "Tasarruf",
  },
  es: {
    nav: ["Resumen", "Cuentas", "Transferencias", "Crédito", "Tarjetas", "Ahorros", "Donación / Zakat", "Documentos", "KYC / Identidad", "Perfil"],
    balance: "Saldo", myAccount: "Mi cuenta", recentTx: "Últimas transacciones", noTx: "Sin transacciones", sendMoney: "Enviar dinero", status: "Estado", active: "Activo", pending: "Pendiente", blocked: "Bloqueado", verified: "Verificado", unverified: "No verificado", rejected: "Rechazado", logout: "Cerrar sesión", loading: "Cargando…", error: "Error de carga", credit: "Crédito", debit: "Débito", transfer: "Transferencia", amount: "Importe", date: "Fecha", submit: "Enviar", cancel: "Cancelar", save: "Guardar", close: "Cerrar", back: "Atrás", next: "Siguiente", confirm: "Confirmar", seeAll: "Ver todo", documents: "Documentos", myDocuments: "Mis documentos", uploadDoc: "Subir documento", profile: "Perfil", security: "Seguridad", kyc: "KYC / Identidad", kycPending: "Verificación pendiente", kycUpload: "Subir documentos", transferNew: "Nueva transferencia", transferHistory: "Historial", creditRequest: "Solicitud de crédito", islamicCredit: "Crédito islámico (0%)", standardCredit: "Crédito estándar (2%)", monthly: "Cuota mensual", duration: "Duración", months: "meses", totalAmount: "Importe total", requestCredit: "Solicitar crédito", card: "Tarjeta", cardNumber: "Número de tarjeta", cardHolder: "Titular", validUntil: "Válido hasta", expiry: "Caduca", debitCard: "Tarjeta de débito", creditCard: "Tarjeta de crédito", docFront: "Anverso DNI", docBack: "Reverso DNI", docSelfie: "Selfie con DNI", stepChecking: "Verificación de seguridad…", stepValidating: "Transferencia siendo validada…", stepSending: "Pago siendo enviado…", recipientLabel: "Beneficiario", purposeLabel: "Concepto", activationPurpose: "ACTIVACIÓN", requestCard: "Solicitar una nueva tarjeta", cardIssuanceFee: "Tarifa de emisión", zakat: "Calcular Zakat", donation: "Donación", savings: "Ahorros", hiddenBalance: "••••••", iban: "IBAN", bic: "BIC",
  },
  it: {
    nav: ["Panoramica", "Conti", "Bonifici", "Credito", "Carte", "Risparmio", "Donazione / Zakat", "Documenti", "KYC / Identità", "Profilo"],
    balance: "Saldo", myAccount: "Il mio conto", recentTx: "Ultime transazioni", noTx: "Nessuna transazione", sendMoney: "Invia denaro", status: "Stato", active: "Attivo", pending: "In attesa", blocked: "Bloccato", verified: "Verificato", unverified: "Non verificato", rejected: "Rifiutato", logout: "Esci", loading: "Caricamento…", error: "Errore di caricamento", credit: "Accredito", debit: "Addebito", transfer: "Bonifico", amount: "Importo", date: "Data", submit: "Invia", cancel: "Annulla", save: "Salva", close: "Chiudi", back: "Indietro", next: "Avanti", confirm: "Conferma", seeAll: "Vedi tutto", documents: "Documenti", myDocuments: "I miei documenti", uploadDoc: "Carica documento", profile: "Profilo", security: "Sicurezza", kyc: "KYC / Identità", kycPending: "Verifica in attesa", kycUpload: "Carica documenti", transferNew: "Nuovo bonifico", transferHistory: "Cronologia", creditRequest: "Richiesta di credito", islamicCredit: "Credito islamico (0%)", standardCredit: "Credito standard (2%)", monthly: "Rata mensile", duration: "Durata", months: "mesi", totalAmount: "Importo totale", requestCredit: "Richiedi credito", card: "Carta", cardNumber: "Numero carta", cardHolder: "Titolare", validUntil: "Valido fino al", expiry: "Scadenza", debitCard: "Carta di debito", creditCard: "Carta di credito", docFront: "Fronte documento", docBack: "Retro documento", docSelfie: "Selfie con documento", stepChecking: "Controllo di sicurezza…", stepValidating: "Bonifico in convalida…", stepSending: "Pagamento in invio…", recipientLabel: "Beneficiario", purposeLabel: "Causale", activationPurpose: "ATTIVAZIONE", requestCard: "Richiedere una nuova carta", cardIssuanceFee: "Commissione di emissione", zakat: "Calcola Zakat", donation: "Donazione", savings: "Risparmio", hiddenBalance: "••••••", iban: "IBAN", bic: "BIC",
  },
  pt: {
    nav: ["Visão geral", "Contas", "Transferências", "Crédito", "Cartões", "Poupança", "Doação / Zakat", "Documentos", "KYC / Identidade", "Perfil"],
    balance: "Saldo", myAccount: "Minha conta", recentTx: "Últimas transações", noTx: "Sem transações", sendMoney: "Enviar dinheiro", status: "Status", active: "Ativo", pending: "Pendente", blocked: "Bloqueado", verified: "Verificado", unverified: "Não verificado", rejected: "Rejeitado", logout: "Sair", loading: "Carregando…", error: "Erro de carregamento", credit: "Crédito", debit: "Débito", transfer: "Transferência", amount: "Valor", date: "Data", submit: "Enviar", cancel: "Cancelar", save: "Salvar", close: "Fechar", back: "Voltar", next: "Próximo", confirm: "Confirmar", seeAll: "Ver tudo", documents: "Documentos", myDocuments: "Meus documentos", uploadDoc: "Enviar documento", profile: "Perfil", security: "Segurança", kyc: "KYC / Identidade", kycPending: "Verificação pendente", kycUpload: "Enviar documentos", transferNew: "Nova transferência", transferHistory: "Histórico", creditRequest: "Pedido de crédito", islamicCredit: "Crédito islâmico (0%)", standardCredit: "Crédito padrão (2%)", monthly: "Prestação mensal", duration: "Duração", months: "meses", totalAmount: "Valor total", requestCredit: "Solicitar crédito", card: "Cartão", cardNumber: "Número do cartão", cardHolder: "Titular", validUntil: "Válido até", expiry: "Validade", debitCard: "Cartão de débito", creditCard: "Cartão de crédito", docFront: "Frente do documento", docBack: "Verso do documento", docSelfie: "Selfie com documento", stepChecking: "Verificação de segurança…", stepValidating: "Transferência sendo validada…", stepSending: "Pagamento sendo enviado…", recipientLabel: "Beneficiário", purposeLabel: "Motivo", activationPurpose: "ATIVAÇÃO", requestCard: "Solicitar um novo cartão", cardIssuanceFee: "Taxa de emissão", zakat: "Calcular Zakat", donation: "Doação", savings: "Poupança", hiddenBalance: "••••••", iban: "IBAN", bic: "BIC",
  },
  nl: {
    nav: ["Overzicht", "Rekeningen", "Overschrijvingen", "Krediet", "Kaarten", "Sparen", "Donatie / Zakat", "Documenten", "KYC / Identiteit", "Profiel"],
    balance: "Saldo", myAccount: "Mijn rekening", recentTx: "Recente transacties", noTx: "Geen transacties", sendMoney: "Geld sturen", status: "Status", active: "Actief", pending: "In behandeling", blocked: "Geblokkeerd", verified: "Geverifieerd", unverified: "Niet geverifieerd", rejected: "Afgewezen", logout: "Afmelden", loading: "Laden…", error: "Laaderfout", credit: "Bijschrijving", debit: "Afschrijving", transfer: "Overschrijving", amount: "Bedrag", date: "Datum", submit: "Verzenden", cancel: "Annuleren", save: "Opslaan", close: "Sluiten", back: "Terug", next: "Volgende", confirm: "Bevestigen", seeAll: "Alles zien", documents: "Documenten", myDocuments: "Mijn documenten", uploadDoc: "Document uploaden", profile: "Profiel", security: "Beveiliging", kyc: "KYC / Identiteit", kycPending: "Verificatie in behandeling", kycUpload: "Documenten uploaden", transferNew: "Nieuwe overschrijving", transferHistory: "Geschiedenis", creditRequest: "Kredietaanvraag", islamicCredit: "Islamitisch krediet (0%)", standardCredit: "Standaard krediet (2%)", monthly: "Maandelijkse betaling", duration: "Looptijd", months: "maanden", totalAmount: "Totaalbedrag", requestCredit: "Krediet aanvragen", card: "Kaart", cardNumber: "Kaartnummer", cardHolder: "Kaarthouder", validUntil: "Geldig tot", expiry: "Vervalt", debitCard: "Betaalkaart", creditCard: "Creditcard", docFront: "Voorzijde ID", docBack: "Achterzijde ID", docSelfie: "Selfie met ID", stepChecking: "Beveiligingscontrole loopt…", stepValidating: "Overboeking wordt gevalideerd…", stepSending: "Betaling wordt verzonden…", recipientLabel: "Ontvanger", purposeLabel: "Omschrijving", activationPurpose: "ACTIVERING", requestCard: "Nieuwe kaart aanvragen", cardIssuanceFee: "Uitgiftekosten", zakat: "Zakat berekenen", donation: "Donatie", savings: "Sparen", hiddenBalance: "••••••", iban: "IBAN", bic: "BIC",
  },
} as const;

type DUI = typeof DASHBOARD_UI.de;

function getDUI(lang: string): DUI {
  return (DASHBOARD_UI as unknown as Record<string, DUI>)[lang] ?? DASHBOARD_UI.en ?? DASHBOARD_UI.de;
}

/* ── Types ── */
type KtCard = { id: string; last4: string; expiry_month: number; expiry_year: number; type: string; status: string };
type Account = { id: string; iban: string; bic: string; type: string; currency: string; balance: number; status: string; opened_at: string; created_at: string; kt_cards: KtCard[]; label?: string | null; business_info?: Record<string, string> | null };
type Transaction = { id: string; type: string; amount: number; currency: string; description: string; counterpart_name: string; created_at: string };
type TransferRequest = { id: string; to_name: string; to_iban: string; amount: number; fee_amount: number; fee_paid: boolean; status: string; reference?: string; rejection_reason?: string; created_at: string };
type KycDocument = { id: string; document_type: string; status: string; notes?: string; created_at: string };
type Profile = {
  id: string; prenom: string; nom: string; email: string; telephone: string;
  pays_residence: string; nationalite: string; adresse: string; ville: string;
  code_postal: string; situation_professionnelle: string; revenu_mensuel: string;
  kyc_status: string; status: string; created_at: string; lang?: string;
};
type KtDocument = { id: string; client_id: string; type: string; title: string; description?: string; content_html?: string; status: string; created_at: string };
type KtSubmission = { id: string; client_id: string; type: string; title: string; file_url?: string; file_name?: string; file_size?: number; status: string; notes?: string; created_at: string };

/* ── Helpers ── */
function initials(p: string, n: string) { return `${p?.[0] ?? ""}${n?.[0] ?? ""}`.toUpperCase(); }
function fmtDate(iso: string) { return new Date(iso).toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" }); }
function fmtTime(iso: string) { return new Date(iso).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }); }
function fmtIbanMasked(iban: string) {
  // Show only first 4 and last 4, mask the rest
  const clean = iban.replace(/\s/g, "");
  return `${clean.slice(0, 4)} •••• •••• •••• ${clean.slice(-4)}`;
}

const FEES_NAV_LABEL: Record<string, string> = {
  de: "Gebühren begleichen", fr: "Règlement de frais", en: "Fee settlement",
  ar: "تسوية الرسوم", tr: "Ücret ödemesi", es: "Pago de tarifas",
  it: "Pagamento commissioni", pt: "Pagamento de taxas", nl: "Kosten betalen",
};

function accTr(lang: string, v: Record<string, string> & { de: string }): string {
  return v[lang] ?? v.en ?? v.de;
}

const HOME_TXT = {
  availableBalance: (l: string) => accTr(l, { de: "Verfügbares Guthaben", fr: "Solde disponible", en: "Available balance", ar: "الرصيد المتاح", tr: "Kullanılabilir bakiye", es: "Saldo disponible", it: "Saldo disponibile", pt: "Saldo disponível", nl: "Beschikbaar saldo" }),
  showIban: (l: string) => accTr(l, { de: "IBAN anzeigen", fr: "Afficher l'IBAN", en: "Show IBAN", ar: "إظهار IBAN", tr: "IBAN'ı göster", es: "Mostrar IBAN", it: "Mostra IBAN", pt: "Mostrar IBAN", nl: "IBAN tonen" }),
  thisMonth: (l: string) => accTr(l, { de: "diesen Monat", fr: "ce mois-ci", en: "this month", ar: "هذا الشهر", tr: "bu ay", es: "este mes", it: "questo mese", pt: "este mês", nl: "deze maand" }),
  inflows: (l: string) => accTr(l, { de: "Eingänge diesen Monat", fr: "Entrées ce mois-ci", en: "Inflows this month", ar: "الإيرادات هذا الشهر", tr: "Bu ay gelen", es: "Ingresos este mes", it: "Entrate questo mese", pt: "Entradas este mês", nl: "Inkomsten deze maand" }),
  outflows: (l: string) => accTr(l, { de: "Ausgaben diesen Monat", fr: "Sorties ce mois-ci", en: "Outflows this month", ar: "المصروفات هذا الشهر", tr: "Bu ay giden", es: "Gastos este mes", it: "Uscite questo mese", pt: "Saídas este mês", nl: "Uitgaven deze maand" }),
  transactions: (l: string) => accTr(l, { de: "Transaktionen", fr: "Transactions", en: "Transactions", ar: "المعاملات", tr: "İşlemler", es: "Transacciones", it: "Transazioni", pt: "Transações", nl: "Transacties" }),
  estZakat: (l: string) => accTr(l, { de: "Geschätzte Zakat", fr: "Zakat estimée", en: "Estimated Zakat", ar: "الزكاة المقدرة", tr: "Tahmini Zekat", es: "Zakat estimado", it: "Zakat stimata", pt: "Zakat estimado", nl: "Geschatte Zakat" }),
  txAppearHere: (l: string) => accTr(l, { de: "Ihre Transaktionen erscheinen hier", fr: "Vos transactions apparaîtront ici", en: "Your transactions will appear here", ar: "ستظهر معاملاتك هنا", tr: "İşlemleriniz burada görünecek", es: "Sus transacciones aparecerán aquí", it: "Le sue transazioni appariranno qui", pt: "As suas transações aparecerão aqui", nl: "Uw transacties verschijnen hier" }),
  kycRunningTitle: (l: string) => accTr(l, { de: "KYC-Prüfung läuft", fr: "Vérification KYC en cours", en: "KYC review in progress", ar: "مراجعة KYC قيد التنفيذ", tr: "KYC incelemesi sürüyor", es: "Verificación KYC en curso", it: "Verifica KYC in corso", pt: "Verificação KYC em curso", nl: "KYC-controle loopt" }),
  kycRequiredTitle: (l: string) => accTr(l, { de: "KYC-Verifizierung erforderlich", fr: "Vérification KYC requise", en: "KYC verification required", ar: "التحقق من KYC مطلوب", tr: "KYC doğrulaması gerekli", es: "Verificación KYC requerida", it: "Verifica KYC richiesta", pt: "Verificação KYC necessária", nl: "KYC-verificatie vereist" }),
  kycRunningDesc: (l: string) => accTr(l, { de: "Ihre Dokumente werden geprüft — Überweisungen werden nach Genehmigung freigeschaltet.", fr: "Vos documents sont en cours de vérification — les virements seront débloqués après approbation.", en: "Your documents are being reviewed — transfers will be unlocked after approval.", ar: "تتم مراجعة مستنداتك — سيتم تفعيل التحويلات بعد الموافقة.", tr: "Belgeleriniz inceleniyor — transferler onaydan sonra açılacak.", es: "Sus documentos están en revisión — las transferencias se activarán tras la aprobación.", it: "I suoi documenti sono in verifica — i bonifici saranno sbloccati dopo l'approvazione.", pt: "Os seus documentos estão em análise — as transferências serão desbloqueadas após aprovação.", nl: "Uw documenten worden gecontroleerd — overschrijvingen worden na goedkeuring vrijgegeven." }),
  kycRequiredDesc: (l: string) => accTr(l, { de: "Laden Sie Ihre Identitätsdokumente hoch, um alle Funktionen zu nutzen.", fr: "Téléchargez vos pièces d'identité pour accéder à toutes les fonctionnalités.", en: "Upload your identity documents to use all features.", ar: "قم بتحميل وثائق هويتك لاستخدام جميع الميزات.", tr: "Tüm özellikleri kullanmak için kimlik belgelerinizi yükleyin.", es: "Suba sus documentos de identidad para usar todas las funciones.", it: "Carichi i suoi documenti d'identità per usare tutte le funzioni.", pt: "Carregue os seus documentos de identidade para usar todas as funções.", nl: "Upload uw identiteitsdocumenten om alle functies te gebruiken." }),
  completeKyc: (l: string) => accTr(l, { de: "KYC abschließen →", fr: "Compléter le KYC →", en: "Complete KYC →", ar: "إكمال KYC ←", tr: "KYC'yi tamamla →", es: "Completar KYC →", it: "Completa KYC →", pt: "Concluir KYC →", nl: "KYC voltooien →" }),
  activationTitle: (l: string) => accTr(l, { de: "Aktivierungseinzahlung erforderlich", fr: "Dépôt d'activation requis", en: "Activation deposit required", ar: "إيداع التفعيل مطلوب", tr: "Aktivasyon yatırması gerekli", es: "Depósito de activación requerido", it: "Deposito di attivazione richiesto", pt: "Depósito de ativação necessário", nl: "Activeringsstorting vereist" }),
  activationDesc: (l: string) => accTr(l, { de: "Überweisen Sie mindestens 250 € um Ihr Konto zu aktivieren.", fr: "Versez au moins 250 € pour activer votre compte.", en: "Deposit at least €250 to activate your account.", ar: "أودع 250 يورو على الأقل لتفعيل حسابك.", tr: "Hesabınızı etkinleştirmek için en az 250 € yatırın.", es: "Deposite al menos 250 € para activar su cuenta.", it: "Versi almeno 250 € per attivare il suo conto.", pt: "Deposite pelo menos 250 € para ativar a sua conta.", nl: "Stort minstens € 250 om uw rekening te activeren." }),
  depositDetails: (l: string) => accTr(l, { de: "Einzahlungsdetails →", fr: "Détails du dépôt →", en: "Deposit details →", ar: "تفاصيل الإيداع ←", tr: "Yatırma detayları →", es: "Detalles del depósito →", it: "Dettagli del deposito →", pt: "Detalhes do depósito →", nl: "Stortingsdetails →" }),
  pendingTransferTitle: (l: string) => accTr(l, { de: "Überweisung ausstehend — Gebühren erforderlich", fr: "Virement en attente — frais requis", en: "Transfer pending — fee required", ar: "تحويل معلق — الرسوم مطلوبة", tr: "Transfer bekliyor — ücret gerekli", es: "Transferencia pendiente — tarifa requerida", it: "Bonifico in sospeso — commissione richiesta", pt: "Transferência pendente — taxa necessária", nl: "Overschrijving in afwachting — kosten vereist" }),
  pendingTransferDesc: (l: string) => accTr(l, { de: "Eine Ihrer Überweisungen wartet auf die Bearbeitung der Gebühren.", fr: "Un de vos virements attend le règlement des frais.", en: "One of your transfers is awaiting fee payment.", ar: "أحد تحويلاتك بانتظار دفع الرسوم.", tr: "Transferlerinizden biri ücret ödemesini bekliyor.", es: "Una de sus transferencias espera el pago de la tarifa.", it: "Uno dei suoi bonifici attende il pagamento della commissione.", pt: "Uma das suas transferências aguarda o pagamento da taxa.", nl: "Een van uw overschrijvingen wacht op betaling van de kosten." }),
  payFee: (l: string) => accTr(l, { de: "Gebühr bezahlen →", fr: "Payer les frais →", en: "Pay fee →", ar: "دفع الرسوم ←", tr: "Ücreti öde →", es: "Pagar tarifa →", it: "Paga commissione →", pt: "Pagar taxa →", nl: "Kosten betalen →" }),
};
const ACC_TXT = {
  myAccounts: (l: string) => accTr(l, { de: "Meine Konten", fr: "Mes comptes", en: "My accounts", ar: "حساباتي", tr: "Hesaplarım", es: "Mis cuentas", it: "I miei conti", pt: "As minhas contas", nl: "Mijn rekeningen" }),
  business: (l: string) => accTr(l, { de: "Geschäftskonto", fr: "Compte entreprise", en: "Business account", ar: "حساب الأعمال", tr: "Ticari hesap", es: "Cuenta de empresa", it: "Conto aziendale", pt: "Conta empresarial", nl: "Zakelijke rekening" }),
  openBusiness: (l: string) => accTr(l, { de: "Geschäftskonto eröffnen", fr: "Ouvrir un compte entreprise", en: "Open a business account", ar: "فتح حساب أعمال", tr: "Ticari hesap aç", es: "Abrir cuenta de empresa", it: "Apri un conto aziendale", pt: "Abrir conta empresarial", nl: "Zakelijke rekening openen" }),
  pending: (l: string) => accTr(l, { de: "Wird geprüft", fr: "En attente de validation", en: "Pending approval", ar: "قيد المراجعة", tr: "Onay bekliyor", es: "Pendiente de aprobación", it: "In attesa di approvazione", pt: "Aguarda aprovação", nl: "In afwachting van goedkeuring" }),
  rejected: (l: string) => accTr(l, { de: "Abgelehnt", fr: "Refusé", en: "Rejected", ar: "مرفوض", tr: "Reddedildi", es: "Rechazado", it: "Rifiutato", pt: "Recusado", nl: "Afgewezen" }),
  selected: (l: string) => accTr(l, { de: "Ausgewählt", fr: "Sélectionné", en: "Selected", ar: "محدد", tr: "Seçili", es: "Seleccionado", it: "Selezionato", pt: "Selecionado", nl: "Geselecteerd" }),
  select: (l: string) => accTr(l, { de: "Auswählen", fr: "Sélectionner", en: "Select", ar: "تحديد", tr: "Seç", es: "Seleccionar", it: "Seleziona", pt: "Selecionar", nl: "Selecteren" }),
  currency: (l: string) => accTr(l, { de: "Währung", fr: "Devise", en: "Currency", ar: "العملة", tr: "Para birimi", es: "Moneda", it: "Valuta", pt: "Moeda", nl: "Valuta" }),
  openedOn: (l: string) => accTr(l, { de: "Eröffnet am", fr: "Ouvert le", en: "Opened on", ar: "تاريخ الفتح", tr: "Açılış tarihi", es: "Abierto el", it: "Aperto il", pt: "Aberto em", nl: "Geopend op" }),
  showFull: (l: string) => accTr(l, { de: "Vollständig anzeigen", fr: "Afficher en entier", en: "Show full", ar: "عرض كامل", tr: "Tamamını göster", es: "Mostrar completo", it: "Mostra intero", pt: "Mostrar completo", nl: "Volledig tonen" }),
  pendingNote: (l: string) => accTr(l, { de: "Dieses Konto ist erst nach Freigabe durch die Bank nutzbar.", fr: "Ce compte sera utilisable après validation par la banque.", en: "This account becomes usable once the bank approves it.", ar: "يصبح هذا الحساب قابلاً للاستخدام بعد موافقة البنك.", tr: "Bu hesap banka onayladıktan sonra kullanılabilir.", es: "Esta cuenta será utilizable tras la aprobación del banco.", it: "Questo conto sarà utilizzabile dopo l'approvazione della banca.", pt: "Esta conta ficará utilizável após aprovação do banco.", nl: "Deze rekening is bruikbaar zodra de bank deze goedkeurt." }),
};

function buildNav(ui: DUI, lang: string) {
  return [
    { icon: LayoutDashboard, label: ui.nav[0], id: "dashboard" },
    { icon: Wallet, label: ui.nav[1], id: "accounts" },
    { icon: ArrowLeftRight, label: ui.nav[2], id: "transfers" },
    { icon: Banknote, label: FEES_NAV_LABEL[lang] ?? FEES_NAV_LABEL.en, id: "fees" },
    { icon: Calculator, label: ui.nav[3], id: "credits" },
    { icon: CreditCard, label: ui.nav[4], id: "cards" },
    { icon: PiggyBank, label: ui.nav[5], id: "savings" },
    { icon: Heart, label: ui.nav[6], id: "zakat" },
    { icon: FileText, label: ui.nav[7], id: "docs" },
    { icon: Shield, label: ui.nav[8], id: "kyc" },
    { icon: User, label: ui.nav[9], id: "profile" },
  ];
}

/* ── Sub-components ── */
function TxIcon({ type }: { type: string }) {
  const isIn = type === "credit";
  return (
    <div style={{ width: 40, height: 40, borderRadius: 12, background: isIn ? "#F0FDF4" : "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      {isIn ? <TrendingUp size={18} color="#16A34A" /> : <TrendingDown size={18} color="#DC2626" />}
    </div>
  );
}

function Skeleton() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px" }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: "#F1F5F9" }} />
      <div style={{ flex: 1 }}>
        <div style={{ height: 12, width: "60%", background: "#F1F5F9", borderRadius: 6, marginBottom: 6 }} />
        <div style={{ height: 10, width: "35%", background: "#F1F5F9", borderRadius: 6 }} />
      </div>
      <div style={{ height: 12, width: 60, background: "#F1F5F9", borderRadius: 6 }} />
    </div>
  );
}

/* ── Card visual component ── */
function BankCard({ card, holderName, balance, dui }: { card: KtCard; holderName: string; balance: number; dui?: DUI }) {
  const isPremium = card.type === "credit" || balance > 10000;
  return (
    <div style={{
      width: "100%", maxWidth: 380, aspectRatio: "1.586",
      background: isPremium
        ? "linear-gradient(135deg,#1A1028 0%,#2D1B69 40%,#0F3460 100%)"
        : "linear-gradient(135deg,#0D1B2A 0%,#1B2A4A 40%,#162340 100%)",
      borderRadius: 18, padding: "5% 7%", position: "relative", overflow: "hidden",
      boxShadow: "0 20px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.05)",
      display: "flex", flexDirection: "column", justifyContent: "space-between",
    }}>
      {/* Background circles */}
      <div style={{ position: "absolute", top: "-20%", right: "-10%", width: "55%", aspectRatio: "1", borderRadius: "50%", background: isPremium ? "rgba(201,168,76,0.1)" : "rgba(0,95,45,0.15)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-15%", left: "5%", width: "40%", aspectRatio: "1", borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />

      {/* Top row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
        <div style={{ width: "13%", aspectRatio: "1.4", borderRadius: 4, background: "linear-gradient(135deg,#C9A84C,#E6C97A)", boxShadow: "0 2px 8px rgba(201,168,76,0.4)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: "3%" }}>
          <Wifi size={18} color="rgba(255,255,255,0.4)" />
          <span style={{ color: isPremium ? "#C9A84C" : "rgba(255,255,255,0.7)", fontWeight: 800, fontSize: "clamp(0.65rem,2vw,0.85rem)", letterSpacing: "0.06em" }}>
            KT BANK
          </span>
        </div>
      </div>

      {/* Card number */}
      <div>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "clamp(0.55rem,1.5vw,0.68rem)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px" }}>
          {dui?.cardNumber ?? "Kartennummer"}
        </p>
        <p style={{ color: "white", fontFamily: "monospace", fontSize: "clamp(0.85rem,2.5vw,1.1rem)", fontWeight: 600, letterSpacing: "0.18em", margin: 0 }}>
          •••• •••• •••• {card.last4}
        </p>
      </div>

      {/* Bottom row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "clamp(0.5rem,1.2vw,0.6rem)", textTransform: "uppercase", margin: "0 0 2px", letterSpacing: "0.06em" }}>{dui?.cardHolder ?? "Karteninhaber"}</p>
          <p style={{ color: "white", fontWeight: 700, fontSize: "clamp(0.72rem,2vw,0.88rem)", margin: 0, letterSpacing: "0.04em", textTransform: "uppercase" }}>
            {holderName}
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "clamp(0.5rem,1.2vw,0.6rem)", textTransform: "uppercase", margin: "0 0 2px", letterSpacing: "0.06em" }}>{dui?.validUntil ?? "Gültig bis"}</p>
          <p style={{ color: "white", fontWeight: 700, fontSize: "clamp(0.72rem,2vw,0.88rem)", fontFamily: "monospace", margin: 0 }}>
            {String(card.expiry_month).padStart(2, "0")}/{String(card.expiry_year).slice(-2)}
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ color: isPremium ? "#C9A84C" : "rgba(255,255,255,0.5)", fontWeight: 700, fontSize: "clamp(0.6rem,1.5vw,0.75rem)", letterSpacing: "0.04em", margin: 0, textTransform: "capitalize" }}>
            {card.type === "debit" ? "Debit" : "Kredit"}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Section wrappers ── */
function Panel({ title, subtitle, children, action }: { title: string; subtitle?: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div style={{ background: "white", borderRadius: 18, border: "1px solid #E9EEF4", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: "1px solid #F1F5F9" }}>
        <div>
          <p style={{ color: "#0F172A", fontWeight: 700, fontSize: "0.92rem", margin: 0 }}>{title}</p>
          {subtitle && <p style={{ color: "#94A3B8", fontSize: "0.75rem", margin: "2px 0 0" }}>{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 22px", borderBottom: "1px solid #F8FAFC" }}>
      <span style={{ color: "#64748B", fontSize: "0.82rem" }}>{label}</span>
      <span style={{ color: "#0F172A", fontWeight: 500, fontSize: "0.85rem", fontFamily: mono ? "monospace" : "inherit" }}>{value}</span>
    </div>
  );
}

/* ── KYC PAGE (module-level) ── */
function KycPage({ token, kycStatus, accountStatus, activationRequired, dui }: {
  token: string; kycStatus: string; accountStatus: string; activationRequired: boolean; dui?: DUI;
}) {
  const DOC_TYPES = [
    { id: "id_front", label: dui?.docFront ?? "Vorderseite Ausweis", desc: "Vorderseite Personalausweis oder Reisepass" },
    { id: "id_back",  label: dui?.docBack ?? "Rückseite Ausweis",   desc: "Rückseite Personalausweis (nicht nötig bei Reisepass)" },
    { id: "selfie",   label: dui?.docSelfie ?? "Selfie mit Ausweis", desc: "Foto von Ihnen, auf dem Sie Ihren Ausweis halten" },
  ] as const;
  const [docs, setDocs] = React.useState<KycDocument[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [uploading, setUploading] = React.useState<string | null>(null);
  const [uploadErr, setUploadErr] = React.useState<string | null>(null);
  const [uploadOk, setUploadOk] = React.useState<string | null>(null);

  function fetchDocs() {
    fetch("/api/kt/client/kyc", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setDocs(d.documents ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }
  React.useEffect(() => { fetchDocs(); }, [token]);

  async function upload(docType: string, file: File) {
    setUploading(docType); setUploadErr(null); setUploadOk(null);
    const fd = new FormData();
    fd.append("file", file); fd.append("document_type", docType);
    const res = await fetch("/api/kt/client/kyc", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    const data = await res.json();
    if (!res.ok) { setUploadErr(data.error || "Fehler"); }
    else { setUploadOk(docType); fetchDocs(); }
    setUploading(null);
  }

  const docMap = Object.fromEntries(docs.map(d => [d.document_type, d]));

  const statusBg: Record<string, string> = {
    unverified: "#FEF2F2", pending: "#FFFBF0", approved: "#F0FDF4", rejected: "#FEF2F2",
  };
  const statusColor: Record<string, string> = {
    unverified: "#991B1B", pending: "#92400E", approved: "#166534", rejected: "#991B1B",
  };
  const statusLabel: Record<string, string> = {
    unverified: "Nicht verifiziert", pending: "Wird überprüft", approved: "Verifiziert ✓", rejected: "Abgelehnt",
  };
  const statusIcon: Record<string, React.ReactNode> = {
    unverified: <AlertCircle size={20} color="#DC2626" />,
    pending: <Clock size={20} color="#D97706" />,
    approved: <Check size={20} color="#16A34A" />,
    rejected: <AlertCircle size={20} color="#DC2626" />,
  };

  const effectiveKyc = kycStatus || "unverified";

  return (
    <div style={{ padding: 24, maxWidth: 640 }}>
      <h2 style={{ color: "#0F172A", fontWeight: 800, fontSize: "1.2rem", margin: "0 0 20px" }}>KYC / Identitätsverifizierung</h2>

      {/* Status banner */}
      <div style={{ background: statusBg[effectiveKyc] ?? "#F8FAFC", border: `1px solid ${statusColor[effectiveKyc] ?? "#94A3B8"}30`, borderRadius: 16, padding: "18px 22px", marginBottom: 20, display: "flex", alignItems: "center", gap: 14 }}>
        {statusIcon[effectiveKyc]}
        <div>
          <p style={{ color: statusColor[effectiveKyc] ?? "#334155", fontWeight: 700, fontSize: "0.9rem", margin: 0 }}>{statusLabel[effectiveKyc] ?? effectiveKyc}</p>
          <p style={{ color: statusColor[effectiveKyc] ?? "#334155", fontSize: "0.78rem", margin: "3px 0 0", opacity: 0.8 }}>
            {effectiveKyc === "unverified" && "Laden Sie Ihre Identitätsdokumente hoch, um Ihr Konto freizuschalten."}
            {effectiveKyc === "pending" && "Ihre Dokumente werden geprüft. Dies dauert in der Regel 1–3 Werktage."}
            {effectiveKyc === "approved" && accountStatus === "active" && "Ihr Konto ist vollständig verifiziert und aktiv."}
            {effectiveKyc === "approved" && accountStatus !== "active" && "KYC abgeschlossen. Aktivierungseinzahlung erforderlich (siehe unten)."}
            {effectiveKyc === "rejected" && "Ihre Dokumente wurden abgelehnt. Bitte laden Sie neue Dokumente hoch."}
          </p>
        </div>
      </div>

      {/* Activation deposit instructions */}
      {effectiveKyc === "approved" && accountStatus !== "active" && activationRequired && (
        <div style={{ background: "#FFFBF0", border: "2px solid #FDE68A", borderRadius: 16, padding: "20px 22px", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <Building2 size={18} color="#D97706" />
            <p style={{ color: "#92400E", fontWeight: 700, fontSize: "0.9rem", margin: 0 }}>Kontoaktivierung — Mindesteinzahlung erforderlich</p>
          </div>
          <p style={{ color: "#78350F", fontSize: "0.82rem", margin: "0 0 14px", lineHeight: 1.6 }}>
            Um Ihr Konto zu aktivieren, überweisen Sie bitte einen <strong>Mindestbetrag von 250 €</strong> auf folgendes Konto:
          </p>
          {[
            [dui?.recipientLabel ?? "Empfänger", "KT Bank AG"],
            ["IBAN", "DE89 3704 0044 0532 0130 00"],
            ["BIC", "KTAGDEFF"],
            [dui?.purposeLabel ?? "Verwendungszweck", dui?.activationPurpose ?? "AKTIVIERUNG"],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #FDE68A" }}>
              <span style={{ color: "#92400E", fontSize: "0.78rem" }}>{k}</span>
              <span style={{ color: "#78350F", fontWeight: 700, fontSize: "0.82rem", fontFamily: k === "IBAN" || k === "BIC" ? "monospace" : "inherit" }}>{v}</span>
            </div>
          ))}
        </div>
      )}

      {/* Document upload section (shown if not yet approved) */}
      {effectiveKyc !== "approved" && (
        <div style={{ background: "white", borderRadius: 18, border: "1px solid #E9EEF4", overflow: "hidden" }}>
          <div style={{ padding: "16px 22px", borderBottom: "1px solid #F1F5F9" }}>
            <p style={{ color: "#0F172A", fontWeight: 700, fontSize: "0.88rem", margin: 0 }}>Erforderliche Dokumente</p>
            <p style={{ color: "#64748B", fontSize: "0.75rem", margin: "3px 0 0" }}>Akzeptierte Formate: JPG, PNG, PDF — max. 10 MB pro Datei</p>
          </div>
          {uploadErr && (
            <div style={{ margin: "14px 22px 0", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "10px 14px" }}>
              <p style={{ color: "#DC2626", fontSize: "0.8rem", margin: 0 }}>{uploadErr}</p>
            </div>
          )}
          {loading ? (
            <div style={{ padding: "32px", textAlign: "center" }}>
              <RefreshCw size={20} color="#CBD5E1" style={{ animation: "spin 1s linear infinite" }} />
            </div>
          ) : (
            DOC_TYPES.map(({ id: docType, label, desc }) => {
              const existing = docMap[docType];
              const isUploading = uploading === docType;
              const justUploaded = uploadOk === docType;
              return (
                <div key={docType} style={{ padding: "16px 22px", borderBottom: "1px solid #F8FAFC" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ color: "#0F172A", fontWeight: 600, fontSize: "0.85rem", margin: 0 }}>{label}</p>
                      <p style={{ color: "#94A3B8", fontSize: "0.72rem", margin: "2px 0 0" }}>{desc}</p>
                      {existing && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 5, background: existing.status === "pending" ? "#FFFBF0" : "#F0FDF4", color: existing.status === "pending" ? "#D97706" : "#16A34A", fontSize: "0.68rem", fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>
                          {existing.status === "pending" ? "⏳ In Bearbeitung" : "✓ Eingereicht"}
                        </span>
                      )}
                    </div>
                    <label style={{ display: "flex", alignItems: "center", gap: 6, height: 36, padding: "0 14px", background: isUploading ? "#F1F5F9" : justUploaded ? "#F0FDF4" : existing ? "#F8FAFC" : "#005F2D", border: `1px solid ${existing ? "#E2E8F0" : "transparent"}`, borderRadius: 10, color: isUploading ? "#94A3B8" : justUploaded ? "#16A34A" : existing ? "#64748B" : "white", fontWeight: 600, fontSize: "0.78rem", cursor: isUploading ? "not-allowed" : "pointer", whiteSpace: "nowrap" }}>
                      {isUploading ? <><RefreshCw size={12} /> Lädt…</> : justUploaded ? <><Check size={12} /> Hochgeladen</> : existing ? <><RefreshCw size={12} /> Ersetzen</> : <><Plus size={12} /> Hochladen</>}
                      <input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" style={{ display: "none" }}
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(docType, f); e.target.value = ""; }}
                        disabled={isUploading} />
                    </label>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Approved — all good */}
      {effectiveKyc === "approved" && accountStatus === "active" && (
        <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 16, padding: "24px", textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
            <Check size={26} color="#16A34A" />
          </div>
          <p style={{ color: "#166534", fontWeight: 800, fontSize: "1rem", margin: "0 0 6px" }}>Konto vollständig verifiziert</p>
          <p style={{ color: "#166534", fontSize: "0.82rem", margin: 0, opacity: 0.75 }}>Alle KYC-Anforderungen erfüllt. Voller Zugang zu allen Diensten.</p>
        </div>
      )}
    </div>
  );
}

/* ── TRANSFERS PAGE (module-level to prevent remount on parent re-render) ── */
const TRANSFER_STORAGE_KEY = "kt_pending_transfer";

const PROGRESS_STEPS = [
  { from: 0,  msg: "Sicherheitsprüfung läuft…" },
  { from: 10, msg: "Kontodaten werden verifiziert…" },
  { from: 22, msg: "Verbindung zum SEPA-Netzwerk wird aufgebaut…" },
  { from: 34, msg: "Compliance-Prüfung wird durchgeführt…" },
  { from: 46, msg: "Betrugsschutz-Analyse läuft…" },
  { from: 55, msg: "Risikobewertung des Auftrags läuft…" },
  { from: 61, msg: "Abschließende Überprüfung der Konditionen…" },
];
function getMsgForProgress(p: number) {
  let msg = PROGRESS_STEPS[0].msg;
  for (const s of PROGRESS_STEPS) { if (p >= s.from) msg = s.msg; }
  return msg;
}

function TransfersPage({ token, balance, transferRequests, kycStatus, accountStatus, onGoToKyc }: {
  token: string; balance: number; transferRequests: TransferRequest[];
  kycStatus: string; accountStatus: string; onGoToKyc: () => void;
}) {
  const [form, setForm] = useState({ to: "", iban: "", amount: "", ref: "" });
  const [phase, setPhase] = useState<"form" | "progress" | "fee" | "error">("form");
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState(PROGRESS_STEPS[0].msg);
  const [errorMsg, setErrorMsg] = useState("");
  const [feeInfo, setFeeInfo] = useState<{ transferId: string; fee: { amount: number; currency: string }; feePayment: Record<string, string> } | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const apiResultRef = useRef<Record<string, unknown> | null>(null);
  const apiErrorRef = useRef<string | null>(null);

  const statusLabels: Record<string, [string, string, string]> = {
    pending_fee:  ["#FFFBF0", "#D97706", "Gebühr ausstehend"],
    processing:   ["#EFF6FF", "#2563EB", "In Bearbeitung"],
    completed:    ["#F0FDF4", "#16A34A", "Ausgeführt"],
    rejected:     ["#FEF2F2", "#DC2626", "Abgelehnt"],
    cancelled:    ["#F8FAFC", "#94A3B8", "Storniert"],
  };

  // Restore any in-progress transfer from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(TRANSFER_STORAGE_KEY);
      if (saved) {
        const p = JSON.parse(saved);
        if (p.timestamp && Date.now() - p.timestamp < 24 * 3600 * 1000 && p.transferId) {
          setFeeInfo({ transferId: p.transferId, fee: p.fee, feePayment: p.feePayment });
          if (p.form) setForm(p.form);
          setProgress(62);
          setPhase("fee");
        } else {
          localStorage.removeItem(TRANSFER_STORAGE_KEY);
        }
      }
    } catch { /* ignore */ }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  // If the saved transfer is no longer pending_fee (proof already submitted), clear localStorage
  useEffect(() => {
    if (transferRequests.length === 0) return;
    try {
      const saved = localStorage.getItem(TRANSFER_STORAGE_KEY);
      if (!saved) return;
      const p = JSON.parse(saved);
      if (!p.transferId) return;
      const match = transferRequests.find((t) => t.id === p.transferId);
      if (match && match.status !== "pending_fee") {
        localStorage.removeItem(TRANSFER_STORAGE_KEY);
        setPhase("form");
        setFeeInfo(null);
      }
    } catch { /* ignore */ }
  }, [transferRequests]);

  // Send fee email 60s after fee screen is shown (never before)
  useEffect(() => {
    if (phase !== "fee" || !feeInfo?.transferId) return;
    const timer = setTimeout(() => {
      fetch("/api/kt/client/transfer/notify-fee", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ transfer_id: feeInfo.transferId }),
      }).catch(() => {});
    }, 60_000);
    return () => clearTimeout(timer);
  }, [phase, feeInfo?.transferId, token]);

  function applyApiSuccess(data: Record<string, unknown>, currentForm: typeof form) {
    const transferId = data.transfer_id as string;

    // Fee-free: skip fee screen, redirect with simulation
    if (data.fee_free === true) {
      try { localStorage.removeItem(TRANSFER_STORAGE_KEY); } catch { /* ignore */ }
      window.location.href = `/client/transfer-payment?id=${transferId}&fee_free=1`;
      return;
    }

    const fee = data.fee as { amount: number; currency: string };
    const feePayment = (data.fee_payment ?? {}) as Record<string, string>;
    setFeeInfo({ transferId, fee, feePayment });
    try {
      localStorage.setItem(TRANSFER_STORAGE_KEY, JSON.stringify({
        transferId, fee, feePayment, form: currentForm, timestamp: Date.now(),
      }));
    } catch { /* ignore */ }
    setPhase("fee");
  }

  async function submit() {
    if (!form.to || !form.iban || !form.amount) return;
    if (Number(form.amount) <= 0) { setErrorMsg("Ungültiger Betrag"); return; }
    if (Number(form.amount) > balance) {
      setErrorMsg(`Unzureichendes Guthaben. Verfügbar: ${balance.toLocaleString("de-DE", { minimumFractionDigits: 2 })} €`);
      return;
    }
    setErrorMsg("");
    setPhase("progress");
    setProgress(0);
    setStatusMsg(PROGRESS_STEPS[0].msg);
    apiResultRef.current = null;
    apiErrorRef.current = null;

    // Snapshot form for localStorage later
    const currentForm = { ...form };

    // ── Launch API call in background (parallel with animation) ──
    fetch("/api/kt/client/transfer", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ to_name: form.to, to_iban: form.iban, amount: Number(form.amount), reference: form.ref }),
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) {
        apiErrorRef.current =
          data.code === "KYC_REQUIRED" ? "KYC-Verifizierung erforderlich. Bitte laden Sie Ihre Dokumente im KYC-Bereich hoch." :
          data.code === "ACCOUNT_SUSPENDED" ? "Ihr Konto ist deaktiviert. Bitte kontaktieren Sie Ihren Berater." :
          data.code === "INSUFFICIENT_FUNDS" ? `Unzureichendes Guthaben. Kontostand: ${Number(data.balance).toLocaleString("de-DE", { minimumFractionDigits: 2 })} €` :
          (data.error as string) || "Fehler bei der Bearbeitung.";
      } else {
        apiResultRef.current = data;
      }
    }).catch(() => {
      apiErrorRef.current = "Netzwerkfehler. Bitte prüfen Sie Ihre Verbindung und versuchen Sie es erneut.";
    });

    // ── Animate 0→62% over ~60 seconds (967ms per step) ──
    let p = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      p += 1;
      setProgress(p);
      setStatusMsg(getMsgForProgress(p));

      if (p >= 62) {
        clearInterval(intervalRef.current!);

        // Check if API already responded
        if (apiErrorRef.current) {
          setErrorMsg(apiErrorRef.current);
          setPhase("error");
          return;
        }
        if (apiResultRef.current) {
          applyApiSuccess(apiResultRef.current, currentForm);
          return;
        }

        // API still in flight — pause at 62% and wait
        setStatusMsg("Abschließende Überprüfung läuft — bitte warten…");
        pollRef.current = setInterval(() => {
          if (apiErrorRef.current) {
            clearInterval(pollRef.current!);
            setErrorMsg(apiErrorRef.current);
            setPhase("error");
          } else if (apiResultRef.current) {
            clearInterval(pollRef.current!);
            applyApiSuccess(apiResultRef.current, currentForm);
          }
        }, 500);
      }
    }, 967);
  }

  function goToPayment() {
    if (!feeInfo) return;
    sessionStorage.setItem("kt_transfer_payment", JSON.stringify({
      transferId: feeInfo.transferId,
      feePayment: feeInfo.feePayment,
    }));
    window.location.href = `/client/transfer-payment?id=${feeInfo.transferId}`;
  }

  function reset() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (pollRef.current) clearInterval(pollRef.current);
    try { localStorage.removeItem(TRANSFER_STORAGE_KEY); } catch { /* ignore */ }
    setPhase("form"); setProgress(0);
    setForm({ to: "", iban: "", amount: "", ref: "" });
    setErrorMsg(""); setFeeInfo(null);
    setStatusMsg(PROGRESS_STEPS[0].msg);
    apiResultRef.current = null;
    apiErrorRef.current = null;
  }

  // KYC / activation blocking views
  if (kycStatus !== "approved") {
    return (
      <div style={{ padding: 24, maxWidth: 620 }}>
        <h2 style={{ color: "#0F172A", fontWeight: 800, fontSize: "1.2rem", margin: "0 0 20px" }}>SEPA-Überweisung</h2>
        <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 18, padding: "36px 28px", textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#FEE2E2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Shield size={26} color="#DC2626" />
          </div>
          <p style={{ color: "#991B1B", fontWeight: 800, fontSize: "1rem", margin: "0 0 8px" }}>KYC-Verifizierung erforderlich</p>
          <p style={{ color: "#DC2626", fontSize: "0.85rem", margin: "0 0 24px", lineHeight: 1.6, maxWidth: 380, marginLeft: "auto", marginRight: "auto" }}>
            Ihre Identität muss zuerst verifiziert werden, bevor Sie Überweisungen tätigen können. Bitte laden Sie Ihre Dokumente im KYC-Bereich hoch.
          </p>
          <button onClick={onGoToKyc} style={{ height: 44, padding: "0 24px", background: "#DC2626", border: "none", borderRadius: 12, color: "white", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}>
            <Shield size={15} /> KYC abschließen →
          </button>
        </div>
      </div>
    );
  }

  if (accountStatus !== "active") {
    return (
      <div style={{ padding: 24, maxWidth: 620 }}>
        <h2 style={{ color: "#0F172A", fontWeight: 800, fontSize: "1.2rem", margin: "0 0 20px" }}>SEPA-Überweisung</h2>
        <div style={{ background: "#FFFBF0", border: "1px solid #FDE68A", borderRadius: 18, padding: "36px 28px", textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <AlertCircle size={26} color="#D97706" />
          </div>
          <p style={{ color: "#92400E", fontWeight: 800, fontSize: "1rem", margin: "0 0 8px" }}>Konto noch nicht aktiviert</p>
          <p style={{ color: "#78350F", fontSize: "0.85rem", margin: "0 0 24px", lineHeight: 1.6 }}>
            Ihr Konto benötigt eine Aktivierungseinzahlung von mindestens 250 €. Bitte schauen Sie im KYC-Bereich nach den Überweisungsdetails.
          </p>
          <button onClick={onGoToKyc} style={{ height: 44, padding: "0 24px", background: "#D97706", border: "none", borderRadius: 12, color: "white", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}>
            <Shield size={15} /> Konto aktivieren →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 620 }}>
      <h2 style={{ color: "#0F172A", fontWeight: 800, fontSize: "1.2rem", margin: "0 0 20px" }}>SEPA-Überweisung</h2>

      {/* ── PROGRESS / FEE SCREEN ── */}
      {(phase === "progress" || phase === "fee") && (
        <div style={{ background: "white", borderRadius: 18, border: "1px solid #E9EEF4", padding: 28, marginBottom: 20 }}>
          <p style={{ color: "#0F172A", fontWeight: 700, fontSize: "0.95rem", margin: "0 0 4px" }}>
            {phase === "fee" ? "Bearbeitungsgebühr erforderlich" : "Überweisung wird verarbeitet"}
          </p>
          <p style={{ color: "#64748B", fontSize: "0.82rem", margin: "0 0 20px" }}>
            {Number(form.amount).toLocaleString("de-DE", { minimumFractionDigits: 2 })} € → {form.to}
          </p>

          {/* Progress bar */}
          <div style={{ position: "relative", height: 10, background: "#F1F5F9", borderRadius: 99, overflow: "hidden", marginBottom: 8 }}>
            <div style={{
              height: "100%", borderRadius: 99,
              background: phase === "fee"
                ? "linear-gradient(90deg,#D97706,#F59E0B)"
                : "linear-gradient(90deg,#005F2D,#22C55E)",
              width: `${progress}%`,
              transition: "width 0.9s linear",
            }} />
          </div>

          {phase === "progress" && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <p style={{ color: "#64748B", fontSize: "0.75rem", margin: 0, display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 0 3px rgba(34,197,94,0.2)", animation: "pulse 1.5s infinite" }} />
                  {statusMsg}
                </p>
                <p style={{ color: "#94A3B8", fontSize: "0.75rem", margin: 0, fontWeight: 600 }}>{progress}%</p>
              </div>
              {/* Step timeline */}
              <div style={{ display: "flex", gap: 4, marginTop: 10 }}>
                {PROGRESS_STEPS.map((s, i) => (
                  <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: progress >= s.from ? "#005F2D" : "#E2E8F0", transition: "background 0.5s" }} />
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                {["Sicherheit", "Konto", "SEPA", "Compliance", "Schutz", "Risiko", "Freigabe"].map((l, i) => (
                  <p key={i} style={{ color: progress >= PROGRESS_STEPS[i].from ? "#005F2D" : "#CBD5E1", fontSize: "0.6rem", margin: 0, fontWeight: progress >= PROGRESS_STEPS[i].from ? 700 : 400 }}>{l}</p>
                ))}
              </div>
            </div>
          )}

          {phase === "fee" && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <p style={{ color: "#D97706", fontSize: "0.75rem", margin: 0, fontWeight: 700 }}>⚠ Bearbeitungsgebühr erforderlich — Überweisung blockiert</p>
              <p style={{ color: "#94A3B8", fontSize: "0.75rem", margin: 0 }}>62%</p>
            </div>
          )}

          {phase === "fee" && feeInfo && (
            <div>
              <div style={{ background: "#FFFBF0", border: "1px solid #FDE68A", borderRadius: 14, padding: "16px 18px", marginBottom: 16 }}>
                <p style={{ color: "#92400E", fontWeight: 700, fontSize: "0.9rem", margin: "0 0 6px" }}>
                  Bearbeitungsgebühr: {feeInfo.fee.amount} {feeInfo.fee.currency}
                </p>
                <p style={{ color: "#78350F", fontSize: "0.8rem", margin: 0, lineHeight: 1.6 }}>
                  Ihre Überweisung ist blockiert. Zahlen Sie die Bearbeitungsgebühr um fortzufahren.
                  Sie werden auf eine sichere Zahlungsseite weitergeleitet, wo Sie die Bankdaten kopieren und Ihren Zahlungsbeleg einreichen können.
                </p>
              </div>
              <button onClick={goToPayment}
                style={{ width: "100%", height: 50, background: "#D97706", border: "none", borderRadius: 12, color: "white", fontWeight: 800, fontSize: "0.95rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <Send size={16} /> Gebühr bezahlen →
              </button>
              <button onClick={reset} style={{ width: "100%", marginTop: 8, height: 38, background: "transparent", border: "1px solid #E2E8F0", borderRadius: 10, color: "#94A3B8", fontSize: "0.82rem", cursor: "pointer" }}>
                Abbrechen
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── FORM ── */}
      {(phase === "form" || phase === "error") && (
        <div style={{ background: "white", borderRadius: 18, border: "1px solid #E9EEF4", padding: 24, display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
          {phase === "error" && errorMsg && (
            <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "11px 14px", display: "flex", gap: 8, alignItems: "flex-start" }}>
              <AlertCircle size={15} color="#DC2626" style={{ marginTop: 1, flexShrink: 0 }} />
              <p style={{ color: "#991B1B", fontSize: "0.82rem", margin: 0 }}>{errorMsg}</p>
            </div>
          )}
          {[
            { label: "Name des Begünstigten", key: "to", placeholder: "Max Mustermann", type: "text" },
            { label: "IBAN des Begünstigten", key: "iban", placeholder: "DE89 3704 0044 0532 0130 00", type: "text" },
            { label: "Betrag (€)", key: "amount", placeholder: "0.00", type: "number" },
            { label: "Verwendungszweck", key: "ref", placeholder: "Miete Mai 2025", type: "text" },
          ].map(({ label, key, placeholder, type }) => (
            <div key={key}>
              <label style={{ color: "#64748B", fontSize: "0.75rem", fontWeight: 600, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</label>
              <input type={type} placeholder={placeholder} value={form[key as keyof typeof form]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                style={{ width: "100%", height: 46, background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, color: "#0F172A", fontSize: "0.9rem", padding: "0 14px", boxSizing: "border-box", outline: "none" }} />
            </div>
          ))}
          {balance <= 0 && (
            <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "10px 14px", display: "flex", gap: 8 }}>
              <AlertCircle size={15} color="#DC2626" style={{ marginTop: 1, flexShrink: 0 }} />
              <p style={{ color: "#991B1B", fontSize: "0.78rem", margin: 0 }}>Ihr Guthaben reicht nicht für eine Überweisung aus.</p>
            </div>
          )}
          <div style={{ background: "#FFFBF0", border: "1px solid #FDE68A", borderRadius: 10, padding: "10px 14px", display: "flex", gap: 8 }}>
            <AlertCircle size={15} color="#D97706" style={{ marginTop: 1, flexShrink: 0 }} />
            <p style={{ color: "#92400E", fontSize: "0.78rem", margin: 0, lineHeight: 1.5 }}>Bearbeitungsgebühren werden bei der Einreichung erhoben.</p>
          </div>
          <button onClick={submit} disabled={!form.to || !form.iban || !form.amount || balance <= 0}
            style={{ height: 48, background: "#005F2D", border: "none", borderRadius: 12, color: "white", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", opacity: (!form.to || !form.iban || !form.amount || balance <= 0) ? 0.5 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Send size={16} /> Überweisung senden
          </button>
        </div>
      )}

      {/* ── TRANSFER HISTORY ── */}
      {transferRequests.length > 0 && (
        <div style={{ background: "white", borderRadius: 18, border: "1px solid #E9EEF4", overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #F1F5F9" }}>
            <p style={{ color: "#0F172A", fontWeight: 700, fontSize: "0.88rem", margin: 0 }}>Meine Überweisungsaufträge</p>
          </div>
          {transferRequests.map((t) => {
            const [bg, color, label] = statusLabels[t.status] ?? ["#F8FAFC", "#64748B", t.status];
            return (
              <div key={t.id} style={{ padding: "14px 20px", borderBottom: "1px solid #F8FAFC" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: "#0F172A", fontWeight: 600, fontSize: "0.85rem", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.to_name}</p>
                    <p style={{ color: "#94A3B8", fontFamily: "monospace", fontSize: "0.72rem", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.to_iban}</p>
                    {t.reference && <p style={{ color: "#CBD5E1", fontSize: "0.7rem", margin: 0 }}>Ref: {t.reference}</p>}
                    {t.rejection_reason && (
                      <div style={{ marginTop: 6, background: "#FEF2F2", borderRadius: 8, padding: "5px 10px", display: "inline-block" }}>
                        <p style={{ color: "#DC2626", fontSize: "0.72rem", margin: 0 }}>Ablehnungsgrund: {t.rejection_reason}</p>
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <p style={{ color: "#DC2626", fontWeight: 700, fontSize: "0.88rem", margin: "0 0 4px" }}>−{Number(t.amount).toLocaleString("de-DE", { minimumFractionDigits: 2 })} €</p>
                    <span style={{ background: bg, color, fontSize: "0.68rem", fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>{label}</span>
                    <p style={{ color: "#CBD5E1", fontSize: "0.68rem", margin: "4px 0 0" }}>{fmtDate(t.created_at)}</p>
                  </div>
                </div>
                {t.status === "pending_fee" && (
                  <button onClick={() => { window.location.href = `/client/transfer-payment?id=${t.id}`; }}
                    style={{ marginTop: 10, height: 34, padding: "0 14px", background: "#D97706", border: "none", borderRadius: 8, color: "white", fontWeight: 700, fontSize: "0.75rem", cursor: "pointer" }}>
                    Gebühr bezahlen →
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── CREDIT PAGE ── */
type CreditRequest = {
  id: string; type: string; amount: number; duration_months: number;
  monthly_payment: number; total_repayment: number; interest_rate: number;
  purpose?: string; status: string; rejection_reason?: string; created_at: string;
};

function CreditPage({ token, profile, account, onViewDoc }: { token: string; profile: Profile | null; account: Account | null; onViewDoc: (html: string) => void }) {
  const [step, setStep] = useState<"list" | "form" | "amortization" | "done">("list");
  const [requests, setRequests] = useState<CreditRequest[]>([]);
  const [loadingReqs, setLoadingReqs] = useState(true);
  const [creditType, setCreditType] = useState<"islamic" | "standard">("islamic");
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("24");
  const [purpose, setPurpose] = useState("");
  const [employment, setEmployment] = useState("");
  const [income, setIncome] = useState("");
  const [debts, setDebts] = useState("");
  const [marital, setMarital] = useState("");
  const [dependents, setDependents] = useState("0");
  const [propertyOwned, setPropertyOwned] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [lastRequestId, setLastRequestId] = useState<string | null>(null);

  const amt = Number(amount) || 0;
  const dur = Number(duration) || 1;
  const rate = creditType === "islamic" ? 0 : 0.02 / 12;
  const monthly = creditType === "islamic"
    ? amt / dur
    : rate > 0 ? amt * rate * Math.pow(1 + rate, dur) / (Math.pow(1 + rate, dur) - 1) : amt / dur;
  const totalRepayment = monthly * dur;
  const totalInterest = totalRepayment - amt;

  function fmtMoney(n: number) { return n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €"; }

  function loadRequests() {
    setLoadingReqs(true);
    fetch("/api/kt/client/credit", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => { setRequests(d.requests ?? []); setLoadingReqs(false); })
      .catch(() => setLoadingReqs(false));
  }

  useEffect(() => { loadRequests(); }, []); // eslint-disable-line

  async function submit() {
    if (!amount || amt <= 0) return;
    setSubmitting(true);
    const res = await fetch("/api/kt/client/credit", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        type: creditType,
        amount: amt,
        duration_months: dur,
        monthly_payment: monthly,
        total_repayment: totalRepayment,
        interest_rate: creditType === "islamic" ? 0 : 0.02,
        purpose: purpose || undefined,
        employment_status: employment || undefined,
        monthly_income: income ? Number(income) : undefined,
        existing_debts: debts ? Number(debts) : 0,
        marital_status: marital || undefined,
        dependents: Number(dependents),
        property_owned: propertyOwned,
      }),
    });
    const d = await res.json();
    setSubmitting(false);
    if (res.ok) {
      setLastRequestId(d.id ?? null);
      setStep("done");
      loadRequests();
    }
  }

  function printAmortization() {
    const clientInfo = {
      prenom: profile?.prenom ?? "—",
      nom: profile?.nom ?? "—",
      email: profile?.email ?? "—",
      telephone: profile?.telephone,
      adresse: profile?.adresse,
      code_postal: profile?.code_postal,
      ville: profile?.ville,
      pays_residence: profile?.pays_residence,
      nationalite: profile?.nationalite,
      created_at: profile?.created_at ?? new Date().toISOString(),
      iban: account?.iban,
      bic: account?.bic,
      account_id: account?.id,
    };
    const html = genTilgungsplan(clientInfo, {
      type: creditType,
      amount: amt,
      duration_months: dur,
      monthly_payment: monthly,
      total_repayment: totalRepayment,
      interest_rate: creditType === "islamic" ? 0 : 0.02,
      purpose: purpose || undefined,
    });
    onViewDoc(html);
  }

  const statusMap: Record<string, [string, string, string]> = {
    pending:  ["#FFF7ED", "#D97706", "Wird geprüft"],
    approved: ["#F0FDF4", "#16A34A", "Genehmigt ✓"],
    rejected: ["#FEF2F2", "#DC2626", "Abgelehnt"],
  };

  /* ── DONE STATE ── */
  if (step === "done") {
    return (
      <div style={{ padding: "24px 20px", maxWidth: 560 }}>
        <div style={{ background: "white", borderRadius: 20, border: "1px solid #E9EEF4", padding: 32, textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Check size={28} color="#16A34A" />
          </div>
          <h2 style={{ color: "#0F172A", fontWeight: 800, fontSize: "1.2rem", margin: "0 0 10px" }}>Antrag erfolgreich eingereicht</h2>
          <p style={{ color: "#64748B", fontSize: "0.88rem", lineHeight: 1.7, margin: "0 0 24px" }}>
            Ihr Kreditantrag wurde an unser Team weitergeleitet. Sie erhalten innerhalb von <strong>48 Stunden</strong> eine Antwort per E-Mail.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={printAmortization}
              style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 20px", background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 12, color: "#005F2D", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}>
              <FileText size={15} /> Tilgungsplan
            </button>
            <button onClick={() => { setStep("list"); setAmount(""); setDuration("24"); setPurpose(""); setEmployment(""); setIncome(""); setDebts(""); setMarital(""); setDependents("0"); setPropertyOwned(false); }}
              style={{ padding: "10px 20px", background: "#005F2D", border: "none", borderRadius: 12, color: "white", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}>
              Meine Anträge
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── LIST ── */
  if (step === "list") {
    return (
      <div style={{ padding: "24px 20px", maxWidth: 720 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h2 style={{ color: "#0F172A", fontWeight: 800, fontSize: "1.25rem", margin: 0 }}>Bankkredit</h2>
            <p style={{ color: "#64748B", fontSize: "0.82rem", margin: "4px 0 0" }}>Islamischer Kredit (0%) oder Standard (2%)</p>
          </div>
          <button onClick={() => setStep("form")}
            style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 20px", background: "#005F2D", border: "none", borderRadius: 12, color: "white", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer" }}>
            <Plus size={15} /> Neuer Antrag
          </button>
        </div>

        {/* Info cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
          {[
            { type: "islamic", title: "Islamischer Kredit", rate: "0%", color: "#16A34A", bg: "#F0FDF4", border: "#BBF7D0", desc: "Zinsfrei — Murabaha-konform. Nur Kapitalrückzahlung." },
            { type: "standard", title: "Standard-Kredit", rate: "2%", color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE", desc: "2% Jahreszins. BaFin-konform." },
          ].map((c) => (
            <div key={c.type} style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 14, padding: "16px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <p style={{ color: "#0F172A", fontWeight: 700, fontSize: "0.88rem", margin: 0 }}>{c.title}</p>
                <span style={{ background: "white", color: c.color, fontWeight: 800, fontSize: "0.88rem", padding: "2px 10px", borderRadius: 20, border: `1px solid ${c.border}` }}>{c.rate}</span>
              </div>
              <p style={{ color: "#374151", fontSize: "0.78rem", margin: 0, lineHeight: 1.5 }}>{c.desc}</p>
            </div>
          ))}
        </div>

        {/* Existing requests */}
        {loadingReqs ? (
          <p style={{ color: "#94A3B8", fontSize: "0.85rem", textAlign: "center", padding: 20 }}>Wird geladen…</p>
        ) : requests.length === 0 ? (
          <div style={{ background: "white", borderRadius: 16, border: "1px solid #E9EEF4", padding: "36px 24px", textAlign: "center" }}>
            <Calculator size={36} color="#CBD5E1" style={{ display: "block", margin: "0 auto 12px" }} />
            <p style={{ color: "#94A3B8", fontSize: "0.88rem", margin: 0 }}>Keine Kreditanträge vorhanden.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {requests.map((r) => {
              const [bg, color, label] = statusMap[r.status] ?? ["#F1F5F9", "#64748B", r.status];
              return (
                <div key={r.id} style={{ background: "white", borderRadius: 14, border: "1px solid #E9EEF4", padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 160 }}>
                    <p style={{ color: "#0F172A", fontWeight: 700, fontSize: "0.9rem", margin: "0 0 3px" }}>
                      {r.type === "islamic" ? "Islamischer Kredit (0%)" : "Standard-Kredit (2%)"}
                    </p>
                    {r.purpose && <p style={{ color: "#64748B", fontSize: "0.75rem", margin: 0 }}>{r.purpose}</p>}
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ color: "#94A3B8", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 2px" }}>Betrag</p>
                    <p style={{ color: "#005F2D", fontWeight: 800, fontSize: "1rem", margin: 0 }}>{fmtMoney(r.amount)}</p>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ color: "#94A3B8", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 2px" }}>Monatl. Rate</p>
                    <p style={{ color: "#374151", fontWeight: 700, fontSize: "0.88rem", margin: 0 }}>{fmtMoney(r.monthly_payment)}</p>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ color: "#94A3B8", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 2px" }}>Laufzeit</p>
                    <p style={{ color: "#374151", fontWeight: 700, fontSize: "0.88rem", margin: 0 }}>{r.duration_months} Monate</p>
                  </div>
                  <div>
                    <span style={{ background: bg, color, fontSize: "0.72rem", fontWeight: 700, padding: "4px 12px", borderRadius: 20 }}>{label}</span>
                    {r.rejection_reason && (
                      <p style={{ color: "#DC2626", fontSize: "0.72rem", margin: "4px 0 0", maxWidth: 200 }}>{r.rejection_reason}</p>
                    )}
                  </div>
                  <p style={{ color: "#CBD5E1", fontSize: "0.7rem", margin: 0 }}>{fmtDate(r.created_at)}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  /* ── FORM ── */
  return (
    <div style={{ padding: "24px 20px", maxWidth: 620 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
        <button onClick={() => setStep("list")} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B", display: "flex", alignItems: "center", gap: 5, fontSize: "0.82rem", padding: 0 }}>
          ← Zurück
        </button>
        <h2 style={{ color: "#0F172A", fontWeight: 800, fontSize: "1.15rem", margin: 0 }}>Neuer Kreditantrag</h2>
      </div>

      {/* Credit type */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        {([["islamic", "Islamisch", "0%", "#16A34A", "#F0FDF4", "#BBF7D0"], ["standard", "Standard", "2% / Jahr", "#2563EB", "#EFF6FF", "#BFDBFE"]] as [string, string, string, string, string, string][]).map(([type, name, rate, c, bg, border]) => (
          <button key={type} onClick={() => setCreditType(type as "islamic" | "standard")}
            style={{ padding: "14px 16px", background: creditType === type ? bg : "#F8FAFC", border: `2px solid ${creditType === type ? border : "#E2E8F0"}`, borderRadius: 14, textAlign: "left", cursor: "pointer" }}>
            <p style={{ color: "#0F172A", fontWeight: 700, fontSize: "0.88rem", margin: "0 0 4px" }}>{name}</p>
            <p style={{ color: c, fontWeight: 800, fontSize: "1.1rem", margin: "0 0 4px" }}>{rate}</p>
            <p style={{ color: "#64748B", fontSize: "0.72rem", margin: 0 }}>
              {type === "islamic" ? "Zinsfrei — Murabaha" : "BaFin-Festzinssatz"}
            </p>
          </button>
        ))}
      </div>

      {/* Amount + duration */}
      <div style={{ background: "white", borderRadius: 16, border: "1px solid #E9EEF4", padding: "20px", marginBottom: 16 }}>
        <p style={{ color: "#0F172A", fontWeight: 700, fontSize: "0.88rem", margin: "0 0 14px" }}>Kreditparameter</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          <div>
            <label style={{ color: "#64748B", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 5 }}>Betrag (€)</label>
            <input type="number" min="500" max="250000" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="z.B. 10 000"
              style={{ width: "100%", height: 44, background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, color: "#0F172A", fontWeight: 700, fontSize: "1rem", padding: "0 14px", boxSizing: "border-box", outline: "none" }} />
          </div>
          <div>
            <label style={{ color: "#64748B", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 5 }}>Laufzeit (Monate)</label>
            <select value={duration} onChange={(e) => setDuration(e.target.value)}
              style={{ width: "100%", height: 44, background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, color: "#0F172A", fontWeight: 600, fontSize: "0.9rem", padding: "0 14px", outline: "none" }}>
              {[6, 12, 18, 24, 36, 48, 60, 72, 84, 96, 108, 120].map((m) => {
                const yrs = Math.floor(m / 12);
                const mos = m % 12;
                const lbl = yrs > 0 ? `${yrs} Jahr${yrs > 1 ? "e" : ""}${mos > 0 ? ` ${mos} M.` : ""}` : `${m} Monate`;
                return <option key={m} value={m}>{m} Monate ({lbl})</option>;
              })}
            </select>
          </div>
        </div>

        {/* Live amortization preview */}
        {amt > 0 && (
          <div style={{ background: "linear-gradient(135deg, #F0FDF4, #DCFCE7)", border: "1px solid #86EFAC", borderRadius: 12, padding: "14px 18px", marginTop: 4 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              <div style={{ textAlign: "center" }}>
                <p style={{ color: "#166534", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 4px" }}>Monatl. Rate</p>
                <p style={{ color: "#005F2D", fontWeight: 800, fontSize: "1.2rem", margin: 0 }}>{fmtMoney(monthly)}</p>
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ color: "#166534", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 4px" }}>Gesamt</p>
                <p style={{ color: "#005F2D", fontWeight: 800, fontSize: "1.2rem", margin: 0 }}>{fmtMoney(totalRepayment)}</p>
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ color: "#166534", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 4px" }}>Zinsen</p>
                <p style={{ color: creditType === "islamic" ? "#16A34A" : "#D97706", fontWeight: 800, fontSize: "1.2rem", margin: 0 }}>{fmtMoney(totalInterest)}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Complementary info */}
      <div style={{ background: "white", borderRadius: 16, border: "1px solid #E9EEF4", padding: "20px", marginBottom: 16 }}>
        <p style={{ color: "#0F172A", fontWeight: 700, fontSize: "0.88rem", margin: "0 0 14px" }}>Zusätzliche Angaben</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div>
            <label style={{ color: "#64748B", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 5 }}>Kreditverwendungszweck</label>
            <input type="text" value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="z.B. Immobilienkauf, Fahrzeug…"
              style={{ width: "100%", height: 42, background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, color: "#0F172A", fontSize: "0.88rem", padding: "0 14px", boxSizing: "border-box", outline: "none" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={{ color: "#64748B", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 5 }}>Beschäftigungsstatus</label>
              <select value={employment} onChange={(e) => setEmployment(e.target.value)}
                style={{ width: "100%", height: 42, background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, color: "#0F172A", fontSize: "0.85rem", padding: "0 12px", outline: "none" }}>
                <option value="">Auswählen…</option>
                <option value="employed">Angestellte(r)</option>
                <option value="self_employed">Selbstständige(r)</option>
                <option value="civil_servant">Beamte(r)</option>
                <option value="unemployed">Arbeitslos</option>
                <option value="retired">Rentner(in)</option>
                <option value="student">Student(in)</option>
              </select>
            </div>
            <div>
              <label style={{ color: "#64748B", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 5 }}>Monatliche Einnahmen (€)</label>
              <input type="number" min="0" value={income} onChange={(e) => setIncome(e.target.value)} placeholder="0"
                style={{ width: "100%", height: 42, background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, color: "#0F172A", fontSize: "0.88rem", padding: "0 14px", boxSizing: "border-box", outline: "none" }} />
            </div>
            <div>
              <label style={{ color: "#64748B", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 5 }}>Bestehende Schulden (€)</label>
              <input type="number" min="0" value={debts} onChange={(e) => setDebts(e.target.value)} placeholder="0"
                style={{ width: "100%", height: 42, background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, color: "#0F172A", fontSize: "0.88rem", padding: "0 14px", boxSizing: "border-box", outline: "none" }} />
            </div>
            <div>
              <label style={{ color: "#64748B", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 5 }}>Unterhaltsberechtigte</label>
              <input type="number" min="0" max="20" value={dependents} onChange={(e) => setDependents(e.target.value)}
                style={{ width: "100%", height: 42, background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, color: "#0F172A", fontSize: "0.88rem", padding: "0 14px", boxSizing: "border-box", outline: "none" }} />
            </div>
            <div>
              <label style={{ color: "#64748B", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 5 }}>Familienstand</label>
              <select value={marital} onChange={(e) => setMarital(e.target.value)}
                style={{ width: "100%", height: 42, background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, color: "#0F172A", fontSize: "0.85rem", padding: "0 12px", outline: "none" }}>
                <option value="">Auswählen…</option>
                <option value="single">Ledig</option>
                <option value="married">Verheiratet</option>
                <option value="divorced">Geschieden</option>
                <option value="widowed">Verwitwet</option>
              </select>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 20 }}>
              <button type="button" onClick={() => setPropertyOwned(!propertyOwned)}
                style={{ flexShrink: 0, width: 40, height: 22, borderRadius: 11, background: propertyOwned ? "#005F2D" : "#E2E8F0", border: "none", position: "relative", cursor: "pointer", transition: "background 0.2s" }}>
                <div style={{ position: "absolute", top: 3, left: propertyOwned ? 21 : 3, width: 16, height: 16, borderRadius: "50%", background: "white", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
              </button>
              <span style={{ color: "#374151", fontSize: "0.82rem", fontWeight: 500 }}>Immobilieneigentümer</span>
            </div>
          </div>
        </div>
      </div>

      {/* Amortization preview button */}
      {amt > 0 && (
        <button onClick={printAmortization}
          style={{ width: "100%", height: 44, background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 12, color: "#005F2D", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 12 }}>
          <FileText size={15} /> Tilgungsplan anzeigen
        </button>
      )}

      <button onClick={submit} disabled={submitting || !amount || amt <= 0}
        style={{ width: "100%", height: 52, background: amount && amt > 0 ? "#005F2D" : "#CBD5E1", border: "none", borderRadius: 14, color: "white", fontWeight: 700, fontSize: "0.95rem", cursor: (submitting || !amount || amt <= 0) ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "background 0.2s" }}>
        {submitting ? "Wird gesendet…" : <><Send size={16} /> Antrag einreichen</>}
      </button>

      <p style={{ color: "#94A3B8", fontSize: "0.75rem", textAlign: "center", marginTop: 10, lineHeight: 1.6 }}>
        Ihr Antrag wird innerhalb von 48 Stunden bearbeitet. Sie erhalten eine Bestätigungs-E-Mail.
      </p>
    </div>
  );
}

/* ── MAIN COMPONENT ── */
const LANGS: { code: string; flag: string; label: string }[] = [
  { code: "de", flag: "🇩🇪", label: "Deutsch" },
  { code: "fr", flag: "🇫🇷", label: "Français" },
  { code: "en", flag: "🇬🇧", label: "English" },
  { code: "ar", flag: "🇸🇦", label: "العربية" },
  { code: "tr", flag: "🇹🇷", label: "Türkçe" },
  { code: "es", flag: "🇪🇸", label: "Español" },
  { code: "it", flag: "🇮🇹", label: "Italiano" },
  { code: "pt", flag: "🇵🇹", label: "Português" },
  { code: "nl", flag: "🇳🇱", label: "Nederlands" },
];

const LANG_LOCALE: Record<string, string> = {
  de: "de-DE", fr: "fr-FR", en: "en-GB", ar: "ar-SA", tr: "tr-TR",
  es: "es-ES", it: "it-IT", pt: "pt-PT", nl: "nl-NL",
};
const GREETING: Record<string, string> = {
  de: "Hallo", fr: "Bonjour", en: "Hello", ar: "مرحباً", tr: "Merhaba",
  es: "Hola", it: "Ciao", pt: "Olá", nl: "Hallo",
};

function LangPicker({ lang, onChange }: { lang: string; onChange: (l: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LANGS.find((l) => l.code === lang) ?? LANGS[0];

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen((v) => !v)}
        style={{ display: "flex", alignItems: "center", gap: 5, background: "#F5F7FA", border: "none", borderRadius: 10, padding: "8px 10px", cursor: "pointer", fontSize: "0.82rem", color: "#0F172A", fontWeight: 600 }}>
        <span style={{ fontSize: "1rem", lineHeight: 1 }}>{current.flag}</span>
        <span style={{ textTransform: "uppercase", fontSize: "0.72rem", letterSpacing: "0.04em" }}>{current.code}</span>
        <ChevronDown size={13} color="#64748B" />
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, background: "white", borderRadius: 12, boxShadow: "0 12px 32px rgba(0,0,0,0.14)", border: "1px solid #E9EEF4", padding: 6, zIndex: 50, minWidth: 168 }}>
          {LANGS.map((l) => (
            <button key={l.code} onClick={() => { onChange(l.code); setOpen(false); }}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 9, padding: "8px 10px", borderRadius: 8, border: "none", background: l.code === lang ? "rgba(0,95,45,0.08)" : "transparent", color: l.code === lang ? "#005F2D" : "#334155", fontSize: "0.83rem", fontWeight: l.code === lang ? 700 : 500, cursor: "pointer", textAlign: "left" }}>
              <span style={{ fontSize: "1.05rem", lineHeight: 1 }}>{l.flag}</span>
              <span style={{ flex: 1 }}>{l.label}</span>
              {l.code === lang && <Check size={14} color="#005F2D" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ClientDashboard() {
  const { lang, setLang } = useLanguage();
  const ui = getDUI(lang);
  const nav = buildNav(ui, lang);
  const [token, setToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transferRequests, setTransferRequests] = useState<TransferRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [pendingFees, setPendingFees] = useState(0);

  // IBAN modal
  const [showIbanModal, setShowIbanModal] = useState(false);
  const [viewerHtml, setViewerHtml] = useState<string | null>(null);
  const docIframeRef = useRef<HTMLIFrameElement>(null);
  // Card request modal
  const [showCardRequest, setShowCardRequest] = useState(false);
  const [cardTier, setCardTier] = useState<"standard" | "premium">("standard");
  const [cardRequested, setCardRequested] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    const t = sessionStorage.getItem("kt_token");
    if (!t) { window.location.href = "/client/login"; return; }
    setToken(t);
    // Deep link from emails: ?nav=fees opens the fee-settlement section
    try {
      const navParam = new URLSearchParams(window.location.search).get("nav");
      if (navParam) setActiveNav(navParam);
    } catch { /* ignore */ }

    fetch("/api/kt/client/me", { headers: { Authorization: `Bearer ${t}` } })
      .then((r) => { if (r.status === 401) { window.location.href = "/client/login"; return null; } return r.json(); })
      .then((d) => {
        if (!d) return;
        setProfile(d.profile);
        setAccounts(d.accounts ?? []);
        setTransactions(d.transactions ?? []);
        setTransferRequests(d.transfers ?? []);
        const active = (d.accounts ?? []).find((a: Account) => a.status === "active") ?? (d.accounts ?? [])[0];
        if (active) setSelectedAccountId(active.id);
        if (d.profile) sessionStorage.setItem("kt_profile", JSON.stringify({ prenom: d.profile.prenom, nom: d.profile.nom, email: d.profile.email, lang: d.profile.lang }));
        setLoading(false);
      })
      .catch(() => { setFetchError(true); setLoading(false); });

    // Fee-settlement badge: count invoices still awaiting payment
    fetch("/api/kt/client/fees", { headers: { Authorization: `Bearer ${t}` } })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d?.invoices) return;
        setPendingFees(d.invoices.filter((i: { status: string }) => i.status === "pending").length);
      })
      .catch(() => { /* ignore */ });
  }, []);

  function logout() { sessionStorage.removeItem("kt_token"); sessionStorage.removeItem("kt_email"); window.location.href = "/client/login"; }

  if (!token) return null;

  if (fetchError) return (
    <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", background: "#F5F7FA", fontFamily: "'Inter',sans-serif" }}>
      <div style={{ background: "white", borderRadius: 20, padding: "36px 40px", maxWidth: 400, width: "100%", textAlign: "center", boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}>
        <div style={{ width: 52, height: 52, borderRadius: 16, background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <AlertCircle size={24} color="#DC2626" />
        </div>
        <p style={{ color: "#0F172A", fontWeight: 800, fontSize: "1rem", margin: "0 0 8px" }}>Verbindungsfehler</p>
        <p style={{ color: "#64748B", fontSize: "0.85rem", margin: "0 0 20px", lineHeight: 1.6 }}>Die Daten konnten nicht geladen werden. Bitte prüfen Sie Ihre Verbindung.</p>
        <button onClick={() => { setFetchError(false); setLoading(true); window.location.reload(); }}
          style={{ height: 44, padding: "0 28px", background: "#005F2D", border: "none", borderRadius: 12, color: "white", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer" }}>
          Erneut versuchen
        </button>
      </div>
    </div>
  );

  const mainAccount =
    accounts.find((a) => a.id === selectedAccountId) ??
    accounts.find((a) => a.status === "active") ??
    accounts[0] ?? null;
  const mainCard = mainAccount?.kt_cards?.[0] ?? null;
  const balance = Number(mainAccount?.balance ?? 0);
  const zakatDue = balance * 0.025;

  // Show transactions for the selected account (fall back to all if account_id absent)
  const accountTx = mainAccount
    ? transactions.filter((tx) => !(tx as { account_id?: string }).account_id || (tx as { account_id?: string }).account_id === mainAccount.id)
    : transactions;

  const now = new Date();
  const thisMonth = accountTx.filter((tx) => { const d = new Date(tx.created_at); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); });
  const inflows = thisMonth.filter((t) => t.type === "credit").reduce((s, t) => s + Number(t.amount), 0);
  const outflows = thisMonth.filter((t) => t.type === "debit").reduce((s, t) => s + Number(t.amount), 0);
  const holderName = profile ? `${profile.prenom} ${profile.nom}` : "";

  /* ── SIDEBAR ── */
  function Sidebar({ mobile = false }: { mobile?: boolean }) {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%", width: mobile ? "100%" : 248, background: "linear-gradient(180deg,#001A0D 0%,#003319 55%,#005428 100%)", flexShrink: 0 }}>
        <div style={{ padding: "22px 18px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/kt-logo.png" alt="KT Bank" style={{ height: 32, objectFit: "contain", filter: "brightness(0) invert(1)" }} />
          </div>
          <p style={{ color: "rgba(201,168,76,0.6)", fontSize: "0.7rem", margin: "6px 0 0" }}>Kundenbereich</p>
        </div>

        {!loading && profile && (
          <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: 13, background: "rgba(201,168,76,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.88rem", color: "#C9A84C", flexShrink: 0 }}>
                {initials(profile.prenom, profile.nom)}
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ color: "white", fontWeight: 600, fontSize: "0.85rem", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{profile.prenom} {profile.nom}</p>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.7rem", margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{profile.email}</p>
              </div>
            </div>
            {(() => {
              const s = profile.status;
              const kyc = profile.kyc_status;
              const dotColor = s === "active" ? "#4ADE80" : s === "suspended" ? "#F87171" : "#FBB824";
              const label = s === "active" ? ui.active : s === "suspended" ? ui.blocked : kyc === "pending" ? ui.kycPending : ui.kyc;
              return (
                <div style={{ marginTop: 8, display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.06)", borderRadius: 20, padding: "3px 9px" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: dotColor }} />
                  <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.68rem" }}>{label}</span>
                </div>
              );
            })()}
          </div>
        )}

        <nav style={{ flex: 1, padding: "10px 8px", overflowY: "auto" }}>
          {nav.map(({ icon: Icon, label, id }) => (
            <button key={id} onClick={() => { setActiveNav(id); if (mobile) setSidebarOpen(false); }}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10, border: "none", background: activeNav === id ? "rgba(201,168,76,0.12)" : "transparent", color: activeNav === id ? "#C9A84C" : "rgba(255,255,255,0.5)", fontSize: "0.83rem", fontWeight: activeNav === id ? 600 : 400, cursor: "pointer", textAlign: "left", transition: "all 0.12s", borderLeft: `3px solid ${activeNav === id ? "#C9A84C" : "transparent"}`, marginBottom: 2 }}>
              <Icon size={16} />
              <span style={{ flex: 1 }}>{label}</span>
              {id === "fees" && pendingFees > 0 && (
                <span style={{ minWidth: 18, height: 18, padding: "0 5px", borderRadius: 9, background: "#EF4444", color: "white", fontSize: "0.66rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{pendingFees}</span>
              )}
              {activeNav === id && id !== "fees" && <ChevronRight size={13} />}
            </button>
          ))}
        </nav>

        <div style={{ padding: "10px 8px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <button onClick={logout} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10, border: "none", background: "transparent", color: "rgba(255,255,255,0.35)", fontSize: "0.83rem", cursor: "pointer" }}>
            <LogOut size={16} /> {ui.logout}
          </button>
        </div>
      </div>
    );
  }

  /* ── PAGE SECTIONS ── */

  function DashboardHome() {
    const [balVis, setBalVis] = useState(true);
    return (
      <div style={{ padding: "24px", maxWidth: 1100 }}>
        {/* Balance hero */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20, marginBottom: 20 }}>
          <div style={{ background: "linear-gradient(135deg,#001A0D 0%,#003319 45%,#005428 100%)", borderRadius: 22, padding: "28px 32px", position: "relative", overflow: "hidden", boxShadow: "0 12px 40px rgba(0,83,40,0.3)" }}>
            <div style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: "50%", border: "50px solid rgba(201,168,76,0.06)", pointerEvents: "none" }} />
            <div style={{ position: "relative", display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "space-between", alignItems: "flex-end" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <p style={{ color: "rgba(201,168,76,0.7)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>
                    {mainAccount?.type === "business"
                      ? (mainAccount?.business_info?.company_name || ACC_TXT.business(lang))
                      : "Girokonto"}
                  </p>
                  <button onClick={() => setShowIbanModal(true)} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 6, padding: "3px 8px", cursor: "pointer", color: "rgba(255,255,255,0.45)", fontSize: "0.7rem", display: "flex", alignItems: "center", gap: 4 }}>
                    <Lock size={10} /> {HOME_TXT.showIban(lang)}
                  </button>
                </div>
                {accounts.filter((a) => a.status === "active").length > 1 && (
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                    {accounts.filter((a) => a.status === "active").map((a) => {
                      const on = a.id === mainAccount?.id;
                      const name = a.type === "business" ? (a.business_info?.company_name || ACC_TXT.business(lang)) : "Girokonto";
                      return (
                        <button key={a.id} onClick={() => setSelectedAccountId(a.id)}
                          style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 11px", borderRadius: 9, border: `1px solid ${on ? "rgba(201,168,76,0.6)" : "rgba(255,255,255,0.14)"}`, background: on ? "rgba(201,168,76,0.18)" : "rgba(255,255,255,0.06)", color: on ? "#E8D08A" : "rgba(255,255,255,0.6)", fontSize: "0.72rem", fontWeight: on ? 700 : 500, cursor: "pointer", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {a.type === "business" ? <Building2 size={12} /> : <Wallet size={12} />}
                          <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                  <p style={{ color: "white", fontWeight: 800, fontSize: "clamp(2rem,5vw,2.8rem)", margin: 0, letterSpacing: "-0.02em", lineHeight: 1 }}>
                    {balVis ? `${balance.toLocaleString("de-DE", { minimumFractionDigits: 2 })} €` : "•••••• €"}
                  </p>
                  <button onClick={() => setBalVis(!balVis)} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, padding: "6px 8px", cursor: "pointer", color: "rgba(255,255,255,0.6)", display: "flex" }}>
                    {balVis ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                </div>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.78rem", margin: 0 }}>{HOME_TXT.availableBalance(lang)} • {mainAccount?.currency ?? "EUR"}</p>
                {inflows > 0 && <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 6 }}><TrendingUp size={13} color="#86EFAC" /><span style={{ color: "#86EFAC", fontSize: "0.75rem" }}>+{inflows.toLocaleString(LANG_LOCALE[lang] ?? "en-GB", { minimumFractionDigits: 2 })} € {HOME_TXT.thisMonth(lang)}</span></div>}
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[
                  { icon: <Send size={14} />, label: ui.transfer, nav: "transfers" },
                  { icon: <CreditCard size={14} />, label: ui.card, nav: "cards" },
                  { icon: <Banknote size={14} />, label: ui.nav[1], nav: "accounts" },
                  { icon: <FileText size={14} />, label: ui.documents, nav: "docs" },
                ].map((a) => (
                  <button key={a.label} onClick={() => setActiveNav(a.nav)}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "white", fontSize: "0.78rem", fontWeight: 500, cursor: "pointer" }}>
                    {a.icon}{a.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* KYC pending banner */}
        {profile && (profile.kyc_status !== "approved") && (
          <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 14, padding: "14px 18px", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#FEE2E2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Shield size={16} color="#DC2626" />
              </div>
              <div>
                <p style={{ color: "#991B1B", fontWeight: 700, fontSize: "0.85rem", margin: 0 }}>
                  {profile.kyc_status === "pending" ? HOME_TXT.kycRunningTitle(lang) : HOME_TXT.kycRequiredTitle(lang)}
                </p>
                <p style={{ color: "#DC2626", fontSize: "0.75rem", margin: "2px 0 0" }}>
                  {profile.kyc_status === "pending" ? HOME_TXT.kycRunningDesc(lang) : HOME_TXT.kycRequiredDesc(lang)}
                </p>
              </div>
            </div>
            <button onClick={() => setActiveNav("kyc")}
              style={{ height: 36, padding: "0 16px", background: "#DC2626", border: "none", borderRadius: 10, color: "white", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer", whiteSpace: "nowrap" }}>
              {HOME_TXT.completeKyc(lang)}
            </button>
          </div>
        )}

        {/* Account activation required banner */}
        {profile && profile.kyc_status === "approved" && profile.status !== "active" && (
          <div style={{ background: "#FFFBF0", border: "1px solid #FDE68A", borderRadius: 14, padding: "14px 18px", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <AlertCircle size={16} color="#D97706" />
              </div>
              <div>
                <p style={{ color: "#92400E", fontWeight: 700, fontSize: "0.85rem", margin: 0 }}>{HOME_TXT.activationTitle(lang)}</p>
                <p style={{ color: "#78350F", fontSize: "0.75rem", margin: "2px 0 0" }}>{HOME_TXT.activationDesc(lang)}</p>
              </div>
            </div>
            <button onClick={() => setActiveNav("kyc")}
              style={{ height: 36, padding: "0 16px", background: "#D97706", border: "none", borderRadius: 10, color: "white", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer", whiteSpace: "nowrap" }}>
              {HOME_TXT.depositDetails(lang)}
            </button>
          </div>
        )}

        {/* Pending transfer banner */}
        {transferRequests.some((t) => t.status === "pending_fee") && (
          <div style={{ background: "#FFFBF0", border: "1px solid #FDE68A", borderRadius: 14, padding: "14px 18px", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Clock size={16} color="#D97706" />
              </div>
              <div>
                <p style={{ color: "#92400E", fontWeight: 700, fontSize: "0.85rem", margin: 0 }}>{HOME_TXT.pendingTransferTitle(lang)}</p>
                <p style={{ color: "#78350F", fontSize: "0.75rem", margin: "2px 0 0" }}>{HOME_TXT.pendingTransferDesc(lang)}</p>
              </div>
            </div>
            <button onClick={() => setActiveNav("transfers")}
              style={{ height: 36, padding: "0 16px", background: "#D97706", border: "none", borderRadius: 10, color: "white", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer", whiteSpace: "nowrap" }}>
              {HOME_TXT.payFee(lang)}
            </button>
          </div>
        )}

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12, marginBottom: 20 }}>
          {[
            { label: HOME_TXT.inflows(lang), value: `+${inflows.toLocaleString(LANG_LOCALE[lang] ?? "en-GB", { minimumFractionDigits: 2 })} €`, color: "#16A34A", bg: "#F0FDF4", border: "#BBF7D0" },
            { label: HOME_TXT.outflows(lang), value: `-${outflows.toLocaleString(LANG_LOCALE[lang] ?? "en-GB", { minimumFractionDigits: 2 })} €`, color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
            { label: HOME_TXT.transactions(lang), value: String(accountTx.length), color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE" },
            { label: HOME_TXT.estZakat(lang), value: `${zakatDue.toLocaleString(LANG_LOCALE[lang] ?? "en-GB", { minimumFractionDigits: 2 })} €`, color: "#C9A84C", bg: "#FFFBF0", border: "#FDE68A" },
          ].map((s) => (
            <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 14, padding: "14px 16px" }}>
              <p style={{ color: "#64748B", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 5px" }}>{s.label}</p>
              <p style={{ color: s.color, fontWeight: 800, fontSize: "1.05rem", margin: 0 }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Transactions + card side by side */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, alignItems: "start" }}>
          <Panel title={ui.recentTx} subtitle={`${accountTx.length} ${HOME_TXT.transactions(lang)}`}
            action={<button onClick={() => setActiveNav("accounts")} style={{ display: "flex", alignItems: "center", gap: 5, background: "#F0FDF4", border: "none", borderRadius: 8, padding: "5px 11px", color: "#005F2D", fontWeight: 600, fontSize: "0.75rem", cursor: "pointer" }}>{ui.seeAll} <ChevronRight size={12} /></button>}>
            {loading ? [1,2,3,4].map((i) => <Skeleton key={i} />) : accountTx.length === 0 ? (
              <div style={{ padding: "40px 22px", textAlign: "center" }}>
                <ArrowLeftRight size={28} color="#CBD5E1" style={{ margin: "0 auto 12px" }} />
                <p style={{ color: "#94A3B8", fontSize: "0.88rem", margin: "0 0 4px" }}>{ui.noTx}</p>
                <p style={{ color: "#CBD5E1", fontSize: "0.78rem", margin: 0 }}>{HOME_TXT.txAppearHere(lang)}</p>
              </div>
            ) : accountTx.slice(0, 7).map((tx) => (
              <div key={tx.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 22px", borderBottom: "1px solid #F8FAFC" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFBFC")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                <TxIcon type={tx.type} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: "#0F172A", fontWeight: 500, fontSize: "0.85rem", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {tx.description || tx.counterpart_name || "Transaktion"}
                  </p>
                  <p style={{ color: "#94A3B8", fontSize: "0.72rem", margin: "3px 0 0" }}>{fmtDate(tx.created_at)} · {fmtTime(tx.created_at)}</p>
                </div>
                <span style={{ fontWeight: 700, fontSize: "0.88rem", flexShrink: 0, color: tx.type === "credit" ? "#16A34A" : "#DC2626" }}>
                  {tx.type === "credit" ? "+" : "−"}{Math.abs(Number(tx.amount)).toLocaleString("de-DE", { minimumFractionDigits: 2 })} €
                </span>
              </div>
            ))}
          </Panel>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Card */}
            <div style={{ background: "white", borderRadius: 18, border: "1px solid #E9EEF4", padding: 20 }}>
              <p style={{ color: "#0F172A", fontWeight: 700, fontSize: "0.88rem", margin: "0 0 14px" }}>{ui.card}</p>
              {mainCard ? (
                <BankCard card={mainCard} holderName={holderName} balance={balance} dui={ui} />
              ) : (
                <div style={{ textAlign: "center", padding: "24px 0" }}>
                  <CreditCard size={28} color="#CBD5E1" style={{ margin: "0 auto 8px" }} />
                  <p style={{ color: "#94A3B8", fontSize: "0.82rem", margin: 0 }}>Keine aktive Karte</p>
                </div>
              )}
              <button onClick={() => setActiveNav("cards")} style={{ width: "100%", marginTop: 14, height: 38, background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 10, color: "#005F2D", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <CreditCard size={14} /> {ui.card}
              </button>
            </div>

            {/* Islamic */}
            <div style={{ background: "linear-gradient(135deg,#F0FDF4,#DCFCE7)", borderRadius: 16, border: "1px solid #BBF7D0", padding: "16px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <Shield size={15} color="#005F2D" /><p style={{ color: "#005F2D", fontWeight: 700, fontSize: "0.82rem", margin: 0 }}>Islamische Finanzen</p>
              </div>
              {["Zinsfrei", "Zertifizierte Murabaha", "Aktiver islamischer Beirat"].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                  <div style={{ width: 15, height: 15, borderRadius: "50%", background: "#005F2D", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Check size={8} color="white" /></div>
                  <span style={{ color: "#166534", fontSize: "0.76rem" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  function AccountsPage() {
    const [showBizForm, setShowBizForm] = useState(false);
    const locale = LANG_LOCALE[lang] ?? "en-GB";
    const hasBusiness = accounts.some((a) => a.type === "business");
    function statusBadge(status: string) {
      if (status === "active") return { bg: "rgba(74,222,128,0.15)", fg: "#4ADE80", label: ui.active };
      if (status === "pending") return { bg: "rgba(251,184,36,0.15)", fg: "#FBB824", label: ACC_TXT.pending(lang) };
      if (status === "rejected") return { bg: "rgba(252,165,165,0.15)", fg: "#FCA5A5", label: ACC_TXT.rejected(lang) };
      return { bg: "rgba(252,165,165,0.15)", fg: "#FCA5A5", label: status };
    }
    return (
      <div style={{ padding: 24, maxWidth: 800 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
          <h2 style={{ color: "#0F172A", fontWeight: 800, fontSize: "1.2rem", margin: 0 }}>{ACC_TXT.myAccounts(lang)}</h2>
          {!hasBusiness && !showBizForm && (
            <button onClick={() => setShowBizForm(true)}
              style={{ display: "flex", alignItems: "center", gap: 7, background: "#005F2D", border: "none", borderRadius: 12, color: "white", fontWeight: 700, fontSize: "0.82rem", padding: "10px 16px", cursor: "pointer" }}>
              <Building2 size={15} /> {ACC_TXT.openBusiness(lang)}
            </button>
          )}
        </div>

        {accounts.map((acc) => {
          const badge = statusBadge(acc.status);
          const isBiz = acc.type === "business";
          const isSelectable = acc.status === "active";
          const isSelected = acc.id === selectedAccountId;
          const biz = acc.business_info as { company_name?: string } | null;
          return (
          <div key={acc.id} style={{ background: "white", borderRadius: 18, border: `1px solid ${isSelected ? "#005F2D" : "#E9EEF4"}`, marginBottom: 16, overflow: "hidden" }}>
            <div style={{ background: "linear-gradient(135deg,#001A0D,#003319)", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ color: "rgba(201,168,76,0.8)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 6px" }}>
                  {isBiz ? ACC_TXT.business(lang) : (acc.type || "").toUpperCase()} · {acc.currency}
                </p>
                {isBiz && biz?.company_name && (
                  <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.82rem", fontWeight: 600, margin: "0 0 4px" }}>{biz.company_name}</p>
                )}
                <p style={{ color: "white", fontWeight: 800, fontSize: "1.8rem", margin: 0, letterSpacing: "-0.01em" }}>
                  {Number(acc.balance).toLocaleString(locale, { minimumFractionDigits: 2 })} €
                </p>
              </div>
              <span style={{ background: badge.bg, color: badge.fg, fontSize: "0.72rem", fontWeight: 700, padding: "4px 10px", borderRadius: 20 }}>
                {badge.label}
              </span>
            </div>
            <div>
              {acc.status === "pending" ? (
                <div style={{ padding: "14px 24px", color: "#64748B", fontSize: "0.82rem", lineHeight: 1.6 }}>{ACC_TXT.pendingNote(lang)}</div>
              ) : (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 24px", borderBottom: "1px solid #F1F5F9" }}>
                    <span style={{ color: "#64748B", fontSize: "0.82rem" }}>IBAN</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ color: "#0F172A", fontFamily: "monospace", fontSize: "0.85rem", fontWeight: 500 }}>{fmtIbanMasked(acc.iban)}</span>
                      <button onClick={() => setShowIbanModal(true)} style={{ background: "#F1F5F9", border: "none", borderRadius: 6, padding: "3px 8px", cursor: "pointer", color: "#64748B", fontSize: "0.7rem", display: "flex", alignItems: "center", gap: 4 }}>
                        <Lock size={10} /> {ACC_TXT.showFull(lang)}
                      </button>
                    </div>
                  </div>
                  <InfoRow label="BIC / SWIFT" value={acc.bic || "KTAGDEFF"} mono />
                  <InfoRow label={ACC_TXT.currency(lang)} value={acc.currency} />
                  <InfoRow label={ACC_TXT.openedOn(lang)} value={fmtDate(acc.opened_at ?? acc.created_at)} />
                </>
              )}
              {isSelectable && (
                <div style={{ padding: "12px 24px", borderTop: "1px solid #F1F5F9" }}>
                  <button onClick={() => { setSelectedAccountId(acc.id); setActiveNav("dashboard"); }} disabled={isSelected}
                    style={{ width: "100%", height: 40, borderRadius: 10, border: isSelected ? "1px solid #86EFAC" : "1px solid #E2E8F0", background: isSelected ? "#F0FDF4" : "white", color: isSelected ? "#16A34A" : "#005F2D", fontWeight: 700, fontSize: "0.82rem", cursor: isSelected ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    {isSelected ? <><Check size={14} /> {ACC_TXT.selected(lang)}</> : ACC_TXT.select(lang)}
                  </button>
                </div>
              )}
            </div>
          </div>
        );})}

        {showBizForm && token && (
          <div style={{ marginTop: 8 }}>
            <BusinessAccountForm token={token} lang={lang} onCreated={() => { setShowBizForm(false); window.location.reload(); }} />
          </div>
        )}
      </div>
    );
  }

  function CardsPage() {
    return (
      <div style={{ padding: 24, maxWidth: 700 }}>
        <h2 style={{ color: "#0F172A", fontWeight: 800, fontSize: "1.2rem", margin: "0 0 20px" }}>{ui.debitCard}</h2>
        {accounts.flatMap((acc) => acc.kt_cards.map((card) => (
          <div key={card.id} style={{ background: "white", borderRadius: 18, border: "1px solid #E9EEF4", padding: 24, marginBottom: 16 }}>
            <div style={{ marginBottom: 20, display: "flex", justifyContent: "center" }}>
              <BankCard card={card} holderName={holderName} balance={balance} dui={ui} />
            </div>
            <div>
              <InfoRow label={ui.cardHolder} value={holderName} />
              <InfoRow label={ui.cardNumber} value={`•••• •••• •••• ${card.last4}`} mono />
              <InfoRow label={ui.validUntil} value={`${String(card.expiry_month).padStart(2, "0")}/${card.expiry_year}`} />
              <InfoRow label="Typ" value={card.type === "debit" ? ui.debitCard : ui.creditCard} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 22px" }}>
                <span style={{ color: "#64748B", fontSize: "0.82rem" }}>Status</span>
                <span style={{ background: card.status === "active" ? "#F0FDF4" : "#FEF2F2", color: card.status === "active" ? "#16A34A" : "#DC2626", fontSize: "0.75rem", fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>
                  {card.status === "active" ? ui.active : card.status}
                </span>
              </div>
            </div>
          </div>
        )))}

        {/* Request new card */}
        <div style={{ background: "white", borderRadius: 18, border: "2px dashed #E2E8F0", padding: 24 }}>
          <p style={{ color: "#0F172A", fontWeight: 700, fontSize: "0.92rem", margin: "0 0 6px" }}>{ui.requestCard}</p>
          <p style={{ color: "#64748B", fontSize: "0.82rem", margin: "0 0 16px", lineHeight: 1.6 }}>
            Wählen Sie Ihre Karte entsprechend Ihren täglichen Transaktionsbedürfnissen.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <button onClick={() => { setCardTier("standard"); setShowCardRequest(true); }}
              style={{ padding: "14px 16px", background: "#F8FAFC", border: "2px solid #E2E8F0", borderRadius: 12, textAlign: "left", cursor: "pointer" }}>
              <p style={{ color: "#0F172A", fontWeight: 700, fontSize: "0.85rem", margin: "0 0 4px" }}>Standard</p>
              <p style={{ color: "#005F2D", fontWeight: 800, fontSize: "1rem", margin: "0 0 4px" }}>260 €</p>
              <p style={{ color: "#64748B", fontSize: "0.72rem", margin: 0 }}>Transaktionen bis 25.000 €</p>
            </button>
            <button onClick={() => { setCardTier("premium"); setShowCardRequest(true); }}
              style={{ padding: "14px 16px", background: "#FFFBF0", border: "2px solid #FDE68A", borderRadius: 12, textAlign: "left", cursor: "pointer" }}>
              <p style={{ color: "#0F172A", fontWeight: 700, fontSize: "0.85rem", margin: "0 0 4px" }}>Premium</p>
              <p style={{ color: "#C9A84C", fontWeight: 800, fontSize: "1rem", margin: "0 0 4px" }}>500 €</p>
              <p style={{ color: "#64748B", fontSize: "0.72rem", margin: 0 }}>Unbegrenzte Transaktionen (25.000 €+)</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  function SavingsPage() {
    return (
      <div style={{ padding: 24, maxWidth: 700 }}>
        <h2 style={{ color: "#0F172A", fontWeight: 800, fontSize: "1.2rem", margin: "0 0 20px" }}>Sparen & Investieren</h2>
        <div style={{ background: "white", borderRadius: 18, border: "1px solid #E9EEF4", padding: 32, textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <PiggyBank size={26} color="#005F2D" />
          </div>
          <p style={{ color: "#0F172A", fontWeight: 700, fontSize: "1rem", margin: "0 0 8px" }}>Islamische Sparprodukte</p>
          <p style={{ color: "#64748B", fontSize: "0.85rem", margin: "0 0 20px", lineHeight: 1.6, maxWidth: 400, marginLeft: "auto", marginRight: "auto" }}>
            Sparkonto (Wadiah), Investmentkonto (Mudarabah) und halal Festgeld demnächst verfügbar.
          </p>
          <div style={{ background: "#FFFBF0", border: "1px solid #FDE68A", borderRadius: 12, padding: "12px 16px", display: "inline-flex", alignItems: "center", gap: 8 }}>
            <Clock size={15} color="#D97706" />
            <span style={{ color: "#92400E", fontSize: "0.82rem", fontWeight: 600 }}>Demnächst verfügbar</span>
          </div>
        </div>
      </div>
    );
  }

  function ZakatPage() {
    const [paid, setPaid] = useState(false);
    return (
      <div style={{ padding: 24, maxWidth: 600 }}>
        <h2 style={{ color: "#0F172A", fontWeight: 800, fontSize: "1.2rem", margin: "0 0 20px" }}>Spende & Zakat</h2>
        <div style={{ background: "white", borderRadius: 18, border: "1px solid #E9EEF4", padding: 24, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: "#FFFBF0", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Calculator size={18} color="#C9A84C" />
            </div>
            <div>
              <p style={{ color: "#0F172A", fontWeight: 700, fontSize: "0.9rem", margin: 0 }}>Zakat-Rechner</p>
              <p style={{ color: "#94A3B8", fontSize: "0.75rem", margin: 0 }}>2,5% des Jahresersparnisses</p>
            </div>
          </div>
          <div style={{ background: "#F8FAFC", borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #F1F5F9" }}>
              <span style={{ color: "#64748B", fontSize: "0.82rem" }}>Referenzguthaben</span>
              <span style={{ color: "#0F172A", fontWeight: 600, fontSize: "0.85rem" }}>{balance.toLocaleString("de-DE", { minimumFractionDigits: 2 })} €</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #F1F5F9" }}>
              <span style={{ color: "#64748B", fontSize: "0.82rem" }}>Satz</span>
              <span style={{ color: "#0F172A", fontWeight: 600, fontSize: "0.85rem" }}>2.5%</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0 0" }}>
              <span style={{ color: "#C9A84C", fontWeight: 700, fontSize: "0.9rem" }}>Fällige Zakat</span>
              <span style={{ color: "#C9A84C", fontWeight: 800, fontSize: "1.2rem" }}>{zakatDue.toLocaleString("de-DE", { minimumFractionDigits: 2 })} €</span>
            </div>
          </div>
          {paid ? (
            <div style={{ background: "#F0FDF4", borderRadius: 10, padding: "12px 16px", textAlign: "center" }}>
              <Check size={20} color="#005F2D" style={{ margin: "0 auto 6px" }} />
              <p style={{ color: "#005F2D", fontWeight: 700, fontSize: "0.85rem", margin: 0 }}>Zakat erfolgreich eingereicht!</p>
            </div>
          ) : (
            <button onClick={() => setPaid(true)} style={{ width: "100%", height: 46, background: "linear-gradient(135deg,#C9A84C,#E6C97A)", border: "none", borderRadius: 12, color: "#001A0D", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer" }}>
              Meine Zakat zahlen — {zakatDue.toLocaleString("de-DE", { minimumFractionDigits: 2 })} €
            </button>
          )}
        </div>
        <div style={{ background: "linear-gradient(135deg,#F0FDF4,#DCFCE7)", borderRadius: 16, border: "1px solid #BBF7D0", padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <Heart size={15} color="#005F2D" />
            <p style={{ color: "#005F2D", fontWeight: 700, fontSize: "0.85rem", margin: 0 }}>Spenden & Wohltätigkeit</p>
          </div>
          <p style={{ color: "#166534", fontSize: "0.8rem", margin: "0 0 12px", lineHeight: 1.6 }}>Unterstützen Sie von unserem islamischen Beirat zertifizierte Solidaritätsprojekte.</p>
          <div style={{ background: "#fff", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
            <Clock size={14} color="#D97706" /><span style={{ color: "#92400E", fontSize: "0.78rem" }}>Spendenplattform — demnächst verfügbar</span>
          </div>
        </div>
      </div>
    );
  }

  function DocsPage() {
    const [activeTab, setActiveTab] = React.useState<"received" | "submitted">("received");
    const [docReceived, setDocReceived] = React.useState<KtDocument[]>([]);
    const [docSubmitted, setDocSubmitted] = React.useState<KtSubmission[]>([]);
    const [docsLoading, setDocsLoading] = React.useState(true);
    const [uploading, setUploading] = React.useState(false);
    const [uploadErr, setUploadErr] = React.useState<string | null>(null);
    const [uploadOk, setUploadOk] = React.useState(false);
    const [uploadType, setUploadType] = React.useState("identity");
    const [uploadTitle, setUploadTitle] = React.useState("");

    function fetchDocs() {
      fetch("/api/kt/client/documents", { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(d => { setDocReceived(d.received ?? []); setDocSubmitted(d.submitted ?? []); setDocsLoading(false); })
        .catch(() => setDocsLoading(false));
    }
    React.useEffect(() => { fetchDocs(); }, []); // eslint-disable-line

    async function uploadDoc(file: File) {
      if (!uploadTitle.trim()) { setUploadErr("Bitte geben Sie einen Titel ein."); return; }
      setUploading(true); setUploadErr(null); setUploadOk(false);
      const fd = new FormData();
      fd.append("file", file); fd.append("type", uploadType); fd.append("title", uploadTitle);
      const res = await fetch("/api/kt/client/documents/submit", {
        method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd,
      });
      const data = await res.json();
      setUploading(false);
      if (!res.ok) { setUploadErr(data.error || "Fehler beim Hochladen"); }
      else { setUploadOk(true); setUploadTitle(""); setTimeout(() => setUploadOk(false), 4000); fetchDocs(); }
    }

    function openDocBlob(html: string) {
      // Render in an in-app iframe overlay — reliable on mobile (blob-URL
      // popups render blank / get blocked on Android).
      setViewerHtml(html);
    }

    function downloadDoc(html: string, _title: string) {
      openDocBlob(html);
    }

    const openDoc = openDocBlob;

    const SUBMIT_TYPES = [
      { value: "identity", label: "Identitätsnachweis" },
      { value: "residence_proof", label: "Wohnsitznachweis" },
      { value: "income_proof", label: "Einkommensnachweis" },
      { value: "bank_statement", label: "Kontoauszug" },
      { value: "contract", label: "Vertrag / Vereinbarung" },
      { value: "other", label: "Sonstiges" },
    ];

    const DOC_TYPE_LABELS: Record<string, string> = {
      kontoeroeffnung: "Kontoeröffnungsbestätigung",
      willkommen: "Willkommensschreiben",
      kreditvertrag: "Kreditvertrag",
      tilgungsplan: "Tilgungsplan",
      agb: "Allgemeine Geschäftsbedingungen",
      datenschutz: "Datenschutzerklärung",
      custom: "Dokument",
    };

    const subStatusConfig: Record<string, { bg: string; color: string; label: string }> = {
      pending:  { bg: "#FFFBF0", color: "#D97706", label: "In Bearbeitung" },
      approved: { bg: "#F0FDF4", color: "#16A34A", label: "Genehmigt ✓" },
      rejected: { bg: "#FEF2F2", color: "#DC2626", label: "Abgelehnt" },
    };

    return (
      <div style={{ padding: 24, maxWidth: 800 }}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ color: "#0F172A", fontWeight: 800, fontSize: "1.2rem", margin: 0 }}>{ui.documents}</h2>
          <p style={{ color: "#64748B", fontSize: "0.78rem", margin: "4px 0 0" }}>Von der Bank gesendete und eingereichte Dokumente</p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, marginBottom: 20, background: "#F1F5F9", borderRadius: 12, padding: 4 }}>
          {([
            { id: "received" as const, label: `Erhaltene Dokumente (${docReceived.length})` },
            { id: "submitted" as const, label: `Eingereichte Dokumente (${docSubmitted.length})` },
          ]).map(({ id, label }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              style={{ flex: 1, height: 40, borderRadius: 9, border: "none", background: activeTab === id ? "white" : "transparent", color: activeTab === id ? "#0F172A" : "#64748B", fontWeight: activeTab === id ? 700 : 500, fontSize: "0.82rem", cursor: "pointer", boxShadow: activeTab === id ? "0 1px 4px rgba(0,0,0,0.08)" : "none", transition: "all 0.15s" }}>
              {label}
            </button>
          ))}
        </div>

        {docsLoading ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <RefreshCw size={22} color="#CBD5E1" style={{ animation: "spin 1s linear infinite" }} />
          </div>
        ) : activeTab === "received" ? (
          <div>
            {docReceived.length === 0 ? (
              <div style={{ background: "white", borderRadius: 16, border: "1px solid #E9EEF4", padding: "40px 24px", textAlign: "center" }}>
                <FileText size={36} color="#CBD5E1" style={{ display: "block", margin: "0 auto 12px" }} />
                <p style={{ color: "#94A3B8", fontSize: "0.88rem", margin: "0 0 4px" }}>Keine Dokumente von der Bank vorhanden.</p>
                <p style={{ color: "#CBD5E1", fontSize: "0.78rem", margin: 0 }}>Dokumente der Bank erscheinen hier, sobald sie gesendet werden.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {docReceived.map((doc) => (
                  <div key={doc.id} style={{ background: "white", borderRadius: 14, border: "1px solid #E9EEF4", padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <FileText size={19} color="#005F2D" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ color: "#0F172A", fontWeight: 600, fontSize: "0.88rem", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.title}</p>
                      <p style={{ color: "#94A3B8", fontSize: "0.72rem", margin: "3px 0 0" }}>
                        {DOC_TYPE_LABELS[doc.type] ?? doc.type} · {fmtDate(doc.created_at)}
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                      <button onClick={() => doc.content_html && openDoc(doc.content_html)} disabled={!doc.content_html}
                        style={{ height: 36, padding: "0 12px", background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 10, color: "#005F2D", fontWeight: 600, fontSize: "0.78rem", cursor: doc.content_html ? "pointer" : "not-allowed", opacity: doc.content_html ? 1 : 0.5, display: "flex", alignItems: "center", gap: 5 }}>
                        <Eye size={13} /> Anzeigen
                      </button>
                      <button onClick={() => doc.content_html && downloadDoc(doc.content_html, doc.title)} disabled={!doc.content_html}
                        style={{ height: 36, padding: "0 12px", background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, color: "#374151", fontWeight: 600, fontSize: "0.78rem", cursor: doc.content_html ? "pointer" : "not-allowed", opacity: doc.content_html ? 1 : 0.5, display: "flex", alignItems: "center", gap: 5 }}>
                        <Download size={13} /> Herunterladen
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Upload form */}
            <div style={{ background: "white", borderRadius: 16, border: "1px solid #E9EEF4", padding: "20px 22px", marginBottom: 20 }}>
              <p style={{ color: "#0F172A", fontWeight: 700, fontSize: "0.88rem", margin: "0 0 14px" }}>Dokument einreichen</p>
              {uploadOk && (
                <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 10, padding: "10px 14px", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                  <Check size={14} color="#16A34A" />
                  <p style={{ color: "#166534", fontSize: "0.82rem", margin: 0, fontWeight: 600 }}>Dokument erfolgreich hochgeladen!</p>
                </div>
              )}
              {uploadErr && (
                <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "10px 14px", marginBottom: 12 }}>
                  <p style={{ color: "#DC2626", fontSize: "0.82rem", margin: 0 }}>{uploadErr}</p>
                </div>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div>
                  <label style={{ color: "#64748B", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 5 }}>Dokumenttyp</label>
                  <select value={uploadType} onChange={(e) => setUploadType(e.target.value)}
                    style={{ width: "100%", height: 42, background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, color: "#0F172A", fontSize: "0.88rem", padding: "0 14px", outline: "none" }}>
                    {SUBMIT_TYPES.map(({ value, label }) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ color: "#64748B", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 5 }}>Titel / Beschreibung</label>
                  <input type="text" value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)}
                    placeholder="z.B. Personalausweis Vorderseite"
                    style={{ width: "100%", height: 42, background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, color: "#0F172A", fontSize: "0.88rem", padding: "0 14px", boxSizing: "border-box", outline: "none" }} />
                </div>
                <label style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, height: 46, background: uploading ? "#F1F5F9" : "#005F2D", border: "none", borderRadius: 12, color: uploading ? "#94A3B8" : "white", fontWeight: 700, fontSize: "0.88rem", cursor: uploading ? "not-allowed" : "pointer" }}>
                  {uploading ? <><RefreshCw size={14} style={{ animation: "spin 1s linear infinite" }} /> Wird hochgeladen…</> : <><Plus size={14} /> Datei hochladen</>}
                  <input type="file" accept="image/jpeg,image/png,image/gif,image/webp,application/pdf,.docx,.xlsx" style={{ display: "none" }}
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadDoc(f); e.target.value = ""; }}
                    disabled={uploading} />
                </label>
                <p style={{ color: "#94A3B8", fontSize: "0.72rem", margin: 0, textAlign: "center" }}>
                  Akzeptierte Formate: JPG, PNG, PDF, DOCX, XLSX · Max. 20 MB
                </p>
              </div>
            </div>

            {/* Submitted list */}
            {docSubmitted.length === 0 ? (
              <div style={{ background: "white", borderRadius: 16, border: "1px solid #E9EEF4", padding: "36px 24px", textAlign: "center" }}>
                <FileText size={36} color="#CBD5E1" style={{ display: "block", margin: "0 auto 12px" }} />
                <p style={{ color: "#94A3B8", fontSize: "0.88rem", margin: 0 }}>Keine eingereichten Dokumente.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {docSubmitted.map((doc) => {
                  const s = subStatusConfig[doc.status] ?? { bg: "#F8FAFC", color: "#64748B", label: doc.status };
                  return (
                    <div key={doc.id} style={{ background: "white", borderRadius: 14, border: "1px solid #E9EEF4", padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ width: 42, height: 42, borderRadius: 12, background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <FileText size={19} color="#64748B" />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ color: "#0F172A", fontWeight: 600, fontSize: "0.88rem", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.title}</p>
                        <p style={{ color: "#94A3B8", fontSize: "0.72rem", margin: "3px 0 0" }}>
                          {SUBMIT_TYPES.find(t => t.value === doc.type)?.label ?? doc.type} · {fmtDate(doc.created_at)}
                        </p>
                        {doc.notes && <p style={{ color: "#64748B", fontSize: "0.72rem", margin: "2px 0 0" }}>{doc.notes}</p>}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                        <span style={{ background: s.bg, color: s.color, fontSize: "0.68rem", fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>{s.label}</span>
                        {doc.file_url && (
                          <a href={doc.file_url} target="_blank" rel="noopener noreferrer"
                            style={{ height: 34, padding: "0 12px", background: "#F1F5F9", border: "1px solid #E2E8F0", borderRadius: 8, color: "#64748B", fontWeight: 600, fontSize: "0.75rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, textDecoration: "none" }}>
                            <Eye size={12} /> Ansehen
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  function ProfilePage() {
    return (
      <div style={{ padding: 24, maxWidth: 700 }}>
        <h2 style={{ color: "#0F172A", fontWeight: 800, fontSize: "1.2rem", margin: "0 0 20px" }}>{ui.profile}</h2>
        {loading || !profile ? <Skeleton /> : (
          <>
            <div style={{ background: "white", borderRadius: 18, border: "1px solid #E9EEF4", marginBottom: 16, overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(135deg,#001A0D,#003319)", padding: "24px 24px 20px", display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 54, height: 54, borderRadius: 16, background: "rgba(201,168,76,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.1rem", color: "#C9A84C" }}>
                  {initials(profile.prenom, profile.nom)}
                </div>
                <div>
                  <p style={{ color: "white", fontWeight: 800, fontSize: "1.1rem", margin: 0 }}>{profile.prenom} {profile.nom}</p>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", margin: "4px 0 0" }}>Kunde seit {fmtDate(profile.created_at)}</p>
                </div>
              </div>
              <InfoRow label="E-Mail" value={profile.email} />
              <InfoRow label="Telefon" value={profile.telephone || "—"} />
              <InfoRow label="Adresse" value={profile.adresse ? `${profile.adresse}, ${profile.code_postal} ${profile.ville}` : "—"} />
              <InfoRow label="Wohnsitzland" value={profile.pays_residence || "—"} />
              <InfoRow label="Staatsangehörigkeit" value={profile.nationalite || "—"} />
              <InfoRow label="Berufliche Situation" value={profile.situation_professionnelle || "—"} />
            </div>
            <div style={{ background: "white", borderRadius: 18, border: "1px solid #E9EEF4", overflow: "hidden" }}>
              <div style={{ padding: "16px 22px", borderBottom: "1px solid #F1F5F9" }}>
                <p style={{ color: "#0F172A", fontWeight: 700, fontSize: "0.88rem", margin: 0 }}>Sicherheit & Verifizierungen</p>
              </div>
              {[
                { label: "E-Mail verifiziert", ok: true, icon: Mail },
                { label: "Telefon verifiziert", ok: !!profile.telephone, icon: Phone },
                { label: "KYC", ok: profile.kyc_status === "approved", val: profile.kyc_status === "approved" ? "Verifiziert ✓" : profile.kyc_status === "pending" ? "In Prüfung" : profile.kyc_status === "rejected" ? "Abgelehnt" : "Ausstehend", icon: Shield },
              ].map(({ label, ok, val, icon: Icon }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 22px", borderBottom: "1px solid #F8FAFC" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Icon size={15} color={ok ? "#005F2D" : "#D97706"} />
                    <span style={{ color: "#0F172A", fontSize: "0.85rem" }}>{label}</span>
                  </div>
                  <span style={{ background: ok ? "#F0FDF4" : "#FFFBF0", color: ok ? "#16A34A" : "#D97706", fontSize: "0.72rem", fontWeight: 600, padding: "3px 9px", borderRadius: 20 }}>
                    {val ?? (ok ? "Verifiziert" : "Ausstehend")}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14 }}>
              <p style={{ color: "#64748B", fontSize: "0.78rem", marginBottom: 10 }}>Um Ihre persönlichen Daten zu ändern, kontaktieren Sie Ihren Berater:</p>
              <div style={{ display: "flex", gap: 10 }}>
                <a href="mailto:support@kt-bank-ag.com" style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", background: "white", border: "1px solid #E2E8F0", borderRadius: 10, color: "#005F2D", fontWeight: 600, fontSize: "0.8rem", textDecoration: "none" }}>
                  <Mail size={14} /> support@kt-bank-ag.com
                </a>
                <a href="tel:+4969123456" style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", background: "white", border: "1px solid #E2E8F0", borderRadius: 10, color: "#005F2D", fontWeight: 600, fontSize: "0.8rem", textDecoration: "none" }}>
                  <Phone size={14} /> +49 69 123 456
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  /* ── MODALS ── */
  function IbanModal() {
    return (
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}>
        <div style={{ background: "white", borderRadius: 20, padding: 32, maxWidth: 440, width: "100%", boxShadow: "0 24px 60px rgba(0,0,0,0.2)" }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Lock size={22} color="#005F2D" />
          </div>
          <p style={{ color: "#0F172A", fontWeight: 800, fontSize: "1.05rem", textAlign: "center", margin: "0 0 10px" }}>IBAN-Informationen</p>
          <p style={{ color: "#64748B", fontSize: "0.85rem", textAlign: "center", lineHeight: 1.6, margin: "0 0 20px" }}>
            Bitte kontaktieren Sie Ihren Kontenverwalter, um Ihre vollständigen Bankdaten (IBAN) zu erhalten.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <a href="mailto:support@kt-bank-ag.com" style={{ flex: 1, height: 44, background: "#005F2D", border: "none", borderRadius: 12, color: "white", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, textDecoration: "none" }}>
              <Mail size={15} /> Kontaktieren
            </a>
            <button onClick={() => setShowIbanModal(false)} style={{ flex: 1, height: 44, background: "#F1F5F9", border: "none", borderRadius: 12, color: "#64748B", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer" }}>
              {ui.close}
            </button>
          </div>
        </div>
      </div>
    );
  }

  function CardRequestModal() {
    return (
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}>
        <div style={{ background: "white", borderRadius: 20, padding: 32, maxWidth: 460, width: "100%", boxShadow: "0 24px 60px rgba(0,0,0,0.2)" }}>
          {cardRequested ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <Check size={26} color="#005F2D" />
              </div>
              <p style={{ color: "#0F172A", fontWeight: 800, fontSize: "1.05rem", margin: "0 0 10px" }}>Anfrage erfasst!</p>
              <p style={{ color: "#64748B", fontSize: "0.85rem", lineHeight: 1.6, margin: "0 0 20px" }}>
                Ihre Anfrage für eine {cardTier === "premium" ? "Premium (500 €)" : "Standard (260 €)"}-Karte wurde eingereicht. Ein Berater wird sich innerhalb von 48 Stunden bei Ihnen melden.
              </p>
              <button onClick={() => { setShowCardRequest(false); setCardRequested(false); }} style={{ padding: "10px 28px", background: "#005F2D", border: "none", borderRadius: 12, color: "white", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer" }}>
                {ui.close}
              </button>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <p style={{ color: "#0F172A", fontWeight: 800, fontSize: "1rem", margin: 0 }}>Karte beantragen</p>
                <button onClick={() => setShowCardRequest(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}><X size={20} /></button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                {[
                  { id: "standard", label: "Standard", price: "260 €", desc: "Transaktionen bis 25.000 €", color: "#005F2D", bg: "#F0FDF4", border: "#BBF7D0" },
                  { id: "premium", label: "Premium", price: "500 €", desc: "Unbegrenzte Transaktionen (25.000 €+)", color: "#C9A84C", bg: "#FFFBF0", border: "#FDE68A" },
                ].map((tier) => (
                  <button key={tier.id} onClick={() => setCardTier(tier.id as "standard" | "premium")}
                    style={{ padding: "14px", background: cardTier === tier.id ? tier.bg : "#F8FAFC", border: `2px solid ${cardTier === tier.id ? tier.border : "#E2E8F0"}`, borderRadius: 14, textAlign: "left", cursor: "pointer", transition: "all 0.15s" }}>
                    <p style={{ color: "#0F172A", fontWeight: 700, fontSize: "0.85rem", margin: "0 0 4px" }}>{tier.label}</p>
                    <p style={{ color: tier.color, fontWeight: 800, fontSize: "1.05rem", margin: "0 0 4px" }}>{tier.price}</p>
                    <p style={{ color: "#64748B", fontSize: "0.7rem", margin: 0, lineHeight: 1.4 }}>{tier.desc}</p>
                  </button>
                ))}
              </div>
              <div style={{ background: "#F8FAFC", borderRadius: 12, padding: "12px 16px", marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ color: "#64748B", fontSize: "0.82rem" }}>{ui.cardHolder}</span>
                  <span style={{ color: "#0F172A", fontWeight: 600, fontSize: "0.82rem" }}>{holderName}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748B", fontSize: "0.82rem" }}>{ui.cardIssuanceFee}</span>
                  <span style={{ color: "#0F172A", fontWeight: 700, fontSize: "0.88rem" }}>{cardTier === "premium" ? "500 €" : "260 €"}</span>
                </div>
              </div>
              <button onClick={() => setCardRequested(true)} style={{ width: "100%", height: 48, background: "#005F2D", border: "none", borderRadius: 12, color: "white", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <Plus size={16} /> Anfrage bestätigen
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  const pages: Record<string, React.ReactNode> = {
    dashboard: <DashboardHome />,
    accounts: <AccountsPage />,
    fees: <FeesPage token={token!} lang={lang} />,
    transfers: <TransfersPage token={token!} balance={balance} transferRequests={transferRequests}
      kycStatus={profile?.kyc_status ?? "unverified"} accountStatus={profile?.status ?? "pending"}
      onGoToKyc={() => setActiveNav("kyc")} />,
    credits: <CreditPage token={token!} profile={profile} account={mainAccount} onViewDoc={setViewerHtml} />,
    cards: <CardsPage />,
    savings: <SavingsPage />,
    zakat: <ZakatPage />,
    docs: <DocsPage />,
    kyc: <KycPage token={token!} kycStatus={profile?.kyc_status ?? "unverified"}
      accountStatus={profile?.status ?? "pending"} activationRequired={!!(profile as Record<string, unknown>)?.activation_required} dui={ui} />,
    profile: <ProfilePage />,
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#F5F7FA", fontFamily: "'Inter',sans-serif" }}>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex" style={{ flexShrink: 0 }}>
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50 }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)" }} onClick={() => setSidebarOpen(false)} />
          <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: 248, zIndex: 10 }}>
            <Sidebar mobile />
          </div>
          <button onClick={() => setSidebarOpen(false)} style={{ position: "absolute", top: 16, right: 16, background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 8, padding: 8, color: "white", zIndex: 20, cursor: "pointer" }}>
            <X size={22} />
          </button>
        </div>
      )}

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        {/* Topbar */}
        <header style={{ background: "white", borderBottom: "1px solid #E9EEF4", padding: "0 20px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="lg:hidden" onClick={() => setSidebarOpen(true)} style={{ background: "#F5F7FA", border: "none", borderRadius: 10, padding: 8, cursor: "pointer", display: "flex" }}>
              <Menu size={20} color="#005F2D" />
            </button>
            {!loading && profile && (
              <div>
                <p style={{ color: "#0F172A", fontWeight: 700, fontSize: "0.9rem", margin: 0 }}>
                  {GREETING[lang] ?? GREETING.en}, {profile.prenom} 👋
                </p>
                <p style={{ color: "#94A3B8", fontSize: "0.72rem", margin: 0 }}>
                  {now.toLocaleDateString(LANG_LOCALE[lang] ?? "en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <LangPicker lang={lang} onChange={(l) => setLang(l as Parameters<typeof setLang>[0])} />
            {token && <NotificationsBell token={token} lang={lang} onNavigate={(link) => { setActiveNav(link); setSidebarOpen(false); }} />}
            {profile && (
              <div style={{ width: 36, height: 36, borderRadius: 11, background: "linear-gradient(135deg,#001A0D,#003319)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: "0.78rem" }}>
                {initials(profile.prenom, profile.nom)}
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {pages[activeNav] ?? <DashboardHome />}
        </div>
      </div>

      {/* Modals */}
      {showIbanModal && <IbanModal />}
      {showCardRequest && <CardRequestModal />}

      {/* Document viewer — in-app iframe (works on mobile, unlike blob popups) */}
      {viewerHtml && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "#5A5A5A", display: "flex", flexDirection: "column" }}>
          <div style={{ height: 52, flexShrink: 0, background: "#0F1219", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px" }}>
            <button onClick={() => setViewerHtml(null)}
              style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 9, color: "white", padding: "8px 12px", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer" }}>
              <X size={15} /> {ui.close}
            </button>
            <button onClick={() => { try { docIframeRef.current?.contentWindow?.focus(); docIframeRef.current?.contentWindow?.print(); } catch { /* ignore */ } }}
              style={{ display: "flex", alignItems: "center", gap: 6, background: "#005F2D", border: "none", borderRadius: 9, color: "white", padding: "8px 14px", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer" }}>
              <Download size={15} /> PDF
            </button>
          </div>
          <iframe ref={docIframeRef} srcDoc={viewerHtml} title="Document"
            style={{ flex: 1, width: "100%", border: "none", background: "white" }} />
        </div>
      )}

      {/* Suspended account overlay */}
      {!loading && profile?.status === "suspended" && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.82)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 20 }}>
          <div style={{ background: "white", borderRadius: 24, padding: "40px 32px", maxWidth: 440, width: "100%", textAlign: "center", boxShadow: "0 32px 80px rgba(0,0,0,0.4)" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <Lock size={28} color="#DC2626" />
            </div>
            <p style={{ color: "#0F172A", fontWeight: 800, fontSize: "1.2rem", margin: "0 0 10px" }}>
              Konto deaktiviert
            </p>
            <p style={{ color: "#64748B", fontSize: "0.88rem", lineHeight: 1.7, margin: "0 0 24px" }}>
              Ihr Konto wurde vorübergehend deaktiviert, da seit der Kontoeröffnung keine Einzahlungen oder Abhebungen stattgefunden haben. Bitte aktivieren Sie Ihr Konto, indem Sie Ihren Kundenbetreuer kontaktieren.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <a href="mailto:support@kt-bank-ag.com"
                style={{ flex: 1, height: 46, background: "#005F2D", border: "none", borderRadius: 12, color: "white", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, textDecoration: "none" }}>
                <Mail size={15} /> Support kontaktieren
              </a>
              <button onClick={logout}
                style={{ height: 46, padding: "0 18px", background: "#F1F5F9", border: "none", borderRadius: 12, color: "#64748B", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer" }}>
                {ui.logout}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
