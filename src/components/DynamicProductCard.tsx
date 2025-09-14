import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Calculator, Plus, Minus } from 'lucide-react';

// Product interface matching productos table
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

interface DynamicProductCardProps {
  product: Product;
  className?: string;
}

// Local storage for price estimation
const ESTIMATION_KEY = 'magiabuena_price_estimation';

const getEstimation = () => {
  try {
    return JSON.parse(localStorage.getItem(ESTIMATION_KEY) || '[]');
  } catch {
    return [];
  }
};

const saveEstimation = (items: any[]) => {
  localStorage.setItem(ESTIMATION_KEY, JSON.stringify(items));
};

type WeightType = 'gramo' | 'media_onza' | 'onza' | 'unidad';

const DynamicProductCard = ({ product, className = '' }: DynamicProductCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState<WeightType>(() => {
    // Default to the first available option
    if (product.precio_gramo) return 'gramo';
    if (product.precio_unidad) return 'unidad';
    if (product.precio_onza) return 'onza';
    if (product.precio_media_onza) return 'media_onza';
    return 'unidad';
  });

  const isFlores = product.categoria === 'flores';
  
  const getDescription = () => {
    return 'Producto premium de alta calidad';
  };

  // Get main price display
  const getMainPrice = () => {
    if (isFlores) {
      // For flores, show the most relevant price
      if (product.precio_gramo) {
        return `$${(product.precio_gramo || 0).toLocaleString('es-MX')}/g`;
      }
      if (product.precio_onza) {
        return `$${(product.precio_onza || 0).toLocaleString('es-MX')}/oz`;
      }
    } else {
      // For others, main price is unidad
      return `$${(product.precio_unidad || 0).toLocaleString('es-MX')}`;
    }
    return `$${(product.precio_unidad || 0).toLocaleString('es-MX')}`;
  };

  const getCurrentPrice = () => {
    switch (selectedWeight) {
      case 'onza':
        return product.precio_onza || 0;
      case 'media_onza':
        return product.precio_media_onza || 0;
      case 'gramo':
        return (product.precio_gramo || 0) * quantity;
      case 'unidad':
      default:
        return product.precio_unidad || 0;
    }
  };

  const getQuantity = () => {
    if (selectedWeight === 'gramo') return quantity;
    return 1;
  };

  const addToEstimation = () => {
    const unitPrice = selectedWeight === 'gramo' ? (product.precio_gramo || 0) : getCurrentPrice();
    const itemQuantity = getQuantity();
    
    const estimation = getEstimation();
    const newItem = {
      id: product.id + '_' + selectedWeight,
      name: product.nombre,
      option: selectedWeight,
      quantity: itemQuantity,
      unitPrice: unitPrice,
      total: getCurrentPrice()
    };
    
    const existingIndex = estimation.findIndex((item: any) => item.id === newItem.id);
    if (existingIndex >= 0) {
      estimation[existingIndex].quantity += newItem.quantity;
      estimation[existingIndex].total = estimation[existingIndex].quantity * estimation[existingIndex].unitPrice;
    } else {
      estimation.push(newItem);
    }
    
    saveEstimation(estimation);
    setIsOpen(false);
    alert(`Agregado al cálculo: ${product.nombre} - ${selectedWeight}`);
  };

  const getWeightOptions = () => {
    const options = [];
    if (isFlores) {
      if (product.precio_gramo) options.push({ key: 'gramo', label: 'GRAMO', price: product.precio_gramo });
      if (product.precio_media_onza) options.push({ key: 'media_onza', label: 'Media Onza', price: product.precio_media_onza });
      if (product.precio_onza) options.push({ key: 'onza', label: 'Onza', price: product.precio_onza });
    } else {
      if (product.precio_unidad) options.push({ key: 'unidad', label: 'Unidad', price: product.precio_unidad });
    }
    return options;
  };

  return (
    <>
      <div 
        className={`glass-card glass-hover rounded-glass p-6 cursor-pointer group transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/10 ${className}`}
        onClick={() => setIsOpen(true)}
      >
        {/* Product Image */}
        <div className="relative mb-4 overflow-hidden rounded-glass">
          <div className="w-full h-48 bg-gradient-to-br from-glass/40 to-glass/20 flex items-center justify-center">
            <div className="text-muted-foreground text-sm">Sin imagen</div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-glass-shadow/60 to-transparent" />
          
          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <Badge 
              variant="secondary"
              className="text-xs glass-card text-foreground/80"
            >
              {product.categoria}
            </Badge>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {product.nombre}
          </h3>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {getDescription()}
          </p>

          {/* Price */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-2xl font-bold text-primary">
              {getMainPrice()}
              {isFlores && product.precio_onza && <span className="text-sm text-muted-foreground ml-1">/onza</span>}
            </div>
            <Button 
              size="sm" 
              className="glass-button transform transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 hover:bg-primary/20 hover:border-primary/50"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(true);
              }}
              disabled={!product.disponible}
            >
              <Calculator className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:rotate-12" />
              {product.disponible ? 'Ver' : 'Agotado'}
            </Button>
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="glass-card border-glass-border/30 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary">
              {product.nombre}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="relative rounded-glass overflow-hidden">
                <div className="w-full h-64 md:h-80 bg-gradient-to-br from-glass/40 to-glass/20 flex items-center justify-center">
                  <div className="text-muted-foreground">Sin imagen disponible</div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-glass-shadow/40 to-transparent" />
              </div>

              {/* Category */}
              <div className="flex flex-wrap gap-2">
                <Badge 
                  variant="secondary"
                  className="glass-card"
                >
                  {product.categoria}
                </Badge>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              {/* Description */}
              <div className="glass-card rounded-glass p-4">
                <h4 className="font-semibold text-foreground mb-2">Descripción</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {getDescription()}
                </p>
              </div>

              {/* Pricing Options */}
              {product.disponible && getWeightOptions().length > 0 && (
                <div>
                  <h4 className="font-semibold text-foreground mb-3">
                    {isFlores ? 'Selecciona Presentación' : 'Opciones de Compra'}
                  </h4>
                  <div className={`grid gap-2 ${isFlores ? 'grid-cols-3' : 'grid-cols-2'}`}>
                    {getWeightOptions().map((option) => (
                      <button
                        key={option.key}
                        onClick={() => {
                          setSelectedWeight(option.key as WeightType);
                          if (option.key !== 'gramo') {
                            setQuantity(1);
                          }
                        }}
                        className={`glass-card rounded-glass p-3 text-center transition-all duration-300 border transform hover:scale-105 active:scale-95 hover:shadow-lg ${
                          selectedWeight === option.key
                            ? 'border-primary bg-primary/10 shadow-primary/20'
                            : 'border-glass-border/30 hover:border-primary/50 hover:bg-primary/5'
                        } ${isFlores ? 'text-xs' : ''}`}
                      >
                        <div className={`font-medium text-foreground ${isFlores ? 'text-xs' : 'text-sm'}`}>
                          {option.label}
                        </div>
                        <div className={`text-primary font-bold ${isFlores ? 'text-xs' : 'text-sm'}`}>
                          {option.key === 'gramo' 
                            ? `$${(option.price || 0).toLocaleString('es-MX')}/g`
                            : `$${(option.price || 0).toLocaleString('es-MX')}`
                          }
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selection for Grams */}
              {product.disponible && selectedWeight === 'gramo' && (
                <div className="glass-card rounded-glass p-4">
                  <h4 className="font-semibold text-foreground mb-3">Cantidad en Gramos</h4>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="glass-card border-glass-border/30 transform transition-all duration-200 hover:scale-110 active:scale-95 hover:bg-primary/10"
                    >
                      <Minus className="w-4 h-4 transition-transform duration-200 hover:rotate-90" />
                    </Button>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-20 text-center glass-card border-glass-border/30"
                      min="1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                      className="glass-card border-glass-border/30 transform transition-all duration-200 hover:scale-110 active:scale-95 hover:bg-primary/10"
                    >
                      <Plus className="w-4 h-4 transition-transform duration-200 hover:rotate-90" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Precio por gramo: ${(product.precio_gramo || 0).toLocaleString('es-MX')}
                  </p>
                </div>
              )}

              {/* Price and Actions */}
              {product.disponible && getWeightOptions().length > 0 && (
                <div className="glass-card rounded-glass p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {selectedWeight === 'gramo' ? `Total (${quantity}g)` : 
                       selectedWeight === 'media_onza' ? 'Precio (Media Onza)' :
                       selectedWeight === 'onza' ? 'Precio (Onza)' :
                       'Precio'}
                    </span>
                    <span className="text-3xl font-bold text-primary">
                      ${getCurrentPrice().toLocaleString('es-MX')}
                    </span>
                  </div>
                  
                  <Button 
                    onClick={addToEstimation}
                    className="w-full glass-button h-12 text-base font-semibold transform transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-primary/20"
                  >
                    <Calculator className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12" />
                    Agregar a Estimación
                  </Button>
                  
                  <p className="text-xs text-muted-foreground text-center">
                    * Esto es solo una estimación de precios, no una compra real
                  </p>
                </div>
              )}

              {/* Unavailable Notice */}
              {!product.disponible && (
                <div className="glass-card rounded-glass p-4 text-center">
                  <Badge variant="destructive" className="text-lg px-4 py-2 mb-4">
                    Producto Agotado
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Este producto no está disponible actualmente. Contáctanos para más información.
                  </p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DynamicProductCard;