'use client';

import { motion } from 'framer-motion';
import { MapPin, Calendar } from 'lucide-react';
import experienceData from '@/data/experience.json';

const { experiences } = experienceData;

export default function ExperiencePage() {
  return (
    <div className="min-h-screen pt-28 pb-24 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs font-mono text-accent tracking-widest uppercase block mb-4"
          >
            <span className="inline-block w-8 h-px bg-accent mr-3 align-middle" />
            Career
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl lg:text-6xl font-bold text-text-primary"
          >
            Experience
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-text-secondary text-lg max-w-xl"
          >
            My professional journey through AI engineering and software development.
          </motion.p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-0 top-2 bottom-2 w-px">
            <motion.div
              className="h-full timeline-line"
              initial={{ scaleY: 0, originY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            />
          </div>

          <div className="space-y-16 pl-10">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                {/* Timeline dot */}
                <div className="absolute -left-10 top-1.5 flex items-center justify-center">
                  <motion.div
                    className="w-3 h-3 rounded-full bg-accent ring-4 ring-[#0A0A0A]"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 + 0.3, type: 'spring' }}
                  />
                </div>

                {/* Card */}
                <div className="rounded-2xl p-8 bg-surface-raised border border-border hover:border-border-hover transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-mono ${
                      exp.type === 'Full-time'
                        ? 'bg-accent/10 border border-accent/20 text-accent'
                        : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                    }`}>
                      {exp.type}
                    </span>
                    <div className="flex items-center gap-4 text-xs text-text-tertiary font-mono">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" />
                        {exp.startDate} – {exp.endDate}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3" />
                        {exp.location}
                      </span>
                    </div>
                  </div>

                  <h2 className="font-display text-2xl font-bold text-text-primary mb-1 group-hover:text-accent transition-colors">
                    {exp.position}
                  </h2>
                  <p className="text-accent font-medium text-sm mb-4">{exp.company}</p>
                  <p className="text-text-secondary text-sm mb-6 leading-relaxed">{exp.description}</p>

                  <div className="space-y-3 mb-6">
                    {exp.achievements.map((item, j) => (
                      <div key={j} className="flex items-start gap-3">
                        <span className="mt-2 w-1 h-1 rounded-full bg-accent flex-shrink-0" />
                        <p className="text-sm text-text-secondary leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {exp.technologies.map((tech) => (
                      <span key={tech} className="tag text-[11px]">{tech}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
