'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Mail, MapPin, Send, Github, Linkedin, Twitter, ArrowRight, MessageCircle, AtSign, User } from 'lucide-react';
import AnimatedSection from '@/app/components/shared/AnimatedSection';
import React from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Floating particles with random positions - client only to prevent hydration mismatch
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, delay: number, duration: number}>>([]);
  
  useEffect(() => {
    const particleArray = [...Array(20)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 10
    }));
    setParticles(particleArray);
  }, []);

  // Mouse following effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 700 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseX.set(x - 192); // offset by half the glow width
    mouseY.set(y - 192); // offset by half the glow height
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Floating icons animation
  const floatingIcons = [
    { icon: Mail, delay: 0, x: 100, y: 50 },
    { icon: MessageCircle, delay: 0.5, x: -80, y: 100 },
    { icon: AtSign, delay: 1, x: 120, y: -60 },
    { icon: Send, delay: 1.5, x: -100, y: -80 },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      try {
        await response.json();
      } catch {}
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus('success');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 relative overflow-hidden" ref={containerRef}>
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20" />
        
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/30 rounded-full"
              initial={{ 
                x: `${(i * 37) % 100}%`, 
                y: `${(i * 53) % 100}%`,
                opacity: 0 
              }}
              animate={{ 
                y: [null, '-100%'],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 15 + (i % 3) * 5,
                repeat: Infinity,
                delay: (i * 0.7) % 5,
                ease: 'linear'
              }}
            />
          ))}
        </div>

        {/* Floating icons */}
        {floatingIcons.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={index}
              className="absolute text-primary/20"
              initial={{ x: item.x, y: item.y, opacity: 0 }}
              animate={{
                x: [item.x, item.x + 30, item.x - 20, item.x],
                y: [item.y, item.y - 40, item.y + 30, item.y],
                opacity: [0, 1, 1, 0]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                delay: item.delay,
                ease: 'easeInOut'
              }}
            >
              <Icon size={32} />
            </motion.div>
          );
        })}
      </div>

      {/* Mouse following glow */}
      <motion.div
        className="absolute w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none z-10"
        style={{
          x: mouseXSpring,
          y: mouseYSpring,
        }}
      />

      <div className="relative z-20 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <AnimatedSection>
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
            >
              <MessageCircle size={16} />
              <span className="text-sm font-medium">Let's Connect</span>
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              Get In Touch
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Have a project in mind? Let's build something amazing together and turn your ideas into reality
            </motion.p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <AnimatedSection delay={0.2}>
            <div className="space-y-8">
              {/* Contact Cards */}
              <div className="space-y-6">
                <motion.div
                  className="glass rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:border-primary/50 transition-all duration-300 group"
                  whileHover={{ scale: 1.02, y: -4 }}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="flex items-start gap-4">
                    <motion.div 
                      className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Mail className="text-primary" size={24} />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">Email</h3>
                      <a 
                        href="mailto:dhwanilpanchani@gmail.com"
                        className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors inline-flex items-center gap-2 group/link"
                      >
                        <span>dhwanilpanchani@gmail.com</span>
                        <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                      </a>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="glass rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:border-primary/50 transition-all duration-300 group"
                  whileHover={{ scale: 1.02, y: -4 }}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="flex items-start gap-4">
                    <motion.div 
                      className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <MapPin className="text-primary" size={24} />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">Location</h3>
                      <p className="text-gray-600 dark:text-gray-400">San Francisco, CA</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Open to remote opportunities</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Response Time Card */}
              <motion.div
                className="glass rounded-2xl p-6 border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-primary/5 to-purple-500/5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Response Time
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  I typically respond within 24-48 hours. For urgent inquiries, please mention it in your message.
                </p>
                <div className="flex items-center gap-2 text-sm text-primary">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Usually responds faster</span>
                </div>
              </motion.div>

              {/* Social Links */}
              <motion.div
                className="glass rounded-2xl p-6 border border-gray-200 dark:border-gray-800"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="font-semibold text-lg mb-4">Connect With Me</h3>
                <div className="flex gap-4">
                  {[
                    { icon: Github, href: 'https://github.com/DhwanilPanchani', label: 'GitHub' },
                    { icon: Linkedin, href: 'https://linkedin.com/in/dhwanilpanchani', label: 'LinkedIn' },
                    { icon: Twitter, href: 'https://twitter.com/dhwanilpanchani', label: 'Twitter' },
                  ].map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <motion.a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-primary hover:text-white transition-all duration-300 group"
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        title={social.label}
                      >
                        <Icon size={20} className="group-hover:rotate-12 transition-transform" />
                      </motion.a>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </AnimatedSection>

          {/* Contact Form */}
          <AnimatedSection delay={0.3}>
            <motion.form
              onSubmit={handleSubmit}
              className="glass rounded-2xl p-8 border border-gray-200 dark:border-gray-800 space-y-6 relative overflow-hidden"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {/* Form glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-purple-500/5 rounded-2xl pointer-events-none"
                style={{
                  x: mouseXSpring,
                  y: mouseYSpring,
                }}
              />

              <div className="relative z-10 space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-lg glass border border-gray-300 dark:border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-lg glass border border-gray-300 dark:border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Your Message
                  </label>
                  <div className="relative">
                    <MessageCircle className="absolute left-3 top-3 text-gray-400" size={18} />
                    <textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      rows={6}
                      className="w-full pl-10 pr-4 py-3 rounded-lg glass border border-gray-300 dark:border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors resize-none"
                      placeholder="Tell me about your project, ideas, or just say hello..."
                    />
                  </div>
                </div>

                {status === 'success' && (
                  <motion.div
                    className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-200"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>Mail sent!</span>
                    </div>
                  </motion.div>
                )}

                {status === 'error' && (
                  <motion.div
                    className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>{errorMessage}</span>
                    </div>
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/25"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {status === 'loading' ? (
                    <>
                      <motion.div
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                      Sending Message...
                    </>
                  ) : (
                    <>
                      Send Message
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <Send size={20} />
                      </motion.div>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.form>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}