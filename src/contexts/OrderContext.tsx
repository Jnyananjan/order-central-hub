import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase, supabaseConfigured } from '@/integrations/supabase/client';

export interface Order {
  id: string;
  order_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  product_name: string;
  product_price: number;
  quantity: number;
  total_amount: number;
  payment_id: string;
  payment_status: string;
  order_status: string;
  created_at: string;
}

interface OrderContextType {
  orders: Order[];
  userOrders: Order[];
  loading: boolean;
  fetchOrders: () => Promise<void>;
  fetchUserOrders: (email: string) => Promise<void>;
  addOrder: (order: Omit<Order, 'id' | 'created_at'>) => Promise<Order | null>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    if (!supabaseConfigured) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserOrders = async (email: string) => {
    if (!supabaseConfigured) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_email', email)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserOrders(data || []);
    } catch (error) {
      console.error('Error fetching user orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const addOrder = async (order: Omit<Order, 'id' | 'created_at'>): Promise<Order | null> => {
    if (!supabaseConfigured) {
      console.warn('Supabase not configured');
      return null;
    }
    
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([order])
        .select()
        .single();

      if (error) throw error;
      
      // Update local state
      setOrders(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding order:', error);
      return null;
    }
  };

  // Set up real-time subscription for orders
  useEffect(() => {
    if (!supabaseConfigured) return;

    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setOrders(prev => [payload.new as Order, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setOrders(prev => 
              prev.map(order => 
                order.id === (payload.new as Order).id ? payload.new as Order : order
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setOrders(prev => 
              prev.filter(order => order.id !== (payload.old as Order).id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <OrderContext.Provider value={{
      orders,
      userOrders,
      loading,
      fetchOrders,
      fetchUserOrders,
      addOrder
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
