import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { sendWelcome } from "@/lib/email/send";

function generateIban() {
  const bban = Array.from({ length: 18 }, () => Math.floor(Math.random() * 10)).join("");
  return `DE${Math.floor(10 + Math.random() * 90)}3704${bban}`;
}

export async function POST(req: NextRequest) {
  const supabase = getSupabase();
  const body = await req.json();
  const { step, email, lang, ...fields } = body;

  if (!email) return NextResponse.json({ error: "Email requis" }, { status: 400 });

  if (step === 2) {
    const { error } = await supabase.from("kt_profiles").update({
      pays_residence: fields.pays_residence,
      date_naissance: fields.date_naissance,
      source_revenus: fields.source_revenus,
      code_promo: fields.code_promo || null,
      is_fatca: fields.is_fatca ?? false,
      registration_step: 2,
    }).eq("email", email);
    if (error) return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }

  if (step === 3) {
    const { error } = await supabase.from("kt_profiles").update({
      prenom: fields.prenom,
      nom: fields.nom,
      sexe: fields.sexe,
      situation_familiale: fields.situation_familiale,
      pays_naissance: fields.pays_naissance,
      ville_naissance: fields.ville_naissance,
      registration_step: 3,
    }).eq("email", email);
    if (error) return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }

  if (step === 4) {
    const { error } = await supabase.from("kt_profiles").update({
      nationalite: fields.nationalite,
      type_document: fields.type_document,
      autorite_document: fields.autorite_document,
      registration_step: 4,
    }).eq("email", email);
    if (error) return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }

  if (step === 5) {
    // Final step: save phone, create giro account + debit card
    const { data: profile, error: profileErr } = await supabase
      .from("kt_profiles")
      .update({
        telephone: fields.telephone,
        phone_verified: true,
        registration_step: 5,
        status: "active",
      })
      .eq("email", email)
      .select("id")
      .single();

    if (profileErr || !profile) {
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }

    // Create giro account
    const iban = generateIban();
    const { data: account, error: accErr } = await supabase
      .from("kt_accounts")
      .insert({
        profile_id: profile.id,
        iban,
        type: "giro",
        currency: "EUR",
        balance: 0,
      })
      .select("id")
      .single();

    if (accErr || !account) {
      return NextResponse.json({ error: "Erreur création compte" }, { status: 500 });
    }

    // Create debit card
    const last4 = Math.floor(1000 + Math.random() * 9000).toString();
    await supabase.from("kt_cards").insert({
      account_id: account.id,
      type: "debit",
      last4,
      expiry_month: new Date().getMonth() + 1,
      expiry_year: new Date().getFullYear() + 4,
    });

    // Send welcome email with IBAN
    const prenom = fields.prenom ?? "Kunde";
    await sendWelcome(email, prenom, iban, lang ?? "de");

    return NextResponse.json({ ok: true, iban });
  }

  return NextResponse.json({ ok: true });
}
