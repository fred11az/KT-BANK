import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

function auth(req: NextRequest) {
  const key = process.env.KT_ADMIN_KEY;
  return key && req.headers.get("Authorization") === `Bearer ${key}`;
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  if (!auth(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const supabase = getSupabase();

  const { data: profile, error } = await supabase
    .from("kt_profiles")
    .select("*")
    .eq("id", params.id)
    .single();
  if (error || !profile) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

  const { data: accounts } = await supabase
    .from("kt_accounts")
    .select("*, kt_cards(*), kt_transactions(*)")
    .eq("profile_id", params.id);

  return NextResponse.json({ profile, accounts: accounts ?? [] });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!auth(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const supabase = getSupabase();
  const body = await req.json();
  const allowed = ["status", "kyc_status"];
  const update = Object.fromEntries(Object.entries(body).filter(([k]) => allowed.includes(k)));
  const { error } = await supabase.from("kt_profiles").update(update).eq("id", params.id);
  if (error) return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
