import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ParticleField from '@/components/ParticleField';
import GlowingCursor from '@/components/GlowingCursor';
import HeroSection from '@/components/HeroSection';
import MapInterface from '@/components/MapInterface';

// Demo Mapbox token - users should replace with their own
const DEMO_MAP_TOKEN = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

const Index = () => {
  const [showMap, setShowMap] = useState(false);

  const handleExplore = () => {
    setShowMap(true);
  };

  const handleBackToHome = () => {
    setShowMap(false);
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Custom cursor */}
      <GlowingCursor />
      
      {/* Particle background */}
      <ParticleField />
      
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-accent/10 rounded-full blur-[180px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <AnimatePresence mode="wait">
        {!showMap ? (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
          >
            <HeroSection onExplore={handleExplore} />
          </motion.div>
        ) : (
          <motion.div
            key="map"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <MapInterface 
              mapToken={DEMO_MAP_TOKEN} 
              onBack={handleBackToHome}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
