import React from 'react';
import { motion } from 'framer-motion';
import { Home, Search, MessageSquare, Settings, User, Map } from 'lucide-react';

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
      transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="glass-card rounded-full px-2 py-2 flex items-center gap-1">
        {navItems.map((item) => {
          const isActive = activeItem === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => onItemClick?.(item.id)}
              className={`
                relative flex items-center gap-2 px-4 py-3 rounded-full transition-all duration-300
                ${isActive 
                  ? 'text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-active-bg"
                  className="absolute inset-0 bg-gradient-primary rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <item.icon className="relative z-10 w-5 h-5" />
              {isActive && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  className="relative z-10 text-sm font-medium whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default FloatingNav;
