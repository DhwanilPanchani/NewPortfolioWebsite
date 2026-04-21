'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uScrollProgress;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vDisplacement;

  //
  // Simplex 3D noise
  //
  vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 1.0/7.0;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;

    // Multi-layered noise displacement
    float speed = uTime * 0.15;
    vec3 noisePos = position * 0.8 + vec3(speed);

    // Mouse influence on noise
    float mouseInfluence = length(uMouse) * 0.3;
    noisePos.xy += uMouse * 0.5;

    float noise1 = snoise(noisePos) * 0.4;
    float noise2 = snoise(noisePos * 2.0 + vec3(speed * 0.5)) * 0.15;
    float noise3 = snoise(noisePos * 4.0 - vec3(speed * 0.3)) * 0.05;

    float displacement = noise1 + noise2 + noise3;
    displacement *= (1.0 - uScrollProgress * 0.5);

    vDisplacement = displacement;

    vec3 newPosition = position + normal * displacement;

    // Subtle scale with scroll
    float scale = 1.0 - uScrollProgress * 0.3;
    newPosition *= scale;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform float uScrollProgress;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vDisplacement;

  void main() {
    // Fresnel (edge glow)
    vec3 viewDir = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 3.0);

    // Base color: very dark warm gray
    vec3 baseColor = vec3(0.06, 0.06, 0.06);

    // Accent color: burnt orange
    vec3 accentColor = vec3(0.91, 0.39, 0.24);

    // Secondary glow: warm white
    vec3 warmWhite = vec3(0.93, 0.93, 0.90);

    // Mix based on displacement and fresnel
    vec3 color = baseColor;

    // Edge glow with accent
    color = mix(color, accentColor, fresnel * 0.6);

    // Displacement highlights
    float displacementFactor = smoothstep(-0.1, 0.4, vDisplacement);
    color = mix(color, warmWhite * 0.15, displacementFactor * 0.3);

    // Very subtle shimmer on peaks
    float shimmer = smoothstep(0.2, 0.45, vDisplacement);
    color += accentColor * shimmer * 0.15;

    // Alpha: solid center, transparent edges for blend
    float alpha = 0.85 - fresnel * 0.3;
    alpha *= (1.0 - uScrollProgress * 0.8);

    gl_FragColor = vec4(color, alpha);
  }
`;

interface HeroMeshProps {
  scrollProgress?: number;
}

export default function HeroMesh({ scrollProgress = 0 }: HeroMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uScrollProgress: { value: 0 },
  }), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const material = meshRef.current.material as THREE.ShaderMaterial;

    material.uniforms.uTime.value = state.clock.elapsedTime;

    // Smooth mouse follow
    const target = new THREE.Vector2(pointer.x * 0.5, pointer.y * 0.5);
    material.uniforms.uMouse.value.lerp(target, 0.05);

    // Scroll progress
    material.uniforms.uScrollProgress.value = THREE.MathUtils.lerp(
      material.uniforms.uScrollProgress.value,
      scrollProgress,
      0.1
    );

    // Gentle auto-rotation
    meshRef.current.rotation.x += 0.001;
    meshRef.current.rotation.y += 0.002;
  });

  return (
    <mesh ref={meshRef} position={[1.2, 0, 0]} scale={2.2}>
      <icosahedronGeometry args={[1, 64]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
