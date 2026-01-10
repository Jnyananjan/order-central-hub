import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

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

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orderedUsers, setOrderedUsers] = useState<string[]>(() => {
    const saved = localStorage.getItem('orderedUsers');
    return saved ? JSON.parse(saved) : [];
  });

  const { user } = useAuth();

  // Check if current user has ordered
  const hasOrdered = user?.email ? orderedUsers.includes(user.email) : false;

  useEffect(() => {
    localStorage.setItem('orderedUsers', JSON.stringify(orderedUsers));
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
    // Only allow one item (macro pad) in cart
    if (items.length === 0) {
      setItems([{ ...item, quantity: 1 }]);
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

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
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