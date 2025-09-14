import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Leaf, Star, Calculator, Plus, Minus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

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
  // New pricing structure
  precio_onza?: number;
  precio_media_onza?: number;
  precio_gramo?: number;
  precio_por_pieza?: number;
  precio_unidad?: number;
}

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard = ({ product, className = '' }: ProductCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [gramQuantity, setGramQuantity] = useState(1);
  const [pieceQuantity, setPieceQuantity] = useState(1);
  const { addItem } = useCart();

  const isFlores = product.category === 'flores';
  const hasPerPiece = product.precio_por_pieza !== undefined && product.precio_por_pieza > 0;
  
  const getSelectedType = (): 'unidad' | 'onza' | 'media_onza' | 'gramo' | 'pieza' => {
    if (selectedSize.weight === '1 onza') return 'onza';
    if (selectedSize.weight === '1/2 onza') return 'media_onza';
    if (selectedSize.weight === 'Por gramo') return 'gramo';
    if (selectedSize.weight === 'Por pieza') return 'pieza';
    return 'unidad';
  };

  const getCurrentPrice = () => {
    const type = getSelectedType();
    if (type === 'gramo') {
      return (product.precio_gramo || 0) * gramQuantity;
    }
    if (type === 'pieza') {
      return (product.precio_por_pieza || 0) * pieceQuantity;
    }
    return selectedSize.price;
  };

  const getQuantity = () => {
    const type = getSelectedType();
    if (type === 'gramo') return gramQuantity;
    if (type === 'pieza') return pieceQuantity;
    return 1;
  };

  const handleAddToCart = () => {
    const type = getSelectedType();
    const quantity = getQuantity();
    const unitPrice = type === 'gramo' ? (product.precio_gramo || 0) : 
                     type === 'pieza' ? (product.precio_por_pieza || 0) : 
                     selectedSize.price;
    
    addItem({
      name: product.name,
      category: product.category,
      price: unitPrice,
      quantity: quantity,
      size: selectedSize.weight,
      type: type
    });
  };

  return (
    <>
      <div 
        className={`glass-card glass-hover rounded-glass p-6 cursor-pointer group ${className}`}
        onClick={() => setIsOpen(true)}
      >
        {/* Product Image */}
        <div className="relative mb-4 overflow-hidden rounded-glass">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
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
              <Calculator className="w-4 h-4 mr-2" />
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
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 md:h-80 object-cover"
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
                <h4 className="font-semibold text-foreground mb-3">Presentaciones Disponibles</h4>
                <div className="grid grid-cols-1 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size.weight}
                      onClick={() => {
                        setSelectedSize(size);
                        // Reset quantities when changing size
                        setGramQuantity(1);
                        setPieceQuantity(1);
                      }}
                      className={`glass-card rounded-glass p-3 text-left transition-glass border ${
                        selectedSize.weight === size.weight
                          ? 'border-primary bg-primary/10'
                          : 'border-glass-border/30 hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-foreground">{size.weight}</div>
                        <div className="text-primary font-bold">${size.price.toLocaleString('es-MX')}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Gram Quantity Control for Flores */}
              {isFlores && selectedSize.weight === 'Por gramo' && (
                <div className="glass-card rounded-glass p-4">
                  <h4 className="font-semibold text-foreground mb-3">Cantidad (gramos)</h4>
                  <div className="flex items-center justify-center space-x-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setGramQuantity(Math.max(1, gramQuantity - 1))}
                      className="glass-card border-glass-border/30"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="text-xl font-bold text-primary min-w-[3rem] text-center">
                      {gramQuantity}g
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setGramQuantity(gramQuantity + 1)}
                      className="glass-card border-glass-border/30"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 text-center">
                    Precio por gramo: ${product.precio_gramo?.toLocaleString('es-MX')}
                  </p>
                </div>
              )}

              {/* Piece Quantity Control for Non-Flores with Per-Piece Pricing */}
              {hasPerPiece && selectedSize.weight === 'Por pieza' && (
                <div className="glass-card rounded-glass p-4">
                  <h4 className="font-semibold text-foreground mb-3">Cantidad (piezas)</h4>
                  <div className="flex items-center justify-center space-x-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPieceQuantity(Math.max(1, pieceQuantity - 1))}
                      className="glass-card border-glass-border/30"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="text-xl font-bold text-primary min-w-[3rem] text-center">
                      {pieceQuantity}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPieceQuantity(pieceQuantity + 1)}
                      className="glass-card border-glass-border/30"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 text-center">
                    Precio por pieza: ${product.precio_por_pieza?.toLocaleString('es-MX')}
                  </p>
                </div>
              )}

              {/* Price and Actions */}
              <div className="glass-card rounded-glass p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    {getSelectedType() === 'gramo' ? `Total (${gramQuantity}g)` :
                     getSelectedType() === 'pieza' ? `Total (${pieceQuantity} piezas)` :
                     'Precio'}
                  </span>
                  <span className="text-3xl font-bold text-primary">
                    ${getCurrentPrice().toLocaleString('es-MX')}
                  </span>
                </div>
                
                <Button 
                  className="w-full glass-button h-12 text-base font-semibold"
                  onClick={handleAddToCart}
                  disabled={!product.available}
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  {product.available ? 'Agregar a Precio Estimado' : 'No Disponible'}
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