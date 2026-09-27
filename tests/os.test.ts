import { useOS, placeWindow, MENUBAR_H } from '@/app/os/store';
import { run, completions, findProject } from '@/app/os/terminal-commands';
import { whereUsed, aliases } from '@/app/os/skill-match';
import { shortHash } from '@/app/os/apps/Experience';

const vp = { w: 1440, h: 900 };
const reset = () => useOS.setState({ windows: {}, focused: null, zTop: 10, project: 'vantage', spotlight: false });

describe('window manager', () => {
  beforeEach(reset);

  it('opens a window focused and on top', () => {
    useOS.getState().open('about', vp);
    useOS.getState().open('projects', vp);
    const { windows, focused } = useOS.getState();
    expect(focused).toBe('projects');
    expect(windows.projects!.z).toBeGreaterThan(windows.about!.z);
  });

  it('re-opening an existing window restores and raises it instead of duplicating', () => {
    const os = useOS.getState();
    os.open('about', vp);
    os.open('projects', vp);
    os.minimize('about');
    os.open('about', vp);
    const { windows, focused } = useOS.getState();
    expect(Object.keys(windows)).toHaveLength(2);
    expect(windows.about!.minimized).toBe(false);
    expect(focused).toBe('about');
  });

  it('minimize and close hand focus to the next topmost visible window', () => {
    const os = useOS.getState();
    os.open('about', vp);
    os.open('skills', vp);
    os.open('terminal', vp);
    os.minimize('terminal');
    expect(useOS.getState().focused).toBe('skills');
    os.close('skills');
    expect(useOS.getState().focused).toBe('about');
    os.close('about');
    expect(useOS.getState().focused).toBeNull();
  });

  it('openProject selects the project and opens Missions', () => {
    useOS.getState().openProject('clarion', vp);
    expect(useOS.getState().project).toBe('clarion');
    expect(useOS.getState().focused).toBe('projects');
  });

  it('resize enforces a minimum size', () => {
    const os = useOS.getState();
    os.open('about', vp);
    os.resize('about', 10, 10);
    expect(useOS.getState().windows.about).toMatchObject({ w: 420, h: 300 });
  });

  it('places windows inside the screen, below the menu bar', () => {
    const small = { w: 800, h: 600 };
    const r = placeWindow('projects', 0, small);
    expect(r.x).toBeGreaterThanOrEqual(16);
    expect(r.x + r.w).toBeLessThanOrEqual(small.w);
    expect(r.y).toBeGreaterThanOrEqual(MENUBAR_H);
  });
});

describe('terminal', () => {
  it('lists commands on help', () => {
    const { lines } = run('help');
    expect(lines.some((l) => l.text.includes('open <app|project>'))).toBe(true);
  });

  it('opens apps by name or alias', () => {
    expect(run('open missions').effects).toEqual([{ type: 'open', app: 'projects' }]);
    expect(run('open logs').effects).toEqual([{ type: 'open', app: 'experience' }]);
  });

  it('opens projects by id or partial name', () => {
    expect(run('open vantage').effects).toEqual([{ type: 'project', id: 'vantage' }]);
    expect(findProject('waymo')?.id).toBe('waymo');
  });

  it('cat prints metrics for a flagship project', () => {
    const { lines } = run('cat clarion');
    expect(lines[0].text).toContain('Clarion');
    expect(lines.some((l) => l.text.includes('27% → 0%'))).toBe(true);
  });

  it('rejects unknown commands and directories', () => {
    expect(run('rm -rf /').lines[0]).toMatchObject({ kind: 'err' });
    expect(run('ls secrets').lines[0]).toMatchObject({ kind: 'err' });
  });

  it('sudo hire-me triggers the hire effect', () => {
    expect(run('sudo hire-me').effects).toEqual([{ type: 'hire' }]);
    expect(run('sudo rm').effects).toEqual([]);
  });

  it('completes commands and arguments', () => {
    expect(completions('ne')).toEqual(['neofetch']);
    expect(completions('open cor')).toContain('open cordon');
  });
});

describe('skill matching', () => {
  it('splits aliases and strips qualifiers', () => {
    expect(aliases('Kafka / Redpanda')).toEqual(['kafka', 'redpanda']);
    expect(aliases('Go (learning)')).toEqual(['go']);
  });

  it('finds projects using a skill', () => {
    const ids = whereUsed('Neo4j').map((h) => h.id);
    expect(ids).toEqual(expect.arrayContaining(['vantage', 'clarion']));
  });

  it('does not confuse Java with JavaScript or Go with MongoDB', () => {
    expect(whereUsed('Java').map((h) => h.id)).not.toContain('skilhire');
    expect(whereUsed('Go (learning)')).toHaveLength(0);
  });
});

describe('shortHash', () => {
  it('is stable and 7 hex chars', () => {
    expect(shortHash('ipserlab')).toBe(shortHash('ipserlab'));
    expect(shortHash('ipserlab')).toMatch(/^[0-9a-f]{7}$/);
  });
});
