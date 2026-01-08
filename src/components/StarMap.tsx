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
      pitch: 45,
      bearing: 0,
    });

    // Add navigation controls
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
      
      // Add atmosphere and fog
      map.current?.setFog({
        color: 'rgb(20, 15, 35)',
        'high-color': 'rgb(50, 30, 80)',
        'horizon-blend': 0.1,
        'space-color': 'rgb(10, 8, 20)',
        'star-intensity': 0.6
      });
    });

    // Globe rotation
    const secondsPerRevolution = 180;
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
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Map overlay gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background/80 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background/60 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background/60 to-transparent" />
      </div>

      {/* Loading state */}
      {!isLoaded && (
        <motion.div 
          className="absolute inset-0 flex items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          animate={{ opacity: isLoaded ? 0 : 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
            <span className="text-muted-foreground">جاري تحميل الخريطة...</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default StarMap;
