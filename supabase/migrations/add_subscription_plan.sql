-- Migration: Add subscription_plan column to track which plan user purchased
-- Values: 'free' | 'pro1' | 'pro3' | 'pro6' | 'pro12'
ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS subscription_plan TEXT DEFAULT 'free';

-- Backfill existing Pro users as 'pro6' (most common plan)
UPDATE user_profiles
SET subscription_plan = 'pro6'
WHERE (subscription_tier = 'pro' OR is_pro = true)
  AND subscription_plan = 'free';

-- Index for quick lookup
CREATE INDEX IF NOT EXISTS idx_user_profiles_subscription_plan
  ON user_profiles (subscription_plan);
