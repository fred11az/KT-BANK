import { NextRequest, NextResponse } from "next/server";
import { getSupabase, getSupabaseAdmin } from "@/lib/supabase";

async function getProfile(req: NextRequest) {
  const auth = req.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  const token = auth.slice(7);
  const supabase = getSupabase();
  const { data: session } = await supabase
    .from("kt_sessions")
    .select("email")
    .eq("token", token)
    .gt("expires_at", new Date().toISOString())
    .single();
  if (!session?.email) return null;
  const { data: profile } = await supabase
    .from("kt_profiles")
    .select("id")
    .eq("email", session.email)
    .single();
  return profile ?? null;
}

export async function GET(req: NextRequest) {
  const profile = await getProfile(req);
  if (!profile) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const supabase = getSupabase();
  const { data } = await supabase
    .from("kt_notifications")
    .select("*")
    .eq("profile_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(40);

  const notifications = data ?? [];
  const unread = notifications.filter((n: { read: boolean }) => !n.read).length;
  return NextResponse.json({ notifications, unread });
}

// Mark one ({ id }) or all ({ all: true }) notifications as read
export async function PATCH(req: NextRequest) {
  const profile = await getProfile(req);
  if (!profile) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const admin = getSupabaseAdmin();

  let q = admin.from("kt_notifications").update({ read: true }).eq("profile_id", profile.id);
  if (!body.all) {
    if (!body.id) return NextResponse.json({ error: "id requis" }, { status: 400 });
    q = q.eq("id", body.id);
  }
  await q;
  return NextResponse.json({ ok: true });
}
