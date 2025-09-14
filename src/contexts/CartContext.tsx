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
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  getTotalPrice: () => number;
  clearCart: () => void;
  getItemsCount: () => number;
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
    const cartItem: CartItem = { ...newItem, id };
    
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
        updatedItems[existingItemIndex].quantity += newItem.quantity;
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
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const clearCart = () => {
    setItems([]);
  };

  const getItemsCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const value: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    getTotalPrice,
    clearCart,
    getItemsCount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};