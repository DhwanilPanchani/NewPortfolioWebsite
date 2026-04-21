'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import NavBar from '../components/core/NavBar';
import Footer from '../components/core/Footer';
import MagneticCursor from '../components/ui/MagneticCursor';
import SmoothScroll from '../components/ui/SmoothScroll';

const PageCanvas = dynamic(() => import('../components/canvas/PageCanvas'), { ssr: false });

function getCanvasVariant(pathname: string): 'rocket' | 'robot' | 'lightbulb' | 'laptop' | 'phone' | 'particles' {
  if (pathname.startsWith('/experience')) return 'rocket';
  if (pathname.startsWith('/projects')) return 'robot';
  if (pathname.startsWith('/about')) return 'lightbulb';
  if (pathname.startsWith('/education')) return 'laptop';
  if (pathname.startsWith('/contact')) return 'phone';
  return 'particles';
}

export default function PagesLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-[#0A0A0A]" />;
  }

  const variant = getCanvasVariant(pathname);

  return (
    <>
      <MagneticCursor />
      <PageCanvas variant={variant} />
      <SmoothScroll>
        <motion.div
          className="grain"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <NavBar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </motion.div>
      </SmoothScroll>
    </>
  );
}
