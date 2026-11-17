import React from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { useReducedMotionPref } from '../../hooks/useReducedMotionPref';

export const ScrollProgressBar: React.FC = () => {
  const prefersReduced = useReducedMotionPref();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 240,
    damping: 32,
    restDelta: 0.001,
  });

  if (prefersReduced) {
    return null;
  }

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[2px] bg-[#5578F5] origin-left z-50 pointer-events-none"
    />
  );
};
