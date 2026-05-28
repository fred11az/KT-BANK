import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

function randomToken() {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function POST(req: NextRequest) {
  const supabase = getSupabase();
  const { email, code } = await req.json();
  if (!email || !code) return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });

  const { data, error } = await supabase
    .from("kt_otp_tokens")
    .select("id")
    .eq("email", email)
    .eq("token", code)
    .eq("type", "kt_login")
    .eq("used", false)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) return NextResponse.json({ error: "Code invalide ou expiré" }, { status: 400 });

  await supabase.from("kt_otp_tokens").update({ used: true }).eq("id", data.id);

  const token = randomToken();
  const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString();
  await supabase.from("kt_sessions").insert({ email, token, expires_at: expiresAt });

  return NextResponse.json({ ok: true, token });
}
