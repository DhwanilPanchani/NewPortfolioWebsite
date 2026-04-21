'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RoundedBox } from '@react-three/drei';

interface LaptopMeshProps {
  scrollProgress?: number;
}

export default function LaptopMesh({ scrollProgress = 0 }: LaptopMeshProps) {
  const groupRef = useRef<THREE.Group>(null);
  const lidRef = useRef<THREE.Group>(null);
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
    groupRef.current.rotation.y = t * 0.12 + mouseTarget.current.x * 0.5;
    groupRef.current.rotation.x = 0.25 + Math.sin(t * 0.1) * 0.08 + mouseTarget.current.y * 0.3;
    groupRef.current.rotation.z = Math.sin(t * 0.07) * 0.04;

    // Gentle floating animation
    groupRef.current.position.y = 0.3 + Math.sin(t * 0.4) * 0.12;

    // Lid breathing - very subtle oscillation
    if (lidRef.current) {
      lidRef.current.rotation.x = -0.35 + Math.sin(t * 0.5) * 0.02;
    }

    // Scroll-linked fade
    const scrollFade = 1 - scrollProgress * 0.4;
    groupRef.current.scale.setScalar(scrollFade * 1.5);
    groupRef.current.position.z = -1.5 - scrollProgress * 2;
  });

  const opacity = Math.max(0, 1 - scrollProgress * 0.9);

  // -- Materials --
  const baseMat = (
    <meshStandardMaterial
      color="#C0C0C0"
      metalness={0.7}
      roughness={0.25}
      emissive="#999999"
      emissiveIntensity={0.08}
      transparent
      opacity={opacity}
    />
  );

  const keyMat = (
    <meshStandardMaterial
      color="#1A1A1A"
      metalness={0.3}
      roughness={0.7}
      emissive="#222222"
      emissiveIntensity={0.05}
      transparent
      opacity={opacity}
    />
  );

  const accentMat = (
    <meshStandardMaterial
      color="#D0D0D0"
      metalness={0.6}
      roughness={0.3}
      emissive="#AAAAAA"
      emissiveIntensity={0.12}
      transparent
      opacity={Math.max(0, 0.85 - scrollProgress * 0.85)}
    />
  );

  const screenMat = (
    <meshStandardMaterial
      color="#0A1520"
      metalness={0.3}
      roughness={0.6}
      emissive="#6699CC"
      emissiveIntensity={0.2}
      transparent
      opacity={opacity}
    />
  );

  const trackpadMat = (
    <meshStandardMaterial
      color="#AAAAAA"
      metalness={0.6}
      roughness={0.3}
      emissive="#888888"
      emissiveIntensity={0.04}
      transparent
      opacity={opacity}
    />
  );

  // Keyboard grid
  const keys: JSX.Element[] = [];
  const keyRows = 5;
  const keyCols = 12;
  const keyW = 0.13;
  const keyH = 0.11;
  const keyGap = 0.025;
  const kbStartX = -((keyCols - 1) * (keyW + keyGap)) / 2;
  const kbStartZ = -0.22;

  for (let r = 0; r < keyRows; r++) {
    for (let c = 0; c < keyCols; c++) {
      keys.push(
        <mesh
          key={`key-${r}-${c}`}
          position={[
            kbStartX + c * (keyW + keyGap),
            0.07,
            kbStartZ + r * (keyH + keyGap),
          ]}
        >
          <boxGeometry args={[keyW, 0.02, keyH]} />
          {keyMat}
        </mesh>
      );
    }
  }

  // Fake UI lines on screen
  const uiLines: JSX.Element[] = [];
  const lineWidths = [0.9, 0.65, 1.1, 0.5, 0.8, 0.95, 0.4, 0.7];
  const lineOpacities = [0.7, 0.5, 0.8, 0.4, 0.6, 0.7, 0.35, 0.55];
  for (let i = 0; i < lineWidths.length; i++) {
    uiLines.push(
      <mesh
        key={`line-${i}`}
        position={[
          -(1.0 - lineWidths[i]) * 0.3,
          0.52 - i * 0.13,
          0.008,
        ]}
      >
        <boxGeometry args={[lineWidths[i], 0.025, 0.005]} />
        <meshStandardMaterial
          color="#44AAFF"
          emissive="#44AAFF"
          emissiveIntensity={0.4}
          transparent
          opacity={Math.max(0, lineOpacities[i] - scrollProgress * 0.9)}
        />
      </mesh>
    );
  }

  // Side ports (left side)
  const ports: JSX.Element[] = [];
  const portPositions = [-0.2, 0.05, 0.25];
  for (let i = 0; i < portPositions.length; i++) {
    ports.push(
      <mesh
        key={`port-${i}`}
        position={[-1.11, 0.04, portPositions[i]]}
      >
        <boxGeometry args={[0.02, 0.03, 0.1]} />
        <meshStandardMaterial
          color="#444444"
          metalness={0.9}
          roughness={0.2}
          transparent
          opacity={opacity}
        />
      </mesh>
    );
  }

  // Rubber feet positions
  const feetPositions: [number, number, number][] = [
    [-0.95, -0.06, -0.58],
    [0.95, -0.06, -0.58],
    [-0.95, -0.06, 0.58],
    [0.95, -0.06, 0.58],
  ];

  return (
    <group ref={groupRef} position={[3.2, 0.3, -1.5]}>
      {/* ===== BASE / KEYBOARD SECTION ===== */}

      {/* Main body */}
      <RoundedBox
        args={[2.2, 0.12, 1.4]}
        radius={0.03}
        smoothness={4}
        position={[0, 0, 0]}
      >
        {baseMat}
      </RoundedBox>

      {/* Keyboard keys */}
      {keys}

      {/* Trackpad */}
      <mesh position={[0, 0.065, 0.38]}>
        <boxGeometry args={[0.6, 0.008, 0.35]} />
        {trackpadMat}
      </mesh>

      {/* Front edge accent (silver) */}
      <mesh position={[0, 0.0, 0.695]}>
        <boxGeometry args={[2.1, 0.025, 0.015]} />
        {accentMat}
      </mesh>

      {/* Side ports */}
      {ports}

      {/* Status LED on front edge */}
      <mesh position={[0.4, 0.02, 0.7]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshStandardMaterial
          color="#00ff66"
          emissive="#00ff66"
          emissiveIntensity={1.2}
          transparent
          opacity={Math.max(0, 0.9 - scrollProgress * 0.9)}
        />
      </mesh>

      {/* Rubber feet */}
      {feetPositions.map((pos, i) => (
        <mesh key={`foot-${i}`} position={pos}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial
            color="#111111"
            roughness={0.9}
            transparent
            opacity={opacity}
          />
        </mesh>
      ))}

      {/* ===== HINGE DETAIL ===== */}
      {/* Two hinge cylinders at back edge */}
      <mesh position={[-0.35, 0.04, -0.68]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 0.2, 12]} />
        <meshStandardMaterial
          color="#666666"
          metalness={0.85}
          roughness={0.2}
          emissive="#555555"
          emissiveIntensity={0.02}
          transparent
          opacity={opacity}
        />
      </mesh>
      <mesh position={[0.35, 0.04, -0.68]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 0.2, 12]} />
        <meshStandardMaterial
          color="#666666"
          metalness={0.85}
          roughness={0.2}
          emissive="#555555"
          emissiveIntensity={0.02}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* ===== SCREEN / LID SECTION ===== */}
      {/* Pivot group at back edge - lid rotates around this point */}
      <group position={[0, 0.06, -0.68]}>
        <group ref={lidRef} rotation={[-0.35, 0, 0]}>
          {/* Screen bezel (outer frame) */}
          <RoundedBox
            args={[2.2, 1.5, 0.06]}
            radius={0.02}
            smoothness={4}
            position={[0, 0.75, 0]}
          >
            {baseMat}
          </RoundedBox>

          {/* Screen display area */}
          <mesh position={[0, 0.75, 0.032]}>
            <planeGeometry args={[1.9, 1.25]} />
            {screenMat}
          </mesh>

          {/* Fake UI content on screen */}
          <group position={[0, 0.75, 0.032]}>
            {uiLines}
          </group>

          {/* Webcam dot at top center of bezel */}
          <mesh position={[0, 1.42, 0.035]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial
              color="#222222"
              emissive="#667788"
              emissiveIntensity={0.15}
              transparent
              opacity={opacity}
            />
          </mesh>

          {/* Back of lid - geometric accent (diamond shape) */}
          <group position={[0, 0.75, -0.035]}>
            {/* Central diamond */}
            <mesh rotation={[0, 0, Math.PI / 4]}>
              <boxGeometry args={[0.18, 0.18, 0.005]} />
              <meshStandardMaterial
                color="#CCCCCC"
                metalness={0.6}
                roughness={0.4}
                emissive="#AAAAAA"
                emissiveIntensity={0.2}
                transparent
                opacity={Math.max(0, 0.85 - scrollProgress * 0.85)}
              />
            </mesh>
            {/* Outer ring */}
            <mesh rotation={[0, 0, Math.PI / 4]}>
              <torusGeometry args={[0.16, 0.012, 8, 4]} />
              <meshStandardMaterial
                color="#CCCCCC"
                metalness={0.6}
                roughness={0.4}
                emissive="#AAAAAA"
                emissiveIntensity={0.2}
                transparent
                opacity={Math.max(0, 0.85 - scrollProgress * 0.85)}
              />
            </mesh>
          </group>

          {/* Screen glow */}
          <pointLight
            position={[0, 0.75, 0.3]}
            color="#88CCFF"
            intensity={0.25}
            distance={2.5}
            decay={2}
          />

          {/* Wireframe overlay on screen bezel */}
          <mesh position={[0, 0.75, 0]}>
            <boxGeometry args={[2.24, 1.54, 0.08]} />
            <meshBasicMaterial
              color="#AAAAAA"
              wireframe
              transparent
              opacity={Math.max(0, 0.04 - scrollProgress * 0.04)}
            />
          </mesh>
        </group>
      </group>

      {/* ===== BASE WIREFRAME OVERLAY ===== */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.24, 0.14, 1.44]} />
        <meshBasicMaterial
          color="#AAAAAA"
          wireframe
          transparent
          opacity={Math.max(0, 0.04 - scrollProgress * 0.04)}
        />
      </mesh>

      {/* Accent glow light */}
      <pointLight
        position={[0, 0.3, 0.8]}
        color="#88BBDD"
        intensity={0.3}
        distance={3}
        decay={2}
      />
    </group>
  );
}
