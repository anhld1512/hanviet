-- ── Voucher system ────────────────────────────────────────────────────────
-- Table: vouchers
CREATE TABLE IF NOT EXISTS vouchers (
  code          TEXT PRIMARY KEY,
  bonus_gradings INT NOT NULL DEFAULT 30,
  max_uses      INT NOT NULL DEFAULT 20,
  used_count    INT NOT NULL DEFAULT 0,
  description   TEXT,
  expires_at    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- Table: voucher_redemptions (1 user = 1 lần / code)
CREATE TABLE IF NOT EXISTS voucher_redemptions (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  voucher_code TEXT NOT NULL REFERENCES vouchers(code),
  user_id      UUID NOT NULL,
  redeemed_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE(voucher_code, user_id)
);

-- Add bonus_gradings column to user_profiles
ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS bonus_gradings INT NOT NULL DEFAULT 0;

-- Seed: code mặc định cho beta community (20 slot, 30 lượt/người)
INSERT INTO vouchers (code, bonus_gradings, max_uses, description)
VALUES ('HANVIET-BETA', 30, 20, 'Beta community — 30 lượt chấm miễn phí')
ON CONFLICT (code) DO NOTHING;
