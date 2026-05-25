-- Migration: Remove FK constraint on submissions.prompt_id
-- Reason: writing_prompts are stored in TypeScript (lib/data/prompts.ts),
-- not in the DB. The FK causes silent constraint violations on every submission save.
-- prompt_id is kept as a plain INTEGER for reference only.

ALTER TABLE submissions DROP CONSTRAINT IF EXISTS submissions_prompt_id_fkey;
