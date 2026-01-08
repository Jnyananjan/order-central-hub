import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const PaymentSuccess = () => {
  const location = useLocation();
  const { orderId, paymentId } = location.state || {};

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="glass-card p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-10 h-10 text-success" />
            </motion.div>

            <h1 className="font-display text-2xl md:text-3xl font-bold mb-4">
              Payment Successful!
            </h1>
            
            <p className="text-muted-foreground mb-6">
              Thank you for your pre-order! Your MacroPad Pro will be shipped when production begins.
            </p>

            {orderId && (
              <div className="bg-secondary/50 rounded-xl p-4 mb-6 text-left">
                <p className="text-sm text-muted-foreground mb-1">Order ID</p>
                <p className="font-mono font-medium">{orderId}</p>
                {paymentId && (
                  <>
                    <p className="text-sm text-muted-foreground mb-1 mt-3">Payment ID</p>
                    <p className="font-mono font-medium text-sm">{paymentId}</p>
                  </>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/orders" className="flex-1">
                <Button variant="outline" className="w-full gap-2">
                  <Package className="w-4 h-4" />
                  View Orders
                </Button>
              </Link>
              <Link to="/" className="flex-1">
                <Button className="w-full gap-2">
                  Continue Shopping
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
