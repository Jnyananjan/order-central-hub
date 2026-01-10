import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Link, useNavigate } from 'react-router-dom';
import macropadHero from '@/assets/macropad-hero.png';

const ORIGINAL_PRICE = 10000; // INR
const SALE_PRICE = 7499; // INR
const DISCOUNT_PERCENT = Math.round(((ORIGINAL_PRICE - SALE_PRICE) / ORIGINAL_PRICE) * 100);

const Hero = () => {
  const { addToCart, isInCart, hasOrdered } = useCart();
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  const handlePreOrder = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (!isInCart('techypad-pro') && !hasOrdered) {
      addToCart({
        id: 'techypad-pro',
        name: 'Techy Pad',
        price: SALE_PRICE,
        image: macropadHero
      });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 bg-background">
      {/* Minimal white glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[400px] md:w-[500px] h-[300px] sm:h-[400px] md:h-[500px] bg-foreground/5 rounded-full blur-[100px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Desktop Layout - Side by Side */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
          {/* Text Content - Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            >
              The Future of
              <span className="block text-foreground">Macro Control</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-muted-foreground mb-6 max-w-lg"
            >
              A premium macro pad featuring a built-in LCD display, programmable keys,
              and endless customization. Designed for creators, developers, and power users.
            </motion.p>

            {/* Price Display */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mb-8 flex items-center gap-4"
            >
              <span className="text-3xl font-bold text-foreground">{formatPrice(SALE_PRICE)}</span>
              <span className="text-xl text-muted-foreground line-through">{formatPrice(ORIGINAL_PRICE)}</span>
              <span className="bg-green-500/20 text-green-500 px-3 py-1 rounded-full text-sm font-semibold">
                {DISCOUNT_PERCENT}% OFF
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              {hasOrdered ? (
                <Button
                  size="lg"
                  className="text-base px-10 bg-muted text-muted-foreground cursor-not-allowed font-semibold"
                  disabled
                >
                  Already Ordered
                </Button>
              ) : isInCart('techypad-pro') ? (
                <Link to="/cart">
                  <Button
                    size="lg"
                    className="text-base px-10 bg-foreground text-background hover:bg-foreground/90 font-semibold"
                  >
                    View Cart
                  </Button>
                </Link>
              ) : (
                <Button
                  size="lg"
                  className="text-base px-10 bg-foreground text-background hover:bg-foreground/90 font-semibold"
                  onClick={handlePreOrder}
                >
                  {user ? `Pre-Order Now — ${formatPrice(SALE_PRICE)}` : 'Sign In to Pre-Order'}
                </Button>
              )}
              <a href="#features">
                <Button variant="outline" size="lg" className="text-base px-8 border-border hover:bg-secondary">
                  Learn More
                </Button>
              </a>
            </motion.div>
          </motion.div>

          {/* Product Image - Right Side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="relative"
          >
            <div className="relative max-w-xl mx-auto">
              <div className="absolute inset-0 bg-foreground/10 rounded-full blur-[80px] scale-75" />
              <div className="relative bg-background">
                <img
                  src={macropadHero}
                  alt="Techy Pad"
                  className="w-full h-full object-contain mix-blend-lighten"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Mobile/Tablet Layout - Stacked */}
        <div className="lg:hidden">
          {/* Large Product Image First */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="relative mb-12"
          >
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-0 bg-foreground/10 rounded-full blur-[80px] scale-75" />
              <div className="relative bg-background">
                <img
                  src={macropadHero}
                  alt="Techy Pad"
                  className="w-full h-full object-contain mix-blend-lighten"
                />
              </div>
            </div>
          </motion.div>

          {/* Content below image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight"
            >
              The Future of
              <span className="block text-foreground">Macro Control</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-base sm:text-lg text-muted-foreground mb-6 max-w-lg mx-auto"
            >
              A premium macro pad featuring a built-in LCD display, programmable keys,
              and endless customization. Designed for creators, developers, and power users.
            </motion.p>

            {/* Price Display Mobile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="mb-8 flex items-center justify-center gap-3 flex-wrap"
            >
              <span className="text-2xl sm:text-3xl font-bold text-foreground">{formatPrice(SALE_PRICE)}</span>
              <span className="text-lg text-muted-foreground line-through">{formatPrice(ORIGINAL_PRICE)}</span>
              <span className="bg-green-500/20 text-green-500 px-3 py-1 rounded-full text-sm font-semibold">
                {DISCOUNT_PERCENT}% OFF
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              {hasOrdered ? (
                <Button
                  size="lg"
                  className="text-base px-10 bg-muted text-muted-foreground cursor-not-allowed font-semibold"
                  disabled
                >
                  Already Ordered
                </Button>
              ) : isInCart('techypad-pro') ? (
                <Link to="/cart">
                  <Button
                    size="lg"
                    className="text-base px-10 bg-foreground text-background hover:bg-foreground/90 font-semibold"
                  >
                    View Cart
                  </Button>
                </Link>
              ) : (
                <Button
                  size="lg"
                  className="text-base px-10 bg-foreground text-background hover:bg-foreground/90 font-semibold"
                  onClick={handlePreOrder}
                >
                  {user ? `Pre-Order Now — ${formatPrice(SALE_PRICE)}` : 'Sign In to Pre-Order'}
                </Button>
              )}
              <a href="#features">
                <Button variant="outline" size="lg" className="text-base px-8 border-border hover:bg-secondary">
                  Learn More
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;