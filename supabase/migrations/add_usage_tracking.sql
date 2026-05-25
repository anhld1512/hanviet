-- Run this in Supabase SQL Editor
-- Adds usage tracking + pro subscription fields to user_profiles

ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS monthly_gradings integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS grading_month   text    DEFAULT '',
  ADD COLUMN IF NOT EXISTS is_pro          boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS pro_expires_at  timestamptz;

-- subscription_tier already exists; update pro users via:
-- UPDATE user_profiles SET subscription_tier = 'pro', is_pro = true WHERE id = '<uuid>';
