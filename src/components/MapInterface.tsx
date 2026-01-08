import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StarMap from './StarMap';
import SearchBar from './SearchBar';
import QuickActions from './QuickActions';
import ChatPanel from './ChatPanel';
import FloatingNav from './FloatingNav';
import StatusBar from './StatusBar';
import Logo from './Logo';
import { toast } from 'sonner';
import { Layers, Compass, Plus, Minus, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MapInterfaceProps {
  mapToken: string;
  onBack?: () => void;
}

const MapInterface: React.FC<MapInterfaceProps> = ({ mapToken, onBack }) => {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [activeNav, setActiveNav] = useState('map');
  const [showSearch, setShowSearch] = useState(true);

  const handleSearch = (query: string) => {
    toast.info(`جاري البحث عن: ${query}`, {
      description: 'يتم البحث في الخريطة...',
    });
  };

  const handleCurrentLocation = () => {
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
  };

  const handleQuickAction = (action: string) => {
    toast.info(`البحث عن ${action}`, {
      description: 'جاري البحث في المنطقة المحيطة...',
    });
  };

  const handleLocationSelect = useCallback((coords: { lat: number; lng: number }) => {
    setSelectedLocation(coords);
  }, []);

  const handleNavClick = (item: string) => {
    setActiveNav(item);
    if (item === 'home' && onBack) {
      onBack();
    }
    if (item === 'search') {
      setShowSearch(true);
    }
  };

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
      <div className="relative z-10 min-h-screen flex flex-col pt-12">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-4 md:p-6"
        >
          <div className="flex items-center justify-between">
            <Logo size="sm" />
            
            <div className="flex items-center gap-2">
              <Button variant="glass" size="icon" className="rounded-xl">
                <Layers className="w-4 h-4" />
              </Button>
              <Button variant="glass" size="icon" className="rounded-xl">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.header>

        {/* Search section */}
        <AnimatePresence>
          {showSearch && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="px-4 md:px-6 py-4"
            >
              <SearchBar 
                onSearch={handleSearch}
                onCurrentLocation={handleCurrentLocation}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="px-4 md:px-6 pb-4"
        >
          <QuickActions onActionSelect={handleQuickAction} />
        </motion.div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Map controls */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20"
        >
          <Button variant="glass" size="icon" className="rounded-xl w-12 h-12">
            <Plus className="w-5 h-5" />
          </Button>
          <Button variant="glass" size="icon" className="rounded-xl w-12 h-12">
            <Minus className="w-5 h-5" />
          </Button>
          <div className="h-2" />
          <Button variant="glass" size="icon" className="rounded-xl w-12 h-12">
            <Compass className="w-5 h-5" />
          </Button>
        </motion.div>

        {/* Bottom info card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="p-4 md:p-6 pb-24"
        >
          {selectedLocation && (
            <div className="glass-card rounded-2xl p-4 max-w-sm" dir="rtl">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shrink-0">
                  <Compass className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">موقع محدد</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Chat panel */}
      <ChatPanel />

      {/* Floating navigation */}
      <FloatingNav activeItem={activeNav} onItemClick={handleNavClick} />
    </div>
  );
};

export default MapInterface;
