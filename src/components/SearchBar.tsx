import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Navigation, X, Sparkles } from 'lucide-react';
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
    { icon: MapPin, text: 'المطاعم القريبة', category: 'مطاعم' },
    { icon: Navigation, text: 'محطات الوقود', category: 'خدمات' },
    { icon: Sparkles, text: 'الأماكن السياحية', category: 'سياحة' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative w-full max-w-2xl mx-auto"
    >
      <form onSubmit={handleSubmit}>
        <div 
          className={`
            relative flex items-center gap-3 glass-card rounded-2xl p-2 
            transition-all duration-300
            ${isFocused ? 'ring-2 ring-primary/50 shadow-lg shadow-primary/20' : ''}
          `}
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-primary">
            <Search className="w-5 h-5 text-primary-foreground" />
          </div>
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder="ابحث عن مكان، عنوان، أو اسأل المساعد..."
            className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-lg"
            dir="rtl"
          />

          {query && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setQuery('')}
              className="shrink-0"
            >
              <X className="w-4 h-4" />
            </Button>
          )}

          <Button
            type="button"
            variant="icon"
            size="icon"
            onClick={onCurrentLocation}
            className="shrink-0"
          >
            <Navigation className="w-4 h-4" />
          </Button>
        </div>
      </form>

      {/* Suggestions dropdown */}
      <AnimatePresence>
        {isFocused && !query && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-3 glass-card rounded-2xl p-3 z-50"
          >
            <p className="text-sm text-muted-foreground mb-3 px-2" dir="rtl">اقتراحات سريعة</p>
            <div className="space-y-1">
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
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors text-right"
                  dir="rtl"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary">
                    <suggestion.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-foreground font-medium">{suggestion.text}</p>
                    <p className="text-sm text-muted-foreground">{suggestion.category}</p>
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
