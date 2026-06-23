import { NextRequest, NextResponse } from "next/server";
import { getSupabase, getSupabaseAdmin } from "@/lib/supabase";
import {
  genKontoeröffnung, genWillkommen, genKreditvertrag, genTilgungsplan,
  genAGB, genDatenschutz, genCustom, type DocType,
} from "@/lib/document-templates";
import type { SignatureOptions } from "@/lib/document-templates";
import { sendDocumentToClient } from "@/lib/email/send";

function auth(req: NextRequest) {
  const key = process.env.KT_ADMIN_KEY;
  return key && req.headers.get("Authorization") === `Bearer ${key}`;
}

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const supabase = getSupabase();
  const url = new URL(req.url);
  const clientId = url.searchParams.get("client_id");

  const [docsQ, subsQ, clientsQ] = await Promise.all([
    clientId
      ? supabase.from("kt_documents").select("*").eq("client_id", clientId).order("created_at", { ascending: false })
      : supabase.from("kt_documents").select("*").order("created_at", { ascending: false }).limit(200),
    clientId
      ? supabase.from("kt_client_submissions").select("*").eq("client_id", clientId).order("created_at", { ascending: false })
      : supabase.from("kt_client_submissions").select("*").order("created_at", { ascending: false }).limit(200),
    supabase.from("kt_profiles").select("id, prenom, nom, email, adresse, code_postal, ville, pays_residence, nationalite, telephone, created_at")
      .order("created_at", { ascending: false }).limit(200),
  ]);

  return NextResponse.json({
    documents: docsQ.data ?? [],
    submissions: subsQ.data ?? [],
    clients: clientsQ.data ?? [],
  });
}

export async function POST(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const { client_id, type, title, description, loan, body_html, signature_options } = body as {
    client_id: string;
    type: DocType;
    title: string;
    description?: string;
    loan?: { type: "islamic" | "standard"; amount: number; duration_months: number; monthly_payment: number; total_repayment: number; interest_rate: number; purpose?: string };
    body_html?: string;
    signature_options?: SignatureOptions;
  };

  if (!client_id || !type || !title)
    return NextResponse.json({ error: "Fehlende Felder" }, { status: 400 });

  const supabase = getSupabase();
  const { data: profile } = await supabase
    .from("kt_profiles")
    .select("id, prenom, nom, email, adresse, code_postal, ville, pays_residence, nationalite, telephone, created_at")
    .eq("id", client_id).single();

  const { data: account } = await supabase
    .from("kt_accounts")
    .select("id, iban, bic")
    .eq("profile_id", client_id).limit(1).single();

  if (!profile) return NextResponse.json({ error: "Client introuvable" }, { status: 404 });

  const clientInfo = {
    prenom: profile.prenom,
    nom: profile.nom,
    email: profile.email,
    telephone: profile.telephone,
    adresse: profile.adresse,
    code_postal: profile.code_postal,
    ville: profile.ville,
    pays_residence: profile.pays_residence,
    nationalite: profile.nationalite,
    created_at: profile.created_at,
    iban: account?.iban,
    bic: account?.bic,
    account_id: account?.id,
  };

  const sigOpts: SignatureOptions = signature_options ?? {};

  let contentHtml = "";
  switch (type) {
    case "kontoeroeffnung": contentHtml = genKontoeröffnung(clientInfo, sigOpts); break;
    case "willkommen":      contentHtml = genWillkommen(clientInfo, sigOpts); break;
    case "kreditvertrag":   contentHtml = loan ? genKreditvertrag(clientInfo, loan, sigOpts) : ""; break;
    case "tilgungsplan":    contentHtml = loan ? genTilgungsplan(clientInfo, loan) : ""; break;
    case "agb":             contentHtml = genAGB(clientInfo); break;
    case "datenschutz":     contentHtml = genDatenschutz(clientInfo); break;
    case "custom":          contentHtml = body_html ? genCustom(clientInfo, { title, body_html }, sigOpts) : ""; break;
  }

  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin.from("kt_documents").insert({
    client_id,
    type,
    title,
    description,
    content_html: contentHtml,
    status: "active",
  }).select("id").single();

  if (error) {
    console.error("[admin/documents POST]", error);
    return NextResponse.json({ error: "Datenbankfehler" }, { status: 500 });
  }

  // Send document email to client (HTML attached as file)
  try {
    const { data: profileLang } = await supabase.from("kt_profiles").select("lang").eq("id", client_id).single();
    await sendDocumentToClient(profile.email, {
      prenom: profile.prenom,
      docTitle: title,
      docType: type,
      lang: profileLang?.lang ?? "de",
      contentHtml,
    });
  } catch (err) {
    console.error("[admin/documents] Email send failed:", err);
  }

  return NextResponse.json({ ok: true, id: data?.id, preview_html: contentHtml });
}

export async function DELETE(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "id requis" }, { status: 400 });
  const supabase = getSupabaseAdmin();
  await supabase.from("kt_documents").delete().eq("id", id);
  return NextResponse.json({ ok: true });
}
