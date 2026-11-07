-- ============================================================================
-- KT BANK — Admin login rate limiting (3 failed attempts / IP / 15 min)
-- Run once in the KT Bank Supabase SQL editor. Idempotent.
-- ============================================================================
CREATE TABLE IF NOT EXISTS kt_admin_auth_failures (
  id        bigserial PRIMARY KEY,
  ip        text        NOT NULL,
  failed_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_kt_admin_auth_failures_ip_time
  ON kt_admin_auth_failures (ip, failed_at);

-- Served only through the service role; no policy = no anon/authenticated access.
ALTER TABLE kt_admin_auth_failures ENABLE ROW LEVEL SECURITY;

-- To unlock an IP by hand:
--   DELETE FROM kt_admin_auth_failures WHERE ip = '1.2.3.4';
