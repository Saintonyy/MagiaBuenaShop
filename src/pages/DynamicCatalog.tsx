import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import DynamicProductCard from '@/components/DynamicProductCard';
import ProductFilters from '@/components/ProductFilters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { fetchCategorias, fetchProductos } from '@/services/catalogRepo';
import { Search, Grid3X3, List, Loader2 } from 'lucide-react';
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
  priceRange: [number, number];
  thcRange: [number, number];
  sortBy: string;
  category: string;
}

const DynamicCatalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(category || 'all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    priceRange: [0, 5000],
    thcRange: [0, 35],
    sortBy: 'name',
    category: selectedCategory
  });

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

    // Apply price filter
    filtered = filtered.filter(product => {
      const price = product.precio_unidad || product.precio_gramo || 0;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          return (a.precio_unidad || a.precio_gramo || 0) - (b.precio_unidad || b.precio_gramo || 0);
        case 'price-high':
          return (b.precio_unidad || b.precio_gramo || 0) - (a.precio_unidad || a.precio_gramo || 0);
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

  const getCategoryDisplayName = (cat: string) => {
    if (cat === 'all') return 'Todos';
    if (cat === 'sugeridos') return 'Sugeridos';
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center justify-center mb-6">
            <img 
              src={logoBanner} 
              alt="Magia Buena Banner" 
              className="h-16 w-auto object-contain opacity-80"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-center">
            Catálogo
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-center">
            Explora nuestra selección premium de productos de cannabis y parafernalia.
            Calidad garantizada y entrega segura.
          </p>
        </div>

        {/* Filters */}
        <div className="glass-card rounded-glass p-6 mb-16 lg:mb-8 animate-fade-in-up relative" style={{ animationDelay: '0.1s' }}>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Buscar productos, categorías, descripciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 glass-card border-glass-border/30 bg-glass/20"
                />
              </div>
            </div>

            {/* View Mode and Filters */}
            <div className="flex items-center space-x-4">
              <ProductFilters
                onFiltersChange={setFilters}
                categories={categories}
                selectedCategory={selectedCategory}
              />
              
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'glass-button' : 'glass-card border-glass-border/30'}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'glass-button' : 'glass-card border-glass-border/30'}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3 mt-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`glass-card rounded-glass px-4 py-2 transition-glass ${
                  selectedCategory === cat
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-glass-border/30 text-foreground/80 hover:border-primary/50'
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
          <div 
            className={`animate-fade-in-up ${
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
                : 'space-y-4'
            }`}
            style={{ animationDelay: '0.3s' }}
          >
            {filteredProducts.map((product) => (
              <DynamicProductCard 
                key={product.id} 
                product={product}
                className={viewMode === 'list' ? 'flex-row' : ''}
              />
            ))}
          </div>
        ) : !loading && (
          <div className="glass-card rounded-glass p-12 text-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
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
                  priceRange: [0, 5000],
                  thcRange: [0, 35],
                  sortBy: 'name',
                  category: 'all'
                });
              }}
              className="glass-button mt-4"
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