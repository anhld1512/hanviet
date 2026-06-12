-- Add prompt usage tracking columns to user_profiles
-- Tracks monthly AI prompt generation (separate from grading usage)

ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS monthly_prompts INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS prompt_month    TEXT;
