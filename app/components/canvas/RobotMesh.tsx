'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface RobotMeshProps {
  scrollProgress?: number;
}

export default function RobotMesh({ scrollProgress = 0 }: RobotMeshProps) {
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
    groupRef.current.rotation.y = Math.sin(t * 0.1) * 0.4 + mouseTarget.current.x * 0.4;
    groupRef.current.rotation.x = 0.1 + Math.sin(t * 0.1) * 0.06 + mouseTarget.current.y * 0.25;
    groupRef.current.rotation.z = Math.sin(t * 0.07) * 0.03;

    // Gentle float
    groupRef.current.position.y = 0.2 + Math.sin(t * 0.4) * 0.15;

    // Scroll-linked fade
    const scrollFade = Math.max(0, 1 - scrollProgress * 0.4);
    groupRef.current.scale.setScalar(scrollFade * 1.5);
    groupRef.current.position.z = -1.5 - scrollProgress * 2;
  });

  const opacity = Math.max(0, 1 - scrollProgress * 0.9);
  const accentOpacity = Math.max(0, 0.85 - scrollProgress * 0.85);
  const glowOpacity = Math.max(0, 0.9 - scrollProgress * 0.9);

  // Eye scan line positions (vertical offsets within the eye)
  const scanLineOffsets = [-0.03, -0.015, 0, 0.015, 0.03];

  return (
    <group ref={groupRef} position={[3.2, 0.2, -1.5]}>

      {/* ══════════════════════════════════════════
          HEAD — Smooth round/oval shape
          ══════════════════════════════════════════ */}

      {/* Main head shell */}
      <mesh position={[0, 0.85, 0]} scale={[1.15, 1.0, 1.05]}>
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshStandardMaterial
          color="#F0F0F0"
          metalness={0.3}
          roughness={0.2}
          emissive="#DDDDDD"
          emissiveIntensity={0.12}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Head wireframe overlay */}
      <mesh position={[0, 0.85, 0]} scale={[1.16, 1.01, 1.06]}>
        <sphereGeometry args={[0.32, 14, 14]} />
        <meshBasicMaterial
          color="#4499FF"
          wireframe
          transparent
          opacity={Math.max(0, 0.04 - scrollProgress * 0.04)}
        />
      </mesh>

      {/* ══════════════════════════════════════════
          VISOR / FACE PLATE — Dark panel on front
          ══════════════════════════════════════════ */}

      <mesh position={[0, 0.85, 0.22]} scale={[1.0, 0.75, 0.5]}>
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshStandardMaterial
          color="#0A0A12"
          metalness={0.4}
          roughness={0.1}
          emissive="#334466"
          emissiveIntensity={0.08}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* ══════════════════════════════════════════
          EYES — Glowing blue ovals
          ══════════════════════════════════════════ */}

      {/* Left eye */}
      <mesh position={[-0.1, 0.86, 0.34]} scale={[1.0, 0.7, 0.4]}>
        <sphereGeometry args={[0.06, 24, 24]} />
        <meshStandardMaterial
          color="#4499FF"
          emissive="#4499FF"
          emissiveIntensity={1.0}
          transparent
          opacity={glowOpacity}
        />
      </mesh>

      {/* Right eye */}
      <mesh position={[0.1, 0.86, 0.34]} scale={[1.0, 0.7, 0.4]}>
        <sphereGeometry args={[0.06, 24, 24]} />
        <meshStandardMaterial
          color="#4499FF"
          emissive="#4499FF"
          emissiveIntensity={1.0}
          transparent
          opacity={glowOpacity}
        />
      </mesh>

      {/* ══════════════════════════════════════════
          EYE SCAN LINES — Horizontal lines across eyes
          ══════════════════════════════════════════ */}

      {/* Left eye scan lines */}
      {scanLineOffsets.map((yOff, i) => (
        <mesh
          key={`left-scan-${i}`}
          position={[-0.1, 0.86 + yOff, 0.36]}
        >
          <boxGeometry args={[0.1, 0.003, 0.002]} />
          <meshStandardMaterial
            color="#88CCFF"
            emissive="#88CCFF"
            emissiveIntensity={0.8}
            transparent
            opacity={Math.max(0, 0.6 - scrollProgress * 0.6)}
          />
        </mesh>
      ))}

      {/* Right eye scan lines */}
      {scanLineOffsets.map((yOff, i) => (
        <mesh
          key={`right-scan-${i}`}
          position={[0.1, 0.86 + yOff, 0.36]}
        >
          <boxGeometry args={[0.1, 0.003, 0.002]} />
          <meshStandardMaterial
            color="#88CCFF"
            emissive="#88CCFF"
            emissiveIntensity={0.8}
            transparent
            opacity={Math.max(0, 0.6 - scrollProgress * 0.6)}
          />
        </mesh>
      ))}

      {/* Eye glow point lights */}
      <pointLight
        position={[-0.1, 0.86, 0.4]}
        color="#4499FF"
        intensity={0.15}
        distance={1.5}
        decay={2}
      />
      <pointLight
        position={[0.1, 0.86, 0.4]}
        color="#4499FF"
        intensity={0.15}
        distance={1.5}
        decay={2}
      />

      {/* ══════════════════════════════════════════
          NECK RING — Torus connecting head to body
          ══════════════════════════════════════════ */}

      <mesh position={[0, 0.58, 0]}>
        <torusGeometry args={[0.2, 0.03, 12, 32]} />
        <meshStandardMaterial
          color="#CCCCCC"
          metalness={0.6}
          roughness={0.15}
          emissive="#AAAAAA"
          emissiveIntensity={0.06}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Small neck cylinder */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.12, 0.15, 0.1, 24]} />
        <meshStandardMaterial
          color="#E0E0E0"
          metalness={0.35}
          roughness={0.2}
          emissive="#CCCCCC"
          emissiveIntensity={0.08}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* ══════════════════════════════════════════
          BODY / TORSO — Tapered cylinder
          ══════════════════════════════════════════ */}

      {/* Main torso */}
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.5, 0.35, 0.8, 32]} />
        <meshStandardMaterial
          color="#F0F0F0"
          metalness={0.3}
          roughness={0.2}
          emissive="#DDDDDD"
          emissiveIntensity={0.12}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Body wireframe overlay */}
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.505, 0.355, 0.82, 14]} />
        <meshBasicMaterial
          color="#4499FF"
          wireframe
          transparent
          opacity={Math.max(0, 0.035 - scrollProgress * 0.035)}
        />
      </mesh>

      {/* ══════════════════════════════════════════
          CHEST DETAILS — Center seam, panel, accents
          ══════════════════════════════════════════ */}

      {/* Center chest seam line */}
      <mesh position={[0, 0.12, 0.42]}>
        <boxGeometry args={[0.015, 0.7, 0.01]} />
        <meshStandardMaterial
          color="#DDDDDD"
          metalness={0.4}
          roughness={0.2}
          emissive="#CCCCCC"
          emissiveIntensity={0.05}
          transparent
          opacity={accentOpacity}
        />
      </mesh>

      {/* Chest panel / badge */}
      <mesh position={[0, 0.25, 0.44]}>
        <boxGeometry args={[0.18, 0.12, 0.02]} />
        <meshStandardMaterial
          color="#E0E0E0"
          metalness={0.5}
          roughness={0.15}
          emissive="#CCCCCC"
          emissiveIntensity={0.08}
          transparent
          opacity={accentOpacity}
        />
      </mesh>

      {/* Chest panel inner detail */}
      <mesh position={[0, 0.25, 0.455]}>
        <boxGeometry args={[0.12, 0.06, 0.005]} />
        <meshStandardMaterial
          color="#4499FF"
          emissive="#4499FF"
          emissiveIntensity={0.4}
          transparent
          opacity={Math.max(0, 0.5 - scrollProgress * 0.5)}
        />
      </mesh>

      {/* ══════════════════════════════════════════
          SIDE PANEL LINES — 2 per side
          ══════════════════════════════════════════ */}

      {/* Left side panel lines */}
      <mesh position={[-0.42, 0.22, 0.12]} rotation={[0, 0.3, 0]}>
        <boxGeometry args={[0.01, 0.5, 0.01]} />
        <meshStandardMaterial
          color="#DDDDDD"
          emissive="#CCCCCC"
          emissiveIntensity={0.05}
          transparent
          opacity={accentOpacity}
        />
      </mesh>
      <mesh position={[-0.38, 0.22, 0.22]} rotation={[0, 0.3, 0]}>
        <boxGeometry args={[0.01, 0.4, 0.01]} />
        <meshStandardMaterial
          color="#DDDDDD"
          emissive="#CCCCCC"
          emissiveIntensity={0.05}
          transparent
          opacity={accentOpacity}
        />
      </mesh>

      {/* Right side panel lines */}
      <mesh position={[0.42, 0.22, 0.12]} rotation={[0, -0.3, 0]}>
        <boxGeometry args={[0.01, 0.5, 0.01]} />
        <meshStandardMaterial
          color="#DDDDDD"
          emissive="#CCCCCC"
          emissiveIntensity={0.05}
          transparent
          opacity={accentOpacity}
        />
      </mesh>
      <mesh position={[0.38, 0.22, 0.22]} rotation={[0, -0.3, 0]}>
        <boxGeometry args={[0.01, 0.4, 0.01]} />
        <meshStandardMaterial
          color="#DDDDDD"
          emissive="#CCCCCC"
          emissiveIntensity={0.05}
          transparent
          opacity={accentOpacity}
        />
      </mesh>

      {/* ══════════════════════════════════════════
          LEFT ARM — Upper arm, elbow joint, forearm, wrist, hand
          ══════════════════════════════════════════ */}

      <group position={[-0.52, 0.35, 0]} rotation={[0, 0, 0.3]}>
        {/* Shoulder joint ring */}
        <mesh rotation={[Math.PI * 0.5, 0, 0]}>
          <torusGeometry args={[0.085, 0.015, 8, 24]} />
          <meshStandardMaterial color="#CCCCCC" metalness={0.6} roughness={0.15} emissive="#AAAAAA" emissiveIntensity={0.05} transparent opacity={accentOpacity} />
        </mesh>

        {/* Upper arm */}
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.07, 0.055, 0.3, 16]} />
          <meshStandardMaterial color="#F0F0F0" metalness={0.3} roughness={0.2} emissive="#DDDDDD" emissiveIntensity={0.1} transparent opacity={opacity} />
        </mesh>

        {/* Elbow joint sphere */}
        <mesh position={[0, -0.32, 0]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#DDDDDD" metalness={0.5} roughness={0.2} emissive="#CCCCCC" emissiveIntensity={0.08} transparent opacity={opacity} />
        </mesh>

        {/* Forearm */}
        <mesh position={[0, -0.48, 0]}>
          <cylinderGeometry args={[0.055, 0.045, 0.28, 16]} />
          <meshStandardMaterial color="#E8E8E8" metalness={0.35} roughness={0.2} emissive="#DDDDDD" emissiveIntensity={0.1} transparent opacity={opacity} />
        </mesh>

        {/* Wrist joint ring */}
        <mesh position={[0, -0.62, 0]} rotation={[Math.PI * 0.5, 0, 0]}>
          <torusGeometry args={[0.05, 0.012, 8, 24]} />
          <meshStandardMaterial color="#CCCCCC" metalness={0.6} roughness={0.15} emissive="#AAAAAA" emissiveIntensity={0.06} transparent opacity={accentOpacity} />
        </mesh>

        {/* Hand - palm */}
        <mesh position={[0, -0.7, 0.01]}>
          <boxGeometry args={[0.09, 0.1, 0.05]} />
          <meshStandardMaterial color="#E8E8E8" metalness={0.3} roughness={0.25} emissive="#DDDDDD" emissiveIntensity={0.1} transparent opacity={opacity} />
        </mesh>

        {/* Fingers - 3 fingers */}
        {[-0.025, 0, 0.025].map((x, i) => (
          <mesh key={`lf-${i}`} position={[x, -0.8, 0.01]}>
            <boxGeometry args={[0.022, 0.1, 0.03]} />
            <meshStandardMaterial color="#DDDDDD" metalness={0.35} roughness={0.25} emissive="#CCCCCC" emissiveIntensity={0.08} transparent opacity={opacity} />
          </mesh>
        ))}

        {/* Thumb */}
        <mesh position={[0.055, -0.72, 0.01]} rotation={[0, 0, -0.4]}>
          <boxGeometry args={[0.022, 0.08, 0.03]} />
          <meshStandardMaterial color="#DDDDDD" metalness={0.35} roughness={0.25} emissive="#CCCCCC" emissiveIntensity={0.08} transparent opacity={opacity} />
        </mesh>
      </group>

      {/* ══════════════════════════════════════════
          RIGHT ARM — Upper arm, elbow joint, forearm, wrist, hand
          ══════════════════════════════════════════ */}

      <group position={[0.52, 0.35, 0]} rotation={[0, 0, -0.3]}>
        {/* Shoulder joint ring */}
        <mesh rotation={[Math.PI * 0.5, 0, 0]}>
          <torusGeometry args={[0.085, 0.015, 8, 24]} />
          <meshStandardMaterial color="#CCCCCC" metalness={0.6} roughness={0.15} emissive="#AAAAAA" emissiveIntensity={0.05} transparent opacity={accentOpacity} />
        </mesh>

        {/* Upper arm */}
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.07, 0.055, 0.3, 16]} />
          <meshStandardMaterial color="#F0F0F0" metalness={0.3} roughness={0.2} emissive="#DDDDDD" emissiveIntensity={0.1} transparent opacity={opacity} />
        </mesh>

        {/* Elbow joint sphere */}
        <mesh position={[0, -0.32, 0]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#DDDDDD" metalness={0.5} roughness={0.2} emissive="#CCCCCC" emissiveIntensity={0.08} transparent opacity={opacity} />
        </mesh>

        {/* Forearm */}
        <mesh position={[0, -0.48, 0]}>
          <cylinderGeometry args={[0.055, 0.045, 0.28, 16]} />
          <meshStandardMaterial color="#E8E8E8" metalness={0.35} roughness={0.2} emissive="#DDDDDD" emissiveIntensity={0.1} transparent opacity={opacity} />
        </mesh>

        {/* Wrist joint ring */}
        <mesh position={[0, -0.62, 0]} rotation={[Math.PI * 0.5, 0, 0]}>
          <torusGeometry args={[0.05, 0.012, 8, 24]} />
          <meshStandardMaterial color="#CCCCCC" metalness={0.6} roughness={0.15} emissive="#AAAAAA" emissiveIntensity={0.06} transparent opacity={accentOpacity} />
        </mesh>

        {/* Hand - palm */}
        <mesh position={[0, -0.7, 0.01]}>
          <boxGeometry args={[0.09, 0.1, 0.05]} />
          <meshStandardMaterial color="#E8E8E8" metalness={0.3} roughness={0.25} emissive="#DDDDDD" emissiveIntensity={0.1} transparent opacity={opacity} />
        </mesh>

        {/* Fingers - 3 fingers */}
        {[-0.025, 0, 0.025].map((x, i) => (
          <mesh key={`rf-${i}`} position={[x, -0.8, 0.01]}>
            <boxGeometry args={[0.022, 0.1, 0.03]} />
            <meshStandardMaterial color="#DDDDDD" metalness={0.35} roughness={0.25} emissive="#CCCCCC" emissiveIntensity={0.08} transparent opacity={opacity} />
          </mesh>
        ))}

        {/* Thumb */}
        <mesh position={[-0.055, -0.72, 0.01]} rotation={[0, 0, 0.4]}>
          <boxGeometry args={[0.022, 0.08, 0.03]} />
          <meshStandardMaterial color="#DDDDDD" metalness={0.35} roughness={0.25} emissive="#CCCCCC" emissiveIntensity={0.08} transparent opacity={opacity} />
        </mesh>
      </group>

      {/* ══════════════════════════════════════════
          BASE / LOWER BODY — Rounded bottom
          ══════════════════════════════════════════ */}

      {/* Lower body half-sphere */}
      <mesh position={[0, -0.28, 0]} scale={[1.0, 0.6, 1.0]}>
        <sphereGeometry args={[0.35, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial
          color="#F0F0F0"
          metalness={0.3}
          roughness={0.2}
          emissive="#DDDDDD"
          emissiveIntensity={0.12}
          transparent
          opacity={opacity}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Base ring */}
      <mesh position={[0, -0.28, 0]}>
        <torusGeometry args={[0.35, 0.02, 12, 32]} />
        <meshStandardMaterial
          color="#CCCCCC"
          metalness={0.5}
          roughness={0.15}
          emissive="#AAAAAA"
          emissiveIntensity={0.06}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Base wireframe overlay */}
      <mesh position={[0, -0.28, 0]} scale={[1.01, 0.61, 1.01]}>
        <sphereGeometry args={[0.35, 10, 10, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshBasicMaterial
          color="#4499FF"
          wireframe
          transparent
          opacity={Math.max(0, 0.03 - scrollProgress * 0.03)}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ══════════════════════════════════════════
          ACCENT LIGHTS — Small glowing spheres on body
          ══════════════════════════════════════════ */}

      {/* Left shoulder accent light */}
      <mesh position={[-0.46, 0.42, 0.15]}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshStandardMaterial
          color="#4499FF"
          emissive="#4499FF"
          emissiveIntensity={0.8}
          transparent
          opacity={glowOpacity}
        />
      </mesh>

      {/* Right shoulder accent light */}
      <mesh position={[0.46, 0.42, 0.15]}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshStandardMaterial
          color="#4499FF"
          emissive="#4499FF"
          emissiveIntensity={0.8}
          transparent
          opacity={glowOpacity}
        />
      </mesh>

      {/* Center chest accent light */}
      <mesh position={[0, 0.08, 0.4]}>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshStandardMaterial
          color="#4499FF"
          emissive="#4499FF"
          emissiveIntensity={0.6}
          transparent
          opacity={glowOpacity}
        />
      </mesh>

      {/* ══════════════════════════════════════════
          BODY HORIZONTAL DETAIL RINGS
          ══════════════════════════════════════════ */}

      {/* Upper torso ring */}
      <mesh position={[0, 0.4, 0]}>
        <torusGeometry args={[0.47, 0.008, 8, 48]} />
        <meshStandardMaterial
          color="#E0E0E0"
          emissive="#CCCCCC"
          emissiveIntensity={0.08}
          transparent
          opacity={Math.max(0, 0.6 - scrollProgress * 0.6)}
        />
      </mesh>

      {/* Mid torso ring */}
      <mesh position={[0, 0.12, 0]}>
        <torusGeometry args={[0.43, 0.008, 8, 48]} />
        <meshStandardMaterial
          color="#E0E0E0"
          emissive="#CCCCCC"
          emissiveIntensity={0.08}
          transparent
          opacity={Math.max(0, 0.6 - scrollProgress * 0.6)}
        />
      </mesh>

      {/* Lower torso ring */}
      <mesh position={[0, -0.12, 0]}>
        <torusGeometry args={[0.39, 0.008, 8, 48]} />
        <meshStandardMaterial
          color="#E0E0E0"
          emissive="#CCCCCC"
          emissiveIntensity={0.08}
          transparent
          opacity={Math.max(0, 0.6 - scrollProgress * 0.6)}
        />
      </mesh>

      {/* ══════════════════════════════════════════
          HEAD ANTENNA / DETAIL — Small top feature
          ══════════════════════════════════════════ */}

      {/* Small antenna nub on top of head */}
      <mesh position={[0, 1.18, 0]}>
        <cylinderGeometry args={[0.015, 0.025, 0.08, 12]} />
        <meshStandardMaterial
          color="#CCCCCC"
          metalness={0.5}
          roughness={0.2}
          emissive="#BBBBBB"
          emissiveIntensity={0.08}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Antenna tip glow */}
      <mesh position={[0, 1.23, 0]}>
        <sphereGeometry args={[0.022, 12, 12]} />
        <meshStandardMaterial
          color="#4499FF"
          emissive="#4499FF"
          emissiveIntensity={1.0}
          transparent
          opacity={glowOpacity}
        />
      </mesh>

      <pointLight
        position={[0, 1.25, 0]}
        color="#4499FF"
        intensity={0.1}
        distance={1}
        decay={2}
      />

      {/* ══════════════════════════════════════════
          AMBIENT GLOW — Subtle overall illumination
          ══════════════════════════════════════════ */}

      <pointLight
        position={[0, 0.4, 0.5]}
        color="#AACCFF"
        intensity={0.3}
        distance={3}
        decay={2}
      />

      {/* Rim fill from behind */}
      <pointLight
        position={[0, 0.5, -0.8]}
        color="#FFFFFF"
        intensity={0.15}
        distance={2.5}
        decay={2}
      />
    </group>
  );
}
