import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Plane, Hotel, Landmark, Navigation, Volume2, VolumeX, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from './Logo';

interface DestinationInfo {
  name: string;
  country: string;
  coordinates: { lat: number; lng: number };
  distance?: string;
  hotels?: string[];
  attractions?: string[];
}

interface CinematicMapRevealProps {
  destination: DestinationInfo;
  onBack: () => void;
}

// Use a fallback token or get from environment
const MAPBOX_TOKEN = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

const CinematicMapReveal: React.FC<CinematicMapRevealProps> = ({ destination, onBack }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [phase, setPhase] = useState<'intro' | 'flying' | 'arrived' | 'exploring'>('intro');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [showInfo, setShowInfo] = useState(false);

  // Text-to-speech function
  const speak = useCallback((text: string) => {
    if (!audioEnabled || typeof window === 'undefined') return;
    
    window.speechSynthesis?.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.85;
    utterance.pitch = 1;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis?.speak(utterance);
  }, [audioEnabled]);

  const toggleAudio = useCallback(() => {
    setAudioEnabled(prev => !prev);
    if (isSpeaking) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
    }
  }, [isSpeaking]);

  // Initialize map and start cinematic sequence
  useEffect(() => {
    if (!mapContainer.current) return;

    // Start intro phase
    setPhase('intro');
    
    // Speak intro
    setTimeout(() => {
      speak(`جاري الانطلاق إلى ${destination.name}، ${destination.country}. استعد لرحلة مذهلة!`);
    }, 500);

    // Initialize map after intro
    setTimeout(() => {
      mapboxgl.accessToken = MAPBOX_TOKEN;

      map.current = new mapboxgl.Map({
        container: mapContainer.current!,
        style: 'mapbox://styles/mapbox/dark-v11',
        projection: 'globe',
        zoom: 1,
        center: [0, 20],
        pitch: 0,
        bearing: 0,
        attributionControl: false,
        antialias: true,
      });

      map.current.on('load', () => {
        // Add atmosphere
        map.current?.setFog({
          color: 'rgb(15, 10, 30)',
          'high-color': 'rgb(60, 30, 100)',
          'horizon-blend': 0.15,
          'space-color': 'rgb(8, 5, 18)',
          'star-intensity': 0.8
        });

        // Start flying animation
        setPhase('flying');
        
        // Cinematic fly to destination
        map.current?.flyTo({
          center: [destination.coordinates.lng, destination.coordinates.lat],
          zoom: 12,
          pitch: 60,
          bearing: 30,
          duration: 6000,
          essential: true,
          curve: 1.5,
        });

        // Speak during flight
        setTimeout(() => {
          speak(`نحن نقترب من ${destination.name}. المسافة من موقعك ${destination.distance}`);
        }, 2000);

        // Arrival
        setTimeout(() => {
          setPhase('arrived');
          
          // Add destination marker
          if (map.current) {
            const el = document.createElement('div');
            el.className = 'destination-marker';
            el.innerHTML = `
              <div class="marker-pulse"></div>
              <div class="marker-inner">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="currentColor"/>
                </svg>
              </div>
            `;
            
            new mapboxgl.Marker(el)
              .setLngLat([destination.coordinates.lng, destination.coordinates.lat])
              .addTo(map.current);
          }
          
          speak(`وصلنا إلى ${destination.name}! دعني أخبرك عن أفضل الفنادق والمعالم هنا.`);
          
          setTimeout(() => {
            setPhase('exploring');
            setShowInfo(true);
            
            // Speak about hotels and attractions
            setTimeout(() => {
              const hotelsList = destination.hotels?.slice(0, 2).join(' و ') || '';
              const attractionsList = destination.attractions?.slice(0, 2).join(' و ') || '';
              speak(`أفضل الفنادق في ${destination.name}: ${hotelsList}. ومن أبرز المعالم: ${attractionsList}. استمتع برحلتك!`);
            }, 1000);
          }, 2000);
        }, 6500);
      });

      map.current.on('error', (e) => {
        console.error('Map error:', e);
      });
    }, 2000);

    return () => {
      window.speechSynthesis?.cancel();
      map.current?.remove();
    };
  }, [destination, speak]);

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Map container */}
      <div ref={mapContainer} className="absolute inset-0" />

      {/* Gradient overlays */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-x-0 top-0 h-32"
          style={{ background: 'linear-gradient(to bottom, hsl(var(--background)) 0%, transparent 100%)' }}
        />
        <div 
          className="absolute inset-x-0 bottom-0 h-48"
          style={{ background: 'linear-gradient(to top, hsl(var(--background)) 0%, transparent 100%)' }}
        />
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-20 p-4 sm:p-6 flex items-center justify-between"
      >
        <Button
          variant="glass"
          size="icon"
          onClick={onBack}
          className="rounded-xl"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <Logo size="sm" />
        
        <Button
          variant="glass"
          size="icon"
          onClick={toggleAudio}
          className="rounded-xl"
        >
          {audioEnabled ? (
            <Volume2 className={`w-5 h-5 ${isSpeaking ? 'text-primary animate-pulse' : ''}`} />
          ) : (
            <VolumeX className="w-5 h-5 text-muted-foreground" />
          )}
        </Button>
      </motion.header>

      {/* Intro overlay */}
      <AnimatePresence>
        {phase === 'intro' && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-30 flex items-center justify-center bg-background"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              className="text-center"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mb-6"
              >
                <Plane className="w-16 h-16 text-primary mx-auto" />
              </motion.div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2" dir="rtl">
                جاري الانطلاق إلى
              </h2>
              <p className="text-3xl sm:text-4xl font-bold text-gradient" dir="rtl">
                {destination.name}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flying indicator */}
      <AnimatePresence>
        {phase === 'flying' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20"
          >
            <div 
              className="flex items-center gap-3 px-6 py-3 rounded-full backdrop-blur-xl"
              style={{
                background: 'hsl(var(--background) / 0.8)',
                border: '1px solid hsl(var(--border) / 0.5)',
              }}
            >
              <Navigation className="w-5 h-5 text-primary animate-pulse" />
              <span className="text-foreground font-medium" dir="rtl">جاري التوجه إلى {destination.name}...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Destination info panel */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            className="absolute bottom-6 left-4 right-4 z-20"
          >
            <div 
              className="max-w-lg mx-auto rounded-3xl p-5 backdrop-blur-xl"
              style={{
                background: 'hsl(var(--background) / 0.9)',
                border: '1px solid hsl(var(--border) / 0.5)',
                boxShadow: '0 20px 60px hsl(var(--primary) / 0.15)',
              }}
              dir="rtl"
            >
              {/* Header */}
              <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border/30">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
                  <Plane className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{destination.name}</h3>
                  <p className="text-muted-foreground">{destination.country} • {destination.distance}</p>
                </div>
              </div>

              {/* Hotels */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Hotel className="w-4 h-4 text-primary" />
                  <h4 className="font-semibold text-foreground text-sm">أفضل الفنادق</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {destination.hotels?.map((hotel) => (
                    <span 
                      key={hotel}
                      className="px-3 py-1.5 rounded-lg bg-secondary/50 text-xs text-foreground"
                    >
                      {hotel}
                    </span>
                  ))}
                </div>
              </div>

              {/* Attractions */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Landmark className="w-4 h-4 text-primary" />
                  <h4 className="font-semibold text-foreground text-sm">أبرز المعالم</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {destination.attractions?.map((attraction) => (
                    <span 
                      key={attraction}
                      className="px-3 py-1.5 rounded-lg bg-primary/10 text-xs text-primary"
                    >
                      {attraction}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom marker styles */}
      <style>{`
        .destination-marker {
          position: relative;
          width: 40px;
          height: 40px;
        }
        
        .marker-pulse {
          position: absolute;
          width: 100%;
          height: 100%;
          background: hsl(var(--primary) / 0.3);
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        
        .marker-inner {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 30px;
          height: 30px;
          background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)));
          border-radius: 50% 50% 50% 0;
          transform: translate(-50%, -50%) rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px hsl(var(--primary) / 0.5);
        }
        
        .marker-inner svg {
          transform: rotate(45deg);
          color: white;
          width: 16px;
          height: 16px;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.5); opacity: 0; }
          100% { transform: scale(1); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default React.memo(CinematicMapReveal);
