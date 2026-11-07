import { NextRequest, NextResponse } from "next/server";
import { getSupabase, getSupabaseAdmin } from "@/lib/supabase";
import { htmlToPdf } from "@/lib/pdf";

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

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const clientId = await getClientId(req);
  if (!clientId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const supabase = getSupabaseAdmin();
  const { data: doc } = await supabase
    .from("kt_documents")
    .select("title, content_html, client_id, status")
    .eq("id", id)
    .single();

  if (!doc || doc.client_id !== clientId || doc.status !== "active") {
    return NextResponse.json({ error: "Document introuvable" }, { status: 404 });
  }

  const pdf = await htmlToPdf(doc.content_html);
  const filename = `${(doc.title || "Dokument").replace(/[^\w\- ]+/g, "").trim() || "Dokument"}.pdf`;

  return new NextResponse(Buffer.from(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
