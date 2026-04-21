'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface GradCapMeshProps {
  scrollProgress?: number;
}

export default function GradCapMesh({ scrollProgress = 0 }: GradCapMeshProps) {
  const groupRef = useRef<THREE.Group>(null);
  const tasselRef = useRef<THREE.Group>(null);
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
    groupRef.current.rotation.y = t * 0.18 + mouseTarget.current.x * 0.5;
    groupRef.current.rotation.x = 0.2 + Math.sin(t * 0.12) * 0.08 + mouseTarget.current.y * 0.3;
    groupRef.current.rotation.z = Math.sin(t * 0.08) * 0.05;

    // Gentle float
    groupRef.current.position.y = 0.3 + Math.sin(t * 0.4) * 0.18;

    // Tassel swing
    if (tasselRef.current) {
      tasselRef.current.rotation.z = Math.sin(t * 0.8) * 0.25;
      tasselRef.current.rotation.x = Math.sin(t * 0.6) * 0.15;
    }

    // Scroll fade
    const scrollFade = 1 - scrollProgress * 0.4;
    groupRef.current.scale.setScalar(scrollFade * 1.5);
    groupRef.current.position.z = -scrollProgress * 2;
  });

  const opacity = Math.max(0, 1 - scrollProgress * 0.9);

  const capMaterial = (
    <meshStandardMaterial
      color="#1a1a1a"
      metalness={0.7}
      roughness={0.3}
      emissive="#E8643C"
      emissiveIntensity={0.06}
      transparent
      opacity={opacity}
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
      opacity={Math.max(0, 0.85 - scrollProgress * 0.85)}
    />
  );

  const bandMaterial = (
    <meshStandardMaterial
      color="#2a2a2a"
      metalness={0.8}
      roughness={0.2}
      emissive="#E8643C"
      emissiveIntensity={0.1}
      transparent
      opacity={opacity}
    />
  );

  return (
    <group ref={groupRef} position={[2.8, 0.3, -1]}>
      {/* Mortarboard - flat square top */}
      <mesh position={[0, 0.45, 0]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[1.8, 0.08, 1.8]} />
        {capMaterial}
      </mesh>

      {/* Board edge accent */}
      <mesh position={[0, 0.5, 0]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[1.82, 0.02, 1.82]} />
        {accentMaterial}
      </mesh>

      {/* Skull cap - half sphere base */}
      <mesh position={[0, 0.1, 0]}>
        <sphereGeometry args={[0.7, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        {capMaterial}
      </mesh>

      {/* Cap band / rim */}
      <mesh position={[0, 0.05, 0]}>
        <torusGeometry args={[0.7, 0.04, 8, 32]} />
        {bandMaterial}
      </mesh>

      {/* Second band accent */}
      <mesh position={[0, 0.12, 0]}>
        <torusGeometry args={[0.68, 0.02, 8, 32]} />
        {accentMaterial}
      </mesh>

      {/* Button on top center */}
      <mesh position={[0, 0.54, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.06, 16]} />
        {accentMaterial}
      </mesh>
      <mesh position={[0, 0.58, 0]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        {accentMaterial}
      </mesh>

      {/* Tassel group - hangs from button */}
      <group ref={tasselRef} position={[0, 0.54, 0]}>
        {/* Tassel cord */}
        <mesh position={[0.5, -0.15, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.7, 8]} />
          {accentMaterial}
        </mesh>

        {/* Tassel knot */}
        <mesh position={[0.5, -0.52, 0]}>
          <sphereGeometry args={[0.04, 10, 10]} />
          {accentMaterial}
        </mesh>

        {/* Tassel threads */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const r = 0.025;
          return (
            <mesh
              key={i}
              position={[
                0.5 + Math.cos(angle) * r,
                -0.7,
                Math.sin(angle) * r,
              ]}
            >
              <cylinderGeometry args={[0.008, 0.005, 0.35, 6]} />
              {accentMaterial}
            </mesh>
          );
        })}

        {/* Horizontal cord from button to tassel */}
        <mesh position={[0.25, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.012, 0.012, 0.5, 8]} />
          {accentMaterial}
        </mesh>
      </group>

      {/* Diploma scroll floating nearby */}
      <group position={[1.2, -0.3, 0.3]} rotation={[0.2, 0.5, 0.1]}>
        {/* Scroll body */}
        <mesh>
          <cylinderGeometry args={[0.12, 0.12, 0.8, 16]} />
          <meshStandardMaterial
            color="#222"
            metalness={0.5}
            roughness={0.4}
            emissive="#E8643C"
            emissiveIntensity={0.05}
            transparent
            opacity={Math.max(0, 0.7 - scrollProgress * 0.7)}
          />
        </mesh>
        {/* Scroll ends */}
        <mesh position={[0, 0.42, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.04, 16]} />
          {accentMaterial}
        </mesh>
        <mesh position={[0, -0.42, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.04, 16]} />
          {accentMaterial}
        </mesh>
        {/* Ribbon */}
        <mesh position={[0, 0, 0.13]} rotation={[0, 0, 0.3]}>
          <boxGeometry args={[0.04, 0.4, 0.01]} />
          {accentMaterial}
        </mesh>
      </group>

      {/* Glow light */}
      <pointLight
        position={[0, 0.6, 0.5]}
        color="#E8643C"
        intensity={0.4}
        distance={3}
        decay={2}
      />

      {/* Wireframe overlay */}
      <mesh position={[0, 0.45, 0]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[1.84, 0.12, 1.84]} />
        <meshBasicMaterial
          color="#E8643C"
          wireframe
          transparent
          opacity={Math.max(0, 0.05 - scrollProgress * 0.05)}
        />
      </mesh>
    </group>
  );
}
