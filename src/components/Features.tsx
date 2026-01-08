import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Monitor, Cpu, Palette, Keyboard, Settings, Zap } from 'lucide-react';

const features = [
  {
    icon: Monitor,
    title: 'Built-in LCD Display',
    description: 'A vibrant 2.4" LCD screen displays custom graphics, system stats, or shortcut labels in real-time.',
  },
  {
    icon: Keyboard,
    title: '12 Programmable Keys',
    description: 'Hot-swappable mechanical switches with per-key customization. Map any macro, shortcut, or action.',
  },
  {
    icon: Palette,
    title: 'Premium Plastic Build',
    description: 'High-quality matte plastic housing with a soft-touch finish. Lightweight yet durable design.',
  },
  {
    icon: Cpu,
    title: 'Powerful Processor',
    description: 'ARM Cortex-M4 processor handles complex macros and display updates with zero lag.',
  },
  {
    icon: Settings,
    title: 'Intuitive Software',
    description: 'Cross-platform configuration app for creating profiles, animations, and automations.',
  },
  {
    icon: Zap,
    title: '1ms Response Time',
    description: 'Ultra-low latency input ensures your commands are executed instantly.',
  },
];

const FeatureCard = ({ feature, index }: { feature: typeof features[0]; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="glass-card p-6 group hover:border-foreground/30 transition-all duration-300"
    >
      <div className="w-12 h-12 rounded-xl bg-foreground/10 flex items-center justify-center mb-4 group-hover:bg-foreground/20 transition-colors">
        <feature.icon className="w-6 h-6" />
      </div>
      <h3 className="font-display text-lg font-semibold mb-2">{feature.title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
    </motion.div>
  );
};

const Features = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="features" className="py-16 sm:py-24 relative overflow-hidden bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="text-muted-foreground text-sm font-medium mb-4 block uppercase tracking-wider">
            Features
          </span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold">
            Designed for Performance
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
