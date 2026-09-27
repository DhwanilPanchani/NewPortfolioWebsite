'use client';

import { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence, useReducedMotion } from 'framer-motion';
import { featured, secondary, archive } from '@/data/portfolio';
import { useOS } from './store';
import { isAppId, type AppId } from './registry';
import Window from './Window';
import MenuBar from './MenuBar';
import Dock from './Dock';
import Desktop from './Desktop';
import Spotlight from './Spotlight';
import Boot from './Boot';
import About from './apps/About';
import Projects from './apps/Projects';
import Experience from './apps/Experience';
import Skills from './apps/Skills';
import Terminal from './apps/Terminal';
import Contact from './apps/Contact';
import Resume from './apps/Resume';

const SpaceScene = dynamic(() => import('./scene/SpaceScene'), { ssr: false });

const VIEWS: Record<AppId, () => React.ReactElement> = {
  about: About,
  projects: Projects,
  experience: Experience,
  skills: Skills,
  terminal: Terminal,
  contact: Contact,
  resume: Resume,
};

const PROJECT_IDS = new Set([...featured, ...secondary, ...archive].map((p) => p.id));

export default function OS() {
  const windows = useOS((s) => s.windows);
  const focused = useOS((s) => s.focused);
  const project = useOS((s) => s.project);
  const booted = useOS((s) => s.booted);
  const reduced = !!useReducedMotion();
  const [showBoot, setShowBoot] = useState<boolean | null>(null);

  // Boot once per session; reduced-motion users go straight to the desktop.
  useEffect(() => {
    const seen = sessionStorage.getItem('os:booted');
    setShowBoot(!seen && !reduced);
    if (seen || reduced) useOS.getState().setBooted();
  }, [reduced]);

  const finishBoot = useCallback(() => {
    sessionStorage.setItem('os:booted', '1');
    setShowBoot(false);
    useOS.getState().setBooted();
  }, []);

  // Deep links: /?open=projects&p=vantage
  useEffect(() => {
    if (!booted) return;
    const params = new URLSearchParams(window.location.search);
    const app = params.get('open');
    const p = params.get('p');
    if (p && PROJECT_IDS.has(p)) useOS.getState().openProject(p);
    else if (isAppId(app)) useOS.getState().open(app);
  }, [booted]);

  // Keep the URL shareable as the user moves around.
  useEffect(() => {
    if (!booted) return;
    const url = new URL(window.location.href);
    url.search = '';
    if (focused) url.searchParams.set('open', focused);
    if (focused === 'projects') url.searchParams.set('p', project);
    window.history.replaceState(null, '', url);
  }, [focused, project, booted]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const os = useOS.getState();
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        os.setSpotlight(!os.spotlight);
      } else if (e.key === 'Escape' && os.spotlight) {
        os.setSpotlight(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="grain fixed inset-0 overflow-hidden bg-ink text-fg">
      <SpaceScene reducedMotion={reduced} />

      {booted && (
        <>
          <Desktop />
          <AnimatePresence>
            {Object.values(windows).map((w) => {
              if (!w) return null;
              const View = VIEWS[w.id];
              return (
                <Window key={w.id} win={w}>
                  <View />
                </Window>
              );
            })}
          </AnimatePresence>
          <MenuBar />
          <Dock />
          <Spotlight />
        </>
      )}

      <AnimatePresence>{showBoot && <Boot onDone={finishBoot} />}</AnimatePresence>
    </div>
  );
}
