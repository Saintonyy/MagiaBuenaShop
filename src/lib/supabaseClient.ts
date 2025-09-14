import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL?.trim();
const key = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

if (!url) throw new Error('VITE_SUPABASE_URL faltante');
if (!key) throw new Error('VITE_SUPABASE_ANON_KEY faltante');

export const supabase = createClient(url, key, {
  db: { schema: 'public' },
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
});