import Hero from './components/home/Hero';
import FeaturedProjects from './components/home/FeaturedProjects';
import AnimatedSection from './components/shared/AnimatedSection';

export default function Home() {
  return (
    <>
      <Hero />
      <AnimatedSection className="py-20">
        <FeaturedProjects />
      </AnimatedSection>
    </>
  );
}