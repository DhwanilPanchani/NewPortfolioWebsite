'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Send } from 'lucide-react';
import { Github, Linkedin } from '../brand-icons';
import { profile, education, featured, secondary, archive } from '@/data/portfolio';
import { useOS } from '../store';
import { useElementWidth, useScramble } from '../hooks';
import { cn } from '@/lib/utils';

const FACTS = [
  { value: '3+', label: 'years shipping production systems' },
  { value: String(featured.length + secondary.length + archive.length), label: 'projects built' },
  { value: '5', label: 'enterprise clients at TechVizor' },
];

export default function About() {
  const [ref, width] = useElementWidth<HTMLDivElement>();
  const narrow = width > 0 && width < 700;
  const name = useScramble(profile.name, { delay: 150 });
  const { open } = useOS.getState();

  return (
    <div ref={ref} className={cn('grid gap-8 p-5 sm:p-8', narrow ? 'grid-cols-1' : 'grid-cols-[260px_1fr]')}>
      <div className={cn(narrow && 'mx-auto w-full max-w-[260px]')}>
        <Portrait />
        <div className="mt-4 space-y-2 font-mono text-[11.5px] text-fg-dim">
          <p className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-fg-faint" /> {profile.location}
          </p>
          <p className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulseDot rounded-full bg-phosphor" /> {profile.status}
          </p>
        </div>
        <div className="mt-4 flex gap-2">
          <a href={profile.links.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="btn px-2.5">
            <Github className="h-4 w-4" />
          </a>
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="btn px-2.5"
          >
            <Linkedin className="h-4 w-4" />
          </a>
          <button onClick={() => open('contact')} className="btn flex-1 justify-center">
            <Send className="h-4 w-4" /> Transmit
          </button>
        </div>
      </div>

      <div className="min-w-0">
        <span className="label">identity · verified</span>
        <h2 className="mt-2 font-serif text-[clamp(2.4rem,6vw,3.8rem)] italic leading-none tracking-tight text-fg">
          {name}
        </h2>
        <p className="mt-2 font-mono text-[12.5px] text-signal">{profile.role}</p>

        <p className="mt-6 font-serif text-[clamp(1.35rem,3vw,1.75rem)] leading-snug text-fg">{profile.headline}</p>
        <div className="mt-4 space-y-3 text-[14.5px] leading-relaxed text-fg-dim">
          {profile.thesis.map((t) => (
            <p key={t}>{t}</p>
          ))}
          <p>{profile.summary}</p>
        </div>

        <div className={cn('mt-6 grid gap-2', narrow ? 'grid-cols-1' : 'grid-cols-3')}>
          {FACTS.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.06 }}
              className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5"
            >
              <div className="font-mono text-2xl text-phosphor">{f.value}</div>
              <div className="mt-1 text-[11.5px] text-fg-dim">{f.label}</div>
            </motion.div>
          ))}
        </div>

        <h3 className="label mb-3 mt-8">education</h3>
        <ol className="space-y-3">
          {education.map((e) => (
            <li key={e.id} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <span className="text-[14px] font-medium text-fg">{e.degree}</span>
                <span className="font-mono text-[11px] text-fg-faint">
                  {e.start} — {e.end}
                </span>
              </div>
              <p className="mt-0.5 text-[13px] text-fg-dim">
                {e.school} · {e.location}
              </p>
              {e.courses.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1">
                  {e.courses.map((c) => (
                    <span key={c} className="chip text-[10px]">
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-wrap gap-2">
          <button onClick={() => open('projects')} className="btn-primary">
            Open missions <ArrowRight className="h-4 w-4" />
          </button>
          <button onClick={() => open('experience')} className="btn">
            Read the logs
          </button>
        </div>
      </div>
    </div>
  );
}

/** Portrait rendered as a hologram — scanlines, a sweeping scan bar, RGB split on hover. */
function Portrait() {
  return (
    <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-ink-800">
      <Image
        src="/images/profile.jpg"
        alt="Portrait of Dhwanil Panchani"
        fill
        sizes="260px"
        className="object-cover grayscale-[35%] transition-all duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
        priority
      />
      <Image
        src="/images/profile.jpg"
        alt=""
        aria-hidden
        fill
        sizes="260px"
        className="object-cover opacity-0 mix-blend-screen transition-all duration-300 group-hover:translate-x-[3px] group-hover:opacity-40"
        style={{ filter: 'sepia(1) saturate(6) hue-rotate(130deg)' }}
      />
      <div className="scanlines pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-x-0 h-1/3 animate-scan bg-gradient-to-b from-transparent via-signal/10 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
      <div className="absolute inset-x-3 bottom-3 flex items-center justify-between font-mono text-[10px] text-fg-dim">
        <span>ID · DP-2026</span>
        <span className="text-phosphor">● match</span>
      </div>
      {/* Corner brackets */}
      {[
        'left-2 top-2 border-l border-t',
        'right-2 top-2 border-r border-t',
        'left-2 bottom-2 border-l border-b',
        'right-2 bottom-2 border-r border-b',
      ].map((c) => (
        <span key={c} className={cn('pointer-events-none absolute h-3 w-3 border-phosphor/70', c)} />
      ))}
    </div>
  );
}
