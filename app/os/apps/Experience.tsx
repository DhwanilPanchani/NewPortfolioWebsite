'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { experience, education } from '@/data/portfolio';
import { cn } from '@/lib/utils';

/** Deterministic 7-char "commit hash" so entries look like a real log and never change between renders. */
export function shortHash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return (h >>> 0).toString(16).padStart(8, '0').slice(0, 7);
}

type Entry =
  | { kind: 'role'; id: string; start: string; end: string; data: (typeof experience)[number] }
  | { kind: 'edu'; id: string; start: string; end: string; data: (typeof education)[number] };

const ENTRIES: Entry[] = [
  { kind: 'role', id: experience[0].id, start: experience[0].start, end: experience[0].end, data: experience[0] },
  { kind: 'edu', id: education[0].id, start: education[0].start, end: education[0].end, data: education[0] },
  { kind: 'role', id: experience[1].id, start: experience[1].start, end: experience[1].end, data: experience[1] },
  { kind: 'edu', id: education[1].id, start: education[1].start, end: education[1].end, data: education[1] },
];

export default function Experience() {
  const [open, setOpen] = useState<Record<string, boolean>>({ ipserlab: true, techvizor: true });

  return (
    <div className="p-5 font-mono sm:p-7">
      <p className="text-[11.5px] text-fg-faint">
        <span className="text-phosphor">$</span> git log --career --graph --decorate
      </p>

      <ol className="relative mt-5">
        {/* Main branch rail */}
        <span
          aria-hidden
          className="absolute bottom-3 left-[7px] top-3 w-px bg-gradient-to-b from-phosphor/70 via-white/15 to-white/5"
        />

        {ENTRIES.map((e, i) => {
          const isOpen = !!open[e.id];
          const isRole = e.kind === 'role';
          return (
            <motion.li
              key={e.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="relative pb-7 pl-8 last:pb-0"
            >
              <span
                aria-hidden
                className={cn(
                  'absolute left-0 top-1 grid h-[15px] w-[15px] place-items-center rounded-full border-2',
                  isRole ? 'border-phosphor bg-ink' : 'border-signal/70 bg-ink'
                )}
              >
                {i === 0 && <span className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-phosphor" />}
              </span>

              <button
                onClick={() => setOpen((o) => ({ ...o, [e.id]: !o[e.id] }))}
                aria-expanded={isOpen}
                className="group w-full text-left"
              >
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11.5px]">
                  <span className="text-amber-300/90">commit {shortHash(e.id)}</span>
                  {i === 0 && (
                    <span className="rounded border border-phosphor/40 px-1.5 text-[10px] text-phosphor">HEAD</span>
                  )}
                  <span
                    className={cn(
                      'rounded border px-1.5 text-[10px]',
                      isRole ? 'border-white/15 text-fg-dim' : 'border-signal/30 text-signal/90'
                    )}
                  >
                    {isRole ? 'work' : 'edu'}
                  </span>
                  <span className="ml-auto text-fg-faint">
                    {e.start} → {e.end}
                  </span>
                </div>
                <div className="mt-1.5 flex items-center gap-2 font-sans">
                  <ChevronRight
                    className={cn('h-4 w-4 shrink-0 text-fg-faint transition-transform', isOpen && 'rotate-90 text-fg')}
                  />
                  <span className="text-[16px] font-medium text-fg">{isRole ? e.data.title : e.data.degree}</span>
                  <span className="text-[14px] text-fg-dim">@ {isRole ? e.data.company : e.data.school}</span>
                </div>
                <p className="ml-6 mt-0.5 text-[11px] text-fg-faint">{e.data.location}</p>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="ml-6 pt-3 font-sans">
                      {isRole ? <RoleBody role={e.data} /> : <EduBody edu={e.data} />}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}

function RoleBody({ role }: { role: (typeof experience)[number] }) {
  const clients = role.bullets.filter((b) => b.label);
  const plain = role.bullets.filter((b) => !b.label);
  return (
    <>
      {role.summary && <p className="mb-3 text-[13.5px] leading-relaxed text-fg-dim">{role.summary}</p>}
      {plain.length > 0 && (
        <ul className="space-y-2">
          {plain.map((b) => (
            <li key={b.text} className="flex gap-2.5 text-[13.5px] leading-relaxed text-fg">
              <span className="mt-[9px] h-1 w-2 shrink-0 bg-phosphor/70" />
              {b.text}
            </li>
          ))}
        </ul>
      )}
      {clients.length > 0 && (
        <div className="relative mt-1 space-y-3 border-l border-dashed border-white/15 pl-4">
          {clients.map((b) => (
            <div key={b.label} className="relative">
              <span
                aria-hidden
                className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border border-white/30 bg-ink"
              />
              <p className="font-mono text-[11px] text-signal">merge branch &apos;{b.label}&apos;</p>
              <p className="mt-1 text-[13.5px] leading-relaxed text-fg">{b.text}</p>
            </div>
          ))}
        </div>
      )}
      <div className="mt-3 flex flex-wrap gap-1">
        {role.stack.map((s) => (
          <span key={s} className="chip text-[10px]">
            {s}
          </span>
        ))}
      </div>
    </>
  );
}

function EduBody({ edu }: { edu: (typeof education)[number] }) {
  if (!edu.courses.length) return null;
  return (
    <div className="flex flex-wrap gap-1">
      {edu.courses.map((c) => (
        <span key={c} className="chip text-[10px]">
          {c}
        </span>
      ))}
    </div>
  );
}
