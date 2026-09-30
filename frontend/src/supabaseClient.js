import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://flzwcwovvzwhcqwkwvny.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_m-D16RNpI3e9ixEWhOzviQ_LewOmULK';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('placeholder')
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Supabase client configured for frontend authentication and database access