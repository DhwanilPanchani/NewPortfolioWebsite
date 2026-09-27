'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { Stage } from '@/data/portfolio';
import { cn } from '@/lib/utils';

/**
 * A project's architecture as a live signal path: packets travel stage to stage in the
 * project's hue, the active stage cycles on its own, and hovering pins a stage's readout.
 */
export default function Pipeline({ stages, hue, vertical }: { stages: Stage[]; hue: number; vertical: boolean }) {
  const [auto, setAuto] = useState(0);
  const [pinned, setPinned] = useState<number | null>(null);
  const active = pinned ?? auto;
  const color = `hsl(${hue} 95% 64%)`;

  useEffect(() => {
    setAuto(0);
    const t = setInterval(() => setAuto((i) => (i + 1) % stages.length), 1800);
    return () => clearInterval(t);
  }, [stages]);

  return (
    <div className="rounded-xl border border-white/[0.07] bg-black/30 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="label">signal path</span>
        <span className="font-mono text-[10.5px] text-fg-faint">
          stage {active + 1}/{stages.length}
        </span>
      </div>

      <div className={cn('flex', vertical ? 'flex-col' : 'items-stretch')}>
        {stages.map((s, i) => (
          <div key={s.label + i} className={cn('flex', vertical ? 'flex-col' : 'min-w-0 flex-1 items-center')}>
            <button
              onMouseEnter={() => setPinned(i)}
              onMouseLeave={() => setPinned(null)}
              onFocus={() => setPinned(i)}
              onBlur={() => setPinned(null)}
              className={cn(
                'relative w-full min-w-0 rounded-lg border px-2.5 py-2 text-left transition-all duration-300 focus-visible:outline-none',
                i === active ? 'border-transparent bg-white/[0.06]' : 'border-white/[0.07] bg-white/[0.015]'
              )}
              style={i === active ? { boxShadow: `0 0 0 1px ${color}, 0 0 28px -6px ${color}` } : undefined}
            >
              <span className="block font-mono text-[10px] text-fg-faint">{String(i + 1).padStart(2, '0')}</span>
              <span className="block truncate text-[12.5px] font-medium text-fg">{s.label}</span>
              {s.parallel && (
                <span className="mt-1.5 flex flex-col gap-1">
                  {s.parallel.map((p, j) => (
                    <span
                      key={p + j}
                      className="flex items-start gap-1.5 font-mono text-[10px] leading-tight text-fg-dim"
                    >
                      <span
                        className="mt-[3px] h-1 w-1 shrink-0 rounded-full"
                        style={{ background: color, opacity: 0.4 + j * 0.2 }}
                      />
                      {p}
                    </span>
                  ))}
                </span>
              )}
            </button>
            {i < stages.length - 1 && <Link vertical={vertical} color={color} delay={i * 0.3} hot={i === active} />}
          </div>
        ))}
      </div>

      <motion.p
        key={active}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-3 font-mono text-[11.5px] text-fg-dim"
      >
        <span style={{ color }}>&gt;</span> {stages[active].label.toLowerCase()} — {stages[active].detail}
      </motion.p>
    </div>
  );
}

function Link({ vertical, color, delay, hot }: { vertical: boolean; color: string; delay: number; hot: boolean }) {
  return (
    <div className={cn('relative shrink-0', vertical ? 'mx-auto h-6 w-px' : 'h-px w-5')}>
      <div className="absolute inset-0 bg-white/10" />
      <span
        className={cn(
          'absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full',
          vertical ? 'left-1/2 animate-packetY' : 'top-1/2 animate-packetX'
        )}
        style={{
          background: color,
          boxShadow: `0 0 10px 2px ${color}`,
          animationDelay: `${delay}s`,
          opacity: hot ? 1 : 0.7,
        }}
      />
    </div>
  );
}
