import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

function auth(req: NextRequest) {
  const key = process.env.KT_ADMIN_KEY;
  return key && req.headers.get("Authorization") === `Bearer ${key}`;
}

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const supabase = getSupabase();
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";

  let query = supabase
    .from("kt_profiles")
    .select("id,email,prenom,nom,telephone,pays_residence,nationalite,situation_professionnelle,revenu_mensuel,status,kyc_status,registration_step,created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (q) query = query.or(`email.ilike.%${q}%,prenom.ilike.%${q}%,nom.ilike.%${q}%`);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  return NextResponse.json({ clients: data });
}
