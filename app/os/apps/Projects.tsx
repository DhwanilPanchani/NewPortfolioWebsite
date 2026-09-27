'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Radio } from 'lucide-react';
import { Github } from '../brand-icons';
import { featured, secondary, archive, type MiniProject, type Project } from '@/data/portfolio';
import { useOS } from '../store';
import { useElementWidth, useScramble } from '../hooks';
import Pipeline from './Pipeline';
import { cn } from '@/lib/utils';

type Tab = 'flagship' | 'lab' | 'archive';

export function tabFor(id: string): Tab {
  if (featured.some((p) => p.id === id)) return 'flagship';
  if (secondary.some((p) => p.id === id)) return 'lab';
  return 'archive';
}

export default function Projects() {
  const project = useOS((s) => s.project);
  const setProject = (id: string) => useOS.setState({ project: id });
  const [tab, setTab] = useState<Tab>(() => tabFor(project));
  const [ref, width] = useElementWidth<HTMLDivElement>();
  const narrow = width > 0 && width < 760;
  const current = featured.find((p) => p.id === project) ?? featured[0];

  // Opening a lab/archive project from spotlight or terminal should land on its tab.
  const [lastProject, setLastProject] = useState(project);
  if (project !== lastProject) {
    setLastProject(project);
    setTab(tabFor(project));
  }

  return (
    <div ref={ref} className={cn('flex h-full', narrow ? 'flex-col' : 'flex-row')}>
      <nav
        aria-label="Projects"
        className={cn(
          'shrink-0 border-white/[0.06]',
          narrow
            ? 'os-scroll flex gap-1 overflow-x-auto border-b px-3 py-2'
            : 'os-scroll w-60 overflow-y-auto border-r p-3'
        )}
      >
        <TabGroup
          label="Flagship"
          count={featured.length}
          active={tab === 'flagship'}
          onClick={() => setTab('flagship')}
          narrow={narrow}
        >
          {!narrow &&
            featured.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setTab('flagship');
                  setProject(p.id);
                }}
                className={cn(
                  'group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors',
                  tab === 'flagship' && p.id === current.id ? 'bg-white/[0.07]' : 'hover:bg-white/[0.04]'
                )}
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ background: `hsl(${p.hue} 95% 62%)`, boxShadow: `0 0 10px hsl(${p.hue} 95% 62%)` }}
                />
                <span className="min-w-0">
                  <span className="block truncate text-[13px] text-fg">{p.name}</span>
                  <span className="block truncate font-mono text-[10.5px] text-fg-faint">{p.domain}</span>
                </span>
              </button>
            ))}
        </TabGroup>
        <TabGroup
          label="Lab"
          count={secondary.length}
          active={tab === 'lab'}
          onClick={() => setTab('lab')}
          narrow={narrow}
        />
        <TabGroup
          label="Archive"
          count={archive.length}
          active={tab === 'archive'}
          onClick={() => setTab('archive')}
          narrow={narrow}
        />
      </nav>

      <div className="os-scroll min-w-0 flex-1 overflow-y-auto">
        {tab === 'flagship' && narrow && (
          <div className="os-scroll flex gap-1.5 overflow-x-auto px-4 pt-4">
            {featured.map((p) => (
              <button
                key={p.id}
                onClick={() => setProject(p.id)}
                className={cn('chip shrink-0 gap-1.5', p.id === current.id && 'border-white/25 text-fg')}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: `hsl(${p.hue} 95% 62%)` }} />
                {p.name}
              </button>
            ))}
          </div>
        )}
        <AnimatePresence mode="wait">
          {tab === 'flagship' ? (
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
              transition={{ duration: 0.28 }}
            >
              <CaseFile p={current} narrow={narrow} />
            </motion.div>
          ) : (
            <motion.div
              key={tab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-5 sm:p-7"
            >
              <Grid items={tab === 'lab' ? secondary : archive} tab={tab} highlight={project} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function TabGroup({
  label,
  count,
  active,
  onClick,
  narrow,
  children,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  narrow: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className={narrow ? 'shrink-0' : 'mb-3'}>
      <button
        onClick={onClick}
        className={cn(
          'flex w-full items-center justify-between rounded-md px-2.5 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.16em] transition-colors',
          active ? 'text-fg' : 'text-fg-faint hover:text-fg-dim',
          narrow && active && 'bg-white/[0.07]'
        )}
      >
        {label}
        <span className="ml-3 text-fg-faint">{count}</span>
      </button>
      {children && <div className="mt-1 space-y-0.5">{children}</div>}
    </div>
  );
}

function CaseFile({ p, narrow }: { p: Project; narrow: boolean }) {
  const title = useScramble(p.name, { speed: 22 });
  const color = `hsl(${p.hue} 95% 64%)`;
  return (
    <article className="relative p-5 sm:p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full opacity-30 blur-3xl"
        style={{ background: `radial-gradient(circle, ${color}, transparent 70%)` }}
      />
      <div className="relative">
        <div className="flex flex-wrap items-center gap-2">
          <span className="label" style={{ color }}>
            {p.kicker}
          </span>
        </div>
        <h2 className="mt-2 font-serif text-[clamp(2.4rem,6vw,4.2rem)] italic leading-[0.95] tracking-tight text-fg">
          {title}
        </h2>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className={cn('chip gap-1.5', p.status === 'In progress' && 'border-amber-300/30 text-amber-200')}>
            <Radio className="h-3 w-3" />
            {p.status}
          </span>
          <span className="chip">{p.domain}</span>
          <span className="chip">{p.year}</span>
        </div>
        <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-fg">{p.tagline}</p>

        <div className="mt-6">
          <Pipeline stages={p.pipeline} hue={p.hue} vertical={narrow} />
        </div>

        <div className={cn('mt-6 grid gap-2', narrow ? 'grid-cols-2' : 'grid-cols-3')}>
          {p.metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + i * 0.05 }}
              className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5"
            >
              <div
                className="font-mono text-[clamp(1.05rem,2.2vw,1.35rem)] font-medium tracking-tight"
                style={{ color }}
              >
                {m.value}
              </div>
              <div className="mt-1 text-[11.5px] leading-snug text-fg-dim">{m.label}</div>
            </motion.div>
          ))}
        </div>

        <div className={cn('mt-7 grid gap-6', narrow ? 'grid-cols-1' : 'grid-cols-2')}>
          <section>
            <h3 className="label mb-2">the problem</h3>
            <p className="text-[14px] leading-relaxed text-fg-dim">{p.problem}</p>
          </section>
          <section>
            <h3 className="label mb-2">what I built</h3>
            <p className="text-[14px] leading-relaxed text-fg-dim">{p.build}</p>
          </section>
        </div>

        <div className="mt-7">
          <h3 className="label mb-2">stack</h3>
          <div className="flex flex-wrap gap-1.5">
            {p.stack.map((s) => (
              <span key={s} className="chip">
                {s}
              </span>
            ))}
          </div>
        </div>

        {(p.github || p.live) && (
          <div className="mt-7 flex flex-wrap gap-2">
            {p.github && (
              <a href={p.github} target="_blank" rel="noreferrer" className="btn">
                <Github className="h-4 w-4" /> Source
              </a>
            )}
            {p.live && (
              <a href={p.live} target="_blank" rel="noreferrer" className="btn-primary">
                Live <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

function Grid({ items, tab, highlight }: { items: MiniProject[]; tab: Tab; highlight: string }) {
  return (
    <>
      <p className="mb-4 max-w-xl text-[13.5px] text-fg-dim">
        {tab === 'lab'
          ? 'Smaller systems and research builds — edge inference, HPC, agents, and tooling.'
          : 'Earlier work — ML, data, and full-stack projects from grad school and before.'}
      </p>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-2.5">
        {items.map((p, i) => (
          <motion.a
            key={p.id}
            href={p.live ?? p.github}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            whileHover={{ y: -3, rotateX: 4, rotateY: -4 }}
            style={{ transformPerspective: 800 }}
            className={cn(
              'group flex flex-col rounded-xl border bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.05]',
              p.id === highlight ? 'border-phosphor/50' : 'border-white/[0.07] hover:border-white/15'
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-[14px] font-medium text-fg">{p.name}</h4>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-fg-faint transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-phosphor" />
            </div>
            <p className="mt-1.5 flex-1 text-[12.5px] leading-relaxed text-fg-dim">{p.blurb}</p>
            <p className="mt-3 font-mono text-[11px] text-phosphor/90">{p.metric}</p>
            <div className="mt-2.5 flex flex-wrap gap-1">
              {p.stack.slice(0, 4).map((s) => (
                <span key={s} className="chip text-[10px]">
                  {s}
                </span>
              ))}
            </div>
          </motion.a>
        ))}
      </div>
    </>
  );
}
