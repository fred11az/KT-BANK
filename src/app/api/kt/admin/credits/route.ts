import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { send } from "@/lib/email/send";

type Lang = "de" | "fr" | "en" | "ar" | "tr" | "es" | "it" | "pt" | "nl";
const LOCALE_MAP: Record<Lang, string> = {
  de: "de-DE", fr: "fr-FR", en: "en-GB", ar: "ar-SA", tr: "tr-TR",
  es: "es-ES", it: "it-IT", pt: "pt-PT", nl: "nl-NL",
};

function L<T>(lang: string, variants: Partial<Record<Lang, T>> & { de: T }): T {
  return (variants[lang as Lang] ?? variants.de) as T;
}

function auth(req: NextRequest) {
  const key = process.env.KT_ADMIN_KEY;
  return key && req.headers.get("Authorization") === `Bearer ${key}`;
}

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const supabase = getSupabase();
  const url = new URL(req.url);
  const status = url.searchParams.get("status");

  let query = supabase
    .from("kt_credit_requests")
    .select("*, kt_profiles(prenom, nom, email, lang)")
    .order("created_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data: requests, error } = await query;
  if (error) return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  return NextResponse.json({ requests: requests ?? [] });
}

export async function PATCH(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const supabase = getSupabase();
  const body = await req.json();
  const { id, status, rejection_reason, admin_notes } = body;

  if (!id || !status) return NextResponse.json({ error: "id et status requis" }, { status: 400 });
  if (!["approved", "rejected", "pending"].includes(status)) {
    return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
  }

  const update: Record<string, unknown> = { status, updated_at: new Date().toISOString() };
  if (rejection_reason) update.rejection_reason = rejection_reason;
  if (admin_notes !== undefined) update.admin_notes = admin_notes;

  const { error } = await supabase.from("kt_credit_requests").update(update).eq("id", id);
  if (error) return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });

  // Fetch credit request + profile for email
  const { data: req2 } = await supabase
    .from("kt_credit_requests")
    .select("*, kt_profiles(prenom, nom, email, lang)")
    .eq("id", id)
    .single();

  if (req2) {
    const profile = req2.kt_profiles as { prenom: string; nom: string; email: string; lang: string } | null;
    if (profile?.email) {
      const lang = (profile.lang ?? "de") as Lang;
      const locale = LOCALE_MAP[lang] ?? "de-DE";
      const amountFmt = Number(req2.amount).toLocaleString(locale, { minimumFractionDigits: 2 }) + " €";
      const monthlyFmt = Number(req2.monthly_payment).toLocaleString(locale, { minimumFractionDigits: 2 }) + " €";
      const typeLabel = req2.type === "islamic"
        ? L(lang, {
            de: "Islamischer Kredit (0%)", fr: "Crédit Islamique (0%)", en: "Islamic Credit (0%)",
            ar: "قرض إسلامي (0%)", tr: "İslami Kredi (%0)", es: "Crédito Islámico (0%)",
            it: "Credito Islamico (0%)", pt: "Crédito Islâmico (0%)", nl: "Islamitisch Krediet (0%)",
          })
        : L(lang, {
            de: "Standardkredit (2%)", fr: "Crédit Standard (2%)", en: "Standard Credit (2%)",
            ar: "قرض عادي (2%)", tr: "Standart Kredi (%2)", es: "Crédito Estándar (2%)",
            it: "Credito Standard (2%)", pt: "Crédito Padrão (2%)", nl: "Standaard Krediet (2%)",
          });

      if (status === "approved") {
        const subject = L(lang, {
          de: "KT Bank AG — Ihr Kreditantrag wurde genehmigt!",
          fr: "KT Bank AG — Votre crédit a été approuvé !",
          en: "KT Bank AG — Your credit application has been approved!",
          ar: "KT Bank AG — تمت الموافقة على طلب القرض الخاص بك!",
          tr: "KT Bank AG — Kredi başvurunuz onaylandı!",
          es: "KT Bank AG — ¡Su solicitud de crédito ha sido aprobada!",
          it: "KT Bank AG — La sua richiesta di credito è stata approvata!",
          pt: "KT Bank AG — O seu pedido de crédito foi aprovado!",
          nl: "KT Bank AG — Uw kredietaanvraag is goedgekeurd!",
        });
        const title = L(lang, {
          de: "Kreditantrag genehmigt ✓", fr: "Crédit approuvé ✓", en: "Credit approved ✓",
          ar: "تمت الموافقة على القرض ✓", tr: "Kredi onaylandı ✓", es: "Crédito aprobado ✓",
          it: "Credito approvato ✓", pt: "Crédito aprovado ✓", nl: "Krediet goedgekeurd ✓",
        });
        const greeting = L(lang, {
          de: `Guten Tag <strong>${profile.prenom}</strong>,`, fr: `Bonjour <strong>${profile.prenom}</strong>,`,
          en: `Hello <strong>${profile.prenom}</strong>,`, ar: `مرحباً <strong>${profile.prenom}</strong>،`,
          tr: `Merhaba <strong>${profile.prenom}</strong>,`, es: `Hola <strong>${profile.prenom}</strong>,`,
          it: `Buongiorno <strong>${profile.prenom}</strong>,`, pt: `Olá <strong>${profile.prenom}</strong>,`,
          nl: `Hallo <strong>${profile.prenom}</strong>,`,
        });
        const bodyText = L(lang, {
          de: "Wir freuen uns, Ihnen mitzuteilen, dass Ihr Kreditantrag <strong style=\"color:#005F2D;\">genehmigt</strong> wurde. Ein Berater wird sich innerhalb von 24 Stunden mit Ihnen in Verbindung setzen.",
          fr: "Nous avons le plaisir de vous informer que votre demande de crédit a été <strong style=\"color:#005F2D;\">approuvée</strong>. Un conseiller va vous contacter dans les 24 heures pour finaliser les modalités.",
          en: "We are pleased to inform you that your credit application has been <strong style=\"color:#005F2D;\">approved</strong>. An advisor will contact you within 24 hours to finalize the terms.",
          ar: "يسعدنا إخباركم بأن طلب القرض الخاص بكم قد تمت <strong style=\"color:#005F2D;\">الموافقة عليه</strong>. سيتصل بكم مستشارنا خلال 24 ساعة لإتمام التفاصيل.",
          tr: "Kredi başvurunuzun <strong style=\"color:#005F2D;\">onaylandığını</strong> bildirmekten mutluluk duyarız. Bir danışmanımız koşulları netleştirmek için 24 saat içinde sizinle iletişime geçecektir.",
          es: "Nos complace informarle que su solicitud de crédito ha sido <strong style=\"color:#005F2D;\">aprobada</strong>. Un asesor se pondrá en contacto con usted en las próximas 24 horas para finalizar los detalles.",
          it: "Siamo lieti di informarla che la sua richiesta di credito è stata <strong style=\"color:#005F2D;\">approvata</strong>. Un consulente la contatterà entro 24 ore per finalizzare le modalità.",
          pt: "Temos o prazer de informar que o seu pedido de crédito foi <strong style=\"color:#005F2D;\">aprovado</strong>. Um consultor irá contactá-lo dentro de 24 horas para finalizar as condições.",
          nl: "Wij delen u graag mede dat uw kredietaanvraag is <strong style=\"color:#005F2D;\">goedgekeurd</strong>. Een adviseur neemt binnen 24 uur contact met u op om de voorwaarden af te ronden.",
        });
        const detailsTitle = L(lang, {
          de: "Details Ihres Kredits", fr: "Détails de votre crédit", en: "Your credit details",
          ar: "تفاصيل قرضك", tr: "Kredi detaylarınız", es: "Detalles de su crédito",
          it: "Dettagli del suo credito", pt: "Detalhes do seu crédito", nl: "Details van uw krediet",
        });
        const kType = L(lang, { de: "Art", fr: "Type", en: "Type", ar: "النوع", tr: "Tür", es: "Tipo", it: "Tipo", pt: "Tipo", nl: "Type" });
        const kAmount = L(lang, { de: "Betrag", fr: "Montant", en: "Amount", ar: "المبلغ", tr: "Tutar", es: "Importe", it: "Importo", pt: "Montante", nl: "Bedrag" });
        const kDuration = L(lang, { de: "Laufzeit", fr: "Durée", en: "Duration", ar: "المدة", tr: "Süre", es: "Duración", it: "Durata", pt: "Duração", nl: "Looptijd" });
        const kMonthly = L(lang, { de: "Monatsrate", fr: "Mensualité", en: "Monthly payment", ar: "الدفعة الشهرية", tr: "Aylık ödeme", es: "Cuota mensual", it: "Rata mensile", pt: "Prestação mensal", nl: "Maandelijkse betaling" });
        const monthsLabel = L(lang, { de: "Monate", fr: "mois", en: "months", ar: "شهر", tr: "ay", es: "meses", it: "mesi", pt: "meses", nl: "maanden" });

        const html = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;" dir="${lang === "ar" ? "rtl" : "ltr"}">
  <div style="background:linear-gradient(135deg,#002d15,#005F2D);padding:28px 32px;">
    <img src="https://www.kt-bank-ag.com/kt-logo.png" alt="KT Bank AG" style="height:28px;filter:brightness(0) invert(1);display:block;margin-bottom:16px;" />
    <h1 style="color:white;margin:0;font-size:22px;font-weight:700;">${title}</h1>
  </div>
  <div style="padding:32px;">
    <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 16px;">${greeting}</p>
    <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 20px;">${bodyText}</p>
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:20px 24px;margin:0 0 24px;">
      <p style="color:#005F2D;font-weight:700;font-size:14px;margin:0 0 12px;">${detailsTitle}</p>
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <tr><td style="color:#6b7280;padding:4px 0;">${kType}</td><td style="color:#111827;font-weight:600;text-align:right;">${typeLabel}</td></tr>
        <tr><td style="color:#6b7280;padding:4px 0;">${kAmount}</td><td style="color:#005F2D;font-weight:700;text-align:right;font-size:15px;">${amountFmt}</td></tr>
        <tr><td style="color:#6b7280;padding:4px 0;">${kDuration}</td><td style="color:#111827;font-weight:600;text-align:right;">${req2.duration_months} ${monthsLabel}</td></tr>
        <tr><td style="color:#6b7280;padding:4px 0;">${kMonthly}</td><td style="color:#111827;font-weight:600;text-align:right;">${monthlyFmt}</td></tr>
      </table>
    </div>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:0 0 20px;" />
    <p style="color:#9ca3af;font-size:12px;">KT Bank AG · <a href="mailto:support@kt-bank-ag.com" style="color:#005F2D;">support@kt-bank-ag.com</a></p>
  </div>
</div>`;
        await send(profile.email, subject, html).catch(console.error);
      } else if (status === "rejected") {
        const subject = L(lang, {
          de: "KT Bank AG — Entscheidung zu Ihrem Kreditantrag",
          fr: "KT Bank AG — Décision sur votre demande de crédit",
          en: "KT Bank AG — Decision on your credit application",
          ar: "KT Bank AG — قرار بخصوص طلب القرض الخاص بك",
          tr: "KT Bank AG — Kredi başvurunuzla ilgili karar",
          es: "KT Bank AG — Decisión sobre su solicitud de crédito",
          it: "KT Bank AG — Decisione sulla sua richiesta di credito",
          pt: "KT Bank AG — Decisão sobre o seu pedido de crédito",
          nl: "KT Bank AG — Beslissing over uw kredietaanvraag",
        });
        const title = L(lang, {
          de: "Entscheidung zu Ihrem Antrag", fr: "Décision sur votre dossier", en: "Decision on your application",
          ar: "قرار بخصوص طلبك", tr: "Başvurunuzla ilgili karar", es: "Decisión sobre su solicitud",
          it: "Decisione sulla sua richiesta", pt: "Decisão sobre o seu pedido", nl: "Beslissing over uw aanvraag",
        });
        const greeting = L(lang, {
          de: `Guten Tag <strong>${profile.prenom}</strong>,`, fr: `Bonjour <strong>${profile.prenom}</strong>,`,
          en: `Hello <strong>${profile.prenom}</strong>,`, ar: `مرحباً <strong>${profile.prenom}</strong>،`,
          tr: `Merhaba <strong>${profile.prenom}</strong>,`, es: `Hola <strong>${profile.prenom}</strong>,`,
          it: `Buongiorno <strong>${profile.prenom}</strong>,`, pt: `Olá <strong>${profile.prenom}</strong>,`,
          nl: `Hallo <strong>${profile.prenom}</strong>,`,
        });
        const bodyText = L(lang, {
          de: "Nach sorgfältiger Prüfung Ihrer Unterlagen sind wir derzeit nicht in der Lage, Ihrem Kreditantrag stattzugeben.",
          fr: "Après examen attentif de votre dossier, nous ne sommes pas en mesure de donner suite à votre demande de crédit pour le moment.",
          en: "After careful review of your file, we are unable to approve your credit application at this time.",
          ar: "بعد دراسة متأنية لملفكم، لا يمكننا الاستجابة لطلب القرض الخاص بكم في الوقت الحالي.",
          tr: "Dosyanızın dikkatli bir şekilde incelenmesi sonucunda, şu anda kredi başvurunuzu onaylayamıyoruz.",
          es: "Tras un análisis detallado de su expediente, no podemos aprobar su solicitud de crédito en este momento.",
          it: "Dopo un attento esame della sua pratica, non siamo in grado di accogliere la sua richiesta di credito in questo momento.",
          pt: "Após uma análise cuidadosa do seu processo, não nos é possível aprovar o seu pedido de crédito neste momento.",
          nl: "Na een zorgvuldige beoordeling van uw dossier kunnen wij uw kredietaanvraag op dit moment niet goedkeuren.",
        });
        const reasonTitle = L(lang, {
          de: "Begründung", fr: "Motif de la décision", en: "Reason for the decision",
          ar: "سبب القرار", tr: "Kararın gerekçesi", es: "Motivo de la decisión",
          it: "Motivo della decisione", pt: "Motivo da decisão", nl: "Reden voor de beslissing",
        });
        const footNote = L(lang, {
          de: "Sie können nach 3 Monaten einen neuen Antrag stellen oder unser Team für weitere Informationen kontaktieren.",
          fr: "Vous pouvez soumettre une nouvelle demande après 3 mois ou contacter notre équipe pour plus d'informations.",
          en: "You may submit a new application after 3 months, or contact our team for more information.",
          ar: "يمكنكم تقديم طلب جديد بعد 3 أشهر أو التواصل مع فريقنا لمزيد من المعلومات.",
          tr: "3 ay sonra yeni bir başvuru yapabilir veya daha fazla bilgi için ekibimizle iletişime geçebilirsiniz.",
          es: "Puede presentar una nueva solicitud después de 3 meses o contactar con nuestro equipo para más información.",
          it: "Potrà presentare una nuova richiesta dopo 3 mesi o contattare il nostro team per maggiori informazioni.",
          pt: "Pode submeter um novo pedido após 3 meses ou contactar a nossa equipa para mais informações.",
          nl: "U kunt na 3 maanden een nieuwe aanvraag indienen of contact opnemen met ons team voor meer informatie.",
        });
        const html = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;" dir="${lang === "ar" ? "rtl" : "ltr"}">
  <div style="background:#1a1a1a;padding:28px 32px;">
    <img src="https://www.kt-bank-ag.com/kt-logo.png" alt="KT Bank AG" style="height:28px;filter:brightness(0) invert(1);display:block;margin-bottom:16px;" />
    <h1 style="color:white;margin:0;font-size:20px;font-weight:700;">${title}</h1>
  </div>
  <div style="padding:32px;">
    <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 16px;">${greeting}</p>
    <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 20px;">${bodyText}</p>
    ${rejection_reason ? `
    <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;padding:16px 20px;margin:0 0 20px;">
      <p style="color:#c2410c;font-weight:700;font-size:13px;margin:0 0 6px;">${reasonTitle}</p>
      <p style="color:#374151;font-size:14px;margin:0;line-height:1.6;">${rejection_reason}</p>
    </div>` : ""}
    <div style="background:#f9fafb;border-radius:10px;padding:16px 20px;margin:0 0 20px;">
      <p style="color:#374151;font-size:13px;margin:0;line-height:1.6;">${footNote}</p>
    </div>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:0 0 20px;" />
    <p style="color:#9ca3af;font-size:12px;">KT Bank AG · <a href="mailto:support@kt-bank-ag.com" style="color:#005F2D;">support@kt-bank-ag.com</a></p>
  </div>
</div>`;
        await send(profile.email, subject, html).catch(console.error);
      }
    }
  }

  return NextResponse.json({ ok: true });
}
