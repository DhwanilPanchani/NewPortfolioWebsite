'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RoundedBox } from '@react-three/drei';

interface SmartphoneMeshProps {
  scrollProgress?: number;
}

export default function SmartphoneMesh({ scrollProgress = 0 }: SmartphoneMeshProps) {
  const groupRef = useRef<THREE.Group>(null);
  const screenGlowRef = useRef<THREE.PointLight>(null);
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
    groupRef.current.rotation.x = 0.1 + Math.sin(t * 0.12) * 0.08 + mouseTarget.current.y * 0.3;
    groupRef.current.rotation.z = Math.sin(t * 0.08) * 0.05;

    // Gentle float
    groupRef.current.position.y = Math.sin(t * 0.4) * 0.15;

    // Screen glow pulse
    if (screenGlowRef.current) {
      screenGlowRef.current.intensity = 0.4 + Math.sin(t * 1.2) * 0.15;
    }

    // Scroll fade
    const scrollFade = 1 - scrollProgress * 0.4;
    groupRef.current.scale.setScalar(scrollFade * 1.5);
    groupRef.current.position.z = -scrollProgress * 2;
  });

  const opacity = Math.max(0, 1 - scrollProgress * 0.9);

  const bodyMaterial = (
    <meshStandardMaterial
      color="#1a1a1a"
      metalness={0.8}
      roughness={0.2}
      emissive="#E8643C"
      emissiveIntensity={0.05}
      transparent
      opacity={opacity}
    />
  );

  const screenMaterial = (
    <meshStandardMaterial
      color="#0a0a0a"
      metalness={0.1}
      roughness={0.05}
      emissive="#88CCFF"
      emissiveIntensity={0.15}
      transparent
      opacity={Math.max(0, 0.9 - scrollProgress * 0.9)}
    />
  );

  const accentMaterial = (
    <meshStandardMaterial
      color="#E8643C"
      metalness={0.6}
      roughness={0.4}
      emissive="#E8643C"
      emissiveIntensity={0.35}
      transparent
      opacity={Math.max(0, 0.8 - scrollProgress * 0.8)}
    />
  );

  return (
    <group ref={groupRef} position={[3, 0.3, -1]}>
      {/* Phone body */}
      <RoundedBox args={[1.2, 2.2, 0.15]} radius={0.12} smoothness={4}>
        {bodyMaterial}
      </RoundedBox>

      {/* Screen */}
      <RoundedBox args={[1.05, 2, 0.01]} radius={0.08} smoothness={4} position={[0, 0, 0.08]}>
        {screenMaterial}
      </RoundedBox>

      {/* Screen bezel highlight */}
      <mesh position={[0, 0, 0.081]}>
        <planeGeometry args={[1.08, 2.03]} />
        <meshBasicMaterial
          color="#E8643C"
          wireframe
          transparent
          opacity={Math.max(0, 0.06 - scrollProgress * 0.06)}
        />
      </mesh>

      {/* Notch / dynamic island */}
      <RoundedBox args={[0.35, 0.08, 0.02]} radius={0.03} smoothness={4} position={[0, 0.9, 0.085]}>
        <meshStandardMaterial
          color="#111"
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={opacity}
        />
      </RoundedBox>

      {/* Front camera dot */}
      <mesh position={[0.08, 0.9, 0.09]}>
        <sphereGeometry args={[0.02, 12, 12]} />
        <meshStandardMaterial
          color="#222"
          metalness={0.9}
          roughness={0.05}
          emissive="#88CCFF"
          emissiveIntensity={0.2}
          transparent
          opacity={Math.max(0, 0.8 - scrollProgress * 0.8)}
        />
      </mesh>

      {/* Screen content - fake UI lines */}
      {[-0.3, -0.05, 0.2, 0.45].map((y, i) => (
        <mesh key={i} position={[0, y, 0.085]}>
          <boxGeometry args={[0.7 - i * 0.1, 0.025, 0.001]} />
          <meshStandardMaterial
            color="#E8643C"
            emissive="#E8643C"
            emissiveIntensity={0.5}
            transparent
            opacity={Math.max(0, (0.4 - i * 0.08) - scrollProgress * 0.4)}
          />
        </mesh>
      ))}

      {/* Screen content - app icon grid */}
      {[
        [-0.3, 0.65], [-0.1, 0.65], [0.1, 0.65], [0.3, 0.65],
        [-0.3, 0.45], [-0.1, 0.45], [0.1, 0.45], [0.3, 0.45],
      ].map(([x, y], i) => (
        <mesh key={`icon-${i}`} position={[x, y, 0.085]}>
          <boxGeometry args={[0.1, 0.1, 0.001]} />
          <meshStandardMaterial
            color={i % 3 === 0 ? '#E8643C' : i % 3 === 1 ? '#88CCFF' : '#44DD88'}
            emissive={i % 3 === 0 ? '#E8643C' : i % 3 === 1 ? '#88CCFF' : '#44DD88'}
            emissiveIntensity={0.3}
            transparent
            opacity={Math.max(0, 0.35 - scrollProgress * 0.35)}
          />
        </mesh>
      ))}

      {/* Side buttons - volume */}
      <mesh position={[-0.61, 0.35, 0]}>
        <boxGeometry args={[0.02, 0.18, 0.04]} />
        {accentMaterial}
      </mesh>
      <mesh position={[-0.61, 0.1, 0]}>
        <boxGeometry args={[0.02, 0.18, 0.04]} />
        {accentMaterial}
      </mesh>

      {/* Side button - power */}
      <mesh position={[0.61, 0.25, 0]}>
        <boxGeometry args={[0.02, 0.22, 0.04]} />
        {accentMaterial}
      </mesh>

      {/* Camera bump on back */}
      <RoundedBox args={[0.4, 0.4, 0.06]} radius={0.06} smoothness={4} position={[-0.25, 0.7, -0.1]}>
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.85}
          roughness={0.15}
          emissive="#E8643C"
          emissiveIntensity={0.04}
          transparent
          opacity={opacity}
        />
      </RoundedBox>

      {/* Camera lenses */}
      <mesh position={[-0.35, 0.8, -0.14]}>
        <cylinderGeometry args={[0.06, 0.06, 0.03, 16]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial
          color="#111"
          metalness={0.95}
          roughness={0.05}
          emissive="#88CCFF"
          emissiveIntensity={0.1}
          transparent
          opacity={opacity}
        />
      </mesh>
      <mesh position={[-0.15, 0.8, -0.14]}>
        <cylinderGeometry args={[0.06, 0.06, 0.03, 16]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial
          color="#111"
          metalness={0.95}
          roughness={0.05}
          transparent
          opacity={opacity}
        />
      </mesh>
      <mesh position={[-0.25, 0.6, -0.14]}>
        <cylinderGeometry args={[0.06, 0.06, 0.03, 16]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial
          color="#111"
          metalness={0.95}
          roughness={0.05}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Camera lens rings */}
      {[[-0.35, 0.8], [-0.15, 0.8], [-0.25, 0.6]].map(([x, y], i) => (
        <mesh key={`ring-${i}`} position={[x, y, -0.135]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.065, 0.008, 8, 24]} />
          {accentMaterial}
        </mesh>
      ))}

      {/* Screen glow */}
      <pointLight
        ref={screenGlowRef}
        position={[0, 0, 0.5]}
        color="#88CCFF"
        intensity={0.4}
        distance={3}
        decay={2}
      />

      {/* Wireframe overlay */}
      <RoundedBox args={[1.22, 2.22, 0.17]} radius={0.12} smoothness={4}>
        <meshBasicMaterial
          color="#E8643C"
          wireframe
          transparent
          opacity={Math.max(0, 0.04 - scrollProgress * 0.04)}
        />
      </RoundedBox>
    </group>
  );
}
