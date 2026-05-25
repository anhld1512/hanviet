-- Migration: Add Pro subscription columns missing from initial schema
-- These are required for free-tier usage tracking and Pro access checks in lib/usage.ts

ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS is_pro BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS monthly_gradings INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS grading_month TEXT,       -- format: 'YYYY-MM'
  ADD COLUMN IF NOT EXISTS pro_expires_at TIMESTAMPTZ;
