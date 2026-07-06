-- ============================================================================
-- KT BANK — Salon Stratégie (private admin-to-admin chat)
-- Run once in the KT Bank Supabase SQL editor. Idempotent.
-- ============================================================================

-- Private discussion between bank admins (code names: Ali BABA, OkRAN, …).
-- Only reachable behind the admin key; served via the service role.
CREATE TABLE IF NOT EXISTS kt_admin_chat (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code_name   text NOT NULL,                    -- 'Ali BABA' | 'OkRAN' | ...
  kind        text NOT NULL DEFAULT 'text',     -- text | image | file | voice
  body        text,                             -- text content or caption
  media_path  text,                             -- storage path in the 'admin-strategy' bucket
  media_name  text,
  media_mime  text,
  duration_ms int,                              -- for voice notes
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_kt_admin_chat_created ON kt_admin_chat(created_at);

-- STORAGE
-- The private bucket 'admin-strategy' is created automatically on first upload
-- by the upload route (service role). No manual bucket creation needed.
-- Media is served through short-lived signed URLs, so it is never publicly
-- browsable. IP calls (if added later) are peer-to-peer and never stored.
