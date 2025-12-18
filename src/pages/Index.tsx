import { Helmet } from 'react-helmet-async';
import ParticleBackground from '../components/ParticleBackground';
import Navigation from '../components/Navigation';
import HeroSection from '../components/sections/HeroSection';
import AboutSection from '../components/sections/AboutSection';
import SkillsSection from '../components/sections/SkillsSection';
import ProjectsSection from '../components/sections/ProjectsSection';
import ExperienceSection from '../components/sections/ExperienceSection';
import CertificationsSection from '../components/sections/CertificationsSection';
import ContactSection from '../components/sections/ContactSection';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Ronald Ritch Babu | AI Engineer & Machine Learning Specialist</title>
        <meta 
          name="description" 
          content="AI Engineer specializing in Machine Learning, Deep Learning, LLMs, and RAG systems. Building intelligent solutions with Python, TensorFlow, and LangChain." 
        />
        <meta name="keywords" content="AI Engineer, Machine Learning, Deep Learning, LLM, RAG, Python, TensorFlow, LangChain" />
        <meta property="og:title" content="Ronald Ritch Babu | AI Engineer" />
        <meta property="og:description" content="Building intelligent systems with ML, LLMs, and real-world data" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://ronaldritchbabu.dev" />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
        {/* Particle Background */}
        <ParticleBackground />

        {/* Navigation */}
        <Navigation />

        {/* Main Content */}
        <main>
          <HeroSection />
          
          <div className="section-divider" />
          
          <AboutSection />
          
          <div className="section-divider" />
          
          <SkillsSection />
          
          <div className="section-divider" />
          
          <ProjectsSection />
          
          <div className="section-divider" />
          
          <ExperienceSection />
          
          <div className="section-divider" />
          
          <CertificationsSection />
          
          <div className="section-divider" />
          
          <ContactSection />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default Index;
