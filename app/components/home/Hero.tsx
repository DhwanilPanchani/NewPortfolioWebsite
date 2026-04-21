'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Download } from 'lucide-react';
import { gsap } from 'gsap';

const ROLES = ['AI Engineer', 'Full-Stack Developer', 'ML Engineer'];

function useRoleRotation() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % ROLES.length), 3000);
    return () => clearInterval(t);
  }, []);
  return ROLES[index];
}

function CountUp({ end, suffix = '', duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current || hasStarted) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [hasStarted, end, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function Hero() {
  const role = useRoleRotation();
  const nameRef = useRef<HTMLHeadingElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!nameRef.current || hasAnimated.current) return;
    hasAnimated.current = true;

    const el = nameRef.current;
    const text = el.textContent || '';
    el.innerHTML = '';

    text.split('').forEach((char) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.display = 'inline-block';
      span.style.transform = 'translateY(120%)';
      span.style.opacity = '0';
      el.appendChild(span);
    });

    gsap.to(el.children, {
      y: '0%',
      opacity: 1,
      duration: 0.7,
      stagger: 0.04,
      delay: 0.8,
      ease: 'power3.out',
    });
  }, []);

  return (
    <section className="relative min-h-screen flex items-center">
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-24 w-full">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 text-xs font-mono text-text-secondary tracking-widest uppercase">
              <span className="w-8 h-px bg-accent" />
              Portfolio 2026
            </span>
          </motion.div>

          {/* Name */}
          <h1
            ref={nameRef}
            className="font-display text-[clamp(2.2rem,7vw,5.5rem)] font-bold text-text-primary leading-[0.95] tracking-tighter mb-6"
            style={{ overflow: 'hidden' }}
          >
            Dhwanil Panchani
          </h1>

          {/* Rotating role */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.6 }}
            className="h-10 mb-8 overflow-hidden"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={role}
                className="block font-display text-xl sm:text-2xl font-medium text-accent"
                initial={{ y: 28, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -28, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                {role}
              </motion.span>
            </AnimatePresence>
          </motion.div>

          {/* Bio */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg text-text-secondary max-w-lg leading-relaxed mb-12"
          >
            I build AI powered products and full stack systems that
            people actually enjoy using. Currently making things at IpserLab.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.0, duration: 0.6 }}
            className="flex flex-wrap items-center gap-4"
          >
            <Link
              href="/projects"
              data-cursor="hover"
              className="group inline-flex items-center gap-3 px-6 py-3.5 rounded-xl font-medium text-sm text-[#0A0A0A] bg-accent hover:bg-accent-hover transition-all duration-300"
            >
              View Work
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="/documents/resume.pdf"
              download="Dhwanil_Panchani_Resume.pdf"
              data-cursor="hover"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium text-sm text-text-secondary hover:text-text-primary border border-border hover:border-border-hover transition-all duration-300"
            >
              <Download className="w-4 h-4" />
              Resume
            </a>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.4, duration: 0.8 }}
            className="flex items-center gap-12 mt-20"
          >
            {[
              { end: 3, suffix: '+', label: 'Years' },
              { end: 15, suffix: '+', label: 'Projects' },
              { end: 100, suffix: 'K+', label: 'Users' },
            ].map((stat) => (
              <div key={stat.label}>
                <span className="font-display text-2xl font-bold text-text-primary">
                  <CountUp end={stat.end} suffix={stat.suffix} duration={1800} />
                </span>
                <span className="block text-xs text-text-tertiary mt-0.5 font-mono">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.0, duration: 0.8 }}
      >
        <motion.div
          className="w-px h-16 bg-gradient-to-b from-accent/50 to-transparent"
          animate={{ scaleY: [0, 1, 0], originY: 0 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  );
}
