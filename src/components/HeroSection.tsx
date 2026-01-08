import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowDown, Globe, Zap, Shield } from 'lucide-react';
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
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20">
      {/* Floating orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full"
        style={{
          background: 'radial-gradient(circle, hsla(270, 95%, 65%, 0.15) 0%, transparent 70%)',
        }}
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full"
        style={{
          background: 'radial-gradient(circle, hsla(280, 100%, 70%, 0.1) 0%, transparent 70%)',
        }}
        animate={{
          x: [0, -40, 0],
          y: [0, 30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 text-center max-w-4xl mx-auto"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Logo size="lg" />
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8"
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">مدعوم بالذكاء الاصطناعي</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6"
          dir="rtl"
        >
          <span className="text-foreground">استكشف العالم</span>
          <br />
          <span className="text-gradient">بطريقة ذكية</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          dir="rtl"
        >
          تجربة خرائط ثورية تجمع بين قوة الذكاء الاصطناعي وجمال التصميم.
          اكتشف، تنقّل، واستكشف بشكل لم تعهده من قبل.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Button
            variant="glow"
            size="xl"
            onClick={onExplore}
            className="group"
          >
            <Globe className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" />
            ابدأ الاستكشاف
          </Button>
          <Button variant="glass" size="xl">
            شاهد كيف يعمل
          </Button>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-wrap items-center justify-center gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
              className="flex items-center gap-2 text-muted-foreground"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <feature.icon className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm">{feature.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-xs">اسحب للأسفل</span>
          <ArrowDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
