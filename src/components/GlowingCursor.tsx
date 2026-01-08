import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

const GlowingCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  const springConfig = { damping: 25, stiffness: 200 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      x.set(e.clientX);
      y.set(e.clientY);

      const target = e.target as HTMLElement;
      setIsPointer(
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') !== null ||
        target.closest('a') !== null
      );
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [x, y]);

  return (
    <>
      {/* Main cursor glow */}
      <motion.div
        className="fixed pointer-events-none z-[100] mix-blend-screen hidden md:block"
        style={{
          x,
          y,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          className="rounded-full"
          style={{
            background: 'radial-gradient(circle, hsla(270, 95%, 65%, 0.3) 0%, transparent 70%)',
          }}
          animate={{
            width: isPointer ? 80 : 120,
            height: isPointer ? 80 : 120,
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>

      {/* Small dot */}
      <motion.div
        className="fixed pointer-events-none z-[101] hidden md:block"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          className="rounded-full bg-primary"
          animate={{
            width: isPointer ? 12 : 6,
            height: isPointer ? 12 : 6,
            opacity: isPointer ? 1 : 0.8,
          }}
          transition={{ duration: 0.15 }}
        />
      </motion.div>
    </>
  );
};

export default GlowingCursor;
