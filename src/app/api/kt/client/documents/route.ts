import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

async function getClientId(req: NextRequest): Promise<string | null> {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return null;
  const supabase = getSupabase();
  const { data } = await supabase.from("kt_profiles").select("id").eq("token", token).single();
  return data?.id ?? null;
}

export async function GET(req: NextRequest) {
  const clientId = await getClientId(req);
  if (!clientId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const supabase = getSupabase();
  const [{ data: received }, { data: submitted }] = await Promise.all([
    supabase.from("kt_documents").select("*").eq("client_id", clientId).eq("status", "active").order("created_at", { ascending: false }),
    supabase.from("kt_client_submissions").select("*").eq("client_id", clientId).order("created_at", { ascending: false }),
  ]);

  return NextResponse.json({ received: received ?? [], submitted: submitted ?? [] });
}
