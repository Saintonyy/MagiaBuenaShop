import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { Calculator, Trash2, Plus, Minus } from 'lucide-react';

const CartSummary = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { items, getTotalPrice, getItemsCount, updateQuantity, removeItem, clearCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case 'flores': return 'Flores';
      case 'pre-rolls': return 'Pre-rolls';
      case 'parafernalia': return 'Parafernalia';
      case 'vapes': return 'Vapes';
      default: return category.charAt(0).toUpperCase() + category.slice(1);
    }
  };

  const getTypeDisplayName = (type: string) => {
    switch (type) {
      case 'gramo': return 'por gramo';
      case 'onza': return '1 onza';
      case 'media_onza': return '1/2 onza';
      case 'unidad': return 'unidad';
      case 'pieza': return 'pieza';
      default: return type;
    }
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="glass-card border-glass-border/30 hover:border-primary/50 relative"
        size="sm"
      >
        <Calculator className="w-4 h-4 mr-2" />
        Precio Estimado
        {getItemsCount() > 0 && (
          <Badge className="ml-2 bg-primary text-primary-foreground text-xs">
            {getItemsCount()}
          </Badge>
        )}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="glass-card border-glass-border/30 max-w-md max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-primary flex items-center">
              <Calculator className="w-5 h-5 mr-2" />
              Precio Estimado
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-8">
                <Calculator className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No hay productos seleccionados
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Agrega productos para ver el precio estimado
                </p>
              </div>
            ) : (
              <>
                <div className="max-h-64 overflow-y-auto space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="glass-card rounded-glass p-3 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground text-sm">
                            {item.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {getCategoryDisplayName(item.category)}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {getTypeDisplayName(item.type)}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-6 w-6 p-0"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="text-sm font-medium min-w-[2rem] text-center">
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
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            {formatPrice(item.price)} c/u
                          </p>
                          <p className="font-bold text-primary">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-glass-border/30 pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold text-foreground">
                      Total Estimado:
                    </span>
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(getTotalPrice())}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      onClick={clearCart}
                      className="w-full glass-card border-glass-border/30"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Limpiar Todo
                    </Button>
                    
                    <div className="glass-card rounded-glass p-3 bg-glass/20">
                      <p className="text-xs text-muted-foreground text-center">
                        Este es un precio estimado. Los precios finales pueden variar.
                        Contacta por Telegram para confirmar tu pedido.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CartSummary;