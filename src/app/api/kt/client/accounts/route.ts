import { NextRequest, NextResponse } from "next/server";
import { getSupabase, getSupabaseAdmin } from "@/lib/supabase";

function generateIban() {
  const bban = Array.from({ length: 18 }, () => Math.floor(Math.random() * 10)).join("");
  return `DE${Math.floor(10 + Math.random() * 90)}3704${bban}`;
}

async function getSessionEmail(req: NextRequest): Promise<string | null> {
  const auth = req.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  const token = auth.slice(7);
  const supabase = getSupabase();
  const { data } = await supabase
    .from("kt_sessions")
    .select("email")
    .eq("token", token)
    .gt("expires_at", new Date().toISOString())
    .single();
  return data?.email ?? null;
}

// List the client's accounts
export async function GET(req: NextRequest) {
  const email = await getSessionEmail(req);
  if (!email) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const supabase = getSupabase();
  const { data: profile } = await supabase.from("kt_profiles").select("id").eq("email", email).single();
  if (!profile) return NextResponse.json({ error: "Profil introuvable" }, { status: 404 });

  const { data: accounts } = await supabase
    .from("kt_accounts")
    .select("*, kt_cards(*)")
    .eq("profile_id", profile.id)
    .order("created_at", { ascending: true });

  return NextResponse.json({ accounts: accounts ?? [] });
}

// Create a new business account request (pending bank approval)
export async function POST(req: NextRequest) {
  const email = await getSessionEmail(req);
  if (!email) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const {
    company_name, legal_form, registration_number, vat_number,
    activity, address, city, postal_code, country, label,
  } = body as Record<string, string>;

  if (!company_name || !activity) {
    return NextResponse.json({ error: "Firmenname und Tätigkeit sind erforderlich" }, { status: 400 });
  }

  const supabase = getSupabase();
  const admin = getSupabaseAdmin();

  const { data: profile } = await supabase
    .from("kt_profiles")
    .select("id, kyc_status, status")
    .eq("email", email)
    .single();
  if (!profile) return NextResponse.json({ error: "Profil introuvable" }, { status: 404 });

  if ((profile as { kyc_status?: string }).kyc_status !== "approved") {
    return NextResponse.json({
      error: "KYC erforderlich, bevor ein Geschäftskonto eröffnet werden kann.",
      code: "KYC_REQUIRED",
    }, { status: 403 });
  }

  // Guard against duplicate pending business requests
  const { data: existing } = await admin
    .from("kt_accounts")
    .select("id")
    .eq("profile_id", profile.id)
    .eq("type", "business")
    .eq("status", "pending");
  if (existing && existing.length > 0) {
    return NextResponse.json({ error: "Sie haben bereits einen ausstehenden Geschäftskontoantrag.", code: "ALREADY_PENDING" }, { status: 409 });
  }

  const business_info = {
    company_name, legal_form: legal_form ?? null, registration_number: registration_number ?? null,
    vat_number: vat_number ?? null, activity, address: address ?? null, city: city ?? null,
    postal_code: postal_code ?? null, country: country ?? null,
  };

  // Provisional IBAN/BIC at creation (kt_accounts.iban is NOT NULL). The account
  // only becomes usable once the bank approves it (status -> 'active').
  const { data: account, error } = await admin
    .from("kt_accounts")
    .insert({
      profile_id: profile.id,
      type: "business",
      status: "pending",
      currency: "EUR",
      balance: 0,
      iban: generateIban(),
      bic: "KTAGDEFF",
      label: label || company_name,
      business_info,
      requested_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error) {
    console.error("[create business account]", error);
    return NextResponse.json({ error: "Erstellung fehlgeschlagen", details: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, account_id: account?.id });
}
