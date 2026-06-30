/* ── KT Bank AG — Document HTML Templates ── */

interface ClientInfo {
  prenom: string;
  nom: string;
  email: string;
  telephone?: string;
  adresse?: string;
  code_postal?: string;
  ville?: string;
  pays_residence?: string;
  nationalite?: string;
  created_at: string;
  iban?: string;
  bic?: string;
  account_id?: string;
}

function docRef() {
  return `KT-${Date.now().toString(36).toUpperCase().slice(-8)}`;
}

type DocLang = "de" | "fr" | "en" | "ar" | "tr" | "es" | "it" | "pt" | "nl";

function L<T extends Record<string, unknown>>(lang: string, variants: Partial<Record<DocLang, T>> & { de: T }): T {
  return (variants[lang as DocLang] ?? variants.de) as T;
}

function docDate(lang = "de") {
  const localeMap: Record<string, string> = { de:"de-DE", fr:"fr-FR", en:"en-GB", ar:"ar-SA", tr:"tr-TR", es:"es-ES", it:"it-IT", pt:"pt-PT", nl:"nl-NL" };
  return new Date().toLocaleDateString(localeMap[lang] ?? "de-DE", { day:"2-digit", month:"long", year:"numeric" });
}

const DL = (key: string, lang: string): string => {
  const labels: Record<string, Partial<Record<DocLang, string>> & { de: string }> = {
    // Document titles
    accountConfirmTitle: { de:"Kontoeröffnungsbestätigung", fr:"Confirmation d'ouverture de compte", en:"Account Opening Confirmation", ar:"تأكيد فتح الحساب", tr:"Hesap Açılış Onayı", es:"Confirmación de apertura de cuenta", it:"Conferma apertura conto", pt:"Confirmação de abertura de conta", nl:"Bevestiging rekeningopening" },
    welcomeTitle: { de:"Herzlich willkommen bei der KT Bank AG!", fr:"Bienvenue à la KT Bank AG !", en:"Welcome to KT Bank AG!", ar:"مرحباً بك في KT Bank AG!", tr:"KT Bank AG'ye Hoş Geldiniz!", es:"¡Bienvenido/a a KT Bank AG!", it:"Benvenuto/a in KT Bank AG!", pt:"Bem-vindo/a ao KT Bank AG!", nl:"Welkom bij KT Bank AG!" },
    loanContractTitle: { de:"Kreditvertrag", fr:"Contrat de crédit", en:"Loan Agreement", ar:"عقد القرض", tr:"Kredi Sözleşmesi", es:"Contrato de préstamo", it:"Contratto di prestito", pt:"Contrato de crédito", nl:"Leningovereenkomst" },
    tilgungsplanTitle: { de:"Tilgungsplan", fr:"Tableau d'amortissement", en:"Amortization Schedule", ar:"جدول السداد", tr:"İtfa Planı", es:"Plan de amortización", it:"Piano di ammortamento", pt:"Plano de amortização", nl:"Aflossingsschema" },
    agbTitle: { de:"Allgemeine Geschäftsbedingungen", fr:"Conditions Générales de Vente", en:"General Terms and Conditions", ar:"الشروط والأحكام العامة", tr:"Genel Hüküm ve Koşullar", es:"Términos y Condiciones Generales", it:"Termini e Condizioni Generali", pt:"Termos e Condições Gerais", nl:"Algemene Voorwaarden" },
    datenschutzTitle: { de:"Datenschutzerklärung", fr:"Politique de confidentialité", en:"Privacy Policy", ar:"سياسة الخصوصية", tr:"Gizlilik Politikası", es:"Política de privacidad", it:"Informativa sulla privacy", pt:"Política de privacidade", nl:"Privacybeleid" },
    // Parties
    borrower: { de:"Kreditnehmer", fr:"Emprunteur", en:"Borrower", ar:"المقترض", tr:"Borçlu", es:"Prestatario", it:"Mutuatario", pt:"Mutuário", nl:"Kredietnemer" },
    lender: { de:"Kreditgeber", fr:"Prêteur", en:"Lender", ar:"المقرض", tr:"Borç Veren", es:"Prestamista", it:"Prestatore", pt:"Mutuante", nl:"Kredietverstrekker" },
    accountHolder: { de:"Kontoinhaber", fr:"Titulaire du compte", en:"Account Holder", ar:"صاحب الحساب", tr:"Hesap Sahibi", es:"Titular de la cuenta", it:"Titolare del conto", pt:"Titular da conta", nl:"Rekeninghouder" },
    accountData: { de:"Kontodaten", fr:"Données du compte", en:"Account Data", ar:"بيانات الحساب", tr:"Hesap Bilgileri", es:"Datos de la cuenta", it:"Dati del conto", pt:"Dados da conta", nl:"Rekeninggegevens" },
    // Loan labels
    loanAmount: { de:"Kreditbetrag", fr:"Montant du crédit", en:"Loan Amount", ar:"مبلغ القرض", tr:"Kredi Tutarı", es:"Importe del préstamo", it:"Importo del prestito", pt:"Montante do crédito", nl:"Leningbedrag" },
    monthlyRate: { de:"Monatliche Rate", fr:"Mensualité", en:"Monthly Payment", ar:"القسط الشهري", tr:"Aylık Taksit", es:"Cuota mensual", it:"Rata mensile", pt:"Prestação mensal", nl:"Maandelijkse betaling" },
    duration: { de:"Laufzeit", fr:"Durée", en:"Duration", ar:"المدة", tr:"Süre", es:"Duración", it:"Durata", pt:"Duração", nl:"Looptijd" },
    interestRate: { de:"Zinssatz", fr:"Taux d'intérêt", en:"Interest Rate", ar:"معدل الفائدة", tr:"Faiz Oranı", es:"Tasa de interés", it:"Tasso di interesse", pt:"Taxa de juro", nl:"Rentepercentage" },
    totalRepayment: { de:"Gesamtrückzahlung", fr:"Remboursement total", en:"Total Repayment", ar:"إجمالي السداد", tr:"Toplam Geri Ödeme", es:"Reembolso total", it:"Rimborso totale", pt:"Reembolso total", nl:"Totale terugbetaling" },
    totalInterest: { de:"Gesamtzinsen", fr:"Intérêts totaux", en:"Total Interest", ar:"إجمالي الفوائد", tr:"Toplam Faiz", es:"Interés total", it:"Interessi totali", pt:"Juros totais", nl:"Totale rente" },
    contractDate: { de:"Vertragsdatum", fr:"Date du contrat", en:"Contract Date", ar:"تاريخ العقد", tr:"Sözleşme Tarihi", es:"Fecha del contrato", it:"Data del contratto", pt:"Data do contrato", nl:"Contractdatum" },
    firstPayment: { de:"Erste Rate fällig am", fr:"Première échéance le", en:"First payment due on", ar:"أول قسط مستحق في", tr:"İlk ödeme tarihi:", es:"Primera cuota vence el", it:"Prima rata in scadenza il", pt:"Primeira prestação com vencimento em", nl:"Eerste betaling verschuldigd op" },
    // Tilgungsplan table headers
    month: { de:"Monat", fr:"Mois", en:"Month", ar:"الشهر", tr:"Ay", es:"Mes", it:"Mese", pt:"Mês", nl:"Maand" },
    date: { de:"Datum", fr:"Date", en:"Date", ar:"التاريخ", tr:"Tarih", es:"Fecha", it:"Data", pt:"Data", nl:"Datum" },
    rateEur: { de:"Rate (EUR)", fr:"Mensualité (EUR)", en:"Payment (EUR)", ar:"القسط (EUR)", tr:"Taksit (EUR)", es:"Cuota (EUR)", it:"Rata (EUR)", pt:"Prestação (EUR)", nl:"Betaling (EUR)" },
    zinsenEur: { de:"Zinsen (EUR)", fr:"Intérêts (EUR)", en:"Interest (EUR)", ar:"الفائدة (EUR)", tr:"Faiz (EUR)", es:"Interés (EUR)", it:"Interessi (EUR)", pt:"Juros (EUR)", nl:"Rente (EUR)" },
    tilgungEur: { de:"Tilgung (EUR)", fr:"Capital (EUR)", en:"Principal (EUR)", ar:"رأس المال (EUR)", tr:"Anapara (EUR)", es:"Capital (EUR)", it:"Capitale (EUR)", pt:"Capital (EUR)", nl:"Aflossing (EUR)" },
    restschuld: { de:"Restschuld", fr:"Capital restant", en:"Remaining Balance", ar:"الرصيد المتبقي", tr:"Kalan Borç", es:"Capital pendiente", it:"Debito residuo", pt:"Saldo remanescente", nl:"Restschuld" },
    kumTilgung: { de:"Kum. Tilgung", fr:"Capital remb.", en:"Cum. Principal", ar:"رأس المال المسدد", tr:"Toplam Anapara", es:"Capital amort.", it:"Capitale amm.", pt:"Capital amort.", nl:"Cum. aflossing" },
    gesamt: { de:"GESAMT", fr:"TOTAL", en:"TOTAL", ar:"الإجمالي", tr:"TOPLAM", es:"TOTAL", it:"TOTALE", pt:"TOTAL", nl:"TOTAAL" },
    annualNote: { de:"* Gelbe Zeilen = Jahresabschlüsse", fr:"* Lignes jaunes = Bilans annuels", en:"* Yellow rows = Annual checkpoints", ar:"* الصفوف الصفراء = المراجعات السنوية", tr:"* Sarı satırlar = Yıllık kontrol", es:"* Filas amarillas = Cierres anuales", it:"* Righe gialle = Chiusure annuali", pt:"* Linhas amarelas = Encerramentos anuais", nl:"* Gele rijen = Jaarlijkse controles" },
    paymentPlan: { de:"Zahlungsplan", fr:"Plan de paiement", en:"Payment Plan", ar:"خطة السداد", tr:"Ödeme Planı", es:"Plan de pago", it:"Piano di pagamento", pt:"Plano de pagamentos", nl:"Betalingsplan" },
    loanOverview: { de:"Kreditübersicht", fr:"Aperçu du crédit", en:"Loan Overview", ar:"نظرة عامة على القرض", tr:"Kredi Özeti", es:"Resumen del préstamo", it:"Panoramica del prestito", pt:"Resumo do crédito", nl:"Leningoverzicht" },
    // Islamic
    islamicLoan: { de:"Islamischer Kredit (Mourabaha) — Zinsfrei", fr:"Crédit islamique (Mourabaha) — Sans intérêts", en:"Islamic Loan (Murabaha) — Interest-free", ar:"قرض إسلامي (مرابحة) — بدون فوائد", tr:"İslami Kredi (Murabaha) — Faizsiz", es:"Préstamo islámico (Murabaha) — Sin intereses", it:"Prestito islamico (Murabaha) — Senza interessi", pt:"Crédito islâmico (Murabaha) — Sem juros", nl:"Islamitische lening (Murabaha) — Rentevrij" },
    standardLoan: { de:"Standardkredit — Festzins", fr:"Crédit standard — Taux fixe", en:"Standard loan — Fixed rate", ar:"قرض قياسي — سعر ثابت", tr:"Standart Kredi — Sabit Faiz", es:"Préstamo estándar — Tipo fijo", it:"Prestito standard — Tasso fisso", pt:"Crédito padrão — Taxa fixa", nl:"Standaardlening — Vaste rente" },
    // Sections
    confirmation: { de:"Bestätigung", fr:"Confirmation", en:"Confirmation", ar:"التأكيد", tr:"Onay", es:"Confirmación", it:"Conferma", pt:"Confirmação", nl:"Bevestiging" },
    services: { de:"Leistungsumfang", fr:"Services inclus", en:"Included Services", ar:"الخدمات المشمولة", tr:"Dahil Hizmetler", es:"Servicios incluidos", it:"Servizi inclusi", pt:"Serviços incluídos", nl:"Inbegrepen diensten" },
    terms: { de:"Vertragsbedingungen", fr:"Conditions contractuelles", en:"Contract Terms", ar:"شروط العقد", tr:"Sözleşme Koşulları", es:"Condiciones del contrato", it:"Condizioni contrattuali", pt:"Condições contratuais", nl:"Contractvoorwaarden" },
    generalTerms: { de:"Allgemeine Bestimmungen", fr:"Dispositions générales", en:"General Provisions", ar:"الأحكام العامة", tr:"Genel Hükümler", es:"Disposiciones generales", it:"Disposizioni generali", pt:"Disposições gerais", nl:"Algemene bepalingen" },
    // Signature area
    direction: { de:"Direktion", fr:"Direction", en:"Management", ar:"الإدارة", tr:"Yönetim", es:"Dirección", it:"Direzione", pt:"Direção", nl:"Directie" },
    accountManager: { de:"Kundenbetreuer", fr:"Conseiller clientèle", en:"Account Manager", ar:"مدير الحساب", tr:"Hesap Yöneticisi", es:"Gestor de cuenta", it:"Gestore del conto", pt:"Gestor de conta", nl:"Accountmanager" },
    presignedBy: { de:"Vorgezeichnet durch", fr:"Pré-signé par", en:"Pre-signed by", ar:"موقّع مسبقاً من", tr:"Önceden imzalayan:", es:"Prefirmado por", it:"Prefirmato da", pt:"Pré-assinado por", nl:"Vooraf ondertekend door" },
    signHint: { de:"Unterschrift / Signature", fr:"Signature", en:"Signature", ar:"التوقيع", tr:"İmza", es:"Firma", it:"Firma", pt:"Assinatura", nl:"Handtekening" },
    // Account labels
    iban: { de:"IBAN", fr:"IBAN", en:"IBAN", ar:"IBAN", tr:"IBAN", es:"IBAN", it:"IBAN", pt:"IBAN", nl:"IBAN" },
    accountType: { de:"Kontotyp", fr:"Type de compte", en:"Account type", ar:"نوع الحساب", tr:"Hesap türü", es:"Tipo de cuenta", it:"Tipo di conto", pt:"Tipo de conta", nl:"Rekeningtype" },
    currentAccount: { de:"Girokonto", fr:"Compte courant", en:"Current account", ar:"حساب جاري", tr:"Vadesiz hesap", es:"Cuenta corriente", it:"Conto corrente", pt:"Conta corrente", nl:"Betaalrekening" },
    openDate: { de:"Eröffnungsdatum", fr:"Date d'ouverture", en:"Opening date", ar:"تاريخ الفتح", tr:"Açılış tarihi", es:"Fecha de apertura", it:"Data di apertura", pt:"Data de abertura", nl:"Openingsdatum" },
    sepaTransfers: { de:"SEPA-Überweisungen", fr:"Virements SEPA", en:"SEPA transfers", ar:"تحويلات SEPA", tr:"SEPA transferleri", es:"Transferencias SEPA", it:"Bonifici SEPA", pt:"Transferências SEPA", nl:"SEPA-overboekingen" },
    sepaDebit: { de:"SEPA-Lastschriften", fr:"Prélèvements SEPA", en:"SEPA direct debits", ar:"الخصم المباشر SEPA", tr:"SEPA otomatik ödemeler", es:"Domiciliaciones SEPA", it:"Addebiti diretti SEPA", pt:"Débitos diretos SEPA", nl:"SEPA-automatische incasso's" },
    onlineBanking: { de:"Online-Banking", fr:"Banque en ligne", en:"Online banking", ar:"الخدمات المصرفية عبر الإنترنت", tr:"İnternet bankacılığı", es:"Banca en línea", it:"Banca online", pt:"Banca online", nl:"Online bankieren" },
    statements: { de:"Kontoauszüge", fr:"Relevés de compte", en:"Account statements", ar:"كشوف الحساب", tr:"Hesap ekstreleri", es:"Extractos de cuenta", it:"Estratti conto", pt:"Extratos de conta", nl:"Rekeningafschriften" },
    included: { de:"Inklusive", fr:"Inclus", en:"Included", ar:"مشمول", tr:"Dahil", es:"Incluido", it:"Incluso", pt:"Incluído", nl:"Inbegrepen" },
    digital: { de:"Digital (kostenlos)", fr:"Numérique (gratuit)", en:"Digital (free)", ar:"رقمي (مجاني)", tr:"Dijital (ücretsiz)", es:"Digital (gratuito)", it:"Digitale (gratuito)", pt:"Digital (gratuito)", nl:"Digitaal (gratis)" },
    nextSteps: { de:"Nächste Schritte", fr:"Prochaines étapes", en:"Next Steps", ar:"الخطوات التالية", tr:"Sonraki Adımlar", es:"Próximos pasos", it:"Prossimi passi", pt:"Próximos passos", nl:"Volgende stappen" },
    // months
    months_de: { de:"Januar,Februar,März,April,Mai,Juni,Juli,August,September,Oktober,November,Dezember", fr:"janvier,février,mars,avril,mai,juin,juillet,août,septembre,octobre,novembre,décembre", en:"January,February,March,April,May,June,July,August,September,October,November,December", ar:"يناير,فبراير,مارس,أبريل,مايو,يونيو,يوليو,أغسطس,سبتمبر,أكتوبر,نوفمبر,ديسمبر", tr:"Ocak,Şubat,Mart,Nisan,Mayıs,Haziran,Temmuz,Ağustos,Eylül,Ekim,Kasım,Aralık", es:"enero,febrero,marzo,abril,mayo,junio,julio,agosto,septiembre,octubre,noviembre,diciembre", it:"gennaio,febbraio,marzo,aprile,maggio,giugno,luglio,agosto,settembre,ottobre,novembre,dicembre", pt:"janeiro,fevereiro,março,abril,maio,junho,julho,agosto,setembro,outubro,novembro,dezembro", nl:"januari,februari,maart,april,mei,juni,juli,augustus,september,oktober,november,december" },
    pdfBtn: { de:"↓ PDF", fr:"↓ PDF", en:"↓ PDF", ar:"↓ PDF", tr:"↓ PDF", es:"↓ PDF", it:"↓ PDF", pt:"↓ PDF", nl:"↓ PDF" },
    legalNote: { de:"", fr:"Ce document est établi en langue officielle.", en:"This document is issued in the official language.", ar:"هذه الوثيقة صادرة باللغة الرسمية.", tr:"Bu belge resmi dilde düzenlenmiştir.", es:"Este documento está redactado en el idioma oficial.", it:"Questo documento è redatto nella lingua ufficiale.", pt:"Este documento é emitido no idioma oficial.", nl:"Dit document is opgesteld in de officiële taal." },
  };
  return (labels[key]?.[lang as DocLang] ?? labels[key]?.de ?? key);
};

function baseStyles() {
  return `
    * { box-sizing: border-box; margin: 0; padding: 0; }

    /* Screen: A4 pages on gray background */
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      font-size: 12.5px; line-height: 1.65; color: #1a1a1a;
      background: #B0B0B0;
    }
    .page-bg { background: #B0B0B0; padding: 28px 0; min-height: 100vh; }

    /* A4 page card */
    .page {
      width: 210mm; min-height: 297mm;
      background: white;
      margin: 0 auto 28px auto;
      padding: 20mm 18mm;
      box-shadow: 0 4px 28px rgba(0,0,0,0.28);
      position: relative;
    }

    /* Print */
    @media print {
      * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      html, body { margin: 0 !important; padding: 0 !important; background: white !important; }
      .page-bg { background: white !important; padding: 0 !important; margin: 0 !important; }
      .page {
        display: block !important;
        position: relative !important;
        width: 100% !important;
        min-height: auto !important;
        height: auto !important;
        margin: 0 !important;
        padding: 20mm 18mm !important;
        box-shadow: none !important;
        overflow: visible !important;
        page-break-after: always !important;
        break-after: page !important;
      }
      .page:last-child { page-break-after: avoid !important; break-after: avoid !important; }
      @page { size: A4 portrait; margin: 0; }
      #pdf-btn { display: none !important; }
    }

    /* Letterhead */
    .letterhead { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 18px; border-bottom: 3px solid #005F2D; margin-bottom: 26px; }
    .logo-block h1 { color: #005F2D; font-size: 23px; font-weight: 900; letter-spacing: -0.5px; }
    .doc-logo { height: 34px; width: auto; display: block; margin-bottom: 6px; }
    .cont-logo { height: 20px; width: auto; display: block; }
    .logo-block p { color: #64748B; font-size: 10px; margin-top: 3px; }
    .bank-address { text-align: right; color: #64748B; font-size: 10px; line-height: 1.9; }

    /* Document title */
    .doc-title { text-align: center; margin-bottom: 24px; }
    .doc-title h2 { font-size: 17px; font-weight: 800; color: #0F172A; margin-bottom: 6px; }
    .doc-title .ref { display: inline-block; background: #F0FDF4; border: 1px solid #BBF7D0; color: #005F2D; font-size: 10px; font-weight: 700; padding: 3px 12px; border-radius: 20px; letter-spacing: 0.04em; }

    /* Parties */
    .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 22px; }
    .party-box { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 13px 15px; }
    .party-box h4 { color: #64748B; font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px; }
    .party-box p { color: #0F172A; font-size: 12px; line-height: 1.8; }
    .party-box .highlight { color: #005F2D; font-weight: 700; font-size: 13.5px; }

    /* Sections */
    .section { margin-bottom: 20px; page-break-inside: avoid; }
    .section h3 { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: #005F2D; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 1px solid #E2E8F0; }

    /* Info rows */
    .info-row { display: flex; justify-content: space-between; padding: 7px 0; border-bottom: 1px solid #F1F5F9; }
    .info-row:last-child { border-bottom: none; }
    .info-label { color: #64748B; font-size: 11.5px; }
    .info-value { color: #0F172A; font-weight: 600; font-size: 11.5px; text-align: right; }

    /* Highlight box */
    .highlight-box { background: linear-gradient(135deg, #F0FDF4, #DCFCE7); border: 1px solid #86EFAC; border-radius: 10px; padding: 16px 20px; margin-bottom: 20px; }
    .highlight-box .amount { font-size: 24px; font-weight: 900; color: #005F2D; }
    .highlight-box .label { color: #166534; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 3px; }

    /* Table */
    table { width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 16px; }
    thead th { background: #005F2D; color: white; padding: 7px 10px; font-weight: 700; text-align: right; font-size: 10px; text-transform: uppercase; letter-spacing: 0.04em; }
    thead th:first-child { text-align: center; }
    tbody td { padding: 5px 10px; text-align: right; border-bottom: 1px solid #F1F5F9; }
    tbody td:first-child { text-align: center; color: #64748B; }
    tbody tr:nth-child(even) { background: #F8FAFC; }

    /* Body text */
    .body-text { color: #374151; font-size: 12px; line-height: 1.8; margin-bottom: 13px; }

    /* ── SIGNATURE BLOCK ── */
    .sig-row {
      display: flex; justify-content: space-between; gap: 32px;
      margin-top: 32px; padding-top: 22px;
      border-top: 1.5px solid #CBD5E1;
      page-break-inside: avoid;
    }
    .sig-row-right { justify-content: flex-end; }
    .sig-col { flex: 1; display: flex; flex-direction: column; min-width: 0; }
    .sig-empty-zone { height: 68px; }

    /* Pre-signed bank */
    .sig-presigned-wrap {
      display: flex; flex-direction: column; align-items: center;
      background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 8px;
      padding: 10px 12px 8px; margin-bottom: 8px;
    }
    .sig-script {
      font-family: Georgia, 'Times New Roman', serif;
      font-size: 21px; color: #005F2D; font-style: italic; font-weight: 700;
      line-height: 1; margin-top: 4px;
    }
    .sig-sub-date { font-size: 9.5px; color: #16A34A; margin-top: 3px; font-weight: 600; }

    /* Client signature box */
    .sig-client-box {
      width: 100%; height: 76px;
      border: 2px dashed #94A3B8; border-radius: 6px;
      display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;
      margin-bottom: 8px; background: #FAFAFA;
    }
    .sig-client-hint { color: #94A3B8; font-size: 10.5px; font-style: italic; }
    .sig-client-sub { color: #CBD5E1; font-size: 9px; }
    .sig-date-field { font-size: 10.5px; color: #64748B; margin: 0 0 8px; }

    /* Common sig line */
    .sig-underline { border-top: 1.5px solid #334155; margin-bottom: 5px; }
    .sig-lbl { color: #64748B; font-size: 10.5px; margin: 0; }

    .footer-bar {
      margin-top: 28px; padding-top: 12px;
      border-top: 2px solid #E2E8F0;
      display: flex; justify-content: space-between; align-items: flex-start;
      page-break-inside: avoid;
    }
    .footer-bar p { color: #94A3B8; font-size: 9.5px; line-height: 1.8; }
    .badge { display: inline-flex; align-items: center; gap: 4px; background: #F0FDF4; border: 1px solid #BBF7D0; color: #005F2D; font-size: 9.5px; font-weight: 700; padding: 3px 8px; border-radius: 20px; }

    /* Custom body */
    .custom-body p { margin-bottom: 10px; }
    .custom-body h1 { font-size: 16px; margin: 14px 0 8px; color: #0F172A; }
    .custom-body h2 { font-size: 14px; margin: 12px 0 7px; color: #0F172A; }
    .custom-body h3 { font-size: 12px; margin: 10px 0 6px; color: #005F2D; }
    .custom-body ul, .custom-body ol { padding-left: 18px; margin-bottom: 10px; }
    .custom-body a { color: #005F2D; }
  `;
}

function officialStamp(size = 88) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="47" fill="none" stroke="#005F2D" stroke-width="2.2"/>
    <circle cx="50" cy="50" r="40" fill="none" stroke="#005F2D" stroke-width="0.7"/>
    <path id="sa" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" fill="none"/>
    <text font-family="Arial,sans-serif" font-size="7.8" font-weight="700" fill="#005F2D" letter-spacing="1.6">
      <textPath href="#sa" startOffset="2%">KT BANK AG · FRANKFURT AM MAIN · BaFin ·</textPath>
    </text>
    <text x="50" y="43" font-family="Georgia,'Times New Roman',serif" font-size="20" font-weight="900" fill="#005F2D" text-anchor="middle">KT</text>
    <text x="50" y="55" font-family="Arial,sans-serif" font-size="6.5" font-weight="700" fill="#005F2D" text-anchor="middle" letter-spacing="1.4">BANK AG</text>
    <line x1="32" y1="59" x2="68" y2="59" stroke="#005F2D" stroke-width="0.6"/>
    <text x="50" y="68" font-family="Arial,sans-serif" font-size="5.2" fill="#005F2D" text-anchor="middle" letter-spacing="0.7">REGULIERT · GESICHERT</text>
  </svg>`;
}

function letterhead() {
  return `
    <div class="letterhead">
      <div class="logo-block">
        <img src="/kt-logo.png" alt="KT Bank AG" class="doc-logo"
          onerror="this.style.display='none';this.nextElementSibling.style.display='block';" />
        <h1 style="display:none;">KT Bank AG</h1>
        <p>Reguliert durch die BaFin · IBAN-Netzwerk SEPA</p>
      </div>
      <div style="display:flex;align-items:center;gap:14px;">
        <div style="flex-shrink:0;">${officialStamp(72)}</div>
        <div class="bank-address">
          KT Bank AG<br/>
          Bockenheimer Anlage 46<br/>
          60322 Frankfurt am Main<br/>
          BIC: KTAGDEFF<br/>
          support@kt-bank-ag.com
        </div>
      </div>
    </div>
  `;
}

function footerBar(ref: string, lang = "de") {
  return `
    <div class="footer-bar">
      <p>
        KT Bank AG · Bockenheimer Anlage 46 · 60322 Frankfurt am Main<br/>
        Reguliert durch die BaFin · Einlagensicherungsfonds des privaten Bankgewerbes
      </p>
      <div style="text-align:right">
        <div class="badge">BaFin-reguliert</div><br/>
        <p style="margin-top:4px;">Ref: ${ref} · ${docDate(lang)}</p>
      </div>
    </div>
  `;
}

export interface SignatureOptions {
  presignedByBank?: boolean;
  clientSignatureSpace?: boolean;
}

function sigBlock(
  client: ClientInfo,
  opts: SignatureOptions = {},
  bankRole = "Direktion",
  showClientLine = true,
  lang = "de",
): string {
  const date = docDate(lang);

  const bankContent = opts.presignedByBank
    ? `<div class="sig-presigned-wrap">
        <span style="font-size:9px;color:#166534;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:6px;">${DL("presignedBy", lang)}</span>
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="flex-shrink:0;">${officialStamp(62)}</div>
          <div>
            <div class="sig-script">KT Bank AG</div>
            <div class="sig-sub-date">Frankfurt am Main, ${date}</div>
          </div>
        </div>
      </div>`
    : `<div class="sig-empty-zone"></div>`;

  const bankCol = `<div class="sig-col">
    ${bankContent}
    <div class="sig-underline"></div>
    <p class="sig-lbl">KT Bank AG — ${bankRole}</p>
  </div>`;

  if (!showClientLine) {
    return `<div class="sig-row sig-row-right">${bankCol}</div>`;
  }

  const clientContent = opts.clientSignatureSpace
    ? `<div class="sig-client-box">
        <span class="sig-client-hint">&#9997; ${DL("signHint", lang)}</span>
        <span class="sig-client-sub">Date: _______________</span>
      </div>`
    : `<div class="sig-empty-zone"></div>`;

  const clientCol = `<div class="sig-col">
    ${clientContent}
    <div class="sig-underline"></div>
    <p class="sig-lbl">${client.prenom} ${client.nom}</p>
  </div>`;

  return `<div class="sig-row">${clientCol}${bankCol}</div>`;
}

function contPageHeader(ref: string, subtitle: string, lang = "de") {
  return `<div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:12px;border-bottom:2px solid #005F2D;margin-bottom:18px;">
    <div>
      <img src="/kt-logo.png" alt="KT Bank AG" class="cont-logo"
        onerror="this.style.display='none';this.nextElementSibling.style.display='block';" />
      <p style="display:none;color:#005F2D;font-size:14px;font-weight:800;margin:0;">KT Bank AG</p>
      <p style="color:#64748B;font-size:10px;margin:2px 0 0;">${subtitle}</p>
    </div>
    <p style="color:#94A3B8;font-size:10px;margin:0;">Ref: ${ref} · ${docDate(lang)}</p>
  </div>`;
}

/* ── 1. Kontoeröffnungsbestätigung ── */
export function genKontoeröffnung(client: ClientInfo, sigOpts: SignatureOptions = {}, lang = "de"): string {
  const ref = docRef();
  const localeMap: Record<string, string> = { de:"de-DE", fr:"fr-FR", en:"en-GB", ar:"ar-SA", tr:"tr-TR", es:"es-ES", it:"it-IT", pt:"pt-PT", nl:"nl-NL" };
  const openDate = new Date(client.created_at).toLocaleDateString(localeMap[lang] ?? "de-DE", { day: "2-digit", month: "long", year: "numeric" });

  return `<!DOCTYPE html><html lang="${lang}"><head><meta charset="utf-8"/>
<title>${DL("accountConfirmTitle", lang)} — KT Bank AG</title>
<style>${baseStyles()}</style><script>(function(){function mm2px(mm){var d=document.createElement('div');d.style.cssText='position:fixed;top:-9999px;left:-9999px;height:'+mm+'mm;';document.body.appendChild(d);var h=d.offsetHeight;d.remove();return h;}function run(){var MAX=mm2px(255);document.querySelectorAll('.page-bg>.page').forEach(function(page){if(page.offsetHeight<=MAX*1.08)return;var allKids=Array.from(page.children);var footer=null;var kids=allKids.filter(function(k){if(k.classList&&k.classList.contains('footer-bar')){footer=k;return false;}return true;});var hs=kids.map(function(k){return k.offsetHeight;});var pages=[],cur=page.cloneNode(false),curH=0;kids.forEach(function(k,i){var h=hs[i]||20;if(curH>60&&curH+h>MAX){pages.push(cur);cur=page.cloneNode(false);curH=0;}cur.appendChild(k);curH+=h;});if(footer)cur.appendChild(footer);pages.push(cur);if(pages.length<2)return;var bg=page.parentNode;pages.forEach(function(p){bg.insertBefore(p,page);});bg.removeChild(page);});}function addBtn(){var b=document.createElement('button');b.id='pdf-btn';b.innerHTML='&#8595;&nbsp;PDF';b.title='Als PDF speichern / Enregistrer en PDF';b.style.cssText='position:fixed;bottom:24px;right:24px;z-index:9999;background:#005F2D;color:#fff;border:none;border-radius:10px;padding:12px 22px;font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 4px 18px rgba(0,95,45,0.5);font-family:Arial,sans-serif;letter-spacing:0.03em;';b.onmouseover=function(){this.style.background='#004020';};b.onmouseout=function(){this.style.background='#005F2D';};b.onclick=function(){window.print();};document.body.appendChild(b);}if(document.readyState==='complete'){setTimeout(run,80);addBtn();}else window.addEventListener('load',function(){setTimeout(run,80);addBtn();});})();</script></head><body><div class="page-bg"><div class="page">
${letterhead()}
<div class="doc-title">
  <h2>${DL("accountConfirmTitle", lang)}</h2>
  <span class="ref">Ref: ${ref}</span>
</div>

<div class="parties">
  <div class="party-box">
    <h4>${DL("accountHolder", lang)}</h4>
    <p class="highlight">${client.prenom} ${client.nom}</p>
    <p>${client.adresse ?? ""}<br/>${client.code_postal ?? ""} ${client.ville ?? ""}<br/>${client.pays_residence ?? ""}</p>
    <p style="margin-top:8px;">${client.email}</p>
  </div>
  <div class="party-box">
    <h4>${DL("accountData", lang)}</h4>
    <p><strong>${DL("iban", lang)}:</strong><br/><span class="highlight">${client.iban ?? "—"}</span></p>
    <p style="margin-top:6px;"><strong>BIC:</strong> ${client.bic ?? "KTAGDEFF"}</p>
    <p style="margin-top:6px;"><strong>${DL("accountType", lang)}:</strong> ${DL("currentAccount", lang)}</p>
    <p style="margin-top:6px;"><strong>${DL("openDate", lang)}:</strong> ${openDate}</p>
  </div>
</div>

<div class="section">
  <h3>${DL("confirmation", lang)}</h3>
  <p class="body-text">Wir bestätigen hiermit die erfolgreiche Eröffnung Ihres Girokontos bei der KT Bank AG. Ihr Konto ist ab sofort aktiv und verfügt über alle SEPA-Funktionen für nationale und internationale Überweisungen.</p>
  <p class="body-text">Alle Transaktionen unterliegen den geltenden Allgemeinen Geschäftsbedingungen der KT Bank AG sowie den einschlägigen deutschen und europäischen Bankenvorschriften.</p>
</div>

<div class="section">
  <h3>${DL("services", lang)}</h3>
  <div class="info-row"><span class="info-label">${DL("sepaTransfers", lang)}</span><span class="info-value">${DL("included", lang)}</span></div>
  <div class="info-row"><span class="info-label">${DL("sepaDebit", lang)}</span><span class="info-value">${DL("included", lang)}</span></div>
  <div class="info-row"><span class="info-label">${DL("onlineBanking", lang)}</span><span class="info-value">${DL("included", lang)}</span></div>
  <div class="info-row"><span class="info-label">${DL("statements", lang)}</span><span class="info-value">${DL("digital", lang)}</span></div>
  <div class="info-row"><span class="info-label">Kundenservice</span><span class="info-value">support@kt-bank-ag.com</span></div>
</div>

${sigBlock(client, sigOpts, DL("direction", lang), true, lang)}

${footerBar(ref, lang)}
</div></div></body></html>`;
}

/* ── 2. Willkommensschreiben ── */
export function genWillkommen(client: ClientInfo, sigOpts: SignatureOptions = {}, lang = "de"): string {
  const ref = docRef();

  return `<!DOCTYPE html><html lang="${lang}"><head><meta charset="utf-8"/>
<title>${DL("welcomeTitle", lang)} — KT Bank AG</title>
<style>${baseStyles()}</style><script>(function(){function mm2px(mm){var d=document.createElement('div');d.style.cssText='position:fixed;top:-9999px;left:-9999px;height:'+mm+'mm;';document.body.appendChild(d);var h=d.offsetHeight;d.remove();return h;}function run(){var MAX=mm2px(255);document.querySelectorAll('.page-bg>.page').forEach(function(page){if(page.offsetHeight<=MAX*1.08)return;var allKids=Array.from(page.children);var footer=null;var kids=allKids.filter(function(k){if(k.classList&&k.classList.contains('footer-bar')){footer=k;return false;}return true;});var hs=kids.map(function(k){return k.offsetHeight;});var pages=[],cur=page.cloneNode(false),curH=0;kids.forEach(function(k,i){var h=hs[i]||20;if(curH>60&&curH+h>MAX){pages.push(cur);cur=page.cloneNode(false);curH=0;}cur.appendChild(k);curH+=h;});if(footer)cur.appendChild(footer);pages.push(cur);if(pages.length<2)return;var bg=page.parentNode;pages.forEach(function(p){bg.insertBefore(p,page);});bg.removeChild(page);});}function addBtn(){var b=document.createElement('button');b.id='pdf-btn';b.innerHTML='&#8595;&nbsp;PDF';b.title='Als PDF speichern / Enregistrer en PDF';b.style.cssText='position:fixed;bottom:24px;right:24px;z-index:9999;background:#005F2D;color:#fff;border:none;border-radius:10px;padding:12px 22px;font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 4px 18px rgba(0,95,45,0.5);font-family:Arial,sans-serif;letter-spacing:0.03em;';b.onmouseover=function(){this.style.background='#004020';};b.onmouseout=function(){this.style.background='#005F2D';};b.onclick=function(){window.print();};document.body.appendChild(b);}if(document.readyState==='complete'){setTimeout(run,80);addBtn();}else window.addEventListener('load',function(){setTimeout(run,80);addBtn();});})();</script></head><body><div class="page-bg"><div class="page">
${letterhead()}

<p style="color:#64748B;font-size:12px;margin-bottom:24px;">
  ${client.prenom} ${client.nom}<br/>
  ${client.adresse ?? ""}<br/>
  ${client.code_postal ?? ""} ${client.ville ?? ""}<br/>
  ${client.pays_residence ?? ""}
</p>

<div class="doc-title">
  <h2>${DL("welcomeTitle", lang)}</h2>
  <span class="ref">Ref: ${ref}</span>
</div>

<div class="section">
  <p class="body-text">Sehr geehrte/r ${client.prenom} ${client.nom},</p>
  <p class="body-text">wir freuen uns, Sie als neuen Kunden der KT Bank AG begrüßen zu dürfen. Ihr Konto wurde erfolgreich eröffnet, und wir stehen Ihnen für alle Ihre Bankbedürfnisse zur Verfügung.</p>
  <p class="body-text">Die KT Bank AG bietet Ihnen ein vollständiges Spektrum an Bankdienstleistungen — von SEPA-Überweisungen bis hin zu islamischen Finanzprodukten gemäß den Mourabaha-Grundsätzen, alles reguliert und überwacht durch die BaFin (Bundesanstalt für Finanzdienstleistungsaufsicht).</p>
</div>

<div class="section">
  <h3>${DL("loanOverview", lang)}</h3>
  <div class="info-row"><span class="info-label">Name</span><span class="info-value">${client.prenom} ${client.nom}</span></div>
  <div class="info-row"><span class="info-label">${DL("iban", lang)}</span><span class="info-value" style="color:#005F2D;font-weight:700;">${client.iban ?? "—"}</span></div>
  <div class="info-row"><span class="info-label">BIC</span><span class="info-value">${client.bic ?? "KTAGDEFF"}</span></div>
  <div class="info-row"><span class="info-label">${DL("accountType", lang)}</span><span class="info-value">${DL("currentAccount", lang)}</span></div>
</div>

<div class="section">
  <h3>${DL("nextSteps", lang)}</h3>
  <p class="body-text">1. <strong>Identitätsverifizierung (KYC):</strong> Falls noch nicht abgeschlossen, reichen Sie bitte die erforderlichen Unterlagen über Ihr Online-Dashboard ein.<br/>
  2. <strong>Online-Banking:</strong> Melden Sie sich unter kt-bank-ag.com an, um alle Funktionen Ihres Kontos zu nutzen.<br/>
  3. <strong>Erster Transfer:</strong> Stellen Sie Ihren ersten SEPA-Überweisungsantrag direkt über das Dashboard.</p>
</div>

<p class="body-text">Bei Fragen stehen wir Ihnen jederzeit zur Verfügung: <strong>support@kt-bank-ag.com</strong></p>

${sigBlock(client, sigOpts, DL("accountManager", lang), true, lang)}

${footerBar(ref, lang)}
</div></div></body></html>`;
}

/* ── 3. Kreditvertrag ── */
export function genKreditvertrag(client: ClientInfo, loan: {
  type: "islamic" | "standard";
  amount: number;
  duration_months: number;
  monthly_payment: number;
  total_repayment: number;
  interest_rate: number;
  purpose?: string;
}, sigOpts: SignatureOptions = {}, lang = "de"): string {
  const ref = docRef();
  const fmtMoney = (n: number) => n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
  const rate = loan.interest_rate / 12;

  const allRows = Array.from({ length: loan.duration_months }, (_, i) => {
    const m = i + 1;
    const interest = loan.type === "islamic" ? 0 :
      (loan.amount - (loan.monthly_payment - loan.amount * rate) * (Math.pow(1 + rate, i) - 1) / (rate || 1)) * rate;
    const principal = loan.monthly_payment - (loan.type === "islamic" ? 0 : interest);
    return `<tr>
      <td>${m}</td>
      <td style="color:#374151;">${fmtMoney(loan.monthly_payment)}</td>
      <td style="color:#005F2D;">${fmtMoney(Math.max(0, principal))}</td>
      <td style="color:${loan.type === "standard" ? "#D97706" : "#16A34A"};">${fmtMoney(Math.max(0, interest))}</td>
    </tr>`;
  });

  const tableHead = `<thead><tr><th>${DL("month", lang)}</th><th>${DL("monthlyRate", lang)}</th><th>${DL("tilgungEur", lang)}</th><th>${DL("zinsenEur", lang)}</th></tr></thead>`;
  const ROWS_PER_PAGE = 25;

  const localeMap: Record<string, string> = { de:"de-DE", fr:"fr-FR", en:"en-GB", ar:"ar-SA", tr:"tr-TR", es:"es-ES", it:"it-IT", pt:"pt-PT", nl:"nl-NL" };
  // Page 1: contract terms + signature (no table)
  const page1 = `<div class="page">
${letterhead()}
<div class="doc-title">
  <h2>${DL("loanContractTitle", lang)}</h2>
  <span class="ref">${loan.type === "islamic" ? DL("islamicLoan", lang) : DL("standardLoan", lang)} · Ref: ${ref}</span>
</div>
<div class="parties">
  <div class="party-box">
    <h4>${DL("borrower", lang)}</h4>
    <p class="highlight">${client.prenom} ${client.nom}</p>
    <p>${client.adresse ?? ""}<br/>${client.code_postal ?? ""} ${client.ville ?? ""}<br/>${client.pays_residence ?? ""}</p>
    <p style="margin-top:6px;">${client.email}</p>
    <p style="margin-top:4px;"><strong>${DL("iban", lang)}:</strong> ${client.iban ?? "—"}</p>
  </div>
  <div class="party-box">
    <h4>${DL("lender", lang)}</h4>
    <p class="highlight">KT Bank AG</p>
    <p>Bockenheimer Anlage 46<br/>60322 Frankfurt am Main<br/>Deutschland</p>
    <p style="margin-top:6px;">BaFin-Reg. Nr. 12345678</p>
    <p style="margin-top:4px;"><strong>BIC:</strong> KTAGDEFF</p>
  </div>
</div>
<div class="highlight-box">
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;">
    <div><p class="label">${DL("loanAmount", lang)}</p><p class="amount">${fmtMoney(loan.amount)}</p></div>
    <div><p class="label">${DL("monthlyRate", lang)}</p><p class="amount" style="font-size:20px;">${fmtMoney(loan.monthly_payment)}</p></div>
    <div><p class="label">${DL("duration", lang)}</p><p class="amount" style="font-size:20px;">${loan.duration_months} Monate</p></div>
    <div><p class="label">${DL("interestRate", lang)} p. a.</p><p class="amount" style="font-size:20px;color:${loan.type === "islamic" ? "#16A34A" : "#D97706"};">${loan.type === "islamic" ? "0 %" : "2 %"}</p></div>
  </div>
</div>
<div class="section">
  <h3>${DL("terms", lang)}</h3>
  ${loan.purpose ? `<div class="info-row"><span class="info-label">Kreditzweck</span><span class="info-value">${loan.purpose}</span></div>` : ""}
  <div class="info-row"><span class="info-label">Kreditart</span><span class="info-value">${loan.type === "islamic" ? DL("islamicLoan", lang) : DL("standardLoan", lang)}</span></div>
  <div class="info-row"><span class="info-label">${DL("totalRepayment", lang)}</span><span class="info-value">${fmtMoney(loan.total_repayment)}</span></div>
  <div class="info-row"><span class="info-label">${DL("totalInterest", lang)}</span><span class="info-value" style="color:${loan.type === "standard" ? "#D97706" : "#16A34A"};">${fmtMoney(loan.total_repayment - loan.amount)}</span></div>
  <div class="info-row"><span class="info-label">${DL("contractDate", lang)}</span><span class="info-value">${docDate(lang)}</span></div>
  <div class="info-row"><span class="info-label">${DL("firstPayment", lang)}</span><span class="info-value">${new Date(Date.now() + 30 * 86400000).toLocaleDateString(localeMap[lang] ?? "de-DE", { day: "2-digit", month: "long", year: "numeric" })}</span></div>
</div>
<div class="section">
  <h3>${DL("generalTerms", lang)}</h3>
  <p class="body-text">Der Kreditnehmer verpflichtet sich, die monatlichen Raten pünktlich und vollständig zu entrichten. Bei Verzug werden Mahngebühren gemäß den geltenden Allgemeinen Geschäftsbedingungen der KT Bank AG erhoben. Der Kreditnehmer hat das Recht auf vorzeitige Rückzahlung ohne Vorfälligkeitsentschädigung.</p>
</div>
${sigBlock(client, sigOpts, DL("lender", lang), true, lang)}
</div>`;

  // Pages 2+: amortization table split into chunks of 25 rows
  let tablePages = "";
  for (let p = 0; p < allRows.length; p += ROWS_PER_PAGE) {
    const chunk = allRows.slice(p, p + ROWS_PER_PAGE);
    const isLast = p + ROWS_PER_PAGE >= allRows.length;
    tablePages += `<div class="page">
${contPageHeader(ref, `${DL("loanContractTitle", lang)} — ${DL("tilgungsplanTitle", lang)}${p > 0 ? " (Fortsetzung)" : ""}`, lang)}
<table style="margin-top:4px;">${tableHead}<tbody>${chunk.join("")}</tbody></table>
${isLast ? `<p style="color:#64748B;font-size:11px;text-align:right;margin-top:8px;">${DL("totalRepayment", lang)}: <strong style="color:#005F2D;">${fmtMoney(loan.total_repayment)}</strong></p>` : ""}
${isLast ? footerBar(ref, lang) : ""}
</div>`;
  }

  return `<!DOCTYPE html><html lang="${lang}"><head><meta charset="utf-8"/>
<title>${DL("loanContractTitle", lang)} — KT Bank AG</title>
<style>${baseStyles()}</style><script>(function(){function mm2px(mm){var d=document.createElement('div');d.style.cssText='position:fixed;top:-9999px;left:-9999px;height:'+mm+'mm;';document.body.appendChild(d);var h=d.offsetHeight;d.remove();return h;}function run(){var MAX=mm2px(255);document.querySelectorAll('.page-bg>.page').forEach(function(page){if(page.offsetHeight<=MAX*1.08)return;var allKids=Array.from(page.children);var footer=null;var kids=allKids.filter(function(k){if(k.classList&&k.classList.contains('footer-bar')){footer=k;return false;}return true;});var hs=kids.map(function(k){return k.offsetHeight;});var pages=[],cur=page.cloneNode(false),curH=0;kids.forEach(function(k,i){var h=hs[i]||20;if(curH>60&&curH+h>MAX){pages.push(cur);cur=page.cloneNode(false);curH=0;}cur.appendChild(k);curH+=h;});if(footer)cur.appendChild(footer);pages.push(cur);if(pages.length<2)return;var bg=page.parentNode;pages.forEach(function(p){bg.insertBefore(p,page);});bg.removeChild(page);});}function addBtn(){var b=document.createElement('button');b.id='pdf-btn';b.innerHTML='&#8595;&nbsp;PDF';b.title='Als PDF speichern / Enregistrer en PDF';b.style.cssText='position:fixed;bottom:24px;right:24px;z-index:9999;background:#005F2D;color:#fff;border:none;border-radius:10px;padding:12px 22px;font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 4px 18px rgba(0,95,45,0.5);font-family:Arial,sans-serif;letter-spacing:0.03em;';b.onmouseover=function(){this.style.background='#004020';};b.onmouseout=function(){this.style.background='#005F2D';};b.onclick=function(){window.print();};document.body.appendChild(b);}if(document.readyState==='complete'){setTimeout(run,80);addBtn();}else window.addEventListener('load',function(){setTimeout(run,80);addBtn();});})();</script></head><body><div class="page-bg">
${page1}${tablePages}
</div></body></html>`;
}

/* ── 4. Tilgungsplan (standalone) ── */
export function genTilgungsplan(client: ClientInfo, loan: {
  type: "islamic" | "standard";
  amount: number;
  duration_months: number;
  monthly_payment: number;
  total_repayment: number;
  interest_rate: number;
  purpose?: string;
}, sigOpts: SignatureOptions = {}, lang = "de"): string {
  const ref = docRef();
  const fmtMoney = (n: number) => n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
  const rate = loan.interest_rate / 12;

  const MONTH_NAMES = DL("months_de", lang).split(",");

  const allRows = (() => {
    const rows: string[] = [];
    let restschuld = loan.amount;
    let kumTilgung = 0;
    const now = new Date();
    const startMonthIdx = now.getMonth();
    const startYear = now.getFullYear();

    for (let i = 0; i < loan.duration_months; i++) {
      const m = i + 1;
      const dateTotalMonths = startMonthIdx + m;
      const datum = `${MONTH_NAMES[dateTotalMonths % 12]} ${startYear + Math.floor(dateTotalMonths / 12)}`;

      const isLast = i === loan.duration_months - 1;
      let interest: number, principal: number, payment: number;

      if (loan.type === "islamic") {
        interest = 0;
        principal = isLast ? restschuld : loan.monthly_payment;
        payment = principal;
      } else {
        interest = restschuld * rate;
        if (isLast) {
          principal = restschuld;
          payment = principal + interest;
        } else {
          payment = loan.monthly_payment;
          principal = Math.max(0, payment - interest);
        }
      }

      restschuld = Math.max(0, restschuld - principal);
      kumTilgung = Math.min(kumTilgung + principal, loan.amount);

      const isAnnual = m % 12 === 0;
      const rowBg = isAnnual ? ' style="background:#FFF8DC;"' : '';

      rows.push(`<tr${rowBg}>
        <td>${m}</td>
        <td style="text-align:left;">${datum}</td>
        <td>${fmtMoney(payment)}</td>
        <td style="color:${loan.type === "standard" ? "#D97706" : "#16A34A"};">${fmtMoney(Math.max(0, interest))}</td>
        <td style="color:#005F2D;">${fmtMoney(Math.max(0, principal))}</td>
        <td style="font-weight:600;">${fmtMoney(Math.max(0, restschuld))}</td>
        <td style="color:#005F2D;">${fmtMoney(kumTilgung)}</td>
      </tr>`);
    }
    return rows;
  })();

  const tableHead = `<thead><tr>
    <th style="text-align:center;width:6%;">${DL("month", lang)}</th>
    <th style="text-align:left;width:18%;">${DL("date", lang)}</th>
    <th style="width:13%;">${DL("rateEur", lang)}</th>
    <th style="width:13%;">${DL("zinsenEur", lang)}</th>
    <th style="width:13%;">${DL("tilgungEur", lang)}</th>
    <th style="width:13%;">${DL("restschuld", lang)}</th>
    <th style="width:13%;">${DL("kumTilgung", lang)}</th>
  </tr></thead>`;

  const gesamtRow = `<tr style="background:#F0FDF4;border-top:2px solid #005F2D;">
    <td colspan="2" style="text-align:left;font-weight:700;color:#005F2D;padding:7px 10px;">${DL("gesamt", lang)}</td>
    <td style="font-weight:700;color:#005F2D;">${fmtMoney(loan.total_repayment)}</td>
    <td style="font-weight:700;color:${loan.type === "standard" ? "#D97706" : "#16A34A"};">${fmtMoney(loan.total_repayment - loan.amount)}</td>
    <td style="font-weight:700;color:#005F2D;">${fmtMoney(loan.amount)}</td>
    <td style="font-weight:700;color:#16A34A;">0,00 €</td>
    <td style="font-weight:700;color:#005F2D;">${fmtMoney(loan.amount)}</td>
  </tr>`;

  const annualNote = `<p style="color:#64748B;font-size:10px;margin-top:4px;">${DL("annualNote", lang)}</p>`;

  const ROWS_FIRST = 16;
  const ROWS_PER_PAGE = 28;

  const summaryCards = [
    [DL("loanAmount", lang), fmtMoney(loan.amount), "#005F2D"],
    [DL("monthlyRate", lang), fmtMoney(loan.monthly_payment), "#005F2D"],
    [DL("duration", lang), `${loan.duration_months} Monate`, "#0F172A"],
    [DL("totalInterest", lang), fmtMoney(loan.total_repayment - loan.amount), loan.type === "standard" ? "#D97706" : "#16A34A"],
  ].map(([l, v, c]) => `<div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:10px;padding:14px 16px;">
    <p style="color:#94A3B8;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:5px;">${l}</p>
    <p style="color:${c};font-weight:800;font-size:16px;">${v}</p>
  </div>`).join("");

  const firstChunk = allRows.slice(0, ROWS_FIRST);
  const isOnePage = allRows.length <= ROWS_FIRST;

  const page1 = `<div class="page">
${letterhead()}
<div class="doc-title">
  <h2>${DL("tilgungsplanTitle", lang)}</h2>
  <span class="ref">${loan.type === "islamic" ? DL("islamicLoan", lang) : DL("standardLoan", lang)} · Ref: ${ref}</span>
</div>
<div class="parties">
  <div class="party-box">
    <h4>${DL("borrower", lang)}</h4>
    <p class="highlight">${client.prenom} ${client.nom}</p>
    <p>${client.adresse ?? ""} ${client.code_postal ?? ""} ${client.ville ?? ""}</p>
    <p>${client.email}</p>
  </div>
  <div class="party-box">
    <h4>${DL("loanOverview", lang)}</h4>
    <p><strong>${DL("loanAmount", lang)}:</strong> <span class="highlight">${fmtMoney(loan.amount)}</span></p>
    <p><strong>${DL("duration", lang)}:</strong> ${loan.duration_months} Monate</p>
    <p><strong>${DL("monthlyRate", lang)}:</strong> ${fmtMoney(loan.monthly_payment)} / Monat</p>
    <p><strong>${DL("interestRate", lang)}:</strong> ${loan.type === "islamic" ? "0 % (Mourabaha)" : "2 % p. a."}</p>
  </div>
</div>
<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px;">${summaryCards}</div>
<div class="section">
  <h3>${DL("paymentPlan", lang)}</h3>
  <table style="font-size:10px;">${tableHead}<tbody>${firstChunk.join("")}${isOnePage ? gesamtRow : ""}</tbody></table>
  ${isOnePage ? annualNote : ""}
</div>
${isOnePage ? sigBlock(client, sigOpts, DL("direction", lang), true, lang) : ""}
${isOnePage ? footerBar(ref, lang) : ""}
</div>`;

  // Continuation pages — table only; GESAMT row on last data page; footer on Abschluss page only
  let morePages = "";
  if (!isOnePage) {
    for (let p = ROWS_FIRST; p < allRows.length; p += ROWS_PER_PAGE) {
      const chunk = allRows.slice(p, p + ROWS_PER_PAGE);
      const isLast = p + ROWS_PER_PAGE >= allRows.length;
      morePages += `<div class="page">
${contPageHeader(ref, `${DL("tilgungsplanTitle", lang)} — Fortsetzung`, lang)}
<table style="font-size:10px;">${tableHead}<tbody>${chunk.join("")}${isLast ? gesamtRow : ""}</tbody></table>
${isLast ? annualNote : ""}
</div>`;
    }
    // Dedicated final page: signature only
    morePages += `<div class="page">
${contPageHeader(ref, `${DL("tilgungsplanTitle", lang)} — Abschluss`, lang)}
${sigBlock(client, sigOpts, DL("direction", lang), true, lang)}
${footerBar(ref, lang)}
</div>`;
  }

  return `<!DOCTYPE html><html lang="${lang}"><head><meta charset="utf-8"/>
<title>${DL("tilgungsplanTitle", lang)} — KT Bank AG</title>
<style>${baseStyles()}</style><script>(function(){function mm2px(mm){var d=document.createElement('div');d.style.cssText='position:fixed;top:-9999px;left:-9999px;height:'+mm+'mm;';document.body.appendChild(d);var h=d.offsetHeight;d.remove();return h;}function run(){var MAX=mm2px(255);document.querySelectorAll('.page-bg>.page').forEach(function(page){if(page.offsetHeight<=MAX*1.08)return;var allKids=Array.from(page.children);var footer=null;var kids=allKids.filter(function(k){if(k.classList&&k.classList.contains('footer-bar')){footer=k;return false;}return true;});var hs=kids.map(function(k){return k.offsetHeight;});var pages=[],cur=page.cloneNode(false),curH=0;kids.forEach(function(k,i){var h=hs[i]||20;if(curH>60&&curH+h>MAX){pages.push(cur);cur=page.cloneNode(false);curH=0;}cur.appendChild(k);curH+=h;});if(footer)cur.appendChild(footer);pages.push(cur);if(pages.length<2)return;var bg=page.parentNode;pages.forEach(function(p){bg.insertBefore(p,page);});bg.removeChild(page);});}function addBtn(){var b=document.createElement('button');b.id='pdf-btn';b.innerHTML='&#8595;&nbsp;PDF';b.title='Als PDF speichern / Enregistrer en PDF';b.style.cssText='position:fixed;bottom:24px;right:24px;z-index:9999;background:#005F2D;color:#fff;border:none;border-radius:10px;padding:12px 22px;font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 4px 18px rgba(0,95,45,0.5);font-family:Arial,sans-serif;letter-spacing:0.03em;';b.onmouseover=function(){this.style.background='#004020';};b.onmouseout=function(){this.style.background='#005F2D';};b.onclick=function(){window.print();};document.body.appendChild(b);}if(document.readyState==='complete'){setTimeout(run,80);addBtn();}else window.addEventListener('load',function(){setTimeout(run,80);addBtn();});})();</script></head><body><div class="page-bg">
${page1}${morePages}
</div></body></html>`;
}

/* ── 5. AGB (static) ── */
export function genAGB(_client: ClientInfo, lang = "de"): string {
  const ref = docRef();
  return `<!DOCTYPE html><html lang="${lang}"><head><meta charset="utf-8"/>
<title>${DL("agbTitle", lang)} — KT Bank AG</title>
<style>${baseStyles()}</style><script>(function(){function mm2px(mm){var d=document.createElement('div');d.style.cssText='position:fixed;top:-9999px;left:-9999px;height:'+mm+'mm;';document.body.appendChild(d);var h=d.offsetHeight;d.remove();return h;}function run(){var MAX=mm2px(255);document.querySelectorAll('.page-bg>.page').forEach(function(page){if(page.offsetHeight<=MAX*1.08)return;var allKids=Array.from(page.children);var footer=null;var kids=allKids.filter(function(k){if(k.classList&&k.classList.contains('footer-bar')){footer=k;return false;}return true;});var hs=kids.map(function(k){return k.offsetHeight;});var pages=[],cur=page.cloneNode(false),curH=0;kids.forEach(function(k,i){var h=hs[i]||20;if(curH>60&&curH+h>MAX){pages.push(cur);cur=page.cloneNode(false);curH=0;}cur.appendChild(k);curH+=h;});if(footer)cur.appendChild(footer);pages.push(cur);if(pages.length<2)return;var bg=page.parentNode;pages.forEach(function(p){bg.insertBefore(p,page);});bg.removeChild(page);});}function addBtn(){var b=document.createElement('button');b.id='pdf-btn';b.innerHTML='&#8595;&nbsp;PDF';b.title='Als PDF speichern / Enregistrer en PDF';b.style.cssText='position:fixed;bottom:24px;right:24px;z-index:9999;background:#005F2D;color:#fff;border:none;border-radius:10px;padding:12px 22px;font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 4px 18px rgba(0,95,45,0.5);font-family:Arial,sans-serif;letter-spacing:0.03em;';b.onmouseover=function(){this.style.background='#004020';};b.onmouseout=function(){this.style.background='#005F2D';};b.onclick=function(){window.print();};document.body.appendChild(b);}if(document.readyState==='complete'){setTimeout(run,80);addBtn();}else window.addEventListener('load',function(){setTimeout(run,80);addBtn();});})();</script></head><body><div class="page-bg"><div class="page">
${letterhead()}
<div class="doc-title"><h2>${DL("agbTitle", lang)}</h2><span class="ref">Stand: Januar 2024 · Ref: ${ref}</span></div>
${DL("legalNote", lang) ? `<p style="color:#64748B;font-size:10px;margin-bottom:16px;">${DL("legalNote", lang)}</p>` : ""}
<div class="section"><h3>§ 1 Geltungsbereich</h3>
<p class="body-text">Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Geschäftsbeziehungen zwischen der KT Bank AG (nachfolgend "Bank") und ihren Kunden (nachfolgend "Kunde").</p></div>
<div class="section"><h3>§ 2 Kontoführung</h3>
<p class="body-text">Die Bank führt Konten auf den Namen des Kunden. Der Kunde ist verpflichtet, die Bank unverzüglich über Änderungen seiner persönlichen Daten zu informieren.</p></div>
<div class="section"><h3>§ 3 Überweisungsaufträge</h3>
<p class="body-text">SEPA-Überweisungen werden innerhalb eines Bankarbeitstages ausgeführt. Internationale Überweisungen können bis zu 5 Bankarbeitstage in Anspruch nehmen.</p></div>
<div class="section"><h3>§ 4 Entgelte</h3>
<p class="body-text">Die aktuellen Konditionen und Entgelte sind im Preis- und Leistungsverzeichnis der Bank festgelegt, das auf Anfrage zur Verfügung gestellt wird.</p></div>
<div class="section"><h3>§ 5 Datenschutz</h3>
<p class="body-text">Die Bank verarbeitet personenbezogene Daten gemäß der EU-Datenschutz-Grundverordnung (DSGVO) und dem Bundesdatenschutzgesetz (BDSG).</p></div>
<div class="section"><h3>§ 6 Kündigung</h3>
<p class="body-text">Das Konto kann von beiden Seiten jederzeit schriftlich gekündigt werden. Bei Kündigung durch die Bank gilt eine Frist von 2 Monaten.</p></div>
${footerBar(ref, lang)}
</div></div></body></html>`;
}

/* ── 6. Datenschutzerklärung (static) ── */
export function genDatenschutz(_client: ClientInfo, lang = "de"): string {
  const ref = docRef();
  return `<!DOCTYPE html><html lang="${lang}"><head><meta charset="utf-8"/>
<title>${DL("datenschutzTitle", lang)} — KT Bank AG</title>
<style>${baseStyles()}</style><script>(function(){function mm2px(mm){var d=document.createElement('div');d.style.cssText='position:fixed;top:-9999px;left:-9999px;height:'+mm+'mm;';document.body.appendChild(d);var h=d.offsetHeight;d.remove();return h;}function run(){var MAX=mm2px(255);document.querySelectorAll('.page-bg>.page').forEach(function(page){if(page.offsetHeight<=MAX*1.08)return;var allKids=Array.from(page.children);var footer=null;var kids=allKids.filter(function(k){if(k.classList&&k.classList.contains('footer-bar')){footer=k;return false;}return true;});var hs=kids.map(function(k){return k.offsetHeight;});var pages=[],cur=page.cloneNode(false),curH=0;kids.forEach(function(k,i){var h=hs[i]||20;if(curH>60&&curH+h>MAX){pages.push(cur);cur=page.cloneNode(false);curH=0;}cur.appendChild(k);curH+=h;});if(footer)cur.appendChild(footer);pages.push(cur);if(pages.length<2)return;var bg=page.parentNode;pages.forEach(function(p){bg.insertBefore(p,page);});bg.removeChild(page);});}function addBtn(){var b=document.createElement('button');b.id='pdf-btn';b.innerHTML='&#8595;&nbsp;PDF';b.title='Als PDF speichern / Enregistrer en PDF';b.style.cssText='position:fixed;bottom:24px;right:24px;z-index:9999;background:#005F2D;color:#fff;border:none;border-radius:10px;padding:12px 22px;font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 4px 18px rgba(0,95,45,0.5);font-family:Arial,sans-serif;letter-spacing:0.03em;';b.onmouseover=function(){this.style.background='#004020';};b.onmouseout=function(){this.style.background='#005F2D';};b.onclick=function(){window.print();};document.body.appendChild(b);}if(document.readyState==='complete'){setTimeout(run,80);addBtn();}else window.addEventListener('load',function(){setTimeout(run,80);addBtn();});})();</script></head><body><div class="page-bg"><div class="page">
${letterhead()}
<div class="doc-title"><h2>${DL("datenschutzTitle", lang)}</h2><span class="ref">Stand: Januar 2024 · Ref: ${ref}</span></div>
${DL("legalNote", lang) ? `<p style="color:#64748B;font-size:10px;margin-bottom:16px;">${DL("legalNote", lang)}</p>` : ""}
<div class="section"><h3>1. Verantwortlicher</h3>
<p class="body-text">KT Bank AG, Bockenheimer Anlage 46, 60322 Frankfurt am Main. Datenschutzbeauftragter: datenschutz@kt-bank-ag.com</p></div>
<div class="section"><h3>2. Verarbeitete Daten</h3>
<p class="body-text">Wir verarbeiten folgende personenbezogene Daten: Name, Adresse, E-Mail, Telefonnummer, Bankverbindung, Transaktionsdaten sowie Identifikationsdokumente im Rahmen der gesetzlichen KYC-Pflichten.</p></div>
<div class="section"><h3>3. Zweck der Verarbeitung</h3>
<p class="body-text">Die Datenverarbeitung erfolgt zur Erfüllung des Vertrags (Art. 6 Abs. 1 lit. b DSGVO), zur Erfüllung rechtlicher Pflichten (Art. 6 Abs. 1 lit. c DSGVO) sowie auf Basis berechtigter Interessen der Bank.</p></div>
<div class="section"><h3>4. Ihre Rechte</h3>
<p class="body-text">Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung. Beschwerden können an die zuständige Aufsichtsbehörde gerichtet werden.</p></div>
<div class="section"><h3>5. Datensicherheit</h3>
<p class="body-text">Alle Daten werden nach aktuellen technischen Standards verschlüsselt übertragen (TLS 1.3) und gespeichert (AES-256).</p></div>
${footerBar(ref, lang)}
</div></div></body></html>`;
}

/* ── 7. Custom document ── */
export function genCustom(client: ClientInfo, opts: { title: string; body_html: string }, sigOpts: SignatureOptions = {}, lang = "de"): string {
  const ref = docRef();
  return `<!DOCTYPE html><html lang="${lang}"><head><meta charset="utf-8"/>
<title>${opts.title} — KT Bank AG</title>
<style>${baseStyles()}
.custom-body p { margin-bottom:10px; }
.custom-body h1 { font-size:18px; margin:16px 0 10px; color:#0F172A; }
.custom-body h2 { font-size:15px; margin:14px 0 8px; color:#0F172A; }
.custom-body h3 { font-size:13px; margin:12px 0 6px; color:#005F2D; }
.custom-body ul,.custom-body ol { padding-left:20px; margin-bottom:10px; }
.custom-body a { color:#005F2D; }
</style><script>(function(){function mm2px(mm){var d=document.createElement('div');d.style.cssText='position:fixed;top:-9999px;left:-9999px;height:'+mm+'mm;';document.body.appendChild(d);var h=d.offsetHeight;d.remove();return h;}function run(){var MAX=mm2px(255);document.querySelectorAll('.page-bg>.page').forEach(function(page){if(page.offsetHeight<=MAX*1.08)return;var allKids=Array.from(page.children);var footer=null;var kids=allKids.filter(function(k){if(k.classList&&k.classList.contains('footer-bar')){footer=k;return false;}return true;});var hs=kids.map(function(k){return k.offsetHeight;});var pages=[],cur=page.cloneNode(false),curH=0;kids.forEach(function(k,i){var h=hs[i]||20;if(curH>60&&curH+h>MAX){pages.push(cur);cur=page.cloneNode(false);curH=0;}cur.appendChild(k);curH+=h;});if(footer)cur.appendChild(footer);pages.push(cur);if(pages.length<2)return;var bg=page.parentNode;pages.forEach(function(p){bg.insertBefore(p,page);});bg.removeChild(page);});}function addBtn(){var b=document.createElement('button');b.id='pdf-btn';b.innerHTML='&#8595;&nbsp;PDF';b.title='Als PDF speichern / Enregistrer en PDF';b.style.cssText='position:fixed;bottom:24px;right:24px;z-index:9999;background:#005F2D;color:#fff;border:none;border-radius:10px;padding:12px 22px;font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 4px 18px rgba(0,95,45,0.5);font-family:Arial,sans-serif;letter-spacing:0.03em;';b.onmouseover=function(){this.style.background='#004020';};b.onmouseout=function(){this.style.background='#005F2D';};b.onclick=function(){window.print();};document.body.appendChild(b);}if(document.readyState==='complete'){setTimeout(run,80);addBtn();}else window.addEventListener('load',function(){setTimeout(run,80);addBtn();});})();</script></head><body><div class="page-bg"><div class="page">
${letterhead()}
<p style="color:#64748B;font-size:12px;margin-bottom:24px;">
  ${client.prenom} ${client.nom}<br/>
  ${client.adresse ?? ""} ${client.code_postal ?? ""} ${client.ville ?? ""}
</p>
<div class="doc-title">
  <h2>${opts.title}</h2>
  <span class="ref">Ref: ${ref} · ${docDate(lang)}</span>
</div>
<div class="custom-body" style="margin-bottom:32px;">
  ${opts.body_html}
</div>
${sigBlock(client, sigOpts, "Frankfurt am Main", true, lang)}
${footerBar(ref, lang)}
</div></div></body></html>`;
}

/* ── Template dispatch ── */
export type DocType = "kontoeroeffnung" | "willkommen" | "kreditvertrag" | "tilgungsplan" | "agb" | "datenschutz" | "custom";

export const DOC_TYPES: { value: DocType; label: string; description: string; needsLoan: boolean; needsBody: boolean }[] = [
  { value: "kontoeroeffnung", label: "Kontoeröffnungsbestätigung", description: "Bestätigung der Kontoeröffnung mit IBAN", needsLoan: false, needsBody: false },
  { value: "willkommen", label: "Willkommensschreiben", description: "Persönliches Begrüßungsschreiben", needsLoan: false, needsBody: false },
  { value: "kreditvertrag", label: "Kreditvertrag", description: "Vollständiger Vertrag mit Tilgungsplan", needsLoan: true, needsBody: false },
  { value: "tilgungsplan", label: "Tilgungsplan", description: "Detaillierter Zahlungsplan", needsLoan: true, needsBody: false },
  { value: "agb", label: "Allgemeine Geschäftsbedingungen", description: "AGB der KT Bank AG", needsLoan: false, needsBody: false },
  { value: "datenschutz", label: "Datenschutzerklärung", description: "DSGVO-konforme Datenschutzerklärung", needsLoan: false, needsBody: false },
  { value: "custom", label: "Benutzerdefiniertes Dokument", description: "Freier Text mit eigenem Titel", needsLoan: false, needsBody: true },
];

export const SUBMISSION_TYPES = [
  { value: "identitaet", label: "Identitätsnachweis (Personalausweis / Reisepass)" },
  { value: "wohnsitz", label: "Wohnsitznachweis (Strom-/Wasserrechnung)" },
  { value: "einkommen", label: "Einkommensnachweis (Gehaltsabrechnung)" },
  { value: "bank", label: "Kontoauszug einer anderen Bank" },
  { value: "steuer", label: "Steuerbescheid" },
  { value: "sonstige", label: "Sonstiges Dokument" },
];
