
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isUrlValid = (url) => url && url.startsWith('http');

// Only create the client if the keys are available and valid
// This allows the app to function (in local-only mode) if the user hasn't set up the backend yet.
export const supabase = (isUrlValid(supabaseUrl) && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

if (supabaseUrl && !isUrlValid(supabaseUrl)) {
  console.warn('Supabase URL is invalid. Cloud sync disabled. Check your .env file.');
}
