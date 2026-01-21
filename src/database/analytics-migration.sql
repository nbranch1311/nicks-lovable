-- Analytics Migration: Visitor Tracking & Download Counting
-- Run this in your Supabase SQL Editor

-- 1. Visitor sessions table (unique visitor tracking)
CREATE TABLE IF NOT EXISTS public.visitor_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT UNIQUE NOT NULL,
  first_seen TIMESTAMPTZ DEFAULT now() NOT NULL,
  last_seen TIMESTAMPTZ DEFAULT now() NOT NULL,
  visit_count INTEGER DEFAULT 1 NOT NULL
);

-- 2. Asset downloads table (download counter per asset)
CREATE TABLE IF NOT EXISTS public.asset_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_key TEXT UNIQUE NOT NULL,
  download_count INTEGER DEFAULT 0 NOT NULL,
  last_downloaded TIMESTAMPTZ
);

-- 3. Download events table (audit trail)
CREATE TABLE IF NOT EXISTS public.download_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_key TEXT NOT NULL,
  visitor_id TEXT,
  downloaded_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_visitor_id ON public.visitor_sessions(visitor_id);
CREATE INDEX IF NOT EXISTS idx_download_events_asset_key ON public.download_events(asset_key);
CREATE INDEX IF NOT EXISTS idx_download_events_downloaded_at ON public.download_events(downloaded_at);

-- Enable RLS on analytics tables
ALTER TABLE public.visitor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.download_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for visitor_sessions
CREATE POLICY "Allow public insert visitor sessions"
  ON public.visitor_sessions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public update own visitor session"
  ON public.visitor_sessions FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public select visitor count"
  ON public.visitor_sessions FOR SELECT
  TO anon, authenticated
  USING (true);

-- RLS Policies for asset_downloads
CREATE POLICY "Allow public read asset downloads"
  ON public.asset_downloads FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public insert asset downloads"
  ON public.asset_downloads FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public update asset downloads"
  ON public.asset_downloads FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for download_events
CREATE POLICY "Allow public insert download events"
  ON public.download_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public read download events"
  ON public.download_events FOR SELECT
  TO anon, authenticated
  USING (true);

-- RPC function for atomic download increment
CREATE OR REPLACE FUNCTION public.increment_download(p_asset_key TEXT, p_visitor_id TEXT DEFAULT NULL)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_count INTEGER;
BEGIN
  INSERT INTO public.asset_downloads (asset_key, download_count, last_downloaded)
  VALUES (p_asset_key, 1, now())
  ON CONFLICT (asset_key)
  DO UPDATE SET 
    download_count = asset_downloads.download_count + 1,
    last_downloaded = now()
  RETURNING download_count INTO new_count;
  
  INSERT INTO public.download_events (asset_key, visitor_id)
  VALUES (p_asset_key, p_visitor_id);
  
  RETURN new_count;
END;
$$;

-- RPC function for upserting visitor session
CREATE OR REPLACE FUNCTION public.track_visitor(p_visitor_id TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSON;
  unique_count INTEGER;
BEGIN
  INSERT INTO public.visitor_sessions (visitor_id, first_seen, last_seen, visit_count)
  VALUES (p_visitor_id, now(), now(), 1)
  ON CONFLICT (visitor_id)
  DO UPDATE SET 
    last_seen = now(),
    visit_count = visitor_sessions.visit_count + 1;
  
  SELECT COUNT(*) INTO unique_count FROM public.visitor_sessions;
  
  RETURN json_build_object(
    'unique_visitors', unique_count,
    'visitor_id', p_visitor_id
  );
END;
$$;

-- Add resume_url column to candidate_profile
ALTER TABLE public.candidate_profile 
ADD COLUMN IF NOT EXISTS resume_url TEXT;

-- Create storage bucket for assets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'assets', 
  'assets', 
  true,
  10485760,
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies for assets bucket
CREATE POLICY "Public read assets"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'assets');

CREATE POLICY "Authenticated users can upload assets"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'assets');

CREATE POLICY "Authenticated users can update assets"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'assets')
  WITH CHECK (bucket_id = 'assets');

CREATE POLICY "Authenticated users can delete assets"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'assets');

-- Initialize the resume asset in downloads table
INSERT INTO public.asset_downloads (asset_key, download_count)
VALUES ('resume', 0)
ON CONFLICT (asset_key) DO NOTHING;
