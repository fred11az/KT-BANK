import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendOtpRegistration } from "@/lib/email/send";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function randomOtp() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export async function POST(req: NextRequest) {
  const { email, lang } = await req.json();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Email invalide" }, { status: 400 });
  }

  const code = randomOtp();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  await supabase
    .from("otp_tokens")
    .update({ used: true })
    .eq("email", email)
    .eq("type", "kt_registration")
    .eq("used", false);

  const { error } = await supabase.from("otp_tokens").insert({
    email,
    token: code,
    type: "kt_registration",
    expires_at: expiresAt,
  });

  if (error) return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });

  await sendOtpRegistration(email, code, lang ?? "de");

  return NextResponse.json({ ok: true });
}
