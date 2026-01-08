import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wifi, Battery, Signal, Clock } from 'lucide-react';

const StatusBar: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="fixed top-0 left-0 right-0 z-40 px-4 py-2"
    >
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        {/* Left side - Connection status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 glass-card px-3 py-1.5 rounded-full">
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-green-500"
            />
            <span className="text-xs text-muted-foreground">متصل</span>
          </div>
        </div>

        {/* Right side - System info */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <div className="flex items-center gap-1">
              <Battery className="w-4 h-4" />
              <span>100%</span>
            </div>
          </div>
          <div className="glass-card px-3 py-1.5 rounded-full">
            <span className="text-xs font-medium text-foreground">
              {time.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StatusBar;
