import { motion } from 'framer-motion';
import macropadHero from '@/assets/macropad-hero.png';
import macropadSide from '@/assets/macropad-side.png';

const DeviceDescription = () => {
  return (
    <section className="py-16 sm:py-24 relative overflow-hidden bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Engineered for Excellence
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Every component designed with precision and purpose
          </p>
        </motion.div>

        {/* Body Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-2 gap-8 items-center mb-20"
        >
          <div className="relative">
            <div className="border border-foreground/20 rounded-2xl overflow-hidden p-4">
              <img
                src={macropadHero}
                alt="MacroPad Body"
                className="w-full object-contain mix-blend-lighten"
              />
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-display text-2xl font-semibold">Premium Body</h3>
            <p className="text-muted-foreground leading-relaxed">
              Crafted from high-quality matte plastic with a soft-touch finish that feels great in your hands. 
              The compact design fits perfectly on any desk while providing maximum functionality.
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-foreground rounded-full" />
                Lightweight yet durable construction
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-foreground rounded-full" />
                Anti-slip rubber feet for stability
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-foreground rounded-full" />
                Minimal footprint design
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Display Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-2 gap-8 items-center"
        >
          <div className="space-y-4 order-2 md:order-1">
            <h3 className="font-display text-2xl font-semibold">Vibrant Display</h3>
            <p className="text-muted-foreground leading-relaxed">
              The 2.4" IPS LCD screen brings your macros to life with vivid colors and sharp details. 
              Display custom icons, system stats, or animations that make your workflow more intuitive.
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-foreground rounded-full" />
                320x240 pixel resolution
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-foreground rounded-full" />
                Wide viewing angles
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-foreground rounded-full" />
                Customizable brightness levels
              </li>
            </ul>
          </div>
          <div className="relative order-1 md:order-2">
            <div className="border border-foreground/20 rounded-2xl overflow-hidden p-4">
              <img
                src={macropadSide}
                alt="MacroPad Display"
                className="w-full object-contain mix-blend-lighten"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DeviceDescription;
