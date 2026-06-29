import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { sendFeeInvoice } from "@/lib/email/send";
import { createNotification } from "@/lib/notify";

const DASH = "https://kt-bank-ag.com/client/dashboard";

function auth(req: NextRequest) {
  const key = process.env.KT_ADMIN_KEY;
  return key && req.headers.get("Authorization") === `Bearer ${key}`;
}

// Localized in-app notification copy for a new fee invoice
function notifCopy(lang: string, amount: number, currency: string) {
  const A = `${amount.toFixed(2)} ${currency}`;
  const map: Record<string, { title: string; body: string }> = {
    de: { title: "Neue Gebühr zu begleichen", body: `Eine Gebühr von ${A} wurde ausgestellt. Bitte begleichen Sie sie über SEPA oder Krypto und reichen Sie einen Beleg ein.` },
    fr: { title: "Nouveaux frais à régler", body: `Des frais de ${A} ont été émis. Veuillez les régler par SEPA ou crypto et soumettre un justificatif.` },
    en: { title: "New fee to settle", body: `A fee of ${A} has been issued. Please settle it by SEPA or crypto and submit a proof of payment.` },
    ar: { title: "رسوم جديدة للتسوية", body: `تم إصدار رسوم بقيمة ${A}. يرجى تسويتها عبر SEPA أو العملات المشفرة وتقديم إثبات الدفع.` },
    tr: { title: "Ödenecek yeni ücret", body: `${A} tutarında bir ücret oluşturuldu. Lütfen SEPA veya kripto ile ödeyin ve dekont gönderin.` },
    es: { title: "Nueva tarifa por pagar", body: `Se ha emitido una tarifa de ${A}. Por favor, líquidela por SEPA o cripto y envíe un comprobante.` },
    it: { title: "Nuova commissione da saldare", body: `È stata emessa una commissione di ${A}. La preghiamo di saldarla tramite SEPA o cripto e di inviare una ricevuta.` },
    pt: { title: "Nova taxa a liquidar", body: `Foi emitida uma taxa de ${A}. Por favor, liquide-a por SEPA ou cripto e envie um comprovativo.` },
    nl: { title: "Nieuwe kosten te voldoen", body: `Er zijn kosten van ${A} uitgegeven. Voldoe deze via SEPA of crypto en dien een betalingsbewijs in.` },
  };
  return map[lang] ?? map.en;
}

// List invoices (optionally filtered by profile_id)
export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const admin = getSupabaseAdmin();
  const profileId = new URL(req.url).searchParams.get("profile_id");

  let q = admin
    .from("kt_fee_invoices")
    .select("*, kt_profiles(prenom, nom, email)")
    .order("created_at", { ascending: false })
    .limit(200);
  if (profileId) q = q.eq("profile_id", profileId);

  const { data } = await q;
  return NextResponse.json({ invoices: data ?? [] });
}

// Create a fee invoice for a client
export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const admin = getSupabaseAdmin();
  const body = await req.json().catch(() => ({}));
  const { profile_id, title, description, amount, currency, methods } = body as Record<string, unknown>;

  if (!profile_id || !amount || Number(amount) <= 0) {
    return NextResponse.json({ error: "profile_id et montant requis" }, { status: 400 });
  }

  const cur = (currency as string) || "EUR";

  const { data: invoice, error } = await admin
    .from("kt_fee_invoices")
    .insert({
      profile_id,
      title: (title as string) ?? null,
      description: (description as string) ?? null,
      amount: Number(amount),
      currency: cur,
      methods: methods ?? { sepa: true, crypto: [] },
      status: "pending",
    })
    .select("id")
    .single();

  if (error) {
    console.error("[create fee invoice]", error);
    return NextResponse.json({ error: "Erstellung fehlgeschlagen", details: error.message }, { status: 500 });
  }

  // Notify the client (email + in-app), in their language
  const { data: profile } = await admin
    .from("kt_profiles")
    .select("email, prenom, lang")
    .eq("id", profile_id)
    .single();

  if (profile?.email) {
    const lang = (profile.lang as string) ?? "de";
    try {
      await sendFeeInvoice(profile.email, {
        prenom: profile.prenom ?? "Client",
        title: (title as string) ?? undefined,
        amount: Number(amount),
        currency: cur,
        description: (description as string) ?? undefined,
        link: `${DASH}?nav=fees`,
        lang: lang as Parameters<typeof sendFeeInvoice>[1]["lang"],
      });
    } catch (e) {
      console.error("[fee invoice email]", e);
    }
    const copy = notifCopy(lang, Number(amount), cur);
    await createNotification(profile_id as string, {
      type: "fee_invoice",
      title: copy.title,
      body: copy.body,
      link: "fees",
    });
  }

  return NextResponse.json({ ok: true, invoice_id: invoice?.id });
}

// Update an invoice: mark paid/cancelled, or edit amount/title/description
export async function PATCH(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const admin = getSupabaseAdmin();
  const body = await req.json().catch(() => ({}));
  const { id, status, title, description, amount, methods } = body as Record<string, unknown>;
  if (!id) return NextResponse.json({ error: "id requis" }, { status: 400 });

  const update: Record<string, unknown> = {};
  if (status !== undefined) {
    update.status = status;
    if (status === "paid") update.paid_at = new Date().toISOString();
  }
  if (title !== undefined) update.title = title;
  if (description !== undefined) update.description = description;
  if (amount !== undefined) update.amount = Number(amount);
  if (methods !== undefined) update.methods = methods;

  await admin.from("kt_fee_invoices").update(update).eq("id", id);
  return NextResponse.json({ ok: true });
}

// Delete an invoice
export async function DELETE(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const admin = getSupabaseAdmin();
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id requis" }, { status: 400 });
  await admin.from("kt_fee_invoices").delete().eq("id", id);
  return NextResponse.json({ ok: true });
}
