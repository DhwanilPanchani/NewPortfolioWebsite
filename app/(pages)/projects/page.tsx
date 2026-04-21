'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Github, ArrowUpRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import projectsData from '@/data/projects.json';
import TiltCard from '@/app/components/ui/TiltCard';

const { allProjects, featuredProjects } = projectsData;
const allList = [...featuredProjects, ...allProjects];

const CATEGORIES = ['All', 'AI/ML', 'Full-Stack', 'Data Science', 'Security'];

export default function ProjectsPage() {
  const [active, setActive] = useState('All');

  const filtered = active === 'All'
    ? allList
    : allList.filter((p) => {
        if (active === 'Full-Stack') return p.category === 'Full Stack' || p.category === 'Full-Stack';
        return p.category === active;
      });

  return (
    <div className="min-h-screen pt-28 pb-24 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-mono text-accent tracking-widest uppercase block mb-4"
          >
            <span className="inline-block w-8 h-px bg-accent mr-3 align-middle" />
            Work
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl lg:text-6xl font-bold text-text-primary"
          >
            All Projects
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-text-secondary text-lg"
          >
            {allList.length} projects spanning AI, full-stack, data science, and security.
          </motion.p>
        </div>

        {/* Filter */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-2 mb-12"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              data-cursor="hover"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                active === cat
                  ? 'bg-accent text-[#0A0A0A]'
                  : 'bg-surface-raised border border-border text-text-secondary hover:text-text-primary hover:border-border-hover'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* GitHub banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-20 rounded-2xl p-10 bg-surface-raised border border-border text-center"
        >
          <h3 className="font-display text-2xl font-bold text-text-primary mb-3">More on GitHub</h3>
          <p className="text-text-secondary mb-6">Check out more projects, experiments, and open-source contributions.</p>
          <a
            href="https://github.com/DhwanilPanchani"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="hover"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-text-primary border border-border hover:border-accent hover:text-accent transition-all"
          >
            <Github className="w-4 h-4" />
            View GitHub Profile
          </a>
        </motion.div>
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: typeof allList[0] }) {
  const router = useRouter();
  return (
    <TiltCard className="h-full" tiltAmount={5}>
      <div
        role="article"
        onClick={() => router.push(`/projects/${project.id}`)}
        className="block group bg-surface-raised border border-border hover:border-border-hover hover:shadow-[0_12px_40px_-15px_rgba(232,100,60,0.15)] rounded-2xl overflow-hidden h-full cursor-pointer transition-all duration-300"
      >
        <div className="relative h-44 overflow-hidden">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover opacity-70 transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-raised via-surface-raised/50 to-transparent" />
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 rounded-md text-[10px] font-mono text-accent bg-accent/10 border border-accent/20">
              {project.category}
            </span>
          </div>
          <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-surface-overlay border border-border text-text-secondary hover:text-accent"
              >
                <Github className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        <div className="p-5">
          <h3 className="font-display font-bold text-text-primary group-hover:text-accent transition-colors mb-2 text-base leading-snug">
            {project.title}
          </h3>
          <p className="text-xs text-text-secondary line-clamp-2 mb-4 leading-relaxed">{project.description}</p>
          <div className="flex flex-wrap gap-1">
            {project.technologies.slice(0, 3).map((t) => (
              <span key={t} className="tag text-[10px]">{t}</span>
            ))}
            {project.technologies.length > 3 && (
              <span className="tag text-[10px] text-text-tertiary">+{project.technologies.length - 3}</span>
            )}
          </div>
        </div>
      </div>
    </TiltCard>
  );
}
