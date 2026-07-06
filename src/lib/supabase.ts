import { createClient } from "@supabase/supabase-js";

// NOTE: these helpers are ONLY ever used server-side (API routes / lib).
// getSupabase() prefers the service-role key so the app keeps working once
// Row-Level Security is locked down (the public anon role gets no table
// access). The service-role key is never exposed to the browser: Next.js only
// ships NEXT_PUBLIC_* vars, so in a (hypothetical) client context this falls
// back to the anon key instead of leaking the secret. Queries already filter
// rows explicitly (.eq(...)), so behaviour is unchanged.
export function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase env vars not set");
  return createClient(url, key);
}

export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase service role key not set");
  return createClient(url, key);
}

