'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface RocketMeshProps {
  scrollProgress?: number;
}

export default function RocketMesh({ scrollProgress = 0 }: RocketMeshProps) {
  const groupRef = useRef<THREE.Group>(null);
  const flameOuterRef = useRef<THREE.Mesh>(null);
  const flameInnerRef = useRef<THREE.Mesh>(null);
  const flameCoreRef = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();
  const mouseTarget = useRef(new THREE.Vector2(0, 0));

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    // Smooth mouse follow
    mouseTarget.current.lerp(
      new THREE.Vector2(pointer.x * 0.25, pointer.y * 0.15),
      0.04
    );

    // Tilted upward flight angle + gentle sway
    groupRef.current.rotation.z =
      0.3 + Math.sin(t * 0.3) * 0.05 + mouseTarget.current.x * 0.3;
    groupRef.current.rotation.y =
      Math.sin(t * 0.2) * 0.1 + mouseTarget.current.y * 0.2;
    groupRef.current.rotation.x =
      -0.1 + Math.sin(t * 0.15) * 0.05;

    // Gentle floating hover
    groupRef.current.position.y = 0.3 + Math.sin(t * 0.4) * 0.2;
    groupRef.current.position.x = 2.8 + Math.sin(t * 0.25) * 0.1;

    // Flame flicker — outer
    if (flameOuterRef.current) {
      flameOuterRef.current.scale.y =
        1 + Math.sin(t * 8) * 0.15 + Math.sin(t * 13) * 0.1;
      flameOuterRef.current.scale.x =
        1 + Math.sin(t * 6) * 0.08;
      flameOuterRef.current.scale.z =
        1 + Math.sin(t * 7) * 0.08;
    }
    // Flame flicker — inner
    if (flameInnerRef.current) {
      flameInnerRef.current.scale.y =
        1 + Math.sin(t * 10) * 0.2 + Math.sin(t * 15) * 0.08;
      flameInnerRef.current.scale.x =
        1 + Math.sin(t * 9) * 0.06;
      flameInnerRef.current.scale.z =
        1 + Math.sin(t * 9) * 0.06;
    }
    // Flame flicker — core
    if (flameCoreRef.current) {
      flameCoreRef.current.scale.y =
        1 + Math.sin(t * 12) * 0.25 + Math.sin(t * 18) * 0.1;
      flameCoreRef.current.scale.x =
        1 + Math.sin(t * 11) * 0.05;
      flameCoreRef.current.scale.z =
        1 + Math.sin(t * 11) * 0.05;
    }

    // Scroll-linked fade: scale, opacity via position.z
    const scrollFade = 1 - scrollProgress * 0.4;
    groupRef.current.scale.setScalar(scrollFade * 1.4);
    groupRef.current.position.z = -1 - scrollProgress * 2;
  });

  const opacity = Math.max(0, 1 - scrollProgress * 0.9);
  const accentOpacity = Math.max(0, 0.9 - scrollProgress * 0.9);
  const subtleOpacity = Math.max(0, 0.7 - scrollProgress * 0.7);
  const glowOpacity = Math.max(0, 0.6 - scrollProgress * 0.6);
  const flameOpacity = Math.max(0, 0.65 - scrollProgress * 0.65);
  const innerFlameOpacity = Math.max(0, 0.55 - scrollProgress * 0.55);
  const coreFlameOpacity = Math.max(0, 0.5 - scrollProgress * 0.5);

  // Fin angles for 4 fins at even intervals
  const finAngles = [0, Math.PI * 0.5, Math.PI, Math.PI * 1.5];

  return (
    <group ref={groupRef} position={[2.8, 0.3, -1]}>
      {/* ══════════════════════════════════════════
          BODY — Main fuselage (wider, smoother)
          ══════════════════════════════════════════ */}

      {/* Lower fuselage — wider base tapering up */}
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.36, 0.38, 0.8, 32]} />
        <meshStandardMaterial
          color="#E8E8E8"
          metalness={0.85}
          roughness={0.15}
          emissive="#CCCCCC"
          emissiveIntensity={0.02}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Mid fuselage — main body */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.34, 0.36, 0.9, 32]} />
        <meshStandardMaterial
          color="#E8E8E8"
          metalness={0.85}
          roughness={0.15}
          emissive="#CCCCCC"
          emissiveIntensity={0.02}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Upper fuselage — tapers toward nose */}
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.3, 0.34, 0.4, 32]} />
        <meshStandardMaterial
          color="#E8E8E8"
          metalness={0.85}
          roughness={0.15}
          emissive="#CCCCCC"
          emissiveIntensity={0.02}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* ══════════════════════════════════════════
          NOSE CONE — Smooth multi-part transition
          ══════════════════════════════════════════ */}

      {/* Nose shoulder — transition ring from body to cone */}
      <mesh position={[0, 0.98, 0]}>
        <cylinderGeometry args={[0.26, 0.3, 0.12, 32]} />
        <meshStandardMaterial
          color="#CC2222"
          metalness={0.6}
          roughness={0.3}
          emissive="#CC2222"
          emissiveIntensity={0.15}
          transparent
          opacity={accentOpacity}
        />
      </mesh>

      {/* Nose cone — lower section */}
      <mesh position={[0, 1.2, 0]}>
        <coneGeometry args={[0.26, 0.5, 32]} />
        <meshStandardMaterial
          color="#CC2222"
          metalness={0.65}
          roughness={0.25}
          emissive="#CC2222"
          emissiveIntensity={0.15}
          transparent
          opacity={accentOpacity}
        />
      </mesh>

      {/* Nose cone — upper tip section (slightly brighter) */}
      <mesh position={[0, 1.52, 0]}>
        <coneGeometry args={[0.1, 0.25, 32]} />
        <meshStandardMaterial
          color="#DD3333"
          metalness={0.5}
          roughness={0.3}
          emissive="#CC2222"
          emissiveIntensity={0.2}
          transparent
          opacity={accentOpacity}
        />
      </mesh>

      {/* Nose tip — sphere cap */}
      <mesh position={[0, 1.68, 0]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial
          color="#DD3333"
          emissive="#CC2222"
          emissiveIntensity={0.3}
          metalness={0.4}
          roughness={0.3}
          transparent
          opacity={accentOpacity}
        />
      </mesh>

      {/* ══════════════════════════════════════════
          WINDOW / PORTHOLE — Glowing blue
          ══════════════════════════════════════════ */}

      {/* Porthole recess ring (outer bezel) */}
      <mesh position={[0, 0.4, 0.345]} rotation={[Math.PI * 0.5, 0, 0]}>
        <torusGeometry args={[0.12, 0.022, 16, 32]} />
        <meshStandardMaterial
          color="#AAAAAA"
          emissive="#888888"
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.1}
          transparent
          opacity={subtleOpacity}
        />
      </mesh>

      {/* Porthole glass — dark reflective with blue glow */}
      <mesh position={[0, 0.4, 0.35]}>
        <sphereGeometry args={[0.1, 24, 24, 0, Math.PI]} />
        <meshPhysicalMaterial
          color="#112244"
          metalness={0.1}
          roughness={0.05}
          transmission={0.4}
          thickness={0.5}
          emissive="#4488CC"
          emissiveIntensity={0.2}
          transparent
          opacity={Math.max(0, 0.85 - scrollProgress * 0.85)}
        />
      </mesh>

      {/* Porthole inner glow disc */}
      <mesh position={[0, 0.4, 0.34]} rotation={[0, 0, 0]}>
        <circleGeometry args={[0.08, 32]} />
        <meshStandardMaterial
          color="#4488CC"
          emissive="#4488CC"
          emissiveIntensity={0.35}
          transparent
          opacity={Math.max(0, 0.5 - scrollProgress * 0.5)}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Inner accent ring */}
      <mesh position={[0, 0.4, 0.35]} rotation={[Math.PI * 0.5, 0, 0]}>
        <torusGeometry args={[0.09, 0.008, 12, 32]} />
        <meshStandardMaterial
          color="#AAAAAA"
          emissive="#888888"
          emissiveIntensity={0.4}
          transparent
          opacity={Math.max(0, 0.6 - scrollProgress * 0.6)}
        />
      </mesh>

      {/* ══════════════════════════════════════════
          BODY PANEL LINES — Torus rings
          ══════════════════════════════════════════ */}

      {/* Upper panel line */}
      <mesh position={[0, 0.7, 0]}>
        <torusGeometry args={[0.335, 0.01, 8, 48]} />
        <meshStandardMaterial
          color="#CC2222"
          emissive="#CC2222"
          emissiveIntensity={0.1}
          transparent
          opacity={glowOpacity}
        />
      </mesh>

      {/* Middle panel line */}
      <mesh position={[0, 0.15, 0]}>
        <torusGeometry args={[0.355, 0.01, 8, 48]} />
        <meshStandardMaterial
          color="#CC2222"
          emissive="#CC2222"
          emissiveIntensity={0.1}
          transparent
          opacity={glowOpacity}
        />
      </mesh>

      {/* Lower panel line */}
      <mesh position={[0, -0.35, 0]}>
        <torusGeometry args={[0.375, 0.01, 8, 48]} />
        <meshStandardMaterial
          color="#CC2222"
          emissive="#CC2222"
          emissiveIntensity={0.1}
          transparent
          opacity={glowOpacity}
        />
      </mesh>

      {/* ══════════════════════════════════════════
          FINS — 4 fins at 90-degree intervals
          ══════════════════════════════════════════ */}

      {finAngles.map((angle, i) => (
        <group key={`fin-${i}`} rotation={[0, angle, 0]}>
          {/* Fin body — swept shape via box */}
          <mesh position={[0.42, -0.6, 0]} rotation={[0, 0, -0.25]}>
            <boxGeometry args={[0.32, 0.6, 0.04]} />
            <meshStandardMaterial
              color="#444444"
              metalness={0.65}
              roughness={0.3}
              emissive="#333333"
              emissiveIntensity={0.05}
              transparent
              opacity={opacity}
            />
          </mesh>

          {/* Fin inner panel — darker inset for depth */}
          <mesh position={[0.4, -0.58, 0]} rotation={[0, 0, -0.25]}>
            <boxGeometry args={[0.24, 0.48, 0.05]} />
            <meshStandardMaterial
              color="#333333"
              metalness={0.8}
              roughness={0.2}
              emissive="#222222"
              emissiveIntensity={0.03}
              transparent
              opacity={opacity}
            />
          </mesh>

          {/* Fin leading edge accent */}
          <mesh position={[0.57, -0.78, 0]} rotation={[0, 0, -0.25]}>
            <boxGeometry args={[0.025, 0.45, 0.05]} />
            <meshStandardMaterial
              color="#CC2222"
              emissive="#CC2222"
              emissiveIntensity={0.3}
              transparent
              opacity={subtleOpacity}
            />
          </mesh>

          {/* Fin tip — brighter red */}
          <mesh position={[0.6, -0.9, 0]} rotation={[0, 0, -0.25]}>
            <boxGeometry args={[0.08, 0.12, 0.045]} />
            <meshStandardMaterial
              color="#CC2222"
              emissive="#CC2222"
              emissiveIntensity={0.4}
              metalness={0.4}
              roughness={0.3}
              transparent
              opacity={subtleOpacity}
            />
          </mesh>

          {/* Fin root fillet — small cylinder connecting fin to body */}
          <mesh position={[0.32, -0.45, 0]} rotation={[0, 0, Math.PI * 0.5]}>
            <cylinderGeometry args={[0.03, 0.06, 0.12, 12]} />
            <meshStandardMaterial
              color="#444444"
              metalness={0.8}
              roughness={0.2}
              transparent
              opacity={opacity}
            />
          </mesh>
        </group>
      ))}

      {/* ══════════════════════════════════════════
          ENGINE NOZZLE — Multi-part bell section
          ══════════════════════════════════════════ */}

      {/* Nozzle mounting ring */}
      <mesh position={[0, -0.72, 0]}>
        <torusGeometry args={[0.38, 0.015, 12, 48]} />
        <meshStandardMaterial
          color="#555555"
          emissive="#444444"
          emissiveIntensity={0.1}
          transparent
          opacity={glowOpacity}
        />
      </mesh>

      {/* Outer bell — flared skirt */}
      <mesh position={[0, -0.88, 0]}>
        <cylinderGeometry args={[0.38, 0.28, 0.3, 32]} />
        <meshStandardMaterial
          color="#333333"
          metalness={0.9}
          roughness={0.1}
          emissive="#222222"
          emissiveIntensity={0.03}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Inner bell — throat section */}
      <mesh position={[0, -0.95, 0]}>
        <cylinderGeometry args={[0.25, 0.18, 0.2, 32]} />
        <meshStandardMaterial
          color="#222222"
          metalness={0.95}
          roughness={0.08}
          emissive="#111111"
          emissiveIntensity={0.02}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Nozzle exit rim */}
      <mesh position={[0, -1.05, 0]}>
        <torusGeometry args={[0.27, 0.012, 12, 48]} />
        <meshStandardMaterial
          color="#555555"
          emissive="#444444"
          emissiveIntensity={0.1}
          transparent
          opacity={glowOpacity}
        />
      </mesh>

      {/* Inner nozzle dark void */}
      <mesh position={[0, -1.03, 0]} rotation={[Math.PI * 0.5, 0, 0]}>
        <circleGeometry args={[0.17, 32]} />
        <meshStandardMaterial
          color="#050505"
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Nozzle detail rings */}
      <mesh position={[0, -0.82, 0]}>
        <torusGeometry args={[0.34, 0.008, 8, 48]} />
        <meshStandardMaterial
          color="#444444"
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={Math.max(0, 0.5 - scrollProgress * 0.5)}
        />
      </mesh>
      <mesh position={[0, -0.92, 0]}>
        <torusGeometry args={[0.3, 0.008, 8, 48]} />
        <meshStandardMaterial
          color="#444444"
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={Math.max(0, 0.5 - scrollProgress * 0.5)}
        />
      </mesh>

      {/* ══════════════════════════════════════════
          EXHAUST FLAME — 3-layer animated
          ══════════════════════════════════════════ */}

      {/* Outer flame — orange */}
      <mesh ref={flameOuterRef} position={[0, -1.4, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.22, 0.85, 16]} />
        <meshStandardMaterial
          color="#FF4400"
          emissive="#FF4400"
          emissiveIntensity={1.3}
          transparent
          opacity={flameOpacity}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Middle flame — bright yellow-orange */}
      <mesh ref={flameInnerRef} position={[0, -1.35, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.14, 0.65, 16]} />
        <meshStandardMaterial
          color="#FFDD44"
          emissive="#FFAA00"
          emissiveIntensity={1.6}
          transparent
          opacity={innerFlameOpacity}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Core flame — white-hot center */}
      <mesh ref={flameCoreRef} position={[0, -1.3, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.07, 0.45, 16]} />
        <meshStandardMaterial
          color="#FFFFFF"
          emissive="#FFFFFF"
          emissiveIntensity={2.0}
          transparent
          opacity={coreFlameOpacity}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ══════════════════════════════════════════
          EXHAUST GLOW — Point light
          ══════════════════════════════════════════ */}

      <pointLight
        position={[0, -1.5, 0]}
        color="#FF6600"
        intensity={0.8}
        distance={4}
        decay={2}
      />
      <pointLight
        position={[0, -1.8, 0]}
        color="#FF6600"
        intensity={0.3}
        distance={2.5}
        decay={2}
      />

      {/* ══════════════════════════════════════════
          WIREFRAME OVERLAY — Subtle tech feel
          ══════════════════════════════════════════ */}

      {/* Lower body wireframe */}
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.365, 0.385, 0.82, 16]} />
        <meshBasicMaterial
          color="#CC2222"
          wireframe
          transparent
          opacity={Math.max(0, 0.035 - scrollProgress * 0.035)}
        />
      </mesh>

      {/* Upper body wireframe */}
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.32, 0.365, 1.0, 16]} />
        <meshBasicMaterial
          color="#CC2222"
          wireframe
          transparent
          opacity={Math.max(0, 0.035 - scrollProgress * 0.035)}
        />
      </mesh>

      {/* Nose cone wireframe */}
      <mesh position={[0, 1.2, 0]}>
        <coneGeometry args={[0.265, 0.52, 16]} />
        <meshBasicMaterial
          color="#CC2222"
          wireframe
          transparent
          opacity={Math.max(0, 0.03 - scrollProgress * 0.03)}
        />
      </mesh>
    </group>
  );
}
