import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Calculator, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

// Product interface matching productos table
interface Product {
  id: string;
  nombre: string;
  categoria: string;
  precio_unidad?: number;
  precio_gramo?: number;
  precio_onza?: number;
  precio_media_onza?: number;
  precio_pieza?: number;
  disponible: boolean;
  cantidad_disponible?: number;
  foto_url?: string | null;
}

interface DynamicProductCardProps {
  product: Product;
  className?: string;
}

type PriceType = 'gramo' | 'media_onza' | 'onza' | 'unidad' | 'pieza';

const DynamicProductCard = ({ product, className = '' }: DynamicProductCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedPrice, setSelectedPrice] = useState<PriceType>(() => {
    // Default to the first available option
    if (product.categoria === 'Flores') {
      if (product.precio_gramo) return 'gramo';
      if (product.precio_onza) return 'onza';
      if (product.precio_media_onza) return 'media_onza';
    } else {
      if (product.precio_unidad) return 'unidad';
      if (product.precio_pieza) return 'pieza';
    }
    return 'unidad';
  });

  const { addItem } = useCart();
  const { toast } = useToast();

  const isFlores = product.categoria === 'flores' || product.categoria === 'Flores' || product.categoria === 'Flor' || product.categoria === 'flor';
  
  // Solo mostrar precios de onza/media onza si precio_unidad y precio_pieza están vacíos
  const shouldShowOnzaPrices = isFlores && 
    (!product.precio_unidad || product.precio_unidad === 0) && 
    (!product.precio_pieza || product.precio_pieza === 0);
  
  const getDescription = () => {
    return 'Producto premium de alta calidad';
  };

  // Get main price display
  const getMainPrice = () => {
    if (shouldShowOnzaPrices) {
      // Para flores sin precio_unidad/precio_pieza, mostrar precio por onza
      if (product.precio_onza && product.precio_onza > 0) {
        return `$${product.precio_onza.toLocaleString('es-MX')}`;
      }
      if (product.precio_media_onza && product.precio_media_onza > 0) {
        return `$${product.precio_media_onza.toLocaleString('es-MX')}`;
      }
      if (product.precio_gramo && product.precio_gramo > 0) {
        return `$${product.precio_gramo.toLocaleString('es-MX')}`;
      }
    } else {
      // Para otras categorías o flores con precio_unidad/precio_pieza
      if (product.precio_unidad && product.precio_unidad > 0) {
        return `$${product.precio_unidad.toLocaleString('es-MX')}`;
      }
      if (product.precio_pieza && product.precio_pieza > 0) {
        return `$${product.precio_pieza.toLocaleString('es-MX')}`;
      }
    }
    return 'Consultar precio';
  };

  const getCurrentPrice = () => {
    switch (selectedPrice) {
      case 'onza':
        return product.precio_onza || 0;
      case 'media_onza':
        return product.precio_media_onza || 0;
      case 'gramo':
        return product.precio_gramo || 0;
      case 'pieza':
        return product.precio_pieza || 0;
      case 'unidad':
      default:
        return product.precio_unidad || 0;
    }
  };

  const getQuantityToAdd = () => {
    // Solo gramo permite cantidad variable
    if (selectedPrice === 'gramo') return quantity;
    return 1;
  };

  const addToCart = () => {
    const unitPrice = getCurrentPrice();
    const quantityToAdd = getQuantityToAdd();
    
    addItem({
      name: product.nombre,
      category: product.categoria,
      price: unitPrice,
      quantity: quantityToAdd,
      type: selectedPrice,
      unitPrice: unitPrice,
      priceType: selectedPrice
    });
    
    toast({
      title: "Agregado a la calculadora",
      description: `${product.nombre} - ${getPriceTypeLabel(selectedPrice)}`,
    });
    
    setIsOpen(false);
    setQuantity(1); // Reset quantity
  };

  const getPriceTypeLabel = (priceType: PriceType) => {
    switch (priceType) {
      case 'gramo': return 'Gramo';
      case 'media_onza': return 'Media Onza';
      case 'onza': return 'Onza';
      case 'unidad': return 'Unidad';
      case 'pieza': return 'Pieza';
      default: return priceType;
    }
  };

  const getPriceOptions = () => {
    const options = [];
    if (shouldShowOnzaPrices) {
      // Para flores mostrar gramo, onza y media_onza
      if (product.precio_gramo && product.precio_gramo > 0) {
        options.push({ key: 'gramo' as PriceType, label: 'Gramo', price: product.precio_gramo });
      }
      if (product.precio_onza && product.precio_onza > 0) {
        options.push({ key: 'onza' as PriceType, label: 'Onza', price: product.precio_onza });
      }
      if (product.precio_media_onza && product.precio_media_onza > 0) {
        options.push({ key: 'media_onza' as PriceType, label: 'Media Onza', price: product.precio_media_onza });
      }
    } else {
      // Para otras categorías o flores con precio_unidad/precio_pieza
      if (product.precio_unidad && product.precio_unidad > 0) {
        options.push({ key: 'unidad' as PriceType, label: 'Unidad', price: product.precio_unidad });
      }
      if (product.precio_pieza && product.precio_pieza > 0) {
        options.push({ key: 'pieza' as PriceType, label: 'Pieza', price: product.precio_pieza });
      }
    }
    return options;
  };

  return (
    <>
      <div 
        className={`liquid-card glass-hover liquid-ripple glass-shine-effect p-6 cursor-pointer group transform transition-all duration-700 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/10 ${className}`}
        onClick={() => setIsOpen(true)}
        onMouseEnter={(e) => {
          e.currentTarget.style.willChange = 'transform';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.willChange = 'auto';
        }}
      >
        {/* Product Image */}
        <div className="relative mb-4 overflow-hidden rounded-glass liquid-animation">
          {product.foto_url ? (
            <img 
              src={product.foto_url} 
              alt={product.nombre}
              loading="lazy"
              decoding="async"
              width={320}
              height={192}
              className="w-full h-48 object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1 will-change-auto"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`w-full h-48 bg-gradient-to-br from-glass/40 to-glass/20 flex items-center justify-center transition-all duration-500 ${product.foto_url ? 'hidden' : ''}`}>
            <div className="text-muted-foreground text-sm animate-pulse">Sin imagen</div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-glass-shadow/60 to-transparent" />
          
          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <Badge 
              variant="secondary"
              className="text-xs liquid-card text-foreground/80 backdrop-blur-[15px]"
            >
              {product.categoria}
            </Badge>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-all duration-500">
            {product.nombre}
          </h3>
          
          <p className="text-sm text-muted-foreground line-clamp-2 transition-colors duration-300 group-hover:text-muted-foreground/80">
            {getDescription()}
          </p>

          {/* Price */}
          <div className="flex items-center justify-between pt-3">
            {shouldShowOnzaPrices ? (
              <div className="flex flex-col space-y-2">
                {/* Precio Gramo */}
                {product.precio_gramo && product.precio_gramo > 0 && (
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative glass-card rounded-lg px-3 py-2 border border-emerald-500/30">
                      <div className="text-xs font-medium text-emerald-400 uppercase tracking-wide">Gramo</div>
                      <div className="text-lg font-bold text-emerald-300">
                        ${product.precio_gramo.toLocaleString('es-MX')}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Grid de precios para flores */}
                <div className="grid grid-cols-2 gap-2">
                  {product.precio_onza && product.precio_onza > 0 && (
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative glass-card rounded-lg px-2 py-1.5 border border-primary/30">
                        <div className="text-xs font-medium text-primary uppercase tracking-wide">Onza</div>
                        <div className="text-sm font-bold text-primary">
                          ${product.precio_onza.toLocaleString('es-MX')}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {product.precio_media_onza && product.precio_media_onza > 0 && (
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative glass-card rounded-lg px-2 py-1.5 border border-orange-500/30">
                        <div className="text-xs font-medium text-orange-400 uppercase tracking-wide">½ Onza</div>
                        <div className="text-sm font-bold text-orange-300">
                          ${product.precio_media_onza.toLocaleString('es-MX')}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative glass-card rounded-lg px-4 py-3 border border-primary/30">
                  <div className="text-xs font-medium text-primary/80 uppercase tracking-wide mb-1">Precio</div>
                  <div className="text-2xl font-bold text-primary">
                    {getMainPrice()}
                  </div>
                </div>
              </div>
            )}
            <Button 
              size="sm" 
              className="glass-button-interactive liquid-ripple transform transition-all duration-500 hover:scale-110 active:scale-95 hover:shadow-lg hover:shadow-primary/20"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(true);
              }}
              disabled={!product.disponible}
            >
              <Calculator className="w-4 h-4 mr-2 transition-transform duration-500 group-hover:rotate-12" />
              {product.disponible ? 'Ver' : 'Agotado'}
            </Button>
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="liquid-card border-glass-border/30 max-w-2xl max-h-[90vh] overflow-y-auto backdrop-blur-[30px] dialog-expand-animation">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary glass-shine-effect">
              {product.nombre}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="relative rounded-glass overflow-hidden liquid-animation">
                {product.foto_url ? (
                  <img
                    src={product.foto_url}
                    alt={product.nombre}
                    className="w-full h-64 md:h-80 object-cover transition-all duration-700 hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`w-full h-64 md:h-80 bg-gradient-to-br from-glass/40 to-glass/20 flex items-center justify-center ${product.foto_url ? 'hidden' : ''}`}>
                  <div className="text-muted-foreground animate-pulse">Sin imagen disponible</div>
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
              {product.disponible && getPriceOptions().length > 0 && (
                <div>
                  <h4 className="font-semibold text-foreground mb-3">
                    {shouldShowOnzaPrices ? 'Selecciona Presentación' : 'Opciones de Compra'}
                  </h4>
                  <div className={`grid gap-3 ${shouldShowOnzaPrices ? 'grid-cols-3' : 'grid-cols-2'}`}>
                    {getPriceOptions().map((option) => (
                      <button
                        key={option.key}
                        onClick={() => {
                          setSelectedPrice(option.key);
                        }}
                        className={`glass-card rounded-lg p-4 text-center transition-all duration-300 border transform hover:scale-105 active:scale-95 hover:shadow-lg relative group ${
                          selectedPrice === option.key
                            ? 'border-primary bg-primary/20 shadow-primary/20'
                            : 'border-glass-border/30 hover:border-primary/50 hover:bg-primary/5'
                        }`}
                      >
                        {/* Animated background glow */}
                        <div className={`absolute inset-0 rounded-lg transition-opacity duration-300 ${
                          option.key === 'gramo' ? 'bg-gradient-to-r from-emerald-500/10 to-green-500/10' :
                          option.key === 'onza' ? 'bg-gradient-to-r from-primary/10 to-blue-500/10' :
                          option.key === 'media_onza' ? 'bg-gradient-to-r from-orange-500/10 to-amber-500/10' :
                          'bg-gradient-to-r from-purple-500/10 to-pink-500/10'
                        } ${selectedPrice === option.key ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></div>
                        
                        <div className="relative z-10">
                          <div className={`font-bold text-xs uppercase tracking-wider mb-2 ${
                            option.key === 'gramo' ? 'text-emerald-400' :
                            option.key === 'onza' ? 'text-primary' :
                            option.key === 'media_onza' ? 'text-orange-400' :
                            'text-purple-400'
                          }`}>
                            {option.label}
                          </div>
                          <div className={`font-bold text-lg ${
                            option.key === 'gramo' ? 'text-emerald-300' :
                            option.key === 'onza' ? 'text-primary' :
                            option.key === 'media_onza' ? 'text-orange-300' :
                            'text-purple-300'
                          }`}>
                            ${(option.price || 0).toLocaleString('es-MX')}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selection for Grams */}
              {product.disponible && selectedPrice === 'gramo' && (
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
              {product.disponible && getPriceOptions().length > 0 && (
                  <div className="glass-card rounded-lg p-4 space-y-4 border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        {selectedPrice === 'media_onza' ? 'Total (Media Onza)' :
                         selectedPrice === 'onza' ? 'Total (Onza)' :
                         selectedPrice === 'gramo' ? 'Total (Gramos)' :
                         selectedPrice === 'pieza' ? 'Total (Pieza)' :
                         'Total'}
                      </span>
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-lg blur-sm"></div>
                        <div className="relative glass-card px-4 py-2 rounded-lg border border-primary/30">
                          <span className="text-2xl font-bold text-primary">
                            ${getCurrentPrice().toLocaleString('es-MX')}
                          </span>
                        </div>
                      </div>
                    </div>
                  
                  <Button 
                    onClick={addToCart}
                    className="w-full glass-button h-12 text-base font-semibold transform transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-primary/20"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12" />
                    Agregar a Calculadora
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