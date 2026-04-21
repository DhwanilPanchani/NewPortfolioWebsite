'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Download } from 'lucide-react';
import skillsData from '@/data/skills.json';

const { skillCategories } = skillsData;

const stats = [
  { value: '3+', label: 'Years Experience' },
  { value: '15+', label: 'Projects Built' },
  { value: '100K+', label: 'Users Served' },
  { value: '25+', label: 'Technologies' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-28 pb-24 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-mono text-accent tracking-widest uppercase block mb-4"
          >
            <span className="inline-block w-8 h-px bg-accent mr-3 align-middle" />
            Who I Am
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl lg:text-6xl font-bold text-text-primary"
          >
            About Me
          </motion.h1>
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-2 gap-16 mb-24">
          {/* Left: image + stats */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="space-y-8"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
              <Image
                src="/images/profile.jpg"
                alt="Dhwanil Panchani"
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/60 via-transparent to-transparent" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-xl p-4 bg-surface-raised border border-border text-center">
                  <div className="font-display text-2xl font-bold text-text-primary">{stat.value}</div>
                  <div className="text-xs text-text-tertiary mt-1 font-mono">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: text */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="flex flex-col justify-center space-y-6"
          >
            <div className="space-y-5 text-text-secondary text-lg leading-relaxed">
              <p>
                I&apos;m <span className="text-text-primary font-semibold">Dhwanil Panchani</span>, and
                I&apos;ve been obsessed with building things on the internet for as long as I can remember.
                Right now I&apos;m based in San Francisco, working at{' '}
                <span className="text-accent">IpserLab</span> where I get to do what I love most:
                take complex problems and turn them into products people actually enjoy using.
              </p>
              <p>
                My work sits somewhere between AI and full stack engineering. I design the APIs,
                train the models, build the frontends, and make sure everything plays nicely together
                in production. The systems I&apos;ve built serve hundreds of thousands of users with
                99%+ uptime, and I take a lot of pride in that reliability.
              </p>
              <p>
                I studied Information Systems at{' '}
                <span className="text-text-primary">Northeastern University</span> and Computer
                Engineering at GTU before that. But honestly, most of what I know came from
                late nights building side projects, breaking things, and figuring out how to fix them.
              </p>
              <p>
                When I&apos;m not coding, you&apos;ll find me tinkering with generative AI,
                contributing to open source, or nerding out over interface design. I believe the best
                software feels invisible, and that&apos;s what I aim to build.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/contact"
                data-cursor="hover"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-[#0A0A0A] bg-accent hover:bg-accent-hover transition-all"
              >
                Get in Touch <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="/documents/resume.pdf"
                download
                data-cursor="hover"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-text-secondary hover:text-text-primary border border-border hover:border-border-hover transition-all"
              >
                <Download className="w-4 h-4" />
                Resume
              </a>
            </div>
          </motion.div>
        </div>

        {/* Skills grid */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <span className="text-xs font-mono text-accent tracking-widest uppercase block mb-3">
              <span className="inline-block w-8 h-px bg-accent mr-3 align-middle" />
              Expertise
            </span>
            <h2 className="font-display text-3xl font-bold text-text-primary">Technical Skills</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {skillCategories.map((cat, i) => (
              <motion.div
                key={cat.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-2xl p-6 bg-surface-raised border border-border hover:border-border-hover transition-all duration-300 group"
              >
                <h3 className="font-display text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent group-hover:shadow-[0_0_8px_rgba(232,100,60,0.5)] transition-shadow" />
                  {cat.category}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {cat.skills.map((skill) => (
                    <span key={skill} className="tag text-[11px]">{skill}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
