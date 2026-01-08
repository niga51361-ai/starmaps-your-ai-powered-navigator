import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { motion } from 'framer-motion';

interface StarMapProps {
  accessToken: string;
  onLocationSelect?: (coords: { lat: number; lng: number }) => void;
}

const StarMap: React.FC<StarMapProps> = ({ accessToken, onLocationSelect }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || !accessToken) return;

    mapboxgl.accessToken = accessToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      projection: 'globe',
      zoom: 2,
      center: [45, 25],
      pitch: 50,
      bearing: -10,
    });

    // Add navigation controls with custom styling
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'bottom-right'
    );

    // Add geolocate control
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      }),
      'bottom-right'
    );

    map.current.on('load', () => {
      setIsLoaded(true);
      
      // Enhanced atmosphere and fog with purple tint
      map.current?.setFog({
        color: 'rgb(15, 10, 30)',
        'high-color': 'rgb(40, 20, 80)',
        'horizon-blend': 0.15,
        'space-color': 'rgb(8, 5, 18)',
        'star-intensity': 0.8
      });
    });

    // Globe rotation
    const secondsPerRevolution = 200;
    const maxSpinZoom = 5;
    const slowSpinZoom = 3;
    let userInteracting = false;
    let spinEnabled = true;

    function spinGlobe() {
      if (!map.current) return;
      const zoom = map.current.getZoom();
      if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
        let distancePerSecond = 360 / secondsPerRevolution;
        if (zoom > slowSpinZoom) {
          const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
          distancePerSecond *= zoomDif;
        }
        const center = map.current.getCenter();
        center.lng -= distancePerSecond;
        map.current.easeTo({ center, duration: 1000, easing: (n) => n });
      }
    }

    map.current.on('mousedown', () => { userInteracting = true; });
    map.current.on('dragstart', () => { userInteracting = true; });
    map.current.on('mouseup', () => { userInteracting = false; spinGlobe(); });
    map.current.on('touchend', () => { userInteracting = false; spinGlobe(); });
    map.current.on('moveend', () => { spinGlobe(); });

    spinGlobe();

    // Click handler
    map.current.on('click', (e) => {
      if (onLocationSelect) {
        onLocationSelect({ lat: e.lngLat.lat, lng: e.lngLat.lng });
      }
    });

    return () => {
      map.current?.remove();
    };
  }, [accessToken, onLocationSelect]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0" style={{ cursor: 'auto' }} />
      
      {/* Enhanced map overlay gradients */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top gradient - darker for header */}
        <div 
          className="absolute inset-x-0 top-0 h-40"
          style={{
            background: 'linear-gradient(to bottom, hsl(250 20% 4% / 0.95) 0%, hsl(250 20% 4% / 0.7) 50%, transparent 100%)',
          }}
        />
        {/* Bottom gradient for nav */}
        <div 
          className="absolute inset-x-0 bottom-0 h-40"
          style={{
            background: 'linear-gradient(to top, hsl(250 20% 4% / 0.95) 0%, hsl(250 20% 4% / 0.7) 50%, transparent 100%)',
          }}
        />
        {/* Side gradients */}
        <div 
          className="absolute inset-y-0 left-0 w-24"
          style={{
            background: 'linear-gradient(to right, hsl(250 20% 4% / 0.6) 0%, transparent 100%)',
          }}
        />
        <div 
          className="absolute inset-y-0 right-0 w-24"
          style={{
            background: 'linear-gradient(to left, hsl(250 20% 4% / 0.6) 0%, transparent 100%)',
          }}
        />
        
        {/* Decorative corner accents */}
        <div 
          className="absolute top-0 left-0 w-64 h-64"
          style={{
            background: 'radial-gradient(circle at top left, hsl(270 95% 65% / 0.1) 0%, transparent 60%)',
          }}
        />
        <div 
          className="absolute bottom-0 right-0 w-64 h-64"
          style={{
            background: 'radial-gradient(circle at bottom right, hsl(280 100% 70% / 0.1) 0%, transparent 60%)',
          }}
        />
      </div>

      {/* Loading state */}
      {!isLoaded && (
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: 'hsl(250 20% 4%)' }}
          initial={{ opacity: 1 }}
          animate={{ opacity: isLoaded ? 0 : 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col items-center gap-6">
            {/* Animated loader */}
            <div className="relative">
              <motion.div
                className="w-20 h-20 rounded-full"
                style={{
                  border: '3px solid hsl(250 15% 20%)',
                  borderTopColor: 'hsl(270 95% 65%)',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute inset-2 rounded-full"
                style={{
                  border: '3px solid transparent',
                  borderBottomColor: 'hsl(280 100% 70%)',
                }}
                animate={{ rotate: -360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              />
            </div>
            <motion.span 
              className="text-muted-foreground text-sm"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              جاري تحميل الخريطة...
            </motion.span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default StarMap;
