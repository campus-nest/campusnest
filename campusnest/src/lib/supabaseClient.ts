import { createClient, SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    "Supabase is not configured. Missing environment variables.",
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {

  if (!client) {
    client = supabase;
  }

  return client;
}
