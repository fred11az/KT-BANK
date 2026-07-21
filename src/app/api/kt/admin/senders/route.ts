import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

const SENDER_DOMAIN = "kt-bank-ag.com";

function auth(req: NextRequest) {
  const key = process.env.KT_ADMIN_KEY;
  return key && req.headers.get("Authorization") === `Bearer ${key}`;
}

// List sender identities
export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const supabase = getSupabase();
  const { data } = await supabase
    .from("kt_sender_identities")
    .select("*")
    .order("created_at", { ascending: true });
  return NextResponse.json({ senders: data ?? [] });
}

// Add a sender identity
export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const supabase = getSupabase();
  const body = await req.json().catch(() => ({}));
  const email = String(body.email ?? "").trim().toLowerCase();
  const label = String(body.label ?? "").trim();

  if (!email || !label) return NextResponse.json({ error: "Email et libellé requis" }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return NextResponse.json({ error: "Adresse email invalide" }, { status: 400 });
  if (!email.endsWith(`@${SENDER_DOMAIN}`))
    return NextResponse.json({ error: `Seules les adresses @${SENDER_DOMAIN} sont autorisées` }, { status: 400 });

  const { error } = await supabase.from("kt_sender_identities").insert({ email, label });
  if (error) {
    const dup = /duplicate|unique/i.test(error.message);
    return NextResponse.json({ error: dup ? "Cette adresse existe déjà" : "Ajout échoué", detail: error.message }, { status: dup ? 409 : 500 });
  }
  return NextResponse.json({ ok: true });
}

// Toggle active / rename
export async function PATCH(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const supabase = getSupabase();
  const body = await req.json().catch(() => ({}));
  if (!body.id) return NextResponse.json({ error: "id requis" }, { status: 400 });
  const update: Record<string, unknown> = {};
  if (body.active !== undefined) update.active = !!body.active;
  if (body.label !== undefined) update.label = String(body.label).trim();
  await supabase.from("kt_sender_identities").update(update).eq("id", body.id);
  return NextResponse.json({ ok: true });
}

// Remove a sender identity
export async function DELETE(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const supabase = getSupabase();
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id requis" }, { status: 400 });
  await supabase.from("kt_sender_identities").delete().eq("id", id);
  return NextResponse.json({ ok: true });
}
