import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const updates = [
  { id: '1', title: 'Firmware v2.0 Released', description: 'Major update with improved latency and new display features.', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop', date: 'January 5, 2025' },
  { id: '2', title: 'New Software Configurator', description: 'Redesigned interface with drag-and-drop macro creation.', image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop', date: 'December 28, 2024' },
  { id: '3', title: 'Community Macros Library', description: 'Share and download macros created by the community.', image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=400&fit=crop', date: 'December 15, 2024' },
];

const Updates = () => (
  <div className="min-h-screen bg-background overflow-x-hidden">
    <Navbar />
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/"><Button variant="ghost" size="sm" className="gap-2 mb-8 text-muted-foreground hover:text-foreground"><ArrowLeft className="w-4 h-4" />Back to Home</Button></Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Updates</h1>
          <p className="text-muted-foreground text-lg mb-12 max-w-2xl">Stay up to date with the latest firmware updates and software releases.</p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {updates.map((update, index) => (
            <motion.div key={update.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} className="glass-card overflow-hidden group">
              <div className="aspect-video overflow-hidden"><img src={update.image} alt={update.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>
              <div className="p-6"><p className="text-sm text-muted-foreground mb-2">{update.date}</p><h3 className="font-display text-lg font-semibold mb-2">{update.title}</h3><p className="text-muted-foreground text-sm">{update.description}</p></div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Updates;
