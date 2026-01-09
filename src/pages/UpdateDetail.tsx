import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const updatesData = {
  '1': {
    id: '1',
    title: 'Firmware v2.0 Released',
    description: 'Major update with improved latency and new display features.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=600&fit=crop',
    date: 'January 5, 2025',
    category: 'Firmware',
    content: `
      <h2>What's New in Firmware v2.0</h2>
      <p>We're excited to announce the release of Firmware v2.0, our biggest update yet! This release brings significant improvements to latency, new display features, and enhanced reliability.</p>
      
      <h3>Key Improvements</h3>
      <ul>
        <li><strong>50% Reduced Latency:</strong> We've optimized our input processing pipeline to deliver near-instantaneous response times.</li>
        <li><strong>New Display Animations:</strong> Choose from 20+ new animations for your LCD display, including wave effects, particle systems, and custom transitions.</li>
        <li><strong>Enhanced Bluetooth Stability:</strong> Improved connection reliability and faster reconnection times.</li>
        <li><strong>Memory Optimization:</strong> Better memory management allows for more complex macros and longer sequences.</li>
      </ul>
      
      <h3>How to Update</h3>
      <p>Open the MacroPad Configurator software and navigate to Settings > Firmware Update. The software will automatically detect and download the latest version.</p>
      
      <h3>Known Issues</h3>
      <p>Some users may experience a brief disconnection during the update process. This is normal and the device will reconnect automatically.</p>
    `
  },
  '2': {
    id: '2',
    title: 'New Software Configurator',
    description: 'Redesigned interface with drag-and-drop macro creation.',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=600&fit=crop',
    date: 'December 28, 2024',
    category: 'Software',
    content: `
      <h2>Introducing the New Configurator</h2>
      <p>We've completely redesigned the MacroPad Configurator from the ground up. The new interface is more intuitive, more powerful, and more beautiful than ever before.</p>
      
      <h3>New Features</h3>
      <ul>
        <li><strong>Drag-and-Drop Macro Builder:</strong> Create complex macros by simply dragging actions into a visual timeline.</li>
        <li><strong>Real-time Preview:</strong> See exactly how your LCD display will look before saving changes.</li>
        <li><strong>Cloud Sync:</strong> Your configurations are now automatically synced across all your devices.</li>
        <li><strong>Theme Marketplace:</strong> Browse and download themes created by the community.</li>
      </ul>
      
      <h3>System Requirements</h3>
      <ul>
        <li>Windows 10/11 (64-bit)</li>
        <li>macOS 11.0 or later</li>
        <li>Ubuntu 20.04 or later (Linux)</li>
      </ul>
      
      <h3>Download</h3>
      <p>Head to the Setup page to download the new configurator for your operating system.</p>
    `
  },
  '3': {
    id: '3',
    title: 'Community Macros Library',
    description: 'Share and download macros created by the community.',
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&h=600&fit=crop',
    date: 'December 15, 2024',
    category: 'Community',
    content: `
      <h2>The Community Macros Library is Live!</h2>
      <p>We're thrilled to launch the Community Macros Library, a place where MacroPad users can share, discover, and download macros created by fellow enthusiasts.</p>
      
      <h3>What's Available</h3>
      <ul>
        <li><strong>Gaming Macros:</strong> Optimized setups for popular games like Fortnite, Valorant, and CS2.</li>
        <li><strong>Productivity Suites:</strong> Pre-configured layouts for Adobe Creative Suite, Microsoft Office, and coding environments.</li>
        <li><strong>Streaming Setups:</strong> One-click scene transitions and audio controls for OBS and Streamlabs.</li>
        <li><strong>Music Production:</strong> DAW controls for Ableton, FL Studio, and Logic Pro.</li>
      </ul>
      
      <h3>How to Contribute</h3>
      <p>You can upload your own macros directly from the Configurator. Simply create your macro, click "Share to Community," and your creation will be available for everyone to use.</p>
      
      <h3>Quality Assurance</h3>
      <p>All community macros are reviewed by our team to ensure they meet our quality standards and don't contain any harmful actions.</p>
    `
  }
};

const UpdateDetail = () => {
  const { id } = useParams<{ id: string }>();
  const update = updatesData[id as keyof typeof updatesData];

  if (!update) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold mb-4">Update Not Found</h1>
            <Link to="/updates"><Button>Back to Updates</Button></Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <Link to="/updates">
            <Button variant="ghost" size="sm" className="gap-2 mb-8 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />Back to Updates
            </Button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="aspect-video rounded-xl overflow-hidden mb-8">
              <img 
                src={update.image} 
                alt={update.title} 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{update.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-blue-500 font-medium">{update.category}</span>
              </div>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              {update.title}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              {update.description}
            </p>

            <div 
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: update.content }}
            />
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UpdateDetail;
