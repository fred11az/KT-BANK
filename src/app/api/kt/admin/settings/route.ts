import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { adminGuard } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  const supabase = getSupabase();
  const { data } = await supabase.from("kt_settings").select("*");
  const settings: Record<string, unknown> = {};
  for (const row of data ?? []) settings[row.key] = row.value;
  return NextResponse.json(settings);
}

export async function PATCH(req: NextRequest) {
  const denied = await adminGuard(req);
  if (denied) return denied;
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
