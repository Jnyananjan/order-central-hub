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
  tracking_link?: string;
  created_at: string;
}

interface OrderContextType {
  orders: Order[];
  userOrders: Order[];
  loading: boolean;
  fetchOrders: () => Promise<void>;
  fetchUserOrders: (email: string) => Promise<void>;
  addOrder: (order: Omit<Order, 'id' | 'created_at'>) => Promise<Order | null>;
  cancelOrder: (orderId: string) => Promise<boolean>;
  updateOrderStatus: (orderId: string, status: string) => Promise<boolean>;
  updateTrackingLink: (orderId: string, trackingLink: string) => Promise<boolean>;
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
    if (!supabaseConfigured || !email) return;
    
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
      
      setOrders(prev => [data, ...prev]);
      setUserOrders(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding order:', error);
      return null;
    }
  };

  const cancelOrder = async (orderId: string): Promise<boolean> => {
    if (!supabaseConfigured || !orderId) {
      console.warn('Supabase not configured or invalid orderId');
      return false;
    }
    
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ order_status: 'cancelled' })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;
      
      // Update local state immediately with the returned data
      if (data) {
        setOrders(prev => prev.map(order => 
          order.id === orderId ? { ...order, order_status: 'cancelled' } : order
        ));
        setUserOrders(prev => prev.map(order => 
          order.id === orderId ? { ...order, order_status: 'cancelled' } : order
        ));
      }
      return true;
    } catch (error) {
      console.error('Error cancelling order:', error);
      return false;
    }
  };

  const updateOrderStatus = async (orderId: string, status: string): Promise<boolean> => {
    if (!supabaseConfigured || !orderId) return false;
    
    try {
      const { error } = await supabase
        .from('orders')
        .update({ order_status: status })
        .eq('id', orderId);

      if (error) throw error;
      
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, order_status: status } : order
      ));
      setUserOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, order_status: status } : order
      ));
      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      return false;
    }
  };

  const updateTrackingLink = async (orderId: string, trackingLink: string): Promise<boolean> => {
    if (!supabaseConfigured || !orderId) return false;
    
    try {
      const { error } = await supabase
        .from('orders')
        .update({ tracking_link: trackingLink })
        .eq('id', orderId);

      if (error) throw error;
      
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, tracking_link: trackingLink } : order
      ));
      setUserOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, tracking_link: trackingLink } : order
      ));
      return true;
    } catch (error) {
      console.error('Error updating tracking link:', error);
      return false;
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
            const newOrder = payload.new as Order;
            setOrders(prev => {
              if (prev.some(o => o.id === newOrder.id)) return prev;
              return [newOrder, ...prev];
            });
            setUserOrders(prev => {
              if (prev.some(o => o.id === newOrder.id)) return prev;
              return [newOrder, ...prev];
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedOrder = payload.new as Order;
            setOrders(prev => 
              prev.map(order => 
                order.id === updatedOrder.id ? updatedOrder : order
              )
            );
            setUserOrders(prev => 
              prev.map(order => 
                order.id === updatedOrder.id ? updatedOrder : order
              )
            );
          } else if (payload.eventType === 'DELETE') {
            const deletedOrder = payload.old as Order;
            setOrders(prev => 
              prev.filter(order => order.id !== deletedOrder.id)
            );
            setUserOrders(prev => 
              prev.filter(order => order.id !== deletedOrder.id)
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
      addOrder,
      cancelOrder,
      updateOrderStatus,
      updateTrackingLink
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
