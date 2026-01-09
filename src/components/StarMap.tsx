import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface StarMapProps {
  accessToken: string;
  onLocationSelect?: (coords: { lat: number; lng: number }) => void;
}

const StarMap: React.FC<StarMapProps> = ({ accessToken, onLocationSelect }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const spinTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleLocationSelect = useCallback((e: mapboxgl.MapMouseEvent) => {
    if (onLocationSelect) {
      onLocationSelect({ lat: e.lngLat.lat, lng: e.lngLat.lng });
    }
  }, [onLocationSelect]);

  useEffect(() => {
    if (!mapContainer.current || !accessToken) return;

    try {
      mapboxgl.accessToken = accessToken;

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        projection: 'globe',
        zoom: 1.5,
        center: [45, 25],
        pitch: 45,
        bearing: -10,
        attributionControl: false,
        antialias: false, // Better performance
      });

      // Add minimal controls
      map.current.addControl(
        new mapboxgl.NavigationControl({ visualizePitch: true }),
        'bottom-right'
      );

      map.current.on('load', () => {
        setIsLoaded(true);
        
        // Add atmosphere
        map.current?.setFog({
          color: 'rgb(15, 10, 30)',
          'high-color': 'rgb(40, 20, 80)',
          'horizon-blend': 0.1,
          'space-color': 'rgb(8, 5, 18)',
          'star-intensity': 0.6
        });

        // Start slow rotation
        startSpin();
      });

      map.current.on('error', (e) => {
        console.error('Map error:', e);
        setError('حدث خطأ في تحميل الخريطة');
      });

      // Click handler
      map.current.on('click', handleLocationSelect);

      // Globe rotation logic
      let userInteracting = false;

      const startSpin = () => {
        if (!map.current || userInteracting) return;
        
        const zoom = map.current.getZoom();
        if (zoom < 4) {
          const center = map.current.getCenter();
          center.lng -= 0.5;
          map.current.easeTo({ center, duration: 1000, easing: (n) => n });
        }
      };

      const stopSpin = () => {
        userInteracting = true;
        if (spinTimeoutRef.current) {
          clearTimeout(spinTimeoutRef.current);
        }
      };

      const resumeSpin = () => {
        userInteracting = false;
        spinTimeoutRef.current = setTimeout(startSpin, 2000);
      };

      map.current.on('mousedown', stopSpin);
      map.current.on('touchstart', stopSpin);
      map.current.on('mouseup', resumeSpin);
      map.current.on('touchend', resumeSpin);
      map.current.on('moveend', () => {
        if (!userInteracting) startSpin();
      });

    } catch (err) {
      console.error('Map initialization error:', err);
      setError('فشل في تهيئة الخريطة');
    }

    return () => {
      if (spinTimeoutRef.current) {
        clearTimeout(spinTimeoutRef.current);
      }
      map.current?.remove();
    };
  }, [accessToken, handleLocationSelect]);

  return (
    <div className="relative w-full h-full">
      <div 
        ref={mapContainer} 
        className="absolute inset-0" 
        style={{ cursor: 'grab' }} 
      />
      
      {/* Gradient overlays */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top gradient */}
        <div 
          className="absolute inset-x-0 top-0 h-24 sm:h-32"
          style={{
            background: 'linear-gradient(to bottom, hsl(var(--background)) 0%, transparent 100%)',
          }}
        />
        {/* Bottom gradient */}
        <div 
          className="absolute inset-x-0 bottom-0 h-24 sm:h-32"
          style={{
            background: 'linear-gradient(to top, hsl(var(--background)) 0%, transparent 100%)',
          }}
        />
      </div>

      {/* Loading state */}
      {!isLoaded && !error && (
        <motion.div 
          className="absolute inset-0 flex items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          animate={{ opacity: isLoaded ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col items-center gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Loader2 className="w-10 h-10 text-primary" />
            </motion.div>
            <span className="text-muted-foreground text-sm">جاري تحميل الخريطة...</span>
          </div>
        </motion.div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <div className="text-center p-6">
            <p className="text-destructive mb-2">{error}</p>
            <p className="text-sm text-muted-foreground">يرجى التحقق من مفتاح Mapbox</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(StarMap);
