import { profile, featured, secondary, archive, experience, education, skills } from '@/data/portfolio';
import { APPS, isAppId, type AppId } from './registry';

export type Line = { kind: 'out' | 'err' | 'accent' | 'dim'; text: string };
export type Effect =
  | { type: 'open'; app: AppId }
  | { type: 'project'; id: string }
  | { type: 'clear' }
  | { type: 'hire' }
  | { type: 'download' };

export type Result = { lines: Line[]; effects: Effect[] };

const out = (text: string): Line => ({ kind: 'out', text });
const dim = (text: string): Line => ({ kind: 'dim', text });
const accent = (text: string): Line => ({ kind: 'accent', text });
const err = (text: string): Line => ({ kind: 'err', text });

const ALL_PROJECTS = [...featured, ...secondary, ...archive];

const HELP: [string, string][] = [
  ['whoami', 'who is behind this machine'],
  ['neofetch', 'system summary'],
  ['ls [flagship|lab|archive]', 'list projects'],
  ['cat <project>', 'print a project spec'],
  ['open <app|project>', 'launch an app or case file'],
  ['experience', 'career log'],
  ['skills', 'installed toolchains'],
  ['contact', 'open a transmission'],
  ['resume', 'download résumé'],
  ['social', 'links'],
  ['clear', 'clear the screen'],
];

export const COMMANDS = [
  'help',
  'whoami',
  'neofetch',
  'ls',
  'cat',
  'open',
  'experience',
  'skills',
  'contact',
  'resume',
  'social',
  'clear',
  'date',
  'echo',
  'sudo',
];

export function findProject(q: string) {
  const k = q.toLowerCase();
  return (
    ALL_PROJECTS.find((p) => p.id === k || p.name.toLowerCase() === k) ??
    ALL_PROJECTS.find((p) => p.name.toLowerCase().includes(k))
  );
}

export function completions(input: string): string[] {
  const parts = input.split(/\s+/);
  if (parts.length <= 1) return COMMANDS.filter((c) => c.startsWith(parts[0] ?? ''));
  const [cmd, arg = ''] = parts;
  let pool: string[] = [];
  if (cmd === 'open') pool = [...Object.keys(APPS), ...ALL_PROJECTS.map((p) => p.id)];
  if (cmd === 'cat') pool = ALL_PROJECTS.map((p) => p.id);
  if (cmd === 'ls') pool = ['flagship', 'lab', 'archive'];
  return pool.filter((p) => p.startsWith(arg.toLowerCase())).map((p) => `${cmd} ${p}`);
}

export function run(raw: string, now: Date = new Date()): Result {
  const input = raw.trim();
  if (!input) return { lines: [], effects: [] };
  const [cmd, ...rest] = input.split(/\s+/);
  const arg = rest.join(' ');

  switch (cmd.toLowerCase()) {
    case 'help':
      return {
        lines: [
          dim('available commands:'),
          ...HELP.map(([c, d]) => out(`  ${c.padEnd(26)} ${d}`)),
          dim('tip: Tab completes, ↑/↓ walks history'),
        ],
        effects: [],
      };

    case 'whoami':
      return {
        lines: [
          accent(profile.name),
          out(profile.role),
          out(profile.headline),
          dim(`${profile.location} · ${profile.status}`),
        ],
        effects: [],
      };

    case 'neofetch': {
      const logo = ['   ▄▀▀▀▄   ', '  █  ◉  █  ', '   ▀▄▄▄▀   ', '  ▄▀   ▀▄  '];
      const info = [
        `${profile.handle}@os`,
        `role     ${profile.role}`,
        `kernel   human-in-the-loop 26.9`,
        `uptime   ${experience.length} roles · ${education.length} degrees`,
        `packages ${ALL_PROJECTS.length} projects (${featured.length} flagship)`,
        `shell    ${skills[0].items.slice(0, 4).join(', ')}`,
      ];
      return {
        lines: info.map((l, i) =>
          i === 0 ? accent(`${logo[i] ?? ' '.repeat(11)}  ${l}`) : out(`${logo[i] ?? ' '.repeat(11)}  ${l}`)
        ),
        effects: [],
      };
    }

    case 'ls': {
      const which = arg.toLowerCase() || 'flagship';
      const map = { flagship: featured, lab: secondary, archive } as const;
      if (!(which in map))
        return { lines: [err(`ls: ${arg}: no such directory (try flagship, lab, archive)`)], effects: [] };
      const list = map[which as keyof typeof map];
      return {
        lines: [dim(`~/projects/${which}`), ...list.map((p) => out(`  ${p.id.padEnd(14)} ${p.name}`))],
        effects: [],
      };
    }

    case 'cat': {
      if (!arg) return { lines: [err('cat: missing project — try `ls`')], effects: [] };
      const p = findProject(arg);
      if (!p) return { lines: [err(`cat: ${arg}: no such project`)], effects: [] };
      if ('tagline' in p) {
        return {
          lines: [
            accent(`# ${p.name} — ${p.kicker}`),
            out(p.tagline),
            ...p.metrics.map((m) => out(`  ▸ ${m.value.padEnd(12)} ${m.label}`)),
            dim(`stack: ${p.stack.join(', ')}`),
            dim(`→ open ${p.id}`),
          ],
          effects: [],
        };
      }
      return {
        lines: [accent(`# ${p.name}`), out(p.blurb), out(`  ▸ ${p.metric}`), dim(`stack: ${p.stack.join(', ')}`)],
        effects: [],
      };
    }

    case 'open': {
      if (!arg) return { lines: [err('open: what? try `open projects` or `open vantage`')], effects: [] };
      const a = arg.toLowerCase();
      const alias: Record<string, AppId> = {
        about: 'about',
        missions: 'projects',
        projects: 'projects',
        logs: 'experience',
        experience: 'experience',
        monitor: 'skills',
        skills: 'skills',
        mail: 'contact',
        contact: 'contact',
        resume: 'resume',
        terminal: 'terminal',
      };
      const app = alias[a] ?? (isAppId(a) ? a : null);
      if (app) return { lines: [dim(`launching ${APPS[app].file}…`)], effects: [{ type: 'open', app }] };
      const p = findProject(a);
      if (p) return { lines: [dim(`mounting case file: ${p.name}…`)], effects: [{ type: 'project', id: p.id }] };
      return { lines: [err(`open: ${arg}: not found`)], effects: [] };
    }

    case 'experience':
      return {
        lines: experience
          .flatMap((r) => [accent(`${r.start} → ${r.end}  ${r.title} @ ${r.company}`), dim(`  ${r.location}`)])
          .concat(dim('→ open logs for details')),
        effects: [],
      };

    case 'skills':
      return { lines: skills.map((g) => out(`${g.group.padEnd(16)} ${g.items.join(' · ')}`)), effects: [] };

    case 'contact':
      return {
        lines: [out(`email    ${profile.email}`), dim('opening transmit.app…')],
        effects: [{ type: 'open', app: 'contact' }],
      };

    case 'resume':
      return { lines: [dim('fetching resume.pdf…')], effects: [{ type: 'download' }] };

    case 'social':
      return {
        lines: [
          out(`github   ${profile.links.github}`),
          out(`linkedin ${profile.links.linkedin}`),
          out(`email    ${profile.email}`),
        ],
        effects: [],
      };

    case 'date':
      return {
        lines: [
          out(
            now.toLocaleString('en-US', { timeZone: 'America/New_York', dateStyle: 'full', timeStyle: 'short' }) +
              ' (Boston)'
          ),
        ],
        effects: [],
      };

    case 'echo':
      return { lines: [out(arg)], effects: [] };

    case 'clear':
      return { lines: [], effects: [{ type: 'clear' }] };

    case 'sudo':
      if (arg.toLowerCase().replace(/\s+/g, '-') === 'hire-me') {
        return {
          lines: [accent('[sudo] password for recruiter: ••••••••'), out('access granted. drafting a transmission…')],
          effects: [{ type: 'hire' }],
        };
      }
      return { lines: [err(`sudo: ${arg || 'command'}: permission denied — nice try`)], effects: [] };

    default:
      return {
        lines: [err(`zsh: command not found: ${cmd}`), dim('type `help` to see what this machine can do')],
        effects: [],
      };
  }
}
