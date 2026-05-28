import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { sendWelcome, sendAdminNewClient } from "@/lib/email/send";

function generateIban() {
  const bban = Array.from({ length: 18 }, () => Math.floor(Math.random() * 10)).join("");
  return `DE${Math.floor(10 + Math.random() * 90)}3704${bban}`;
}

export async function POST(req: NextRequest) {
  const supabase = getSupabase();
  const body = await req.json();
  const { step, email, lang, ...fields } = body;

  if (!email) return NextResponse.json({ error: "Email requis" }, { status: 400 });

  /* ── Step 2 : Informations personnelles ── */
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

  /* ── Step 3 : Identité ── */
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

  /* ── Step 4 : Nationalité & Document ── */
  if (step === 4) {
    const { error } = await supabase.from("kt_profiles").update({
      nationalite: fields.nationalite,
      type_document: fields.type_document,
      autorite_document: fields.autorite_document,
      registration_step: 4,
    }).eq("email", email);
    if (error) return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }

  /* ── Step 5 : Situation professionnelle & Adresse ── */
  if (step === 5) {
    const { error } = await supabase.from("kt_profiles").update({
      situation_professionnelle: fields.situation_professionnelle,
      nom_employeur: fields.nom_employeur || null,
      revenu_mensuel: fields.revenu_mensuel,
      adresse: fields.adresse,
      code_postal: fields.code_postal,
      ville: fields.ville,
      registration_step: 5,
    }).eq("email", email);
    if (error) return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }

  /* ── Step 6 : Famille & Ayants droit ── */
  if (step === 6) {
    const { error } = await supabase.from("kt_profiles").update({
      nombre_enfants: fields.nombre_enfants ?? 0,
      personnes_a_charge: fields.personnes_a_charge ?? 0,
      ayants_droit: fields.ayants_droit ?? [],
      registration_step: 6,
    }).eq("email", email);
    if (error) return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }

  /* ── Step 7 : Téléphone → finalisation ── */
  if (step === 7) {
    const { data: profile, error: profileErr } = await supabase
      .from("kt_profiles")
      .update({
        telephone: fields.telephone,
        phone_verified: true,
        registration_step: 7,
        status: "active",
      })
      .eq("email", email)
      .select("*")
      .single();

    if (profileErr || !profile) {
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }

    const iban = generateIban();
    const { data: account, error: accErr } = await supabase
      .from("kt_accounts")
      .insert({ profile_id: profile.id, iban, type: "giro", currency: "EUR", balance: 0 })
      .select("id")
      .single();

    if (accErr || !account) {
      return NextResponse.json({ error: "Erreur création compte" }, { status: 500 });
    }

    const last4 = Math.floor(1000 + Math.random() * 9000).toString();
    await supabase.from("kt_cards").insert({
      account_id: account.id,
      type: "debit",
      last4,
      expiry_month: new Date().getMonth() + 1,
      expiry_year: new Date().getFullYear() + 4,
    });

    const prenom = profile.prenom ?? "Kunde";

    await Promise.all([
      sendWelcome(email, prenom, iban, lang ?? "de"),
      sendAdminNewClient({
        prenom: profile.prenom ?? "",
        nom: profile.nom ?? "",
        email,
        telephone: fields.telephone,
        pays_residence: profile.pays_residence ?? "",
        nationalite: profile.nationalite ?? "",
        situation_professionnelle: profile.situation_professionnelle ?? "",
        revenu_mensuel: profile.revenu_mensuel ?? "",
        iban,
      }),
    ]);

    return NextResponse.json({ ok: true, iban });
  }

  return NextResponse.json({ ok: true });
}
