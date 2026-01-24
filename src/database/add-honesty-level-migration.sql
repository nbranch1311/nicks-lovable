-- Add honesty_level column to values_culture table
-- This controls how direct the AI should be when discussing limitations

ALTER TABLE public.values_culture 
ADD COLUMN IF NOT EXISTS honesty_level INTEGER DEFAULT 7;

-- Add constraint to ensure valid range (1-10)
ALTER TABLE public.values_culture
ADD CONSTRAINT honesty_level_range CHECK (honesty_level >= 1 AND honesty_level <= 10);

-- Update any existing rows to have the default value
UPDATE public.values_culture 
SET honesty_level = 7 
WHERE honesty_level IS NULL;
