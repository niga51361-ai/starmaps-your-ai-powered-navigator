import React, { useEffect, useRef, useMemo } from 'react';

const ParticleField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  // Reduce particles for performance - use useMemo to avoid recreating
  const particleCount = useMemo(() => {
    // Fewer particles on mobile for better performance
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return 25;
    }
    return 40;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Simple particle structure for performance
    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number }[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
      });
    }

    // Throttled animation - target 30fps for performance
    const animate = (timestamp: number) => {
      const elapsed = timestamp - lastTimeRef.current;
      
      // Limit to ~30fps
      if (elapsed < 33) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      lastTimeRef.current = timestamp;

      ctx.clearRect(0, 0, width, height);

      particles.forEach((particle) => {
        // Simple movement
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around
        if (particle.x < 0) particle.x = width;
        if (particle.x > width) particle.x = 0;
        if (particle.y < 0) particle.y = height;
        if (particle.y > height) particle.y = 0;

        // Draw simple particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168, 85, 247, ${particle.opacity})`;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particleCount]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.5 }}
    />
  );
};

export default React.memo(ParticleField);
