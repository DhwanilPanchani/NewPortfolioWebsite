interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  description?: string;
  gpa?: string;
  courses?: string[];
  relevantCourses?: string[];
  achievements?: string[];
}

declare module '@/data/education.json' {
  const education: EducationItem[];
  export { education };
}
