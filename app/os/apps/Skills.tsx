'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { skills } from '@/data/portfolio';
import { useOS } from '../store';
import { useElementWidth } from '../hooks';
import { whereUsed } from '../skill-match';
import { cn } from '@/lib/utils';

const GROUP_HUES = [78, 190, 280, 150, 330, 30];

type Node = { name: string; group: number; x: number; y: number; z: number };

export default function Skills() {
  const [ref, width] = useElementWidth<HTMLDivElement>();
  const narrow = width > 0 && width < 720;
  const [group, setGroup] = useState<number | null>(null);
  const [selected, setSelected] = useState<string | null>('Java');
  const hits = useMemo(() => (selected ? whereUsed(selected) : []), [selected]);
  const openProject = useOS((s) => s.openProject);
  const open = useOS((s) => s.open);

  return (
    <div ref={ref} className={cn('grid h-full', narrow ? 'grid-rows-[auto_1fr]' : 'grid-cols-[1fr_280px]')}>
      <div className="relative flex min-h-[360px] flex-col">
        <div className="os-scroll flex gap-1.5 overflow-x-auto p-4 pb-0">
          <button
            onClick={() => setGroup(null)}
            className={cn('chip shrink-0', group === null && 'border-white/30 text-fg')}
          >
            all
          </button>
          {skills.map((g, i) => (
            <button
              key={g.group}
              onClick={() => setGroup(group === i ? null : i)}
              className={cn('chip shrink-0 gap-1.5', group === i && 'border-white/30 text-fg')}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: `hsl(${GROUP_HUES[i]} 90% 65%)` }} />
              {g.group}
            </button>
          ))}
        </div>
        <Sphere group={group} selected={selected} onSelect={setSelected} />
        <p className="pointer-events-none absolute bottom-3 left-4 font-mono text-[10.5px] text-fg-faint">
          drag to spin · click a skill
        </p>
      </div>

      <aside className={cn('os-scroll overflow-y-auto border-white/[0.06] p-5', narrow ? 'border-t' : 'border-l')}>
        <span className="label">process inspector</span>
        <AnimatePresence mode="wait">
          <motion.div
            key={selected ?? 'none'}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <h3 className="mt-2 font-serif text-3xl italic text-fg">{selected ?? '—'}</h3>
            <p className="mt-1 font-mono text-[11px] text-fg-dim">
              {hits.length
                ? `${hits.length} process${hits.length > 1 ? 'es' : ''} using this`
                : 'no tracked process — core toolkit'}
            </p>
            <ul className="mt-4 space-y-1">
              {hits.map((h) => (
                <li key={h.kind + h.id}>
                  <button
                    onClick={() => (h.kind === 'role' ? open('experience') : openProject(h.id))}
                    className="group flex w-full items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-left transition-colors hover:border-white/15 hover:bg-white/[0.05]"
                  >
                    <span>
                      <span className="block text-[13px] text-fg">{h.name}</span>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-fg-faint">{h.kind}</span>
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-fg-faint group-hover:text-phosphor" />
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </aside>
    </div>
  );
}

function Sphere({
  group,
  selected,
  onSelect,
}: {
  group: number | null;
  selected: string | null;
  onSelect: (s: string) => void;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLButtonElement | null)[]>([]);
  const rot = useRef({ x: -0.3, y: 0, vx: 0, vy: 0.0035, dragging: false });

  const nodes = useMemo<Node[]>(() => {
    const flat = skills.flatMap((g, gi) => g.items.map((name) => ({ name, group: gi })));
    const n = flat.length;
    return flat.map((f, i) => {
      const t = (i + 0.5) / n;
      const inc = Math.acos(1 - 2 * t);
      const az = Math.PI * (1 + Math.sqrt(5)) * i;
      return { ...f, x: Math.sin(inc) * Math.cos(az), y: Math.sin(inc) * Math.sin(az), z: Math.cos(inc) };
    });
  }, []);

  useEffect(() => {
    let raf = 0;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const tick = () => {
      const r = rot.current;
      if (!r.dragging) {
        r.vy += ((reduced ? 0 : 0.0035) - r.vy) * 0.02;
        r.vx *= 0.95;
      }
      r.y += r.vy;
      r.x = Math.max(-1.2, Math.min(1.2, r.x + r.vx));
      const el = wrap.current;
      if (el) {
        const R = Math.min(el.clientWidth, el.clientHeight) * 0.38;
        const cx = Math.cos(r.x);
        const sx = Math.sin(r.x);
        const cy = Math.cos(r.y);
        const sy = Math.sin(r.y);
        nodes.forEach((n, i) => {
          const b = items.current[i];
          if (!b) return;
          // rotate around Y then X
          const x1 = n.x * cy + n.z * sy;
          const z1 = -n.x * sy + n.z * cy;
          const y2 = n.y * cx - z1 * sx;
          const z2 = n.y * sx + z1 * cx;
          const depth = (z2 + 1) / 2; // 0 back → 1 front
          const scale = 0.6 + depth * 0.6;
          b.style.transform = `translate(-50%, -50%) translate3d(${x1 * R}px, ${y2 * R}px, 0) scale(${scale})`;
          b.style.zIndex = String(Math.round(depth * 100));
          b.style.setProperty('--depth', depth.toFixed(3));
        });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [nodes]);

  function onPointerDown(e: React.PointerEvent) {
    const r = rot.current;
    r.dragging = true;
    let lx = e.clientX;
    let ly = e.clientY;
    const move = (ev: PointerEvent) => {
      r.vy = (ev.clientX - lx) * 0.005;
      r.vx = (ev.clientY - ly) * -0.005;
      lx = ev.clientX;
      ly = ev.clientY;
    };
    const up = () => {
      r.dragging = false;
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }

  return (
    <div
      ref={wrap}
      onPointerDown={onPointerDown}
      className="relative flex-1 cursor-grab touch-none select-none active:cursor-grabbing"
    >
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[60%] w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.05] bg-[radial-gradient(circle,rgba(94,231,255,0.07),transparent_65%)]"
      />
      {nodes.map((n, i) => {
        const dim = group !== null && group !== n.group;
        const isSel = selected === n.name;
        const hue = GROUP_HUES[n.group];
        return (
          <button
            key={n.name}
            ref={(el) => {
              items.current[i] = el;
            }}
            onClick={() => onSelect(n.name)}
            className={cn(
              'absolute left-1/2 top-1/2 whitespace-nowrap rounded-md px-2 py-0.5 font-mono text-[12px] transition-[color,background,opacity] duration-300',
              isSel ? 'bg-white text-ink' : 'hover:bg-white/10'
            )}
            style={{
              color: isSel ? undefined : `hsl(${hue} 90% ${dim ? 40 : 72}%)`,
              opacity: dim ? 0.15 : 'calc(0.3 + var(--depth, 1) * 0.7)',
              textShadow: isSel || dim ? 'none' : `0 0 12px hsl(${hue} 90% 60% / .5)`,
            }}
          >
            {n.name}
          </button>
        );
      })}
    </div>
  );
}
