import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ⚠️ REPLACE THESE WITH YOUR SUPABASE CREDENTIALS
// Get them from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api
const SUPABASE_URL: string = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY: string = 'YOUR_SUPABASE_ANON_KEY';

const isConfigured = SUPABASE_URL !== 'YOUR_SUPABASE_URL' &&
                     SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY' &&
                     SUPABASE_URL.startsWith('http');

export const supabaseConfigured = isConfigured;

// Create client only if configured, otherwise create a dummy that won't crash
export const supabase: SupabaseClient = isConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : createClient('https://placeholder.supabase.co', 'placeholder-key');

if (!isConfigured) {
  console.warn('⚠️ Supabase credentials not configured. Please update src/integrations/supabase/client.ts');
}
