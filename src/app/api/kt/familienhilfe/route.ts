import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY not set");
  return new Resend(key);
}

const FROM = "KT Bank AG <support@kt-bank-ag.com>";

export async function POST(req: NextRequest) {
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Corps invalide" }, { status: 400 }); }

  const { prenom, nom, email, telephone, situation, lang } = body as Record<string, string>;
  if (!prenom?.trim() || !nom?.trim() || !email?.trim() || !telephone?.trim() || !situation?.trim()) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }

  const resend = getResend();
  const date = new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" });

  /* ── Email admin ── */
  const adminHtml = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
  <div style="background:#005F2D;padding:28px 32px;">
    <p style="color:rgba(255,255,255,0.7);font-size:12px;margin:0 0 4px;text-transform:uppercase;letter-spacing:0.08em;">KT Bank AG — Programme Social</p>
    <h1 style="color:white;margin:0;font-size:20px;font-weight:700;">Nouvelle demande d'aide familiale</h1>
  </div>
  <div style="padding:32px;">
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:12px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:13px;width:160px;">Prénom</td><td style="padding:12px 0;border-bottom:1px solid #f3f4f6;font-weight:600;color:#111827;">${prenom}</td></tr>
      <tr><td style="padding:12px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:13px;">Nom</td><td style="padding:12px 0;border-bottom:1px solid #f3f4f6;font-weight:600;color:#111827;">${nom}</td></tr>
      <tr><td style="padding:12px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:13px;">E-mail</td><td style="padding:12px 0;border-bottom:1px solid #f3f4f6;font-weight:600;color:#111827;"><a href="mailto:${email}" style="color:#005F2D;">${email}</a></td></tr>
      <tr><td style="padding:12px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:13px;">Téléphone</td><td style="padding:12px 0;border-bottom:1px solid #f3f4f6;font-weight:600;color:#111827;">${telephone}</td></tr>
      <tr><td style="padding:12px 0;color:#6b7280;font-size:13px;vertical-align:top;">Situation</td><td style="padding:12px 0;color:#374151;line-height:1.6;">${situation.replace(/\n/g, "<br>")}</td></tr>
    </table>
    <div style="margin-top:24px;padding:16px;background:#f0fdf4;border-radius:8px;border-left:3px solid #005F2D;">
      <p style="color:#005F2D;font-size:13px;font-weight:600;margin:0 0 4px;">Action requise</p>
      <p style="color:#374151;font-size:13px;margin:0;">Contacter ${prenom} ${nom} dans les 24 heures. Répondre directement à cet email.</p>
    </div>
    <p style="color:#9ca3af;font-size:12px;margin:24px 0 0;">Reçu le ${date} via kt-bank-ag.com/familienhilfe</p>
  </div>
</div>`;

  /* ── Email confirmation candidat (bilingue) ── */
  const isFr = lang === "fr";
  const confirmSubject = isFr
    ? "KT Bank AG — Votre demande a bien été reçue"
    : "KT Bank AG — Ihre Anfrage ist eingegangen";
  const confirmHtml = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
  <div style="background:#005F2D;padding:28px 32px;">
    <img src="https://www.kt-bank-ag.com/kt-logo.png" alt="KT Bank AG" style="height:28px;filter:brightness(0) invert(1);display:block;margin-bottom:16px;" />
    <h1 style="color:white;margin:0;font-size:20px;font-weight:700;">
      ${isFr ? "Votre demande a bien été reçue" : "Ihre Anfrage ist eingegangen"}
    </h1>
    <p style="color:rgba(255,255,255,0.75);margin:6px 0 0;font-size:14px;">
      ${isFr ? "Programme d'aide familiale · KT Bank AG" : "Familienförderprogramm · KT Bank AG"}
    </p>
  </div>
  <div style="padding:32px;">
    <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 20px;">
      ${isFr ? `Bonjour <strong>${prenom}</strong>,` : `Guten Tag <strong>${prenom}</strong>,`}
    </p>
    <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 20px;">
      ${isFr
        ? `Nous avons bien reçu votre demande d'aide familiale. Notre équipe sociale va étudier votre dossier et vous contactera <strong>dans les 24 heures</strong> à l'adresse <strong>${email}</strong> ou au <strong>${telephone}</strong>.`
        : `Wir haben Ihre Anfrage zum Familienförderprogramm erhalten. Unser Sozialhilfeteam wird Ihren Antrag prüfen und sich <strong>innerhalb von 24 Stunden</strong> unter <strong>${email}</strong> oder <strong>${telephone}</strong> bei Ihnen melden.`
      }
    </p>
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:20px 24px;margin:24px 0;">
      <p style="color:#005F2D;font-weight:700;font-size:14px;margin:0 0 10px;">
        ${isFr ? "Récapitulatif de votre demande" : "Zusammenfassung Ihrer Anfrage"}
      </p>
      <p style="color:#374151;font-size:13px;margin:4px 0;"><strong>${isFr ? "Nom" : "Name"} :</strong> ${prenom} ${nom}</p>
      <p style="color:#374151;font-size:13px;margin:4px 0;"><strong>E-mail :</strong> ${email}</p>
      <p style="color:#374151;font-size:13px;margin:4px 0;"><strong>${isFr ? "Téléphone" : "Telefon"} :</strong> ${telephone}</p>
      <p style="color:#374151;font-size:13px;margin:4px 0;"><strong>Date :</strong> ${date}</p>
    </div>
    <p style="color:#374151;font-size:14px;line-height:1.7;margin:0 0 24px;">
      ${isFr
        ? "En attendant, vous pouvez ouvrir un compte KT Bank gratuitement pour accélérer le traitement de votre dossier."
        : "In der Zwischenzeit können Sie kostenlos ein KT Bank Konto eröffnen, um die Bearbeitung Ihres Antrags zu beschleunigen."
      }
    </p>
    <a href="https://www.kt-bank-ag.com/client/register" style="display:inline-block;padding:14px 28px;background:#005F2D;color:white;border-radius:999px;font-weight:700;font-size:14px;text-decoration:none;">
      ${isFr ? "Ouvrir un compte gratuit →" : "Kostenloses Konto eröffnen →"}
    </a>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0;" />
    <p style="color:#9ca3af;font-size:12px;line-height:1.6;margin:0;">
      KT Bank AG · BIC: KTAGDEFF · ${isFr ? "Régulé par la BaFin" : "Reguliert durch die BaFin"}<br/>
      ${isFr ? "Pour toute question" : "Bei Fragen"} : <a href="mailto:support@kt-bank-ag.com" style="color:#005F2D;">support@kt-bank-ag.com</a>
    </p>
  </div>
</div>`;

  try {
    const adminEmails = ["KTBANKAGDE@GMAIL.COM", "support@kt-bank-ag.com"];
    if (process.env.RESEND_ADMIN_EMAIL) adminEmails.push(process.env.RESEND_ADMIN_EMAIL);

    const results = await Promise.all([
      // Notifications admin
      ...adminEmails.map((to) =>
        resend.emails.send({ from: FROM, to, subject: `Nouvelle demande aide familiale — ${prenom} ${nom}`, html: adminHtml, replyTo: email })
      ),
      // Confirmation au candidat dans sa langue
      resend.emails.send({ from: FROM, to: email, subject: confirmSubject, html: confirmHtml }),
    ]);

    // Log any Resend-level errors without crashing
    results.forEach(({ error }, i) => {
      if (error) console.error(`[familienhilfe] send[${i}] error:`, JSON.stringify(error));
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[familienhilfe] fatal:", err);
    return NextResponse.json({ error: "Envoi échoué" }, { status: 500 });
  }
}
