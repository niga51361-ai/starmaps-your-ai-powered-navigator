import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type BackgroundTheme = 
  | 'default' 
  | 'weather-sunny' 
  | 'weather-cloudy' 
  | 'weather-rainy' 
  | 'travel-plane' 
  | 'travel-train' 
  | 'destination-beach' 
  | 'destination-city' 
  | 'destination-mountain'
  | 'hotel'
  | 'food'
  | 'celebration';

interface DynamicBackgroundProps {
  theme: BackgroundTheme;
}

// Cloud component
const Cloud: React.FC<{ delay: number; size: 'sm' | 'md' | 'lg'; y: number }> = ({ delay, size, y }) => {
  const sizeClasses = {
    sm: 'w-16 h-8',
    md: 'w-24 h-12',
    lg: 'w-32 h-16',
  };
  
  return (
    <motion.div
      className={`absolute ${sizeClasses[size]}`}
      style={{ top: `${y}%` }}
      initial={{ x: '100vw', opacity: 0 }}
      animate={{ x: '-100px', opacity: 1 }}
      transition={{
        x: { duration: 20 + delay * 5, repeat: Infinity, ease: 'linear', delay },
        opacity: { duration: 1 }
      }}
    >
      <svg
        viewBox="0 0 100 50"
        className="w-full h-full"
        style={{ fill: 'hsl(var(--foreground) / 0.12)' }}
      >
        <ellipse cx="30" cy="35" rx="20" ry="15" />
        <ellipse cx="50" cy="30" rx="25" ry="20" />
        <ellipse cx="75" cy="35" rx="18" ry="13" />
      </svg>
    </motion.div>
  );
};

// Rain drop
const RainDrop: React.FC<{ delay: number; x: number }> = ({ delay, x }) => (
  <motion.div
    className="absolute w-0.5 h-6 rounded-full"
    style={{
      left: `${x}%`,
      background: 'linear-gradient(to bottom, hsl(var(--accent) / 0.55), transparent)',
    }}
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: '100vh', opacity: [0, 1, 0] }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
      delay,
      ease: 'linear',
    }}
  />
);

// Sun rays
const SunRays: React.FC = () => (
  <motion.div
    className="absolute top-10 right-10"
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0, opacity: 0 }}
  >
    <motion.div
      className="w-32 h-32 rounded-full"
      style={{
        background: 'radial-gradient(circle, hsl(var(--accent) / 0.85) 0%, hsl(var(--primary) / 0.25) 55%, transparent 75%)',
      }}
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.8, 1, 0.8],
      }}
      transition={{ duration: 3, repeat: Infinity }}
    />
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute top-1/2 left-1/2 w-24 h-1 bg-gradient-to-r from-accent/40 to-transparent origin-left"
        style={{ transform: `rotate(${i * 45}deg)` }}
        animate={{ opacity: [0.25, 0.6, 0.25] }}
        transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
      />
    ))}
  </motion.div>
);

// Plane animation
const FlyingPlane: React.FC = () => (
  <motion.div
    className="absolute"
    initial={{ x: '-10%', y: '40%' }}
    animate={{ x: '110%', y: '20%' }}
    transition={{ duration: 8, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
  >
    <motion.div
      animate={{ y: [0, -10, 0], rotate: [0, 2, -2, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <svg className="w-20 h-20 text-foreground/40" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
      </svg>
    </motion.div>
    {/* Contrail */}
    <motion.div
      className="absolute top-1/2 right-full w-96 h-0.5 bg-gradient-to-r from-transparent to-foreground/10"
      style={{ transformOrigin: 'right center' }}
    />
  </motion.div>
);

// Train animation
const MovingTrain: React.FC = () => (
  <motion.div
    className="absolute bottom-20 left-0"
    initial={{ x: '-100%' }}
    animate={{ x: '100vw' }}
    transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
  >
    <div className="flex items-end">
      {/* Engine */}
      <div className="relative">
        <div className="w-20 h-14 bg-gradient-to-br from-primary/80 to-primary/60 rounded-t-lg rounded-r-2xl">
          <div className="absolute top-2 left-2 w-4 h-4 rounded-full bg-accent/80" />
          <div className="absolute bottom-0 left-2 right-2 h-6 bg-secondary/50 rounded-t" />
        </div>
        <div className="flex gap-1 justify-center">
          <div className="w-4 h-4 rounded-full bg-muted-foreground/50" />
          <div className="w-4 h-4 rounded-full bg-muted-foreground/50" />
        </div>
      </div>
      {/* Cars */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="relative mr-1">
          <div className="w-16 h-10 bg-gradient-to-br from-secondary/80 to-secondary/60 rounded">
            <div className="flex justify-center gap-1 pt-2">
              <div className="w-4 h-3 bg-primary/30 rounded-sm" />
              <div className="w-4 h-3 bg-primary/30 rounded-sm" />
            </div>
          </div>
          <div className="flex gap-2 justify-center">
            <div className="w-3 h-3 rounded-full bg-muted-foreground/50" />
            <div className="w-3 h-3 rounded-full bg-muted-foreground/50" />
          </div>
        </div>
      ))}
    </div>
    {/* Track */}
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted-foreground/30" />
  </motion.div>
);

// Stars for celebration
const Sparkle: React.FC<{ delay: number; x: number; y: number }> = ({ delay, x, y }) => (
  <motion.div
    className="absolute"
    style={{ left: `${x}%`, top: `${y}%` }}
    initial={{ scale: 0, opacity: 0 }}
    animate={{ 
      scale: [0, 1, 0],
      opacity: [0, 1, 0],
      rotate: [0, 180],
    }}
    transition={{ duration: 1.5, repeat: Infinity, delay }}
  >
    <svg className="w-4 h-4 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
    </svg>
  </motion.div>
);

// Beach waves
const Wave: React.FC<{ delay: number; y: number }> = ({ delay, y }) => (
  <motion.div
    className="absolute left-0 right-0 h-4"
    style={{ bottom: `${y}%` }}
    animate={{
      x: [0, 50, 0],
    }}
    transition={{ duration: 4, repeat: Infinity, delay, ease: 'easeInOut' }}
  >
    <svg
      viewBox="0 0 1200 30"
      className="w-full h-full"
      style={{ fill: 'hsl(var(--accent) / 0.18)' }}
      preserveAspectRatio="none"
    >
      <path d="M0,15 Q150,0 300,15 T600,15 T900,15 T1200,15 L1200,30 L0,30 Z" />
    </svg>
  </motion.div>
);

// City buildings
const CityBuildings: React.FC = () => (
  <div className="absolute bottom-0 left-0 right-0 h-48 flex items-end justify-center gap-2">
    {[80, 120, 60, 100, 140, 70, 110, 90, 130].map((height, i) => (
      <motion.div
        key={i}
        className="relative"
        initial={{ height: 0, opacity: 0 }}
        animate={{ height, opacity: 1 }}
        transition={{ delay: i * 0.1, duration: 0.5 }}
        style={{ width: 20 + Math.random() * 15 }}
      >
        <div 
          className="w-full h-full bg-gradient-to-b from-primary/20 to-secondary/40 rounded-t"
        >
            {[...Array(Math.floor(height / 20))].map((_, j) => (
              <div key={j} className="flex justify-center gap-1 py-2">
                <div className={`w-2 h-2 ${Math.random() > 0.3 ? 'bg-accent/45' : 'bg-transparent'}`} />
                <div className={`w-2 h-2 ${Math.random() > 0.3 ? 'bg-accent/45' : 'bg-transparent'}`} />
              </div>
            ))}
        </div>
      </motion.div>
    ))}
  </div>
);

// Hotel icon floating
const FloatingHotel: React.FC = () => (
  <motion.div
    className="absolute top-1/4 left-1/2 -translate-x-1/2"
    animate={{
      y: [0, -20, 0],
      rotate: [0, 5, -5, 0],
    }}
    transition={{ duration: 4, repeat: Infinity }}
  >
    <div className="relative">
      <div className="w-24 h-32 bg-gradient-to-b from-primary/40 to-primary/20 rounded-t-lg rounded-b">
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-6 bg-accent/30 rounded text-center text-xs text-foreground/80 flex items-center justify-center">
          HOTEL
        </div>
        <div className="absolute top-12 left-0 right-0 grid grid-cols-3 gap-1 px-2">
          {[...Array(9)].map((_, i) => (
            <motion.div
              key={i}
              className="w-full h-4 bg-accent/40 rounded-sm"
              animate={{ opacity: [0.25, 0.85, 0.25] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
      <motion.div
        className="absolute -top-6 left-1/2 -translate-x-1/2"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        ⭐
      </motion.div>
    </div>
  </motion.div>
);

// Food floating
const FloatingFood: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {['🍕', '🍔', '🍣', '🥗', '🍜', '🥘'].map((emoji, i) => (
      <motion.div
        key={i}
        className="absolute text-4xl"
        style={{
          left: `${15 + i * 15}%`,
          top: `${20 + (i % 3) * 20}%`,
        }}
        animate={{
          y: [0, -30, 0],
          rotate: [0, 10, -10, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          delay: i * 0.5,
        }}
      >
        {emoji}
      </motion.div>
    ))}
  </div>
);

// Mountain silhouette
const Mountains: React.FC = () => (
  <div className="absolute bottom-0 left-0 right-0 h-64">
    <svg viewBox="0 0 1200 200" className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="mountainGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--secondary))" />
          <stop offset="100%" stopColor="hsl(var(--background))" />
        </linearGradient>
        <linearGradient id="mountainGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--muted))" />
          <stop offset="100%" stopColor="hsl(var(--background))" />
        </linearGradient>
      </defs>
      <path d="M0,200 L200,80 L400,150 L600,50 L800,120 L1000,40 L1200,100 L1200,200 Z" fill="url(#mountainGrad1)" />
      <path d="M0,200 L150,120 L350,180 L550,100 L750,160 L950,80 L1200,140 L1200,200 Z" fill="url(#mountainGrad2)" />
      {/* Snow caps */}
      <path d="M590,50 L600,50 L610,60 L590,60 Z" fill="hsl(var(--foreground))" opacity="0.6" />
      <path d="M990,40 L1000,40 L1015,55 L985,55 Z" fill="hsl(var(--foreground))" opacity="0.6" />
    </svg>
  </div>
);

const DynamicBackground: React.FC<DynamicBackgroundProps> = ({ theme }) => {
  const content = useMemo(() => {
    switch (theme) {
      case 'weather-sunny':
        return (
          <>
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to bottom, hsl(var(--accent) / 0.14) 0%, hsl(var(--card)) 55%, hsl(var(--background)) 100%)',
              }}
            />
            <SunRays />
          </>
        );
        
      case 'weather-cloudy':
        return (
          <>
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to bottom, hsl(var(--secondary)) 0%, hsl(var(--background)) 100%)',
              }}
            />
            <Cloud delay={0} size="lg" y={15} />
            <Cloud delay={2} size="md" y={25} />
            <Cloud delay={4} size="sm" y={35} />
            <Cloud delay={1} size="md" y={45} />
            <Cloud delay={3} size="lg" y={20} />
          </>
        );
        
      case 'weather-rainy':
        return (
          <>
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to bottom, hsl(var(--muted)) 0%, hsl(var(--background)) 100%)',
              }}
            />
            <Cloud delay={0} size="lg" y={5} />
            <Cloud delay={1} size="lg" y={10} />
            <Cloud delay={2} size="md" y={8} />
            {[...Array(30)].map((_, i) => (
              <RainDrop key={i} delay={i * 0.1} x={Math.random() * 100} />
            ))}
          </>
        );
        
      case 'travel-plane':
        return (
          <>
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to bottom, hsl(var(--primary) / 0.16) 0%, hsl(var(--card)) 55%, hsl(var(--background)) 100%)',
              }}
            />
            <Cloud delay={0} size="sm" y={60} />
            <Cloud delay={2} size="md" y={70} />
            <Cloud delay={1} size="sm" y={75} />
            <FlyingPlane />
          </>
        );
        
      case 'travel-train':
        return (
          <>
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to bottom, hsl(var(--card)) 0%, hsl(var(--background)) 100%)',
              }}
            />
            <MovingTrain />
          </>
        );
        
      case 'destination-beach':
        return (
          <>
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to bottom, hsl(var(--accent) / 0.12) 0%, hsl(var(--primary) / 0.10) 45%, hsl(var(--background)) 100%)',
              }}
            />
            <SunRays />
            <Wave delay={0} y={10} />
            <Wave delay={0.5} y={8} />
            <Wave delay={1} y={5} />
          </>
        );
        
      case 'destination-city':
        return (
          <>
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to bottom, hsl(var(--background)) 0%, hsl(var(--card)) 100%)',
              }}
            />
            <CityBuildings />
          </>
        );
        
      case 'destination-mountain':
        return (
          <>
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to bottom, hsl(var(--background)) 0%, hsl(var(--card)) 100%)',
              }}
            />
            <Mountains />
          </>
        );
        
      case 'hotel':
        return (
          <>
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to bottom, hsl(var(--card)) 0%, hsl(var(--background)) 100%)',
              }}
            />
            <FloatingHotel />
          </>
        );
        
      case 'food':
        return (
          <>
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to bottom, hsl(var(--primary) / 0.10) 0%, hsl(var(--background)) 100%)',
              }}
            />
            <FloatingFood />
          </>
        );
        
      case 'celebration':
        return (
          <>
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to bottom, hsl(var(--primary) / 0.16) 0%, hsl(var(--background)) 100%)',
              }}
            />
            {[...Array(15)].map((_, i) => (
              <Sparkle 
                key={i} 
                delay={i * 0.3} 
                x={10 + Math.random() * 80} 
                y={10 + Math.random() * 80} 
              />
            ))}
          </>
        );
        
      default:
        return (
          <>
            <div 
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse at top, hsl(var(--card)) 0%, hsl(var(--background)) 100%)',
              }}
            />
            <motion.div 
              className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full opacity-20"
              style={{
                background: 'radial-gradient(circle, hsl(var(--primary) / 0.5) 0%, transparent 70%)',
                filter: 'blur(80px)',
              }}
              animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
              transition={{ duration: 10, repeat: Infinity }}
            />
            <motion.div 
              className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-15"
              style={{
                background: 'radial-gradient(circle, hsl(var(--accent) / 0.5) 0%, transparent 70%)',
                filter: 'blur(100px)',
              }}
              animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
              transition={{ duration: 12, repeat: Infinity }}
            />
          </>
        );
    }
  }, [theme]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={theme}
        className="fixed inset-0 pointer-events-none overflow-hidden z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        {content}
      </motion.div>
    </AnimatePresence>
  );
};

export default React.memo(DynamicBackground);
