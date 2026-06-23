import { NextRequest, NextResponse } from "next/server";
import { getSupabase, getSupabaseAdmin } from "@/lib/supabase";

async function getClientId(req: NextRequest): Promise<string | null> {
  const auth = req.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  const token = auth.slice(7);
  const supabase = getSupabase();
  const { data: session } = await supabase
    .from("kt_sessions").select("email")
    .eq("token", token).gt("expires_at", new Date().toISOString()).single();
  if (!session?.email) return null;
  const { data: profile } = await supabase.from("kt_profiles").select("id").eq("email", session.email).single();
  return profile?.id ?? null;
}

export async function GET(req: NextRequest) {
  const clientId = await getClientId(req);
  if (!clientId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const supabase = getSupabaseAdmin();
  const [{ data: received }, { data: submitted }] = await Promise.all([
    supabase.from("kt_documents").select("*").eq("client_id", clientId).eq("status", "active").order("created_at", { ascending: false }),
    supabase.from("kt_client_submissions").select("*").eq("client_id", clientId).order("created_at", { ascending: false }),
  ]);

  return NextResponse.json({ received: received ?? [], submitted: submitted ?? [] });
}
