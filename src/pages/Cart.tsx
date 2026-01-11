import { motion } from 'framer-motion';
import { Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';

const Cart = () => {
  const { items, removeFromCart, totalPrice } = useCart();

  const formatPrice = (price: number) => `₹${price.toLocaleString()}`;

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
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-contain" />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="font-display text-lg font-semibold">{item.name}</h3>
                      <p className="text-muted-foreground">Quantity: {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-display text-xl font-bold">{formatPrice(item.price)}</p>
                      <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
                <div className="glass-card p-6">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-display text-2xl font-bold">{formatPrice(totalPrice)}</span>
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
