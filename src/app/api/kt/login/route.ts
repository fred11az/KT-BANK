import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function randomOtp() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Email requis" }, { status: 400 });

  // Check profile exists and is verified
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

  // Send OTP
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

  console.log(`[KT LOGIN OTP] ${email} → ${code}`);

  return NextResponse.json({ ok: true });
}
