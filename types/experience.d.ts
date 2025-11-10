interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  type: string;
  description?: string;
  responsibilities?: string[];
  technologies?: string[];
  achievements?: string[];
}

declare module '@/data/experience.json' {
  const experiences: ExperienceItem[];
  export { experiences };
}
