const { createClient } = require("@supabase/supabase-js");
const path = require("path");
// Try backend/.env first, then root .env
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
require("dotenv").config({ path: path.join(__dirname, "..", "..", ".env") });

const supabaseUrl = (process.env.SUPABASE_URL || "").trim();
const supabaseAnonKey = (process.env.SUPABASE_ANON_KEY || "").trim();

const isConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes("your_supabase_url") &&
  !supabaseUrl.includes("your-project") &&
  !supabaseAnonKey.includes("your_supabase_anon") &&
  !supabaseAnonKey.includes("your-supabase-anon")
);

if (!isConfigured) {
  console.log("ℹ️  Supabase credentials not configured in backend/.env — using local JSON storage.");
}

const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

module.exports = supabase;


