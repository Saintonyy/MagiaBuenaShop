import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import DynamicProductCard from '@/components/DynamicProductCard';
import PagedCatalog from '@/components/PagedCatalog';
import ProductFilters from '@/components/ProductFilters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { fetchCategorias, fetchProductos } from '@/services/catalogRepo';
import { Search, Loader2 } from 'lucide-react';
import logoBanner from '@/assets/logo-banner.png';

interface Product {
  id: string;
  nombre: string;
  categoria: string;
  precio_unidad?: number;
  precio_gramo?: number;
  precio_onza?: number;
  precio_media_onza?: number;
  disponible: boolean;
  cantidad_disponible?: number;
}

interface Filters {
  sortBy: string;
  category: string;
}

const DynamicCatalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(category || 'all');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    sortBy: 'name',
    category: selectedCategory
  });

  // Optimized scroll listener with passive and debounce
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        // Scroll handling logic if needed
      }, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Sync selected category with URL params
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    if (urlCategory && urlCategory !== selectedCategory) {
      setSelectedCategory(urlCategory);
    } else if (!urlCategory && selectedCategory !== 'all') {
      setSelectedCategory('all');
    }
  }, [searchParams]);

  // Fetch categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategorias();
        
        const uniqueCategories = [...new Set(data?.map(item => item.categoria))];
        const categoryList = uniqueCategories.filter(Boolean) || [];
        setCategories(['all', 'sugeridos', ...categoryList]);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories(['all', 'sugeridos']);
      }
    };

    loadCategories();
  }, []);

  // Fetch products
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        let productsData;
        
        // Filter by category if not 'all' or 'sugeridos'
        if (selectedCategory !== 'all' && selectedCategory !== 'sugeridos') {
          productsData = await fetchProductos({ categoria: selectedCategory });
        } else {
          productsData = await fetchProductos();
        }
        
        // Filter by search term if provided
        let productsToShow = productsData || [];
        if (searchTerm) {
          productsToShow = productsToShow.filter(product => 
            product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        // Filter for "sugeridos" - show first 8 products as suggested
        if (selectedCategory === 'sugeridos') {
          productsToShow = productsToShow.slice(0, 8);
        }
        
        setProducts(productsToShow);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [selectedCategory, searchTerm]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low': {
          const priceA = a.precio_unidad || a.precio_onza || a.precio_gramo || 0;
          const priceB = b.precio_unidad || b.precio_onza || b.precio_gramo || 0;
          return priceA - priceB;
        }
        case 'price-high': {
          const priceA2 = a.precio_unidad || a.precio_onza || a.precio_gramo || 0;
          const priceB2 = b.precio_unidad || b.precio_onza || b.precio_gramo || 0;
          return priceB2 - priceA2;
        }
        case 'name':
        default:
          return a.nombre.localeCompare(b.nombre);
      }
    });

    return filtered;
  }, [products, filters]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    const newSearchParams = new URLSearchParams(searchParams);
    if (cat === 'all') {
      newSearchParams.delete('category');
    } else {
      newSearchParams.set('category', cat);
    }
    setSearchParams(newSearchParams);
  };

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const getCategoryDisplayName = (cat: string) => {
    if (cat === 'all') return 'Todos';
    if (cat === 'sugeridos') return 'Sugeridos';
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 scroll-area pb-24 sm:pb-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center justify-center mb-6">
            <img 
              src={logoBanner} 
              alt="Magia Buena Banner" 
              className="h-16 w-auto object-contain opacity-80"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-center glass-shine-effect">
            Catálogo
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-center">
            Explora nuestra selección premium de productos de cannabis y parafernalia.
            Calidad garantizada y entrega segura.
          </p>
        </div>

        {/* Filters */}
        <div className="liquid-card p-6 mb-16 lg:mb-8 animate-fade-in-up relative liquid-animation" style={{ animationDelay: '0.1s' }}>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Buscar productos, categorías, descripciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 liquid-card border-glass-border/30 bg-glass/20 glass-shine-effect"
                />
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center space-x-4">
              <ProductFilters
                onFiltersChange={handleFiltersChange}
                categories={categories}
                selectedCategory={selectedCategory}
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3 mt-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`liquid-card p-3 transition-all duration-500 glass-shine-effect ${
                  selectedCategory === cat
                    ? 'border-primary bg-primary/10 text-primary liquid-animation'
                    : 'border-glass-border/30 text-foreground/80 hover:border-primary/50 liquid-ripple'
                }`}
              >
                <span className="font-medium">{getCategoryDisplayName(cat)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <p className="text-muted-foreground">
            Mostrando {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''}
            {selectedCategory !== 'all' && ` en ${getCategoryDisplayName(selectedCategory)}`}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Cargando productos...</span>
          </div>
        )}

        {/* Products Grid */}
        {!loading && filteredProducts.length > 0 ? (
          <PagedCatalog
            items={filteredProducts}
            itemsPerPage={6}
            className="animate-fade-in-up"
          />
        ) : !loading && (
          <div className="liquid-card p-12 text-center animate-fade-in-up liquid-animation" style={{ animationDelay: '0.3s' }}>
            <div className="w-16 h-16 mx-auto mb-4 bg-glass/20 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No se encontraron productos
            </h3>
            <p className="text-muted-foreground">
              Intenta con otros términos de búsqueda o categorías diferentes.
            </p>
            <Button 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setFilters({
                  sortBy: 'name',
                  category: 'all'
                });
              }}
              className="glass-button-interactive mt-4 liquid-ripple"
            >
              Limpiar filtros
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DynamicCatalog;