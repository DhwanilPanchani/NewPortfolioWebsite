'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, CornerDownLeft, FolderGit2, Copy, Download } from 'lucide-react';
import { Github, Linkedin } from './brand-icons';
import { featured, secondary, archive, profile } from '@/data/portfolio';
import { APPS, DOCK_ORDER } from './registry';
import { useOS } from './store';
import { cn } from '@/lib/utils';

type Item = {
  id: string;
  title: string;
  hint: string;
  group: string;
  icon: React.ComponentType<{ className?: string }>;
  run: () => void;
  keywords?: string;
};

function useItems(): Item[] {
  return useMemo(() => {
    const os = () => useOS.getState();
    const apps: Item[] = DOCK_ORDER.map((id) => ({
      id: `app:${id}`,
      title: APPS[id].title,
      hint: APPS[id].file,
      group: 'Apps',
      icon: APPS[id].icon,
      run: () => os().open(id),
    }));
    const projects: Item[] = [...featured, ...secondary, ...archive].map((p) => ({
      id: `p:${p.id}`,
      title: p.name,
      hint: 'kicker' in p ? p.kicker : p.blurb,
      group: 'Projects',
      icon: FolderGit2,
      keywords: p.stack.join(' '),
      run: () => os().openProject(p.id),
    }));
    const actions: Item[] = [
      {
        id: 'a:copy',
        title: 'Copy email address',
        hint: profile.email,
        group: 'Actions',
        icon: Copy,
        run: () => navigator.clipboard.writeText(profile.email),
      },
      {
        id: 'a:resume',
        title: 'Download résumé',
        hint: 'resume.pdf',
        group: 'Actions',
        icon: Download,
        run: () => {
          const a = document.createElement('a');
          a.href = profile.links.resume;
          a.download = 'Dhwanil_Panchani_Resume.pdf';
          a.click();
        },
      },
      {
        id: 'a:gh',
        title: 'GitHub',
        hint: profile.links.github,
        group: 'Actions',
        icon: Github,
        run: () => window.open(profile.links.github, '_blank'),
      },
      {
        id: 'a:li',
        title: 'LinkedIn',
        hint: profile.links.linkedin,
        group: 'Actions',
        icon: Linkedin,
        run: () => window.open(profile.links.linkedin, '_blank'),
      },
    ];
    return [...apps, ...projects, ...actions];
  }, []);
}

export default function Spotlight() {
  const openState = useOS((s) => s.spotlight);
  const setSpotlight = useOS((s) => s.setSpotlight);
  const items = useItems();
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const k = q.trim().toLowerCase();
    if (!k) return items.filter((i) => i.group !== 'Projects' || featured.some((f) => `p:${f.id}` === i.id));
    return items.filter((i) => `${i.title} ${i.hint} ${i.keywords ?? ''}`.toLowerCase().includes(k));
  }, [q, items]);

  useEffect(() => {
    if (openState) {
      setQ('');
      setSel(0);
      setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [openState]);

  useEffect(() => setSel(0), [q]);

  function choose(item?: Item) {
    if (!item) return;
    setSpotlight(false);
    item.run();
  }

  function onKey(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSel((s) => Math.min(s + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSel((s) => Math.max(s - 1, 0));
    } else if (e.key === 'Enter') {
      choose(results[sel]);
    }
  }

  let lastGroup = '';
  return (
    <AnimatePresence>
      {openState && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-start justify-center bg-ink/50 px-4 pt-[14vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={() => setSpotlight(false)}
        >
          <motion.div
            role="dialog"
            aria-label="Search"
            initial={{ y: -12, scale: 0.97, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: -8, scale: 0.98, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            onMouseDown={(e) => e.stopPropagation()}
            className="glass w-full max-w-xl overflow-hidden rounded-2xl"
          >
            <div className="flex items-center gap-3 border-b border-white/[0.07] px-4">
              <Search className="h-4 w-4 text-fg-faint" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={onKey}
                placeholder="Search apps, projects, tech… (try “neo4j”)"
                aria-label="Search"
                className="h-14 flex-1 bg-transparent text-[15px] text-fg placeholder:text-fg-faint outline-none"
              />
              <kbd className="rounded border border-white/10 px-1.5 font-mono text-[10px] text-fg-faint">esc</kbd>
            </div>
            <ul className="os-scroll max-h-[50vh] overflow-y-auto p-2" role="listbox">
              {results.length === 0 && (
                <li className="px-3 py-6 text-center font-mono text-[12px] text-fg-faint">no matches</li>
              )}
              {results.map((r, i) => {
                const header = r.group !== lastGroup ? r.group : null;
                lastGroup = r.group;
                const Icon = r.icon;
                return (
                  <li key={r.id}>
                    {header && <p className="label px-3 pb-1 pt-2">{header}</p>}
                    <button
                      role="option"
                      aria-selected={i === sel}
                      onMouseEnter={() => setSel(i)}
                      onClick={() => choose(r)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left',
                        i === sel && 'bg-white/[0.07]'
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0 text-fg-dim" />
                      <span className="shrink-0 text-[13.5px] text-fg">{r.title}</span>
                      <span className="truncate font-mono text-[11px] text-fg-faint">{r.hint}</span>
                      {i === sel && <CornerDownLeft className="ml-auto h-3.5 w-3.5 shrink-0 text-fg-faint" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
