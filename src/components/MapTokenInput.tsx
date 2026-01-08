import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, ExternalLink, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MapTokenInputProps {
  onTokenSubmit: (token: string) => void;
}

const MapTokenInput: React.FC<MapTokenInputProps> = ({ onTokenSubmit }) => {
  const [token, setToken] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      onTokenSubmit(token.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xl"
    >
      <div className="glass-card rounded-3xl p-8 max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-primary mx-auto flex items-center justify-center mb-4">
            <Key className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-display font-bold text-foreground">
            مفتاح Mapbox
          </h2>
          <p className="text-muted-foreground text-sm" dir="rtl">
            للبدء في استخدام StarMaps، تحتاج إلى إدخال مفتاح Mapbox العام الخاص بك
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="pk.xxxxxxxxxxxxxxxxxxxxxxxx"
              className="w-full bg-secondary rounded-xl px-4 py-4 text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono text-sm"
              dir="ltr"
            />
          </div>

          <Button
            type="submit"
            variant="glow"
            className="w-full"
            size="lg"
            disabled={!token.trim()}
          >
            <Check className="w-5 h-5 ml-2" />
            بدء الاستخدام
          </Button>
        </form>

        <div className="pt-4 border-t border-border/50">
          <a
            href="https://mapbox.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            احصل على مفتاح مجاني من Mapbox
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default MapTokenInput;
