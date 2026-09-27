'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import { Minus, X, Maximize2, Minimize2 } from 'lucide-react';
import { APPS } from './registry';
import { useOS, MENUBAR_H, DOCK_SPACE, type Win } from './store';
import { useIsMobile } from './hooks';
import { cn } from '@/lib/utils';

const MOBILE_DOCK = 84;

export default function Window({ win, children }: { win: Win; children: React.ReactNode }) {
  const meta = APPS[win.id];
  const Icon = meta.icon;
  const focused = useOS((s) => s.focused === win.id);
  const { focus, close, minimize, toggleMax, move, resize } = useOS.getState();
  const isMobile = useIsMobile();
  const [dragging, setDragging] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Drag velocity feeds a spring tilt — windows lean into the direction they're thrown.
  const tiltX = useSpring(0, { stiffness: 180, damping: 18 });
  const tiltY = useSpring(0, { stiffness: 180, damping: 18 });

  useEffect(() => {
    bodyRef.current?.focus({ preventScroll: true });
  }, []);

  const vw = typeof window !== 'undefined' ? window.innerWidth : 1440;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 900;

  const rect = isMobile
    ? { x: 0, y: MENUBAR_H, w: vw, h: vh - MENUBAR_H - MOBILE_DOCK }
    : win.maximized
      ? { x: 12, y: MENUBAR_H + 8, w: vw - 24, h: vh - MENUBAR_H - DOCK_SPACE - 8 }
      : win;

  function startDrag(e: React.PointerEvent) {
    if (isMobile || win.maximized || e.button !== 0) return;
    if ((e.target as HTMLElement).closest('button')) return;
    e.preventDefault();
    focus(win.id);
    setDragging(true);
    const ox = e.clientX - win.x;
    const oy = e.clientY - win.y;
    let lastX = e.clientX;
    let lastY = e.clientY;
    const onMove = (ev: PointerEvent) => {
      const nx = Math.min(Math.max(ev.clientX - ox, -win.w + 120), window.innerWidth - 120);
      const ny = Math.min(Math.max(ev.clientY - oy, MENUBAR_H), window.innerHeight - 80);
      move(win.id, nx, ny);
      tiltY.set(Math.max(-14, Math.min(14, (ev.clientX - lastX) * 0.9)));
      tiltX.set(Math.max(-10, Math.min(10, -(ev.clientY - lastY) * 0.7)));
      lastX = ev.clientX;
      lastY = ev.clientY;
    };
    const onUp = () => {
      setDragging(false);
      tiltX.set(0);
      tiltY.set(0);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }

  function startResize(e: React.PointerEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
    const sx = e.clientX;
    const sy = e.clientY;
    const { w, h } = win;
    const onMove = (ev: PointerEvent) => resize(win.id, w + ev.clientX - sx, h + ev.clientY - sy);
    const onUp = () => {
      setDragging(false);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }

  return (
    <motion.section
      role="dialog"
      aria-label={meta.title}
      initial={isMobile ? { y: '100%' } : { opacity: 0, scale: 0.88, y: 40, rotateX: 18 }}
      animate={
        win.minimized
          ? {
              opacity: 0,
              scale: 0.2,
              y: vh - rect.y,
              rotateX: 40,
              transition: { duration: 0.42, ease: [0.7, 0, 0.84, 0] },
            }
          : { opacity: 1, scale: 1, y: 0, rotateX: 0, transition: { type: 'spring', stiffness: 260, damping: 26 } }
      }
      exit={
        isMobile
          ? { y: '100%', transition: { duration: 0.25 } }
          : { opacity: 0, scale: 0.94, y: 12, transition: { duration: 0.18 } }
      }
      onPointerDown={() => focus(win.id)}
      className={cn('fixed', win.minimized && 'pointer-events-none')}
      style={{
        left: rect.x,
        top: rect.y,
        width: rect.w,
        height: rect.h,
        zIndex: win.z,
        transformPerspective: 1600,
        transformOrigin: '50% 100%',
        transition: dragging
          ? 'none'
          : 'left .35s var(--ease-os), top .35s var(--ease-os), width .35s var(--ease-os), height .35s var(--ease-os)',
      }}
    >
      <motion.div
        style={{ rotateX: tiltX, rotateY: tiltY, transformPerspective: 1600 }}
        className={cn(
          'glass relative flex h-full flex-col overflow-hidden transition-[filter,box-shadow] duration-300',
          isMobile ? 'rounded-t-2xl' : 'rounded-2xl',
          focused ? 'shadow-[0_40px_120px_-30px_rgba(0,0,0,.9)]' : 'brightness-[0.82] saturate-[0.8]'
        )}
      >
        {/* Accent hairline — lights up when focused */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px transition-opacity duration-300"
          style={{
            background: `linear-gradient(90deg, transparent, ${meta.tint[0]}, transparent)`,
            opacity: focused ? 0.9 : 0,
          }}
        />
        <header
          onPointerDown={startDrag}
          onDoubleClick={() => !isMobile && toggleMax(win.id)}
          className={cn(
            'flex h-11 shrink-0 select-none items-center gap-3 border-b border-white/[0.06] px-3.5',
            !isMobile && !win.maximized && 'cursor-grab active:cursor-grabbing'
          )}
        >
          <div className="group flex items-center gap-1.5">
            <WinButton label={`Close ${meta.title}`} onClick={() => close(win.id)} color="#FF5C7A">
              <X className="h-2 w-2" strokeWidth={3} />
            </WinButton>
            {!isMobile && (
              <>
                <WinButton label={`Minimize ${meta.title}`} onClick={() => minimize(win.id)} color="#FFB547">
                  <Minus className="h-2 w-2" strokeWidth={3} />
                </WinButton>
                <WinButton
                  label={win.maximized ? 'Restore' : 'Maximize'}
                  onClick={() => toggleMax(win.id)}
                  color="#C8FF4D"
                >
                  {win.maximized ? (
                    <Minimize2 className="h-2 w-2" strokeWidth={3} />
                  ) : (
                    <Maximize2 className="h-2 w-2" strokeWidth={3} />
                  )}
                </WinButton>
              </>
            )}
          </div>
          <div className="flex min-w-0 flex-1 items-center justify-center gap-2 font-mono text-[11.5px] text-fg-dim">
            <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: meta.tint[0] }} />
            <span className="truncate">{meta.file}</span>
          </div>
          <span className="hidden font-mono text-[10px] text-fg-faint sm:block">{focused ? '● live' : '○ idle'}</span>
        </header>
        <div ref={bodyRef} tabIndex={-1} className="os-scroll relative min-h-0 flex-1 overflow-auto outline-none">
          {children}
        </div>
        {!isMobile && !win.maximized && (
          <div
            onPointerDown={startResize}
            aria-hidden
            className="absolute bottom-0 right-0 h-4 w-4 cursor-nwse-resize"
            style={{
              background:
                'linear-gradient(135deg, transparent 50%, rgba(255,255,255,.18) 50%, transparent 62%, rgba(255,255,255,.18) 62%, transparent 74%)',
            }}
          />
        )}
      </motion.div>
    </motion.section>
  );
}

function WinButton({
  label,
  onClick,
  color,
  children,
}: {
  label: string;
  onClick: () => void;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className="grid h-3 w-3 place-items-center rounded-full text-ink/0 transition-colors group-hover:text-ink/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      style={{ background: color }}
    >
      {children}
    </button>
  );
}
