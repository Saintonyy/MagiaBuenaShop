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
        className="glass-card border-glass-border/30 hover:border-primary/50"
      >
        <Filter className="w-4 h-4 mr-2" />
        Filtros
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 glass-card border border-glass-border/30 rounded-glass shadow-glass p-4 z-[60] max-h-96 overflow-y-auto
          before:absolute before:top-[-6px] before:right-4 before:w-3 before:h-3 before:rotate-45 before:bg-glass-bg before:border-l before:border-t before:border-glass-border/30">
          {/* Arrow pointer */}
          <div className="absolute top-[-7px] right-[18px] w-2 h-2 rotate-45 bg-glass-bg border-l border-t border-glass-border/30"></div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Filtros</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {/* Sort By */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Ordenar por
              </label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="glass-card border-glass-border/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card border-glass-border/30">
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
              <label className="text-sm font-medium text-foreground mb-2 block">
                Rango de Precio: ${priceRange[0]} - ${priceRange[1]}
              </label>
              <Slider
                value={priceRange}
                onValueChange={(value) => setPriceRange(value as [number, number])}
                max={5000}
                min={0}
                step={50}
                className="mb-2"
              />
            </div>

            {/* THC Range */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Rango de THC: {thcRange[0]}% - {thcRange[1]}%
              </label>
              <Slider
                value={thcRange}
                onValueChange={(value) => setThcRange(value as [number, number])}
                max={35}
                min={0}
                step={1}
                className="mb-2"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 pt-2">
              <Button
                onClick={handleFilterChange}
                className="glass-button flex-1"
                size="sm"
              >
                Aplicar
              </Button>
              <Button
                onClick={resetFilters}
                variant="outline"
                className="glass-card border-glass-border/30"
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