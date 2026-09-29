import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const isSupabaseConfigured = Boolean(
  process.env.REACT_APP_SUPABASE_URL &&
  process.env.REACT_APP_SUPABASE_ANON_KEY &&
  !process.env.REACT_APP_SUPABASE_URL.includes('placeholder')
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Supabase client configured for frontend authentication and database access