import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Package, Printer, LogOut, XCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOrders, Order } from '@/contexts/OrderContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const ADMIN_EMAIL = 'jnyananjan@admin';
const ADMIN_PASSWORD = 'Jnyananjan@01';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { orders, fetchOrders, loading, cancelOrder } = useOrders();
  const { toast } = useToast();
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if admin is logged in from session
    const adminSession = sessionStorage.getItem('adminLoggedIn');
    if (adminSession === 'true') {
      setIsAuthenticated(true);
    } else {
      // Redirect to auth page for admin login
      navigate('/auth?admin=true');
    }
  }, [navigate]);

  useEffect(() => {
    if (isAuthenticated) fetchOrders();
  }, [isAuthenticated]);

  const handleLogout = () => {
    sessionStorage.removeItem('adminLoggedIn');
    setIsAuthenticated(false);
    navigate('/auth');
  };

  const handlePrint = (order: Order) => {
    setSelectedOrder(order);
    setTimeout(() => window.print(), 100);
  };

  const handleCancelOrder = async (order: Order) => {
    const success = await cancelOrder(order.id);
    if (success) {
      toast({ title: 'Order Cancelled', description: `Order ${order.order_id} has been cancelled.` });
      fetchOrders();
    } else {
      toast({ title: 'Error', description: 'Failed to cancel order.', variant: 'destructive' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500/20 text-green-500';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'cancelled':
        return 'bg-red-500/20 text-red-500';
      case 'shipped':
        return 'bg-blue-500/20 text-blue-500';
      case 'delivered':
        return 'bg-purple-500/20 text-purple-500';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-card border-b border-border p-4 no-print">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="font-display text-xl font-bold">Techy Pad Dashboard</h1>
          <Button variant="ghost" onClick={handleLogout} className="gap-2"><LogOut className="w-4 h-4" />Logout</Button>
        </div>
      </nav>

      <main className="container mx-auto p-4 no-print">
        <div className="flex items-center gap-3 mb-6"><Package className="w-6 h-6" /><h2 className="font-display text-2xl font-bold">Orders ({orders.length})</h2></div>
        {loading ? <p className="text-muted-foreground">Loading orders...</p> : orders.length === 0 ? (
          <div className="glass-card p-12 text-center"><Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" /><p className="text-muted-foreground">No orders yet</p></div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => (
              <motion.div key={order.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="glass-card p-6">
                <div className="grid md:grid-cols-4 gap-4 mb-4">
                  <div><p className="text-sm text-muted-foreground">Order ID</p><p className="font-mono">{order.order_id}</p></div>
                  <div><p className="text-sm text-muted-foreground">Customer</p><p className="font-medium">{order.customer_name}</p></div>
                  <div><p className="text-sm text-muted-foreground">Status</p><span className={`inline-block px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(order.order_status)}`}>{order.order_status}</span></div>
                  <div><p className="text-sm text-muted-foreground">Date</p><p>{new Date(order.created_at).toLocaleDateString()}</p></div>
                </div>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div><p className="text-sm text-muted-foreground">Email</p><p>{order.customer_email}</p></div>
                  <div><p className="text-sm text-muted-foreground">Phone</p><p>{order.customer_phone}</p></div>
                  <div><p className="text-sm text-muted-foreground">Total</p><p className="font-bold">₹{order.total_amount}</p></div>
                </div>
                <div className="pt-4 border-t border-border/50 flex justify-between items-center flex-wrap gap-4">
                  <p className="text-sm text-muted-foreground">{order.shipping_address}, {order.city}, {order.state} {order.zip_code}</p>
                  <div className="flex gap-2">
                    {order.order_status !== 'cancelled' && (
                      <Button variant="outline" size="sm" onClick={() => handleCancelOrder(order)} className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10">
                        <XCircle className="w-4 h-4" />Cancel
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => handlePrint(order)} className="gap-2"><Printer className="w-4 h-4" />Print Receipt</Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Print Receipt */}
      {selectedOrder && (
        <div ref={printRef} className="hidden print:block p-8 bg-white text-black">
          <div className="text-center mb-8"><h1 className="text-2xl font-bold">Techy Pad</h1><p className="text-gray-600">Order Receipt</p></div>
          <div className="border-t border-b border-gray-300 py-4 my-4">
            <div className="grid grid-cols-2 gap-4"><p><strong>Order ID:</strong> {selectedOrder.order_id}</p><p><strong>Date:</strong> {new Date(selectedOrder.created_at).toLocaleDateString()}</p><p><strong>Payment ID:</strong> {selectedOrder.payment_id}</p><p><strong>Status:</strong> {selectedOrder.order_status}</p></div>
          </div>
          <div className="my-4"><h2 className="font-bold mb-2">Customer Details</h2><p>{selectedOrder.customer_name}</p><p>{selectedOrder.customer_email}</p><p>{selectedOrder.customer_phone}</p><p>{selectedOrder.shipping_address}</p><p>{selectedOrder.city}, {selectedOrder.state} {selectedOrder.zip_code}</p><p>{selectedOrder.country}</p></div>
          <div className="border-t border-gray-300 pt-4"><div className="flex justify-between"><span>{selectedOrder.product_name} x {selectedOrder.quantity}</span><span>₹{selectedOrder.product_price}</span></div><div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t"><span>Total</span><span>₹{selectedOrder.total_amount}</span></div></div>
          <div className="mt-8 text-center text-gray-500 text-sm"><p>Thank you for your order!</p><p>Estimated shipping: Q2 2025</p></div>
        </div>
      )}
    </div>
  );
};

export default Admin;