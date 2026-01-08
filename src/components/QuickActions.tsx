import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Coffee, Fuel, ShoppingBag, Building2, Utensils, Car, Plane } from 'lucide-react';

interface QuickActionsProps {
  onActionSelect: (action: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onActionSelect }) => {
  const actions = [
    { icon: Utensils, label: 'مطاعم', color: 'from-orange-500 to-red-500' },
    { icon: Coffee, label: 'مقاهي', color: 'from-amber-500 to-orange-500' },
    { icon: Fuel, label: 'محطات وقود', color: 'from-green-500 to-emerald-500' },
    { icon: ShoppingBag, label: 'تسوق', color: 'from-pink-500 to-rose-500' },
    { icon: Building2, label: 'فنادق', color: 'from-blue-500 to-indigo-500' },
    { icon: Car, label: 'مواقف', color: 'from-cyan-500 to-blue-500' },
    { icon: Plane, label: 'مطارات', color: 'from-violet-500 to-purple-500' },
    { icon: MapPin, label: 'مميزة', color: 'from-primary to-accent' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
        {actions.map((action, index) => (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onActionSelect(action.label)}
            className="flex flex-col items-center gap-2 p-3 rounded-2xl glass-card hover:border-primary/30 transition-all group"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}>
              <action.icon className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
              {action.label}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default QuickActions;
