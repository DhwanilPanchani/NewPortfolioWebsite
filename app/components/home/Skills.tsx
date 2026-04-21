'use client';

import { motion } from 'framer-motion';
import skillsData from '@/data/skills.json';
import TextReveal from '@/app/components/ui/TextReveal';

const { skillCategories } = skillsData;

// Bento grid sizing — first two categories get larger cells
const sizeMap: Record<number, string> = {
  0: 'md:col-span-2',
  1: 'md:col-span-2',
};

export default function Skills() {
  return (
    <section className="section-padding">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs font-mono text-accent tracking-widest uppercase block mb-4"
        >
          <span className="inline-block w-8 h-px bg-accent mr-3 align-middle" />
          Expertise
        </motion.span>
        <TextReveal
          as="h2"
          className="font-display text-4xl lg:text-5xl font-bold text-text-primary mb-12"
        >
          Tools & Technologies
        </TextReveal>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {skillCategories.map((cat, i) => (
            <motion.div
              key={cat.category}
              className={`rounded-2xl p-6 bg-surface-raised border border-border hover:border-border-hover hover:-translate-y-1 hover:shadow-[0_8px_30px_-12px_rgba(232,100,60,0.12)] transition-all duration-300 group ${
                sizeMap[i] || ''
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Category header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-accent group-hover:shadow-[0_0_8px_rgba(232,100,60,0.5)] transition-shadow" />
                <h3 className="font-display text-sm font-bold text-text-primary tracking-wide">
                  {cat.category}
                </h3>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-1.5">
                {cat.skills.map((skill, si) => (
                  <motion.span
                    key={skill}
                    className="tag text-[11px]"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 + si * 0.03, duration: 0.3 }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
