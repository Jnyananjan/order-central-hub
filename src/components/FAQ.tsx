import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'What is MacroPad Pro?',
    answer: 'MacroPad Pro is a premium macro pad featuring a built-in 2.4" LCD display, 12 programmable mechanical keys, and endless customization options. It\'s designed for creators, developers, streamers, and power users who want to boost their productivity.'
  },
  {
    question: 'What switches does the MacroPad Pro use?',
    answer: 'The MacroPad Pro uses hot-swappable mechanical switches, allowing you to easily swap them out for your preferred switches without soldering. It comes with high-quality linear switches by default.'
  },
  {
    question: 'Is the MacroPad Pro compatible with my operating system?',
    answer: 'Yes! MacroPad Pro is fully compatible with Windows, macOS, and Linux. Our configuration software works across all major platforms.'
  },
  {
    question: 'How do I customize the LCD display?',
    answer: 'You can customize the LCD display using our intuitive configuration software. Choose from preset themes, display custom images, show system stats, or create your own animations. The possibilities are endless!'
  },
  {
    question: 'What connectivity options are available?',
    answer: 'MacroPad Pro connects via USB-C for low-latency wired connection and also supports Bluetooth 5.0 for wireless convenience. You can switch between modes seamlessly.'
  },
  {
    question: 'Can I program complex macros?',
    answer: 'Absolutely! Our software allows you to create complex multi-step macros, including delays, key combinations, text strings, and even conditional logic. You can also import and export macro profiles.'
  },
  {
    question: 'What is the warranty period?',
    answer: 'MacroPad Pro comes with a 2-year manufacturer warranty covering defects in materials and workmanship. We also offer a 30-day return policy if you\'re not completely satisfied.'
  },
  {
    question: 'When will my pre-order ship?',
    answer: 'Pre-orders are expected to ship in Q2 2025. You will receive an email with tracking information once your order ships. Early pre-order customers will receive priority shipping.'
  },
  {
    question: 'Do you ship internationally?',
    answer: 'Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location. Import duties and taxes may apply depending on your country\'s regulations.'
  },
  {
    question: 'How can I contact support?',
    answer: 'You can reach our support team via email or through our Discord community. We typically respond within 24 hours on business days.'
  }
];

const FAQ = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="faq" className="py-16 sm:py-24 relative overflow-hidden bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-12">
            <span className="text-muted-foreground text-sm font-medium mb-4 block uppercase tracking-wider">
              Got Questions?
            </span>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold">
              Frequently Asked Questions
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <AccordionItem 
                  value={`item-${index}`} 
                  className="glass-card border border-border/50 px-6 rounded-xl overflow-hidden"
                >
                  <AccordionTrigger className="text-left font-medium hover:no-underline py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
