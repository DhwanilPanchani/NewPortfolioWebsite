'use client';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Github, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import projectsData from '@/data/projects.json';
import { use } from 'react';

const allProjectsList = [...projectsData.featuredProjects, ...projectsData.allProjects];

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const project = allProjectsList.find((p) => p.id === slug);

  if (!project) notFound();

  const details = (project as any).details;

  return (
    <div className="min-h-screen pt-28 pb-24 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back */}
        <Link
          href="/projects"
          data-cursor="hover"
          className="inline-flex items-center gap-2 text-sm text-text-tertiary hover:text-text-primary transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Projects
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-10"
        >
          <span className="text-xs font-mono text-accent tracking-widest uppercase block mb-3">
            {project.category}
          </span>
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-text-primary mb-4">
            {project.title}
          </h1>
          <p className="text-text-secondary text-lg leading-relaxed max-w-2xl">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="hover"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-text-primary bg-surface-raised border border-border hover:border-border-hover transition-all"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
            )}
            {project.liveUrl && project.liveUrl.trim() !== '' && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="hover"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-[#0A0A0A] bg-accent hover:bg-accent-hover transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                Live Demo
              </a>
            )}
          </div>
        </motion.div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative h-80 lg:h-96 rounded-2xl overflow-hidden mb-12 bg-surface-raised border border-border"
        >
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover opacity-85"
            priority
            sizes="(max-width: 1024px) 100vw, 896px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-raised/80 via-transparent to-transparent" />
        </motion.div>

        {/* Technologies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-10"
        >
          <h2 className="font-display text-lg font-bold text-text-primary mb-4">Technologies</h2>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span key={tech} className="tag">{tech}</span>
            ))}
          </div>
        </motion.div>

        {/* Details */}
        {details && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            {details.challenge && (
              <div className="rounded-2xl p-7 bg-surface-raised border border-border">
                <h3 className="font-display text-lg font-bold text-text-primary mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  The Challenge
                </h3>
                <p className="text-text-secondary leading-relaxed">{details.challenge}</p>
              </div>
            )}

            {details.solution && (
              <div className="rounded-2xl p-7 bg-surface-raised border border-border">
                <h3 className="font-display text-lg font-bold text-text-primary mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  The Solution
                </h3>
                <p className="text-text-secondary leading-relaxed">{details.solution}</p>
              </div>
            )}

            {details.keyFeatures && details.keyFeatures.length > 0 && (
              <div className="rounded-2xl p-7 bg-surface-raised border border-border">
                <h3 className="font-display text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  Key Features
                </h3>
                <ul className="space-y-3">
                  {details.keyFeatures.map((f: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-text-secondary">
                      <span className="mt-2 w-1 h-1 rounded-full bg-accent flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {details.impact && details.impact.length > 0 && (
              <div className="rounded-2xl p-7 bg-surface-raised border border-border">
                <h3 className="font-display text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Impact
                </h3>
                <ul className="space-y-3">
                  {details.impact.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-text-secondary">
                      <span className="mt-2 w-1 h-1 rounded-full bg-emerald-400 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
