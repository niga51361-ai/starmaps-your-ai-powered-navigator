import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Navigation, X, Sparkles, Mic, Command } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onCurrentLocation: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onCurrentLocation }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const suggestions = [
    { icon: MapPin, text: 'المطاعم القريبة', category: 'مطاعم', gradient: 'from-orange-500 to-red-500' },
    { icon: Navigation, text: 'محطات الوقود', category: 'خدمات', gradient: 'from-green-500 to-emerald-500' },
    { icon: Sparkles, text: 'الأماكن السياحية', category: 'سياحة', gradient: 'from-blue-500 to-indigo-500' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-2xl mx-auto"
    >
      <form onSubmit={handleSubmit}>
        <motion.div 
          className="relative"
          animate={{
            boxShadow: isFocused 
              ? '0 20px 60px -15px hsl(270 95% 65% / 0.3)' 
              : '0 10px 40px -15px hsl(0 0% 0% / 0.3)',
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Glow effect on focus */}
          <AnimatePresence>
            {isFocused && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute -inset-[1px] rounded-2xl"
                style={{
                  background: 'linear-gradient(135deg, hsl(270 95% 65% / 0.5), hsl(280 100% 70% / 0.3))',
                  filter: 'blur(8px)',
                }}
              />
            )}
          </AnimatePresence>

          <div 
            className={`
              relative flex items-center gap-3 rounded-2xl p-2 transition-all duration-300
            `}
            style={{
              background: 'linear-gradient(135deg, hsl(250 15% 10% / 0.9), hsl(250 15% 8% / 0.95))',
              backdropFilter: 'blur(20px)',
              border: isFocused 
                ? '1px solid hsl(270 50% 50% / 0.5)' 
                : '1px solid hsl(250 10% 20% / 0.5)',
            }}
          >
            <motion.div 
              className="flex items-center justify-center w-12 h-12 rounded-xl"
              style={{
                background: 'linear-gradient(135deg, hsl(270 95% 65%), hsl(280 100% 70%))',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Search className="w-5 h-5 text-white" />
            </motion.div>
            
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              placeholder="ابحث عن مكان، عنوان، أو اسأل المساعد..."
              className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-base"
              dir="rtl"
            />

            <AnimatePresence>
              {query && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuery('')}
                    className="shrink-0 rounded-xl"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0 rounded-xl text-muted-foreground hover:text-foreground"
            >
              <Mic className="w-4 h-4" />
            </Button>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="button"
                variant="glass"
                size="icon"
                onClick={onCurrentLocation}
                className="shrink-0 rounded-xl"
              >
                <Navigation className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </form>

      {/* Keyboard shortcut hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex justify-center mt-3"
      >
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>اضغط</span>
          <kbd className="px-2 py-1 rounded-md bg-secondary/50 border border-border/50 font-mono text-[10px]">
            <Command className="w-3 h-3 inline mr-1" />K
          </kbd>
          <span>للبحث السريع</span>
        </div>
      </motion.div>

      {/* Suggestions dropdown */}
      <AnimatePresence>
        {isFocused && !query && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-3 z-50 rounded-2xl p-4"
            style={{
              background: 'linear-gradient(180deg, hsl(250 15% 10% / 0.95), hsl(250 15% 8% / 0.98))',
              backdropFilter: 'blur(20px)',
              border: '1px solid hsl(250 10% 20% / 0.5)',
              boxShadow: '0 20px 60px -15px hsl(0 0% 0% / 0.5)',
            }}
          >
            <p className="text-sm text-muted-foreground mb-3 px-1" dir="rtl">اقتراحات سريعة</p>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => {
                    setQuery(suggestion.text);
                    onSearch(suggestion.text);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-all text-right group"
                  dir="rtl"
                  whileHover={{ x: -4 }}
                >
                  <div className={`flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${suggestion.gradient}`}>
                    <suggestion.icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-foreground font-medium text-sm">{suggestion.text}</p>
                    <p className="text-xs text-muted-foreground">{suggestion.category}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SearchBar;
