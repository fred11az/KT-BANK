import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { sendOtpLogin } from "@/lib/email/send";

function randomOtp() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export async function POST(req: NextRequest) {
  const supabase = getSupabase();
  const { email, lang } = await req.json();
  if (!email) return NextResponse.json({ error: "Email requis" }, { status: 400 });

  const { data: profile } = await supabase
    .from("kt_profiles")
    .select("id, email_verified, status")
    .eq("email", email)
    .single();

  if (!profile || !profile.email_verified) {
    return NextResponse.json({ error: "Compte non trouvé" }, { status: 404 });
  }
  if (profile.status !== "active") {
    return NextResponse.json({ error: "Compte suspendu" }, { status: 403 });
  }

  const code = randomOtp();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  await supabase
    .from("otp_tokens")
    .update({ used: true })
    .eq("email", email)
    .eq("type", "kt_login")
    .eq("used", false);

  await supabase.from("otp_tokens").insert({
    email,
    token: code,
    type: "kt_login",
    expires_at: expiresAt,
  });

  await sendOtpLogin(email, code, lang ?? "de");

  return NextResponse.json({ ok: true });
}
