import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const supabase = getSupabase();
  const { email, code } = await req.json();
  if (!email || !code) {
    return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("kt_otp_tokens")
    .select("*")
    .eq("email", email)
    .eq("token", code)
    .eq("type", "kt_registration")
    .eq("used", false)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Code invalide ou expiré" }, { status: 400 });
  }

  // Mark OTP as used
  await supabase.from("kt_otp_tokens").update({ used: true }).eq("id", data.id);

  // Upsert profile with email_verified = true
  await supabase.from("kt_profiles").upsert(
    { email, email_verified: true, registration_step: 1 },
    { onConflict: "email" }
  );

  return NextResponse.json({ ok: true });
}
