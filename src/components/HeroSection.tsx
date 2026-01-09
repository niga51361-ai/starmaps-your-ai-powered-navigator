import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Globe, Zap, Shield, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from './Logo';

interface HeroSectionProps {
  onExplore: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onExplore }) => {
  const features = [
    { icon: Globe, label: 'خرائط ثلاثية الأبعاد' },
    { icon: Zap, label: 'ذكاء اصطناعي' },
    { icon: Shield, label: 'خصوصية تامة' },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-20 overflow-hidden">
      {/* Simplified background orbs */}
      <div 
        className="absolute top-1/4 left-1/4 w-48 sm:w-64 h-48 sm:h-64 rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, hsl(var(--primary) / 0.3) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, hsl(var(--accent) / 0.3) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center max-w-4xl mx-auto w-full"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6 sm:mb-8"
        >
          <Logo size="lg" />
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-secondary/50 backdrop-blur-sm border border-border/50 mb-6 sm:mb-8"
        >
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
          <span className="text-xs sm:text-sm text-muted-foreground">مدعوم بالذكاء الاصطناعي</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-4 sm:mb-6 px-2"
          dir="rtl"
        >
          <span className="text-foreground">استكشف العالم</span>
          <br />
          <span className="text-gradient">بطريقة ذكية</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-10 px-4"
          dir="rtl"
        >
          تجربة خرائط ثورية تجمع بين قوة الذكاء الاصطناعي وجمال التصميم.
          اكتشف، تنقّل، واستكشف بشكل لم تعهده من قبل.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10 sm:mb-16 px-4"
        >
          <Button
            variant="glow"
            size="lg"
            onClick={onExplore}
            className="w-full sm:w-auto group text-base"
          >
            <Globe className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" />
            ابدأ الاستكشاف
          </Button>
          <Button variant="glass" size="lg" className="w-full sm:w-auto text-base">
            شاهد كيف يعمل
          </Button>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 px-4"
        >
          {features.map((feature, index) => (
            <div
              key={feature.label}
              className="flex items-center gap-2 text-muted-foreground"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <feature.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
              </div>
              <span className="text-xs sm:text-sm">{feature.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-1 text-muted-foreground"
        >
          <span className="text-xs hidden sm:block">اسحب للأسفل</span>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default React.memo(HeroSection);
