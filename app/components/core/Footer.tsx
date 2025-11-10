'use client';

import Link from 'next/link';
import { Github, Linkedin, Mail, Heart } from 'lucide-react';
import React from 'react';

interface SocialLink {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

interface NavLink {
  href: string;
  label: string;
}

const socialLinks: SocialLink[] = [
  {
    href: 'https://github.com/DhwanilPanchani',
    icon: Github,
    label: 'GitHub',
  },
  {
    href: 'https://linkedin.com/in/dhwanilpanchani',
    icon: Linkedin,
    label: 'LinkedIn',
  },
  {
    href: 'mailto:dhwanilpanchani@gmail.com',
    icon: Mail,
    label: 'Email',
  },
];

const footerLinks: NavLink[] = [
  { href: '/projects', label: 'Projects' },
  { href: '/experience', label: 'Experience' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

const Footer: React.FC = () => {
  return (
    <footer className="glass border-t border-gray-200 dark:border-gray-800">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="text-2xl font-bold text-primary hover:text-primary-light transition-colors"
            >
              Dhwanil Panchani
            </Link>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              AI Engineer & Full-Stack Developer crafting intelligent solutions
              with passion.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
              Navigation
            </h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-base text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary-light transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
              Connect
            </h3>
            <div className="mt-4 flex space-x-6">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary-light transition-colors"
                    aria-label={link.label}
                  >
                    <Icon className="h-6 w-6" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Dhwanil Panchani. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;