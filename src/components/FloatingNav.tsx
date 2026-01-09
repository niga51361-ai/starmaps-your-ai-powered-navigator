import React from 'react';
import { motion } from 'framer-motion';
import { Home, Search, MessageSquare, User, Map } from 'lucide-react';

interface FloatingNavProps {
  activeItem?: string;
  onItemClick?: (item: string) => void;
}

const FloatingNav: React.FC<FloatingNavProps> = ({ activeItem = 'map', onItemClick }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'الرئيسية' },
    { id: 'map', icon: Map, label: 'الخريطة' },
    { id: 'search', icon: Search, label: 'بحث' },
    { id: 'chat', icon: MessageSquare, label: 'المساعد' },
    { id: 'profile', icon: User, label: 'حسابي' },
  ];

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-32px)] max-w-md sm:w-auto"
    >
      <div 
        className="rounded-2xl sm:rounded-full px-1.5 sm:px-2 py-1.5 sm:py-2 flex items-center justify-around sm:justify-center sm:gap-1 backdrop-blur-xl"
        style={{
          background: 'hsl(var(--background) / 0.8)',
          border: '1px solid hsl(var(--border) / 0.5)',
          boxShadow: '0 8px 32px hsl(var(--primary) / 0.15)',
        }}
      >
        {navItems.map((item) => {
          const isActive = activeItem === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onItemClick?.(item.id)}
              className={`
                relative flex items-center justify-center gap-1.5 sm:gap-2 
                px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-full 
                transition-all duration-200
                ${isActive 
                  ? 'text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground active:scale-95'
                }
              `}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-active-bg"
                  className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-xl sm:rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <item.icon className="relative z-10 w-5 h-5" />
              {isActive && (
                <span className="relative z-10 text-xs sm:text-sm font-medium hidden sm:inline">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default React.memo(FloatingNav);
