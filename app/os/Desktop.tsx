'use client';

import { motion } from 'framer-motion';
import { ArrowRight, SquareTerminal, MousePointerClick } from 'lucide-react';
import { profile, featured } from '@/data/portfolio';
import { APPS, DOCK_ORDER } from './registry';
import { useOS } from './store';
import { useScramble } from './hooks';
import { cn } from '@/lib/utils';

const ease = [0.16, 1, 0.3, 1] as const;

export default function Desktop() {
  const anyOpen = useOS((s) => Object.values(s.windows).some((w) => w && !w.minimized));
  const open = useOS((s) => s.open);
  const setTerminalSeed = useOS((s) => s.setTerminalSeed);
  const accentWord = useScramble(profile.headlineAccent, { delay: 900, speed: 45 });
  const cordon = featured.find((p) => p.id === 'cordon');

  return (
    // The desktop layer never blocks the 3D scene — only its controls take pointer events.
    <div className="pointer-events-none fixed inset-0 z-10 pb-24 pt-9">
      <motion.section
        animate={{ opacity: anyOpen ? 0.12 : 1, filter: anyOpen ? 'blur(3px)' : 'blur(0px)' }}
        transition={{ duration: 0.5 }}
        className="relative isolate flex h-full flex-col justify-end px-6 pb-6 sm:px-10 md:justify-center md:pb-0 lg:pl-32"
      >
        {/* Mobile: the orb sits above the text, so a scrim keeps the copy legible against it. */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 -z-10 h-[72%] bg-gradient-to-t from-ink via-ink/85 to-transparent md:hidden"
        />
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease }}
          className="[text-shadow:0_1px_12px_rgba(5,6,10,.9)]"
        >
          {/* Phones get two short lines at normal tracking; wider screens keep the single mono line. */}
          <p className="sm:hidden">
            <span className="block text-[17px] font-semibold tracking-tight text-fg">{profile.name}</span>
            <span className="mt-0.5 block font-mono text-[12.5px] tracking-wide text-fg/85">
              Software Engineer <span className="text-fg-dim">·</span> {profile.location.split(',')[0]}
            </span>
          </p>
          <p className="hidden font-mono text-[12.5px] font-semibold uppercase tracking-[0.24em] text-fg sm:block">
            {profile.name} <span className="text-fg-dim">—</span> Software Engineer{' '}
            <span className="text-fg-dim">·</span> {profile.location.split(',')[0]}
          </p>
        </motion.div>
        <h1 className="mt-4 max-w-[13ch] font-serif text-[clamp(2.9rem,8.4vw,7.5rem)] leading-[0.9] tracking-[-0.02em] text-fg">
          {profile.headlineLines.map((l, i) => (
            <span key={l} className="block overflow-hidden pb-[0.06em]">
              <motion.span
                className="block"
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ delay: 0.45 + i * 0.12, duration: 0.9, ease }}
              >
                {l}
              </motion.span>
            </span>
          ))}
          <span className="block overflow-hidden pb-[0.06em]">
            <motion.span
              className="block italic text-phosphor [text-shadow:0_0_40px_rgba(200,255,77,.35)]"
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ delay: 0.69, duration: 0.9, ease }}
            >
              {accentWord}
            </motion.span>
          </span>
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="mt-6 max-w-lg text-[15px] leading-relaxed text-fg/80 sm:text-[15.5px] sm:text-fg-dim"
        >
          {profile.subhead}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.25, duration: 0.6, ease }}
          className="pointer-events-auto mt-8 flex flex-wrap gap-2"
        >
          <button onClick={() => open('projects')} className="btn-primary py-2.5">
            Open missions <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              setTerminalSeed('neofetch');
              open('terminal');
            }}
            className="btn py-2.5"
          >
            <SquareTerminal className="h-4 w-4" /> Boot terminal
          </button>
          <button onClick={() => open('about')} className="btn py-2.5">
            Who&apos;s this?
          </button>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="mt-6 hidden items-center gap-2 font-mono text-[11px] text-fg-faint md:flex"
        >
          <MousePointerClick className="h-3.5 w-3.5" /> each orbiting node is a system I built — click one · ⌘K to
          search
        </motion.p>
      </motion.section>

      {/* Desktop icons */}
      <motion.ul
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: anyOpen ? 0.35 : 1, x: 0 }}
        transition={{ delay: 0.6 }}
        className="absolute left-3 top-14 hidden flex-col gap-1 lg:flex"
      >
        {DOCK_ORDER.map((id) => {
          const m = APPS[id];
          const Icon = m.icon;
          return (
            <li key={id}>
              <button
                onClick={() => open(id)}
                className="pointer-events-auto group flex w-20 flex-col items-center gap-1.5 rounded-lg p-2 hover:bg-white/[0.05] focus-visible:bg-white/[0.08] focus-visible:outline-none"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.03] transition-colors group-hover:border-white/25">
                  <Icon className="h-5 w-5" style={{ color: m.tint[0] }} />
                </span>
                <span className="font-mono text-[10px] text-fg-dim group-hover:text-fg">{m.title}</span>
              </button>
            </li>
          );
        })}
      </motion.ul>

      {/* Widgets */}
      {cordon && (
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: anyOpen ? 0 : 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          onClick={() => useOS.getState().openProject('cordon')}
          className={cn(
            'glass pointer-events-auto absolute bottom-28 right-6 hidden w-64 rounded-2xl p-4 text-left xl:block',
            anyOpen && 'pointer-events-none'
          )}
        >
          <span className="label">now building</span>
          <p className="mt-1.5 text-[15px] text-fg">{cordon.name}</p>
          <p className="mt-0.5 text-[12px] leading-snug text-fg-dim">{cordon.kicker}</p>
          <div className="mt-3 flex gap-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  'h-1 flex-1 rounded-full',
                  i < 3 ? 'bg-phosphor' : i === 3 ? 'animate-pulse bg-amber-300/70' : 'bg-white/10'
                )}
              />
            ))}
          </div>
          <p className="mt-2 font-mono text-[10.5px] text-fg-faint">phase 3 / 6 · AgentDojo eval in flight</p>
        </motion.button>
      )}
    </div>
  );
}
