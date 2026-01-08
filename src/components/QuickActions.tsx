import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Coffee, Fuel, ShoppingBag, Building2, Utensils, Car, Plane, Heart, Landmark } from 'lucide-react';

interface QuickActionsProps {
  onActionSelect: (action: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onActionSelect }) => {
  const actions = [
    { icon: Utensils, label: 'مطاعم', gradient: 'from-orange-500 via-red-500 to-pink-500' },
    { icon: Coffee, label: 'مقاهي', gradient: 'from-amber-500 via-orange-500 to-red-500' },
    { icon: Fuel, label: 'وقود', gradient: 'from-green-500 via-emerald-500 to-teal-500' },
    { icon: ShoppingBag, label: 'تسوق', gradient: 'from-pink-500 via-rose-500 to-red-500' },
    { icon: Building2, label: 'فنادق', gradient: 'from-blue-500 via-indigo-500 to-purple-500' },
    { icon: Car, label: 'مواقف', gradient: 'from-cyan-500 via-blue-500 to-indigo-500' },
    { icon: Landmark, label: 'بنوك', gradient: 'from-yellow-500 via-amber-500 to-orange-500' },
    { icon: Heart, label: 'صحة', gradient: 'from-red-500 via-rose-500 to-pink-500' },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    show: { opacity: 1, y: 0, scale: 1 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full max-w-4xl mx-auto"
    >
      <div className="grid grid-cols-4 md:grid-cols-8 gap-2 md:gap-3">
        {actions.map((action, index) => (
          <motion.button
            key={action.label}
            variants={item}
            whileHover={{ scale: 1.08, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onActionSelect(action.label)}
            className="group flex flex-col items-center gap-2 p-3 rounded-2xl transition-all"
            style={{
              background: 'linear-gradient(135deg, hsl(250 15% 10% / 0.6), hsl(250 15% 8% / 0.8))',
              border: '1px solid hsl(250 10% 20% / 0.3)',
            }}
          >
            {/* Icon container with gradient */}
            <motion.div 
              className={`relative w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center overflow-hidden`}
              whileHover={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.4 }}
            >
              {/* Shine effect */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)',
                }}
                initial={{ x: '-100%', y: '-100%' }}
                whileHover={{ x: '100%', y: '100%' }}
                transition={{ duration: 0.5 }}
              />
              <action.icon className="relative w-5 h-5 md:w-6 md:h-6 text-white drop-shadow-lg" />
            </motion.div>
            
            {/* Label */}
            <span className="text-[10px] md:text-xs text-muted-foreground group-hover:text-foreground transition-colors font-medium">
              {action.label}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default QuickActions;
