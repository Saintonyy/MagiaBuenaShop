import { supabase } from './lib/supabaseClient';

export async function devSmoke() {
  try {
    const a = await supabase.from('v_categorias').select('*').limit(3);
    const b = await supabase.from('v_productos_publicos').select('*').limit(3);
    if (a.error) throw a.error;
    if (b.error) throw b.error;
    console.log('[SMOKE] cats:', a.data?.length ?? 0, 'prods:', b.data?.length ?? 0);
  } catch (e) { console.error('[SMOKE] fallo:', e); }
}