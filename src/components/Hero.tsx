import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { Link } from 'react-router-dom';
import macropadHero from '@/assets/macropad-hero.png';

const Hero = () => {
  const { addToCart, isInCart, hasOrdered } = useCart();

  const handlePreOrder = () => {
    if (!isInCart('macropad-pro') && !hasOrdered) {
      addToCart({
        id: 'macropad-pro',
        name: 'MacroPad Pro',
        price: 149,
        image: macropadHero
      });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 bg-background">
      {/* Minimal white glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[400px] md:w-[500px] h-[300px] sm:h-[400px] md:h-[500px] bg-foreground/5 rounded-full blur-[100px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Large Product Image First */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="relative mb-12"
        >
          <div className="relative max-w-2xl lg:max-w-3xl mx-auto">
            {/* Subtle glow behind product */}
            <div className="absolute inset-0 bg-foreground/10 rounded-full blur-[80px] scale-75" />

            {/* Product image with black background blend */}
            <div className="relative bg-background">
              <img
                src={macropadHero}
                alt="MacroPad Pro"
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
            className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
          >
            The Future of
            <span className="block text-foreground">Macro Control</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-base sm:text-lg text-muted-foreground mb-8 max-w-lg mx-auto"
          >
            A premium macro pad featuring a built-in LCD display, programmable keys,
            and endless customization. Designed for creators, developers, and power users.
          </motion.p>

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
            ) : isInCart('macropad-pro') ? (
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
                Pre-Order Now — $149
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
    </section>
  );
};

export default Hero;
