import { Project } from './project';

declare module '@/data/projects.json' {
  const featuredProjects: Project[];
  const allProjects: Project[];
  
  export { featuredProjects, allProjects };
}
