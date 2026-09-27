'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { APPS, DOCK_ORDER, type AppId } from './registry';
import { useOS } from './store';
import { useIsMobile } from './hooks';

export default function Dock() {
  const mouseX = useMotionValue(Infinity);
  const isMobile = useIsMobile();

  return (
    <nav aria-label="Dock" className="fixed inset-x-0 bottom-0 z-[60] flex justify-center pb-3 sm:pb-4">
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25, type: 'spring', stiffness: 220, damping: 24 }}
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="glass os-scroll flex max-w-[calc(100vw-16px)] items-end gap-1.5 overflow-x-auto sm:gap-2 rounded-2xl px-2.5 pb-2 pt-2 sm:overflow-visible"
      >
        {DOCK_ORDER.map((id, i) => (
          <DockIcon key={id} id={id} mouseX={mouseX} magnify={!isMobile} divider={i === 4} />
        ))}
      </motion.div>
    </nav>
  );
}

function DockIcon({
  id,
  mouseX,
  magnify,
  divider,
}: {
  id: AppId;
  mouseX: MotionValue<number>;
  magnify: boolean;
  divider: boolean;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const meta = APPS[id];
  const Icon = meta.icon;
  const running = useOS((s) => !!s.windows[id]);
  const focused = useOS((s) => s.focused === id);
  const open = useOS((s) => s.open);
  const minimize = useOS((s) => s.minimize);

  // Distance from cursor → tile size, for the classic dock magnification wave.
  const dist = useTransform(mouseX, (x) => {
    const r = ref.current?.getBoundingClientRect();
    return r ? x - r.left - r.width / 2 : Infinity;
  });
  const size = useSpring(useTransform(dist, [-140, 0, 140], magnify ? [44, 66, 44] : [38, 38, 38]), {
    stiffness: 320,
    damping: 22,
    mass: 0.2,
  });

  return (
    <>
      {divider && <span aria-hidden className="mx-0.5 h-9 w-px self-center bg-white/10" />}
      <motion.button
        ref={ref}
        style={{ width: size, height: size }}
        whileTap={{ scale: 0.9 }}
        onClick={() => (focused ? minimize(id) : open(id))}
        aria-label={`${meta.title}${running ? ' (running)' : ''}`}
        className="group relative shrink-0 rounded-[14px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-phosphor/70"
      >
        <span
          className="absolute inset-0 grid place-items-center overflow-hidden rounded-[14px] border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,.25)]"
          style={{ background: `linear-gradient(145deg, ${meta.tint[0]}, ${meta.tint[1]})` }}
        >
          <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.35),transparent_55%)]" />
          <Icon
            className="relative h-[46%] w-[46%] text-ink drop-shadow-[0_1px_0_rgba(255,255,255,.3)]"
            strokeWidth={2.2}
            style={id === 'terminal' ? { color: '#C8FF4D' } : undefined}
          />
        </span>
        <span className="pointer-events-none absolute -top-9 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-ink/90 px-2 py-1 font-mono text-[11px] text-fg opacity-0 transition-opacity group-hover:opacity-100 sm:block">
          {meta.title}
        </span>
        {running && <span className="absolute -bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-fg" />}
      </motion.button>
    </>
  );
}
