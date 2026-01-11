import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PRODUCT_CONFIG } from '@/config/products';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  isInCart: (id: string) => boolean;
  totalPrice: number;
  itemCount: number;
  hasOrdered: boolean;
  setHasOrdered: (value: boolean) => void;
  checkUserOrdered: (email: string) => boolean;
  markUserOrdered: (email: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// SECURITY: Validate product ID is in allowed list
const isValidProduct = (productId: string): boolean => {
  return productId === PRODUCT_CONFIG.TECHY_PAD.id;
};

// SECURITY: Get correct price for product (ignore any user-provided price)
const getSecurePrice = (productId: string): number => {
  if (productId === PRODUCT_CONFIG.TECHY_PAD.id) {
    return PRODUCT_CONFIG.TECHY_PAD.salePrice;
  }
  return 0;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orderedUsers, setOrderedUsers] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('orderedUsers');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const { user } = useAuth();

  const hasOrdered = user?.email ? orderedUsers.includes(user.email) : false;

  useEffect(() => {
    try {
      localStorage.setItem('orderedUsers', JSON.stringify(orderedUsers));
    } catch {
      // localStorage might be full or disabled
    }
  }, [orderedUsers]);

  const checkUserOrdered = (email: string) => {
    return orderedUsers.includes(email);
  };

  const markUserOrdered = (email: string) => {
    if (!orderedUsers.includes(email)) {
      setOrderedUsers(prev => [...prev, email]);
    }
  };

  const setHasOrdered = (value: boolean) => {
    if (user?.email) {
      if (value) {
        markUserOrdered(user.email);
      } else {
        setOrderedUsers(prev => prev.filter(e => e !== user.email));
      }
    }
  };

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    // SECURITY: Validate product ID
    if (!isValidProduct(item.id)) {
      console.warn('Invalid product ID attempted');
      return;
    }

    // SECURITY: Override price with server-side price
    const securePrice = getSecurePrice(item.id);
    if (securePrice <= 0) {
      console.warn('Invalid product price');
      return;
    }

    // Only allow one item in cart
    if (items.length === 0) {
      setItems([{ 
        ...item, 
        price: securePrice, // SECURITY: Use server-side price
        quantity: 1 
      }]);
    }
  };

  const removeFromCart = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const isInCart = (id: string) => {
    return items.some(item => item.id === id);
  };

  // SECURITY: Calculate total using server-side prices
  const totalPrice = items.reduce((sum, item) => {
    const securePrice = getSecurePrice(item.id);
    return sum + securePrice * item.quantity;
  }, 0);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      clearCart,
      isInCart,
      totalPrice,
      itemCount,
      hasOrdered,
      setHasOrdered,
      checkUserOrdered,
      markUserOrdered
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
