'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Briefcase, MapPin, Calendar, Sparkles, TrendingUp, Code, Zap, Award, Users } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import AnimatedSection from '@/app/components/shared/AnimatedSection';
import Tag from '@/app/components/shared/Tag';
import experienceData from '@/data/experience.json';
const { experiences } = experienceData;

export default function ExperiencePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const springScroll = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

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

  const floatingIcons = [
    { icon: Code, x: 5, y: 15, delay: 0, color: "blue" },
    { icon: Zap, x: 85, y: 25, delay: 0.5, color: "purple" },
    { icon: Award, x: 15, y: 75, delay: 1, color: "emerald" },
    { icon: Users, x: 80, y: 80, delay: 1.5, color: "cyan" },
    { icon: TrendingUp, x: 90, y: 50, delay: 2, color: "pink" }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-500/20 text-blue-500",
      purple: "bg-purple-500/20 text-purple-500",
      emerald: "bg-emerald-500/20 text-emerald-500",
      cyan: "bg-cyan-500/20 text-cyan-500",
      pink: "bg-pink-500/20 text-pink-500"
    };
    return colors[color as keyof typeof colors] || "bg-blue-500/20 text-blue-500";
  };

  return (
    <div ref={containerRef} className="min-h-screen pt-24 pb-16 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient Orbs */}
        <motion.div
          className="absolute top-10 left-10 w-80 h-80 bg-gradient-to-br from-blue-500/20 via-purple-600/20 to-pink-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 60, 0],
            y: [0, -40, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-emerald-500/20 via-cyan-600/20 to-blue-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
            y: [0, 50, 0],
            rotate: [360, 180, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Floating Icons */}
        {floatingIcons.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={index}
              className={`absolute rounded-full p-3 ${getColorClasses(item.color)}`}
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
              animate={{
                y: [-20, 20, -20],
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{
                y: {
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: item.delay
                },
                rotate: {
                  duration: 25,
                  repeat: Infinity,
                  ease: "linear"
                },
                scale: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: item.delay + 0.5
                }
              }}
            >
              <Icon className="w-6 h-6" />
            </motion.div>
          );
        })}

        {/* Mouse Following Glow */}
        <motion.div
          className="absolute w-40 h-40 bg-gradient-to-br from-blue-400/25 via-purple-600/25 to-pink-400/25 rounded-full blur-3xl pointer-events-none"
          style={{
            left: mousePosition.x - 80,
            top: mousePosition.y - 80
          }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 150,
            mass: 0.5
          }}
        />
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <AnimatedSection>
          <div className="text-center mb-20">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 via-purple-600/10 to-pink-500/10 rounded-full border border-blue-500/20 mb-6"
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                duration: 0.6,
                type: "spring",
                stiffness: 200
              }}
            >
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Professional Journey
              </span>
            </motion.div>
            <motion.h1 
              className="text-5xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8,
                delay: 0.1,
                type: "spring",
                stiffness: 100
              }}
            >
              Professional
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"> Experience</span>
            </motion.h1>
            <motion.p 
              className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6,
                delay: 0.2,
                type: "spring",
                stiffness: 150
              }}
            >
              A journey through AI engineering and software development, building intelligent systems that create real impact
            </motion.p>
          </div>
        </AnimatedSection>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <motion.div 
            className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-600 to-pink-500"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />

          {experiences.map((exp, index) => (
            <AnimatedSection key={exp.id} delay={index * 0.2}>
              <motion.div
                className="relative mb-16 last:mb-0"
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ 
                  duration: 0.8,
                  type: "spring",
                  stiffness: 100,
                  damping: 20
                }}
              >
                {/* Timeline Dot */}
                <motion.div
                  className="absolute left-8 top-6 w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full border-4 border-white dark:border-gray-900 shadow-lg"
                  whileInView={{ scale: [0, 1.2, 1] }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.6,
                    delay: 0.2,
                    type: "spring",
                    stiffness: 200
                  }}
                />

                {/* Experience Card */}
                <motion.div
                  className="glass rounded-2xl p-8 border border-gray-200 dark:border-gray-800 ml-20 hover:border-blue-500/30 dark:hover:border-blue-400/30 transition-all duration-300"
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 25px 50px rgba(59, 130, 246, 0.15)",
                    y: -5
                  }}
                  transition={{ 
                    type: "spring",
                    stiffness: 200,
                    damping: 20
                  }}
                >
                  {/* Header */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    >
                      <motion.h2 
                        className="text-2xl font-bold flex items-center gap-3 mb-2"
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <motion.div
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                        >
                          <Briefcase className="text-primary" size={24} />
                        </motion.div>
                        {exp.position}
                      </motion.h2>
                      <motion.p 
                        className="text-lg font-medium text-primary"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        {exp.company}
                      </motion.p>
                    </motion.div>
                    <motion.div 
                      className="mt-4 md:mt-0 space-y-2 text-sm text-gray-600 dark:text-gray-400"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <motion.div 
                        className="flex items-center gap-2"
                        whileHover={{ x: 3 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <MapPin size={16} className="text-primary" />
                        {exp.location}
                      </motion.div>
                      <motion.div 
                        className="flex items-center gap-2"
                        whileHover={{ x: 3 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Calendar size={16} className="text-primary" />
                        {exp.startDate} - {exp.endDate}
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Description */}
                  <motion.p 
                    className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    {exp.description}
                  </motion.p>

                  {/* Achievements */}
                  <motion.div 
                    className="mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <motion.h3 
                      className="font-semibold mb-4 flex items-center gap-2"
                      whileHover={{ x: 3 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <TrendingUp size={18} className="text-primary" />
                      Key Achievements:
                    </motion.h3>
                    <div className="space-y-3">
                      {exp.achievements.map((achievement, i) => (
                        <motion.div
                          key={i}
                          className="flex items-start gap-3 text-gray-600 dark:text-gray-400"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
                          whileHover={{ x: 5 }}
                        >
                          <motion.span 
                            className="text-primary mt-1 flex-shrink-0"
                            whileHover={{ scale: 1.2, rotate: 90 }}
                            transition={{ type: "spring", stiffness: 200 }}
                          >
                            •
                          </motion.span>
                          <span className="leading-relaxed">{achievement}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Technologies */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    <motion.h3 
                      className="font-semibold mb-4 flex items-center gap-2"
                      whileHover={{ x: 3 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Code size={18} className="text-primary" />
                      Technologies:
                    </motion.h3>
                    <div className="flex flex-wrap gap-3">
                      {exp.technologies.map((tech, techIndex) => (
                        <motion.div
                          key={tech}
                          initial={{ opacity: 0, scale: 0.8, y: 10 }}
                          whileInView={{ opacity: 1, scale: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ 
                            duration: 0.3, 
                            delay: 0.9 + techIndex * 0.05,
                            type: "spring",
                            stiffness: 200
                          }}
                          whileHover={{ 
                            scale: 1.05,
                            y: -2
                          }}
                        >
                          <Tag label={tech} size="sm" />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  );
}