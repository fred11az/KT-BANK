import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Corps invalide" }, { status: 400 }); }

  const { prenom, nom, email, telephone, situation } = body as Record<string, string>;
  if (!prenom?.trim() || !nom?.trim() || !email?.trim() || !telephone?.trim() || !situation?.trim()) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }

  const html = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
  <div style="background:#005F2D;padding:28px 32px;">
    <p style="color:rgba(255,255,255,0.7);font-size:12px;margin:0 0 4px;text-transform:uppercase;letter-spacing:0.08em;">KT Bank AG — Programme Social</p>
    <h1 style="color:white;margin:0;font-size:20px;font-weight:700;">Nouvelle demande d'aide familiale</h1>
  </div>
  <div style="padding:32px;">
    <table style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:13px;width:160px;vertical-align:top;">Prénom</td>
        <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;font-weight:600;color:#111827;">${prenom}</td>
      </tr>
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:13px;vertical-align:top;">Nom</td>
        <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;font-weight:600;color:#111827;">${nom}</td>
      </tr>
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:13px;vertical-align:top;">E-mail</td>
        <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;font-weight:600;color:#111827;"><a href="mailto:${email}" style="color:#005F2D;">${email}</a></td>
      </tr>
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:13px;vertical-align:top;">Téléphone</td>
        <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;font-weight:600;color:#111827;">${telephone}</td>
      </tr>
      <tr>
        <td style="padding:12px 0;color:#6b7280;font-size:13px;vertical-align:top;">Situation financière</td>
        <td style="padding:12px 0;color:#374151;line-height:1.6;">${situation.replace(/\n/g, "<br>")}</td>
      </tr>
    </table>
    <div style="margin-top:24px;padding:16px;background:#f0fdf4;border-radius:8px;border-left:3px solid #005F2D;">
      <p style="color:#005F2D;font-size:13px;font-weight:600;margin:0 0 4px;">Action requise</p>
      <p style="color:#374151;font-size:13px;margin:0;">Contacter ${prenom} ${nom} dans les 24 heures pour démarrer l'étude du dossier.</p>
    </div>
    <p style="color:#9ca3af;font-size:12px;margin:24px 0 0;">Demande reçue le ${new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" })} via kt-bank-ag.com/familienhilfe</p>
  </div>
</div>`;

  // Send directly to the real admin inboxes — never to support@kt-bank-ag.com
  // which is a Cloudflare Email Routing alias (no real mailbox, re-forwards break DMARC)
  const adminEmails: string[] = ["KTBANKAGDE@GMAIL.COM"];
  if (process.env.RESEND_ADMIN_EMAIL) adminEmails.push(process.env.RESEND_ADMIN_EMAIL);

  try {
    // Use a noreply FROM to avoid self-address spam filtering when sending to support@
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    await Promise.all(
      adminEmails.map((to) =>
        resend.emails.send({
          from: "KT Bank Notifications <noreply@kt-bank-ag.com>",
          to,
          subject: `Demande aide familiale — ${prenom} ${nom}`,
          html,
        })
      )
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[familienhilfe] send failed", err);
    return NextResponse.json({ error: "Envoi échoué" }, { status: 500 });
  }
}
