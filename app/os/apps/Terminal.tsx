'use client';

import { useEffect, useRef, useState } from 'react';
import { profile } from '@/data/portfolio';
import { useOS } from '../store';
import { run, completions, type Line } from '../terminal-commands';
import { cn } from '@/lib/utils';

const MOTD: Line[] = [
  { kind: 'accent', text: `dhwanil/os — last login: ${new Date().toDateString()}` },
  { kind: 'dim', text: 'type `help` to list commands, or try `open vantage`' },
];

export default function Terminal() {
  const [lines, setLines] = useState<(Line | { kind: 'cmd'; text: string })[]>(MOTD);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const seed = useOS((s) => s.terminalSeed);

  function exec(cmd: string) {
    const { lines: outLines, effects } = run(cmd);
    const os = useOS.getState();
    let cleared = false;
    for (const e of effects) {
      if (e.type === 'clear') cleared = true;
      if (e.type === 'open') os.open(e.app);
      if (e.type === 'project') os.openProject(e.id);
      if (e.type === 'download') {
        const a = document.createElement('a');
        a.href = profile.links.resume;
        a.download = 'Dhwanil_Panchani_Resume.pdf';
        a.click();
      }
      if (e.type === 'hire') {
        os.setContactDraft("Hi Dhwanil — I found your portfolio and I'd love to talk about a role on our team.");
        setTimeout(() => os.open('contact'), 700);
      }
    }
    setLines((prev) => (cleared ? [] : [...prev, { kind: 'cmd', text: cmd }, ...outLines]));
    if (cmd.trim()) setHistory((h) => [cmd, ...h].slice(0, 50));
    setCursor(-1);
  }

  useEffect(() => {
    if (!seed) return;
    exec(seed);
    useOS.getState().setTerminalSeed(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [lines]);

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      exec(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(cursor + 1, history.length - 1);
      if (history[next] !== undefined) {
        setCursor(next);
        setInput(history[next]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = cursor - 1;
      setCursor(Math.max(next, -1));
      setInput(next < 0 ? '' : history[next]);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const c = completions(input);
      if (c.length === 1) setInput(c[0] + ' ');
      else if (c.length > 1)
        setLines((prev) => [...prev, { kind: 'cmd', text: input }, { kind: 'dim', text: c.join('   ') }]);
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  }

  return (
    <div
      className="min-h-full bg-black/40 p-4 font-mono text-[12.5px] leading-relaxed"
      onClick={() => inputRef.current?.focus()}
    >
      {lines.map((l, i) =>
        l.kind === 'cmd' ? (
          <p key={i} className="text-fg">
            <Prompt /> {l.text}
          </p>
        ) : (
          <p
            key={i}
            className={cn('whitespace-pre-wrap break-words', {
              'text-fg': l.kind === 'out',
              'text-flare': l.kind === 'err',
              'text-phosphor': l.kind === 'accent',
              'text-fg-faint': l.kind === 'dim',
            })}
          >
            {l.text}
          </p>
        )
      )}
      <div ref={endRef} className="flex items-center text-fg">
        <Prompt />
        <label htmlFor="term-input" className="sr-only">
          Terminal input
        </label>
        <input
          id="term-input"
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          autoFocus
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          className="ml-2 flex-1 bg-transparent text-fg caret-phosphor outline-none"
        />
      </div>
    </div>
  );
}

function Prompt() {
  return (
    <span className="shrink-0">
      <span className="text-phosphor">dhwanil</span>
      <span className="text-fg-faint">@</span>
      <span className="text-signal">os</span>
      <span className="text-fg-faint"> ~ %</span>
    </span>
  );
}
