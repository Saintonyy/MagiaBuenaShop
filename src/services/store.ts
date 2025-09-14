// DEPRECATED (redirigido a catalogRepo)
export { fetchCategorias, fetchProductos } from './catalogRepo';

// Código original mantenido para referencia:
// import { supabase } from '../lib/supabaseClient';
// export async function fetchCategorias() {
//   const { data, error } = await supabase
//     .from('v_categorias')
//     .select('*');
//   if (error) throw error;
//   return data ?? [];
// }
// export async function fetchProductos({ categoria }: { categoria?: string }) {
//   let query = supabase
//     .from('v_productos_publicos')
//     .select('id,nombre,categoria,precio_unidad,precio_gramo,precio_media_onza,precio_onza,cantidad_disponible,disponible')
//     .order('nombre', { ascending: true });
//   if (categoria && categoria.trim() !== '') {
//     query = query.eq('categoria', categoria.trim());
//   }
//   const { data, error } = await query;
//   if (error) throw error;
//   return data ?? [];
// }