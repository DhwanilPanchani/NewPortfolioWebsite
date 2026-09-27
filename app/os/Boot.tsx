'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { featured, secondary, archive, experience } from '@/data/portfolio';
import { Logo } from './MenuBar';

const LINES: [string, string][] = [
  ['ok', 'dhwanil/os 26.9 — kernel: human-in-the-loop'],
  ['ok', `mounting /experience ............ ${experience.length} roles`],
  ['ok', `loading flagship systems ........ ${featured.length}`],
  ['ok', `indexing lab + archive .......... ${secondary.length + archive.length}`],
  ['ok', 'calibrating trust boundary ...... sealed'],
  ['warn', 'CORDON still compiling — phase 3/6'],
  ['ok', 'rendering spatial desktop'],
];

export default function Boot({ onDone }: { onDone: () => void }) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (n < LINES.length) {
      const t = setTimeout(() => setN(n + 1), n === 0 ? 350 : 190 + Math.random() * 140);
      return () => clearTimeout(t);
    }
    const t = setTimeout(onDone, 550);
    return () => clearTimeout(t);
  }, [n, onDone]);

  useEffect(() => {
    const skip = () => onDone();
    window.addEventListener('keydown', skip);
    return () => window.removeEventListener('keydown', skip);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-ink"
      exit={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onClick={onDone}
    >
      <div className="scanlines pointer-events-none absolute inset-0 opacity-60" />
      <div className="w-full max-w-lg px-6 font-mono text-[12.5px]">
        <div className="mb-6 flex items-center gap-3 text-fg">
          <Logo size={22} />
          <span className="tracking-[0.3em]">DHWANIL/OS</span>
        </div>
        <ul className="space-y-1.5">
          {LINES.slice(0, n).map(([lvl, text]) => (
            <motion.li key={text} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3">
              <span className={lvl === 'ok' ? 'text-phosphor' : 'text-amber-300'}>
                [{lvl === 'ok' ? ' ok ' : 'warn'}]
              </span>
              <span className="text-fg-dim">{text}</span>
            </motion.li>
          ))}
        </ul>
        <div className="mt-6 h-px w-full overflow-hidden bg-white/10">
          <motion.div
            className="h-full bg-phosphor"
            animate={{ width: `${(n / LINES.length) * 100}%` }}
            transition={{ ease: 'easeOut' }}
          />
        </div>
        <p className="mt-3 text-[10.5px] text-fg-faint">press any key to skip</p>
      </div>
    </motion.div>
  );
}
