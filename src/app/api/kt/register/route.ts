import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { sendWelcome, sendAdminNewClient } from "@/lib/email/send";

function generateIban() {
  const bban = Array.from({ length: 18 }, () => Math.floor(Math.random() * 10)).join("");
  return `DE${Math.floor(10 + Math.random() * 90)}3704${bban}`;
}

function missing(...values: unknown[]): boolean {
  return values.some((v) => v === null || v === undefined || v === "");
}

const EMPLOYER_NOT_REQUIRED = ["Rentner(in)", "Arbeitslos"];
const EMPLOYER_LABEL_OPTIONAL: string[] = [];

export async function POST(req: NextRequest) {
  const supabase = getSupabase();
  const body = await req.json();
  const { step, email, lang, ...fields } = body;

  if (!email) return NextResponse.json({ error: "Email requis" }, { status: 400 });

  /* ── Step 2 : Informations personnelles ── */
  if (step === 2) {
    if (missing(fields.pays_residence, fields.date_naissance)) {
      return NextResponse.json({ error: "Pays de résidence et date de naissance requis" }, { status: 400 });
    }
    const { error } = await supabase.from("kt_profiles").update({
      pays_residence: fields.pays_residence,
      date_naissance: fields.date_naissance,
      code_promo: fields.code_promo || null,
      is_fatca: fields.is_fatca ?? false,
      registration_step: 2,
      ...(lang ? { lang } : {}),
    }).eq("email", email);
    if (error) return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }

  /* ── Step 3 : Identité ── */
  if (step === 3) {
    if (missing(fields.prenom, fields.nom, fields.sexe, fields.situation_familiale, fields.pays_naissance, fields.ville_naissance)) {
      return NextResponse.json({ error: "Tous les champs d'identité sont requis" }, { status: 400 });
    }
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
    if (missing(fields.nationalite, fields.type_document, fields.autorite_document)) {
      return NextResponse.json({ error: "Nationalité et document d'identité requis" }, { status: 400 });
    }
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
    if (missing(fields.situation_professionnelle, fields.revenu_mensuel, fields.adresse, fields.code_postal, fields.ville)) {
      return NextResponse.json({ error: "Tous les champs professionnels et d'adresse sont requis" }, { status: 400 });
    }
    const needsEmployer = !EMPLOYER_NOT_REQUIRED.includes(fields.situation_professionnelle) && !EMPLOYER_LABEL_OPTIONAL.includes(fields.situation_professionnelle);
    if (needsEmployer && missing(fields.nom_employeur)) {
      return NextResponse.json({ error: "Le nom de l'employeur / établissement est requis" }, { status: 400 });
    }
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

  /* ── Step 6 : Situation financière (crédits en cours) ── */
  if (step === 6) {
    if (fields.a_credits_en_cours === null || fields.a_credits_en_cours === undefined) {
      return NextResponse.json({ error: "Veuillez indiquer si vous avez des crédits en cours" }, { status: 400 });
    }
    const { error } = await supabase.from("kt_profiles").update({
      a_credits_en_cours: fields.a_credits_en_cours ?? false,
      credits_details: fields.credits_details ?? [],
      registration_step: 6,
    }).eq("email", email);
    if (error) return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }

  /* ── Step 7 : Famille & Ayants droit ── */
  if (step === 7) {
    const ayants: Record<string, string>[] = fields.ayants_droit ?? [];
    for (const a of ayants) {
      if (missing(a.prenom, a.nom, a.lien, a.date_naissance)) {
        return NextResponse.json({ error: "Tous les champs des ayants droit sont requis" }, { status: 400 });
      }
    }
    const { error } = await supabase.from("kt_profiles").update({
      nombre_enfants: fields.nombre_enfants ?? 0,
      personnes_a_charge: fields.personnes_a_charge ?? 0,
      ayants_droit: ayants,
      registration_step: 7,
    }).eq("email", email);
    if (error) return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }

  /* ── Step 8 : Téléphone → finalisation ── */
  if (step === 8) {
    if (missing(fields.telephone)) {
      return NextResponse.json({ error: "Numéro de téléphone requis" }, { status: 400 });
    }

    // Verify all essential fields are filled before activating account
    const { data: current } = await supabase
      .from("kt_profiles")
      .select("prenom, nom, sexe, situation_familiale, pays_naissance, nationalite, type_document, situation_professionnelle, revenu_mensuel, adresse, code_postal, ville, pays_residence, date_naissance")
      .eq("email", email)
      .single();

    if (!current) return NextResponse.json({ error: "Profil introuvable" }, { status: 404 });

    const essentialFields: [string, unknown][] = [
      ["Pays de résidence", current.pays_residence],
      ["Date de naissance", current.date_naissance],
      ["Prénom", current.prenom],
      ["Nom", current.nom],
      ["Sexe", current.sexe],
      ["Situation familiale", current.situation_familiale],
      ["Pays de naissance", current.pays_naissance],
      ["Nationalité", current.nationalite],
      ["Type de document", current.type_document],
      ["Situation professionnelle", current.situation_professionnelle],
      ["Revenu mensuel", current.revenu_mensuel],
      ["Adresse", current.adresse],
      ["Code postal", current.code_postal],
      ["Ville", current.ville],
    ];

    const missingFields = essentialFields.filter(([, v]) => missing(v)).map(([k]) => k);
    if (missingFields.length > 0) {
      return NextResponse.json({ error: `Champs manquants : ${missingFields.join(", ")}` }, { status: 400 });
    }

    const { data: profile, error: profileErr } = await supabase
      .from("kt_profiles")
      .update({
        telephone: fields.telephone,
        phone_verified: true,
        registration_step: 8,
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
