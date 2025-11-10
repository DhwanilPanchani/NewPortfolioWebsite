'use client';

import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { Github, ExternalLink, Code, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import AnimatedSection from '../shared/AnimatedSection';
import { useRef, useState } from 'react';

const GitHubBanner = () => {
  const bannerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const mouseX = useSpring(0, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(0, { stiffness: 500, damping: 100 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!bannerRef.current) return;
    
    const { left, top, width, height } = bannerRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / width;
    const y = (e.clientY - top - height / 2) / height;
    
    mouseX.set(x * 10);
    mouseY.set(y * 10);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const bannerTransform = useMotionTemplate`perspective(1000px) rotateX(${mouseY}deg) rotateY(${mouseX}deg) scale(1.02)`;
  const glowTransform = useMotionTemplate`translate(${mouseX * 5}px, ${mouseY * 5}px)`;

  return (
    <AnimatedSection>
      <motion.div
        ref={bannerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ transform: isHovered ? bannerTransform : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative overflow-hidden"
      >
        {/* 3D Glow Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-30 blur-2xl transition-opacity duration-300"
          style={{ transform: glowTransform }}
        />

        <div className="glass rounded-2xl p-8 md:p-12 text-center relative z-10 border border-gray-200 dark:border-white/10 backdrop-blur-sm bg-white/30 dark:bg-white/5">
          {/* Animated background elements */}
          <motion.div
            className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-blue-500/20 to-purple-500/20 dark:from-blue-500/30 dark:to-purple-500/30 rounded-full filter blur-3xl opacity-20 dark:opacity-30"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-r from-pink-500/20 to-blue-500/20 dark:from-pink-500/30 dark:to-blue-500/30 rounded-full filter blur-3xl opacity-20 dark:opacity-30"
            animate={{
              x: [0, -100, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />

          {/* Floating Code Elements */}
          <motion.div
            className="absolute top-6 left-6 text-blue-500/30 dark:text-blue-400/20"
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Code size={24} />
          </motion.div>
          <motion.div
            className="absolute bottom-6 right-6 text-purple-500/30 dark:text-purple-400/20"
            animate={{
              y: [0, 10, 0],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          >
            <Zap size={24} />
          </motion.div>

          <div className="relative z-10">
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl mb-6 shadow-lg"
              whileHover={{ 
                scale: 1.1,
                rotate: [0, -10, 10, 0],
              }}
              transition={{ 
                type: "spring", 
                stiffness: 300,
                rotate: { duration: 0.5 }
              }}
            >
              <Github size={32} className="text-white" />
            </motion.div>

            <motion.h3 
              className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Explore My Code Universe
            </motion.h3>
            
            <motion.p 
              className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Dive into my open-source galaxy where code meets creativity. 
              From web applications to automation tools, witness the fusion of 
              technology and imagination in every repository.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <Link
                  href="https://github.com/dhwanilpanchani"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 font-semibold"
                >
                  <Github size={20} />
                  <span>Launch GitHub Profile</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gray-100/80 dark:bg-white/5 backdrop-blur-sm text-gray-900 dark:text-white rounded-xl border border-gray-300 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10 hover:border-gray-400 dark:hover:border-white/20 transition-all duration-300 font-semibold"
                >
                  <ExternalLink size={20} />
                  <span>Browse All Projects</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AnimatedSection>
  );
};

export default GitHubBanner;
