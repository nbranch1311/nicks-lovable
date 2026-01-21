# Database Security Migration

Run this SQL in your Supabase SQL Editor to implement proper Row Level Security.

## Overview

This migration:
1. Creates public views that only expose non-sensitive fields
2. Sets up a user roles system with admin/user roles
3. Configures RLS policies so only admins can access base tables
4. Grants anonymous users access only to the limited public views

## Step 1: Run the Migration

```sql
-- ============================================
-- Database Security Migration
-- Implements proper RLS with public views
-- ============================================

-- 1. Drop existing permissive policies
-- ============================================
DROP POLICY IF EXISTS "Public read access" ON public.candidate_profile;
DROP POLICY IF EXISTS "Public read access" ON public.experiences;
DROP POLICY IF EXISTS "Public read access" ON public.skills;
DROP POLICY IF EXISTS "Public read access" ON public.gaps_weaknesses;
DROP POLICY IF EXISTS "Public read access" ON public.values_culture;
DROP POLICY IF EXISTS "Public read access" ON public.faq_responses;
DROP POLICY IF EXISTS "Public read access" ON public.ai_instructions;

-- 2. Create Public Views (expose only non-sensitive fields)
-- ============================================

-- Public view for candidate profile (excludes email, salary, private notes)
CREATE OR REPLACE VIEW public.candidate_profile_public
WITH (security_invoker = on) AS
SELECT 
    id,
    name,
    title,
    elevator_pitch,
    career_narrative,
    looking_for,
    location,
    remote_preference,
    linkedin_url,
    github_url,
    twitter_url,
    availability_status,
    target_titles,
    target_company_stages
FROM public.candidate_profile;

-- Public view for experiences (excludes all "why_" fields and private context)
CREATE OR REPLACE VIEW public.experiences_public
WITH (security_invoker = on) AS
SELECT 
    id,
    candidate_id,
    company_name,
    title,
    title_progression,
    start_date,
    end_date,
    is_current,
    bullet_points,
    display_order
FROM public.experiences
ORDER BY display_order ASC, start_date DESC;

-- Public view for skills (excludes honest_notes, evidence)
CREATE OR REPLACE VIEW public.skills_public
WITH (security_invoker = on) AS
SELECT 
    id,
    candidate_id,
    skill_name,
    category,
    self_rating,
    years_experience
FROM public.skills;

-- 3. Create User Roles System
-- ============================================

-- Create role enum (if not exists)
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);

-- 4. Create Security Definer Functions
-- ============================================

-- Function to check if user has a specific role (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
        AND role = _role
    )
$$;

-- Convenience function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT public.has_role(auth.uid(), 'admin')
$$;

-- 5. Create RLS Policies for Base Tables
-- ============================================

-- candidate_profile policies
CREATE POLICY "Admins can select" 
    ON public.candidate_profile FOR SELECT 
    TO authenticated
    USING (public.is_admin());

CREATE POLICY "Admins can insert" 
    ON public.candidate_profile FOR INSERT 
    TO authenticated
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update" 
    ON public.candidate_profile FOR UPDATE 
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete" 
    ON public.candidate_profile FOR DELETE 
    TO authenticated
    USING (public.is_admin());

-- experiences policies
CREATE POLICY "Admins can select" 
    ON public.experiences FOR SELECT 
    TO authenticated
    USING (public.is_admin());

CREATE POLICY "Admins can insert" 
    ON public.experiences FOR INSERT 
    TO authenticated
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update" 
    ON public.experiences FOR UPDATE 
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete" 
    ON public.experiences FOR DELETE 
    TO authenticated
    USING (public.is_admin());

-- skills policies
CREATE POLICY "Admins can select" 
    ON public.skills FOR SELECT 
    TO authenticated
    USING (public.is_admin());

CREATE POLICY "Admins can insert" 
    ON public.skills FOR INSERT 
    TO authenticated
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update" 
    ON public.skills FOR UPDATE 
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete" 
    ON public.skills FOR DELETE 
    TO authenticated
    USING (public.is_admin());

-- gaps_weaknesses policies (fully private - admin only)
CREATE POLICY "Admins can select" 
    ON public.gaps_weaknesses FOR SELECT 
    TO authenticated
    USING (public.is_admin());

CREATE POLICY "Admins can insert" 
    ON public.gaps_weaknesses FOR INSERT 
    TO authenticated
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update" 
    ON public.gaps_weaknesses FOR UPDATE 
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete" 
    ON public.gaps_weaknesses FOR DELETE 
    TO authenticated
    USING (public.is_admin());

-- values_culture policies (fully private - admin only)
CREATE POLICY "Admins can select" 
    ON public.values_culture FOR SELECT 
    TO authenticated
    USING (public.is_admin());

CREATE POLICY "Admins can insert" 
    ON public.values_culture FOR INSERT 
    TO authenticated
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update" 
    ON public.values_culture FOR UPDATE 
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete" 
    ON public.values_culture FOR DELETE 
    TO authenticated
    USING (public.is_admin());

-- faq_responses policies (fully private - admin only)
CREATE POLICY "Admins can select" 
    ON public.faq_responses FOR SELECT 
    TO authenticated
    USING (public.is_admin());

CREATE POLICY "Admins can insert" 
    ON public.faq_responses FOR INSERT 
    TO authenticated
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update" 
    ON public.faq_responses FOR UPDATE 
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete" 
    ON public.faq_responses FOR DELETE 
    TO authenticated
    USING (public.is_admin());

-- ai_instructions policies (fully private - admin only)
CREATE POLICY "Admins can select" 
    ON public.ai_instructions FOR SELECT 
    TO authenticated
    USING (public.is_admin());

CREATE POLICY "Admins can insert" 
    ON public.ai_instructions FOR INSERT 
    TO authenticated
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update" 
    ON public.ai_instructions FOR UPDATE 
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete" 
    ON public.ai_instructions FOR DELETE 
    TO authenticated
    USING (public.is_admin());

-- user_roles policies
CREATE POLICY "Users can read own role" 
    ON public.user_roles FOR SELECT 
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Admins can manage roles"
    ON public.user_roles FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 6. Grant Public Access to Views
-- ============================================
GRANT SELECT ON public.candidate_profile_public TO anon, authenticated;
GRANT SELECT ON public.experiences_public TO anon, authenticated;
GRANT SELECT ON public.skills_public TO anon, authenticated;
```

## Step 2: Assign Admin Role

After running the migration, assign the admin role to your user:

```sql
-- Find your user ID
SELECT id, email FROM auth.users;

-- Assign admin role (replace with your actual user ID)
INSERT INTO public.user_roles (user_id, role)
VALUES ('your-user-id-here', 'admin');

-- Or use email to find and assign:
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' FROM auth.users WHERE email = 'your-email@example.com';
```

## Security Summary

| User Type | Profile | Experiences | Skills | Gaps/Values/FAQ/AI |
|-----------|---------|-------------|--------|---------------------|
| Anonymous | View (limited) | View (limited) | View (limited) | ❌ No access |
| Authenticated | View (limited) | View (limited) | View (limited) | ❌ No access |
| Admin | ✅ Full access | ✅ Full access | ✅ Full access | ✅ Full access |
| Service Role | ✅ Full access | ✅ Full access | ✅ Full access | ✅ Full access |

## What's Protected

**Hidden from public:**
- Email, salary range
- "Why joined/left" reasons
- Honest notes, evidence
- All gaps/weaknesses
- Values/culture preferences
- FAQ responses
- AI instructions

**Visible to public:**
- Name, title, elevator pitch
- Career narrative, what you're looking for
- Location, remote preference
- Social links
- Company names, titles, dates
- Achievement bullets
- Skill names and categories
