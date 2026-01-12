import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Plane, Hotel, Landmark, Navigation, Volume2, VolumeX, ArrowLeft, RotateCcw } from 'lucide-react';
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

// Demo Mapbox token - works for demo purposes
const MAPBOX_TOKEN = 'pk.eyJ1IjoibG92YWJsZWRldiIsImEiOiJjbTRpZzd6aTcwMmppMmpxMXRvMjV3MnNsIn0.Rrg1aBGTbWPxrbelFSGKWA';

const CinematicMapReveal: React.FC<CinematicMapRevealProps> = ({ destination, onBack }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [phase, setPhase] = useState<'intro' | 'flying' | 'arrived' | 'exploring'>('intro');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

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

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Speak intro
    speak(`جاري الانطلاق إلى ${destination.name}، ${destination.country}. استعد لرحلة مذهلة!`);

    const initializeMap = () => {
      try {
        mapboxgl.accessToken = MAPBOX_TOKEN;

        const newMap = new mapboxgl.Map({
          container: mapContainer.current!,
          style: 'mapbox://styles/mapbox/dark-v11',
          projection: 'globe',
          zoom: 1.5,
          center: [30, 20],
          pitch: 0,
          bearing: 0,
          attributionControl: false,
          antialias: true,
        });

        map.current = newMap;

        newMap.on('load', () => {
          console.log('Map loaded successfully');
          setMapLoaded(true);

          // Add atmosphere
          try {
            newMap.setFog({
              color: 'rgb(15, 10, 30)',
              'high-color': 'rgb(60, 30, 100)',
              'horizon-blend': 0.15,
              'space-color': 'rgb(8, 5, 18)',
              'star-intensity': 0.8
            });
          } catch (e) {
            console.log('Fog not supported');
          }

          // Start flying animation after a short delay
          setTimeout(() => {
            setPhase('flying');

            newMap.flyTo({
              center: [destination.coordinates.lng, destination.coordinates.lat],
              zoom: 13,
              pitch: 60,
              bearing: -30,
              duration: 5000,
              essential: true,
              curve: 1.8,
            });

            // Speak during flight
            setTimeout(() => {
              speak(`نحن نقترب من ${destination.name}. المسافة من موقعك ${destination.distance}`);
            }, 1500);

            // Arrival phase
            setTimeout(() => {
              setPhase('arrived');

              // Add custom marker
              const markerEl = document.createElement('div');
              markerEl.className = 'custom-destination-marker';
              markerEl.innerHTML = `
                <div class="marker-ring"></div>
                <div class="marker-dot"></div>
              `;

              new mapboxgl.Marker(markerEl)
                .setLngLat([destination.coordinates.lng, destination.coordinates.lat])
                .addTo(newMap);

              speak(`وصلنا إلى ${destination.name}! دعني أخبرك عن أفضل الفنادق والمعالم هنا.`);

              // Show info panel
              setTimeout(() => {
                setPhase('exploring');
                setShowInfo(true);

                setTimeout(() => {
                  const hotelsList = destination.hotels?.slice(0, 2).join(' و ') || '';
                  const attractionsList = destination.attractions?.slice(0, 2).join(' و ') || '';
                  speak(`أفضل الفنادق: ${hotelsList}. ومن أبرز المعالم: ${attractionsList}. استمتع برحلتك!`);
                }, 800);
              }, 1500);
            }, 5500);
          }, 1500);
        });

        newMap.on('error', (e) => {
          console.error('Map error:', e);
          setMapError('حدث خطأ في تحميل الخريطة');
        });

      } catch (error) {
        console.error('Map initialization error:', error);
        setMapError('فشل في تهيئة الخريطة');
      }
    };

    // Small delay to ensure container is ready
    const timer = setTimeout(initializeMap, 500);

    return () => {
      clearTimeout(timer);
      window.speechSynthesis?.cancel();
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [destination, speak, retryKey]);

  const handleRetry = () => {
    setMapError(null);
    setMapLoaded(false);
    setPhase('intro');
    setShowInfo(false);

    if (map.current) {
      map.current.remove();
      map.current = null;
    }

    setRetryKey((k) => k + 1);
  };

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Map container */}
      <div 
        ref={mapContainer} 
        className="absolute inset-0 w-full h-full"
        style={{ minHeight: '100vh' }}
      />

      {/* Error state */}
      {mapError && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-background/90">
          <div className="text-center p-6" dir="rtl">
            <p className="text-foreground mb-4">{mapError}</p>
            <Button onClick={handleRetry} variant="glow">
              <RotateCcw className="w-4 h-4 ml-2" />
              إعادة المحاولة
            </Button>
          </div>
        </div>
      )}

      {/* Gradient overlays */}
      <div className="absolute inset-0 pointer-events-none z-10">
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
        .custom-destination-marker {
          position: relative;
          width: 60px;
          height: 60px;
        }
        
        .marker-ring {
          position: absolute;
          inset: 0;
          border: 3px solid hsl(var(--primary));
          border-radius: 50%;
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .marker-dot {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)));
          border-radius: 50%;
          box-shadow: 0 0 20px hsl(var(--primary) / 0.6);
        }
        
        @keyframes ping {
          0% { transform: scale(1); opacity: 1; }
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        
        .mapboxgl-ctrl-logo,
        .mapboxgl-ctrl-attrib {
          display: none !important;
        }
      `}</style>
    </div>
  );
};

export default React.memo(CinematicMapReveal);
