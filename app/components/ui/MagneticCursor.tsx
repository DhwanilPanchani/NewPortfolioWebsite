'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function MagneticCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const dotX = useMotionValue(0);
  const dotY = useMotionValue(0);

  // Ring follows with slight lag — creates depth
  const springConfig = { damping: 22, stiffness: 220, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  // Dot tracks tighter
  const dotSpringConfig = { damping: 35, stiffness: 380, mass: 0.25 };
  const smoothDotX = useSpring(dotX, dotSpringConfig);
  const smoothDotY = useSpring(dotY, dotSpringConfig);

  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const interactive = target.closest('a, button, [data-cursor="hover"]');
    setIsHovering(!!interactive);
  }, []);

  useEffect(() => {
    // Don't show custom cursor on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      dotX.set(e.clientX);
      dotY.set(e.clientY);
    };

    const handleMouseLeave = () => setIsHidden(true);
    const handleMouseEnter = () => setIsHidden(false);
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', move, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);

    // Hide default cursor
    document.body.style.cursor = 'none';

    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
      document.body.style.cursor = '';
    };
  }, [cursorX, cursorY, dotX, dotY, handleMouseOver]);

  // Don't render on touch devices (SSR safe)
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  const ringSize = isClicking ? 24 : isHovering ? 52 : 32;

  return (
    <>
      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference hidden md:block"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: ringSize,
          height: ringSize,
          opacity: isHidden ? 0 : 1,
        }}
        transition={{
          width: { type: 'spring', stiffness: 400, damping: 25 },
          height: { type: 'spring', stiffness: 400, damping: 25 },
          opacity: { duration: 0.15 },
        }}
      >
        <div
          className="w-full h-full rounded-full border transition-colors duration-200"
          style={{
            borderColor: isHovering ? '#E8643C' : 'rgba(237, 237, 237, 0.5)',
            borderWidth: isClicking ? 2 : 1,
          }}
        />
      </motion.div>

      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none hidden md:block"
        style={{
          x: smoothDotX,
          y: smoothDotY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isClicking ? 8 : isHovering ? 6 : 4,
          height: isClicking ? 8 : isHovering ? 6 : 4,
          opacity: isHidden ? 0 : 1,
        }}
        transition={{
          width: { type: 'spring', stiffness: 500, damping: 30 },
          height: { type: 'spring', stiffness: 500, damping: 30 },
          opacity: { duration: 0.1 },
        }}
      >
        <div
          className="w-full h-full rounded-full transition-colors duration-150"
          style={{ background: isHovering ? '#E8643C' : '#EDEDED' }}
        />
      </motion.div>
    </>
  );
}
