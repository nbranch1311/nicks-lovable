import { createClient, SupabaseClient } from '@supabase/supabase-js';

// These are public/publishable keys - safe to include in client code
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Fallback check for legacy key name
const SUPABASE_KEY = SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase is properly configured
export const isSupabaseConfigured = !!(SUPABASE_URL && SUPABASE_KEY);

if (!isSupabaseConfigured) {
  console.warn('Supabase credentials not found. Backend features (AI chat, JD analyzer) require Cloud to be enabled.');
}

// Create a mock client that returns helpful errors when Supabase isn't configured
const createMockClient = (): SupabaseClient => {
  const notConfiguredError = new Error('Cloud backend is not enabled. Please enable Cloud to use this feature.');
  
  return {
    functions: {
      invoke: async () => {
        throw notConfiguredError;
      }
    }
  } as unknown as SupabaseClient;
};

export const supabase = isSupabaseConfigured 
  ? createClient(SUPABASE_URL!, SUPABASE_KEY!)
  : createMockClient();
