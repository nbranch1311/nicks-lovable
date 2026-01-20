import { createClient } from '@supabase/supabase-js';

// These are public/publishable keys - safe to include in client code
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Fallback check for legacy key name
const SUPABASE_KEY = SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn('Supabase credentials not found. Some features may not work.');
}

export const supabase = createClient(
  SUPABASE_URL || '',
  SUPABASE_KEY || ''
);
