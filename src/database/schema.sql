-- Portfolio Database Schema
-- Run this in your Supabase SQL Editor at: https://nsymhodgcyjhltpwdghp.supabase.co

-- 1. candidate_profile table
CREATE TABLE IF NOT EXISTS public.candidate_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  title TEXT,
  target_titles TEXT[] DEFAULT '{}',
  target_company_stages TEXT[] DEFAULT '{}',
  elevator_pitch TEXT,
  career_narrative TEXT,
  looking_for TEXT,
  not_looking_for TEXT,
  management_style TEXT,
  work_style TEXT,
  salary_min INTEGER,
  salary_max INTEGER,
  availability_status TEXT,
  availability_date DATE,
  location TEXT,
  remote_preference TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT
);

-- 2. experiences table
CREATE TABLE IF NOT EXISTS public.experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES public.candidate_profile(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  company_name TEXT NOT NULL,
  title TEXT NOT NULL,
  title_progression TEXT,
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  bullet_points TEXT[] DEFAULT '{}',
  why_joined TEXT,
  why_left TEXT,
  actual_contributions TEXT,
  proudest_achievement TEXT,
  would_do_differently TEXT,
  challenges_faced TEXT,
  lessons_learned TEXT,
  manager_would_say TEXT,
  reports_would_say TEXT,
  quantified_impact JSONB DEFAULT '{}',
  display_order INTEGER DEFAULT 0
);

-- 3. skills table
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES public.candidate_profile(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  skill_name TEXT NOT NULL,
  category TEXT CHECK (category IN ('strong', 'moderate', 'gap')) NOT NULL,
  self_rating INTEGER CHECK (self_rating >= 1 AND self_rating <= 5),
  evidence TEXT,
  honest_notes TEXT,
  years_experience NUMERIC,
  last_used DATE
);

-- 4. gaps_weaknesses table
CREATE TABLE IF NOT EXISTS public.gaps_weaknesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES public.candidate_profile(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  gap_type TEXT CHECK (gap_type IN ('skill', 'experience', 'environment', 'role_type')) NOT NULL,
  description TEXT NOT NULL,
  why_its_a_gap TEXT,
  interest_in_learning BOOLEAN DEFAULT false
);

-- 5. values_culture table
CREATE TABLE IF NOT EXISTS public.values_culture (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES public.candidate_profile(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  must_haves TEXT,
  dealbreakers TEXT,
  management_style_preferences TEXT,
  team_size_preferences TEXT,
  how_handle_conflict TEXT,
  how_handle_ambiguity TEXT,
  how_handle_failure TEXT
);

-- 6. faq_responses table
CREATE TABLE IF NOT EXISTS public.faq_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES public.candidate_profile(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  is_common_question BOOLEAN DEFAULT false
);

-- 7. ai_instructions table
CREATE TABLE IF NOT EXISTS public.ai_instructions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES public.candidate_profile(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  instruction_type TEXT CHECK (instruction_type IN ('honesty', 'tone', 'boundaries')) NOT NULL,
  instruction TEXT NOT NULL,
  priority INTEGER DEFAULT 0
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_experiences_candidate ON public.experiences(candidate_id);
CREATE INDEX IF NOT EXISTS idx_skills_candidate ON public.skills(candidate_id);
CREATE INDEX IF NOT EXISTS idx_gaps_candidate ON public.gaps_weaknesses(candidate_id);
CREATE INDEX IF NOT EXISTS idx_values_candidate ON public.values_culture(candidate_id);
CREATE INDEX IF NOT EXISTS idx_faq_candidate ON public.faq_responses(candidate_id);
CREATE INDEX IF NOT EXISTS idx_ai_instructions_candidate ON public.ai_instructions(candidate_id);

-- Auto-update updated_at trigger for candidate_profile
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_candidate_profile_updated_at
  BEFORE UPDATE ON public.candidate_profile
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on all tables (policies to be added based on auth requirements)
ALTER TABLE public.candidate_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gaps_weaknesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.values_culture ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faq_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_instructions ENABLE ROW LEVEL SECURITY;

-- Public read policies (anyone can view portfolio data)
CREATE POLICY "Public read access" ON public.candidate_profile FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.experiences FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.gaps_weaknesses FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.values_culture FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.faq_responses FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.ai_instructions FOR SELECT USING (true);
