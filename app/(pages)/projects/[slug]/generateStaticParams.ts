import { allProjects, featuredProjects } from '@/data/projects.json';

export function generateStaticParams() {
  const all = [...featuredProjects, ...allProjects];
  return all.map((project) => ({
    slug: project.id,
  }));
}
