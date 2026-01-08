import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Logo from '@/components/Logo';
import SearchBar from '@/components/SearchBar';
import QuickActions from '@/components/QuickActions';
import ChatPanel from '@/components/ChatPanel';
import StarMap from '@/components/StarMap';
import MapTokenInput from '@/components/MapTokenInput';
import { toast } from 'sonner';

const Index = () => {
  const [mapToken, setMapToken] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);

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

  if (!mapToken) {
    return (
      <div className="min-h-screen bg-background star-pattern">
        <MapTokenInput onTokenSubmit={setMapToken} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 star-pattern opacity-30" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[128px] pointer-events-none" />

      {/* Map container */}
      <div className="fixed inset-0">
        <StarMap 
          accessToken={mapToken} 
          onLocationSelect={handleLocationSelect}
        />
      </div>

      {/* UI Overlay */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-4 md:p-6">
          <div className="flex items-center justify-between">
            <Logo size="md" />
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center gap-3"
            >
              <div className="hidden md:flex items-center gap-2 glass-card px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-muted-foreground">متصل</span>
              </div>
            </motion.div>
          </div>
        </header>

        {/* Search section */}
        <div className="px-4 md:px-6 py-8">
          <SearchBar 
            onSearch={handleSearch}
            onCurrentLocation={handleCurrentLocation}
          />
        </div>

        {/* Quick actions */}
        <div className="px-4 md:px-6 pb-8">
          <QuickActions onActionSelect={handleQuickAction} />
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="p-4 md:p-6"
        >
          <div className="glass-card rounded-2xl p-4 max-w-sm" dir="rtl">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-primary-foreground" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-foreground">استكشف العالم</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  انقر على أي مكان في الخريطة أو استخدم البحث للعثور على ما تبحث عنه
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Chat panel */}
      <ChatPanel />
    </div>
  );
};

export default Index;
