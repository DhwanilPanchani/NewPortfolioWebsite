'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface GearMeshProps {
  scrollProgress?: number;
}

export default function GearMesh({ scrollProgress = 0 }: GearMeshProps) {
  const groupRef = useRef<THREE.Group>(null);
  const gear1Ref = useRef<THREE.Group>(null);
  const gear2Ref = useRef<THREE.Group>(null);
  const gear3Ref = useRef<THREE.Group>(null);
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
    groupRef.current.rotation.y = t * 0.08 + mouseTarget.current.x * 0.4;
    groupRef.current.rotation.x =
      0.2 + Math.sin(t * 0.1) * 0.08 + mouseTarget.current.y * 0.25;
    groupRef.current.rotation.z = Math.sin(t * 0.07) * 0.04;

    // Gentle float
    groupRef.current.position.y = 0.2 + Math.sin(t * 0.35) * 0.12;

    // Gears rotate - meshing together
    if (gear1Ref.current) gear1Ref.current.rotation.z = t * 0.3;
    if (gear2Ref.current)
      gear2Ref.current.rotation.z = -t * 0.3 * (20 / 14);
    if (gear3Ref.current)
      gear3Ref.current.rotation.z = t * 0.3 * (20 / 14) * (14 / 10);

    // Scroll-linked fade
    const scrollFade = Math.max(0, 1 - scrollProgress * 0.4);
    groupRef.current.scale.setScalar(scrollFade * 1.5);
    groupRef.current.position.z = -1 - scrollProgress * 2;
  });

  const opacity = Math.max(0, 1 - scrollProgress * 0.9);
  const accentOpacity = Math.max(0, 0.85 - scrollProgress * 0.85);
  const wireOpacity = Math.max(0, 0.06 - scrollProgress * 0.06);

  // --- Materials ---
  const copperMat = (
    <meshStandardMaterial
      color="#CD7F32"
      metalness={0.7}
      roughness={0.3}
      emissive="#AA6622"
      emissiveIntensity={0.15}
      transparent
      opacity={opacity}
    />
  );

  const silverMat = (
    <meshStandardMaterial
      color="#C0C0C0"
      metalness={0.8}
      roughness={0.2}
      emissive="#999999"
      emissiveIntensity={0.12}
      transparent
      opacity={opacity}
    />
  );

  const goldMat = (
    <meshStandardMaterial
      color="#DAA520"
      metalness={0.7}
      roughness={0.25}
      emissive="#BB8800"
      emissiveIntensity={0.15}
      transparent
      opacity={opacity}
    />
  );

  const hubMat = (
    <meshStandardMaterial
      color="#3A3A3A"
      metalness={0.85}
      roughness={0.2}
      emissive="#222222"
      emissiveIntensity={0.05}
      transparent
      opacity={accentOpacity}
    />
  );

  const boltMat = (
    <meshStandardMaterial
      color="#888888"
      metalness={0.9}
      roughness={0.15}
      emissive="#555555"
      emissiveIntensity={0.06}
      transparent
      opacity={accentOpacity}
    />
  );

  // --- Helper: build gear teeth positions ---
  const getTeethPositions = (
    numTeeth: number,
    radius: number
  ): { x: number; z: number; angle: number }[] => {
    const positions: { x: number; z: number; angle: number }[] = [];
    for (let i = 0; i < numTeeth; i++) {
      const angle = (i / numTeeth) * Math.PI * 2;
      positions.push({
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        angle,
      });
    }
    return positions;
  };

  // --- Helper: build spoke positions ---
  const getSpokePositions = (
    numSpokes: number,
    innerR: number,
    outerR: number
  ): { x: number; z: number; angle: number; length: number }[] => {
    const positions: {
      x: number;
      z: number;
      angle: number;
      length: number;
    }[] = [];
    const spokeLen = outerR - innerR;
    const midR = (innerR + outerR) / 2;
    for (let i = 0; i < numSpokes; i++) {
      const angle = (i / numSpokes) * Math.PI * 2;
      positions.push({
        x: Math.cos(angle) * midR,
        z: Math.sin(angle) * midR,
        angle,
        length: spokeLen,
      });
    }
    return positions;
  };

  // --- Helper: bolt positions on gear face ---
  const getBoltPositions = (
    numBolts: number,
    radius: number
  ): [number, number, number][] => {
    const positions: [number, number, number][] = [];
    for (let i = 0; i < numBolts; i++) {
      const angle = (i / numBolts) * Math.PI * 2 + 0.4;
      positions.push([Math.cos(angle) * radius, 0.06, Math.sin(angle) * radius]);
    }
    return positions;
  };

  // --- Gear parameters ---
  // Large gear: 20 teeth, centered at origin
  const gear1Teeth = 20;
  const gear1BodyR = 0.8;
  const gear1ToothR = 0.92;
  const gear1HubR = 0.18;
  const gear1Spokes = 6;

  // Medium gear: 14 teeth
  const gear2Teeth = 14;
  const gear2BodyR = 0.56;
  const gear2ToothR = 0.65;
  const gear2HubR = 0.13;
  const gear2Spokes = 5;

  // Small gear: 10 teeth
  const gear3Teeth = 10;
  const gear3BodyR = 0.4;
  const gear3ToothR = 0.47;
  const gear3HubR = 0.1;
  const gear3Spokes = 4;

  // Positions: gears mesh where tooth radii touch
  const gear2Pos: [number, number, number] = [
    (gear1ToothR + gear2ToothR) * Math.cos(Math.PI / 4),
    0,
    (gear1ToothR + gear2ToothR) * Math.sin(Math.PI / 4) * -1,
  ];
  const gear3Pos: [number, number, number] = [
    gear2Pos[0] + (gear2ToothR + gear3ToothR) * Math.cos(-Math.PI / 6),
    0,
    gear2Pos[2] + (gear2ToothR + gear3ToothR) * Math.sin(-Math.PI / 6),
  ];

  return (
    <group ref={groupRef} position={[3.2, 0.2, -1.5]}>
      {/* ===== ACCENT LIGHT ===== */}
      <pointLight
        position={[0.5, 1.2, 1.0]}
        color="#CD7F32"
        intensity={0.6}
        distance={5}
      />

      {/* ===== LARGE GEAR (Copper/Bronze) ===== */}
      <group ref={gear1Ref} position={[0, 0, 0]}>
        {/* Gear body disc */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[gear1BodyR, gear1BodyR, 0.08, 32]} />
          {copperMat}
        </mesh>

        {/* Gear teeth */}
        {getTeethPositions(gear1Teeth, gear1ToothR).map((tooth, i) => (
          <mesh
            key={`g1t-${i}`}
            position={[tooth.x, 0, tooth.z]}
            rotation={[0, -tooth.angle, 0]}
          >
            <boxGeometry args={[0.08, 0.08, 0.14]} />
            {copperMat}
          </mesh>
        ))}

        {/* Center hub */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[gear1HubR, gear1HubR, 0.12, 16]} />
          {hubMat}
        </mesh>

        {/* Hub center bore */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.14, 8]} />
          {hubMat}
        </mesh>

        {/* Spokes */}
        {getSpokePositions(gear1Spokes, gear1HubR, gear1BodyR * 0.85).map(
          (spoke, i) => (
            <mesh
              key={`g1s-${i}`}
              position={[spoke.x, 0, spoke.z]}
              rotation={[0, -spoke.angle, 0]}
            >
              <boxGeometry args={[0.05, 0.06, spoke.length]} />
              {copperMat}
            </mesh>
          )
        )}

        {/* Bolts on face */}
        {getBoltPositions(3, 0.45).map(([bx, by, bz], i) => (
          <mesh key={`g1b-${i}`} position={[bx, by, bz]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            {boltMat}
          </mesh>
        ))}

        {/* Inner ring detail */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.045, 0]}>
          <torusGeometry args={[0.35, 0.015, 8, 24]} />
          {copperMat}
        </mesh>
      </group>

      {/* ===== MEDIUM GEAR (Silver/Chrome) ===== */}
      <group ref={gear2Ref} position={gear2Pos}>
        {/* Gear body disc */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[gear2BodyR, gear2BodyR, 0.08, 24]} />
          {silverMat}
        </mesh>

        {/* Gear teeth */}
        {getTeethPositions(gear2Teeth, gear2ToothR).map((tooth, i) => (
          <mesh
            key={`g2t-${i}`}
            position={[tooth.x, 0, tooth.z]}
            rotation={[0, -tooth.angle, 0]}
          >
            <boxGeometry args={[0.07, 0.08, 0.12]} />
            {silverMat}
          </mesh>
        ))}

        {/* Center hub */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[gear2HubR, gear2HubR, 0.12, 16]} />
          {hubMat}
        </mesh>

        {/* Hub center bore */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 0.14, 8]} />
          {hubMat}
        </mesh>

        {/* Spokes */}
        {getSpokePositions(gear2Spokes, gear2HubR, gear2BodyR * 0.85).map(
          (spoke, i) => (
            <mesh
              key={`g2s-${i}`}
              position={[spoke.x, 0, spoke.z]}
              rotation={[0, -spoke.angle, 0]}
            >
              <boxGeometry args={[0.04, 0.06, spoke.length]} />
              {silverMat}
            </mesh>
          )
        )}

        {/* Bolts on face */}
        {getBoltPositions(3, 0.3).map(([bx, by, bz], i) => (
          <mesh key={`g2b-${i}`} position={[bx, by, bz]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            {boltMat}
          </mesh>
        ))}

        {/* Inner ring detail */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.045, 0]}>
          <torusGeometry args={[0.25, 0.012, 8, 20]} />
          {silverMat}
        </mesh>
      </group>

      {/* ===== SMALL GEAR (Gold) ===== */}
      <group ref={gear3Ref} position={gear3Pos}>
        {/* Gear body disc */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[gear3BodyR, gear3BodyR, 0.08, 20]} />
          {goldMat}
        </mesh>

        {/* Gear teeth */}
        {getTeethPositions(gear3Teeth, gear3ToothR).map((tooth, i) => (
          <mesh
            key={`g3t-${i}`}
            position={[tooth.x, 0, tooth.z]}
            rotation={[0, -tooth.angle, 0]}
          >
            <boxGeometry args={[0.06, 0.08, 0.1]} />
            {goldMat}
          </mesh>
        ))}

        {/* Center hub */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[gear3HubR, gear3HubR, 0.12, 12]} />
          {hubMat}
        </mesh>

        {/* Hub center bore */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.14, 8]} />
          {hubMat}
        </mesh>

        {/* Spokes */}
        {getSpokePositions(gear3Spokes, gear3HubR, gear3BodyR * 0.85).map(
          (spoke, i) => (
            <mesh
              key={`g3s-${i}`}
              position={[spoke.x, 0, spoke.z]}
              rotation={[0, -spoke.angle, 0]}
            >
              <boxGeometry args={[0.035, 0.06, spoke.length]} />
              {goldMat}
            </mesh>
          )
        )}

        {/* Bolts on face */}
        {getBoltPositions(2, 0.22).map(([bx, by, bz], i) => (
          <mesh key={`g3b-${i}`} position={[bx, by, bz]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            {boltMat}
          </mesh>
        ))}

        {/* Inner ring detail */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.045, 0]}>
          <torusGeometry args={[0.18, 0.01, 8, 16]} />
          {goldMat}
        </mesh>
      </group>

      {/* ===== WIREFRAME OVERLAY ===== */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.0, 1.0, 0.12, 32]} />
        <meshBasicMaterial
          color="#CD7F32"
          wireframe
          transparent
          opacity={wireOpacity}
        />
      </mesh>
    </group>
  );
}
