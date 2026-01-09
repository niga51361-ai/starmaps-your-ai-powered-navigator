import React, { useState, lazy, Suspense, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeroSection from '@/components/HeroSection';
import ConversationFlow from '@/components/ConversationFlow';

// Lazy load heavy components
const GlowingCursor = lazy(() => import('@/components/GlowingCursor'));
const CinematicMapReveal = lazy(() => import('@/components/CinematicMapReveal'));

interface DestinationInfo {
  name: string;
  country: string;
  coordinates: { lat: number; lng: number };
  distance?: string;
  hotels?: string[];
  attractions?: string[];
}

type AppPhase = 'hero' | 'conversation' | 'map';

const Index = () => {
  const [phase, setPhase] = useState<AppPhase>('hero');
  const [destination, setDestination] = useState<DestinationInfo | null>(null);

  const handleExplore = useCallback(() => {
    setPhase('conversation');
  }, []);

  const handleDestinationConfirmed = useCallback((dest: DestinationInfo) => {
    setDestination(dest);
    setPhase('map');
  }, []);

  const handleBackToConversation = useCallback(() => {
    setPhase('conversation');
    setDestination(null);
  }, []);

  const handleBackToHome = useCallback(() => {
    setPhase('hero');
    setDestination(null);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Glowing cursor - only on desktop */}
      <Suspense fallback={null}>
        <GlowingCursor />
      </Suspense>
      
      {/* Background gradients */}
      {phase !== 'map' && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-0 left-1/4 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] rounded-full opacity-20"
            style={{
              background: 'radial-gradient(circle, hsl(var(--primary) / 0.5) 0%, transparent 70%)',
              filter: 'blur(80px)',
            }}
          />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute bottom-0 right-1/4 w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] rounded-full opacity-15"
            style={{
              background: 'radial-gradient(circle, hsl(var(--accent) / 0.5) 0%, transparent 70%)',
              filter: 'blur(100px)',
            }}
          />
        </div>
      )}

      <AnimatePresence mode="wait">
        {phase === 'hero' && (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
          >
            <HeroSection onExplore={handleExplore} />
          </motion.div>
        )}

        {phase === 'conversation' && (
          <motion.div
            key="conversation"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4, type: 'spring', damping: 25 }}
          >
            <ConversationFlow onDestinationConfirmed={handleDestinationConfirmed} />
          </motion.div>
        )}

        {phase === 'map' && destination && (
          <motion.div
            key="map"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Suspense fallback={
              <div className="min-h-screen flex items-center justify-center bg-background">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full"
                />
              </div>
            }>
              <CinematicMapReveal 
                destination={destination}
                onBack={handleBackToConversation}
              />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
