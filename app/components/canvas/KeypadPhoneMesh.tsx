'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RoundedBox } from '@react-three/drei';

interface KeypadPhoneMeshProps {
  scrollProgress?: number;
}

export default function KeypadPhoneMesh({ scrollProgress = 0 }: KeypadPhoneMeshProps) {
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

    // Gentle sway (front always faces viewer) + mouse influence
    groupRef.current.rotation.y = Math.sin(t * 0.15) * 0.4 + mouseTarget.current.x * 0.5;
    groupRef.current.rotation.x = 0.15 + Math.sin(t * 0.12) * 0.08 + mouseTarget.current.y * 0.3;
    groupRef.current.rotation.z = Math.sin(t * 0.08) * 0.05;

    // Gentle float
    groupRef.current.position.y = 0.3 + Math.sin(t * 0.4) * 0.15;

    // Scroll fade
    const scrollFade = 1 - scrollProgress * 0.4;
    groupRef.current.scale.setScalar(scrollFade * 1.5);
    groupRef.current.position.z = -2 - scrollProgress * 2;
  });

  const opacity = Math.max(0, 1 - scrollProgress * 0.9);
  const accentOpacity = Math.max(0, 0.8 - scrollProgress * 0.8);
  const screenOpacity = Math.max(0, 0.85 - scrollProgress * 0.85);
  const buttonOpacity = Math.max(0, 0.7 - scrollProgress * 0.7);

  return (
    <group ref={groupRef} position={[3.8, 0.3, -2]}>
      {/* ===== PHONE BODY ===== */}
      {/* Main body */}
      <RoundedBox args={[1.1, 2.2, 0.35]} radius={0.1} smoothness={4}>
        <meshStandardMaterial
          color="#D2C4A8"
          metalness={0.4}
          roughness={0.4}
          emissive="#B0A080"
          emissiveIntensity={0.15}
          transparent
          opacity={opacity}
        />
      </RoundedBox>

      {/* Back panel - slightly inset for tapered feel */}
      <RoundedBox args={[1.0, 2.1, 0.06]} radius={0.08} smoothness={4} position={[0, 0, -0.16]}>
        <meshStandardMaterial
          color="#A89878"
          metalness={0.8}
          roughness={0.25}
          transparent
          opacity={opacity * 0.9}
        />
      </RoundedBox>

      {/* Top edge chamfer */}
      <RoundedBox args={[1.05, 0.08, 0.32]} radius={0.03} smoothness={3} position={[0, 1.08, 0]}>
        <meshStandardMaterial
          color="#C8B898"
          metalness={0.75}
          roughness={0.28}
          transparent
          opacity={opacity}
        />
      </RoundedBox>

      {/* Bottom edge chamfer */}
      <RoundedBox args={[1.05, 0.08, 0.32]} radius={0.03} smoothness={3} position={[0, -1.08, 0]}>
        <meshStandardMaterial
          color="#C8B898"
          metalness={0.75}
          roughness={0.28}
          transparent
          opacity={opacity}
        />
      </RoundedBox>

      {/* ===== ANTENNA STUB ===== */}
      <mesh position={[0.3, 1.2, 0]}>
        <cylinderGeometry args={[0.035, 0.028, 0.25, 12]} />
        <meshStandardMaterial
          color="#333333"
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={opacity}
        />
      </mesh>
      {/* Antenna tip */}
      <mesh position={[0.3, 1.35, 0]}>
        <sphereGeometry args={[0.038, 10, 10]} />
        <meshStandardMaterial
          color="#AAAAAA"
          metalness={0.7}
          roughness={0.3}
          emissive="#AAAAAA"
          emissiveIntensity={0.1}
          transparent
          opacity={accentOpacity}
        />
      </mesh>

      {/* ===== EARPIECE SPEAKER GRILLE ===== */}
      {/* Speaker housing */}
      <RoundedBox args={[0.4, 0.06, 0.04]} radius={0.015} smoothness={3} position={[0, 0.96, 0.175]}>
        <meshStandardMaterial
          color="#0d0d0d"
          metalness={0.6}
          roughness={0.5}
          transparent
          opacity={opacity}
        />
      </RoundedBox>
      {/* Speaker grille dots - two rows */}
      {[-0.14, -0.1, -0.06, -0.02, 0.02, 0.06, 0.1, 0.14].map((x, i) => (
        <mesh key={`grille-top-${i}`} position={[x, 0.968, 0.195]}>
          <sphereGeometry args={[0.008, 6, 6]} />
          <meshStandardMaterial
            color="#CCCCCC"
            emissive="#CCCCCC"
            emissiveIntensity={0.15}
            transparent
            opacity={accentOpacity * 0.6}
          />
        </mesh>
      ))}
      {[-0.12, -0.08, -0.04, 0, 0.04, 0.08, 0.12].map((x, i) => (
        <mesh key={`grille-bot-${i}`} position={[x, 0.952, 0.195]}>
          <sphereGeometry args={[0.008, 6, 6]} />
          <meshStandardMaterial
            color="#CCCCCC"
            emissive="#CCCCCC"
            emissiveIntensity={0.15}
            transparent
            opacity={accentOpacity * 0.6}
          />
        </mesh>
      ))}

      {/* ===== BRAND AREA ===== */}
      {/* Brand name bar */}
      <mesh position={[0, 0.87, 0.18]}>
        <boxGeometry args={[0.3, 0.025, 0.001]} />
        <meshStandardMaterial
          color="#BBBBBB"
          emissive="#BBBBBB"
          emissiveIntensity={0.2}
          transparent
          opacity={Math.max(0, 0.4 - scrollProgress * 0.4)}
        />
      </mesh>
      {/* Brand accent dots */}
      {[-0.06, 0, 0.06].map((x, i) => (
        <mesh key={`brand-${i}`} position={[x, 0.845, 0.18]}>
          <sphereGeometry args={[0.006, 6, 6]} />
          <meshStandardMaterial
            color="#AAAAAA"
            emissive="#AAAAAA"
            emissiveIntensity={0.2}
            transparent
            opacity={accentOpacity * 0.5}
          />
        </mesh>
      ))}

      {/* ===== SCREEN AREA ===== */}
      {/* Screen bezel */}
      <RoundedBox args={[0.92, 0.68, 0.03]} radius={0.05} smoothness={4} position={[0, 0.6, 0.17]}>
        <meshStandardMaterial
          color="#222222"
          metalness={0.6}
          roughness={0.35}
          transparent
          opacity={opacity}
        />
      </RoundedBox>

      {/* Screen display */}
      <RoundedBox args={[0.82, 0.56, 0.02]} radius={0.035} smoothness={4} position={[0, 0.6, 0.185]}>
        <meshStandardMaterial
          color="#0A2020"
          metalness={0.2}
          roughness={0.1}
          emissive="#66BBAA"
          emissiveIntensity={0.15}
          transparent
          opacity={screenOpacity}
        />
      </RoundedBox>

      {/* Screen inner glow overlay */}
      <RoundedBox args={[0.78, 0.52, 0.005]} radius={0.03} smoothness={4} position={[0, 0.6, 0.198]}>
        <meshStandardMaterial
          color="#66BBAA"
          emissive="#66BBAA"
          emissiveIntensity={0.08}
          transparent
          opacity={Math.max(0, 0.06 - scrollProgress * 0.06)}
        />
      </RoundedBox>

      {/* Fake UI lines on screen */}
      {/* Status bar line */}
      <mesh position={[0, 0.8, 0.2]}>
        <boxGeometry args={[0.65, 0.015, 0.001]} />
        <meshStandardMaterial
          color="#44AA99"
          emissive="#44AA99"
          emissiveIntensity={0.6}
          transparent
          opacity={Math.max(0, 0.4 - scrollProgress * 0.4)}
        />
      </mesh>
      {/* Content line 1 */}
      <mesh position={[-0.06, 0.68, 0.2]}>
        <boxGeometry args={[0.5, 0.018, 0.001]} />
        <meshStandardMaterial
          color="#44AA99"
          emissive="#44AA99"
          emissiveIntensity={0.5}
          transparent
          opacity={Math.max(0, 0.32 - scrollProgress * 0.32)}
        />
      </mesh>
      {/* Content line 2 */}
      <mesh position={[0.04, 0.62, 0.2]}>
        <boxGeometry args={[0.38, 0.015, 0.001]} />
        <meshStandardMaterial
          color="#44AA99"
          emissive="#44AA99"
          emissiveIntensity={0.45}
          transparent
          opacity={Math.max(0, 0.25 - scrollProgress * 0.25)}
        />
      </mesh>
      {/* Signal bars */}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={`signal-${i}`} position={[0.3 + i * 0.035, 0.8, 0.2]}>
          <boxGeometry args={[0.02, 0.015 + i * 0.008, 0.001]} />
          <meshStandardMaterial
            color="#55BB99"
            emissive="#55BB99"
            emissiveIntensity={0.5}
            transparent
            opacity={Math.max(0, 0.35 - scrollProgress * 0.35)}
          />
        </mesh>
      ))}
      {/* Battery icon */}
      <mesh position={[-0.32, 0.8, 0.2]}>
        <boxGeometry args={[0.05, 0.02, 0.001]} />
        <meshStandardMaterial
          color="#44BB44"
          emissive="#44BB44"
          emissiveIntensity={0.5}
          transparent
          opacity={Math.max(0, 0.35 - scrollProgress * 0.35)}
        />
      </mesh>

      {/* ===== NAVIGATION CLUSTER ===== */}
      {/* D-pad base ring */}
      <mesh position={[0, 0.15, 0.175]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.04, 32]} />
        <meshStandardMaterial
          color="#8A7A60"
          metalness={0.8}
          roughness={0.2}
          emissive="#8A7A60"
          emissiveIntensity={0.04}
          transparent
          opacity={opacity}
        />
      </mesh>
      {/* D-pad inner ring */}
      <mesh position={[0, 0.15, 0.19]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.1, 0.015, 8, 32]} />
        <meshStandardMaterial
          color="#888888"
          metalness={0.7}
          roughness={0.3}
          transparent
          opacity={opacity}
        />
      </mesh>
      {/* D-pad center select button */}
      <mesh position={[0, 0.15, 0.2]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial
          color="#AAAAAA"
          metalness={0.6}
          roughness={0.4}
          emissive="#AAAAAA"
          emissiveIntensity={0.15}
          transparent
          opacity={accentOpacity}
        />
      </mesh>
      {/* D-pad directional markers */}
      {[
        [0, 0.08, 0],    // up
        [0, -0.08, 0],   // down
        [-0.08, 0, 0],   // left
        [0.08, 0, 0],    // right
      ].map(([dx, dy], i) => (
        <mesh key={`dpad-dir-${i}`} position={[dx, 0.15 + dy, 0.196]}>
          <boxGeometry args={[0.02, 0.02, 0.002]} />
          <meshStandardMaterial
            color="#999999"
            emissive="#999999"
            emissiveIntensity={0.15}
            transparent
            opacity={accentOpacity * 0.5}
          />
        </mesh>
      ))}

      {/* Soft key left */}
      <RoundedBox args={[0.17, 0.09, 0.035]} radius={0.015} smoothness={3} position={[-0.28, 0.15, 0.18]}>
        <meshStandardMaterial
          color="#A09070"
          metalness={0.8}
          roughness={0.2}
          emissive="#A09070"
          emissiveIntensity={0.04}
          transparent
          opacity={opacity}
        />
      </RoundedBox>
      {/* Soft key right */}
      <RoundedBox args={[0.17, 0.09, 0.035]} radius={0.015} smoothness={3} position={[0.28, 0.15, 0.18]}>
        <meshStandardMaterial
          color="#A09070"
          metalness={0.8}
          roughness={0.2}
          emissive="#A09070"
          emissiveIntensity={0.04}
          transparent
          opacity={opacity}
        />
      </RoundedBox>

      {/* ===== CALL / END BUTTONS ===== */}
      {/* Green call button */}
      <RoundedBox args={[0.18, 0.09, 0.035]} radius={0.015} smoothness={3} position={[-0.22, -0.02, 0.18]}>
        <meshStandardMaterial
          color="#22AA44"
          metalness={0.6}
          roughness={0.4}
          emissive="#22AA44"
          emissiveIntensity={0.3}
          transparent
          opacity={buttonOpacity}
        />
      </RoundedBox>
      {/* Call icon (tiny phone shape - horizontal bar) */}
      <mesh position={[-0.22, -0.02, 0.2]}>
        <boxGeometry args={[0.06, 0.02, 0.002]} />
        <meshStandardMaterial
          color="#22AA44"
          emissive="#22AA44"
          emissiveIntensity={0.6}
          transparent
          opacity={buttonOpacity * 0.7}
        />
      </mesh>

      {/* Red end button */}
      <RoundedBox args={[0.18, 0.09, 0.035]} radius={0.015} smoothness={3} position={[0.22, -0.02, 0.18]}>
        <meshStandardMaterial
          color="#CC2222"
          metalness={0.6}
          roughness={0.4}
          emissive="#CC2222"
          emissiveIntensity={0.3}
          transparent
          opacity={buttonOpacity}
        />
      </RoundedBox>
      {/* End icon (horizontal bar) */}
      <mesh position={[0.22, -0.02, 0.2]}>
        <boxGeometry args={[0.06, 0.02, 0.002]} />
        <meshStandardMaterial
          color="#CC2222"
          emissive="#CC2222"
          emissiveIntensity={0.6}
          transparent
          opacity={buttonOpacity * 0.7}
        />
      </mesh>

      {/* ===== KEYPAD - 3x4 GRID ===== */}
      {[
        [-0.27, -0.2], [0, -0.2], [0.27, -0.2],       // row 1: 1 2 3
        [-0.27, -0.37], [0, -0.37], [0.27, -0.37],     // row 2: 4 5 6
        [-0.27, -0.54], [0, -0.54], [0.27, -0.54],     // row 3: 7 8 9
        [-0.27, -0.71], [0, -0.71], [0.27, -0.71],     // row 4: * 0 #
      ].map(([x, y], i) => (
        <group key={`key-${i}`}>
          {/* Key body */}
          <RoundedBox
            args={[0.2, 0.12, 0.03]}
            radius={0.012}
            smoothness={3}
            position={[x, y, 0.18]}
          >
            <meshStandardMaterial
              color="#B8A88C"
              metalness={0.8}
              roughness={0.2}
              emissive="#908060"
              emissiveIntensity={0.08}
              transparent
              opacity={opacity}
            />
          </RoundedBox>
          {/* Key accent dot */}
          <mesh position={[x, y + 0.01, 0.2]}>
            <sphereGeometry args={[0.012, 8, 8]} />
            <meshStandardMaterial
              color="#BBBBBB"
              emissive="#BBBBBB"
              emissiveIntensity={0.2}
              transparent
              opacity={accentOpacity * 0.7}
            />
          </mesh>
          {/* Key edge highlight */}
          <mesh position={[x, y + 0.055, 0.185]}>
            <boxGeometry args={[0.18, 0.004, 0.025]} />
            <meshStandardMaterial
              color="#2A3A4A"
              metalness={0.9}
              roughness={0.15}
              transparent
              opacity={opacity * 0.5}
            />
          </mesh>
        </group>
      ))}

      {/* Key separator lines (horizontal) */}
      {[-0.285, -0.455, -0.625].map((y, i) => (
        <mesh key={`sep-h-${i}`} position={[0, y, 0.178]}>
          <boxGeometry args={[0.75, 0.003, 0.001]} />
          <meshStandardMaterial
            color="#0A1520"
            metalness={0.5}
            roughness={0.5}
            transparent
            opacity={opacity * 0.3}
          />
        </mesh>
      ))}

      {/* ===== SIDE VOLUME BUTTONS (LEFT) ===== */}
      <RoundedBox args={[0.025, 0.16, 0.06]} radius={0.008} smoothness={3} position={[-0.565, 0.35, 0]}>
        <meshStandardMaterial
          color="#999999"
          metalness={0.6}
          roughness={0.4}
          emissive="#999999"
          emissiveIntensity={0.1}
          transparent
          opacity={accentOpacity}
        />
      </RoundedBox>
      <RoundedBox args={[0.025, 0.16, 0.06]} radius={0.008} smoothness={3} position={[-0.565, 0.12, 0]}>
        <meshStandardMaterial
          color="#999999"
          metalness={0.6}
          roughness={0.4}
          emissive="#999999"
          emissiveIntensity={0.1}
          transparent
          opacity={accentOpacity}
        />
      </RoundedBox>
      {/* Volume button divider marks */}
      <mesh position={[-0.578, 0.35, 0]}>
        <boxGeometry args={[0.002, 0.08, 0.03]} />
        <meshStandardMaterial
          color="#777777"
          transparent
          opacity={accentOpacity * 0.4}
        />
      </mesh>
      <mesh position={[-0.578, 0.12, 0]}>
        <boxGeometry args={[0.002, 0.08, 0.03]} />
        <meshStandardMaterial
          color="#777777"
          transparent
          opacity={accentOpacity * 0.4}
        />
      </mesh>

      {/* ===== POWER BUTTON (RIGHT SIDE) ===== */}
      <RoundedBox args={[0.025, 0.2, 0.06]} radius={0.008} smoothness={3} position={[0.565, 0.25, 0]}>
        <meshStandardMaterial
          color="#AAAAAA"
          metalness={0.7}
          roughness={0.3}
          emissive="#AAAAAA"
          emissiveIntensity={0.05}
          transparent
          opacity={opacity}
        />
      </RoundedBox>
      {/* Power button ridge */}
      <mesh position={[0.578, 0.25, 0]}>
        <boxGeometry args={[0.002, 0.12, 0.035]} />
        <meshStandardMaterial
          color="#888888"
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={opacity * 0.5}
        />
      </mesh>

      {/* ===== MICROPHONE HOLE (BOTTOM) ===== */}
      <mesh position={[0, -1.02, 0.18]}>
        <sphereGeometry args={[0.022, 10, 10]} />
        <meshStandardMaterial
          color="#0a0a0a"
          metalness={0.3}
          roughness={0.8}
          transparent
          opacity={opacity}
        />
      </mesh>
      {/* Microphone ring */}
      <mesh position={[0, -1.02, 0.18]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.03, 0.005, 8, 16]} />
        <meshStandardMaterial
          color="#888888"
          emissive="#888888"
          emissiveIntensity={0.1}
          transparent
          opacity={accentOpacity * 0.6}
        />
      </mesh>

      {/* ===== CHARGING PORT (BOTTOM) ===== */}
      <RoundedBox args={[0.14, 0.035, 0.06]} radius={0.008} smoothness={3} position={[0, -1.09, 0.04]}>
        <meshStandardMaterial
          color="#111111"
          metalness={0.5}
          roughness={0.5}
          transparent
          opacity={opacity * 0.8}
        />
      </RoundedBox>
      {/* Charging port inner */}
      <mesh position={[0, -1.09, 0.055]}>
        <boxGeometry args={[0.1, 0.02, 0.03]} />
        <meshStandardMaterial
          color="#333333"
          metalness={0.3}
          roughness={0.7}
          transparent
          opacity={opacity * 0.7}
        />
      </mesh>

      {/* ===== SCREEN GLOW LIGHT ===== */}
      <pointLight
        position={[0, 0.6, 0.5]}
        color="#66BBAA"
        intensity={0.35}
        distance={2.5}
        decay={2}
      />
      {/* Secondary accent glow */}
      <pointLight
        position={[0, -0.3, 0.4]}
        color="#CCBB99"
        intensity={0.08}
        distance={1.5}
        decay={2}
      />

      {/* ===== WIREFRAME OVERLAY ===== */}
      <RoundedBox args={[1.12, 2.22, 0.37]} radius={0.1} smoothness={4}>
        <meshBasicMaterial
          color="#D2C4A8"
          wireframe
          transparent
          opacity={Math.max(0, 0.04 - scrollProgress * 0.04)}
        />
      </RoundedBox>
    </group>
  );
}
