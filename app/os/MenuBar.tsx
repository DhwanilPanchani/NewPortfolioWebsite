'use client';

import { useEffect, useState } from 'react';
import { Command } from 'lucide-react';
import { profile } from '@/data/portfolio';
import { APPS } from './registry';
import { useOS, MENUBAR_H } from './store';

function useBostonClock() {
  const [now, setNow] = useState<string>('');
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      weekday: 'short',
      hour: 'numeric',
      minute: '2-digit',
    });
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const t = setInterval(tick, 15_000);
    return () => clearInterval(t);
  }, []);
  return now;
}

export default function MenuBar() {
  const focused = useOS((s) => s.focused);
  const setSpotlight = useOS((s) => s.setSpotlight);
  const open = useOS((s) => s.open);
  const clock = useBostonClock();

  return (
    <header
      className="fixed inset-x-0 top-0 z-[60] flex items-center gap-4 border-b border-white/[0.06] bg-ink/55 px-3 font-mono text-[11.5px] text-fg-dim backdrop-blur-xl sm:px-4"
      style={{ height: MENUBAR_H }}
    >
      <button
        onClick={() => open('about')}
        className="flex items-center gap-2 text-fg hover:text-phosphor"
        aria-label="Open Identity"
      >
        <Logo />
        <span className="hidden sm:inline">dhwanil/os</span>
      </button>
      <span className="truncate text-fg">{focused ? APPS[focused].title : 'Desktop'}</span>

      <div className="ml-auto flex items-center gap-3 sm:gap-4">
        <span className="hidden items-center gap-2 md:flex">
          <span className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-phosphor" />
          {profile.status}
        </span>
        <span className="hidden lg:inline">{profile.location}</span>
        <button
          onClick={() => setSpotlight(true)}
          className="flex items-center gap-1 rounded-md border border-white/10 px-1.5 py-0.5 text-fg-dim hover:border-white/25 hover:text-fg"
          aria-label="Open search (Command K)"
        >
          <Command className="h-3 w-3" />K
        </button>
        <span className="tabular-nums text-fg" suppressHydrationWarning>
          {clock}
        </span>
      </div>
    </header>
  );
}

export function Logo({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden>
      <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8 1.5a6.5 6.5 0 0 1 0 13z" fill="#C8FF4D" />
      <circle cx="8" cy="8" r="1.6" fill="#05060A" />
    </svg>
  );
}
