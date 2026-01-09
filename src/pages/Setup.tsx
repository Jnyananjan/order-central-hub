import { motion } from 'framer-motion';
import { Download, Settings, Keyboard, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const downloadLinks = {
  windows: 'https://example.com/downloads/macropad-windows.exe',
  macos: 'https://example.com/downloads/macropad-macos.dmg',
  linux: 'https://example.com/downloads/macropad-linux.AppImage'
};

const steps = [
  { 
    icon: Download, 
    title: 'Download the Software', 
    description: (
      <>
        Get the MacroPad Configurator from our official website. Available for{' '}
        <a href={downloadLinks.windows} className="text-blue-500 hover:text-blue-400 font-semibold underline underline-offset-2">Windows</a>,{' '}
        <a href={downloadLinks.macos} className="text-blue-500 hover:text-blue-400 font-semibold underline underline-offset-2">macOS</a>, and{' '}
        <a href={downloadLinks.linux} className="text-blue-500 hover:text-blue-400 font-semibold underline underline-offset-2">Linux</a>.
      </>
    )
  },
  { icon: Settings, title: 'Connect Your Device', description: 'Plug in your MacroPad via USB-C. The software will automatically detect your device.' },
  { icon: Keyboard, title: 'Configure Your Keys', description: 'Assign macros, shortcuts, and custom functions to each key. Customize the display to show what you need.' },
  { icon: CheckCircle, title: 'Start Using', description: 'Save your configuration and start boosting your productivity. Your settings sync across devices.' },
];

const Setup = () => (
  <div className="min-h-screen bg-background overflow-x-hidden">
    <Navbar />
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/"><Button variant="ghost" size="sm" className="gap-2 mb-8 text-muted-foreground hover:text-foreground"><ArrowLeft className="w-4 h-4" />Back to Home</Button></Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Setup Guide</h1>
          <p className="text-muted-foreground text-lg mb-12 max-w-2xl">Get your MacroPad Pro up and running in just a few minutes.</p>
        </motion.div>
        <div className="space-y-6 max-w-2xl">
          {steps.map((step, index) => (
            <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} className="glass-card p-6 flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-foreground/10 flex items-center justify-center flex-shrink-0"><step.icon className="w-6 h-6" /></div>
              <div><h3 className="font-display text-lg font-semibold mb-1">{step.title}</h3><p className="text-muted-foreground">{step.description}</p></div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Setup;
