'use client';

import { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Vignette, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { featured } from '@/data/portfolio';
import { useOS } from '../store';
import { coreVertex, coreFragment, shellVertex, shellFragment, gridVertex, gridFragment } from './shaders';

// Pointer tracked on window so the scene reacts even under DOM overlays.
const pointer = { x: 0, y: 0 };
if (typeof window !== 'undefined') {
  window.addEventListener(
    'pointermove',
    (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    },
    { passive: true }
  );
}

const hsl = (h: number, s = 0.9, l = 0.6) => new THREE.Color().setHSL(h / 360, s, l);
const PHOSPHOR = new THREE.Color('#C8FF4D');
const SIGNAL = new THREE.Color('#5EE7FF');

function useAccent() {
  const focused = useOS((s) => s.focused);
  const project = useOS((s) => s.project);
  return useMemo(() => {
    if (focused === 'projects') {
      const p = featured.find((f) => f.id === project);
      if (p) return hsl(p.hue);
    }
    return PHOSPHOR;
  }, [focused, project]);
}

function Core({ accent, anyOpen }: { accent: THREE.Color; anyOpen: boolean }) {
  const group = useRef<THREE.Group>(null);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const shellMat = useRef<THREE.ShaderMaterial>(null);
  const { gl } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uEnergy: { value: 0 },
      uPointer: { value: new THREE.Vector3(0, 0, 1) },
      uColor: { value: PHOSPHOR.clone() },
      uColorB: { value: SIGNAL.clone() },
    }),
    []
  );

  const shell = useMemo(() => {
    const count = 2600;
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Fibonacci sphere for an even data-shell distribution
      const t = i / count;
      const inc = Math.acos(1 - 2 * t);
      const az = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 2.05;
      pos[i * 3] = r * Math.sin(inc) * Math.cos(az);
      pos[i * 3 + 1] = r * Math.sin(inc) * Math.sin(az);
      pos[i * 3 + 2] = r * Math.cos(inc);
      seed[i] = Math.random();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
    return g;
  }, []);

  const shellUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
      uColor: { value: SIGNAL.clone() },
    }),
    [gl]
  );

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    uniforms.uTime.value = t;
    shellUniforms.uTime.value = t;
    const energy = Math.min(1, Math.hypot(pointer.x, pointer.y));
    uniforms.uEnergy.value = THREE.MathUtils.lerp(uniforms.uEnergy.value, energy, 0.05);
    uniforms.uPointer.value.lerp(new THREE.Vector3(pointer.x * 2, pointer.y * 2, 1.2), 0.08);
    uniforms.uColor.value.lerp(accent, 0.04);
    shellUniforms.uColor.value.lerp(accent.clone().lerp(SIGNAL, 0.55), 0.04);
    if (group.current) {
      group.current.rotation.y += dt * 0.08;
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, pointer.y * 0.25, 0.05);
      const s = anyOpen ? 0.82 : 1;
      group.current.scale.lerp(new THREE.Vector3(s, s, s), 0.05);
    }
  });

  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[1.25, 64]} />
        <shaderMaterial ref={mat} vertexShader={coreVertex} fragmentShader={coreFragment} uniforms={uniforms} />
      </mesh>
      <points geometry={shell}>
        <shaderMaterial
          ref={shellMat}
          vertexShader={shellVertex}
          fragmentShader={shellFragment}
          uniforms={shellUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

function Rings() {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z += dt * 0.03;
  });
  return (
    <group ref={ref}>
      {[2.75, 3.35, 4.1].map((r, i) => (
        <mesh key={r} rotation={[Math.PI / 2 + 0.35 - i * 0.12, i * 0.3, 0]}>
          <torusGeometry args={[r, 0.0035, 8, 256]} />
          <meshBasicMaterial color={i === 1 ? '#5EE7FF' : '#ffffff'} transparent opacity={i === 1 ? 0.5 : 0.14} />
        </mesh>
      ))}
    </group>
  );
}

/** Each flagship project is a satellite — hover to identify, click to open its case file. */
function Satellites() {
  const openProject = useOS((s) => s.openProject);
  const current = useOS((s) => s.project);
  const focused = useOS((s) => s.focused);
  const [hover, setHover] = useState<string | null>(null);
  const refs = useRef<(THREE.Group | null)[]>([]);

  const orbits = useMemo(
    () =>
      featured.map((p, i) => ({
        p,
        radius: 2.75 + (i % 3) * 0.6,
        speed: 0.12 + (i % 3) * 0.035,
        phase: (i / featured.length) * Math.PI * 2,
        tilt: 0.35 - (i % 3) * 0.12,
        color: hsl(p.hue, 0.95, 0.62),
      })),
    []
  );

  // Each satellite integrates its own angle so a hovered one can freeze in place (easy to click).
  const angles = useRef(orbits.map((o) => o.phase));

  useFrame((_, dt) => {
    orbits.forEach((o, i) => {
      const g = refs.current[i];
      if (!g) return;
      if (hover !== o.p.id) angles.current[i] += dt * o.speed;
      const a = angles.current[i];
      g.position.set(
        Math.cos(a) * o.radius,
        Math.sin(a) * o.radius * Math.sin(o.tilt) * -1,
        Math.sin(a) * o.radius * Math.cos(o.tilt)
      );
      const active = hover === o.p.id || (focused === 'projects' && current === o.p.id);
      const s = active ? 1.9 : 1;
      g.scale.lerp(new THREE.Vector3(s, s, s), 0.12);
    });
  });

  return (
    <group rotation={[0.35, 0, 0]}>
      {orbits.map((o, i) => (
        <group
          key={o.p.id}
          ref={(el) => {
            refs.current[i] = el;
          }}
        >
          <mesh
            onPointerOver={(e) => {
              e.stopPropagation();
              setHover(o.p.id);
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              setHover(null);
              document.body.style.cursor = '';
            }}
            onClick={(e) => {
              e.stopPropagation();
              openProject(o.p.id);
            }}
          >
            <sphereGeometry args={[0.075, 24, 24]} />
            <meshBasicMaterial color={o.color.clone().multiplyScalar(2.2)} toneMapped={false} />
          </mesh>
          {/* Larger invisible hit target */}
          <mesh visible={false} onClick={(e) => (e.stopPropagation(), openProject(o.p.id))}>
            <sphereGeometry args={[0.28, 8, 8]} />
          </mesh>
          {hover === o.p.id && (
            <Html center distanceFactor={9} zIndexRange={[5, 0]} style={{ pointerEvents: 'none' }}>
              <div className="translate-y-9 whitespace-nowrap rounded-md border border-white/15 bg-ink/80 px-2.5 py-1.5 font-mono text-[11px] text-fg backdrop-blur">
                <span style={{ color: `hsl(${o.p.hue} 95% 65%)` }}>●</span> {o.p.name}
                <span className="ml-2 text-fg-faint">{o.p.domain}</span>
              </div>
            </Html>
          )}
        </group>
      ))}
    </group>
  );
}

function Horizon({ accent }: { accent: THREE.Color }) {
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uColor: { value: SIGNAL.clone() } }), []);
  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uColor.value.lerp(accent.clone().lerp(SIGNAL, 0.6), 0.03);
  });
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.1, 0]}>
      <planeGeometry args={[80, 80, 1, 1]} />
      <shaderMaterial
        vertexShader={gridVertex}
        fragmentShader={gridFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

function Rig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const { viewport, camera } = useThree();
  const narrow = viewport.aspect < 1;
  useFrame(() => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.6, 0.03);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0.4 + pointer.y * 0.35, 0.03);
    camera.lookAt(0, 0, 0);
    if (group.current) {
      // Core sits to the right on wide screens so the headline can breathe on the left.
      const tx = narrow ? 0 : Math.min(viewport.width * 0.22, 3.4);
      const ty = narrow ? 1.95 : 0.1;
      group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, tx, 0.06);
      group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, ty, 0.06);
      const s = narrow ? 0.6 : 1;
      group.current.scale.setScalar(s);
    }
  });
  return <group ref={group}>{children}</group>;
}

export default function SpaceScene({ reducedMotion }: { reducedMotion: boolean }) {
  const accent = useAccent();
  const anyOpen = useOS((s) => Object.values(s.windows).some((w) => w && !w.minimized));

  return (
    <Canvas
      className="!fixed inset-0"
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.4, 9], fov: 42 }}
      gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
      frameloop={reducedMotion ? 'demand' : 'always'}
      onCreated={({ gl }) => gl.setClearColor('#05060A')}
    >
      <fog attach="fog" args={['#05060A', 12, 34]} />
      <Stars radius={60} depth={40} count={3200} factor={3.2} saturation={0} fade speed={0.6} />
      <Rig>
        <Core accent={accent} anyOpen={anyOpen} />
        <Rings />
        <Satellites />
      </Rig>
      <Horizon accent={accent} />
      {!reducedMotion && (
        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur intensity={1.15} luminanceThreshold={0.18} luminanceSmoothing={0.3} radius={0.75} />
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={new THREE.Vector2(0.0007, 0.0009)}
            radialModulation={false}
            modulationOffset={0}
          />
          <Noise opacity={0.035} premultiply />
          <Vignette eskil={false} offset={0.2} darkness={0.85} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
