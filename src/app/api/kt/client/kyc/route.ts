import { NextRequest, NextResponse } from "next/server";
import { getSupabase, getSupabaseAdmin } from "@/lib/supabase";
import { sendAdminKycSubmitted } from "@/lib/email/send";

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

export async function GET(req: NextRequest) {
  const email = await getSessionEmail(req);
  if (!email) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const supabase = getSupabase();
  const { data: profile } = await supabase
    .from("kt_profiles")
    .select("id, kyc_status, status, activation_required")
    .eq("email", email)
    .single();

  if (!profile) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

  const { data: documents } = await supabase
    .from("kt_kyc_documents")
    .select("id, document_type, status, notes, created_at")
    .eq("profile_id", profile.id)
    .order("created_at", { ascending: true });

  return NextResponse.json({
    kyc_status: profile.kyc_status ?? "unverified",
    account_status: profile.status,
    activation_required: profile.activation_required ?? false,
    documents: documents ?? [],
  });
}

export async function POST(req: NextRequest) {
  const email = await getSessionEmail(req);
  if (!email) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const document_type = formData.get("document_type") as string | null;

  if (!file || !document_type) {
    return NextResponse.json({ error: "Fichier et type requis" }, { status: 400 });
  }

  const validTypes = ["id_front", "id_back", "selfie"];
  if (!validTypes.includes(document_type)) {
    return NextResponse.json({ error: "Type invalide" }, { status: 400 });
  }

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "Fichier trop volumineux (max 10 Mo)" }, { status: 400 });
  }

  const supabase = getSupabase();
  const admin = getSupabaseAdmin();

  const { data: profile } = await supabase
    .from("kt_profiles")
    .select("id, kyc_status, prenom, nom")
    .eq("email", email)
    .single();

  if (!profile) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

  if (profile.kyc_status === "approved") {
    return NextResponse.json({ error: "KYC déjà validé" }, { status: 409 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${profile.id}/${document_type}_${Date.now()}.${ext}`;
  const bytes = await file.arrayBuffer();

  const { error: uploadError } = await admin.storage
    .from("kt-kyc-docs")
    .upload(path, bytes, { contentType: file.type, upsert: true });

  if (uploadError) {
    console.error("[kyc upload]", uploadError);
    return NextResponse.json({ error: "Erreur upload" }, { status: 500 });
  }

  await supabase.from("kt_kyc_documents").upsert(
    { profile_id: profile.id, document_type, file_path: path, status: "pending", notes: null },
    { onConflict: "profile_id,document_type" }
  );

  if (profile.kyc_status !== "pending") {
    await supabase.from("kt_profiles").update({ kyc_status: "pending" }).eq("id", profile.id);
  }

  sendAdminKycSubmitted({
    prenom: profile.prenom ?? "",
    nom: profile.nom ?? "",
    email,
    document_type,
  }).catch(() => {});

  return NextResponse.json({ ok: true });
}
