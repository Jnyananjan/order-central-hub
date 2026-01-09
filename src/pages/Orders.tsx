import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, ArrowLeft, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useOrders, Order } from '@/contexts/OrderContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Orders = () => {
  const { userOrders, fetchUserOrders, loading, cancelOrder } = useOrders();
  const { user } = useAuth();
  const { toast } = useToast();
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.email) {
      fetchUserOrders(user.email);
    }
  }, [user]);

  const handleCancelOrder = async (order: Order) => {
    if (order.order_status !== 'confirmed' && order.order_status !== 'pending') {
      toast({
        title: 'Cannot Cancel',
        description: 'This order cannot be cancelled as it is already being processed.',
        variant: 'destructive'
      });
      return;
    }

    setCancellingId(order.id);
    const success = await cancelOrder(order.id);
    
    if (success) {
      toast({
        title: 'Order Cancelled',
        description: 'Your order has been cancelled successfully.',
      });
      if (user?.email) {
        fetchUserOrders(user.email);
      }
    } else {
      toast({
        title: 'Cancellation Failed',
        description: 'Unable to cancel the order. Please try again or contact support.',
        variant: 'destructive'
      });
    }
    setCancellingId(null);
  };

  const canCancel = (status: string) => {
    return status === 'confirmed' || status === 'pending';
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />Back to Home
          </Link>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">Your Orders</h1>

          {!user ? (
            <div className="glass-card p-12 text-center">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="font-display text-xl font-semibold mb-2">Sign in to view orders</h2>
              <p className="text-muted-foreground mb-6">Please sign in to see your order history.</p>
              <Link to="/auth"><Button>Sign In</Button></Link>
            </div>
          ) : loading ? (
            <div className="text-center py-12"><p className="text-muted-foreground">Loading orders...</p></div>
          ) : userOrders.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="font-display text-xl font-semibold mb-2">No orders yet</h2>
              <p className="text-muted-foreground mb-6">You haven't placed any orders yet.</p>
              <Link to="/"><Button>Start Shopping</Button></Link>
            </div>
          ) : (
            <div className="space-y-4">
              {userOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-6"
                >
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Order ID</p>
                      <p className="font-mono font-medium">{order.order_id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Status</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(order.order_status)}`}>
                        {order.order_status}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-border/50">
                    <div>
                      <p className="font-medium">{order.product_name}</p>
                      <p className="text-sm text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-display font-bold text-xl">${order.total_amount}</p>
                      {canCancel(order.order_status) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelOrder(order)}
                          disabled={cancellingId === order.id}
                          className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <X className="w-4 h-4" />
                          {cancellingId === order.id ? 'Cancelling...' : 'Cancel'}
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Orders;
