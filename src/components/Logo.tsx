import React from 'react';
import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true }) => {
  const sizes = {
    sm: { container: 36, icon: 20, text: 'text-xl', tagline: 'text-[10px]' },
    md: { container: 44, icon: 26, text: 'text-2xl', tagline: 'text-xs' },
    lg: { container: 64, icon: 38, text: 'text-4xl', tagline: 'text-sm' },
  };

  const config = sizes[size];

  return (
    <motion.div 
      className="flex items-center gap-3"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="relative">
        {/* Outer glow ring */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, hsl(270 95% 65% / 0.4), hsl(280 100% 70% / 0.4))',
            filter: 'blur(12px)',
          }}
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        
        {/* Logo container */}
        <motion.div 
          className="relative rounded-2xl flex items-center justify-center overflow-hidden"
          style={{ 
            width: config.container, 
            height: config.container,
            background: 'linear-gradient(135deg, hsl(270 95% 65%), hsl(280 100% 70%))',
          }}
          whileHover={{ scale: 1.05, rotate: 5 }}
          transition={{ duration: 0.3 }}
        >
          {/* Inner shine */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)',
            }}
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2 }}
          />
          
          {/* Star icon */}
          <svg 
            width={config.icon} 
            height={config.icon} 
            viewBox="0 0 48 48" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="relative z-10"
          >
            {/* Main star */}
            <motion.path
              d="M24 4L28.5 18.5H44L31.5 27.5L36 42L24 33L12 42L16.5 27.5L4 18.5H19.5L24 4Z"
              fill="white"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            />
            
            {/* Center pulse */}
            <motion.circle
              cx="24"
              cy="24"
              r="5"
              fill="url(#starGlow)"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0.6, 1, 0.6],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
            
            <defs>
              <radialGradient id="starGlow" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="white" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </motion.div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <motion.span 
            className={`font-display font-bold ${config.text} tracking-tight`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              background: 'linear-gradient(135deg, hsl(0 0% 100%), hsl(270 50% 90%))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            StarMaps
          </motion.span>
          <motion.span 
            className={`${config.tagline} text-muted-foreground -mt-0.5 tracking-wider uppercase`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Navigate Smarter
          </motion.span>
        </div>
      )}
    </motion.div>
  );
};

export default Logo;
