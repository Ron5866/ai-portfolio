import { motion } from 'framer-motion';
import { Github, Download, ArrowRight } from 'lucide-react';
import TypingEffect from '../TypingEffect';
import SplineScene from '../SplineScene';
import AnimatedButton from '../AnimatedButton';

const HeroSection = () => {
  const roles = [
    'AI Engineer',
    'Machine Learning Engineer',
    'LLM Specialist',
    'NLP Developer',
  ];

  const techStack = ['Python', 'TensorFlow', 'LangChain', 'PyTorch', 'OpenCV', 'Hugging Face'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Layer 1: slow animated gradient backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 hero-aurora" />
      {/* Layer 3: subtle blue glow spots */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[15%] left-[10%] w-[420px] h-[420px] rounded-full bg-[#2563EB]/10 blur-[120px] hero-glow-a" />
        <div className="absolute bottom-[10%] right-[15%] w-[520px] h-[520px] rounded-full bg-[#3B82F6]/10 blur-[140px] hero-glow-b" />
        <div className="absolute top-[40%] right-[35%] w-[300px] h-[300px] rounded-full bg-[#1E3A8A]/15 blur-[100px] hero-glow-c" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center">

          {/* Left Content */}
          <motion.div
            className="max-w-xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Intro greeting */}
            <motion.div variants={itemVariants}>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-2">
                Hey<span className="text-primary">.</span>
              </h2>
            </motion.div>

            {/* Name */}
            <motion.h1 
              variants={itemVariants}
              className="text-2xl md:text-3xl font-display font-medium text-muted-foreground mb-4"
            >
              I'm <span className="text-foreground font-semibold">Ronald</span>
            </motion.h1>

            {/* Typing Effect Role */}
            <motion.div 
              variants={itemVariants}
              className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-8"
            >
              <TypingEffect texts={roles} typingSpeed={80} deletingSpeed={40} pauseDuration={2500} />
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap items-center gap-4 mb-16"
            >
              <AnimatedButton
                asLink
                href="#projects"
                className="btn-neon-filled flex items-center gap-2"
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();
                  document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                View Projects
                <ArrowRight size={18} />
              </AnimatedButton>
              <AnimatedButton
                asLink
                href="/Ronald_Ritch_Babu_Resume.pdf"
                download="Ronald_Ritch_Babu_Resume.pdf"
                className="btn-neon flex items-center gap-2"
              >
                <Download size={18} />
                My Resume
              </AnimatedButton>
              <AnimatedButton
                asLink
                href="https://github.com/Ron5866"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-neon flex items-center gap-2"
              >
                <Github size={18} />
                GitHub
              </AnimatedButton>
            </motion.div>

            {/* Tech Stack Bar */}
            <motion.div variants={itemVariants}>
              <div className="flex flex-wrap items-center gap-6 py-4 border-t border-b border-border/50">
                {techStack.map((tech, index) => (
                  <motion.span 
                    key={tech}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: 1 + index * 0.1,
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                    whileHover={{ 
                      color: 'hsl(var(--primary))',
                      y: -2,
                      transition: { duration: 0.2 }
                    }}
                    className="text-sm text-muted-foreground cursor-default"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right - 3D Neural Network Visualization */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 1,
              delay: 0.5,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="hidden lg:flex justify-center items-center overflow-visible lg:translate-x-[10%] xl:translate-x-[12%]"
          >
            <div className="relative w-[420px] h-[420px] flex items-center justify-center overflow-visible">
              {/* Glow background */}
              <motion.div 
                className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent blur-2xl"
                animate={{ 
                  scale: [1, 1.05, 1],
                  opacity: [0.5, 0.7, 0.5]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Spline 3D Scene - oversized viewer so waving arm stays visible */}
              <SplineScene offset={false} className="relative w-full h-full overflow-visible" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
