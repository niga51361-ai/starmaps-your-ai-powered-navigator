import React, { useState, useCallback, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StarMap from './StarMap';
import SearchBar from './SearchBar';
import QuickActions from './QuickActions';
import FloatingNav from './FloatingNav';
import StatusBar from './StatusBar';
import Logo from './Logo';
import { toast } from 'sonner';
import { Layers, Compass, Plus, Minus, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Lazy load ChatPanel for better initial performance
const ChatPanel = lazy(() => import('./ChatPanel'));

interface MapInterfaceProps {
  mapToken: string;
  onBack?: () => void;
}

const MapInterface: React.FC<MapInterfaceProps> = ({ mapToken, onBack }) => {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [activeNav, setActiveNav] = useState('map');

  const handleSearch = useCallback((query: string) => {
    toast.info(`جاري البحث عن: ${query}`, {
      description: 'يتم البحث في الخريطة...',
    });
  }, []);

  const handleCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSelectedLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          toast.success('تم تحديد موقعك بنجاح!');
        },
        () => {
          toast.error('لم نتمكن من الوصول إلى موقعك');
        }
      );
    }
  }, []);

  const handleQuickAction = useCallback((action: string) => {
    toast.info(`البحث عن ${action}`, {
      description: 'جاري البحث في المنطقة المحيطة...',
    });
  }, []);

  const handleLocationSelect = useCallback((coords: { lat: number; lng: number }) => {
    setSelectedLocation(coords);
  }, []);

  const handleNavClick = useCallback((item: string) => {
    setActiveNav(item);
    if (item === 'home' && onBack) {
      onBack();
    }
  }, [onBack]);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Status bar */}
      <StatusBar />

      {/* Map */}
      <div className="fixed inset-0">
        <StarMap 
          accessToken={mapToken} 
          onLocationSelect={handleLocationSelect}
        />
      </div>

      {/* UI Overlay */}
      <div className="relative z-10 min-h-screen flex flex-col pt-10 sm:pt-12">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="p-3 sm:p-4 md:p-6"
        >
          <div className="flex items-center justify-between">
            <Logo size="sm" />
            
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Button variant="glass" size="icon" className="rounded-xl w-9 h-9 sm:w-10 sm:h-10">
                <Layers className="w-4 h-4" />
              </Button>
              <Button variant="glass" size="icon" className="rounded-xl w-9 h-9 sm:w-10 sm:h-10">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.header>

        {/* Search section */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="px-3 sm:px-4 md:px-6 py-2 sm:py-4"
        >
          <SearchBar 
            onSearch={handleSearch}
            onCurrentLocation={handleCurrentLocation}
          />
        </motion.div>

        {/* Quick actions */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="px-3 sm:px-4 md:px-6 pb-2 sm:pb-4"
        >
          <QuickActions onActionSelect={handleQuickAction} />
        </motion.div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Map controls - Hidden on mobile, visible on tablet+ */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="fixed right-3 sm:right-4 top-1/2 -translate-y-1/2 hidden sm:flex flex-col gap-2 z-20"
        >
          <Button variant="glass" size="icon" className="rounded-xl w-10 h-10 sm:w-12 sm:h-12">
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <Button variant="glass" size="icon" className="rounded-xl w-10 h-10 sm:w-12 sm:h-12">
            <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <div className="h-2" />
          <Button variant="glass" size="icon" className="rounded-xl w-10 h-10 sm:w-12 sm:h-12">
            <Compass className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </motion.div>

        {/* Bottom info card */}
        <AnimatePresence>
          {selectedLocation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="p-3 sm:p-4 md:p-6 pb-20 sm:pb-24"
            >
              <div 
                className="rounded-2xl p-3 sm:p-4 max-w-sm backdrop-blur-xl"
                style={{
                  background: 'hsl(var(--background) / 0.8)',
                  border: '1px solid hsl(var(--border) / 0.5)',
                }}
                dir="rtl"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-r from-primary to-accent flex items-center justify-center shrink-0">
                    <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm sm:text-base">موقع محدد</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
                      {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chat panel - Lazy loaded */}
      <Suspense fallback={null}>
        <ChatPanel />
      </Suspense>

      {/* Floating navigation */}
      <FloatingNav activeItem={activeNav} onItemClick={handleNavClick} />
    </div>
  );
};

export default React.memo(MapInterface);
