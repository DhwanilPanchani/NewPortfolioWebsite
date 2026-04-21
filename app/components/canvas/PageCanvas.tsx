'use client';

import { useEffect, useState, useCallback } from 'react';
import Scene from './Scene';
import FloatingParticles from './FloatingParticles';
import RocketMesh from './RocketMesh';
import RobotMesh from './RobotMesh';
import LightbulbMesh from './LightbulbMesh';
import LaptopMesh from './LaptopMesh';
import KeypadPhoneMesh from './KeypadPhoneMesh';

interface PageCanvasProps {
  variant?: 'rocket' | 'robot' | 'lightbulb' | 'laptop' | 'phone' | 'particles';
}

export default function PageCanvas({ variant = 'particles' }: PageCanvasProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const vh = window.innerHeight;
    // Fade out over the first 1.5 viewport heights
    const progress = Math.min(scrollY / (vh * 1.5), 1);
    setScrollProgress(progress);
    setVisible(progress < 0.95);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (!visible) return null;

  const renderMesh = () => {
    switch (variant) {
      case 'rocket':
        return <RocketMesh scrollProgress={scrollProgress} />;
      case 'robot':
        return <RobotMesh scrollProgress={scrollProgress} />;
      case 'lightbulb':
        return <LightbulbMesh scrollProgress={scrollProgress} />;
      case 'laptop':
        return <LaptopMesh scrollProgress={scrollProgress} />;
      case 'phone':
        return <KeypadPhoneMesh scrollProgress={scrollProgress} />;
      case 'particles':
      default:
        return null;
    }
  };

  return (
    <div
      className="canvas-container"
      style={{ opacity: 1 - scrollProgress * 0.7 }}
    >
      <Scene>
        <ambientLight intensity={0.2} />
        <pointLight position={[5, 5, 5]} intensity={0.4} color="#E8643C" />
        <pointLight position={[-5, -3, 3]} intensity={0.2} color="#EDEDED" />
        <FloatingParticles count={60} scrollProgress={scrollProgress} />
        {renderMesh()}
      </Scene>
    </div>
  );
}
