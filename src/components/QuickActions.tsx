import React, { useCallback } from 'react';
import { Coffee, Utensils, Fuel, Building2, ShoppingBag, Car } from 'lucide-react';

interface QuickActionsProps {
  onActionSelect?: (action: string) => void;
}

const actions = [
  { id: 'restaurants', icon: Utensils, label: 'مطاعم', color: 'from-orange-500 to-red-500' },
  { id: 'cafes', icon: Coffee, label: 'مقاهي', color: 'from-amber-500 to-orange-500' },
  { id: 'gas', icon: Fuel, label: 'وقود', color: 'from-green-500 to-emerald-500' },
  { id: 'hotels', icon: Building2, label: 'فنادق', color: 'from-blue-500 to-indigo-500' },
  { id: 'shopping', icon: ShoppingBag, label: 'تسوق', color: 'from-pink-500 to-rose-500' },
  { id: 'parking', icon: Car, label: 'مواقف', color: 'from-purple-500 to-violet-500' },
];

const QuickActions: React.FC<QuickActionsProps> = ({ onActionSelect }) => {
  const handleClick = useCallback((action: string) => {
    onActionSelect?.(action);
  }, [onActionSelect]);

  return (
    <div className="overflow-x-auto scrollbar-hide -mx-3 sm:-mx-4 md:-mx-6 px-3 sm:px-4 md:px-6">
      <div className="flex gap-2 sm:gap-3 pb-2">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleClick(action.label)}
            className="flex flex-col items-center gap-1.5 sm:gap-2 shrink-0 group"
          >
            <div 
              className={`
                w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl 
                flex items-center justify-center
                bg-gradient-to-br ${action.color}
                shadow-lg group-hover:scale-105 group-active:scale-95
                transition-transform duration-200
              `}
            >
              <action.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default React.memo(QuickActions);
