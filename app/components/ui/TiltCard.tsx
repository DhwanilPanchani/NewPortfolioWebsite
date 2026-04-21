'use client';

import { useRef, useCallback, ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  tiltAmount?: number;
  glareOpacity?: number;
}

export default function TiltCard({
  children,
  className = '',
  tiltAmount = 8,
  glareOpacity = 0.1,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  // Raw motion values — no re-renders on mouse move
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const isHovered = useMotionValue(0);

  // Smooth springs for tilt
  const springConfig = { stiffness: 260, damping: 24, mass: 0.6 };
  const rotateX = useSpring(
    useTransform(mouseY, [0, 1], [tiltAmount, -tiltAmount]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(mouseX, [0, 1], [-tiltAmount, tiltAmount]),
    springConfig
  );

  // Glare position follows mouse directly (no spring — intentionally snappier)
  const glareXPos = useTransform(mouseX, [0, 1], [0, 100]);
  const glareYPos = useTransform(mouseY, [0, 1], [0, 100]);
  const glareOpacityVal = useSpring(isHovered, { stiffness: 200, damping: 30 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }, [mouseX, mouseY]);

  const handleMouseEnter = useCallback(() => {
    isHovered.set(1);
  }, [isHovered]);

  const handleMouseLeave = useCallback(() => {
    isHovered.set(0);
    mouseX.set(0.5);
    mouseY.set(0.5);
  }, [isHovered, mouseX, mouseY]);

  return (
    <motion.div
      ref={cardRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        transformStyle: 'preserve-3d',
        rotateX,
        rotateY,
      }}
    >
      {/* Glare overlay */}
      <motion.div
        ref={glareRef}
        className="absolute inset-0 rounded-2xl pointer-events-none z-10"
        style={{
          background: useTransform(
            [glareXPos, glareYPos],
            ([x, y]) =>
              `radial-gradient(ellipse 60% 60% at ${x}% ${y}%, rgba(255,255,255,${glareOpacity}), transparent 70%)`
          ),
          opacity: glareOpacityVal,
        }}
      />
      {children}
    </motion.div>
  );
}
