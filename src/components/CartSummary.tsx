import { useState, useRef } from 'react';
import { Calculator, Plus, Minus, ShoppingCart, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useDropdownPosition } from '@/hooks/use-dropdown-position';
import { useClickOutside } from '@/hooks/use-click-outside';

interface CartSummaryProps {
  inline?: boolean; // Para mostrar inline sin botón FAB
}

const CartSummary = ({ inline = false }: CartSummaryProps) => {
  const { items, removeItem, updateQuantity, clearCart, getTotal, getItemCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  
  // Refs for dropdown positioning
  const cartDropdownRef = useRef<HTMLDivElement>(null);
  const cartTriggerRef = useRef<HTMLButtonElement>(null);
  
  // Smart dropdown positioning
  const cartPosition = useDropdownPosition(isOpen, cartDropdownRef, cartTriggerRef);
  
  // Close dropdown when clicking outside
  useClickOutside(isOpen, setIsOpen, [cartDropdownRef, cartTriggerRef]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  // Guards de seguridad durante la transición
  const safeCount = typeof getItemCount === 'function' ? getItemCount() : items?.reduce((s,i)=>s + (i.quantity ?? 0), 0) ?? 0;
  const safeTotal = typeof getTotal === 'function' ? getTotal() : items?.reduce((s,i)=>s + (((i.price || i.unitPrice) ?? 0)*(i.quantity ?? 0)), 0) ?? 0;

  const itemCount = safeCount;
  const total = safeTotal;

  const getPriceTypeLabel = (priceType: string) => {
    switch (priceType) {
      case 'gramo': return 'gramo';
      case 'media_onza': return 'media onza';
      case 'onza': return 'onza';
      case 'unidad': return 'unidad';
      case 'pieza': return 'pieza';
      default: return priceType;
    }
  };

  // Si es inline, siempre mostrar el contenido
  const showContent = inline || isOpen;

  // Renderizado inline (sin botón FAB)
  if (inline) {
    return (
      <div className="w-full">
        <Card className="border-0 bg-transparent">
          <CardContent className="space-y-4 p-0">
            {items.length === 0 ? (
              <div className="text-center py-6">
                <Calculator className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
                <p className="text-xs text-muted-foreground">
                  Tu calculadora está vacía
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  Agrega productos desde el catálogo
                </p>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2 glass-card-subtle rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-medium truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {formatPrice(item.unitPrice || item.price)} {getPriceTypeLabel(item.priceType || item.type)}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-5 w-5 p-0"
                        >
                          <Minus className="w-2 h-2" />
                        </Button>
                        
                        <span className="text-xs font-medium w-6 text-center">
                          {item.quantity}
                        </span>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-5 w-5 p-0"
                        >
                          <Plus className="w-2 h-2" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="h-5 w-5 p-0 text-destructive hover:text-destructive ml-1"
                        >
                          <X className="w-2 h-2" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="border-t border-glass-border/20 pt-3">
                  <div className="flex items-center justify-between text-sm font-semibold">
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
                    className="flex-1 text-xs"
                  >
                    Limpiar
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 glass-button-interactive text-xs"
                    onClick={() => {
                      const message = `Hola! Me interesa:\n\n${items.map(item => 
                        `• ${item.name} (${getPriceTypeLabel(item.priceType || item.type)}) x${item.quantity} - ${formatPrice((item.price || item.unitPrice || 0) * item.quantity)}`
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
    );
  }

  return (
    <div className="relative">
      {/* Cart Button - FAB in mobile, regular button in desktop */}
      <Button
        ref={cartTriggerRef}
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Abrir calculadora"
        className="
          glass-button-interactive relative
          fixed sm:static
          sm:translate-x-0 sm:translate-y-0
          bottom-[calc(env(safe-area-inset-bottom,0)+16px)] sm:bottom-auto
          right-4 sm:right-auto
          z-50 sm:z-auto
          h-14 w-14 sm:h-auto sm:w-auto
          rounded-full sm:rounded-md
          shadow-lg sm:shadow-none
          bg-emerald-500 sm:bg-transparent text-white sm:text-current
          flex items-center justify-center
          active:scale-95 transition-transform
          min-w-[56px] min-h-[56px] sm:min-w-0 sm:min-h-0
          border-emerald-500 sm:border-current
          hover:bg-emerald-600 sm:hover:bg-transparent
          focus:outline focus:outline-2 focus:outline-emerald-600 focus:outline-offset-2 sm:focus:outline-current
        "
      >
        <Calculator className="w-4 h-4 sm:mr-2" />
        <span className="hidden sm:inline">Calculadora</span>
        {itemCount > 0 && (
          <Badge className="
            cart-notification-badge
            -top-2 -right-2 sm:static sm:ml-2
            sm:bg-transparent sm:text-current sm:border-0 sm:shadow-none
            sm:min-w-0 sm:min-h-0 sm:p-0 sm:font-normal
          ">
            {itemCount}
          </Badge>
        )}
      </Button>

      {/* Cart Dropdown */}
      {isOpen && (
        <div 
          ref={cartDropdownRef}
          className="absolute top-full right-0 sm:right-0 left-0 sm:left-auto mt-2 w-80 sm:w-80 max-w-[calc(100vw-2rem)] mx-auto sm:mx-0 glass-card-animated mobile-dropdown industrial-dropdown border border-glass-border/30 rounded-2xl shadow-glass z-50"
          style={cartPosition}
        >
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
                            {formatPrice(item.unitPrice || item.price)} {getPriceTypeLabel(item.priceType || item.type)}
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
                          `• ${item.name} (${getPriceTypeLabel(item.priceType || item.type)}) x${item.quantity} - ${formatPrice((item.price || item.unitPrice || 0) * item.quantity)}`
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