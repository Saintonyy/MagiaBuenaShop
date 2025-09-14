import { useState } from 'react';
import { Calculator, Plus, Minus, ShoppingCart, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';

const CartSummary = () => {
  const { items, removeItem, updateQuantity, clearCart, getTotal, getItemCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  const itemCount = getItemCount();
  const total = getTotal();

  const getPriceTypeLabel = (priceType: string) => {
    switch (priceType) {
      case 'media_onza': return 'media onza';
      case 'onza': return 'onza';
      case 'unidad': return 'unidad';
      case 'pieza': return 'pieza';
      default: return priceType;
    }
  };

  return (
    <div className="relative">
      {/* Cart Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="glass-button-interactive relative"
      >
        <Calculator className="w-4 h-4 mr-2" />
        <span className="hidden sm:inline">Calculadora</span>
        {itemCount > 0 && (
          <Badge
            variant="secondary"
            className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground"
          >
            {itemCount}
          </Badge>
        )}
      </Button>

      {/* Cart Dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 max-w-[90vw] glass-card-animated border border-glass-border/30 rounded-2xl shadow-glass animate-scale-in z-50">
          <Card className="border-0 bg-transparent">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Calculadora de Precio
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-8">
                  <Calculator className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground">
                    Tu calculadora está vacía
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Agrega productos para calcular el precio total
                  </p>
                </div>
              ) : (
                <>
                  {/* Cart Items */}
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 glass-card-subtle rounded-xl"
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium truncate">
                            {item.name}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {formatPrice(item.unitPrice)} {getPriceTypeLabel(item.priceType)}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-6 w-6 p-0"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          
                          <span className="text-sm font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-6 w-6 p-0"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="border-t border-glass-border/20 pt-4">
                    <div className="flex items-center justify-between text-lg font-semibold">
                      <span>Total:</span>
                      <span className="text-primary">{formatPrice(total)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearCart}
                      className="flex-1"
                    >
                      Limpiar
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 glass-button-interactive"
                      onClick={() => {
                        // Here you could integrate with a contact form or WhatsApp
                        const message = `Hola! Me interesa:\n\n${items.map(item => 
                          `• ${item.name} (${getPriceTypeLabel(item.priceType)}) x${item.quantity} - ${formatPrice(item.total)}`
                        ).join('\n')}\n\nTotal: ${formatPrice(total)}`;
                        
                        const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
                        window.open(whatsappUrl, '_blank');
                      }}
                    >
                      Contactar
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CartSummary;