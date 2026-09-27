import { featured, secondary, archive, experience } from '@/data/portfolio';

/** "Kafka / Redpanda" → ["kafka", "redpanda"]; "Go (learning)" → ["go"]. */
export function aliases(skill: string): string[] {
  const base = skill
    .replace(/\(.*?\)/g, '')
    .trim()
    .toLowerCase();
  return base
    .split('/')
    .map((s) => s.trim())
    .filter(Boolean);
}

function uses(stack: string[], skill: string) {
  const keys = aliases(skill);
  return stack.some((raw) => {
    const s = raw.toLowerCase();
    // Word-boundary match so "Go" doesn't hit "MongoDB" and "Java" doesn't hit "JavaScript".
    return keys.some((k) =>
      new RegExp(`(^|[^a-z0-9])${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}($|[^a-z0-9])`).test(s)
    );
  });
}

export type SkillHit = { id: string; name: string; kind: 'flagship' | 'lab' | 'archive' | 'role' };

export function whereUsed(skill: string): SkillHit[] {
  return [
    ...featured.filter((p) => uses(p.stack, skill)).map((p) => ({ id: p.id, name: p.name, kind: 'flagship' as const })),
    ...secondary.filter((p) => uses(p.stack, skill)).map((p) => ({ id: p.id, name: p.name, kind: 'lab' as const })),
    ...archive.filter((p) => uses(p.stack, skill)).map((p) => ({ id: p.id, name: p.name, kind: 'archive' as const })),
    ...experience
      .filter((r) => uses(r.stack, skill))
      .map((r) => ({ id: r.id, name: r.company, kind: 'role' as const })),
  ];
}
