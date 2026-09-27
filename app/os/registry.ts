import type { LucideIcon } from 'lucide-react';
import { Fingerprint, Orbit, GitCommitVertical, Activity, SquareTerminal, Send, FileText } from 'lucide-react';

export type AppId = 'about' | 'projects' | 'experience' | 'skills' | 'terminal' | 'contact' | 'resume';

export type AppMeta = {
  id: AppId;
  title: string;
  file: string; // shown in the title bar, like a process name
  icon: LucideIcon;
  // Two stops for the dock tile gradient
  tint: [string, string];
  size: { w: number; h: number };
};

export const APPS: Record<AppId, AppMeta> = {
  about: {
    id: 'about',
    title: 'Identity',
    file: 'identity.app',
    icon: Fingerprint,
    tint: ['#C8FF4D', '#2BD69B'],
    size: { w: 880, h: 620 },
  },
  projects: {
    id: 'projects',
    title: 'Missions',
    file: 'missions.app',
    icon: Orbit,
    tint: ['#5EE7FF', '#6A5CFF'],
    size: { w: 1080, h: 700 },
  },
  experience: {
    id: 'experience',
    title: 'Logs',
    file: 'git log --career',
    icon: GitCommitVertical,
    tint: ['#FFB547', '#FF5C7A'],
    size: { w: 820, h: 640 },
  },
  skills: {
    id: 'skills',
    title: 'Monitor',
    file: 'stack.monitor',
    icon: Activity,
    tint: ['#B388FF', '#5EE7FF'],
    size: { w: 900, h: 620 },
  },
  terminal: {
    id: 'terminal',
    title: 'Terminal',
    file: 'zsh — dhwanil@os',
    icon: SquareTerminal,
    tint: ['#3A4152', '#10131B'],
    size: { w: 720, h: 460 },
  },
  contact: {
    id: 'contact',
    title: 'Transmit',
    file: 'transmit.app',
    icon: Send,
    tint: ['#FF5C7A', '#FF9E5C'],
    size: { w: 620, h: 600 },
  },
  resume: {
    id: 'resume',
    title: 'Résumé',
    file: 'resume.pdf',
    icon: FileText,
    tint: ['#E9ECF2', '#8A90A0'],
    size: { w: 760, h: 820 },
  },
};

export const DOCK_ORDER: AppId[] = ['about', 'projects', 'experience', 'skills', 'terminal', 'contact', 'resume'];

export function isAppId(v: string | null | undefined): v is AppId {
  return !!v && v in APPS;
}
