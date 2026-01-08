import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const specs = [
  { label: 'Display', value: '2.4" IPS LCD, 320x240px' },
  { label: 'Keys', value: '12 hot-swappable mechanical switches' },
  { label: 'Processor', value: 'ARM Cortex-M4 @ 168MHz' },
  { label: 'Connectivity', value: 'USB-C, Bluetooth 5.0' },
  { label: 'Material', value: 'High-quality matte plastic' },
  { label: 'Dimensions', value: '120 x 90 x 25mm' },
  { label: 'Weight', value: '180g' },
  { label: 'Compatibility', value: 'Windows, macOS, Linux' },
];

const Specs = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="specs" className="py-16 sm:py-24 relative overflow-hidden bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-12">
            <span className="text-muted-foreground text-sm font-medium mb-4 block uppercase tracking-wider">Specifications</span>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold">
              Built to Perform
            </h2>
          </div>

          <div className="space-y-0">
            {specs.map((spec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="flex justify-between py-4 border-b border-border/50 last:border-b-0"
              >
                <span className="text-muted-foreground">{spec.label}</span>
                <span className="font-medium text-right">{spec.value}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Specs;
