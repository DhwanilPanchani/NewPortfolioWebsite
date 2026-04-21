'use client';

import dynamic from 'next/dynamic';
import NavBar from './components/core/NavBar';
import Footer from './components/core/Footer';
import Hero from './components/home/Hero';
import About from './components/home/About';
import FeaturedProjects from './components/home/FeaturedProjects';
import Skills from './components/home/Skills';
import Experience from './components/home/Experience';
import ContactCTA from './components/home/ContactCTA';
import SmoothScroll from './components/ui/SmoothScroll';
import MagneticCursor from './components/ui/MagneticCursor';

const HeroCanvas = dynamic(
  () => import('./components/canvas/HeroCanvas'),
  { ssr: false }
);

export default function Home() {
  return (
    <>
      <MagneticCursor />
      <HeroCanvas />
      <SmoothScroll>
        <div className="grain relative z-10">
          <NavBar />
          <main>
            <Hero />
            <About />
            <FeaturedProjects />
            <Skills />
            <Experience />
            <ContactCTA />
          </main>
          <Footer />
        </div>
      </SmoothScroll>
    </>
  );
}
