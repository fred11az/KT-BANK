"use client";
import { useEffect, useState, useCallback, useMemo, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Check, Copy, FileText, ArrowLeft, AlertCircle, Building2, Clock, Printer, Lock, Shield, Wifi, Send } from "lucide-react";

type FeePayment = { name: string; iban: string; bic: string; bank: string; reference: string };
type Transfer = { id: string; to_name: string; to_iban: string; amount: number; fee_amount: number; status: string; reference?: string; created_at: string };
type Lang = "de" | "fr" | "en" | "ar" | "tr" | "es" | "it" | "pt" | "nl";

function TL(lang: string, variants: Partial<Record<Lang, string>> & { de: string }): string {
  return variants[lang as Lang] ?? variants.de;
}

const LOCALE_MAP: Record<Lang, string> = {
  de: "de-DE", fr: "fr-FR", en: "en-GB", ar: "ar-SA", tr: "tr-TR",
  es: "es-ES", it: "it-IT", pt: "pt-PT", nl: "nl-NL",
};

const TP = {
  portalTitle: (l: string) => TL(l, { de:"Sicheres Zahlungsportal wird geladen", fr:"Chargement du portail sécurisé", en:"Secure payment portal loading", ar:"جارٍ تحميل البوابة الآمنة", tr:"Güvenli ödeme portalı yükleniyor", es:"Cargando portal de pago seguro", it:"Caricamento portale sicuro", pt:"A carregar portal seguro", nl:"Beveiligde betaalportal laden" }),
  portalSub: (l: string) => TL(l, { de:"Bitte warten — Bankdaten werden sicher abgerufen…", fr:"Veuillez patienter — données bancaires en cours de récupération…", en:"Please wait — bank data is being securely retrieved…", ar:"يرجى الانتظار — يتم استرداد البيانات المصرفية بأمان…", tr:"Lütfen bekleyin — banka verileri güvenli şekilde alınıyor…", es:"Por favor espere — obteniendo datos bancarios de forma segura…", it:"Attendere prego — recupero sicuro dei dati bancari…", pt:"Aguarde — dados bancários a serem obtidos em segurança…", nl:"Even geduld — bankgegevens worden veilig opgehaald…" }),
  feeFreeTitle: (l: string) => TL(l, { de:"Überweisung wird bearbeitet…", fr:"Virement en cours de traitement…", en:"Transfer being processed…", ar:"جارٍ معالجة التحويل…", tr:"Transfer işleniyor…", es:"Transferencia en proceso…", it:"Trasferimento in elaborazione…", pt:"Transferência em processamento…", nl:"Overschrijving wordt verwerkt…" }),
  freeFreeSub: (l: string) => TL(l, { de:"Ihr gebührenfreier Auftrag wird sicher übermittelt", fr:"Votre ordre sans frais est transmis en toute sécurité", en:"Your fee-free order is being securely transmitted", ar:"يتم إرسال طلبك المجاني بشكل آمن", tr:"Ücretsiz ödemeniz güvenli şekilde iletiliyor", es:"Su orden sin comisiones se transmite con seguridad", it:"Il suo ordine senza commissioni viene trasmesso in sicurezza", pt:"A sua ordem sem taxa está a ser transmitida com segurança", nl:"Uw kostenvrije opdracht wordt veilig verzonden" }),
  successTitle: (l: string, feeFree: boolean) => feeFree
    ? TL(l, { de:"Überweisung erfolgreich verarbeitet", fr:"Virement traité avec succès", en:"Transfer successfully processed", ar:"تمت معالجة التحويل بنجاح", tr:"Transfer başarıyla işlendi", es:"Transferencia procesada con éxito", it:"Trasferimento elaborato con successo", pt:"Transferência processada com sucesso", nl:"Overschrijving succesvol verwerkt" })
    : TL(l, { de:"Überweisungsauftrag eingereicht", fr:"Ordre de virement soumis", en:"Transfer order submitted", ar:"تم تقديم أمر التحويل", tr:"Transfer emri gönderildi", es:"Orden de transferencia enviada", it:"Ordine di trasferimento inviato", pt:"Ordem de transferência enviada", nl:"Overboekingsopdracht ingediend" }),
  successSub: (l: string, feeFree: boolean) => feeFree
    ? TL(l, { de:"Ihre Überweisung wird bearbeitet und innerhalb von 48 Stunden ausgeführt.", fr:"Votre virement est en cours de traitement. Il sera exécuté dans les 48 heures.", en:"Your transfer is being processed and will be executed within 48 hours.", ar:"يتم معالجة تحويلك وسيتم تنفيذه خلال 48 ساعة.", tr:"Transferiniz işleniyor ve 48 saat içinde gerçekleştirilecek.", es:"Su transferencia está siendo procesada y se ejecutará en 48 horas.", it:"Il suo trasferimento è in elaborazione e sarà eseguito entro 48 ore.", pt:"A sua transferência está a ser processada e será executada em 48 horas.", nl:"Uw overschrijving wordt verwerkt en binnen 48 uur uitgevoerd." })
    : TL(l, { de:"Ihr Dossier wird geprüft. Die Überweisung wird innerhalb von 48 Stunden ausgeführt.", fr:"Votre dossier est en cours d'examen. Le virement sera exécuté dans les 48 heures.", en:"Your file is under review. The transfer will be executed within 48 hours.", ar:"ملفك قيد المراجعة. سيتم تنفيذ التحويل خلال 48 ساعة.", tr:"Dosyanız inceleniyor. Transfer 48 saat içinde gerçekleştirilecek.", es:"Su expediente está en revisión. La transferencia se ejecutará en 48 horas.", it:"La sua pratica è in esame. Il trasferimento sarà eseguito entro 48 ore.", pt:"O seu processo está em análise. A transferência será executada em 48 horas.", nl:"Uw dossier wordt beoordeeld. De overschrijving wordt binnen 48 uur uitgevoerd." }),
  inProgress: (l: string) => TL(l, { de:"In Bearbeitung", fr:"En cours", en:"In progress", ar:"قيد المعالجة", tr:"İşleniyor", es:"En proceso", it:"In elaborazione", pt:"Em processamento", nl:"In verwerking" }),
  enCours: (l: string) => TL(l, { de:"Läuft…", fr:"En cours…", en:"Running…", ar:"جارٍ…", tr:"Devam ediyor…", es:"En curso…", it:"In corso…", pt:"Em andamento…", nl:"Bezig…" }),
  feeTitle: (l: string) => TL(l, { de:"Bearbeitungsgebühr zahlen", fr:"Payer les frais de traitement", en:"Pay processing fee", ar:"دفع رسوم المعالجة", tr:"İşlem ücretini öde", es:"Pagar tarifa de procesamiento", it:"Paga la commissione di elaborazione", pt:"Pagar taxa de processamento", nl:"Verwerkingskosten betalen" }),
  feeSub: (l: string) => TL(l, { de:"Überweisen Sie die Gebühr auf das unten angezeigte Konto und laden Sie Ihren Beleg hoch.", fr:"Virez les frais sur le compte indiqué ci-dessous et téléchargez votre justificatif.", en:"Transfer the fee to the account shown below and upload your proof.", ar:"حوّل الرسوم إلى الحساب أدناه وقم بتحميل إثباتك.", tr:"Ücreti aşağıda gösterilen hesaba gönderin ve dekontu yükleyin.", es:"Transfiera la comisión a la cuenta indicada y suba su comprobante.", it:"Trasferisca la commissione al conto indicato e carichi la ricevuta.", pt:"Transfira a taxa para a conta indicada e carregue o seu comprovativo.", nl:"Maak de vergoeding over naar het getoonde rekening en upload uw bewijs." }),
  feeLabel: (l: string) => TL(l, { de:"Zu zahlende Gebühr", fr:"Frais à payer", en:"Fee to pay", ar:"الرسوم المستحقة", tr:"Ödenecek ücret", es:"Tarifa a pagar", it:"Commissione da pagare", pt:"Taxa a pagar", nl:"Te betalen vergoeding" }),
  amountLabel: (l: string) => TL(l, { de:"Überweisungsbetrag", fr:"Montant du virement", en:"Transfer amount", ar:"مبلغ التحويل", tr:"Transfer tutarı", es:"Importe de transferencia", it:"Importo del trasferimento", pt:"Montante da transferência", nl:"Overboekingsbedrag" }),
  bankDetails: (l: string) => TL(l, { de:"Bankverbindung für die Gebühr", fr:"Coordonnées bancaires pour les frais", en:"Bank details for the fee", ar:"التفاصيل البنكية للرسوم", tr:"Ücret için banka bilgileri", es:"Datos bancarios para la tarifa", it:"Coordinate bancarie per la commissione", pt:"Dados bancários para a taxa", nl:"Bankgegevens voor de vergoeding" }),
  proofTitle: (l: string) => TL(l, { de:"Zahlungsnachweis einreichen", fr:"Soumettre le justificatif de paiement", en:"Submit payment proof", ar:"تقديم إثبات الدفع", tr:"Ödeme kanıtını gönder", es:"Enviar comprobante de pago", it:"Invia ricevuta di pagamento", pt:"Enviar comprovativo de pagamento", nl:"Betalingsbewijs indienen" }),
  refLabel: (l: string) => TL(l, { de:"Überweisungsreferenz", fr:"Référence du virement", en:"Transfer reference", ar:"مرجع التحويل", tr:"Transfer referansı", es:"Referencia de transferencia", it:"Riferimento del trasferimento", pt:"Referência da transferência", nl:"Overboekingsreferentie" }),
  optional: (l: string) => TL(l, { de:"optional", fr:"optionnel", en:"optional", ar:"اختياري", tr:"isteğe bağlı", es:"opcional", it:"opzionale", pt:"opcional", nl:"optioneel" }),
  proofLabel: (l: string) => TL(l, { de:"Zahlungsbeleg", fr:"Justificatif de paiement", en:"Payment receipt", ar:"إيصال الدفع", tr:"Ödeme dekontu", es:"Comprobante de pago", it:"Ricevuta di pagamento", pt:"Comprovativo de pagamento", nl:"Betalingsbewijs" }),
  required: (l: string) => TL(l, { de:"* Pflichtfeld", fr:"* obligatoire", en:"* required", ar:"* مطلوب", tr:"* zorunlu", es:"* obligatorio", it:"* obbligatorio", pt:"* obrigatório", nl:"* verplicht" }),
  proofPlaceholder: (l: string) => TL(l, { de:"Datei auswählen (JPG, PNG, PDF · max. 5 MB)", fr:"Choisir un fichier (JPG, PNG, PDF · max. 5 Mo)", en:"Choose file (JPG, PNG, PDF · max. 5 MB)", ar:"اختر ملفاً (JPG، PNG، PDF · بحد أقصى 5 ميغابايت)", tr:"Dosya seç (JPG, PNG, PDF · maks. 5 MB)", es:"Seleccionar archivo (JPG, PNG, PDF · máx. 5 MB)", it:"Scegli file (JPG, PNG, PDF · max. 5 MB)", pt:"Escolher ficheiro (JPG, PNG, PDF · máx. 5 MB)", nl:"Bestand kiezen (JPG, PNG, PDF · max. 5 MB)" }),
  submitBtn: (l: string) => TL(l, { de:"Zahlungsbeleg sicher einreichen", fr:"Soumettre le justificatif en toute sécurité", en:"Securely submit payment proof", ar:"تقديم إثبات الدفع بأمان", tr:"Ödeme kanıtını güvenli gönder", es:"Enviar comprobante de pago de forma segura", it:"Invia ricevuta in modo sicuro", pt:"Enviar comprovativo com segurança", nl:"Betalingsbewijs veilig indienen" }),
  sending: (l: string) => TL(l, { de:"Wird gesendet…", fr:"Envoi en cours…", en:"Sending…", ar:"جارٍ الإرسال…", tr:"Gönderiliyor…", es:"Enviando…", it:"Invio in corso…", pt:"A enviar…", nl:"Verzenden…" }),
  proofRequired: (l: string) => TL(l, { de:"Ein Zahlungsbeleg ist erforderlich.", fr:"Un justificatif de paiement est requis.", en:"A payment proof is required.", ar:"إثبات الدفع مطلوب.", tr:"Ödeme kanıtı gereklidir.", es:"Se requiere un comprobante de pago.", it:"È richiesta una ricevuta di pagamento.", pt:"É necessário um comprovativo de pagamento.", nl:"Een betalingsbewijs is vereist." }),
  disclaimer48h: (l: string) => TL(l, { de:"Nach Einreichung prüft unser Team Ihren Beleg. Ihr Virement wird innerhalb von 48 Stunden bearbeitet.", fr:"Après soumission, notre équipe vérifie votre justificatif. Votre virement sera traité dans les 48 heures.", en:"After submission, our team will verify your proof. Your transfer will be processed within 48 hours.", ar:"بعد التقديم، سيراجع فريقنا إيصالك. سيتم معالجة تحويلك خلال 48 ساعة.", tr:"Gönderimin ardından ekibimiz dekontu doğrular. Transferiniz 48 saat içinde işlenir.", es:"Tras el envío, nuestro equipo verificará el comprobante. Su transferencia se procesará en 48 horas.", it:"Dopo l'invio, il nostro team verificherà la ricevuta. Il trasferimento sarà elaborato entro 48 ore.", pt:"Após a submissão, a nossa equipa verificará o comprovativo. A transferência será processada em 48 horas.", nl:"Na indiening verifieert ons team uw bewijs. Uw overschrijving wordt binnen 48 uur verwerkt." }),
  instantRequired: (l: string) => TL(l, { de:"Sofortüberweisung erforderlich", fr:"Virement instantané requis", en:"Instant transfer required", ar:"التحويل الفوري مطلوب", tr:"Anlık transfer gerekli", es:"Transferencia instantánea requerida", it:"Bonifico immediato richiesto", pt:"Transferência instantânea obrigatória", nl:"Directe overboeking vereist" }),
  instantSub: (l: string) => TL(l, { de:"Bitte nutzen Sie ausschließlich die Echtzeitüberweisung (SEPA Instant).", fr:"Veuillez utiliser uniquement le virement instantané (SEPA Instant).", en:"Please use only instant transfer (SEPA Instant).", ar:"يرجى استخدام التحويل الفوري (SEPA Instant) فقط.", tr:"Lütfen yalnızca anlık transfer (SEPA Instant) kullanın.", es:"Por favor use únicamente la transferencia instantánea (SEPA Instant).", it:"Si prega di utilizzare solo il bonifico istantaneo (SEPA Instant).", pt:"Por favor use apenas transferência instantânea (SEPA Instant).", nl:"Gebruik uitsluitend een directe overboeking (SEPA Instant)." }),
  loading: (l: string) => TL(l, { de:"Wird geladen…", fr:"Chargement…", en:"Loading…", ar:"جارٍ التحميل…", tr:"Yükleniyor…", es:"Cargando…", it:"Caricamento…", pt:"A carregar…", nl:"Laden…" }),
  print: (l: string) => TL(l, { de:"Herunterladen / Drucken", fr:"Télécharger / Imprimer", en:"Download / Print", ar:"تنزيل / طباعة", tr:"İndir / Yazdır", es:"Descargar / Imprimir", it:"Scarica / Stampa", pt:"Descarregar / Imprimir", nl:"Downloaden / Afdrukken" }),
  backDashboard: (l: string) => TL(l, { de:"Zurück zum Dashboard", fr:"Retour au tableau de bord", en:"Back to dashboard", ar:"العودة إلى لوحة التحكم", tr:"Gösterge paneline dön", es:"Volver al panel", it:"Torna alla dashboard", pt:"Voltar ao painel", nl:"Terug naar dashboard" }),
  copied: (l: string) => TL(l, { de:"Kopiert", fr:"Copié", en:"Copied", ar:"تم النسخ", tr:"Kopyalandı", es:"Copiado", it:"Copiato", pt:"Copiado", nl:"Gekopieerd" }),
  copy: (l: string) => TL(l, { de:"Kopieren", fr:"Copier", en:"Copy", ar:"نسخ", tr:"Kopyala", es:"Copiar", it:"Copia", pt:"Copiar", nl:"Kopiëren" }),
  secured: (l: string) => TL(l, { de:"Gesichert", fr:"Sécurisé", en:"Secured", ar:"آمن", tr:"Güvenli", es:"Asegurado", it:"Sicuro", pt:"Seguro", nl:"Beveiligd" }),
  coordAvail: (l: string) => TL(l, { de:"Koordinaten verfügbar", fr:"Coordonnées disponibles", en:"Coordinates available", ar:"الإحداثيات متاحة", tr:"Koordinatlar mevcut", es:"Coordenadas disponibles", it:"Coordinate disponibili", pt:"Coordenadas disponíveis", nl:"Coördinaten beschikbaar" }),
  securePortal: (l: string) => TL(l, { de:"Sicheres Zahlungsportal", fr:"Portail de paiement sécurisé", en:"Secure payment portal", ar:"بوابة الدفع الآمنة", tr:"Güvenli ödeme portalı", es:"Portal de pago seguro", it:"Portale di pagamento sicuro", pt:"Portal de pagamento seguro", nl:"Beveiligde betaalportal" }),
  begLabel: (l: string) => TL(l, { de:"Begünstigter", fr:"Bénéficiaire", en:"Beneficiary", ar:"المستفيد", tr:"Alıcı", es:"Beneficiario", it:"Beneficiario", pt:"Beneficiário", nl:"Begunstigde" }),
  usageLabel: (l: string) => TL(l, { de:"Verwendungszweck", fr:"Référence", en:"Reference", ar:"المرجع", tr:"Referans", es:"Referencia", it:"Riferimento", pt:"Referência", nl:"Referentie" }),
  amtLabel: (l: string) => TL(l, { de:"Betrag", fr:"Montant", en:"Amount", ar:"المبلغ", tr:"Tutar", es:"Importe", it:"Importo", pt:"Montante", nl:"Bedrag" }),
  clientLabel: (l: string) => TL(l, { de:"Auftraggeber", fr:"Donneur d'ordre", en:"Principal", ar:"المُوكِّل", tr:"Veren", es:"Ordenante", it:"Ordinante", pt:"Ordenante", nl:"Opdrachtgever" }),
  benefLabel: (l: string) => TL(l, { de:"Begünstigter", fr:"Bénéficiaire", en:"Beneficiary", ar:"المستفيد", tr:"Alıcı", es:"Beneficiario", it:"Beneficiario", pt:"Beneficiário", nl:"Begunstigde" }),
  clientKT: (l: string) => TL(l, { de:"KT Bank AG Kunde", fr:"Client KT Bank AG", en:"KT Bank AG Client", ar:"عميل KT Bank AG", tr:"KT Bank AG Müşterisi", es:"Cliente KT Bank AG", it:"Cliente KT Bank AG", pt:"Cliente KT Bank AG", nl:"KT Bank AG klant" }),
  amountDoc: (l: string) => TL(l, { de:"Überweisungsbetrag", fr:"Montant du virement", en:"Transfer amount", ar:"مبلغ التحويل", tr:"Transfer tutarı", es:"Importe de transferencia", it:"Importo del trasferimento", pt:"Montante da transferência", nl:"Overboekingsbedrag" }),
  opDetails: (l: string) => TL(l, { de:"Transaktionsdetails", fr:"Détails de l'opération", en:"Transaction details", ar:"تفاصيل المعاملة", tr:"İşlem detayları", es:"Detalles de la operación", it:"Dettagli dell'operazione", pt:"Detalhes da operação", nl:"Transactiedetails" }),
  typeLabel: (l: string) => TL(l, { de:"Typ", fr:"Type", en:"Type", ar:"النوع", tr:"Tür", es:"Tipo", it:"Tipo", pt:"Tipo", nl:"Type" }),
  channelLabel: (l: string) => TL(l, { de:"Kanal", fr:"Canal", en:"Channel", ar:"القناة", tr:"Kanal", es:"Canal", it:"Canale", pt:"Canal", nl:"Kanaal" }),
  motive: (l: string) => TL(l, { de:"Zweck / Referenz", fr:"Motif / Référence", en:"Purpose / Reference", ar:"الغرض / المرجع", tr:"Amaç / Referans", es:"Motivo / Referencia", it:"Causale / Riferimento", pt:"Motivo / Referência", nl:"Doel / Referentie" }),
  emissionDate: (l: string) => TL(l, { de:"Ausgabedatum", fr:"Date d'émission", en:"Emission date", ar:"تاريخ الإصدار", tr:"Düzenleme tarihi", es:"Fecha de emisión", it:"Data di emissione", pt:"Data de emissão", nl:"Uitgiftedatum" }),
  statusLbl: (l: string) => TL(l, { de:"Status", fr:"Statut", en:"Status", ar:"الحالة", tr:"Durum", es:"Estado", it:"Stato", pt:"Estado", nl:"Status" }),
  sepaType: (l: string) => TL(l, { de:"SEPA-Überweisung", fr:"Virement SEPA", en:"SEPA Transfer", ar:"تحويل SEPA", tr:"SEPA Transferi", es:"Transferencia SEPA", it:"Bonifico SEPA", pt:"Transferência SEPA", nl:"SEPA-overboeking" }),
  chanKT: (l: string) => TL(l, { de:"KT Bank AG — Kundenbereich", fr:"KT Bank AG — Espace client", en:"KT Bank AG — Client portal", ar:"KT Bank AG — بوابة العملاء", tr:"KT Bank AG — Müşteri alanı", es:"KT Bank AG — Portal de cliente", it:"KT Bank AG — Area cliente", pt:"KT Bank AG — Área do cliente", nl:"KT Bank AG — Klantportaal" }),
  processingStatus: (l: string) => TL(l, { de:"In Bearbeitung", fr:"En traitement", en:"Processing", ar:"قيد المعالجة", tr:"İşlemde", es:"En proceso", it:"In elaborazione", pt:"Em processamento", nl:"In verwerking" }),
  statusDelivery: (l: string) => TL(l, { de:"In Bearbeitung — Lieferung innerhalb 48h", fr:"En traitement — livraison sous 48h", en:"Processing — delivery within 48h", ar:"قيد المعالجة — التسليم خلال 48 ساعة", tr:"İşlemde — 48 saat içinde teslim", es:"En proceso — entrega en 48h", it:"In elaborazione — consegna entro 48h", pt:"Em processamento — entrega em 48h", nl:"In verwerking — levering binnen 48u" }),
  autoGenerated: (l: string) => TL(l, { de:"Automatisch generiertes Dokument — unveränderlich", fr:"Document généré automatiquement — non modifiable", en:"Automatically generated document — unmodifiable", ar:"وثيقة مولدة تلقائياً — غير قابلة للتعديل", tr:"Otomatik oluşturulan belge — değiştirilemez", es:"Documento generado automáticamente — no modificable", it:"Documento generato automaticamente — non modificabile", pt:"Documento gerado automaticamente — não modificável", nl:"Automatisch gegenereerd document — niet wijzigbaar" }),
  feeSteps: (l: string) => [
    TL(l, { de:"Verbindung zum Bankensystem", fr:"Connexion au système bancaire", en:"Connecting to banking system", ar:"الاتصال بالنظام المصرفي", tr:"Bankacılık sistemine bağlanılıyor", es:"Conectando al sistema bancario", it:"Connessione al sistema bancario", pt:"A ligar ao sistema bancário", nl:"Verbinding met banksysteem" }),
    TL(l, { de:"Transaktion wird verifiziert", fr:"Vérification de la transaction", en:"Verifying transaction", ar:"التحقق من المعاملة", tr:"İşlem doğrulanıyor", es:"Verificando transacción", it:"Verifica transazione", pt:"A verificar transação", nl:"Transactie verifiëren" }),
    TL(l, { de:"Sicherheitsprotokoll wird geprüft", fr:"Vérification du protocole de sécurité", en:"Checking security protocol", ar:"فحص بروتوكول الأمان", tr:"Güvenlik protokolü kontrol ediliyor", es:"Comprobando protocolo de seguridad", it:"Verifica protocollo di sicurezza", pt:"A verificar protocolo de segurança", nl:"Beveiligingsprotocol controleren" }),
    TL(l, { de:"Koordinaten werden abgerufen", fr:"Récupération des coordonnées", en:"Retrieving coordinates", ar:"استرداد الإحداثيات", tr:"Koordinatlar alınıyor", es:"Recuperando coordenadas", it:"Recupero coordinate", pt:"A obter coordenadas", nl:"Coördinaten ophalen" }),
    TL(l, { de:"Verfügbare Bankverbindungen suchen", fr:"Recherche des connexions bancaires", en:"Searching bank connections", ar:"البحث عن الاتصالات المصرفية", tr:"Mevcut banka bağlantıları aranıyor", es:"Buscando conexiones bancarias", it:"Ricerca connessioni bancarie", pt:"A procurar ligações bancárias", nl:"Bankverbindingen zoeken" }),
    TL(l, { de:"Sichere Verbindung wird aufgebaut", fr:"Établissement de la connexion sécurisée", en:"Establishing secure connection", ar:"إنشاء اتصال آمن", tr:"Güvenli bağlantı kuruluyor", es:"Estableciendo conexión segura", it:"Creazione connessione sicura", pt:"A estabelecer ligação segura", nl:"Veilige verbinding opbouwen" }),
    TL(l, { de:"Portal wird initialisiert", fr:"Initialisation du portail", en:"Initializing portal", ar:"تهيئة البوابة", tr:"Portal başlatılıyor", es:"Inicializando portal", it:"Inizializzazione portale", pt:"A inicializar portal", nl:"Portaal initialiseren" }),
  ],
  feeFreeSteps: (l: string) => [
    TL(l, { de:"Verbindung wird aufgebaut…", fr:"Connexion en cours…", en:"Connecting…", ar:"جارٍ الاتصال…", tr:"Bağlanılıyor…", es:"Conectando…", it:"Connessione in corso…", pt:"A ligar…", nl:"Verbinding maken…" }),
    TL(l, { de:"Kontodaten werden verifiziert…", fr:"Vérification des données du compte…", en:"Verifying account data…", ar:"التحقق من بيانات الحساب…", tr:"Hesap verileri doğrulanıyor…", es:"Verificando datos de la cuenta…", it:"Verifica dati del conto…", pt:"A verificar dados da conta…", nl:"Accountgegevens verifiëren…" }),
    TL(l, { de:"SEPA-Netzwerk wird angefragt…", fr:"Interrogation du réseau SEPA…", en:"Querying SEPA network…", ar:"الاستعلام عن شبكة SEPA…", tr:"SEPA ağına sorgu gönderiliyor…", es:"Consultando red SEPA…", it:"Interrogazione rete SEPA…", pt:"A consultar a rede SEPA…", nl:"SEPA-netwerk raadplegen…" }),
    TL(l, { de:"Prioritätsüberweisung vorbereiten…", fr:"Préparation du virement prioritaire…", en:"Preparing priority transfer…", ar:"تحضير التحويل ذو الأولوية…", tr:"Öncelikli transfer hazırlanıyor…", es:"Preparando transferencia prioritaria…", it:"Preparazione trasferimento prioritario…", pt:"A preparar transferência prioritária…", nl:"Prioriteitsoverschrijving voorbereiden…" }),
    TL(l, { de:"Compliance-Prüfung läuft…", fr:"Vérification de conformité…", en:"Compliance check running…", ar:"جارٍ فحص الامتثال…", tr:"Uyumluluk kontrolü yapılıyor…", es:"Verificación de cumplimiento…", it:"Controllo di conformità…", pt:"Verificação de conformidade…", nl:"Nalevingscontrole loopt…" }),
    TL(l, { de:"Auftrag wird übermittelt…", fr:"Transmission de l'ordre…", en:"Transmitting order…", ar:"جارٍ إرسال الأمر…", tr:"Emir iletiliyor…", es:"Transmitiendo orden…", it:"Trasmissione ordine…", pt:"A transmitir ordem…", nl:"Opdracht verzenden…" }),
    TL(l, { de:"Bestätigung wird generiert…", fr:"Génération de la confirmation…", en:"Generating confirmation…", ar:"جارٍ توليد التأكيد…", tr:"Onay oluşturuluyor…", es:"Generando confirmación…", it:"Generazione conferma…", pt:"A gerar confirmação…", nl:"Bevestiging genereren…" }),
  ],
};

const FEE_STEP_DURATIONS = [3000, 4000, 4500, 5000, 5500, 4000, 3000];
const FEE_FREE_STEP_DURATIONS = [3000, 4500, 4000, 5000, 5500, 4500, 3500];

function makePortalSteps(lang: string) {
  return TP.feeSteps(lang).map((label, i) => ({ label, duration: FEE_STEP_DURATIONS[i] }));
}
function makeFeeFreeSteps(lang: string) {
  return TP.feeFreeSteps(lang).map((label, i) => ({ label, duration: FEE_FREE_STEP_DURATIONS[i] }));
}

function CopyField({ label, value, mono = false, lang = "de" }: { label: string; value: string; mono?: boolean; lang?: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
  return (
    <div style={{ marginBottom: 10 }}>
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 4px", fontWeight: 600 }}>{label}</p>
      <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#252836", borderRadius: 10, padding: "10px 14px" }}>
        <span style={{ flex: 1, color: "white", fontFamily: mono ? "monospace" : "inherit", fontSize: "0.88rem", fontWeight: 500, wordBreak: "break-all" }}>{value}</span>
        <button onClick={copy}
          style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 4, background: copied ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.08)", border: `1px solid ${copied ? "rgba(74,222,128,0.3)" : "rgba(255,255,255,0.12)"}`, borderRadius: 8, padding: "5px 10px", color: copied ? "#4ADE80" : "rgba(255,255,255,0.5)", fontSize: "0.72rem", fontWeight: 600, cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap" }}>
          {copied ? <><Check size={11} /> {TP.copied(lang)}</> : <><Copy size={11} /> {TP.copy(lang)}</>}
        </button>
      </div>
    </div>
  );
}

/* ── Bordereau — professional light theme ── */
function Bordereau({ transfer, profile, feeFree = false, lang = "de" }: { transfer: Transfer; profile: { prenom: string; nom: string; email: string }; feeFree?: boolean; lang?: string }) {
  const ref = `KT-${transfer.id.slice(0, 8).toUpperCase()}`;
  const locale = LOCALE_MAP[lang as Lang] ?? "de-DE";
  const date = new Date(transfer.created_at);
  const dateStr = date.toLocaleDateString(locale, { day: "2-digit", month: "long", year: "numeric" });
  const timeStr = date.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });

  function printDoc() { window.print(); }

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #bordereau-doc, #bordereau-doc * { visibility: visible !important; }
          #bordereau-doc { position: fixed; top: 0; left: 0; width: 100%; }
          .no-print { display: none !important; }
        }
      `}</style>
      <div style={{ minHeight: "100vh", background: "#F5F7FA", fontFamily: "'Inter',sans-serif", padding: "24px 16px 80px" }}>
        {/* Success banner */}
        <div style={{ maxWidth: 640, margin: "0 auto 24px", textAlign: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#F0FDF4", border: "2px solid #86EFAC", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Check size={28} color="#16A34A" />
          </div>
          <h1 style={{ color: "#0F172A", fontWeight: 800, fontSize: "1.4rem", margin: "0 0 8px" }}>
            {TP.successTitle(lang, feeFree)}
          </h1>
          <p style={{ color: "#64748B", fontSize: "0.9rem", margin: 0, lineHeight: 1.6 }}>
            {TP.successSub(lang, feeFree)}
          </p>
        </div>

        {/* Official document */}
        <div id="bordereau-doc" style={{ maxWidth: 640, margin: "0 auto", background: "white", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", border: "1px solid #E2E8F0" }}>
          {/* Document header */}
          <div style={{ background: "linear-gradient(135deg, #002d15 0%, #005F2D 100%)", padding: "24px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/kt-logo.png" alt="KT Bank AG" style={{ height: 26, filter: "brightness(0) invert(1)", display: "block", marginBottom: 8 }} />
              <p style={{ color: "rgba(201,168,76,0.9)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", margin: 0 }}>ORDRE DE VIREMENT SEPA</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.65rem", margin: "0 0 3px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Référence</p>
              <p style={{ color: "white", fontFamily: "monospace", fontWeight: 700, fontSize: "1rem", margin: "0 0 4px" }}>{ref}</p>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.65rem", margin: 0 }}>{dateStr} · {timeStr}</p>
            </div>
          </div>

          {/* Status bar */}
          <div style={{ background: "#FFFBF0", borderBottom: "1px solid #FEF3C7", padding: "10px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Clock size={14} color="#D97706" />
              <span style={{ color: "#92400E", fontSize: "0.8rem", fontWeight: 600 }}>{TP.statusDelivery(lang)}</span>
            </div>
            <span style={{ background: "#FEF3C7", color: "#92400E", fontSize: "0.7rem", fontWeight: 700, padding: "3px 10px", borderRadius: 20, border: "1px solid #FCD34D" }}>
              PROCESSING
            </span>
          </div>

          {/* Document body */}
          <div style={{ padding: "28px 32px" }}>
            {/* Parties */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
              <div style={{ background: "#F8FAFC", borderRadius: 12, padding: "16px 18px", border: "1px solid #E2E8F0" }}>
                <p style={{ color: "#94A3B8", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 10px" }}>{TP.clientLabel(lang)}</p>
                <p style={{ color: "#0F172A", fontWeight: 700, fontSize: "0.95rem", margin: "0 0 4px" }}>{profile.prenom} {profile.nom}</p>
                <p style={{ color: "#64748B", fontSize: "0.78rem", margin: 0 }}>{TP.clientKT(lang)}</p>
              </div>
              <div style={{ background: "#F8FAFC", borderRadius: 12, padding: "16px 18px", border: "1px solid #E2E8F0" }}>
                <p style={{ color: "#94A3B8", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 10px" }}>{TP.benefLabel(lang)}</p>
                <p style={{ color: "#0F172A", fontWeight: 700, fontSize: "0.95rem", margin: "0 0 4px" }}>{transfer.to_name}</p>
                <p style={{ color: "#64748B", fontSize: "0.78rem", margin: 0, fontFamily: "monospace", wordBreak: "break-all" }}>{transfer.to_iban}</p>
              </div>
            </div>

            {/* Amount — prominent */}
            <div style={{ background: "linear-gradient(135deg, #F0FDF4, #DCFCE7)", border: "1px solid #86EFAC", borderRadius: 14, padding: "20px 24px", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ color: "#166534", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 6px" }}>{TP.amountDoc(lang)}</p>
                <p style={{ color: "#005F2D", fontWeight: 800, fontSize: "2rem", margin: 0, lineHeight: 1 }}>
                  {Number(transfer.amount).toLocaleString(locale, { minimumFractionDigits: 2 })} <span style={{ fontSize: "1.1rem" }}>EUR</span>
                </p>
              </div>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(0,95,45,0.1)", border: "2px solid rgba(0,95,45,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Send size={22} color="#005F2D" />
              </div>
            </div>

            {/* Transfer details table */}
            <div style={{ marginBottom: 24 }}>
              <p style={{ color: "#0F172A", fontWeight: 700, fontSize: "0.85rem", margin: "0 0 12px", borderBottom: "2px solid #F1F5F9", paddingBottom: 8 }}>{TP.opDetails(lang)}</p>
              {[
                [TP.typeLabel(lang), TP.sepaType(lang)],
                [TP.channelLabel(lang), TP.chanKT(lang)],
                ...(transfer.reference ? [[TP.motive(lang), transfer.reference]] : []),
                [TP.emissionDate(lang), `${dateStr} · ${timeStr}`],
                [TP.statusLbl(lang), TP.processingStatus(lang)],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid #F8FAFC" }}>
                  <span style={{ color: "#64748B", fontSize: "0.82rem" }}>{k}</span>
                  <span style={{ color: "#0F172A", fontSize: "0.82rem", fontWeight: 600, textAlign: "right", maxWidth: "60%" }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Bank stamp */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 16, borderTop: "2px solid #F1F5F9" }}>
              <div>
                <p style={{ color: "#0F172A", fontWeight: 700, fontSize: "0.82rem", margin: "0 0 3px" }}>KT Bank AG</p>
                <p style={{ color: "#94A3B8", fontSize: "0.72rem", margin: 0 }}>Frankfurt am Main · BIC: KTAGDEFF</p>
                <p style={{ color: "#94A3B8", fontSize: "0.72rem", margin: "2px 0 0" }}>Reguliert durch die BaFin</p>
              </div>
              <div style={{ width: 56, height: 56, borderRadius: "50%", border: "2px solid #005F2D", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", flexShrink: 0 }}>
                <Check size={20} color="#005F2D" />
              </div>
            </div>
          </div>

          {/* Footer strip */}
          <div style={{ background: "#F8FAFC", borderTop: "1px solid #E2E8F0", padding: "12px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ color: "#94A3B8", fontSize: "0.65rem", margin: 0 }}>{TP.autoGenerated(lang)}</p>
            <p style={{ color: "#94A3B8", fontSize: "0.65rem", margin: 0, fontFamily: "monospace" }}>Réf. {ref}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="no-print" style={{ maxWidth: 640, margin: "20px auto 0", display: "flex", gap: 12 }}>
          <button onClick={printDoc}
            style={{ flex: 1, height: 50, background: "white", border: "1px solid #E2E8F0", borderRadius: 14, color: "#374151", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <Printer size={16} color="#005F2D" /> {TP.print(lang)}
          </button>
          <button onClick={() => window.location.href = "/client/dashboard"}
            style={{ flex: 1, height: 50, background: "#005F2D", border: "none", borderRadius: 14, color: "white", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer" }}>
            {TP.backDashboard(lang)}
          </button>
        </div>
      </div>
    </>
  );
}

function PortalLoader({ onReady, steps, title, subtitle, lang = "de" }: {
  onReady: () => void;
  steps?: { label: string; duration: number }[];
  title?: string;
  subtitle?: string;
  lang?: string;
}) {
  const STEPS = steps ?? makePortalSteps(lang);
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const totalDuration = STEPS.reduce((s, p) => s + p.duration, 0);
  const startRef = useRef(Date.now());

  useEffect(() => {
    const tick = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.min(98, (elapsed / totalDuration) * 100);
      setProgress(pct);

      let acc = 0;
      let activeStep = 0;
      const done: number[] = [];
      for (let i = 0; i < STEPS.length; i++) {
        acc += STEPS[i].duration;
        if (elapsed > acc) {
          done.push(i);
          activeStep = Math.min(i + 1, STEPS.length - 1);
        }
      }
      setCompletedSteps(done);
      setStepIndex(activeStep);

      if (elapsed >= totalDuration) {
        clearInterval(tick);
        setProgress(100);
        setCompletedSteps(STEPS.map((_, i) => i));
        setTimeout(onReady, 600);
      }
    }, 80);
    return () => clearInterval(tick);
  }, [onReady, totalDuration, STEPS]);

  return (
    <div style={{ minHeight: "100vh", background: "#0A0D14", fontFamily: "'Inter',sans-serif", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "#0F1219", borderBottom: "1px solid rgba(0,95,45,0.3)", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(0,95,45,0.3)", border: "1px solid rgba(0,95,45,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Lock size={13} color="#4CAF82" />
          </div>
          <div>
            <p style={{ color: "rgba(201,168,76,0.9)", fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", margin: 0 }}>KT BANK AG</p>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.58rem", margin: 0 }}>{TP.securePortal(lang)} · TLS 1.3</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Wifi size={11} color="#4CAF82" />
          <span style={{ color: "#4CAF82", fontSize: "0.65rem", fontWeight: 600 }}>TLS 1.3</span>
          <div style={{ width: 1, height: 12, background: "rgba(255,255,255,0.1)", margin: "0 4px" }} />
          <Shield size={11} color="rgba(255,255,255,0.3)" />
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.65rem" }}>256-bit AES</span>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ position: "relative", width: 90, height: 90, marginBottom: 32 }}>
          <svg width="90" height="90" style={{ position: "absolute", inset: 0, animation: "spin 2s linear infinite" }}>
            <circle cx="45" cy="45" r="38" fill="none" stroke="rgba(0,95,45,0.15)" strokeWidth="4" />
            <circle cx="45" cy="45" r="38" fill="none" stroke="#005F2D" strokeWidth="4" strokeLinecap="round"
              strokeDasharray={`${progress * 2.39} 239`} strokeDashoffset="0" style={{ transition: "stroke-dasharray 0.3s ease" }} />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(0,95,45,0.2)", border: "1px solid rgba(0,95,45,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Lock size={20} color="#4CAF82" />
            </div>
          </div>
        </div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }`}</style>

        <p style={{ color: "white", fontWeight: 700, fontSize: "1.05rem", margin: "0 0 6px", textAlign: "center" }}>
          {title ?? TP.portalTitle(lang)}
        </p>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.8rem", margin: "0 0 32px", textAlign: "center" }}>
          {subtitle ?? TP.portalSub(lang)}
        </p>

        <div style={{ width: "100%", maxWidth: 400, height: 4, background: "rgba(255,255,255,0.07)", borderRadius: 99, marginBottom: 28, overflow: "hidden" }}>
          <div style={{ height: "100%", background: "linear-gradient(90deg, #005F2D, #4CAF82)", borderRadius: 99, width: `${progress}%`, transition: "width 0.3s ease" }} />
        </div>

        <div style={{ width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 8 }}>
          {STEPS.map((step, i) => {
            const done = completedSteps.includes(i);
            const active = stepIndex === i && !done;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, opacity: done || active ? 1 : 0.25, transition: "opacity 0.4s" }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: done ? "rgba(74,222,128,0.2)" : active ? "rgba(0,95,45,0.3)" : "rgba(255,255,255,0.06)", border: `1px solid ${done ? "#4ADE80" : active ? "#005F2D" : "rgba(255,255,255,0.1)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {done ? <Check size={10} color="#4ADE80" /> : active ? <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4CAF82", animation: "pulse 1s infinite" }} /> : null}
                </div>
                <span style={{ color: done ? "rgba(255,255,255,0.6)" : active ? "white" : "rgba(255,255,255,0.25)", fontSize: "0.78rem", fontWeight: active ? 600 : 400 }}>{step.label}</span>
                {active && <span style={{ marginLeft: "auto", color: "#4CAF82", fontSize: "0.65rem", fontWeight: 600 }}>{TP.enCours(lang)}</span>}
                {done && <span style={{ marginLeft: "auto", color: "rgba(74,222,128,0.6)", fontSize: "0.65rem" }}>✓</span>}
              </div>
            );
          })}
        </div>

        <p style={{ color: "rgba(255,255,255,0.15)", fontSize: "0.7rem", marginTop: 32, textAlign: "center" }}>
          KT Bank AG · Frankfurt am Main · Reguliert durch BaFin
        </p>
      </div>
    </div>
  );
}

function TransferPaymentInner() {
  const params = useSearchParams();
  const transferId = params.get("id");
  const isFeeFree = params.get("fee_free") === "1";

  const [token, setToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<{ prenom: string; nom: string; email: string; lang?: string } | null>(null);
  const [lang, setLang] = useState<string>("de");
  const [transfer, setTransfer] = useState<Transfer | null>(null);
  const [feePayment, setFeePayment] = useState<FeePayment | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalReady, setPortalReady] = useState(false);
  const [error, setError] = useState("");

  const [proofFile, setProofFile] = useState<File | null>(null);
  const [paymentRef, setPaymentRef] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  // Stable references for the loader so its internal interval effect doesn't
  // reset on every render (which previously caused the animation to never settle).
  const portalStepsMemo = useMemo(() => makePortalSteps(lang), [lang]);
  const feeFreeStepsMemo = useMemo(() => makeFeeFreeSteps(lang), [lang]);
  const handlePortalReady = useCallback(() => setPortalReady(true), []);

  const fetchTransfer = useCallback(async (tk: string, id: string) => {
    const cached = sessionStorage.getItem("kt_transfer_payment");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed.transferId === id) {
          setFeePayment(parsed.feePayment);
        }
      } catch { /* ignore */ }
    }

    const res = await fetch(`/api/kt/client/transfer?id=${id}`, {
      headers: { Authorization: `Bearer ${tk}` },
    });
    if (!res.ok) { setError("Virement introuvable"); setLoading(false); return; }
    const d = await res.json();
    setTransfer(d.transfer);
    if (d.fee_payment) setFeePayment(d.fee_payment);
    setLoading(false);

    if (isFeeFree) {
      setDone(false);
    }
  }, [isFeeFree]);

  useEffect(() => {
    const tk = sessionStorage.getItem("kt_token");
    if (!tk) { window.location.href = "/client/login"; return; }
    setToken(tk);

    // Read language: prefer localStorage kt_lang, then profile lang
    const savedLang = localStorage.getItem("kt_lang") ?? "de";
    setLang(savedLang);

    // Seed profile from sessionStorage cache for instant render…
    const profileRaw = sessionStorage.getItem("kt_profile");
    if (profileRaw) {
      try {
        const parsed = JSON.parse(profileRaw);
        setProfile(parsed);
        if (parsed.lang) setLang(parsed.lang);
      } catch { /* ignore */ }
    }

    // …then always confirm against the API so the success screen has a
    // reliable profile + the client's real language (kt_profile cache omits lang).
    fetch("/api/kt/client/me", { headers: { Authorization: `Bearer ${tk}` } })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.profile) {
          setProfile({
            prenom: d.profile.prenom ?? "",
            nom: d.profile.nom ?? "",
            email: d.profile.email ?? "",
            lang: d.profile.lang,
          });
          if (d.profile.lang) setLang(d.profile.lang);
        }
      })
      .catch(() => { /* sessionStorage fallback already applied */ });

    if (!transferId) { setError("Kein Überweisungsauftrag gefunden"); setLoading(false); return; }
    fetchTransfer(tk, transferId);
  }, [transferId, fetchTransfer]);

  async function submit() {
    if (!token || !transferId || !proofFile) return;
    setSubmitting(true);
    const fd = new FormData();
    fd.append("transfer_id", transferId);
    if (paymentRef) fd.append("payment_reference", paymentRef);
    fd.append("file", proofFile);
    await fetch("/api/kt/client/transfer/proof", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    sessionStorage.removeItem("kt_transfer_payment");
    try { localStorage.removeItem("kt_pending_transfer"); } catch { /* ignore */ }
    setSubmitting(false);
    setDone(true);
  }

  // Profile fallback so the success bordereau renders even if the
  // sessionStorage cache and /me fetch both came up empty.
  const safeProfile = profile ?? { prenom: "", nom: "", email: "" };

  // Fee-free: show bordereau after animation. Only needs the transfer.
  if (isFeeFree && portalReady && transfer) {
    return (
      <div style={{ background: "#F5F7FA", fontFamily: "'Inter',sans-serif" }}>
        <Bordereau transfer={transfer} profile={safeProfile} feeFree lang={lang} />
      </div>
    );
  }

  // Fee-free but the transfer could not be loaded — show error, never the fee form.
  if (isFeeFree && portalReady && !transfer) {
    return (
      <div style={{ minHeight: "100vh", background: "#0A0D14", fontFamily: "'Inter',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)", borderRadius: 14, padding: "16px 20px", display: "flex", gap: 10, alignItems: "flex-start", maxWidth: 420 }}>
          <AlertCircle size={18} color="#F87171" style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ color: "#F87171", fontSize: "0.85rem", margin: 0 }}>{error || TP.loading(lang)}</p>
        </div>
      </div>
    );
  }

  // Standard: show bordereau after proof upload
  if (done && transfer) return (
    <div style={{ background: "#F5F7FA", fontFamily: "'Inter',sans-serif" }}>
      <Bordereau transfer={transfer} profile={safeProfile} lang={lang} />
    </div>
  );

  // Portal loader
  if (!portalReady) {
    if (isFeeFree) {
      return (
        <PortalLoader
          steps={feeFreeStepsMemo}
          title={TP.feeFreeTitle(lang)}
          subtitle={TP.freeFreeSub(lang)}
          lang={lang}
          onReady={handlePortalReady}
        />
      );
    }
    return <PortalLoader steps={portalStepsMemo} lang={lang} onReady={handlePortalReady} />;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0A0D14", fontFamily: "'Inter',sans-serif" }}>
      {/* Secure portal header */}
      <div style={{ background: "#0F1219", borderBottom: "1px solid rgba(0,95,45,0.3)", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => window.history.back()} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, fontSize: "0.8rem", padding: 0 }}>
            <ArrowLeft size={15} />
          </button>
          <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.1)", margin: "0 6px" }} />
          <div style={{ width: 26, height: 26, borderRadius: 7, background: "rgba(0,95,45,0.3)", border: "1px solid rgba(0,95,45,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Lock size={12} color="#4CAF82" />
          </div>
          <div>
            <p style={{ color: "rgba(201,168,76,0.9)", fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", margin: 0 }}>KT BANK AG</p>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.57rem", margin: 0 }}>{TP.securePortal(lang)}</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ADE80", boxShadow: "0 0 0 3px rgba(74,222,128,0.15)" }} />
          <span style={{ color: "#4ADE80", fontSize: "0.65rem", fontWeight: 600 }}>{TP.coordAvail(lang)}</span>
        </div>
      </div>

      <div style={{ maxWidth: 540, margin: "0 auto", padding: "24px 20px 80px" }}>
        {error ? (
          <div style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)", borderRadius: 14, padding: "16px 20px", display: "flex", gap: 10, alignItems: "flex-start", marginTop: 24 }}>
            <AlertCircle size={18} color="#F87171" style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ color: "#F87171", fontSize: "0.85rem", margin: 0 }}>{error}</p>
          </div>
        ) : transfer && feePayment ? (
          <>
            <div style={{ marginBottom: 20 }}>
              <h1 style={{ color: "white", fontWeight: 800, fontSize: "1.2rem", margin: "0 0 4px" }}>{TP.feeTitle(lang)}</h1>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.8rem", margin: 0, lineHeight: 1.6 }}>
                {TP.feeSub(lang)}
              </p>
            </div>

            <div style={{ background: "rgba(217,119,6,0.12)", border: "1px solid rgba(217,119,6,0.3)", borderRadius: 14, padding: "14px 18px", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 3px" }}>{TP.feeLabel(lang)}</p>
                <p style={{ color: "#FCD34D", fontWeight: 800, fontSize: "1.4rem", margin: 0 }}>{Number(transfer.fee_amount).toLocaleString(LOCALE_MAP[lang as Lang] ?? "de-DE", { minimumFractionDigits: 2 })} EUR</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.68rem", margin: "0 0 2px" }}>{TP.amountLabel(lang)}</p>
                <p style={{ color: "rgba(255,255,255,0.6)", fontWeight: 600, fontSize: "0.85rem", margin: 0 }}>{Number(transfer.amount).toLocaleString(LOCALE_MAP[lang as Lang] ?? "de-DE", { minimumFractionDigits: 2 })} EUR → {transfer.to_name}</p>
              </div>
            </div>

            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.35)", borderRadius: 10, padding: "10px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: "1rem", flexShrink: 0 }}>⚡</span>
              <p style={{ color: "#FCA5A5", fontSize: "0.78rem", margin: 0, lineHeight: 1.5 }}>
                <strong style={{ color: "#F87171" }}>{TP.instantRequired(lang)}</strong> — {TP.instantSub(lang)}
              </p>
            </div>

            <div style={{ background: "#111420", borderRadius: 16, border: "1px solid rgba(0,95,45,0.3)", padding: "18px 20px", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Building2 size={14} color="#4CAF82" />
                  <p style={{ color: "white", fontWeight: 700, fontSize: "0.88rem", margin: 0 }}>{TP.bankDetails(lang)}</p>
                </div>
                <span style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 20, padding: "2px 8px" }}>
                  <Lock size={9} color="#4CAF82" />
                  <span style={{ color: "#4CAF82", fontSize: "0.62rem", fontWeight: 600 }}>{TP.secured(lang)}</span>
                </span>
              </div>
              {feePayment.name && <CopyField label={TP.begLabel(lang)} value={feePayment.name} lang={lang} />}
              {feePayment.iban && <CopyField label="IBAN" value={feePayment.iban} mono lang={lang} />}
              {feePayment.bic && <CopyField label="BIC / SWIFT" value={feePayment.bic} mono lang={lang} />}
              {feePayment.bank && <CopyField label="Bank" value={feePayment.bank} lang={lang} />}
              {feePayment.reference && <CopyField label={TP.usageLabel(lang)} value={feePayment.reference} lang={lang} />}
              <CopyField label={TP.amtLabel(lang)} value={`${Number(transfer.fee_amount).toFixed(2)} EUR`} lang={lang} />
            </div>

            <div style={{ background: "#111420", borderRadius: 16, border: "1px solid rgba(255,255,255,0.07)", padding: "18px 20px", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <FileText size={14} color="#4CAF82" />
                <p style={{ color: "white", fontWeight: 700, fontSize: "0.88rem", margin: 0 }}>{TP.proofTitle(lang)}</p>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 5 }}>
                  {TP.refLabel(lang)} <span style={{ color: "rgba(255,255,255,0.2)", fontWeight: 400, textTransform: "none" }}>({TP.optional(lang)})</span>
                </label>
                <input type="text" placeholder="z.B. TRF-2025-0001"
                  value={paymentRef} onChange={(e) => setPaymentRef(e.target.value)}
                  style={{ width: "100%", height: 42, background: "#1A1D27", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "white", fontSize: "0.85rem", padding: "0 14px", boxSizing: "border-box", outline: "none" }} />
              </div>
              <div>
                <label style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 5 }}>
                  {TP.proofLabel(lang)} <span style={{ color: "#D97706", fontWeight: 700, textTransform: "none", fontSize: "0.72rem" }}>{TP.required(lang)}</span>
                </label>
                <label style={{
                  display: "flex", alignItems: "center", gap: 10, minHeight: 52,
                  background: proofFile ? "rgba(0,95,45,0.1)" : "#1A1D27",
                  border: `2px dashed ${proofFile ? "#4CAF82" : "rgba(255,255,255,0.1)"}`,
                  borderRadius: 10, padding: "12px 16px", cursor: "pointer", boxSizing: "border-box",
                }}>
                  <input type="file" accept="image/*,application/pdf" style={{ display: "none" }}
                    onChange={(e) => setProofFile(e.target.files?.[0] ?? null)} />
                  {proofFile
                    ? <><Check size={15} color="#4CAF82" /><span style={{ color: "#4CAF82", fontSize: "0.82rem", fontWeight: 600, wordBreak: "break-all" }}>{proofFile.name}</span></>
                    : <><FileText size={15} color="rgba(255,255,255,0.25)" /><span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.8rem" }}>{TP.proofPlaceholder(lang)}</span></>
                  }
                </label>
              </div>
            </div>

            <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.73rem", lineHeight: 1.6, marginBottom: 14, textAlign: "center" }}>
              {TP.disclaimer48h(lang)}
            </p>

            {!proofFile && (
              <p style={{ color: "#D97706", fontSize: "0.76rem", textAlign: "center", margin: "0 0 10px", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                <AlertCircle size={13} /> {TP.proofRequired(lang)}
              </p>
            )}
            <button onClick={submit} disabled={submitting || !proofFile}
              style={{ width: "100%", height: 52, background: proofFile ? "#005F2D" : "rgba(0,95,45,0.3)", border: proofFile ? "none" : "1px solid rgba(0,95,45,0.4)", borderRadius: 14, color: "white", fontWeight: 700, fontSize: "0.95rem", cursor: (submitting || !proofFile) ? "not-allowed" : "pointer", opacity: (submitting || !proofFile) ? 0.6 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s" }}>
              {submitting ? TP.sending(lang) : <><Lock size={15} /> {TP.submitBtn(lang)}</>}
            </button>
            <p style={{ color: "rgba(255,255,255,0.15)", fontSize: "0.65rem", textAlign: "center", marginTop: 10 }}>
              KT Bank AG · Frankfurt · Reguliert durch BaFin · TLS 1.3 verschlüsselt
            </p>
          </>
        ) : loading ? (
          <p style={{ color: "rgba(255,255,255,0.3)", textAlign: "center", marginTop: 40 }}>{TP.loading(lang)}</p>
        ) : null}
      </div>
    </div>
  );
}

export default function TransferPaymentPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#14161F", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.3)", fontFamily: "'Inter',sans-serif" }}>Wird geladen…</div>}>
      <TransferPaymentInner />
    </Suspense>
  );
}
