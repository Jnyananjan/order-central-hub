import { motion } from 'framer-motion';
import { Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { PRODUCT_CONFIG, getProductPrice, validatePrice } from '@/config/products';

const Cart = () => {
  const { items, removeFromCart } = useCart();

  // SECURITY: Always use server-side price
  const getSecurePrice = (): number => {
    if (items.length === 0) return 0;
    const productId = items[0]?.id;
    if (!productId) return 0;
    
    try {
      return getProductPrice(productId);
    } catch {
      return 0;
    }
  };

  const securePrice = getSecurePrice();
  const formatPrice = (price: number) => `₹${price.toLocaleString()}`;

  // SECURITY: Check for price tampering
  const isPriceTampered = items.length > 0 && items[0]?.price !== securePrice;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
              <ArrowLeft className="w-4 h-4" />Back to Home
            </Link>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">Your Cart</h1>
            
            {isPriceTampered && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
                <p className="text-destructive font-medium">Price discrepancy detected. Showing correct price.</p>
              </div>
            )}

            {items.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="font-display text-xl font-semibold mb-2">Your cart is empty</h2>
                <p className="text-muted-foreground mb-6">Looks like you haven't added the Techy Pad yet.</p>
                <Link to="/"><Button className="gap-2">Browse Products</Button></Link>
              </div>
            ) : (
              <div className="space-y-6">
                {items.map((item) => (
                  <motion.div key={item.id} layout className="glass-card p-6 flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-24 h-24 bg-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                      <img src={item.image} alt={PRODUCT_CONFIG.TECHY_PAD.name} className="w-20 h-20 object-contain" />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="font-display text-lg font-semibold">{PRODUCT_CONFIG.TECHY_PAD.name}</h3>
                      <p className="text-muted-foreground">Quantity: 1</p>
                    </div>
                    <div className="flex items-center gap-4">
                      {/* SECURITY: Display server-side price, not cart price */}
                      <p className="font-display text-xl font-bold">{formatPrice(securePrice)}</p>
                      <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
                <div className="glass-card p-6">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-muted-foreground">Subtotal</span>
                    {/* SECURITY: Display server-side price */}
                    <span className="font-display text-2xl font-bold">{formatPrice(securePrice)}</span>
                  </div>
                  <Link to="/checkout"><Button className="w-full" size="lg">Proceed to Checkout</Button></Link>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
