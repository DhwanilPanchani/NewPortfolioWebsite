'use client';

import { useEffect, useState, useCallback } from 'react';
import Scene from './Scene';
import HeroMesh from './HeroMesh';
import FloatingParticles from './FloatingParticles';
import AmbientMesh from './AmbientMesh';

export default function HeroCanvas() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const vh = window.innerHeight;
    const progress = Math.min(scrollY / (vh * 2), 1);
    setScrollProgress(progress);
    setVisible(progress < 0.95);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (!visible) return null;

  return (
    <div
      className="canvas-container"
      style={{ opacity: 1 - scrollProgress * 0.6 }}
    >
      <Scene>
        <ambientLight intensity={0.2} />
        <pointLight position={[5, 5, 5]} intensity={0.4} color="#E8643C" />
        <pointLight position={[-5, -3, 3]} intensity={0.2} color="#EDEDED" />
        <HeroMesh scrollProgress={scrollProgress} />
        <FloatingParticles scrollProgress={scrollProgress} />
        <AmbientMesh scrollProgress={scrollProgress} />
      </Scene>
    </div>
  );
}
