'use client';

import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';
import { GraduationCap, MapPin, Calendar, BookOpen, Award, Star, Code, Brain, Database, Zap } from 'lucide-react';
import AnimatedSection from '@/app/components/shared/AnimatedSection';
import Tag from '@/app/components/shared/Tag';
import { useRef, useState, useEffect } from 'react';

// Import education data directly instead of from JSON
const education = [
  {
    "id": "northeastern-ms",
    "institution": "Northeastern University",
    "degree": "Master of Science",
    "field": "Computer Science",
    "location": "Boston, MA",
    "startDate": "Sep 2023",
    "endDate": "May 2025",
    "gpa": "3.9/4.0",
    "relevantCourses": [
      "Advanced Algorithms",
      "Machine Learning",
      "Database Design",
      "Software Engineering",
      "Computer Systems",
      "Data Mining",
      "Artificial Intelligence",
      "Distributed Systems"
    ]
  },
  {
    "id": "gtu-be",
    "institution": "Gujarat Technological University",
    "degree": "Bachelor of Engineering",
    "field": "Computer Engineering",
    "location": "Ahmedabad, India",
    "startDate": "Aug 2019",
    "endDate": "May 2023",
    "gpa": "3.8/4.0",
    "relevantCourses": [
      "Data Structures & Algorithms",
      "Object Oriented Programming",
      "Database Management Systems",
      "Computer Networks",
      "Operating Systems",
      "Software Engineering",
      "Web Technologies",
      "Cloud Computing"
    ]
  }
];

export default function EducationPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
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

  const floatingIcons = [
    { icon: BookOpen, x: 10, y: 20, delay: 0, color: 'blue' },
    { icon: Award, x: 85, y: 15, delay: 0.5, color: 'purple' },
    { icon: Code, x: 15, y: 70, delay: 1, color: 'emerald' },
    { icon: Brain, x: 80, y: 80, delay: 1.5, color: 'pink' },
    { icon: Database, x: 90, y: 50, delay: 2, color: 'cyan' },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'from-blue-500/20 to-cyan-500/20 text-blue-600 dark:text-blue-400',
      purple: 'from-purple-500/20 to-pink-500/20 text-purple-600 dark:text-purple-400',
      emerald: 'from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400',
      pink: 'from-pink-500/20 to-rose-500/20 text-pink-600 dark:text-pink-400',
      cyan: 'from-cyan-500/20 to-blue-500/20 text-cyan-600 dark:text-cyan-400',
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

        {/* Floating Icons */}
        {floatingIcons.map((element, index) => {
          const Icon = element.icon;
          return (
            <motion.div
              key={index}
              className={`absolute w-12 h-12 rounded-lg bg-gradient-to-br ${getColorClasses(element.color)} backdrop-blur-sm border border-white/10 flex items-center justify-center`}
              style={{ left: `${element.x}%`, top: `${element.y}%` }}
              animate={{
                y: [-20, 20, -20],
                rotate: [0, 360, 0],
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
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear"
                },
                scale: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: element.delay + 0.5
                }
              }}
            >
              <Icon className="w-6 h-6" />
            </motion.div>
          );
        })}

        {/* Particle Effects */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => {
            const left = (i * 41 + 17) % 100;
            const top = (i * 47 + 29) % 100;
            const duration = 4 + (i % 3) * 0.5;
            const delay = (i % 4) * 0.3;
            return (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-blue-400/40 rounded-full"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.2, 0],
                  y: [-15, -80]
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
          className="absolute w-48 h-48 bg-gradient-to-br from-blue-400/20 via-purple-600/20 to-pink-400/20 rounded-full blur-3xl pointer-events-none"
          style={{
            left: mousePosition.x - 96,
            top: mousePosition.y - 96
          }}
          transition={{
            type: "spring",
            damping: 30,
            stiffness: 200,
            mass: 0.5
          }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
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
                <BookOpen className="w-5 h-5 text-blue-500" />
              </motion.div>
              <span className="text-sm font-medium bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Academic Journey
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
                Academic
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Excellence
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
              Building a strong foundation through world-class education and continuous learning
            </motion.p>
          </div>
        </AnimatedSection>

        {/* Education Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 opacity-30" />
          
          <div className="space-y-12">
            {education.map((edu, index) => (
              <AnimatedSection key={edu.id} delay={index * 0.2}>
                <motion.div
                  className="relative flex items-start gap-8"
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.8,
                    type: "spring",
                    stiffness: 100
                  }}
                >
                  {/* Timeline Dot */}
                  <motion.div
                    className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 shadow-lg"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <GraduationCap className="w-8 h-8 text-white" />
                  </motion.div>

                  {/* Education Card */}
                  <motion.div
                    className="flex-1 glass rounded-2xl p-8 border border-gray-200 dark:border-gray-800 backdrop-blur-sm bg-white/30 dark:bg-white/5"
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: "0 20px 40px rgba(59, 130, 246, 0.15)"
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                      <div className="flex-1">
                        <motion.h2 
                          className="text-2xl md:text-3xl font-bold flex items-center gap-3 mb-2"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.1 }}
                        >
                          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            {edu.degree}
                          </span>
                        </motion.h2>
                        <motion.p 
                          className="text-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.2 }}
                        >
                          {edu.field}
                        </motion.p>
                        <motion.p 
                          className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-1"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 }}
                        >
                          {edu.institution}
                        </motion.p>
                      </div>
                      <div className="mt-4 md:mt-0 space-y-3 text-sm">
                        <motion.div 
                          className="flex items-center gap-3 text-gray-600 dark:text-gray-400 bg-gray-100/50 dark:bg-gray-800/30 rounded-lg px-4 py-2"
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.4 }}
                        >
                          <MapPin size={16} className="text-blue-500" />
                          {edu.location}
                        </motion.div>
                        <motion.div 
                          className="flex items-center gap-3 text-gray-600 dark:text-gray-400 bg-gray-100/50 dark:bg-gray-800/30 rounded-lg px-4 py-2"
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.5 }}
                        >
                          <Calendar size={16} className="text-purple-500" />
                          {edu.startDate} - {edu.endDate}
                        </motion.div>
                      </div>
                    </div>

                    {/* Relevant Courses */}
                    {edu.relevantCourses && edu.relevantCourses.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 }}
                      >
                        <motion.h3 
                          className="font-semibold mb-4 flex items-center gap-2"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.7 }}
                        >
                          <Star className="w-5 h-5 text-yellow-500" />
                          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Key Focus Areas
                          </span>
                        </motion.h3>
                        <div className="mt-4 flex flex-wrap gap-3">
                          {edu.relevantCourses.map((course: string, courseIndex: number) => (
                            <motion.div
                              key={courseIndex}
                              initial={{ opacity: 0, scale: 0.8 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.8 + courseIndex * 0.1 }}
                            >
                              <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/10 via-purple-600/10 to-pink-500/10 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 border border-blue-500/20 backdrop-blur-sm">
                                {course}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                        {edu.id === 'northeastern-ms' && (
                          <motion.div
                            className="mt-8"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.9 }}
                          >
                            <motion.a
                              href="/documents/diploma.pdf"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Award className="w-5 h-5" />
                              <span>View Credentials</span>
                              <Zap className="w-4 h-4" />
                            </motion.a>
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}