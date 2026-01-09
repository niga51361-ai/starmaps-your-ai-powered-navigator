import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Navigation, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  onCurrentLocation?: () => void;
}

const suggestions = ['مطاعم قريبة', 'محطات وقود', 'مستشفيات', 'فنادق'];

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onCurrentLocation }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch?.(query);
      setQuery('');
      setIsFocused(false);
    }
  }, [query, onSearch]);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    onSearch?.(suggestion);
    setIsFocused(false);
  }, [onSearch]);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div 
          className={`relative flex items-center rounded-2xl transition-all duration-200 ${isFocused ? 'ring-2 ring-primary/50' : ''}`}
          style={{
            background: 'hsl(var(--background) / 0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid hsl(var(--border) / 0.5)',
            boxShadow: isFocused ? '0 8px 32px hsl(var(--primary) / 0.15)' : '0 4px 16px hsl(0 0% 0% / 0.2)',
          }}
        >
          <Button type="button" variant="ghost" size="icon" className="shrink-0 ml-1 sm:ml-2 rounded-xl text-muted-foreground w-9 h-9 sm:w-10 sm:h-10" onClick={onCurrentLocation}>
            <Navigation className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder="ابحث عن مكان أو عنوان..."
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none py-3 sm:py-4 px-2 text-sm sm:text-base"
            dir="rtl"
          />

          <AnimatePresence>
            {query && (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                <Button type="button" variant="ghost" size="icon" className="shrink-0 rounded-xl text-muted-foreground w-8 h-8" onClick={() => setQuery('')}>
                  <X className="w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
          
          <Button type="submit" size="icon" className="shrink-0 mr-1.5 sm:mr-2 w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground">
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>
      </form>

      <AnimatePresence>
        {isFocused && !query && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 rounded-xl overflow-hidden z-50"
            style={{ background: 'hsl(var(--background) / 0.95)', backdropFilter: 'blur(20px)', border: '1px solid hsl(var(--border) / 0.5)' }}
          >
            <div className="p-2" dir="rtl">
              <p className="text-xs text-muted-foreground px-3 py-2">اقتراحات سريعة</p>
              {suggestions.map((suggestion) => (
                <button key={suggestion} type="button" onClick={() => handleSuggestionClick(suggestion)} className="w-full text-right px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-secondary/50 transition-colors flex items-center gap-2">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  {suggestion}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(SearchBar);
