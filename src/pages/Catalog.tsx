import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import ProductFilters from '@/components/ProductFilters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { products } from '@/data/products';
import { Search, Filter, Grid3X3, List } from 'lucide-react';

const Catalog = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(category || 'all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    priceRange: [0, 5000] as [number, number],
    thcRange: [0, 35] as [number, number],
    sortBy: 'name',
    category: selectedCategory
  });

  const categories = [
    { id: 'all', name: 'Todos', count: products.length },
    { id: 'flores', name: 'Flores', count: products.filter(p => p.category === 'flores').length },
    { id: 'pre-rolls', name: 'Pre-Rolls', count: products.filter(p => p.category === 'pre-rolls').length },
    { id: 'parafernalia', name: 'Parafernalia', count: products.filter(p => p.category === 'parafernalia').length },
  ];

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.strain.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    // Apply price filter
    filtered = filtered.filter(product => {
      const price = product.price || 0;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        case 'thc-high':
          return (b.thc || 0) - (a.thc || 0);
        case 'thc-low':
          return (a.thc || 0) - (b.thc || 0);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [selectedCategory, searchTerm, filters]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Catálogo
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Explora nuestra selección premium de productos de cannabis y parafernalia.
            Calidad garantizada y entrega segura.
          </p>
        </div>

        {/* Filters */}
        <div className="glass-card rounded-glass p-6 mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Buscar productos, cepas, efectos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 glass-card border-glass-border/30 bg-glass/20"
                />
              </div>
            </div>

            {/* View Mode */}
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

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3 mt-6">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`glass-card rounded-glass px-4 py-2 transition-glass ${
                  selectedCategory === cat.id
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-glass-border/30 text-foreground/80 hover:border-primary/50'
                }`}
              >
                <span className="font-medium">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <p className="text-muted-foreground">
            Mostrando {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''}
            {selectedCategory !== 'all' && ` en ${categories.find(c => c.id === selectedCategory)?.name}`}
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div 
            className={`animate-fade-in-up ${
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
                : 'space-y-4'
            }`}
            style={{ animationDelay: '0.3s' }}
          >
            {filteredProducts.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product}
                className={`animate-fade-in-up ${viewMode === 'list' ? 'flex-row' : ''}`}
              />
            ))}
          </div>
        ) : (
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

export default Catalog;