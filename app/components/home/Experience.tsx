'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import experienceData from '@/data/experience.json';
import TextReveal from '@/app/components/ui/TextReveal';

const { experiences } = experienceData;

export default function Experience() {
  return (
    <section className="section-padding">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Left: header */}
          <div className="lg:col-span-2">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs font-mono text-accent tracking-widest uppercase block mb-4"
            >
              <span className="inline-block w-8 h-px bg-accent mr-3 align-middle" />
              Career
            </motion.span>
            <TextReveal
              as="h2"
              className="font-display text-4xl lg:text-5xl font-bold text-text-primary mb-6"
            >
              Experience
            </TextReveal>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-text-secondary text-base leading-relaxed mb-6"
            >
              3+ years building production systems across AI engineering and full-stack development.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Link
                href="/experience"
                data-cursor="hover"
                className="inline-flex items-center gap-2 text-sm text-text-tertiary hover:text-accent transition-colors group"
              >
                Full timeline
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* Right: cards */}
          <div className="lg:col-span-3 space-y-4">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group rounded-2xl p-6 bg-surface-raised border border-border hover:border-border-hover hover:-translate-y-1 hover:shadow-[0_8px_30px_-12px_rgba(232,100,60,0.15)] transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="font-display text-base font-bold text-text-primary group-hover:text-accent transition-colors">
                      {exp.position}
                    </h3>
                    <p className="text-sm text-accent mt-0.5">{exp.company}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono text-text-tertiary">
                      {exp.startDate} — {exp.endDate}
                    </span>
                    <span className="block text-xs text-text-tertiary mt-0.5">{exp.location}</span>
                  </div>
                </div>

                <p className="text-sm text-text-secondary leading-relaxed mb-3">
                  {exp.achievements[0]}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {exp.technologies.slice(0, 5).map((tech) => (
                    <span key={tech} className="tag text-[10px]">{tech}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
