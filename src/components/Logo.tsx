import React from 'react';
import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ size = 'md' }) => {
  const sizes = {
    sm: { icon: 24, text: 'text-lg' },
    md: { icon: 32, text: 'text-2xl' },
    lg: { icon: 48, text: 'text-4xl' },
  };

  return (
    <motion.div 
      className="flex items-center gap-3"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        <motion.div
          className="absolute inset-0 bg-gradient-primary rounded-xl blur-lg opacity-60"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.6, 0.8, 0.6]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <div 
          className="relative bg-gradient-primary rounded-xl flex items-center justify-center"
          style={{ width: sizes[size].icon + 8, height: sizes[size].icon + 8 }}
        >
          <svg 
            width={sizes[size].icon} 
            height={sizes[size].icon} 
            viewBox="0 0 48 48" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Star shape */}
            <motion.path
              d="M24 4L28.5 18.5H44L31.5 27.5L36 42L24 33L12 42L16.5 27.5L4 18.5H19.5L24 4Z"
              fill="white"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />
            {/* Inner glow */}
            <motion.circle
              cx="24"
              cy="24"
              r="6"
              fill="url(#starGlow)"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <defs>
              <radialGradient id="starGlow" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="white" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
      <div className="flex flex-col">
        <span className={`font-display font-bold ${sizes[size].text} text-gradient`}>
          StarMaps
        </span>
        <span className="text-xs text-muted-foreground -mt-1">Navigate Smarter</span>
      </div>
    </motion.div>
  );
};

export default Logo;
