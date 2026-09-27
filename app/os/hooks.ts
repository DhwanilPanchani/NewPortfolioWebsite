'use client';

import { useEffect, useRef, useState } from 'react';

export function useMediaQuery(query: string) {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return match;
}

export const useIsMobile = () => useMediaQuery('(max-width: 767px)');

/** Width of an element — windows are resizable, so layouts respond to the window, not the viewport. */
export function useElementWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

const GLYPHS = '!<>-_\\/[]{}—=+*^?#01';

/** Decodes text from random glyphs into the final string — used for headings and labels. */
export function useScramble(text: string, { delay = 0, speed = 28 } = {}) {
  const [out, setOut] = useState(text);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setOut(text);
      return;
    }
    let frame = 0;
    let raf = 0;
    const start = performance.now() + delay;
    const tick = (now: number) => {
      if (now < start) {
        raf = requestAnimationFrame(tick);
        return;
      }
      frame = Math.floor((now - start) / speed);
      const revealed = Math.min(text.length, Math.floor(frame / 1.6));
      let s = '';
      for (let i = 0; i < text.length; i++) {
        if (i < revealed || text[i] === ' ') s += text[i];
        else s += GLYPHS[(i * 7 + frame) % GLYPHS.length];
      }
      setOut(s);
      if (revealed < text.length) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, delay, speed]);
  return out;
}
