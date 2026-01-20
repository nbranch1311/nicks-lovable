import { createClient } from '@supabase/supabase-js';

// These are public/publishable keys - safe to include in client code
const SUPABASE_URL = 'https://nsymhodgcyjhltpwdghp.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_npiMj0qynxkmLLV5hwhgFA_KKwaKgDy';

export const isSupabaseConfigured = true;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
