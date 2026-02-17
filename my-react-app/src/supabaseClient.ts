import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Detailed logging to help us find the gap
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("DEBUG: URL found:", !!supabaseUrl);
  console.error("DEBUG: KEY found:", !!supabaseAnonKey);
  throw new Error('Missing VITE_ environment variables for Supabase!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);