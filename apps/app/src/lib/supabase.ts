import { createClient } from '@supabase/supabase-js';
import type { Database } from '@weven/core';

// EXPO_PUBLIC_ variables are inlined at build time and ship in the app bundle,
// so only the public URL and publishable key may live here.
const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !publishableKey) {
  throw new Error(
    'Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY. Copy apps/app/.env.example to apps/app/.env.local.',
  );
}

export const supabase = createClient<Database>(url, publishableKey, {
  auth: {
    // No sign-in yet. When auth lands, add platform session storage here.
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});
