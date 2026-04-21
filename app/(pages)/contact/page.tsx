'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Github, Linkedin, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('sent');
        setForm({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
    setTimeout(() => setStatus('idle'), 5000);
  };

  const socials = [
    { href: 'https://github.com/DhwanilPanchani', icon: Github, label: 'GitHub' },
    { href: 'https://linkedin.com/in/dhwanilpanchani', icon: Linkedin, label: 'LinkedIn' },
    { href: 'mailto:dhwanilpanchani@gmail.com', icon: Mail, label: 'Email' },
  ];

  return (
    <div className="min-h-screen pt-28 pb-24 px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-mono text-accent tracking-widest uppercase block mb-4"
          >
            <span className="inline-block w-8 h-px bg-accent mr-3 align-middle" />
            Let&apos;s Connect
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl lg:text-6xl font-bold text-text-primary"
          >
            Get In Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-text-secondary text-lg max-w-xl"
          >
            Open to new opportunities, collaborations, and interesting conversations.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-6"
          >
            {[
              { icon: Mail, label: 'Email', value: 'dhwanilpanchani@gmail.com', href: 'mailto:dhwanilpanchani@gmail.com' },
              { icon: MapPin, label: 'Location', value: 'San Francisco, CA', href: null },
            ].map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="rounded-xl p-5 bg-surface-raised border border-border flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-text-tertiary font-mono uppercase tracking-widest mb-0.5">{label}</p>
                  {href ? (
                    <a href={href} className="text-sm text-text-primary hover:text-accent transition-colors">{value}</a>
                  ) : (
                    <p className="text-sm text-text-primary">{value}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Socials */}
            <div>
              <p className="text-xs text-text-tertiary font-mono uppercase tracking-widest mb-4">Socials</p>
              <div className="flex gap-3">
                {socials.map(({ href, icon: Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="hover"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-text-secondary hover:text-accent border border-border hover:border-accent/40 transition-all"
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </a>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="rounded-xl p-5 bg-emerald-500/5 border border-emerald-500/15">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-subtle" />
                <p className="text-sm text-text-secondary">
                  <span className="text-emerald-400 font-semibold">Available</span> for new opportunities
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              {[
                { name: 'name', label: 'Name', type: 'text', placeholder: 'Your name' },
                { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
              ].map(({ name, label, type, placeholder }) => (
                <div key={name}>
                  <label className="block text-xs font-mono text-text-tertiary uppercase tracking-widest mb-2">
                    {label}
                  </label>
                  <input
                    type={type}
                    name={name}
                    value={form[name as keyof typeof form]}
                    onChange={handleChange}
                    required
                    placeholder={placeholder}
                    className="w-full px-4 py-3 rounded-xl text-sm text-text-primary placeholder-text-tertiary bg-surface-raised border border-border focus:border-accent focus:outline-none transition-all"
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs font-mono text-text-tertiary uppercase tracking-widest mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Tell me about your project or opportunity..."
                  className="w-full px-4 py-3 rounded-xl text-sm text-text-primary placeholder-text-tertiary bg-surface-raised border border-border focus:border-accent focus:outline-none transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'sending' || status === 'sent'}
                data-cursor="hover"
                className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold transition-all ${
                  status === 'sent'
                    ? 'bg-emerald-600 text-white'
                    : status === 'error'
                    ? 'bg-red-600/20 border border-red-500/30 text-red-400'
                    : 'bg-accent hover:bg-accent-hover text-[#0A0A0A]'
                } disabled:opacity-70`}
              >
                {status === 'sending' && (
                  <span className="w-4 h-4 border-2 border-[#0A0A0A]/30 border-t-[#0A0A0A] rounded-full animate-spin" />
                )}
                {status === 'sent' && <CheckCircle className="w-4 h-4" />}
                {status === 'error' && 'Try Again'}
                {status === 'idle' && (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
                {status === 'sending' && 'Sending...'}
                {status === 'sent' && 'Message Sent!'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
