-- ============================================================================
-- KT BANK — Feature migration (business accounts, fee settlement, notifications)
-- Run this once in the Supabase SQL editor of the KT Bank project
-- (project ref: mahwphywgcicspdtrclm).
-- Every statement is idempotent (safe to re-run).
-- ============================================================================

-- 1) MULTIPLE / BUSINESS ACCOUNTS -------------------------------------------
-- kt_accounts already has: id, profile_id, iban, bic, type, currency,
-- balance, status, opened_at, created_at.
-- Business accounts use type = 'business' and start at status = 'pending'
-- until the bank approves them (status = 'active'). Personal/current accounts
-- keep their existing type. A human-friendly label and the company details
-- captured on the creation form are stored below.
ALTER TABLE kt_accounts ADD COLUMN IF NOT EXISTS label text;
ALTER TABLE kt_accounts ADD COLUMN IF NOT EXISTS business_info jsonb;
ALTER TABLE kt_accounts ADD COLUMN IF NOT EXISTS requested_at timestamptz;
ALTER TABLE kt_accounts ADD COLUMN IF NOT EXISTS approved_at timestamptz;

-- 2) FEE INVOICES ("Règlement de frais") ------------------------------------
-- The bank issues a fee invoice to a client. The client settles it via SEPA
-- instant transfer or crypto, then uploads a proof of payment.
CREATE TABLE IF NOT EXISTS kt_fee_invoices (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id         uuid NOT NULL REFERENCES kt_profiles(id) ON DELETE CASCADE,
  title              text,
  description        text,
  amount             numeric NOT NULL DEFAULT 0,
  currency           text    NOT NULL DEFAULT 'EUR',
  -- pending | proof_submitted | paid | cancelled
  status             text    NOT NULL DEFAULT 'pending',
  -- enabled payment methods, e.g. { "sepa": true, "crypto": ["btc","usdt_bep20","eth","sol"] }
  methods            jsonb,
  proof_url          text,
  proof_reference    text,
  proof_method       text,           -- 'sepa' | 'crypto:<coin>'
  proof_submitted_at timestamptz,
  paid_at            timestamptz,
  created_at         timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_kt_fee_invoices_profile ON kt_fee_invoices(profile_id, status);

-- 3) IN-APP NOTIFICATIONS ---------------------------------------------------
-- Drives the dashboard bell badge and the "Règlement de frais" menu badge.
CREATE TABLE IF NOT EXISTS kt_notifications (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id  uuid NOT NULL REFERENCES kt_profiles(id) ON DELETE CASCADE,
  -- 'fee_invoice' | 'business_approved' | 'business_rejected' | 'transfer' | 'generic'
  type        text NOT NULL DEFAULT 'generic',
  title       text NOT NULL,
  body        text,
  link        text,        -- in-app target, e.g. 'fees' or 'accounts'
  read        boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_kt_notifications_profile ON kt_notifications(profile_id, read);

-- 4) ADMIN SETTINGS (no schema change — rows in existing kt_settings) --------
-- The bank configures these from the admin Settings page:
--   key = 'crypto_wallets'  value = [
--       { "coin":"btc",        "label":"Bitcoin",          "network":"Bitcoin",  "address":"bc1...", "qr_url": null },
--       { "coin":"usdt_bep20", "label":"USDT (BEP-20)",    "network":"BNB Chain","address":"0x...",  "qr_url": null },
--       { "coin":"eth",        "label":"Ethereum",         "network":"ERC-20",   "address":"0x...",  "qr_url": null },
--       { "coin":"sol",        "label":"Solana",           "network":"Solana",   "address":"...",    "qr_url": null }
--   ]
--   key = 'fee_payment'     value = { "name":..., "iban":..., "bic":..., "bank":..., "reference":... }  (already used for SEPA fee coords)
-- Seed an empty crypto_wallets row so the admin UI has something to edit.
-- Uses WHERE NOT EXISTS (not ON CONFLICT) so it works even if kt_settings.key
-- has no unique constraint — and so a failure here can't roll back the table
-- creations above.
INSERT INTO kt_settings (key, value)
SELECT 'crypto_wallets', '[]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM kt_settings WHERE key = 'crypto_wallets');

-- ============================================================================
-- STORAGE
-- Fee-payment proofs reuse the existing "transfer-proofs" bucket — no new
-- bucket required. (Admin crypto QR codes are generated client-side from the
-- wallet address, so no upload bucket is needed for them either.)
-- ============================================================================
