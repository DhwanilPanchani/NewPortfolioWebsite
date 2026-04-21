'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RoundedBox } from '@react-three/drei';

interface ToolboxMeshProps {
  scrollProgress?: number;
}

export default function ToolboxMesh({ scrollProgress = 0 }: ToolboxMeshProps) {
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
    groupRef.current.rotation.x =
      0.15 + Math.sin(t * 0.12) * 0.08 + mouseTarget.current.y * 0.3;
    groupRef.current.rotation.z = Math.sin(t * 0.07) * 0.04;

    // Gentle float
    groupRef.current.position.y = 0.2 + Math.sin(t * 0.35) * 0.12;

    // Lid gently opens and closes
    if (lidRef.current) {
      lidRef.current.rotation.x = -0.35 - Math.sin(t * 0.3) * 0.2;
    }

    // Scroll-linked fade: scale, position.z
    const scrollFade = Math.max(0, 1 - scrollProgress * 0.4);
    groupRef.current.scale.setScalar(scrollFade * 1.6);
    groupRef.current.position.z = -1 - scrollProgress * 2;
  });

  const opacity = Math.max(0, 1 - scrollProgress * 0.9);
  const accentOpacity = Math.max(0, 0.85 - scrollProgress * 0.85);
  const wireOpacity = Math.max(0, 0.06 - scrollProgress * 0.06);

  // --- Reusable materials as JSX ---
  const bodyMat = (
    <meshStandardMaterial
      color="#CC3333"
      metalness={0.5}
      roughness={0.35}
      emissive="#AA2222"
      emissiveIntensity={0.18}
      transparent
      opacity={opacity}
    />
  );

  const accentMat = (
    <meshStandardMaterial
      color="#555555"
      metalness={0.8}
      roughness={0.25}
      emissive="#333333"
      emissiveIntensity={0.05}
      transparent
      opacity={accentOpacity}
    />
  );

  const innerMat = (
    <meshStandardMaterial
      color="#1a1a1a"
      metalness={0.5}
      roughness={0.55}
      emissive="#111111"
      emissiveIntensity={0.01}
      transparent
      opacity={opacity}
    />
  );

  const toolMat = (
    <meshStandardMaterial
      color="#888888"
      metalness={0.92}
      roughness={0.08}
      emissive="#555555"
      emissiveIntensity={0.03}
      transparent
      opacity={opacity}
    />
  );

  const darkAccentMat = (
    <meshStandardMaterial
      color="#444444"
      metalness={0.7}
      roughness={0.3}
      transparent
      opacity={opacity}
    />
  );

  const handleMat = (
    <meshStandardMaterial
      color="#C0C0C0"
      metalness={0.9}
      roughness={0.1}
      emissive="#999999"
      emissiveIntensity={0.05}
      transparent
      opacity={accentOpacity}
    />
  );

  const bracketMat = (
    <meshStandardMaterial
      color="#AAAAAA"
      metalness={0.85}
      roughness={0.15}
      emissive="#777777"
      emissiveIntensity={0.04}
      transparent
      opacity={accentOpacity}
    />
  );

  const latchMat = (
    <meshStandardMaterial
      color="#C0C0C0"
      metalness={0.85}
      roughness={0.15}
      emissive="#888888"
      emissiveIntensity={0.1}
      transparent
      opacity={accentOpacity}
    />
  );

  const cornerMat = (
    <meshStandardMaterial
      color="#BBBBBB"
      metalness={0.85}
      roughness={0.15}
      emissive="#888888"
      emissiveIntensity={0.05}
      transparent
      opacity={accentOpacity}
    />
  );

  const rivetMat = (
    <meshStandardMaterial
      color="#999999"
      metalness={0.85}
      roughness={0.15}
      emissive="#666666"
      emissiveIntensity={0.06}
      transparent
      opacity={accentOpacity}
    />
  );

  const lidAccentMat = (
    <meshStandardMaterial
      color="#8B1A1A"
      metalness={0.6}
      roughness={0.35}
      emissive="#661111"
      emissiveIntensity={0.06}
      transparent
      opacity={accentOpacity}
    />
  );

  const dividerMat = (
    <meshStandardMaterial
      color="#333333"
      metalness={0.6}
      roughness={0.4}
      transparent
      opacity={opacity}
    />
  );

  const hingeMat = (
    <meshStandardMaterial
      color="#555555"
      metalness={0.8}
      roughness={0.25}
      emissive="#333333"
      emissiveIntensity={0.04}
      transparent
      opacity={accentOpacity}
    />
  );

  // --- Corner positions ---
  const bottomCorners: [number, number, number][] = [
    [-1.1, -0.5, 0.6],
    [1.1, -0.5, 0.6],
    [-1.1, -0.5, -0.6],
    [1.1, -0.5, -0.6],
  ];
  const topCorners: [number, number, number][] = [
    [-1.1, 0.5, 0.6],
    [1.1, 0.5, 0.6],
    [-1.1, 0.5, -0.6],
    [1.1, 0.5, -0.6],
  ];

  // --- Rivet positions along long edges ---
  const rivetPositions: [number, number, number][] = [];
  for (let i = -4; i <= 4; i++) {
    const x = i * 0.24;
    rivetPositions.push([x, -0.5, 0.61]);
    rivetPositions.push([x, -0.5, -0.61]);
    rivetPositions.push([x, 0.5, 0.61]);
    rivetPositions.push([x, 0.5, -0.61]);
  }
  // Side rivets along short edges
  for (let j = -1; j <= 1; j++) {
    const z = j * 0.35;
    rivetPositions.push([-1.11, -0.5, z]);
    rivetPositions.push([1.11, -0.5, z]);
    rivetPositions.push([-1.11, 0.5, z]);
    rivetPositions.push([1.11, 0.5, z]);
  }

  return (
    <group ref={groupRef} position={[2.8, 0.2, -1]}>
      {/* ===== MAIN BODY ===== */}
      <RoundedBox args={[2.2, 1.0, 1.2]} radius={0.06} smoothness={4}>
        {bodyMat}
      </RoundedBox>

      {/* Inner cavity - slightly recessed */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[1.96, 0.82, 0.96]} />
        {innerMat}
      </mesh>

      {/* Inner floor */}
      <mesh position={[0, -0.32, 0]}>
        <boxGeometry args={[1.94, 0.04, 0.94]} />
        {innerMat}
      </mesh>

      {/* ===== BODY PANEL LINES ===== */}
      {/* Horizontal panel lines on front */}
      {[-0.15, 0.15].map((y, i) => (
        <mesh key={`fpanel-${i}`} position={[0, y, 0.605]}>
          <boxGeometry args={[2.0, 0.008, 0.005]} />
          {darkAccentMat}
        </mesh>
      ))}
      {/* Horizontal panel lines on back */}
      {[-0.15, 0.15].map((y, i) => (
        <mesh key={`bpanel-${i}`} position={[0, y, -0.605]}>
          <boxGeometry args={[2.0, 0.008, 0.005]} />
          {darkAccentMat}
        </mesh>
      ))}
      {/* Vertical panel lines on sides */}
      {[-0.15, 0.15].map((y, i) => (
        <mesh
          key={`lspanel-${i}`}
          position={[-1.105, y, 0]}
          rotation={[0, Math.PI / 2, 0]}
        >
          <boxGeometry args={[1.0, 0.008, 0.005]} />
          {darkAccentMat}
        </mesh>
      ))}
      {[-0.15, 0.15].map((y, i) => (
        <mesh
          key={`rspanel-${i}`}
          position={[1.105, y, 0]}
          rotation={[0, Math.PI / 2, 0]}
        >
          <boxGeometry args={[1.0, 0.008, 0.005]} />
          {darkAccentMat}
        </mesh>
      ))}

      {/* ===== METAL REINFORCEMENT STRIPS ALONG EDGES ===== */}
      {/* Top long edges */}
      <mesh position={[0, 0.505, 0.6]}>
        <boxGeometry args={[2.22, 0.04, 0.04]} />
        {accentMat}
      </mesh>
      <mesh position={[0, 0.505, -0.6]}>
        <boxGeometry args={[2.22, 0.04, 0.04]} />
        {accentMat}
      </mesh>
      {/* Top short edges */}
      <mesh position={[-1.1, 0.505, 0]}>
        <boxGeometry args={[0.04, 0.04, 1.24]} />
        {accentMat}
      </mesh>
      <mesh position={[1.1, 0.505, 0]}>
        <boxGeometry args={[0.04, 0.04, 1.24]} />
        {accentMat}
      </mesh>
      {/* Bottom long edges */}
      <mesh position={[0, -0.505, 0.6]}>
        <boxGeometry args={[2.22, 0.04, 0.04]} />
        {accentMat}
      </mesh>
      <mesh position={[0, -0.505, -0.6]}>
        <boxGeometry args={[2.22, 0.04, 0.04]} />
        {accentMat}
      </mesh>
      {/* Bottom short edges */}
      <mesh position={[-1.1, -0.505, 0]}>
        <boxGeometry args={[0.04, 0.04, 1.24]} />
        {accentMat}
      </mesh>
      <mesh position={[1.1, -0.505, 0]}>
        <boxGeometry args={[0.04, 0.04, 1.24]} />
        {accentMat}
      </mesh>
      {/* Vertical corner strips */}
      {[
        [-1.1, 0, 0.6],
        [1.1, 0, 0.6],
        [-1.1, 0, -0.6],
        [1.1, 0, -0.6],
      ].map(([x, y, z], i) => (
        <mesh key={`vstrip-${i}`} position={[x, y, z]}>
          <boxGeometry args={[0.04, 1.04, 0.04]} />
          {accentMat}
        </mesh>
      ))}

      {/* ===== BOTTOM REINFORCEMENT PLATE ===== */}
      <mesh position={[0, -0.52, 0]}>
        <boxGeometry args={[2.24, 0.025, 1.24]} />
        {darkAccentMat}
      </mesh>
      {/* Bottom cross brace */}
      <mesh position={[0, -0.54, 0]}>
        <boxGeometry args={[2.0, 0.015, 0.08]} />
        {darkAccentMat}
      </mesh>
      <mesh position={[0, -0.54, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[1.0, 0.015, 0.08]} />
        {darkAccentMat}
      </mesh>

      {/* ===== RIVETS ===== */}
      {rivetPositions.map(([x, y, z], i) => (
        <mesh key={`rivet-${i}`} position={[x, y, z]}>
          <sphereGeometry args={[0.018, 6, 6]} />
          {rivetMat}
        </mesh>
      ))}

      {/* ===== CORNER PROTECTORS ===== */}
      {bottomCorners.map(([x, y, z], i) => (
        <mesh key={`bc-${i}`} position={[x, y, z]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          {cornerMat}
        </mesh>
      ))}
      {topCorners.map(([x, y, z], i) => (
        <mesh key={`tc-${i}`} position={[x, y, z]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          {cornerMat}
        </mesh>
      ))}

      {/* ===== HINGED LID ===== */}
      <group ref={lidRef} position={[0, 0.5, -0.6]}>
        {/* Lid panel */}
        <RoundedBox
          args={[2.22, 0.14, 1.22]}
          radius={0.04}
          smoothness={4}
          position={[0, 0.07, 0.6]}
        >
          {bodyMat}
        </RoundedBox>
        {/* Lid top accent strip */}
        <mesh position={[0, 0.145, 0.6]}>
          <boxGeometry args={[2.12, 0.012, 1.12]} />
          {lidAccentMat}
        </mesh>
        {/* Lid front edge accent */}
        <mesh position={[0, 0.07, 1.21]}>
          <boxGeometry args={[2.12, 0.06, 0.02]} />
          {lidAccentMat}
        </mesh>
        {/* Lid panel lines */}
        {[-0.3, 0, 0.3].map((xOff, i) => (
          <mesh key={`lidline-${i}`} position={[xOff, 0.15, 0.6]}>
            <boxGeometry args={[0.005, 0.005, 1.0]} />
            {darkAccentMat}
          </mesh>
        ))}
        {/* Lid rivets - front edge */}
        {[-0.8, -0.4, 0, 0.4, 0.8].map((x, i) => (
          <mesh key={`lidrivet-${i}`} position={[x, 0.07, 1.215]}>
            <sphereGeometry args={[0.015, 6, 6]} />
            {rivetMat}
          </mesh>
        ))}
        {/* Hinge cylinders */}
        {[-0.5, 0, 0.5].map((x, i) => (
          <mesh
            key={`hinge-${i}`}
            position={[x, 0, 0]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.035, 0.035, 0.12, 8]} />
            {hingeMat}
          </mesh>
        ))}
      </group>

      {/* ===== HANDLE ===== */}
      {/* Handle bar - cylinder with rounded caps */}
      <mesh position={[0, 0.68, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.035, 0.035, 0.7, 12]} />
        {handleMat}
      </mesh>
      {/* Handle rounded end caps */}
      <mesh position={[-0.35, 0.68, 0]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        {handleMat}
      </mesh>
      <mesh position={[0.35, 0.68, 0]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        {handleMat}
      </mesh>
      {/* Handle support brackets - left */}
      <group position={[-0.32, 0.58, 0]}>
        <mesh>
          <boxGeometry args={[0.06, 0.2, 0.06]} />
          {bracketMat}
        </mesh>
        {/* Bracket base plate */}
        <mesh position={[0, -0.1, 0]}>
          <boxGeometry args={[0.1, 0.02, 0.1]} />
          {bracketMat}
        </mesh>
      </group>
      {/* Handle support brackets - right */}
      <group position={[0.32, 0.58, 0]}>
        <mesh>
          <boxGeometry args={[0.06, 0.2, 0.06]} />
          {bracketMat}
        </mesh>
        <mesh position={[0, -0.1, 0]}>
          <boxGeometry args={[0.1, 0.02, 0.1]} />
          {bracketMat}
        </mesh>
      </group>

      {/* ===== FRONT LATCHES / CLASPS ===== */}
      {/* Center latch */}
      <group position={[0, 0.08, 0.615]}>
        {/* Latch body */}
        <mesh>
          <boxGeometry args={[0.18, 0.14, 0.04]} />
          {latchMat}
        </mesh>
        {/* Latch accent plate */}
        <mesh position={[0, 0, 0.022]}>
          <boxGeometry args={[0.14, 0.1, 0.01]} />
          {latchMat}
        </mesh>
        {/* Latch toggle */}
        <mesh position={[0, 0.04, 0.03]}>
          <boxGeometry args={[0.06, 0.03, 0.02]} />
          {latchMat}
        </mesh>
        {/* Latch pivot */}
        <mesh
          position={[0, -0.04, 0.03]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.012, 0.012, 0.1, 6]} />
          {latchMat}
        </mesh>
      </group>
      {/* Side latches */}
      {[-0.6, 0.6].map((x, i) => (
        <group key={`slatch-${i}`} position={[x, -0.1, 0.615]}>
          <mesh>
            <boxGeometry args={[0.1, 0.08, 0.035]} />
            {latchMat}
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <boxGeometry args={[0.07, 0.05, 0.01]} />
            {latchMat}
          </mesh>
        </group>
      ))}

      {/* ===== INTERIOR DIVIDERS ===== */}
      {/* Main vertical dividers */}
      <mesh position={[-0.4, 0.05, 0]}>
        <boxGeometry args={[0.025, 0.72, 0.92]} />
        {dividerMat}
      </mesh>
      <mesh position={[0.4, 0.05, 0]}>
        <boxGeometry args={[0.025, 0.72, 0.92]} />
        {dividerMat}
      </mesh>
      {/* Cross divider in center compartment */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[0.78, 0.5, 0.02]} />
        {darkAccentMat}
      </mesh>
      {/* Small tray shelf in left compartment */}
      <mesh position={[-0.72, 0.18, 0]}>
        <boxGeometry args={[0.6, 0.02, 0.88]} />
        {darkAccentMat}
      </mesh>

      {/* ===== TOOL SHAPES INSIDE ===== */}
      {/* Wrench - shaft */}
      <mesh position={[-0.72, 0.28, 0.15]} rotation={[0, 0.2, 0.3]}>
        <cylinderGeometry args={[0.025, 0.025, 0.55, 8]} />
        {toolMat}
      </mesh>
      {/* Wrench - head (open end) */}
      <mesh position={[-0.56, 0.4, 0.2]} rotation={[0, 0.2, 0.3]}>
        <boxGeometry args={[0.08, 0.04, 0.04]} />
        {toolMat}
      </mesh>
      {/* Wrench - head ring (box end approximation) */}
      <mesh position={[-0.88, 0.16, 0.1]} rotation={[0, 0.2, 0.3]}>
        <torusGeometry args={[0.035, 0.012, 6, 8]} />
        {toolMat}
      </mesh>

      {/* Screwdriver - shaft */}
      <mesh position={[0.72, 0.0, 0.1]} rotation={[0.1, 0, -0.15]}>
        <cylinderGeometry args={[0.018, 0.018, 0.5, 8]} />
        {toolMat}
      </mesh>
      {/* Screwdriver - handle */}
      <mesh position={[0.76, 0.2, 0.08]} rotation={[0.1, 0, -0.15]}>
        <cylinderGeometry args={[0.04, 0.035, 0.18, 8]} />
        <meshStandardMaterial
          color="#DDAA00"
          metalness={0.3}
          roughness={0.6}
          transparent
          opacity={opacity}
        />
      </mesh>
      {/* Screwdriver - handle cap */}
      <mesh position={[0.78, 0.28, 0.07]} rotation={[0.1, 0, -0.15]}>
        <sphereGeometry args={[0.038, 8, 8]} />
        <meshStandardMaterial
          color="#DDAA00"
          metalness={0.3}
          roughness={0.6}
          transparent
          opacity={opacity}
        />
      </mesh>
      {/* Screwdriver - tip */}
      <mesh position={[0.68, -0.18, 0.12]} rotation={[0.1, 0, -0.15]}>
        <cylinderGeometry args={[0.005, 0.018, 0.1, 6]} />
        {toolMat}
      </mesh>

      {/* Small hex bolt in center */}
      <mesh position={[0.1, -0.28, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.03, 6]} />
        {toolMat}
      </mesh>
      {/* Another bolt */}
      <mesh position={[-0.1, -0.28, -0.15]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.025, 6]} />
        {toolMat}
      </mesh>

      {/* ===== WIREFRAME OVERLAY ===== */}
      <RoundedBox args={[2.26, 1.06, 1.26]} radius={0.06} smoothness={4}>
        <meshBasicMaterial
          color="#B22222"
          wireframe
          transparent
          opacity={wireOpacity}
        />
      </RoundedBox>
    </group>
  );
}
