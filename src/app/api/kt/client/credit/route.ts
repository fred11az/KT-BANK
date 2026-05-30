import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { send } from "@/lib/email/send";

async function getSession(req: NextRequest): Promise<{ email: string } | null> {
  const auth = req.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  const token = auth.slice(7);
  const supabase = getSupabase();
  const { data } = await supabase
    .from("kt_sessions")
    .select("email")
    .eq("token", token)
    .gt("expires_at", new Date().toISOString())
    .single();
  return data ? { email: data.email } : null;
}

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const supabase = getSupabase();
  const { data: profile } = await supabase.from("kt_profiles").select("id").eq("email", session.email).single();
  if (!profile) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  const { data: requests } = await supabase
    .from("kt_credit_requests")
    .select("*")
    .eq("profile_id", profile.id)
    .order("created_at", { ascending: false });
  return NextResponse.json({ requests: requests ?? [] });
}

export async function POST(req: NextRequest) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const supabase = getSupabase();
  const { data: profile } = await supabase
    .from("kt_profiles")
    .select("id, prenom, nom, lang")
    .eq("email", session.email)
    .single();
  if (!profile) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

  const body = await req.json();
  const {
    type, amount, duration_months, monthly_payment, total_repayment, interest_rate,
    purpose, employment_status, monthly_income, existing_debts,
    property_owned, marital_status, dependents, account_id,
  } = body;

  if (!type || !amount || !duration_months || !monthly_payment) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }

  const { data: request, error } = await supabase
    .from("kt_credit_requests")
    .insert({
      profile_id: profile.id,
      account_id: account_id || null,
      type,
      amount: Number(amount),
      duration_months: Number(duration_months),
      monthly_payment: Number(monthly_payment),
      total_repayment: Number(total_repayment ?? monthly_payment * duration_months),
      interest_rate: Number(interest_rate ?? 0),
      purpose: purpose || null,
      employment_status: employment_status || null,
      monthly_income: monthly_income ? Number(monthly_income) : null,
      existing_debts: existing_debts ? Number(existing_debts) : 0,
      property_owned: !!property_owned,
      marital_status: marital_status || null,
      dependents: Number(dependents ?? 0),
    })
    .select("id")
    .single();

  if (error) {
    console.error("[credit POST]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }

  const isFr = (profile.lang ?? "de") === "fr";
  const locale = isFr ? "fr-FR" : "de-DE";
  const date = new Date().toLocaleString(locale, { timeZone: "Europe/Paris" });
  const amountFmt = Number(amount).toLocaleString(locale, { minimumFractionDigits: 2 }) + " €";
  const monthlyFmt = Number(monthly_payment).toLocaleString(locale, { minimumFractionDigits: 2 }) + " €";
  const typeLabel = type === "islamic"
    ? (isFr ? "Crédit Islamique (0% — Mourabaha)" : "Islamischer Kredit (0% — Mourabaha)")
    : (isFr ? "Crédit Standard (2% annuel)" : "Standardkredit (2% p.a.)");

  const clientSubject = isFr
    ? "KT Bank AG — Votre demande de crédit a été reçue"
    : "KT Bank AG — Ihre Kreditanfrage ist eingegangen";

  const clientHtml = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
  <div style="background:linear-gradient(135deg,#002d15,#005F2D);padding:28px 32px;">
    <img src="https://www.kt-bank-ag.com/kt-logo.png" alt="KT Bank AG" style="height:28px;filter:brightness(0) invert(1);display:block;margin-bottom:16px;" />
    <h1 style="color:white;margin:0;font-size:20px;font-weight:700;">${isFr ? "Demande de crédit reçue" : "Kreditanfrage eingegangen"}</h1>
    <p style="color:rgba(255,255,255,0.75);margin:6px 0 0;font-size:14px;">${isFr ? "Programme de crédit · KT Bank AG" : "Kreditprogramm · KT Bank AG"}</p>
  </div>
  <div style="padding:32px;">
    <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 20px;">${isFr ? `Bonjour <strong>${profile.prenom}</strong>,` : `Guten Tag <strong>${profile.prenom}</strong>,`}</p>
    <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 20px;">
      ${isFr
        ? `Nous avons bien reçu votre demande de crédit. Notre équipe va analyser votre dossier et vous contactera <strong>dans les 48 heures</strong>.`
        : `Wir haben Ihre Kreditanfrage erhalten. Unser Team wird Ihren Antrag prüfen und sich <strong>innerhalb von 48 Stunden</strong> bei Ihnen melden.`
      }
    </p>
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:20px 24px;margin:24px 0;">
      <p style="color:#005F2D;font-weight:700;font-size:14px;margin:0 0 12px;">
        ${isFr ? "Récapitulatif de votre demande" : "Zusammenfassung Ihrer Anfrage"}
      </p>
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <tr><td style="color:#6b7280;padding:4px 0;">${isFr ? "Type de crédit" : "Kreditart"}</td><td style="color:#111827;font-weight:600;text-align:right;">${typeLabel}</td></tr>
        <tr><td style="color:#6b7280;padding:4px 0;">${isFr ? "Montant demandé" : "Kreditbetrag"}</td><td style="color:#111827;font-weight:600;text-align:right;">${amountFmt}</td></tr>
        <tr><td style="color:#6b7280;padding:4px 0;">${isFr ? "Durée" : "Laufzeit"}</td><td style="color:#111827;font-weight:600;text-align:right;">${duration_months} ${isFr ? "mois" : "Monate"}</td></tr>
        <tr><td style="color:#6b7280;padding:4px 0;">${isFr ? "Mensualité estimée" : "Monatliche Rate"}</td><td style="color:#005F2D;font-weight:700;text-align:right;">${monthlyFmt}</td></tr>
        <tr><td style="color:#6b7280;padding:4px 0;">Date</td><td style="color:#111827;font-weight:600;text-align:right;">${date}</td></tr>
      </table>
    </div>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
    <p style="color:#9ca3af;font-size:12px;line-height:1.6;margin:0;">
      KT Bank AG · BIC: KTAGDEFF · ${isFr ? "Régulé par la BaFin" : "Reguliert durch die BaFin"}<br/>
      ${isFr ? "Pour toute question" : "Bei Fragen"} : <a href="mailto:support@kt-bank-ag.com" style="color:#005F2D;">support@kt-bank-ag.com</a>
    </p>
  </div>
</div>`;

  const adminHtml = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
  <div style="background:#005F2D;padding:28px 32px;">
    <p style="color:rgba(255,255,255,0.7);font-size:12px;margin:0 0 4px;text-transform:uppercase;letter-spacing:0.08em;">KT Bank AG — Crédit</p>
    <h1 style="color:white;margin:0;font-size:20px;font-weight:700;">Nouvelle demande de crédit</h1>
  </div>
  <div style="padding:32px;">
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:13px;width:160px;">Client</td><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-weight:600;color:#111827;">${profile.prenom} ${profile.nom}</td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:13px;">E-mail</td><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-weight:600;color:#111827;"><a href="mailto:${session.email}" style="color:#005F2D;">${session.email}</a></td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:13px;">Type</td><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-weight:600;color:#111827;">${typeLabel}</td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:13px;">Montant</td><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-weight:700;color:#005F2D;font-size:15px;">${amountFmt}</td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:13px;">Durée</td><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-weight:600;color:#111827;">${duration_months} mois</td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:13px;">Mensualité</td><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-weight:600;color:#111827;">${monthlyFmt}</td></tr>
      ${purpose ? `<tr><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:13px;">Objet</td><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#374151;">${purpose}</td></tr>` : ""}
      ${employment_status ? `<tr><td style="padding:10px 0;color:#6b7280;font-size:13px;">Emploi</td><td style="padding:10px 0;color:#374151;">${employment_status}</td></tr>` : ""}
    </table>
    <div style="margin-top:20px;padding:14px 16px;background:#f0fdf4;border-radius:8px;border-left:3px solid #005F2D;">
      <p style="color:#005F2D;font-size:13px;font-weight:600;margin:0 0 4px;">Action requise</p>
      <p style="color:#374151;font-size:13px;margin:0;">Examiner et traiter la demande dans l'espace admin.</p>
    </div>
    <p style="color:#9ca3af;font-size:12px;margin:20px 0 0;">Reçu le ${date}</p>
  </div>
</div>`;

  const adminEmails = ["KTBANKAGDE@GMAIL.COM", "support@kt-bank-ag.com"];
  if (process.env.RESEND_ADMIN_EMAIL) adminEmails.push(process.env.RESEND_ADMIN_EMAIL);

  await Promise.all([
    send(session.email, clientSubject, clientHtml),
    ...adminEmails.map((to) =>
      send(to, `Nouvelle demande crédit — ${profile.prenom} ${profile.nom}`, adminHtml)
    ),
  ]).catch((err) => console.error("[credit emails]", err));

  return NextResponse.json({ ok: true, id: request?.id });
}
