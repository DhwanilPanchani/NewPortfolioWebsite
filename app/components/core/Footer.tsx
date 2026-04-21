'use client';

import Link from 'next/link';
import { Github, Linkedin, Mail } from 'lucide-react';

const socials = [
  { href: 'https://github.com/DhwanilPanchani', icon: Github, label: 'GitHub' },
  { href: 'https://linkedin.com/in/dhwanilpanchani', icon: Linkedin, label: 'LinkedIn' },
  { href: 'mailto:dhwanilpanchani@gmail.com', icon: Mail, label: 'Email' },
];

const links = [
  { href: '/projects', label: 'Work' },
  { href: '/experience', label: 'Experience' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Top row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-12">
          <div>
            <Link href="/" className="font-display text-xl font-bold text-text-primary inline-block mb-2">
              dhwanil<span className="text-accent">.</span>
            </Link>
            <p className="text-sm text-text-tertiary max-w-sm">
              AI Engineer & Full-Stack Developer building intelligent digital experiences.
            </p>
          </div>

          <nav className="flex flex-wrap gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-border">
          <p className="text-xs text-text-tertiary font-mono">
            &copy; {new Date().getFullYear()} Dhwanil Panchani
          </p>

          <div className="flex items-center gap-4">
            {socials.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                data-cursor="hover"
                className="w-8 h-8 flex items-center justify-center rounded-lg text-text-tertiary hover:text-accent transition-colors duration-200"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
