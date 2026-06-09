-- Add full_result column to submissions for cross-device result restoration
-- full_result stores the complete grading payload needed to rebuild the result view:
--   Q51/Q52: { answerA, answerB, gradeA, gradeB }
--   Q53/Q54: { answer, gradeResult }
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS full_result JSONB;

-- Index for fast lookup: latest result per (user, question_type, prompt_id)
CREATE INDEX IF NOT EXISTS idx_submissions_user_type_prompt
  ON submissions (user_id, question_type, prompt_id, created_at DESC)
  WHERE full_result IS NOT NULL;
