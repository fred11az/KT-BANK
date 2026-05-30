import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { send } from "@/lib/email/send";

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
      const isFr = (profile.lang ?? "de") === "fr";
      const amountFmt = Number(req2.amount).toLocaleString("fr-FR", { minimumFractionDigits: 2 }) + " €";
      const monthlyFmt = Number(req2.monthly_payment).toLocaleString("fr-FR", { minimumFractionDigits: 2 }) + " €";
      const typeLabel = req2.type === "islamic"
        ? (isFr ? "Crédit Islamique (0%)" : "Islamischer Kredit (0%)")
        : (isFr ? "Crédit Standard (2%)" : "Standardkredit (2%)");

      if (status === "approved") {
        const subject = isFr
          ? "KT Bank AG — Votre crédit a été approuvé !"
          : "KT Bank AG — Ihr Kreditantrag wurde genehmigt!";
        const html = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
  <div style="background:linear-gradient(135deg,#002d15,#005F2D);padding:28px 32px;">
    <img src="https://www.kt-bank-ag.com/kt-logo.png" alt="KT Bank AG" style="height:28px;filter:brightness(0) invert(1);display:block;margin-bottom:16px;" />
    <h1 style="color:white;margin:0;font-size:22px;font-weight:700;">${isFr ? "Crédit approuvé ✓" : "Kreditantrag genehmigt ✓"}</h1>
  </div>
  <div style="padding:32px;">
    <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 16px;">${isFr ? `Bonjour <strong>${profile.prenom}</strong>,` : `Guten Tag <strong>${profile.prenom}</strong>,`}</p>
    <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 20px;">
      ${isFr
        ? "Nous avons le plaisir de vous informer que votre demande de crédit a été <strong style=\"color:#005F2D;\">approuvée</strong>. Un conseiller va vous contacter dans les 24 heures pour finaliser les modalités."
        : "Wir freuen uns, Ihnen mitzuteilen, dass Ihr Kreditantrag <strong style=\"color:#005F2D;\">genehmigt</strong> wurde. Ein Berater wird sich innerhalb von 24 Stunden mit Ihnen in Verbindung setzen."
      }
    </p>
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:20px 24px;margin:0 0 24px;">
      <p style="color:#005F2D;font-weight:700;font-size:14px;margin:0 0 12px;">${isFr ? "Détails de votre crédit" : "Details Ihres Kredits"}</p>
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <tr><td style="color:#6b7280;padding:4px 0;">${isFr ? "Type" : "Art"}</td><td style="color:#111827;font-weight:600;text-align:right;">${typeLabel}</td></tr>
        <tr><td style="color:#6b7280;padding:4px 0;">${isFr ? "Montant" : "Betrag"}</td><td style="color:#005F2D;font-weight:700;text-align:right;font-size:15px;">${amountFmt}</td></tr>
        <tr><td style="color:#6b7280;padding:4px 0;">${isFr ? "Durée" : "Laufzeit"}</td><td style="color:#111827;font-weight:600;text-align:right;">${req2.duration_months} ${isFr ? "mois" : "Monate"}</td></tr>
        <tr><td style="color:#6b7280;padding:4px 0;">${isFr ? "Mensualité" : "Monatsrate"}</td><td style="color:#111827;font-weight:600;text-align:right;">${monthlyFmt}</td></tr>
      </table>
    </div>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:0 0 20px;" />
    <p style="color:#9ca3af;font-size:12px;">KT Bank AG · <a href="mailto:support@kt-bank-ag.com" style="color:#005F2D;">support@kt-bank-ag.com</a></p>
  </div>
</div>`;
        await send(profile.email, subject, html).catch(console.error);
      } else if (status === "rejected") {
        const subject = isFr
          ? "KT Bank AG — Décision sur votre demande de crédit"
          : "KT Bank AG — Entscheidung zu Ihrem Kreditantrag";
        const html = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
  <div style="background:#1a1a1a;padding:28px 32px;">
    <img src="https://www.kt-bank-ag.com/kt-logo.png" alt="KT Bank AG" style="height:28px;filter:brightness(0) invert(1);display:block;margin-bottom:16px;" />
    <h1 style="color:white;margin:0;font-size:20px;font-weight:700;">${isFr ? "Décision sur votre dossier" : "Entscheidung zu Ihrem Antrag"}</h1>
  </div>
  <div style="padding:32px;">
    <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 16px;">${isFr ? `Bonjour <strong>${profile.prenom}</strong>,` : `Guten Tag <strong>${profile.prenom}</strong>,`}</p>
    <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 20px;">
      ${isFr
        ? "Après examen attentif de votre dossier, nous ne sommes pas en mesure de donner suite à votre demande de crédit pour le moment."
        : "Nach sorgfältiger Prüfung Ihrer Unterlagen sind wir derzeit nicht in der Lage, Ihrem Kreditantrag stattzugeben."
      }
    </p>
    ${rejection_reason ? `
    <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;padding:16px 20px;margin:0 0 20px;">
      <p style="color:#c2410c;font-weight:700;font-size:13px;margin:0 0 6px;">${isFr ? "Motif de la décision" : "Begründung"}</p>
      <p style="color:#374151;font-size:14px;margin:0;line-height:1.6;">${rejection_reason}</p>
    </div>` : ""}
    <div style="background:#f9fafb;border-radius:10px;padding:16px 20px;margin:0 0 20px;">
      <p style="color:#374151;font-size:13px;margin:0;line-height:1.6;">
        ${isFr
          ? "Vous pouvez soumettre une nouvelle demande après 3 mois ou contacter notre équipe pour plus d'informations."
          : "Sie können nach 3 Monaten einen neuen Antrag stellen oder unser Team für weitere Informationen kontaktieren."
        }
      </p>
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
