'use client';

import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { ExternalLink, Github, Star, Zap, ArrowRight, Code } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Tag from '../shared/Tag';
import { useRef, useState } from 'react';

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
}

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const mouseX = useSpring(0, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(0, { stiffness: 500, damping: 100 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / width;
    const y = (e.clientY - top - height / 2) / height;
    
    mouseX.set(x * 20);
    mouseY.set(y * 20);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleLinkClick = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const cardTransform = useMotionTemplate`perspective(1000px) rotateX(${mouseY}deg) rotateY(${mouseX}deg) scale(1.05)`;
  const glowTransform = useMotionTemplate`translate(${mouseX}px, ${mouseY}px)`;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ transform: isHovered ? cardTransform : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="group relative h-full"
    >
      {/* 3D Glow Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"
        style={{ transform: glowTransform }}
      />
      
      <div className="h-full relative">
        <Link href={`/projects/${project.id}`} className="block h-full">
          <div className="relative glass rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 h-full flex flex-col backdrop-blur-sm">
            {/* Futuristic Header Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Featured Badge */}
            {project.featured && (
              <motion.div
                className="absolute top-4 right-4 z-20"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 200, 
                  delay: index * 0.1 + 0.3 
                }}
              >
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Featured
                </div>
              </motion.div>
            )}

            {/* Image Container with Holographic Effect */}
            <div className="relative h-56 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-600/20 to-pink-500/20" />
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Holographic Overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100"
                initial={{ x: '-100%', y: '-100%' }}
                animate={isHovered ? { x: '100%', y: '100%' } : {}}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col relative">
              {/* Title with Glow Effect */}
              <motion.h3 
                className="text-xl font-bold group-hover:text-transparent bg-gradient-to-r group-hover:from-blue-400 group-hover:via-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                {project.title}
              </motion.h3>
              
              {/* Description */}
              <motion.p 
                className="mt-3 text-sm text-gray-400 dark:text-gray-300 line-clamp-3 flex-1 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                {project.description}
              </motion.p>

              {/* Technology Grid */}
              <motion.div 
                className="mt-4 flex flex-wrap gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.4 }}
              >
                {project.technologies.slice(0, 3).map((tech, techIndex) => (
                  <motion.div
                    key={tech}
                    whileHover={{ scale: 1.05, y: -2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Tag label={tech} size="sm" />
                  </motion.div>
                ))}
                {project.technologies.length > 3 && (
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Tag
                      label={`+${project.technologies.length - 3}`}
                      size="sm"
                    />
                  </motion.div>
                )}
              </motion.div>

              {/* Action Buttons */}
              <motion.div 
                className="mt-6 flex items-center justify-between"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.5 }}
              >
                <div className="flex items-center gap-3">
                  {project.githubUrl && (
                    <motion.button
                      onClick={(e) => handleLinkClick(e, project.githubUrl!)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 group/btn"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="View GitHub repository"
                    >
                      <Github className="w-4 h-4 text-gray-300 group-hover/btn:text-white transition-colors" />
                    </motion.button>
                  )}
                  {project.liveUrl && (
                    <motion.button
                      onClick={(e) => handleLinkClick(e, project.liveUrl!)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 group/btn"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="View live project"
                    >
                      <ExternalLink className="w-4 h-4 text-gray-300 group-hover/btn:text-white transition-colors" />
                    </motion.button>
                  )}
                </div>
                
                <motion.div
                  className="flex items-center gap-2 text-sm text-gray-400 group-hover:text-white transition-colors"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span>View Details</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </Link>
      </div>
    </motion.div>
  );
};

export default ProjectCard;