/**
 * Ready-made branded HTML email templates for the admin composer.
 * Selecting one loads it into "Coller un email HTML" mode (sent verbatim).
 * They are complete, email-client-safe (table-based, inline styles), and
 * responsive (max-width 600). Placeholders in [CROCHETS] are meant to be edited.
 */

const LOGO = "https://kt-bank-ag.com/kt-logo.png";
const GREEN = "#0b3d2e";
const GOLD = "#c9a44c";

function shell(inner: string, preheader = ""): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f2f4f6;font-family:Georgia,'Times New Roman',serif;">
${preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>` : ""}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2f4f6;padding:28px 0;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">
  <tr><td style="background:linear-gradient(135deg,#002d15,${GREEN});padding:22px 32px;" align="center">
    <img src="${LOGO}" alt="KT Bank AG" width="150" style="display:block;max-width:150px;height:auto;filter:brightness(0) invert(1);" />
  </td></tr>
  <tr><td style="height:4px;background:${GOLD};"></td></tr>
  ${inner}
  <tr><td style="background:#f9fafb;padding:18px 32px;border-top:1px solid #eeeeee;text-align:center;">
    <p style="margin:0 0 3px;font-size:11px;color:#999999;">KT Bank AG · Bockenheimer Anlage 46 · 60322 Frankfurt am Main · Reguliert durch die BaFin · BIC: KTAGDEFF</p>
    <p style="margin:0;font-size:11px;color:#bbbbbb;">kt-bank-ag.com · support@kt-bank-ag.com</p>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

const P = "margin:0 0 18px;font-size:15px;color:#1a1a1a;line-height:1.7;";

export type ComposerPreset = { id: string; name: string; subject: string; html: string };

export const COMPOSER_PRESETS: ComposerPreset[] = [
  {
    id: "simple",
    name: "Lettre simple (brandée)",
    subject: "Message de la KT Bank AG",
    html: shell(`
  <tr><td style="padding:36px 40px;">
    <p style="${P}">Cher/Chère [Nom du client],</p>
    <p style="${P}">[Votre message ici. Vous pouvez écrire plusieurs paragraphes, ils garderont cette mise en forme soignée.]</p>
    <p style="${P}">Nous restons à votre entière disposition pour toute question.</p>
    <p style="margin:28px 0 2px;font-size:15px;color:#1a1a1a;">Cordialement,</p>
    <p style="margin:0;font-size:15px;font-weight:bold;color:${GREEN};">[David Lenian]</p>
    <p style="margin:0;font-size:13px;color:#666666;">[Account manager] — KT Bank AG</p>
  </td></tr>`, "Un message de votre conseiller KT Bank AG"),
  },
  {
    id: "manager",
    name: "Présentation — Conseiller",
    subject: "Votre conseiller dédié à la KT Bank AG",
    html: shell(`
  <tr><td style="padding:36px 40px;">
    <p style="${P}">Cher/Chère [Nom du client],</p>
    <p style="${P}">Je me permets de vous contacter en tant que votre <strong>conseiller dédié</strong> au sein de la KT Bank AG. Mon rôle est de vous accompagner personnellement dans la gestion de votre compte et de vos projets.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 22px;border-left:3px solid ${GOLD};background:#f9f7f1;">
      <tr><td style="padding:16px 20px;">
        <p style="margin:0 0 6px;font-size:15px;font-weight:bold;color:${GREEN};">Je suis à votre disposition pour :</p>
        <p style="margin:0;font-size:14px;color:#333333;line-height:1.8;">• Le suivi de votre compte et de vos opérations<br/>• Vos demandes de financement (classique ou islamique)<br/>• Toute question sur vos produits et services</p>
      </td></tr>
    </table>
    <p style="${P}">N'hésitez pas à répondre directement à cet email, je vous répondrai personnellement.</p>
    <p style="margin:28px 0 2px;font-size:15px;color:#1a1a1a;">Bien à vous,</p>
    <p style="margin:0;font-size:15px;font-weight:bold;color:${GREEN};">[David Lenian]</p>
    <p style="margin:0;font-size:13px;color:#666666;">[Account manager] — KT Bank AG</p>
  </td></tr>`, "Votre conseiller dédié se présente"),
  },
  {
    id: "offer",
    name: "Offre / Information (encadrés)",
    subject: "Une offre de la KT Bank AG",
    html: shell(`
  <tr><td style="padding:36px 40px;">
    <p style="${P}">Cher/Chère [Nom du client],</p>
    <p style="margin:0 0 14px;font-size:15px;color:#1a1a1a;line-height:1.7;">Nous avons le plaisir de vous présenter [objet de l'offre] :</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 14px;border-left:3px solid ${GOLD};background:#f9f7f1;">
      <tr><td style="padding:16px 20px;">
        <p style="margin:0 0 6px;font-size:15px;font-weight:bold;color:${GREEN};">[Titre de l'option 1]</p>
        <p style="margin:0;font-size:14px;color:#333333;line-height:1.6;">[Description de l'option 1.]</p>
      </td></tr>
    </table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;border-left:3px solid ${GOLD};background:#f9f7f1;">
      <tr><td style="padding:16px 20px;">
        <p style="margin:0 0 6px;font-size:15px;font-weight:bold;color:${GREEN};">[Titre de l'option 2]</p>
        <p style="margin:0;font-size:14px;color:#333333;line-height:1.6;">[Description de l'option 2.]</p>
      </td></tr>
    </table>
    <table role="presentation" cellpadding="0" cellspacing="0"><tr>
      <td style="background:${GREEN};border-radius:4px;"><a href="[https://…]" style="display:inline-block;padding:12px 28px;font-size:14px;color:#ffffff;text-decoration:none;">[Contacter notre équipe]</a></td>
    </tr></table>
    <p style="margin:28px 0 2px;font-size:15px;color:#1a1a1a;">Cordialement,</p>
    <p style="margin:0;font-size:15px;font-weight:bold;color:${GREEN};">[David Lenian]</p>
    <p style="margin:0;font-size:13px;color:#666666;">[Account manager] — KT Bank AG</p>
  </td></tr>`, "Découvrez notre offre"),
  },
];
