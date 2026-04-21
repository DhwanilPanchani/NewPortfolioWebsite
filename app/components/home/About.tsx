'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import TextReveal from '@/app/components/ui/TextReveal';

function CountUp({ end, prefix = '', suffix = '', decimals = 0 }: { end: number; prefix?: string; suffix?: string; decimals?: number }) {
  const [display, setDisplay] = useState(`${prefix}0${suffix}`);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current || hasStarted) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setHasStarted(true); observer.disconnect(); } },
      { threshold: 0.5 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    const startTime = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / 1600, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = eased * end;
      setDisplay(`${prefix}${decimals > 0 ? val.toFixed(decimals) : Math.round(val)}${suffix}`);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [hasStarted, end, prefix, suffix, decimals]);

  return <span ref={ref}>{display}</span>;
}

export default function About() {
  return (
    <section className="section-padding">
      <div className="max-w-7xl mx-auto">
        {/* Section label */}
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs font-mono text-accent tracking-widest uppercase block mb-6"
        >
          <span className="inline-block w-8 h-px bg-accent mr-3 align-middle" />
          About
        </motion.span>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">
          {/* Left column: Image */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
              <Image
                src="/images/profile.jpg"
                alt="Dhwanil Panchani"
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-60" />
            </div>
          </motion.div>

          {/* Right column: Text */}
          <div className="lg:col-span-3 flex flex-col justify-center">
            <TextReveal
              as="h2"
              className="font-display text-4xl lg:text-5xl font-bold text-text-primary mb-8"
            >
              I turn ideas into things people actually use
            </TextReveal>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="space-y-5 text-text-secondary text-base leading-relaxed mb-8"
            >
              <p>
                Hey, I&apos;m <span className="text-text-primary font-medium">Dhwanil</span>. I build
                things at <span className="text-accent">IpserLab</span> where my day looks like
                wiring up ML models to serve real users, designing APIs that don&apos;t
                break at 3am, and making sure the whole stack feels fast.
              </p>
              <p>
                I did my Master&apos;s at Northeastern University, and over the last
                three years I&apos;ve gone from writing my first production endpoint to
                owning entire platforms. I care about the craft, the small details,
                and shipping work I&apos;m proud of.
              </p>
            </motion.div>

            {/* Compact stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="grid grid-cols-3 gap-4 mb-8"
            >
              {[
                { end: 97.9, suffix: '%', label: 'Uptime', decimals: 1 },
                { end: 250, prefix: '<', suffix: 'ms', label: 'P95 Latency' },
                { end: 52, suffix: '%', label: 'ML Throughput Gain' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="py-4 px-4 rounded-xl bg-surface-raised border border-border"
                >
                  <div className="font-display text-lg font-bold text-text-primary">
                    <CountUp end={stat.end} prefix={stat.prefix || ''} suffix={stat.suffix} decimals={(stat as any).decimals || 0} />
                  </div>
                  <div className="text-[11px] text-text-tertiary mt-0.5 font-mono">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <Link
                href="/about"
                data-cursor="hover"
                className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-accent transition-colors group"
              >
                More about me
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
