'use client';

import { motion } from 'framer-motion';
import { MapPin, Calendar, GraduationCap, FileText } from 'lucide-react';
import educationData from '@/data/education.json';

const { education } = educationData;

export default function EducationPage() {
  return (
    <div className="min-h-screen pt-28 pb-24 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-mono text-accent tracking-widest uppercase block mb-4"
          >
            <span className="inline-block w-8 h-px bg-accent mr-3 align-middle" />
            Academic Background
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl lg:text-6xl font-bold text-text-primary"
          >
            Education
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-text-secondary text-lg max-w-xl"
          >
            The academic foundation behind my engineering and AI expertise.
          </motion.p>
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-0 top-2 bottom-2 w-px">
            <motion.div
              className="h-full timeline-line"
              initial={{ scaleY: 0, originY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            />
          </div>

          <div className="space-y-12 pl-10">
            {education.map((edu, i) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                {/* Timeline dot */}
                <div className="absolute -left-[2.7rem] top-6 flex items-center justify-center w-5 h-5 rounded-full bg-[#0A0A0A] border border-border">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-accent"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.15 + 0.3, type: 'spring' }}
                  />
                </div>

                {/* Card */}
                <div className="rounded-2xl p-8 bg-surface-raised border border-border hover:border-border-hover transition-all duration-300 group">
                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-display text-xl font-bold text-text-primary group-hover:text-accent transition-colors">
                        {edu.institution}
                      </h2>
                      <p className="text-sm text-accent font-medium mt-0.5">
                        {edu.degree} in {edu.field}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs text-text-tertiary font-mono mb-5">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      {edu.startDate} – {edu.endDate}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" />
                      {edu.location}
                    </span>
                  </div>

                  {edu.relevantCourses.length > 0 && (
                    <div className="mb-5">
                      <p className="text-xs font-mono text-text-tertiary uppercase tracking-widest mb-3">Coursework</p>
                      <div className="flex flex-wrap gap-1.5">
                        {edu.relevantCourses.map((course) => (
                          <span
                            key={course}
                            className="tag text-xs"
                          >
                            {course}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {edu.id === 'northeastern-ms' && (
                    <a
                      href="/documents/diploma.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="hover"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium bg-surface-overlay border border-border text-text-secondary hover:text-text-primary hover:border-border-hover transition-all"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      View Diploma
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
