import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Calculator, Plus, Minus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import logo from '@/assets/logo.png';

interface Product {
  id: string;
  nombre: string;
  descripcion?: string;
  precio_unidad?: number;
  precio_onza?: number;
  precio_media_onza?: number;
  precio_gramo?: number;
  imagen_url?: string;
  categoria: string[];
  precio_por_pieza?: number;
  activo: boolean;
}

interface DynamicProductCardProps {
  product: Product;
  className?: string;
}

const DynamicProductCard = ({ product, className = '' }: DynamicProductCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState<'gramo' | 'media_onza' | 'onza' | 'unidad' | 'pieza'>(
    product.categoria.includes('flores') ? 'onza' : 'unidad'
  );
  const [pieceQuantity, setPieceQuantity] = useState(1);
  const { addItem } = useCart();

  const isFlores = product.categoria.includes('flores');
  const hasPerPiece = product.precio_por_pieza !== undefined && product.precio_por_pieza > 0;
  
  // Generate description if none exists
  const getDescription = () => {
    if (product.descripcion) return product.descripcion;
    
    const categoryText = product.categoria.join(', ');
    return `Producto premium ${product.nombre} de alta calidad en categoría ${categoryText}. Disponible con garantía de frescura y calidad superior.`;
  };

  const getMainPrice = () => {
    if (isFlores) {
      // For flores, main price is 1 onza
      return `$${(product.precio_onza || 0).toLocaleString('es-MX')}`;
    } else {
      // For others, main price is unidad
      return `$${(product.precio_unidad || 0).toLocaleString('es-MX')}`;
    }
  };

  const getCurrentPrice = () => {
    switch (selectedWeight) {
      case 'onza':
        return product.precio_onza || 0;
      case 'media_onza':
        return product.precio_media_onza || 0;
      case 'gramo':
        return (product.precio_gramo || 0) * quantity;
      case 'pieza':
        return (product.precio_por_pieza || 0) * pieceQuantity;
      case 'unidad':
      default:
        return product.precio_unidad || 0;
    }
  };

  const getQuantity = () => {
    if (selectedWeight === 'gramo') return quantity;
    if (selectedWeight === 'pieza') return pieceQuantity;
    return 1;
  };

  const handleAddToCart = () => {
    const unitPrice = selectedWeight === 'gramo' ? (product.precio_gramo || 0) : 
                     selectedWeight === 'pieza' ? (product.precio_por_pieza || 0) : 
                     getCurrentPrice();
    const itemQuantity = getQuantity();
    
    addItem({
      name: product.nombre,
      category: product.categoria[0] || 'otros',
      price: unitPrice,
      quantity: itemQuantity,
      type: selectedWeight
    });
  };

  const getWeightOptions = () => {
    const options = [];
    if (isFlores) {
      if (product.precio_gramo) options.push({ key: 'gramo', label: '1 Gramo', price: product.precio_gramo });
      if (product.precio_media_onza) options.push({ key: 'media_onza', label: '1/2 Onza', price: product.precio_media_onza });
      if (product.precio_onza) options.push({ key: 'onza', label: '1 Onza', price: product.precio_onza });
    } else {
      if (product.precio_unidad) options.push({ key: 'unidad', label: 'Unidad', price: product.precio_unidad });
      if (hasPerPiece && product.precio_por_pieza) options.push({ key: 'pieza', label: 'Por Pieza', price: product.precio_por_pieza });
    }
    return options;
  };

  return (
    <>
      <div 
        className={`glass-card glass-hover rounded-glass p-6 cursor-pointer group ${className}`}
        onClick={() => setIsOpen(true)}
      >
        {/* Product Image */}
        <div className="relative mb-4 overflow-hidden rounded-glass">
          {product.imagen_url ? (
            <img
              src={product.imagen_url}
              alt={product.nombre}
              className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-glass/40 to-glass/20 flex items-center justify-center">
              <div className="text-muted-foreground text-sm">Sin imagen</div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-glass-shadow/60 to-transparent" />
          
          {/* Category Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1">
            {product.categoria.slice(0, 2).map((cat) => (
              <Badge 
                key={cat}
                variant="secondary"
                className="text-xs glass-card text-foreground/80"
              >
                {cat}
              </Badge>
            ))}
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
          <DialogHeader className="relative">
            <img 
              src={logo} 
              alt="Magia Buena Logo" 
              className="absolute top-0 right-0 h-8 w-auto object-contain opacity-60"
            />
            <DialogTitle className="text-2xl font-bold text-primary pr-12">
              {product.nombre}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="relative rounded-glass overflow-hidden">
                {product.imagen_url ? (
                  <img
                    src={product.imagen_url}
                    alt={product.nombre}
                    className="w-full h-64 md:h-80 object-cover"
                  />
                ) : (
                  <div className="w-full h-64 md:h-80 bg-gradient-to-br from-glass/40 to-glass/20 flex items-center justify-center">
                    <div className="text-muted-foreground">Sin imagen disponible</div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-glass-shadow/40 to-transparent" />
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                {product.categoria.map((cat) => (
                  <Badge 
                    key={cat}
                    variant="secondary"
                    className="glass-card"
                  >
                    {cat}
                  </Badge>
                ))}
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
              {getWeightOptions().length > 0 && (
                <div>
                  <h4 className="font-semibold text-foreground mb-3">
                    {isFlores ? 'Opciones de Peso' : 'Opciones de Compra'}
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {getWeightOptions().map((option) => (
                      <button
                        key={option.key}
                        onClick={() => {
                          setSelectedWeight(option.key as any);
                          if (option.key !== 'pieza') setPieceQuantity(1);
                        }}
                        className={`glass-card rounded-glass p-3 text-center transition-glass border ${
                          selectedWeight === option.key
                            ? 'border-primary bg-primary/10'
                            : 'border-glass-border/30 hover:border-primary/50'
                        }`}
                      >
                        <div className="font-medium text-foreground">{option.label}</div>
                        <div className="text-primary font-bold">${option.price}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Piece Selection for Special Products */}
              {selectedWeight === 'pieza' && hasPerPiece && (
                <div className="glass-card rounded-glass p-4">
                  <h4 className="font-semibold text-foreground mb-3">Cantidad de Piezas</h4>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPieceQuantity(Math.max(1, pieceQuantity - 1))}
                      className="glass-card border-glass-border/30"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <Input
                      type="number"
                      value={pieceQuantity}
                      onChange={(e) => setPieceQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-20 text-center glass-card border-glass-border/30"
                      min="1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPieceQuantity(pieceQuantity + 1)}
                      className="glass-card border-glass-border/30"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Precio por pieza: ${product.precio_por_pieza}
                  </p>
                </div>
              )}

              {/* Price and Actions */}
              <div className="glass-card rounded-glass p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    {selectedWeight === 'pieza' ? `Total (${pieceQuantity} piezas)` :
                     selectedWeight === 'gramo' ? `Total (${quantity}g)` : 'Precio'}
                  </span>
                  <span className="text-3xl font-bold text-primary">
                    ${getCurrentPrice().toLocaleString('es-MX')}
                  </span>
                </div>
                
                <Button 
                  className="w-full glass-button h-12 text-base font-semibold"
                  onClick={handleAddToCart}
                  disabled={!product.activo}
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  {product.activo ? 'Agregar a Precio Estimado' : 'No Disponible'}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DynamicProductCard;