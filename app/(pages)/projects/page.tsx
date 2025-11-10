'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import ProjectGrid from '@/app/components/projects/ProjectGrid';
import GitHubBanner from '@/app/components/projects/GitHubBanner';
import AnimatedSection from '@/app/components/shared/AnimatedSection';
import { allProjects, featuredProjects } from '@/data/projects.json';
import { Sparkles, Code, Zap, Cpu, Shield, Database, Brain, Rocket } from 'lucide-react';

const categories = [
  { name: 'All', icon: Sparkles, color: 'blue' },
  { name: 'AI/ML', icon: Brain, color: 'purple' },
  { name: 'Full-Stack', icon: Code, color: 'emerald' },
  { name: 'Data Science', icon: Database, color: 'cyan' },
  { name: 'Security', icon: Shield, color: 'red' },
];

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  const allProjectsList = [...featuredProjects, ...allProjects];

  const filteredProjects =
    selectedCategory === 'All'
      ? allProjectsList
      : allProjectsList.filter((p) => p.category === selectedCategory);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const floatingElements = [
    { icon: Code, x: 10, y: 20, delay: 0, rotate: 45 },
    { icon: Zap, x: 85, y: 15, delay: 0.5, rotate: -30 },
    { icon: Cpu, x: 15, y: 70, delay: 1, rotate: 60 },
    { icon: Rocket, x: 80, y: 80, delay: 1.5, rotate: -45 },
    { icon: Brain, x: 90, y: 50, delay: 2, rotate: 30 },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'from-blue-500/20 to-cyan-500/20 text-blue-400',
      purple: 'from-purple-500/20 to-pink-500/20 text-purple-400',
      emerald: 'from-emerald-500/20 to-teal-500/20 text-emerald-400',
      cyan: 'from-cyan-500/20 to-blue-500/20 text-cyan-400',
      red: 'from-red-500/20 to-orange-500/20 text-red-400',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getButtonColors = (color: string, isActive: boolean) => {
    const colors = {
      blue: isActive ? 'bg-blue-500 text-white shadow-blue-500/50' : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30',
      purple: isActive ? 'bg-purple-500 text-white shadow-purple-500/50' : 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30',
      emerald: isActive ? 'bg-emerald-500 text-white shadow-emerald-500/50' : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30',
      cyan: isActive ? 'bg-cyan-500 text-white shadow-cyan-500/50' : 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30',
      red: isActive ? 'bg-red-500 text-white shadow-red-500/50' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div ref={containerRef} className="min-h-screen pt-24 pb-16 relative overflow-hidden">
      {/* Futuristic Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Animated Grid */}
        <motion.div 
          className="absolute inset-0 opacity-20"
          style={{ y: backgroundY }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-purple-500/10" />
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
        </motion.div>

        {/* Floating Code Elements */}
        {floatingElements.map((element, index) => {
          const Icon = element.icon;
          return (
            <motion.div
              key={index}
              className={`absolute w-16 h-16 rounded-xl bg-gradient-to-br ${getColorClasses('blue')} backdrop-blur-sm border border-white/10 flex items-center justify-center`}
              style={{ left: `${element.x}%`, top: `${element.y}%` }}
              animate={{
                y: [-30, 30, -30],
                rotate: [element.rotate, element.rotate + 360, element.rotate],
                scale: [1, 1.1, 1]
              }}
              transition={{
                y: {
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: element.delay
                },
                rotate: {
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                },
                scale: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: element.delay + 0.5
                }
              }}
            >
              <Icon className="w-8 h-8" />
            </motion.div>
          );
        })}

        {/* Particle Effects */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => {
            const left = (i * 37 + 13) % 100;
            const top = (i * 53 + 23) % 100;
            const duration = 3 + (i % 3) * 0.5;
            const delay = (i % 5) * 0.4;
            return (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                  y: [-20, -100]
                }}
                transition={{
                  duration: duration,
                  repeat: Infinity,
                  delay: delay,
                  ease: "easeOut"
                }}
              />
            );
          })}
        </div>

        {/* Mouse Following Glow */}
        <motion.div
          className="absolute w-60 h-60 bg-gradient-to-br from-blue-400/20 via-purple-600/20 to-pink-400/20 rounded-full blur-3xl pointer-events-none"
          style={{
            left: mousePosition.x - 120,
            top: mousePosition.y - 120
          }}
          transition={{
            type: "spring",
            damping: 30,
            stiffness: 200,
            mass: 0.5
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Futuristic Header */}
        <AnimatedSection>
          <div className="text-center mb-20">
            <motion.div
              className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/10 via-purple-600/10 to-pink-500/10 rounded-full border border-blue-500/20 mb-8 backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.8, y: -30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                duration: 0.8,
                type: "spring",
                stiffness: 150
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Cpu className="w-5 h-5 text-blue-500" />
              </motion.div>
              <span className="text-sm font-medium bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Innovation Lab
              </span>
            </motion.div>
            
            <motion.h1 
              className="text-6xl md:text-7xl font-bold mb-8"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 1,
                delay: 0.2,
                type: "spring",
                stiffness: 80
              }}
            >
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Future
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Projects
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8,
                delay: 0.4,
                type: "spring",
                stiffness: 120
              }}
            >
              Pushing the boundaries of technology through AI, machine learning, and innovative software solutions
            </motion.p>
          </div>
        </AnimatedSection>

        {/* Futuristic Category Filter */}
        <AnimatedSection delay={0.3}>
          <div className="mb-16">
            <motion.div 
              className="flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8,
                delay: 0.6,
                type: "spring",
                stiffness: 100
              }}
            >
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <motion.button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`group relative px-8 py-4 rounded-2xl font-medium transition-all duration-300 backdrop-blur-sm border ${
                      selectedCategory === category.name
                        ? `${getButtonColors(category.color, true)} border-transparent shadow-2xl`
                        : `${getButtonColors(category.color, false)} border-white/10 hover:border-white/20`
                    }`}
                    whileHover={{ 
                      scale: 1.05,
                      y: -2,
                      boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={selectedCategory === category.name ? { rotate: 360 } : {}}
                        transition={{ duration: 0.6 }}
                      >
                        <Icon className="w-5 h-5" />
                      </motion.div>
                      <span>{category.name}</span>
                    </div>
                    {selectedCategory === category.name && (
                      <motion.div
                        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-transparent"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          </div>
        </AnimatedSection>

        {/* Projects Grid with Fluid Animation */}
        <AnimatedSection delay={0.6} className="mb-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ 
                duration: 0.6,
                type: "spring",
                stiffness: 100
              }}
            >
              <ProjectGrid projects={filteredProjects} />
            </motion.div>
          </AnimatePresence>
        </AnimatedSection>

        {/* Enhanced GitHub Banner */}
        <AnimatedSection delay={0.8}>
          <GitHubBanner />
        </AnimatedSection>
      </div>
    </div>
  );
}