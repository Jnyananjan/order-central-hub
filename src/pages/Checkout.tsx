import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Truck, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/contexts/CartContext';
import { useOrders } from '@/contexts/OrderContext';
import { useToast } from '@/hooks/use-toast';
import { RAZORPAY_KEY_ID, razorpayConfigured } from '@/config/razorpay';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Checkout = () => {
  const { items, totalPrice, clearCart, setHasOrdered } = useCart();
  const { addOrder } = useOrders();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'India'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  const loadRazorpay = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!razorpayConfigured) {
      toast({
        title: 'Razorpay Not Configured',
        description: 'Please add your Razorpay key in src/config/razorpay.ts',
        variant: 'destructive'
      });
      return;
    }

    setIsProcessing(true);
    const loaded = await loadRazorpay();
    
    if (!loaded) {
      toast({
        title: 'Error',
        description: 'Failed to load payment gateway',
        variant: 'destructive'
      });
      setIsProcessing(false);
      return;
    }

    const orderId = `ORD-${Date.now()}`;
    const amountInPaise = totalPrice * 100;

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: amountInPaise,
      currency: 'INR',
      name: 'MacroPad Pro',
      description: 'Pre-Order Payment',
      order_id: '',
      handler: async function(response: any) {
        const order = {
          order_id: orderId,
          customer_name: `${formData.firstName} ${formData.lastName}`,
          customer_email: formData.email,
          customer_phone: formData.phone,
          shipping_address: formData.address,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zip,
          country: formData.country,
          product_name: items[0]?.name || 'MacroPad Pro',
          product_price: items[0]?.price || 149,
          quantity: 1,
          total_amount: totalPrice,
          payment_id: response.razorpay_payment_id,
          payment_status: 'completed',
          order_status: 'confirmed'
        };

        await addOrder(order);
        clearCart();
        setHasOrdered(true);
        navigate('/payment-success', { state: { orderId, paymentId: response.razorpay_payment_id } });
      },
      prefill: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        contact: formData.phone
      },
      theme: { color: '#ffffff' }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
    setIsProcessing(false);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold mb-4">No items in cart</h1>
            <Link to="/"><Button>Return to Home</Button></Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Link to="/cart" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
              <ArrowLeft className="w-4 h-4" />Back to Cart
            </Link>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">Checkout</h1>
            <div className="grid lg:grid-cols-2 gap-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="glass-card p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Truck className="w-5 h-5 text-primary" />
                    <h2 className="font-display font-semibold text-lg">Shipping Information</h2>
                  </div>
                  <div className="grid gap-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2"><Label htmlFor="firstName">First Name</Label><Input id="firstName" value={formData.firstName} onChange={handleInputChange} required /></div>
                      <div className="space-y-2"><Label htmlFor="lastName">Last Name</Label><Input id="lastName" value={formData.lastName} onChange={handleInputChange} required /></div>
                    </div>
                    <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={formData.email} onChange={handleInputChange} required /></div>
                    <div className="space-y-2"><Label htmlFor="phone">Phone Number</Label><Input id="phone" type="tel" value={formData.phone} onChange={handleInputChange} required /></div>
                    <div className="space-y-2"><Label htmlFor="address">Address</Label><Input id="address" value={formData.address} onChange={handleInputChange} required /></div>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="space-y-2"><Label htmlFor="city">City</Label><Input id="city" value={formData.city} onChange={handleInputChange} required /></div>
                      <div className="space-y-2"><Label htmlFor="state">State</Label><Input id="state" value={formData.state} onChange={handleInputChange} required /></div>
                      <div className="space-y-2"><Label htmlFor="zip">ZIP Code</Label><Input id="zip" value={formData.zip} onChange={handleInputChange} required /></div>
                    </div>
                    <div className="space-y-2"><Label htmlFor="country">Country</Label><Input id="country" value={formData.country} onChange={handleInputChange} required /></div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Shield className="w-4 h-4" /><span>Secure payment via Razorpay</span></div>
                <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>{isProcessing ? 'Processing...' : `Pay ₹${totalPrice * 83}`}</Button>
              </form>
              <div className="glass-card p-6 sticky top-24">
                <h2 className="font-display font-semibold text-lg mb-6">Order Summary</h2>
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 mb-4 pb-4 border-b border-border/50">
                    <div className="w-16 h-16 bg-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-contain" />
                    </div>
                    <div className="flex-1"><h3 className="font-medium">{item.name}</h3><p className="text-sm text-muted-foreground">Qty: {item.quantity}</p></div>
                    <p className="font-semibold">${item.price}</p>
                  </div>
                ))}
                <div className="space-y-3 mt-6">
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>${totalPrice}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Shipping</span><span>Free</span></div>
                  <div className="border-t border-border/50 pt-3 flex justify-between"><span className="font-semibold">Total</span><span className="font-display font-bold text-xl">${totalPrice}</span></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
