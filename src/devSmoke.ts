import { supabase } from './lib/supabaseClient';

export async function devSmoke() {
  try {
    // Verificar v_productos_publicos
    const b = await supabase.from('v_productos_publicos').select('*').limit(5);
    if (b.error) throw b.error;
    
    console.log('[SMOKE] prods:', b.data?.length ?? 0);
    if (b.data && b.data.length > 0) {
      console.log('[SMOKE] primer producto:', b.data[0]);
    }
  } catch (e) { 
    console.error('[SMOKE] fallo:', e); 
    console.log('[SMOKE] Error - posiblemente la vista v_productos_publicos no existe o no tiene datos');
  }
}