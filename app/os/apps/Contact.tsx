'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Copy, Loader2, Send } from 'lucide-react';
import { Github, Linkedin } from '../brand-icons';
import { profile } from '@/data/portfolio';
import { useOS } from '../store';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function Contact() {
  const draft = useOS((s) => s.contactDraft);
  const [form, setForm] = useState({ name: '', email: '', message: draft });
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Transmission failed');
      setStatus('sent');
      useOS.getState().setContactDraft('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transmission failed');
      setStatus('error');
    }
  }

  async function copyEmail() {
    await navigator.clipboard.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="p-5 sm:p-7">
      <span className="label">open a channel</span>
      <h2 className="mt-2 font-serif text-4xl italic text-fg">Say hello.</h2>
      <p className="mt-2 max-w-md text-[14px] text-fg-dim">
        Roles, collaborations, or a system you want a second pair of eyes on — messages land straight in my inbox.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        <button onClick={copyEmail} className="btn font-mono text-[12px]">
          {copied ? <Check className="h-4 w-4 text-phosphor" /> : <Copy className="h-4 w-4" />}
          {profile.email}
        </button>
        <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className="btn">
          <Linkedin className="h-4 w-4" /> LinkedIn
        </a>
        <a href={profile.links.github} target="_blank" rel="noreferrer" className="btn">
          <Github className="h-4 w-4" /> GitHub
        </a>
      </div>

      <AnimatePresence mode="wait">
        {status === 'sent' ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 rounded-xl border border-phosphor/30 bg-phosphor/[0.06] p-6 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-phosphor text-ink"
            >
              <Check className="h-6 w-6" />
            </motion.div>
            <p className="mt-3 font-mono text-[13px] text-phosphor">signal received</p>
            <p className="mt-1 text-[13px] text-fg-dim">Thanks — I&apos;ll get back to you soon.</p>
            <button
              onClick={() => (setStatus('idle'), setForm({ name: '', email: '', message: '' }))}
              className="btn mt-4"
            >
              Send another
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={submit}
            className="mt-6 space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="from" id="c-name">
                <input
                  id="c-name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                  className={inputCls}
                />
              </Field>
              <Field label="reply-to" id="c-email">
                <input
                  id="c-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@company.com"
                  className={inputCls}
                />
              </Field>
            </div>
            <Field label="payload" id="c-msg">
              <textarea
                id="c-msg"
                required
                rows={6}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="What are you working on?"
                className={`${inputCls} resize-none`}
              />
            </Field>
            {status === 'error' && <p className="font-mono text-[12px] text-flare">! {error}</p>}
            <button
              type="submit"
              disabled={status === 'sending'}
              className="btn-primary w-full justify-center py-2.5 disabled:opacity-60"
            >
              {status === 'sending' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> transmitting…
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" /> Transmit
                </>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputCls =
  'w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-[14px] text-fg placeholder:text-fg-faint outline-none transition-colors focus:border-phosphor/60';

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="label mb-1.5 block">
        {label}
      </label>
      {children}
    </div>
  );
}
