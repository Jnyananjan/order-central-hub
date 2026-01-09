import { motion } from 'framer-motion';
import { XCircle, ArrowLeft, RefreshCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const PaymentFailed = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-lg text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-24 h-24 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <XCircle className="w-12 h-12 text-destructive" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Payment Cancelled
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Your payment was cancelled or failed. No charges have been made to your account.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6 mb-8"
          >
            <h2 className="font-display font-semibold mb-3">What happened?</h2>
            <ul className="text-left text-muted-foreground space-y-2 text-sm">
              <li>• The payment was cancelled before completion</li>
              <li>• There might have been an issue with your payment method</li>
              <li>• The transaction may have timed out</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/cart">
              <Button size="lg" className="gap-2 w-full sm:w-auto">
                <RefreshCcw className="w-4 h-4" />
                Try Again
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-muted-foreground mt-8"
          >
            Need help? <Link to="/contact" className="text-blue-500 hover:underline">Contact our support team</Link>
          </motion.p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentFailed;
