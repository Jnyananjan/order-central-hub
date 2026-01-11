import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Truck, Shield, AlertTriangle } from 'lucide-react';
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
import { PRODUCT_CONFIG, getProductPrice, validatePrice } from '@/config/products';
import { z } from 'zod';

declare global {
  interface Window {
    Razorpay: any;
  }
}

// Validation schema with strict rules
const checkoutSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(50, 'First name too long').regex(/^[a-zA-Z\s'-]+$/, 'Invalid characters in name'),
  lastName: z.string().trim().min(1, 'Last name is required').max(50, 'Last name too long').regex(/^[a-zA-Z\s'-]+$/, 'Invalid characters in name'),
  email: z.string().trim().email('Invalid email address').max(100, 'Email too long'),
  phone: z.string().trim().min(10, 'Phone must be at least 10 digits').max(15, 'Phone too long').regex(/^[0-9+\-\s()]+$/, 'Invalid phone number'),
  address: z.string().trim().min(5, 'Address is required').max(200, 'Address too long'),
  city: z.string().trim().min(2, 'City is required').max(50, 'City name too long').regex(/^[a-zA-Z\s'-]+$/, 'Invalid city name'),
  state: z.string().trim().min(2, 'State is required').max(50, 'State name too long').regex(/^[a-zA-Z\s'-]+$/, 'Invalid state name'),
  zip: z.string().trim().regex(/^[0-9]{6}$/, 'PIN code must be exactly 6 digits'),
  country: z.string().trim().min(2, 'Country is required').max(50, 'Country name too long'),
});

const Checkout = () => {
  const { items, clearCart, setHasOrdered } = useCart();
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

  // SECURITY: Get price from server-side config, NOT from cart
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    
    // For ZIP, only allow numbers and max 6 digits
    if (id === 'zip') {
      const numericValue = value.replace(/\D/g, '').slice(0, 6);
      setFormData(prev => ({ ...prev, [id]: numericValue }));
    } else if (id === 'phone') {
      // Only allow phone-valid characters
      const phoneValue = value.replace(/[^0-9+\-\s()]/g, '');
      setFormData(prev => ({ ...prev, [id]: phoneValue }));
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }
    
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

    if (items.length === 0) {
      toast({
        title: 'Cart Empty',
        description: 'Your cart is empty.',
        variant: 'destructive'
      });
      navigate('/');
      return;
    }

    // SECURITY: Validate product exists and price matches
    const productId = items[0]?.id;
    const cartPrice = items[0]?.price;
    
    if (!productId || !validatePrice(productId, cartPrice)) {
      toast({
        title: 'Price Mismatch Detected',
        description: 'The price has been updated. Please refresh and try again.',
        variant: 'destructive'
      });
      clearCart();
      navigate('/');
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
        description: 'Payment gateway is not configured.',
        variant: 'destructive'
      });
      return;
    }

    // SECURITY: Final price check before payment
    if (securePrice <= 0 || securePrice !== PRODUCT_CONFIG.TECHY_PAD.salePrice) {
      toast({
        title: 'Invalid Price',
        description: 'Something went wrong. Please try again.',
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

    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    // SECURITY: Use server-side price, converted to paise
    const amountInPaise = securePrice * 100;

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: amountInPaise,
      currency: 'INR',
      name: 'Techy Pad',
      description: `Pre-Order: ${PRODUCT_CONFIG.TECHY_PAD.name}`,
      order_id: '', // In production, this should come from your server
      handler: async function(response: any) {
        // SECURITY: Verify payment_id exists
        if (!response.razorpay_payment_id) {
          toast({
            title: 'Payment Error',
            description: 'Payment verification failed.',
            variant: 'destructive'
          });
          navigate('/payment-failed');
          return;
        }

        const order = {
          order_id: orderId,
          customer_name: `${formData.firstName.trim()} ${formData.lastName.trim()}`.substring(0, 100),
          customer_email: formData.email.trim().toLowerCase(),
          customer_phone: formData.phone.trim().replace(/[^0-9+]/g, ''),
          shipping_address: formData.address.trim().substring(0, 200),
          city: formData.city.trim().substring(0, 50),
          state: formData.state.trim().substring(0, 50),
          zip_code: formData.zip.trim(),
          country: formData.country.trim().substring(0, 50),
          product_name: PRODUCT_CONFIG.TECHY_PAD.name,
          product_price: securePrice, // SECURITY: Server-side price
          quantity: 1,
          total_amount: securePrice, // SECURITY: Server-side price
          payment_id: response.razorpay_payment_id,
          payment_status: 'completed',
          order_status: 'confirmed'
        };

        const savedOrder = await addOrder(order);
        if (savedOrder) {
          clearCart();
          setHasOrdered(true);
          navigate('/payment-success', { state: { orderId, paymentId: response.razorpay_payment_id } });
        } else {
          toast({
            title: 'Order Error',
            description: 'Payment received but order save failed. Contact support with your payment ID.',
            variant: 'destructive'
          });
        }
      },
      modal: {
        ondismiss: function() {
          setIsProcessing(false);
        },
        escape: false,
        backdropclose: false
      },
      prefill: {
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        email: formData.email.trim(),
        contact: formData.phone.trim().replace(/[^0-9+]/g, '')
      },
      theme: { color: '#000000' },
      notes: {
        order_id: orderId,
        product_id: PRODUCT_CONFIG.TECHY_PAD.id
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.on('payment.failed', function(response: any) {
      console.error('Payment failed:', response.error?.code);
      toast({
        title: 'Payment Failed',
        description: response.error?.description || 'Payment was unsuccessful.',
        variant: 'destructive'
      });
      setIsProcessing(false);
    });
    razorpay.open();
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

  // SECURITY: If price validation fails, show error
  if (securePrice <= 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h1 className="font-display text-2xl font-bold mb-4">Invalid Product</h1>
            <p className="text-muted-foreground mb-6">Unable to verify product price. Please try again.</p>
            <Link to="/"><Button onClick={() => clearCart()}>Return to Home</Button></Link>
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
                        <Input id="firstName" value={formData.firstName} onChange={handleInputChange} className={errors.firstName ? 'border-destructive' : ''} autoComplete="given-name" />
                        {errors.firstName && <p className="text-destructive text-sm">{errors.firstName}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" value={formData.lastName} onChange={handleInputChange} className={errors.lastName ? 'border-destructive' : ''} autoComplete="family-name" />
                        {errors.lastName && <p className="text-destructive text-sm">{errors.lastName}</p>}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={formData.email} onChange={handleInputChange} className={errors.email ? 'border-destructive' : ''} autoComplete="email" />
                      {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" value={formData.phone} onChange={handleInputChange} className={errors.phone ? 'border-destructive' : ''} autoComplete="tel" />
                      {errors.phone && <p className="text-destructive text-sm">{errors.phone}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" value={formData.address} onChange={handleInputChange} className={errors.address ? 'border-destructive' : ''} autoComplete="street-address" />
                      {errors.address && <p className="text-destructive text-sm">{errors.address}</p>}
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" value={formData.city} onChange={handleInputChange} className={errors.city ? 'border-destructive' : ''} autoComplete="address-level2" />
                        {errors.city && <p className="text-destructive text-sm">{errors.city}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input id="state" value={formData.state} onChange={handleInputChange} className={errors.state ? 'border-destructive' : ''} autoComplete="address-level1" />
                        {errors.state && <p className="text-destructive text-sm">{errors.state}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zip">PIN Code</Label>
                        <Input 
                          id="zip" 
                          value={formData.zip} 
                          onChange={handleInputChange} 
                          className={errors.zip ? 'border-destructive' : ''} 
                          maxLength={6}
                          inputMode="numeric"
                          pattern="[0-9]{6}"
                          placeholder="6 digits"
                          autoComplete="postal-code"
                        />
                        {errors.zip && <p className="text-destructive text-sm">{errors.zip}</p>}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input id="country" value={formData.country} onChange={handleInputChange} className={errors.country ? 'border-destructive' : ''} autoComplete="country-name" />
                      {errors.country && <p className="text-destructive text-sm">{errors.country}</p>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Shield className="w-4 h-4" /><span>Secure payment via Razorpay</span></div>
                <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>{isProcessing ? 'Processing...' : `Pay ${formatPrice(securePrice)}`}</Button>
              </form>
              <div className="glass-card p-6 sticky top-24">
                <h2 className="font-display font-semibold text-lg mb-6">Order Summary</h2>
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border/50">
                  <div className="w-16 h-16 bg-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                    <img src={items[0]?.image} alt={PRODUCT_CONFIG.TECHY_PAD.name} className="w-12 h-12 object-contain" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{PRODUCT_CONFIG.TECHY_PAD.name}</h3>
                    <p className="text-sm text-muted-foreground">Qty: 1</p>
                  </div>
                  <p className="font-semibold">{formatPrice(securePrice)}</p>
                </div>
                <div className="space-y-3 mt-6">
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(securePrice)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Shipping</span><span>Free</span></div>
                  <div className="border-t border-border/50 pt-3 flex justify-between"><span className="font-semibold">Total</span><span className="font-display font-bold text-xl">{formatPrice(securePrice)}</span></div>
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
