import { supabase } from '../lib/supabaseClient';
import { products } from '../data/products';

// Función para transformar productos locales al formato de Supabase
function transformLocalProduct(product: any) {
  return {
    id: product.id,
    nombre: product.name,
    categoria: product.category,
    precio_unidad: product.price,
    precio_gramo: product.sizes?.find((s: any) => s.weight.includes('gramo'))?.price || 0,
    precio_media_onza: product.sizes?.find((s: any) => s.weight.includes('Media'))?.price || 0,
    precio_onza: product.price_onza || product.sizes?.find((s: any) => s.weight.includes('onza') && !s.weight.includes('Media'))?.price || 0,
    cantidad_disponible: product.available ? (Math.floor(Math.random() * 50) + 1) : 0,
    disponible: product.available,
    foto_url: product.image || null
  };
}

export async function fetchCategorias() {
  try {
    const { data, error } = await supabase
      .from('v_productos_publicos')
      .select('categoria')
      .not('categoria', 'is', null)
      .order('categoria');
    
    if (error || !data || data.length === 0) {
      console.log('💭 Usando categorías locales como fallback');
      // Usar datos locales como fallback
      const localCategories = [...new Set(products.map(p => p.category))];
      return localCategories.map(categoria => ({ categoria, productos_activos: 0, stock_total: 0 }));
    }
    
    // Obtener categorías únicas
    const uniqueCategories = [...new Set(data?.map(item => item.categoria) || [])];
    return uniqueCategories.map(categoria => ({ categoria, productos_activos: 0, stock_total: 0 }));
  } catch (error) {
    console.warn('⚠️ Error al obtener categorías de Supabase, usando datos locales:', error);
    const localCategories = [...new Set(products.map(p => p.category))];
    return localCategories.map(categoria => ({ categoria, productos_activos: 0, stock_total: 0 }));
  }
}

export async function fetchProductos(opts?: { categoria?: string, sortBy?: string }) {
  const { categoria, sortBy = 'price' } = opts ?? {};
  
  try {
    let q = supabase
      .from('v_productos_publicos')
      .select('id,nombre,categoria,precio_unidad,precio_gramo,precio_media_onza,precio_onza,cantidad_disponible,disponible');
    
    if (categoria && categoria.trim()) q = q.eq('categoria', categoria.trim());
    
    // Ordenamiento por defecto por precio (usando precio_onza como base para flores)
    if (sortBy === 'price') {
      q = q.order('precio_onza', { ascending: true, nullsFirst: false })
           .order('precio_media_onza', { ascending: true, nullsFirst: false })
           .order('nombre', { ascending: true });
    } else {
      q = q.order('nombre', { ascending: true });
    }
    
    const { data, error } = await q;
    
    if (error || !data || data.length === 0) {
      console.log('💭 Usando productos locales como fallback');
      // Usar datos locales como fallback
      let localProducts = products.map(transformLocalProduct);
      
      // Aplicar filtro de categoría si se especifica
      if (categoria && categoria.trim()) {
        localProducts = localProducts.filter(p => p.categoria === categoria.trim());
      }
      
      // Aplicar ordenamiento
      if (sortBy === 'price') {
        localProducts.sort((a, b) => {
          const priceA = a.precio_unidad || a.precio_onza || a.precio_gramo || 0;
          const priceB = b.precio_unidad || b.precio_onza || b.precio_gramo || 0;
          return priceA - priceB;
        });
      } else {
        localProducts.sort((a, b) => a.nombre.localeCompare(b.nombre));
      }
      
      return localProducts;
    }
    
    // Obtener fotos para los productos
    const { data: fotos, error: fotosError } = await supabase
      .from('v_productos_fotos')
      .select('id,link_foto');
    
    if (fotosError) {
      console.warn('⚠️ Error al obtener fotos:', fotosError);
    }
    
    // Combinar productos con sus fotos
    const productosConFotos = data.map(producto => {
      const foto = fotos?.find(f => f.id === producto.id);
      return {
        ...producto,
        foto_url: foto?.link_foto || null
      };
    });
    
    return productosConFotos;
  } catch (error) {
    console.warn('⚠️ Error al obtener productos de Supabase, usando datos locales:', error);
    
    // Usar datos locales como fallback
    let localProducts = products.map(transformLocalProduct);
    
    // Aplicar filtro de categoría si se especifica
    if (categoria && categoria.trim()) {
      localProducts = localProducts.filter(p => p.categoria === categoria.trim());
    }
    
    // Aplicar ordenamiento
    if (sortBy === 'price') {
      localProducts.sort((a, b) => {
        const priceA = a.precio_unidad || a.precio_onza || a.precio_gramo || 0;
        const priceB = b.precio_unidad || b.precio_onza || b.precio_gramo || 0;
        return priceA - priceB;
      });
    } else {
      localProducts.sort((a, b) => a.nombre.localeCompare(b.nombre));
    }
    
    return localProducts;
  }
}