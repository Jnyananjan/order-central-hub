import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-background overflow-x-hidden">
    <Navbar />
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <Link to="/"><Button variant="ghost" size="sm" className="gap-2 mb-8 text-muted-foreground hover:text-foreground"><ArrowLeft className="w-4 h-4" />Back to Home</Button></Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-8">Privacy Policy</h1>
          <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
            <p className="text-lg">Last updated: January 2025</p>
            <h2 className="text-xl font-semibold text-foreground mt-8">1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact our support team.</p>
          </div>
        </motion.div>
      </div>
    </main>
    <Footer />
  </div>
);

export default PrivacyPolicy;
