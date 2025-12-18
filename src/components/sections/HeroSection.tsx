import { Github, Download, ArrowDown } from 'lucide-react';
import TypingEffect from '../TypingEffect';

const HeroSection = () => {
  const roles = [
    'AI Engineer',
    'Machine Learning Engineer',
    'LLM Specialist',
    'NLP Developer',
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20">
      {/* Grid overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Pre-title */}
          <div className="animate-fade-in opacity-0" style={{ animationDelay: '0.2s' }}>
            <span className="inline-block px-4 py-2 rounded-full border border-primary/30 text-primary text-sm font-medium mb-6">
              Welcome to my portfolio
            </span>
          </div>

          {/* Name */}
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-4 animate-fade-in opacity-0"
            style={{ animationDelay: '0.4s' }}
          >
            <span className="text-foreground">Ronald Ritch</span>{' '}
            <span className="gradient-text">Babu</span>
          </h1>

          {/* Typing Effect Role */}
          <div 
            className="text-xl sm:text-2xl md:text-3xl font-tech text-primary mb-6 h-12 animate-fade-in opacity-0"
            style={{ animationDelay: '0.6s' }}
          >
            <TypingEffect texts={roles} typingSpeed={80} deletingSpeed={40} pauseDuration={2500} />
          </div>

          {/* Tagline */}
          <p 
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in opacity-0"
            style={{ animationDelay: '0.8s' }}
          >
            Building intelligent systems with Machine Learning, Large Language Models, 
            and real-world data to solve complex problems.
          </p>

          {/* CTA Buttons */}
          <div 
            className="flex flex-wrap items-center justify-center gap-4 animate-fade-in opacity-0"
            style={{ animationDelay: '1s' }}
          >
            <a
              href="#projects"
              className="btn-neon-filled flex items-center gap-2"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              View Projects
              <ArrowDown size={18} />
            </a>
            <a
              href="#"
              className="btn-neon flex items-center gap-2"
              onClick={(e) => e.preventDefault()}
            >
              <Download size={18} />
              Download Resume
            </a>
            <a
              href="https://github.com/Ron5866"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-neon flex items-center gap-2"
            >
              <Github size={18} />
              GitHub
            </a>
          </div>

          {/* Tech decoration */}
          <div 
            className="mt-16 flex items-center justify-center gap-4 text-muted-foreground text-sm animate-fade-in opacity-0"
            style={{ animationDelay: '1.2s' }}
          >
            <span className="w-12 h-px bg-gradient-to-r from-transparent to-primary/50" />
            <span>Python • TensorFlow • LangChain • PyTorch</span>
            <span className="w-12 h-px bg-gradient-to-l from-transparent to-primary/50" />
          </div>
        </div>

        {/* Scroll indicator */}
        <div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-fade-in opacity-0"
          style={{ animationDelay: '1.4s' }}
        >
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <div className="w-6 h-10 rounded-full border-2 border-primary/50 flex justify-center pt-2">
              <div className="w-1 h-2 bg-primary rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
