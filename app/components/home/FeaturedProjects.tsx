'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Github } from 'lucide-react';
import { useRouter } from 'next/navigation';
import projectsData from '@/data/projects.json';
import TiltCard from '@/app/components/ui/TiltCard';
import TextReveal from '@/app/components/ui/TextReveal';

const featured = projectsData.featuredProjects.slice(0, 3);

function ProjectCard({ project, index }: { project: typeof featured[0]; index: number }) {
  const router = useRouter();
  const isLarge = index === 0;

  return (
    <TiltCard
      className="relative group cursor-pointer h-full"
      tiltAmount={6}
    >
      <div
        onClick={() => router.push(`/projects/${project.id}`)}
        className="relative h-full min-h-[280px] rounded-2xl overflow-hidden bg-surface-raised border border-border hover:border-border-hover hover:shadow-[0_12px_40px_-15px_rgba(232,100,60,0.2)] transition-all duration-500"
      >
        {/* Image */}
        <div className="absolute inset-0">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-70 group-hover:opacity-85"
            sizes={isLarge ? '(max-width: 768px) 100vw, 66vw' : '33vw'}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-raised via-surface-raised/80 to-transparent" />
        </div>

        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          {/* Number */}
          <span className="font-mono text-xs text-text-tertiary mb-3 block">
            {String(index + 1).padStart(2, '0')}
          </span>

          <h3 className={`font-display font-bold text-text-primary group-hover:text-accent transition-colors mb-2 leading-tight ${
            isLarge ? 'text-2xl md:text-3xl' : 'text-lg'
          }`}>
            {project.title}
          </h3>

          <p className={`text-text-secondary line-clamp-2 mb-4 leading-relaxed ${
            isLarge ? 'text-sm max-w-md' : 'text-xs'
          }`}>
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.technologies.slice(0, isLarge ? 5 : 3).map((tech) => (
              <span key={tech} className="tag text-[10px]">{tech}</span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-overlay border border-border text-text-secondary hover:text-accent transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-overlay border border-border text-text-secondary hover:text-accent transition-colors"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </TiltCard>
  );
}

export default function FeaturedProjects() {
  return (
    <section className="section-padding">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs font-mono text-accent tracking-widest uppercase block mb-4"
            >
              <span className="inline-block w-8 h-px bg-accent mr-3 align-middle" />
              Selected Work
            </motion.span>
            <TextReveal
              as="h2"
              className="font-display text-4xl lg:text-5xl font-bold text-text-primary"
            >
              Featured Projects
            </TextReveal>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link
              href="/projects"
              data-cursor="hover"
              className="hidden md:flex items-center gap-2 text-sm text-text-tertiary hover:text-accent transition-colors group"
            >
              All Projects
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Asymmetric grid: first card large, next two smaller */}
        <div className="grid md:grid-cols-3 md:grid-rows-2 gap-4">
          {featured.map((project, i) => (
            <motion.div
              key={project.id}
              className={i === 0 ? 'md:col-span-2 md:row-span-2' : ''}
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProjectCard project={project} index={i} />
            </motion.div>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 text-center md:hidden">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-text-secondary border border-border hover:border-accent hover:text-accent transition-all"
          >
            View All Projects <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
