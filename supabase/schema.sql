-- HanViet Writing Coach — Database Schema
-- Chay file nay trong Supabase SQL Editor

-- =============================================
-- 1. USER PROFILES
-- =============================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  display_name TEXT,
  avatar_url TEXT,
  email TEXT,
  -- Onboarding data
  user_type TEXT CHECK (user_type IN ('university', 'working', 'abroad', 'self_study')),
  current_topik_level TEXT CHECK (current_topik_level IN ('none', '1-2', '3', '4', '5+')),
  target_level INTEGER CHECK (target_level BETWEEN 3 AND 6),
  target_exam_date TEXT, -- '3months', '6months', 'no_plan'
  writing_experience TEXT CHECK (writing_experience IN ('never', 'no_score', 'below_40', '40_60', 'above_60')),
  -- Computed
  learning_path TEXT CHECK (learning_path IN ('A', 'B', 'C', 'D', 'E')),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  -- Stats
  study_streak INTEGER DEFAULT 0,
  total_essays_written INTEGER DEFAULT 0,
  avg_writing_score REAL,
  last_study_date DATE,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'premium')),
  is_pro BOOLEAN DEFAULT FALSE,
  monthly_gradings INTEGER DEFAULT 0,
  grading_month TEXT,             -- format: 'YYYY-MM'
  pro_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 2. WRITING PROMPTS (de bai)
-- =============================================
CREATE TABLE IF NOT EXISTS writing_prompts (
  id SERIAL PRIMARY KEY,
  question_type TEXT NOT NULL CHECK (question_type IN ('q51', 'q52', 'q53', 'q54')),
  question_text TEXT NOT NULL,
  question_data JSONB,       -- bieu do mo ta (Q53), goi y (Q54)
  source TEXT,               -- 'topik_64', 'topik_83', 'original'
  exam_number INTEGER,
  sub_type TEXT,             -- Q53: 'comparison', 'two_surveys', 'change_cause'
                             -- Q54: 'necessary', 'problem_solution', 'pros_cons', 'agree_disagree'
  difficulty INTEGER DEFAULT 3 CHECK (difficulty BETWEEN 1 AND 5),
  model_answer TEXT,
  model_answer_score INTEGER,
  is_free BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 3. WRITING TEMPLATES
-- =============================================
CREATE TABLE IF NOT EXISTS writing_templates (
  id SERIAL PRIMARY KEY,
  question_type TEXT NOT NULL CHECK (question_type IN ('q51', 'q52', 'q53', 'q54')),
  sub_type TEXT NOT NULL,
  title_vi TEXT NOT NULL,
  template_kr TEXT NOT NULL,
  template_vi TEXT NOT NULL,
  useful_expressions JSONB,  -- [{kr, vi, usage}]
  example_essays JSONB,      -- [{essay, score, feedback_vi}]
  is_free BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0
);

-- =============================================
-- 4. SUBMISSIONS (bai viet da nop + ket qua cham)
-- =============================================
CREATE TABLE IF NOT EXISTS submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  prompt_id INTEGER,  -- local prompt id (no FK — prompts live in lib/data/prompts.ts)
  question_type TEXT NOT NULL CHECK (question_type IN ('q51', 'q52', 'q53', 'q54')),
  user_answer TEXT NOT NULL,
  character_count INTEGER,
  time_spent_seconds INTEGER,
  -- AI grading
  total_score INTEGER,
  max_score INTEGER,         -- 10 (Q51-52), 30 (Q53), 50 (Q54)
  criteria_scores JSONB,     -- {content, structure, language, style}
  errors JSONB,              -- [{original, corrected, type, explanation_vi, position}]
  rewritten_essay TEXT,
  overall_feedback_vi TEXT,
  estimated_level INTEGER,
  improvement_priority TEXT,
  -- Meta
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 5. ERROR PATTERNS (lo hay mac, aggregated)
-- =============================================
CREATE TABLE IF NOT EXISTS error_patterns (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  error_type TEXT CHECK (error_type IN ('grammar', 'spelling', 'vocabulary', 'style', 'structure')),
  error_pattern TEXT,
  original_example TEXT,
  corrected_example TEXT,
  explanation_vi TEXT,
  occurrence_count INTEGER DEFAULT 1,
  last_occurred TIMESTAMPTZ DEFAULT NOW(),
  resolved BOOLEAN DEFAULT FALSE
);

-- =============================================
-- 6. WRITING EXPRESSIONS (bieu dat viet)
-- =============================================
CREATE TABLE IF NOT EXISTS writing_expressions (
  id SERIAL PRIMARY KEY,
  expression_kr TEXT NOT NULL,
  meaning_vi TEXT NOT NULL,
  usage_context TEXT CHECK (usage_context IN ('q53_data', 'q54_intro', 'q54_body', 'q54_conclusion', 'general')),
  example_kr TEXT,
  example_vi TEXT,
  frequency TEXT CHECK (frequency IN ('essential', 'common', 'advanced')) DEFAULT 'common',
  topic TEXT CHECK (topic IN ('society', 'technology', 'culture', 'environment', 'education', 'general'))
);

-- =============================================
-- RLS POLICIES
-- =============================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_patterns ENABLE ROW LEVEL SECURITY;

-- user_profiles: chi doc/sua profile cua chinh minh
CREATE POLICY "users can view own profile"
  ON user_profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users can update own profile"
  ON user_profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "users can insert own profile"
  ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- submissions: chi xem bai viet cua chinh minh
CREATE POLICY "users can view own submissions"
  ON submissions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "users can insert own submissions"
  ON submissions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- error_patterns: chi xem loi cua chinh minh
CREATE POLICY "users can view own errors"
  ON error_patterns FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "users can insert own errors"
  ON error_patterns FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users can update own errors"
  ON error_patterns FOR UPDATE USING (auth.uid() = user_id);

-- writing_prompts va templates: public read
ALTER TABLE writing_prompts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "prompts are publicly readable"
  ON writing_prompts FOR SELECT USING (true);

ALTER TABLE writing_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "templates are publicly readable"
  ON writing_templates FOR SELECT USING (true);

ALTER TABLE writing_expressions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "expressions are publicly readable"
  ON writing_expressions FOR SELECT USING (true);

-- =============================================
-- TRIGGER: update updated_at on user_profiles
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- TRIGGER: increment total_essays_written
-- =============================================
CREATE OR REPLACE FUNCTION increment_essay_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE user_profiles
  SET
    total_essays_written = total_essays_written + 1,
    last_study_date = CURRENT_DATE,
    study_streak = CASE
      WHEN last_study_date = CURRENT_DATE - INTERVAL '1 day' THEN study_streak + 1
      WHEN last_study_date = CURRENT_DATE THEN study_streak
      ELSE 1
    END
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER submissions_count
  AFTER INSERT ON submissions
  FOR EACH ROW EXECUTE FUNCTION increment_essay_count();
