'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const COLORS = [
  'rgba(99, 102, 241, 0.5)',
  'rgba(139, 92, 246, 0.5)',
  'rgba(168, 85, 247, 0.5)',
  'rgba(217, 70, 239, 0.5)',
];

interface Particle {
  id: number;
  width: number;
  height: number;
  left: number;
  top: number;
  color: string;
  x: [number, number];
  y: [number, number];
  duration: number;
  delay: number;
}

export default function ParticlesBackground({ count = 30 }) {
  const [isMounted, setIsMounted] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const newParticles = Array.from({ length: count }, (_, i) => {
        const width = Math.random() * 6 + 2;
        const height = Math.random() * 6 + 2;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        const x: [number, number] = [0, (Math.random() - 0.5) * 40];
        const y: [number, number] = [0, (Math.random() - 0.5) * 20];
        const duration = 15 + Math.random() * 15;
        const delay = Math.random() * 5;

        return { id: i, width, height, left, top, color, x, y, duration, delay };
      });
      setParticles(newParticles);
    }
  }, [count, isMounted]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: `${particle.width}px`,
            height: `${particle.height}px`,
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            backgroundColor: particle.color,
            filter: 'blur(1px)',
            opacity: 0.3,
          }}
          initial={{ x: 0, y: 0 }}
          animate={{
            x: particle.x,
            y: particle.y,
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}