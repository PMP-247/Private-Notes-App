import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
//export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  //auth: {
   // persistSession: false, // Prevents Supabase from using LocalStorage
  //  autoRefreshToken: false, // Backend handles token lifecycle
  //  detectSessionInUrl: false // Stops Supabase from grabbing tokens from the URL
 // }
