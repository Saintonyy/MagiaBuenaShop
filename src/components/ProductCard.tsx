import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Leaf, Star, ShoppingCart } from 'lucide-react';

// Función para generar fallback local por categoría
const fallbackByCategory = (cat?: string) => {
  const c = (cat || '').toLowerCase();
  if (c.includes('flor')) return '/images/fallback-flor.webp';
  if (c.includes('pre')) return '/images/fallback-preroll.webp';
  if (c.includes('vape')) return '/images/fallback-vape.webp';
  return '/images/fallback-default.webp';
};

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  strain: string;
  thc: string;
  type: string;
  available: boolean;
  sizes: Array<{
    weight: string;
    price: number;
  }>;
  badges: string[];
}

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard = ({ product, className = '' }: ProductCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  
  // Determinar la fuente de imagen con fallback
  const getImageSrc = () => {
    return product.image && product.image.trim() !== ''
      ? product.image
      : fallbackByCategory(product.category);
  };
  
  const imageSrc = getImageSrc();

  return (
    <>
      <div 
        className={`glass-card glass-hover rounded-glass p-6 cursor-pointer group ${className}`}
        onClick={() => setIsOpen(true)}
        onMouseEnter={(e) => {
          e.currentTarget.style.willChange = 'transform';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.willChange = 'auto';
        }}
      >
        {/* Product Image */}
        <div className="relative mb-4 overflow-hidden rounded-glass">
          <img
            src={imageSrc}
            alt={product.name}
            loading="lazy"
            decoding="async"
            width={320}
            height={192}
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110 will-change-auto"
            onError={(e) => {
              // evita loops si el fallback también falla
              const img = e.currentTarget;
              if (!img.dataset.fbkApplied) {
                img.dataset.fbkApplied = '1';
                img.src = fallbackByCategory(product.category);
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-glass-shadow/60 to-transparent" />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1">
            {product.badges.map((badge) => (
              <Badge 
                key={badge}
                variant={badge === 'Disponible' ? 'default' : 'secondary'}
                className={`text-xs ${badge === 'Disponible' ? 'bg-primary text-primary-foreground' : 'glass-card text-foreground/80'}`}
              >
                {badge}
              </Badge>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>

          {/* Product Details */}
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <Badge key={size.weight} variant="outline" className="glass-card border-glass-border/40">
                {size.weight}
              </Badge>
            ))}
          </div>

          {/* Price */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-2xl font-bold text-primary">
              ${product.price}
            </div>
            <Button 
              size="sm" 
              className="glass-button"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(true);
              }}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Ver
            </Button>
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="glass-card border-glass-border/30 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary">
              {product.name}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="relative rounded-glass overflow-hidden">
                <img
                  src={imageSrc}
                  alt={product.name}
                  loading="lazy"
                  decoding="async"
                  width={400}
                  height={320}
                  className="w-full h-64 md:h-80 object-cover will-change-auto"
                  onError={(e) => {
                    // evita loops si el fallback también falla
                    const img = e.currentTarget;
                    if (!img.dataset.fbkApplied) {
                      img.dataset.fbkApplied = '1';
                      img.src = fallbackByCategory(product.category);
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-glass-shadow/40 to-transparent" />
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {product.badges.map((badge) => (
                  <Badge 
                    key={badge}
                    variant={badge === 'Disponible' ? 'default' : 'secondary'}
                    className={badge === 'Disponible' ? 'bg-primary text-primary-foreground' : 'glass-card'}
                  >
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              {/* Strain Info */}
              <div className="glass-card rounded-glass p-4 space-y-3">
                <div className="flex items-center space-x-2">
                  <Leaf className="w-5 h-5 text-primary" />
                  <span className="text-sm font-semibold text-primary">INFORMACIÓN</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Tipo:</span>
                    <p className="font-medium text-foreground">{product.type}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">THC:</span>
                    <p className="font-medium text-primary">{product.thc}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Cepa:</span>
                    <p className="font-medium text-foreground">{product.strain}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="glass-card rounded-glass p-4">
                <h4 className="font-semibold text-foreground mb-2">Descripción</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Size Selection */}
              <div>
                <h4 className="font-semibold text-foreground mb-3">Tamaños Disponibles</h4>
                <div className="grid grid-cols-2 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size.weight}
                      onClick={() => setSelectedSize(size)}
                      className={`glass-card rounded-glass p-3 text-center transition-glass border ${
                        selectedSize.weight === size.weight
                          ? 'border-primary bg-primary/10'
                          : 'border-glass-border/30 hover:border-primary/50'
                      }`}
                    >
                      <div className="font-medium text-foreground">{size.weight}</div>
                      <div className="text-primary font-bold">${size.price}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price and Actions */}
              <div className="glass-card rounded-glass p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Precio</span>
                  <span className="text-3xl font-bold text-primary">
                    ${selectedSize.price}
                  </span>
                </div>
                
                <Button className="w-full glass-button h-12 text-base font-semibold">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Agregar al Carrito
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductCard;