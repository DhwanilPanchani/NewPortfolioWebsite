'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react';
import TextReveal from '@/app/components/ui/TextReveal';

const socials = [
  { href: 'https://github.com/DhwanilPanchani', icon: Github, label: 'GitHub' },
  { href: 'https://linkedin.com/in/dhwanilpanchani', icon: Linkedin, label: 'LinkedIn' },
  { href: 'mailto:dhwanilpanchani@gmail.com', icon: Mail, label: 'Email' },
];

export default function ContactCTA() {
  return (
    <section className="section-padding">
      <div className="max-w-4xl mx-auto text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs font-mono text-accent tracking-widest uppercase block mb-6"
        >
          <span className="inline-block w-8 h-px bg-accent mr-3 align-middle" />
          Contact
          <span className="inline-block w-8 h-px bg-accent ml-3 align-middle" />
        </motion.span>

        <TextReveal
          as="h2"
          className="font-display text-5xl lg:text-7xl font-bold text-text-primary mb-6"
        >
          Let&apos;s build something together
        </TextReveal>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-text-secondary text-lg max-w-md mx-auto mb-10 leading-relaxed"
        >
          Open to new opportunities, collaborations, and interesting conversations.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <Link
            href="/contact"
            data-cursor="hover"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl font-medium text-sm text-[#0A0A0A] bg-accent hover:bg-accent-hover transition-all duration-300"
          >
            Get in Touch
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <a
            href="mailto:dhwanilpanchani@gmail.com"
            data-cursor="hover"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-medium text-sm text-text-secondary hover:text-text-primary border border-border hover:border-border-hover transition-all duration-300"
          >
            dhwanilpanchani@gmail.com
          </a>
        </motion.div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-4"
        >
          {socials.map(({ href, icon: Icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              data-cursor="hover"
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-border text-text-tertiary hover:text-accent hover:border-accent transition-all duration-200"
            >
              <Icon className="w-4 h-4" />
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
