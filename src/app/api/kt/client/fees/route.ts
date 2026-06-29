import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

async function getProfile(req: NextRequest) {
  const auth = req.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  const token = auth.slice(7);
  const supabase = getSupabase();
  const { data: session } = await supabase
    .from("kt_sessions")
    .select("email")
    .eq("token", token)
    .gt("expires_at", new Date().toISOString())
    .single();
  if (!session?.email) return null;
  const { data: profile } = await supabase
    .from("kt_profiles")
    .select("id, prenom, lang")
    .eq("email", session.email)
    .single();
  return profile ?? null;
}

// List the client's fee invoices + the bank's payment configuration
export async function GET(req: NextRequest) {
  const profile = await getProfile(req);
  if (!profile) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const supabase = getSupabase();

  const { data: invoices } = await supabase
    .from("kt_fee_invoices")
    .select("*")
    .eq("profile_id", profile.id)
    .order("created_at", { ascending: false });

  // Payment configuration set by the bank in admin settings
  const { data: settingsRows } = await supabase
    .from("kt_settings")
    .select("key, value")
    .in("key", ["crypto_wallets", "fee_payment"]);

  const settings: Record<string, unknown> = {};
  for (const row of settingsRows ?? []) settings[(row as { key: string }).key] = (row as { value: unknown }).value;

  return NextResponse.json({
    invoices: invoices ?? [],
    crypto_wallets: settings.crypto_wallets ?? [],
    sepa: settings.fee_payment ?? null,
  });
}
