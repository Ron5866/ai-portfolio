import { Github, Download, ArrowRight } from 'lucide-react';
import TypingEffect from '../TypingEffect';

const HeroSection = () => {
  const roles = [
    'AI Engineer',
    'Machine Learning Engineer',
    'LLM Specialist',
    'NLP Developer',
  ];

  const techStack = ['Python', 'TensorFlow', 'LangChain', 'PyTorch', 'OpenCV', 'Hugging Face'];

  return (
    <section className="relative min-h-screen flex items-center pt-20">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl">
          {/* Hello */}
          <div className="animate-fade-in opacity-0" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-2">
              Hello<span className="text-primary">.</span>
            </h2>
          </div>

          {/* Name */}
          <h1 
            className="text-3xl md:text-4xl font-display font-medium text-muted-foreground mb-4 animate-fade-in opacity-0"
            style={{ animationDelay: '0.4s' }}
          >
            I'm <span className="text-foreground">Ronald</span>
          </h1>

          {/* Typing Effect Role */}
          <div 
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-8 animate-fade-in opacity-0"
            style={{ animationDelay: '0.6s' }}
          >
            <TypingEffect texts={roles} typingSpeed={80} deletingSpeed={40} pauseDuration={2500} />
          </div>

          {/* CTA Buttons */}
          <div 
            className="flex flex-wrap items-center gap-4 mb-16 animate-fade-in opacity-0"
            style={{ animationDelay: '0.8s' }}
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
              <ArrowRight size={18} />
            </a>
            <a
              href="/Ronald_Ritch_Babu_Resume.pdf"
              download="Ronald_Ritch_Babu_Resume.pdf"
              className="btn-neon flex items-center gap-2"
            >
              <Download size={18} />
              My Resume
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

          {/* Tech Stack Bar */}
          <div 
            className="animate-fade-in opacity-0"
            style={{ animationDelay: '1s' }}
          >
            <div className="flex flex-wrap items-center gap-6 py-4 border-t border-b border-border/50">
              {techStack.map((tech, index) => (
                <span 
                  key={tech}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-default"
                  style={{ animationDelay: `${1 + index * 0.1}s` }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
