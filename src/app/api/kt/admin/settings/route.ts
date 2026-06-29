import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

function auth(req: NextRequest) {
  const key = process.env.KT_ADMIN_KEY;
  return key && req.headers.get("Authorization") === `Bearer ${key}`;
}

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const supabase = getSupabase();
  const { data } = await supabase.from("kt_settings").select("*");
  const settings: Record<string, unknown> = {};
  for (const row of data ?? []) settings[row.key] = row.value;
  return NextResponse.json(settings);
}

export async function PATCH(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const supabase = getSupabase();
  const body = await req.json();

  const allowed = ["transfer_fee", "fee_payment", "crypto_wallets"];
  for (const [key, value] of Object.entries(body)) {
    if (!allowed.includes(key)) continue;
    await supabase.from("kt_settings").upsert(
      { key, value, updated_at: new Date().toISOString() },
      { onConflict: "key" }
    );
  }
  return NextResponse.json({ ok: true });
}
