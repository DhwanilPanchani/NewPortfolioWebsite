'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface LightbulbMeshProps {
  scrollProgress?: number;
}

export default function LightbulbMesh({ scrollProgress = 0 }: LightbulbMeshProps) {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.PointLight>(null);
  const sparklesRef = useRef<THREE.Group>(null);
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
    groupRef.current.rotation.y = t * 0.2 + mouseTarget.current.x * 0.4;
    groupRef.current.rotation.x =
      Math.sin(t * 0.15) * 0.12 + mouseTarget.current.y * 0.25;
    groupRef.current.rotation.z = Math.sin(t * 0.1) * 0.06;

    // Gentle bobbing float
    groupRef.current.position.y = 0.3 + Math.sin(t * 0.5) * 0.2;

    // Pulsing inner glow (sin wave)
    if (glowRef.current) {
      glowRef.current.intensity = 0.6 + Math.sin(t * 1.5) * 0.3;
    }

    // Sparkle particles orbit and bob
    if (sparklesRef.current) {
      sparklesRef.current.children.forEach((child, i) => {
        const angle = (i / 6) * Math.PI * 2 + t * 0.4;
        const r = 1.05 + Math.sin(t * 0.8 + i) * 0.15;
        child.position.x = Math.cos(angle) * r;
        child.position.y = 0.4 + Math.sin(t * 1.2 + i * 1.1) * 0.4;
        child.position.z = Math.sin(angle) * r * 0.5;
        child.rotation.y = t * 2;
        child.rotation.x = t * 1.5;
        const sparkleScale = 0.8 + Math.sin(t * 3 + i * 0.9) * 0.4;
        child.scale.setScalar(sparkleScale);
      });
    }

    // Scroll-linked fade: opacity, scale, position.z
    const scrollFade = Math.max(0, 1 - scrollProgress * 0.4);
    groupRef.current.scale.setScalar(scrollFade * 1.3);
    groupRef.current.position.z = -2 - scrollProgress * 2;
  });

  const opacity = Math.max(0, 1 - scrollProgress * 0.9);
  const glassOpacity = Math.max(0, 0.55 - scrollProgress * 0.55);
  const accentOpacity = Math.max(0, 0.9 - scrollProgress * 0.9);
  const wireframeOpacity = Math.max(0, 0.1 - scrollProgress * 0.1);

  // Screw thread ring data: y-position and radius, decreasing
  const screwThreads = [
    { y: -0.40, radius: 0.265 },
    { y: -0.48, radius: 0.255 },
    { y: -0.56, radius: 0.245 },
    { y: -0.63, radius: 0.232 },
    { y: -0.69, radius: 0.218 },
  ];

  return (
    <group ref={groupRef} position={[3.8, 0.3, -2]}>
      {/* ── Glass Bulb ── */}
      <mesh position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.7, 48, 48]} />
        <meshStandardMaterial
          color="#F5F0E0"
          metalness={0.05}
          roughness={0.05}
          emissive="#FFE4B0"
          emissiveIntensity={0.15}
          transparent
          opacity={glassOpacity}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* ── Wireframe Overlay ── */}
      <mesh position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.73, 20, 20]} />
        <meshBasicMaterial
          color="#DDAA44"
          wireframe
          transparent
          opacity={wireframeOpacity}
        />
      </mesh>

      {/* ── Neck Taper ── */}
      <mesh position={[0, -0.22, 0]}>
        <cylinderGeometry args={[0.38, 0.26, 0.32, 24]} />
        <meshStandardMaterial
          color="#F5F0E0"
          metalness={0.05}
          roughness={0.05}
          emissive="#FFE8C0"
          emissiveIntensity={0.15}
          transparent
          opacity={glassOpacity}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ── Screw Base ── */}
      <mesh position={[0, -0.53, 0]}>
        <cylinderGeometry args={[0.26, 0.22, 0.38, 24]} />
        <meshStandardMaterial
          color="#B8860B"
          metalness={0.85}
          roughness={0.2}
          emissive="#8B6914"
          emissiveIntensity={0.05}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* ── Screw Thread Rings ── */}
      {screwThreads.map((thread, i) => (
        <mesh
          key={`thread-${i}`}
          position={[0, thread.y, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[thread.radius, 0.018, 8, 40]} />
          <meshStandardMaterial
            color="#CD950C"
            metalness={0.5}
            roughness={0.35}
            emissive="#AA7700"
            emissiveIntensity={0.2}
            transparent
            opacity={accentOpacity}
          />
        </mesh>
      ))}

      {/* ── Bottom Contact Point ── */}
      <mesh position={[0, -0.78, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial
          color="#8B7355"
          metalness={0.5}
          roughness={0.4}
          emissive="#8B6914"
          emissiveIntensity={0.2}
          transparent
          opacity={accentOpacity}
        />
      </mesh>

      {/* ── Internal Filament Detail ── */}
      <group position={[0, 0.3, 0]}>
        {/* Left support post */}
        <mesh position={[-0.1, -0.15, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.55, 8]} />
          <meshStandardMaterial
            color="#666666"
            metalness={0.3}
            roughness={0.5}
            emissive="#FF9900"
            emissiveIntensity={0.6}
            transparent
            opacity={accentOpacity}
          />
        </mesh>

        {/* Right support post */}
        <mesh position={[0.1, -0.15, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.55, 8]} />
          <meshStandardMaterial
            color="#666666"
            metalness={0.3}
            roughness={0.5}
            emissive="#FF9900"
            emissiveIntensity={0.6}
            transparent
            opacity={accentOpacity}
          />
        </mesh>

        {/* Upper coil ring */}
        <mesh position={[0, 0.12, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.08, 0.014, 10, 20]} />
          <meshStandardMaterial
            color="#FF8800"
            metalness={0.3}
            roughness={0.5}
            emissive="#FFAA00"
            emissiveIntensity={1.2}
            transparent
            opacity={accentOpacity}
          />
        </mesh>

        {/* Lower coil ring */}
        <mesh position={[0, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.065, 0.014, 10, 20]} />
          <meshStandardMaterial
            color="#FF8800"
            metalness={0.3}
            roughness={0.5}
            emissive="#FFAA00"
            emissiveIntensity={1.2}
            transparent
            opacity={accentOpacity}
          />
        </mesh>
      </group>

      {/* ── Pulsing Inner Glow Point Light ── */}
      <pointLight
        ref={glowRef}
        position={[0, 0.4, 0]}
        color="#FFD070"
        intensity={0.6}
        distance={4}
        decay={2}
      />

      {/* ── Sparkle / Diamond Particles ── */}
      <group ref={sparklesRef}>
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          const r = 1.05;
          return (
            <mesh
              key={`sparkle-${i}`}
              position={[
                Math.cos(angle) * r,
                0.4 + Math.sin(angle * 2) * 0.4,
                Math.sin(angle) * r * 0.5,
              ]}
            >
              <octahedronGeometry args={[0.028, 0]} />
              <meshStandardMaterial
                color="#FFD700"
                metalness={0.6}
                roughness={0.3}
                emissive="#FFAA00"
                emissiveIntensity={0.4}
                transparent
                opacity={accentOpacity}
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}
