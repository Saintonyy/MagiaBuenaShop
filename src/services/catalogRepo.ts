import { supabase } from '../lib/supabaseClient';

export async function fetchCategorias() {
  const { data, error } = await supabase
    .from('v_categorias')
    .select('categoria, productos_activos, stock_total')
    .order('categoria');
  if (error) throw error;
  return data ?? [];
}

export async function fetchProductos(opts?: { categoria?: string }) {
  const { categoria } = opts ?? {};
  let q = supabase
    .from('v_productos_publicos')
    .select('id,nombre,categoria,precio_unidad,precio_gramo,precio_media_onza,precio_onza,cantidad_disponible,disponible')
    .order('nombre', { ascending: true });
  if (categoria && categoria.trim()) q = q.eq('categoria', categoria.trim());
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}