import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Lock, Package, Printer, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useOrders, Order } from '@/contexts/OrderContext';
import { useToast } from '@/hooks/use-toast';

const ADMIN_EMAIL = 'jnyananjan@admin';
const ADMIN_PASSWORD = 'Jnyananjan@01';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { orders, fetchOrders, loading } = useOrders();
  const { toast } = useToast();
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthenticated) fetchOrders();
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast({ title: 'Welcome Admin!', description: 'You are now logged in.' });
    } else {
      toast({ title: 'Invalid Credentials', description: 'Please check your email and password.', variant: 'destructive' });
    }
  };

  const handlePrint = (order: Order) => {
    setSelectedOrder(order);
    setTimeout(() => window.print(), 100);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 w-full max-w-md">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-foreground/10 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8" />
            </div>
          </div>
          <h1 className="font-display text-2xl font-bold text-center mb-6">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
            <div className="space-y-2"><Label htmlFor="password">Password</Label><Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
            <Button type="submit" className="w-full">Login</Button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-card border-b border-border p-4 no-print">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="font-display text-xl font-bold">Admin Dashboard</h1>
          <Button variant="ghost" onClick={() => setIsAuthenticated(false)} className="gap-2"><LogOut className="w-4 h-4" />Logout</Button>
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
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div><p className="text-sm text-muted-foreground">Order ID</p><p className="font-mono">{order.order_id}</p></div>
                  <div><p className="text-sm text-muted-foreground">Customer</p><p className="font-medium">{order.customer_name}</p></div>
                  <div><p className="text-sm text-muted-foreground">Status</p><span className="px-2 py-1 bg-success/20 text-success rounded text-sm">{order.order_status}</span></div>
                </div>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div><p className="text-sm text-muted-foreground">Email</p><p>{order.customer_email}</p></div>
                  <div><p className="text-sm text-muted-foreground">Phone</p><p>{order.customer_phone}</p></div>
                  <div><p className="text-sm text-muted-foreground">Total</p><p className="font-bold">${order.total_amount}</p></div>
                </div>
                <div className="pt-4 border-t border-border/50 flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">{order.shipping_address}, {order.city}, {order.state} {order.zip_code}</p>
                  <Button variant="outline" size="sm" onClick={() => handlePrint(order)} className="gap-2"><Printer className="w-4 h-4" />Print Receipt</Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Print Receipt */}
      {selectedOrder && (
        <div ref={printRef} className="hidden print:block p-8 bg-white text-black">
          <div className="text-center mb-8"><h1 className="text-2xl font-bold">MacroPad Pro</h1><p className="text-gray-600">Order Receipt</p></div>
          <div className="border-t border-b border-gray-300 py-4 my-4">
            <div className="grid grid-cols-2 gap-4"><p><strong>Order ID:</strong> {selectedOrder.order_id}</p><p><strong>Date:</strong> {new Date(selectedOrder.created_at).toLocaleDateString()}</p><p><strong>Payment ID:</strong> {selectedOrder.payment_id}</p><p><strong>Status:</strong> {selectedOrder.order_status}</p></div>
          </div>
          <div className="my-4"><h2 className="font-bold mb-2">Customer Details</h2><p>{selectedOrder.customer_name}</p><p>{selectedOrder.customer_email}</p><p>{selectedOrder.customer_phone}</p><p>{selectedOrder.shipping_address}</p><p>{selectedOrder.city}, {selectedOrder.state} {selectedOrder.zip_code}</p><p>{selectedOrder.country}</p></div>
          <div className="border-t border-gray-300 pt-4"><div className="flex justify-between"><span>{selectedOrder.product_name} x {selectedOrder.quantity}</span><span>${selectedOrder.product_price}</span></div><div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t"><span>Total</span><span>${selectedOrder.total_amount}</span></div></div>
          <div className="mt-8 text-center text-gray-500 text-sm"><p>Thank you for your order!</p><p>Estimated shipping: Q2 2025</p></div>
        </div>
      )}
    </div>
  );
};

export default Admin;
