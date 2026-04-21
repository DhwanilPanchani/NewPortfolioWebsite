'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RoundedBox } from '@react-three/drei';

interface BriefcaseMeshProps {
  scrollProgress?: number;
}

export default function BriefcaseMesh({ scrollProgress = 0 }: BriefcaseMeshProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  const mouseTarget = useRef(new THREE.Vector2(0, 0));

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    // Smooth mouse follow
    mouseTarget.current.lerp(
      new THREE.Vector2(pointer.x * 0.3, pointer.y * 0.2),
      0.04
    );

    // Auto rotation + mouse influence
    groupRef.current.rotation.y = t * 0.15 + mouseTarget.current.x * 0.5;
    groupRef.current.rotation.x = Math.sin(t * 0.1) * 0.1 + mouseTarget.current.y * 0.3;
    groupRef.current.rotation.z = Math.sin(t * 0.08) * 0.05;

    // Gentle float
    groupRef.current.position.y = Math.sin(t * 0.4) * 0.15;

    // Scroll fade - move away and scale down
    const scrollFade = 1 - scrollProgress * 0.4;
    groupRef.current.scale.setScalar(scrollFade * 1.8);
    groupRef.current.position.z = -scrollProgress * 2;
  });

  const bodyMaterial = (
    <meshStandardMaterial
      color="#1a1a1a"
      metalness={0.7}
      roughness={0.3}
      emissive="#E8643C"
      emissiveIntensity={0.08}
      transparent
      opacity={Math.max(0, 1 - scrollProgress * 0.9)}
    />
  );

  const accentMaterial = (
    <meshStandardMaterial
      color="#2a2a2a"
      metalness={0.8}
      roughness={0.2}
      emissive="#E8643C"
      emissiveIntensity={0.15}
      transparent
      opacity={Math.max(0, 1 - scrollProgress * 0.9)}
    />
  );

  const edgeMaterial = (
    <meshStandardMaterial
      color="#E8643C"
      metalness={0.6}
      roughness={0.4}
      emissive="#E8643C"
      emissiveIntensity={0.3}
      transparent
      opacity={Math.max(0, 0.7 - scrollProgress * 0.7)}
    />
  );

  return (
    <group ref={groupRef} position={[2.8, 0.2, -1]}>
      {/* Main body */}
      <RoundedBox args={[2, 1.3, 0.7]} radius={0.08} smoothness={4}>
        {bodyMaterial}
      </RoundedBox>

      {/* Top flap / lid line */}
      <mesh position={[0, 0.35, 0.36]}>
        <boxGeometry args={[1.9, 0.02, 0.01]} />
        {edgeMaterial}
      </mesh>

      {/* Clasp left */}
      <mesh position={[-0.25, 0.15, 0.36]}>
        <boxGeometry args={[0.12, 0.08, 0.04]} />
        {edgeMaterial}
      </mesh>

      {/* Clasp right */}
      <mesh position={[0.25, 0.15, 0.36]}>
        <boxGeometry args={[0.12, 0.08, 0.04]} />
        {edgeMaterial}
      </mesh>

      {/* Handle base left */}
      <mesh position={[-0.2, 0.7, 0]}>
        <boxGeometry args={[0.06, 0.12, 0.06]} />
        {accentMaterial}
      </mesh>

      {/* Handle base right */}
      <mesh position={[0.2, 0.7, 0]}>
        <boxGeometry args={[0.06, 0.12, 0.06]} />
        {accentMaterial}
      </mesh>

      {/* Handle bar */}
      <mesh position={[0, 0.82, 0]}>
        <boxGeometry args={[0.46, 0.06, 0.06]} />
        {edgeMaterial}
      </mesh>

      {/* Handle bar rounded caps */}
      <mesh position={[-0.23, 0.82, 0]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        {edgeMaterial}
      </mesh>
      <mesh position={[0.23, 0.82, 0]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        {edgeMaterial}
      </mesh>

      {/* Side reinforcement strips */}
      <mesh position={[0, -0.5, 0.36]}>
        <boxGeometry args={[2, 0.02, 0.01]} />
        {accentMaterial}
      </mesh>
      <mesh position={[0, 0, 0.36]}>
        <boxGeometry args={[0.02, 1.3, 0.01]} />
        {accentMaterial}
      </mesh>

      {/* Corner accents */}
      {[[-1, 0.65], [1, 0.65], [-1, -0.65], [1, -0.65]].map(([x, y], i) => (
        <mesh key={i} position={[x * 0.96, y * 0.96, 0.36]}>
          <sphereGeometry args={[0.03, 6, 6]} />
          {edgeMaterial}
        </mesh>
      ))}

      {/* Wireframe overlay for tech feel */}
      <RoundedBox args={[2.02, 1.32, 0.72]} radius={0.08} smoothness={4}>
        <meshBasicMaterial
          color="#E8643C"
          wireframe
          transparent
          opacity={Math.max(0, 0.06 - scrollProgress * 0.06)}
        />
      </RoundedBox>
    </group>
  );
}
