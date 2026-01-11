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
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/contexts/OrderContext';
import { useToast } from '@/hooks/use-toast';
import { RAZORPAY_KEY_ID, razorpayConfigured } from '@/config/razorpay';
import { z } from 'zod';

declare global {
  interface Window {
    Razorpay: any;
  }
}

// Validation schema
const checkoutSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(50, 'First name too long'),
  lastName: z.string().trim().min(1, 'Last name is required').max(50, 'Last name too long'),
  email: z.string().trim().email('Invalid email address').max(100, 'Email too long'),
  phone: z.string().trim().min(10, 'Phone must be at least 10 digits').max(15, 'Phone too long').regex(/^[0-9+\-\s()]+$/, 'Invalid phone number'),
  address: z.string().trim().min(5, 'Address is required').max(200, 'Address too long'),
  city: z.string().trim().min(2, 'City is required').max(50, 'City name too long'),
  state: z.string().trim().min(2, 'State is required').max(50, 'State name too long'),
  zip: z.string().trim().regex(/^[0-9]{6}$/, 'PIN code must be exactly 6 digits'),
  country: z.string().trim().min(2, 'Country is required').max(50, 'Country name too long'),
});

const Checkout = () => {
  const { items, totalPrice, clearCart, setHasOrdered } = useCart();
  const { user } = useAuth();
  const { addOrder } = useOrders();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'India'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    
    // For ZIP, only allow numbers and max 6 digits
    if (id === 'zip') {
      const numericValue = value.replace(/\D/g, '').slice(0, 6);
      setFormData(prev => ({ ...prev, [id]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: '' }));
    }
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

  const validateForm = () => {
    try {
      checkoutSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Sign In Required',
        description: 'Please sign in to complete your order.',
        variant: 'destructive'
      });
      navigate('/auth');
      return;
    }

    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors in the form.',
        variant: 'destructive'
      });
      return;
    }

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
    const itemPrice = items[0]?.price || 6499;

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: itemPrice * 100,
      currency: 'INR',
      name: 'Techy Pad',
      description: 'Pre-Order Payment',
      order_id: '',
      handler: async function(response: any) {
        const order = {
          order_id: orderId,
          customer_name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
          customer_email: formData.email.trim(),
          customer_phone: formData.phone.trim(),
          shipping_address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          zip_code: formData.zip.trim(),
          country: formData.country.trim(),
          product_name: items[0]?.name || 'Techy Pad',
          product_price: itemPrice,
          quantity: 1,
          total_amount: itemPrice,
          payment_id: response.razorpay_payment_id,
          payment_status: 'completed',
          order_status: 'confirmed'
        };

        await addOrder(order);
        clearCart();
        setHasOrdered(true);
        navigate('/payment-success', { state: { orderId, paymentId: response.razorpay_payment_id } });
      },
      modal: {
        ondismiss: function() {
          setIsProcessing(false);
          navigate('/payment-failed');
        }
      },
      prefill: {
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        email: formData.email.trim(),
        contact: formData.phone.trim()
      },
      theme: { color: '#ffffff' }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.on('payment.failed', function() {
      navigate('/payment-failed');
    });
    razorpay.open();
    setIsProcessing(false);
  };

  const formatPrice = (price: number) => `₹${price.toLocaleString()}`;

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold mb-4">Sign In Required</h1>
            <p className="text-muted-foreground mb-6">Please sign in to proceed with checkout.</p>
            <Link to="/auth"><Button>Sign In</Button></Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" value={formData.firstName} onChange={handleInputChange} className={errors.firstName ? 'border-destructive' : ''} />
                        {errors.firstName && <p className="text-destructive text-sm">{errors.firstName}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" value={formData.lastName} onChange={handleInputChange} className={errors.lastName ? 'border-destructive' : ''} />
                        {errors.lastName && <p className="text-destructive text-sm">{errors.lastName}</p>}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={formData.email} onChange={handleInputChange} className={errors.email ? 'border-destructive' : ''} />
                      {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" value={formData.phone} onChange={handleInputChange} className={errors.phone ? 'border-destructive' : ''} />
                      {errors.phone && <p className="text-destructive text-sm">{errors.phone}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" value={formData.address} onChange={handleInputChange} className={errors.address ? 'border-destructive' : ''} />
                      {errors.address && <p className="text-destructive text-sm">{errors.address}</p>}
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" value={formData.city} onChange={handleInputChange} className={errors.city ? 'border-destructive' : ''} />
                        {errors.city && <p className="text-destructive text-sm">{errors.city}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input id="state" value={formData.state} onChange={handleInputChange} className={errors.state ? 'border-destructive' : ''} />
                        {errors.state && <p className="text-destructive text-sm">{errors.state}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zip">PIN Code (6 digits)</Label>
                        <Input 
                          id="zip" 
                          value={formData.zip} 
                          onChange={handleInputChange} 
                          className={errors.zip ? 'border-destructive' : ''} 
                          maxLength={6}
                          inputMode="numeric"
                          pattern="[0-9]{6}"
                          placeholder="123456"
                        />
                        {errors.zip && <p className="text-destructive text-sm">{errors.zip}</p>}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input id="country" value={formData.country} onChange={handleInputChange} className={errors.country ? 'border-destructive' : ''} />
                      {errors.country && <p className="text-destructive text-sm">{errors.country}</p>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Shield className="w-4 h-4" /><span>Secure payment via Razorpay</span></div>
                <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>{isProcessing ? 'Processing...' : `Pay ${formatPrice(totalPrice)}`}</Button>
              </form>
              <div className="glass-card p-6 sticky top-24">
                <h2 className="font-display font-semibold text-lg mb-6">Order Summary</h2>
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 mb-4 pb-4 border-b border-border/50">
                    <div className="w-16 h-16 bg-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-contain" />
                    </div>
                    <div className="flex-1"><h3 className="font-medium">{item.name}</h3><p className="text-sm text-muted-foreground">Qty: {item.quantity}</p></div>
                    <p className="font-semibold">{formatPrice(item.price)}</p>
                  </div>
                ))}
                <div className="space-y-3 mt-6">
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(totalPrice)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Shipping</span><span>Free</span></div>
                  <div className="border-t border-border/50 pt-3 flex justify-between"><span className="font-semibold">Total</span><span className="font-display font-bold text-xl">{formatPrice(totalPrice)}</span></div>
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
