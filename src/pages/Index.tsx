import React, { useState, lazy, Suspense, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeroSection from '@/components/HeroSection';

// Lazy load heavy components
const ParticleField = lazy(() => import('@/components/ParticleField'));
const GlowingCursor = lazy(() => import('@/components/GlowingCursor'));
const MapInterface = lazy(() => import('@/components/MapInterface'));

// Mapbox demo token
const DEMO_MAP_TOKEN = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

const Index = () => {
  const [showMap, setShowMap] = useState(false);

  const handleExplore = useCallback(() => {
    setShowMap(true);
  }, []);

  const handleBackToHome = useCallback(() => {
    setShowMap(false);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Lazy loaded effects - only on desktop */}
      <Suspense fallback={null}>
        <GlowingCursor />
      </Suspense>
      
      {/* Particles - lazy loaded */}
      {!showMap && (
        <Suspense fallback={null}>
          <ParticleField />
        </Suspense>
      )}
      
      {/* Background gradients - simplified */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-0 left-1/4 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, hsl(var(--primary) / 0.5) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div 
          className="absolute bottom-0 right-1/4 w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, hsl(var(--accent) / 0.5) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
      </div>

      <AnimatePresence mode="wait">
        {!showMap ? (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <HeroSection onExplore={handleExplore} />
          </motion.div>
        ) : (
          <motion.div
            key="map"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Suspense fallback={
              <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-muted-foreground">جاري التحميل...</div>
              </div>
            }>
              <MapInterface 
                mapToken={DEMO_MAP_TOKEN} 
                onBack={handleBackToHome}
              />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
