import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY not set");
  return new Resend(key);
}

const FROM = "KT Bank AG <support@kt-bank-ag.com>";

const OFFER_LABELS: Record<string, { fr: string; de: string }> = {
  financing: { fr: "Offre de fin d'année — Financement sans intérêt", de: "Jahresend-Angebot — Zinsfreie Finanzierung" },
  donation: { fr: "Don / Zakat — Campagne 2026/2027", de: "Spende / Zakat — Kampagne 2026/2027" },
};

export async function POST(req: NextRequest) {
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Corps invalide" }, { status: 400 }); }

  const { offer, prenom, nom, email, telephone, message, lang } = body as Record<string, string>;
  if (!offer || !OFFER_LABELS[offer]) {
    return NextResponse.json({ error: "Offre inconnue" }, { status: 400 });
  }
  if (!prenom?.trim() || !nom?.trim() || !email?.trim()) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }

  const resend = getResend();
  const date = new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" });
  const isFr = lang !== "de";
  const offerLabel = isFr ? OFFER_LABELS[offer].fr : OFFER_LABELS[offer].de;

  const adminHtml = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
  <div style="background:#005F2D;padding:28px 32px;">
    <p style="color:rgba(255,255,255,0.7);font-size:12px;margin:0 0 4px;text-transform:uppercase;letter-spacing:0.08em;">KT Bank AG — Demande d'information</p>
    <h1 style="color:white;margin:0;font-size:20px;font-weight:700;">${offerLabel}</h1>
  </div>
  <div style="padding:32px;">
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:12px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:13px;width:160px;">Prénom</td><td style="padding:12px 0;border-bottom:1px solid #f3f4f6;font-weight:600;color:#111827;">${prenom}</td></tr>
      <tr><td style="padding:12px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:13px;">Nom</td><td style="padding:12px 0;border-bottom:1px solid #f3f4f6;font-weight:600;color:#111827;">${nom}</td></tr>
      <tr><td style="padding:12px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:13px;">E-mail</td><td style="padding:12px 0;border-bottom:1px solid #f3f4f6;font-weight:600;color:#111827;"><a href="mailto:${email}" style="color:#005F2D;">${email}</a></td></tr>
      ${telephone ? `<tr><td style="padding:12px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:13px;">Téléphone</td><td style="padding:12px 0;border-bottom:1px solid #f3f4f6;font-weight:600;color:#111827;">${telephone}</td></tr>` : ""}
      ${message ? `<tr><td style="padding:12px 0;color:#6b7280;font-size:13px;vertical-align:top;">Message</td><td style="padding:12px 0;color:#374151;line-height:1.6;">${message.replace(/\n/g, "<br>")}</td></tr>` : ""}
    </table>
    <div style="margin-top:24px;padding:16px;background:#f0fdf4;border-radius:8px;border-left:3px solid #005F2D;">
      <p style="color:#005F2D;font-size:13px;font-weight:600;margin:0 0 4px;">Action requise</p>
      <p style="color:#374151;font-size:13px;margin:0;">Recontacter ${prenom} ${nom}. Répondre directement à cet email.</p>
    </div>
    <p style="color:#9ca3af;font-size:12px;margin:24px 0 0;">Reçu le ${date} via kt-bank-ag.com</p>
  </div>
</div>`;

  const confirmSubject = isFr
    ? "KT Bank AG — Votre demande a bien été reçue"
    : "KT Bank AG — Ihre Anfrage ist eingegangen";
  const confirmHtml = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
  <div style="background:#005F2D;padding:28px 32px;">
    <img src="https://www.kt-bank-ag.com/kt-logo-white.png" alt="KT Bank AG" style="height:28px;display:block;margin-bottom:16px;" />
    <h1 style="color:white;margin:0;font-size:20px;font-weight:700;">${offerLabel}</h1>
  </div>
  <div style="padding:32px;">
    <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 20px;">
      ${isFr ? `Bonjour <strong>${prenom}</strong>,` : `Guten Tag <strong>${prenom}</strong>,`}
    </p>
    <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 20px;">
      ${isFr
        ? "Nous avons bien reçu votre demande d'information. Les conditions détaillées de cette offre seront communiquées très prochainement : notre équipe vous recontactera dès qu'elles seront disponibles."
        : "Wir haben Ihre Anfrage erhalten. Die genauen Konditionen dieses Angebots werden in Kürze bekannt gegeben — unser Team meldet sich bei Ihnen, sobald sie verfügbar sind."
      }
    </p>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0;" />
    <p style="color:#9ca3af;font-size:12px;line-height:1.6;margin:0;">
      KT Bank AG · BIC: KTAGDEFF · ${isFr ? "Régulé par la BaFin" : "Reguliert durch die BaFin"}<br/>
      ${isFr ? "Pour toute question" : "Bei Fragen"} : <a href="mailto:support@kt-bank-ag.com" style="color:#005F2D;">support@kt-bank-ag.com</a>
    </p>
  </div>
</div>`;

  try {
    const adminEmails = ["support@kt-bank-ag.com"];
    if (process.env.RESEND_ADMIN_EMAIL) adminEmails.push(process.env.RESEND_ADMIN_EMAIL);

    const results = await Promise.all([
      ...adminEmails.map((to) =>
        resend.emails.send({ from: FROM, to, subject: `${offerLabel} — ${prenom} ${nom}`, html: adminHtml, replyTo: email })
      ),
      resend.emails.send({ from: FROM, to: email, subject: confirmSubject, html: confirmHtml }),
    ]);

    results.forEach(({ error }, i) => {
      if (error) console.error(`[offers/interest] send[${i}] error:`, JSON.stringify(error));
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[offers/interest] fatal:", err);
    return NextResponse.json({ error: "Envoi échoué" }, { status: 500 });
  }
}
