import { motion } from 'framer-motion';
import macropadSide from '@/assets/macropad-side.png';

// App icons as PNG placeholders with rounded corners - replace src with actual icon URLs
const row1Icons = [
  { name: 'Windows', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Windows_logo_-_2012.svg/512px-Windows_logo_-_2012.svg.png' },
  { name: 'Apple', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/488px-Apple_logo_black.svg.png' },
  { name: 'Linux', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Tux.svg/506px-Tux.svg.png' },
  { name: 'Photoshop', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Adobe_Photoshop_CC_icon.svg/512px-Adobe_Photoshop_CC_icon.svg.png' },
  { name: 'Premiere', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Adobe_Premiere_Pro_CC_icon.svg/512px-Adobe_Premiere_Pro_CC_icon.svg.png' },
  { name: 'VS Code', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Visual_Studio_Code_1.35_icon.svg/512px-Visual_Studio_Code_1.35_icon.svg.png' },
  { name: 'Figma', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Figma-logo.svg/400px-Figma-logo.svg.png' },
  { name: 'OBS', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Open_Broadcaster_Software_Logo.png/600px-Open_Broadcaster_Software_Logo.png' },
];

const row2Icons = [
  { name: 'Discord', src: 'https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png' },
  { name: 'Spotify', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Spotify_icon.svg/512px-Spotify_icon.svg.png' },
  { name: 'Slack', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/512px-Slack_icon_2019.svg.png' },
  { name: 'Chrome', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Google_Chrome_icon_%28February_2022%29.svg/512px-Google_Chrome_icon_%28February_2022%29.svg.png' },
  { name: 'After Effects', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Adobe_After_Effects_CC_icon.svg/512px-Adobe_After_Effects_CC_icon.svg.png' },
  { name: 'Blender', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Blender_logo_no_text.svg/512px-Blender_logo_no_text.svg.png' },
  { name: 'Unity', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Unity_Technologies_logo.svg/512px-Unity_Technologies_logo.svg.png' },
  { name: 'Notion', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Notion-logo.svg/512px-Notion-logo.svg.png' },
];

const IconRow = ({ icons, reverse = false }: { icons: typeof row1Icons; reverse?: boolean }) => {
  // Double the icons for seamless looping
  const doubledIcons = [...icons, ...icons];

  return (
    <div className="relative overflow-hidden py-4">
      <div className={`flex gap-8 ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'}`}>
        {doubledIcons.map((icon, index) => (
          <div
            key={`${icon.name}-${index}`}
            className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-secondary/50 backdrop-blur-sm border border-border/30 flex items-center justify-center p-3 hover:bg-secondary/80 transition-colors"
          >
            <img
              src={icon.src}
              alt={icon.name}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const Compatibility = () => {
  return (
    <section className="py-16 sm:py-24 relative overflow-hidden bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-muted-foreground text-sm font-medium mb-4 block uppercase tracking-wider">
            Compatibility
          </span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Works With Your Favorite Apps
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Seamlessly integrates with hundreds of applications across all major platforms.
          </p>
        </motion.div>

        {/* Infinite scrolling icons */}
        <div className="space-y-4 mb-16">
          <IconRow icons={row1Icons} />
          <IconRow icons={row2Icons} reverse />
        </div>

        {/* Side view of product */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative max-w-2xl mx-auto"
        >
          <div className="absolute inset-0 bg-foreground/5 rounded-full blur-[60px] scale-75" />
          <div className="relative bg-background">
            <img
              src={macropadSide}
              alt="MacroPad Side View"
              className="w-full object-contain mix-blend-lighten"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Compatibility;
