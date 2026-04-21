'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AmbientMeshProps {
  scrollProgress?: number;
}

export default function AmbientMesh({ scrollProgress = 0 }: AmbientMeshProps) {
  const torusRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (torusRef.current) {
      torusRef.current.rotation.x = t * 0.05 + scrollProgress * 2;
      torusRef.current.rotation.z = t * 0.03;
      torusRef.current.position.y = -2 + scrollProgress * -6;
      torusRef.current.position.x = -3 + scrollProgress * 1;
    }

    if (ringRef.current) {
      ringRef.current.rotation.z = -t * 0.04;
      ringRef.current.rotation.x = Math.PI * 0.4 + Math.sin(t * 0.1) * 0.1;
      ringRef.current.position.y = 3 - scrollProgress * 8;
      ringRef.current.position.x = 3;
    }
  });

  return (
    <>
      {/* Large wireframe torus — bottom left */}
      <mesh ref={torusRef} position={[-3, -2, -2]}>
        <torusGeometry args={[1.8, 0.02, 16, 100]} />
        <meshBasicMaterial
          color="#E8643C"
          transparent
          opacity={0.12}
          wireframe
        />
      </mesh>

      {/* Thin ring — top right */}
      <mesh ref={ringRef} position={[3, 3, -3]}>
        <ringGeometry args={[1.2, 1.25, 64]} />
        <meshBasicMaterial
          color="#555555"
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
}
