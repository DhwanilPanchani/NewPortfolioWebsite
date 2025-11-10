interface SkillCategory {
  category: string;
  skills: string[];
}

declare module '@/data/skills.json' {
  const skillCategories: SkillCategory[];
  export { skillCategories };
}
