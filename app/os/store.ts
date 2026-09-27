import { create } from 'zustand';
import { APPS, type AppId } from './registry';

export type Win = {
  id: AppId;
  z: number;
  minimized: boolean;
  maximized: boolean;
  x: number;
  y: number;
  w: number;
  h: number;
};

type Viewport = { w: number; h: number };

type OSState = {
  booted: boolean;
  windows: Partial<Record<AppId, Win>>;
  focused: AppId | null;
  zTop: number;
  project: string; // selected project in Missions
  spotlight: boolean;
  terminalSeed: string | null; // command to run when terminal opens
  contactDraft: string;

  setBooted: () => void;
  open: (id: AppId, vp?: Viewport) => void;
  close: (id: AppId) => void;
  focus: (id: AppId) => void;
  minimize: (id: AppId) => void;
  toggleMax: (id: AppId) => void;
  move: (id: AppId, x: number, y: number) => void;
  resize: (id: AppId, w: number, h: number) => void;
  openProject: (projectId: string, vp?: Viewport) => void;
  setSpotlight: (v: boolean) => void;
  setTerminalSeed: (cmd: string | null) => void;
  setContactDraft: (s: string) => void;
};

export const MENUBAR_H = 36;
export const DOCK_SPACE = 96;

function viewport(): Viewport {
  if (typeof window === 'undefined') return { w: 1440, h: 900 };
  return { w: window.innerWidth, h: window.innerHeight };
}

/** Place a new window: centered, cascaded by how many windows are already open, clamped to screen. */
export function placeWindow(id: AppId, openCount: number, vp: Viewport) {
  const { size } = APPS[id];
  const usableH = vp.h - MENUBAR_H - DOCK_SPACE;
  const w = Math.min(size.w, vp.w - 48);
  const h = Math.min(size.h, usableH - 16);
  const offset = (openCount % 5) * 28;
  const x = Math.max(16, Math.round((vp.w - w) / 2 - 60 + offset));
  const y = Math.max(MENUBAR_H + 8, Math.round(MENUBAR_H + (usableH - h) / 2 - 20 + offset));
  return { x: Math.min(x, vp.w - w - 16), y, w, h };
}

export const useOS = create<OSState>((set, get) => ({
  booted: false,
  windows: {},
  focused: null,
  zTop: 10,
  project: 'vantage',
  spotlight: false,
  terminalSeed: null,
  contactDraft: '',

  setBooted: () => set({ booted: true }),

  open: (id, vp = viewport()) => {
    const { windows, zTop } = get();
    const existing = windows[id];
    const z = zTop + 1;
    if (existing) {
      set({ windows: { ...windows, [id]: { ...existing, minimized: false, z } }, focused: id, zTop: z });
      return;
    }
    const openCount = Object.keys(windows).length;
    const rect = placeWindow(id, openCount, vp);
    set({
      windows: { ...windows, [id]: { id, z, minimized: false, maximized: false, ...rect } },
      focused: id,
      zTop: z,
    });
  },

  close: (id) => {
    const windows = { ...get().windows };
    delete windows[id];
    set({ windows, focused: topmost(windows) });
  },

  focus: (id) => {
    const { windows, zTop, focused } = get();
    const w = windows[id];
    if (!w || (focused === id && w.z === zTop)) return;
    const z = zTop + 1;
    set({ windows: { ...windows, [id]: { ...w, z } }, focused: id, zTop: z });
  },

  minimize: (id) => {
    const { windows } = get();
    const w = windows[id];
    if (!w) return;
    const next = { ...windows, [id]: { ...w, minimized: true } };
    set({ windows: next, focused: topmost(next) });
  },

  toggleMax: (id) => {
    const { windows } = get();
    const w = windows[id];
    if (!w) return;
    set({ windows: { ...windows, [id]: { ...w, maximized: !w.maximized } } });
  },

  move: (id, x, y) => {
    const { windows } = get();
    const w = windows[id];
    if (!w) return;
    set({ windows: { ...windows, [id]: { ...w, x, y } } });
  },

  resize: (id, width, height) => {
    const { windows } = get();
    const w = windows[id];
    if (!w) return;
    set({ windows: { ...windows, [id]: { ...w, w: Math.max(420, width), h: Math.max(300, height) } } });
  },

  openProject: (projectId, vp) => {
    set({ project: projectId });
    get().open('projects', vp);
  },

  setSpotlight: (v) => set({ spotlight: v }),
  setTerminalSeed: (cmd) => set({ terminalSeed: cmd }),
  setContactDraft: (s) => set({ contactDraft: s }),
}));

function topmost(windows: Partial<Record<AppId, Win>>): AppId | null {
  let best: Win | null = null;
  for (const w of Object.values(windows)) {
    if (w && !w.minimized && (!best || w.z > best.z)) best = w;
  }
  return best?.id ?? null;
}
