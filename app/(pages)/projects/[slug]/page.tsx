'use client';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Github, ExternalLink } from 'lucide-react';
import { allProjects, featuredProjects } from '@/data/projects.json';
import Tag from '@/app/components/shared/Tag';
import { ImagePlaceholder } from '@/app/components/ui/ImagePlaceholder';
import React, { use } from 'react';

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  githubUrl: string;
  liveUrl?: string;
  featured: boolean;
  category: string;
  details?: {
    challenge?: string;
    solution?: string;
    keyFeatures?: string[];
    impact?: string[];
  };
}

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const allProjectsList: Project[] = [...featuredProjects, ...allProjects] as Project[];
  const project = allProjectsList.find((p) => p.id === slug);

  if (!project) {
    notFound();
  }

  const details = project.details;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary-light transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          Back to Projects
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {project.title}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {project.description}
          </p>

          {/* Links */}
          <div className="mt-6 flex items-center gap-4">
            <Link
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-medium hover:scale-105 transition-transform"
            >
              <Github size={20} />
              View on GitHub
            </Link>
            {project.liveUrl && project.liveUrl.trim() !== '' && (
              <Link
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 glass border border-gray-300 dark:border-gray-700 rounded-full font-medium hover:scale-105 transition-transform"
              >
                <ExternalLink size={20} />
                Live Demo
              </Link>
            )}
          </div>
        </div>

        {/* Image */}
        <div className="relative rounded-2xl overflow-hidden mb-12">
          {project.image ? (
            <div className="relative h-96">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          ) : (
            <ImagePlaceholder 
              width={2560} 
              height={1440} 
              alt={project.title}
              className="rounded-2xl"
            />
          )}
        </div>

        {/* Technologies */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Technologies Used</h2>
          <div className="flex flex-wrap gap-3">
            {project.technologies.map((tech) => (
              <Tag key={tech} label={tech} />
            ))}
          </div>
        </div>

        {/* Project Details */}
        {details && (
          <div className="space-y-12">
            {details.challenge && (
              <div>
                <h3 className="text-2xl font-bold mb-4">The Challenge</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {details.challenge}
                </p>
              </div>
            )}

            {details.solution && (
              <div>
                <h3 className="text-2xl font-bold mb-4">The Solution</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {details.solution}
                </p>
              </div>
            )}

            {details.keyFeatures && details.keyFeatures.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold mb-4">Key Features</h3>
                <ul className="grid gap-2">
                  {details.keyFeatures.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {details.impact && details.impact.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold mb-4">Impact</h3>
                <ul className="grid gap-2">
                  {details.impact.map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-primary mt-1">•</span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}