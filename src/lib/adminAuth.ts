import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

// Admin brute-force protection: after MAX_FAILURES wrong keys from the same IP
// within WINDOW_MS, every admin request from that IP gets a 429 (even with the
// right key) until the oldest failure leaves the window.
// Failures live in Supabase (kt_admin_auth_failures) because Workers isolates
// share no memory. See db/2026-admin-rate-limit.sql.
export const MAX_FAILURES = 3;
export const WINDOW_MS = 15 * 60 * 1000;

export function clientIp(req: NextRequest): string {
  // cf-connecting-ip is set by Cloudflare and cannot be forged by the client.
  return (
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    "unknown"
  );
}

/** Returns a 401/429 response to send back, or null when the admin key is valid. */
export async function adminGuard(req: NextRequest): Promise<NextResponse | null> {
  const ip = clientIp(req);
  let db: ReturnType<typeof getSupabaseAdmin> | null = null;

  try {
    db = getSupabaseAdmin();
    const since = new Date(Date.now() - WINDOW_MS).toISOString();
    const { data, error } = await db
      .from("kt_admin_auth_failures")
      .select("failed_at")
      .eq("ip", ip)
      .gte("failed_at", since)
      .order("failed_at", { ascending: true });
    if (error) throw error;
    if (data && data.length >= MAX_FAILURES) {
      const retryAfter = Math.max(
        1,
        Math.ceil((new Date(data[0].failed_at).getTime() + WINDOW_MS - Date.now()) / 1000),
      );
      return NextResponse.json(
        { error: "Trop de tentatives. Réessayez plus tard.", retryAfter },
        { status: 429, headers: { "Retry-After": String(retryAfter) } },
      );
    }
  } catch (e) {
    // If the counter is unavailable we still enforce the key below.
    console.error("adminGuard: rate-limit lookup failed", e);
  }

  const key = process.env.KT_ADMIN_KEY;
  if (key && req.headers.get("Authorization") === `Bearer ${key}`) return null;

  try {
    if (db) {
      await db.from("kt_admin_auth_failures").insert({ ip });
      // housekeeping: drop failures older than a day
      await db
        .from("kt_admin_auth_failures")
        .delete()
        .lt("failed_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
    }
  } catch (e) {
    console.error("adminGuard: could not record failure", e);
  }
  return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
}
