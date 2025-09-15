import { createContext, useContext, useState, ReactNode } from 'react';

interface CartItem {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  size?: string;
  weight?: string;
  type: 'unidad' | 'onza' | 'media_onza' | 'gramo' | 'pieza';
  // Alias para compatibilidad
  unitPrice?: number;
  priceType?: string;
  total?: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;

  // Nombres "oficiales"
  getItemsCount: () => number;
  getTotalPrice: () => number;

  // Aliases por compatibilidad hacia atrás
  getItemCount: () => number;
  getTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (newItem: Omit<CartItem, 'id'>) => {
    const id = `${newItem.name}-${newItem.type}-${Date.now()}`;
    const cartItem: CartItem = { 
      ...newItem, 
      id,
      // Asegurar que los alias estén disponibles
      unitPrice: newItem.unitPrice || newItem.price,
      priceType: newItem.priceType || newItem.type,
      total: (newItem.price || newItem.unitPrice || 0) * newItem.quantity
    };
    
    setItems(prevItems => {
      // Check if similar item exists (same name, type, size)
      const existingItemIndex = prevItems.findIndex(
        item => item.name === newItem.name && 
                item.type === newItem.type && 
                item.size === newItem.size
      );
      
      if (existingItemIndex > -1) {
        // Update quantity of existing item
        const updatedItems = [...prevItems];
        const updatedItem = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + newItem.quantity
        };
        updatedItem.total = (updatedItem.price || updatedItem.unitPrice || 0) * updatedItem.quantity;
        updatedItems[existingItemIndex] = updatedItem;
        return updatedItems;
      } else {
        // Add new item
        return [...prevItems, cartItem];
      }
    });
  };

  const removeItem = (itemId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    
    setItems(prevItems =>
      prevItems.map(item => {
        if (item.id === itemId) {
          const updatedItem = { ...item, quantity };
          updatedItem.total = (updatedItem.price || updatedItem.unitPrice || 0) * quantity;
          return updatedItem;
        }
        return item;
      })
    );
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + ((item.price || item.unitPrice || 0) * item.quantity), 0);
  };

  const clearCart = () => {
    setItems([]);
  };

  const getItemsCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  // Aliases (compatibilidad con componentes existentes)
  const getItemCount = getItemsCount;
  const getTotal = getTotalPrice;

  const value: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemsCount,
    getTotalPrice,
    getItemCount,
    getTotal,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};