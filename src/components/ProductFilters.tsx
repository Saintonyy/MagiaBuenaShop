import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Filter, X } from 'lucide-react';

interface FilterProps {
  onFiltersChange: (filters: {
    priceRange: [number, number];
    thcRange: [number, number];
    sortBy: string;
    category: string;
  }) => void;
  categories: string[];
  selectedCategory: string;
}

const ProductFilters = ({ onFiltersChange, categories, selectedCategory }: FilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [thcRange, setThcRange] = useState<[number, number]>([0, 35]);
  const [sortBy, setSortBy] = useState('name');

  const handleFilterChange = () => {
    onFiltersChange({
      priceRange,
      thcRange,
      sortBy,
      category: selectedCategory
    });
  };

  const resetFilters = () => {
    setPriceRange([0, 5000]);
    setThcRange([0, 35]);
    setSortBy('name');
    onFiltersChange({
      priceRange: [0, 5000],
      thcRange: [0, 35],
      sortBy: 'name',
      category: selectedCategory
    });
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="glass-button-interactive border-glass-border/30 hover:border-primary/50 transition-bounce"
      >
        <Filter className="w-4 h-4 mr-2" />
        Filtros
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 glass-card-animated mobile-dropdown border border-glass-border/30 rounded-2xl shadow-glass p-6 z-[100] max-h-96 overflow-y-auto animate-scale-in">
          {/* Arrow pointer */}
          <div className="absolute top-[-8px] right-[18px] w-3 h-3 rotate-45 bg-glass-bg border-l border-t border-glass-border/30"></div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-foreground text-lg">Filtros</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0 glass-button-interactive rounded-full transition-bounce"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-6">
            {/* Sort By */}
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">
                Ordenar por
              </label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="glass-card border-glass-border/30 transition-bounce hover:border-primary/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card-animated mobile-dropdown border-glass-border/30 rounded-xl">
                  <SelectItem value="name">Nombre</SelectItem>
                  <SelectItem value="price-low">Precio (menor a mayor)</SelectItem>
                  <SelectItem value="price-high">Precio (mayor a menor)</SelectItem>
                  <SelectItem value="thc-high">THC (mayor a menor)</SelectItem>
                  <SelectItem value="thc-low">THC (menor a mayor)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price Range */}
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">
                Rango de Precio: ${priceRange[0]} - ${priceRange[1]}
              </label>
              <div className="glass-card rounded-xl p-4 bg-glass/10">
                <Slider
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  max={5000}
                  min={0}
                  step={50}
                  className="mb-2"
                />
              </div>
            </div>

            {/* THC Range */}
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">
                Rango de THC: {thcRange[0]}% - {thcRange[1]}%
              </label>
              <div className="glass-card rounded-xl p-4 bg-glass/10">
                <Slider
                  value={thcRange}
                  onValueChange={(value) => setThcRange(value as [number, number])}
                  max={35}
                  min={0}
                  step={1}
                  className="mb-2"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button
                onClick={handleFilterChange}
                className="glass-button flex-1 transition-bounce"
                size="sm"
              >
                Aplicar
              </Button>
              <Button
                onClick={resetFilters}
                variant="outline"
                className="glass-card border-glass-border/30 transition-bounce hover:border-primary/50"
                size="sm"
              >
                Limpiar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilters;