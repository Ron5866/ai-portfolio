import { Github, Download, ArrowRight } from 'lucide-react';
import TypingEffect from '../TypingEffect';
import profilePhoto from '@/assets/profile-photo.png';

const HeroSection = () => {
  const roles = [
    'AI Engineer',
    'Machine Learning Engineer',
    'LLM Specialist',
    'NLP Developer',
  ];

  const techStack = ['Python', 'TensorFlow', 'LangChain', 'PyTorch', 'OpenCV', 'Hugging Face'];

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="max-w-xl">
            {/* Hello */}
            <div className="animate-fade-in opacity-0" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-2">
                Hello<span className="text-primary">.</span>
              </h2>
            </div>

            {/* Name */}
            <h1 
              className="text-2xl md:text-3xl font-display font-medium text-muted-foreground mb-4 animate-fade-in opacity-0"
              style={{ animationDelay: '0.4s' }}
            >
              I'm <span className="text-foreground font-semibold">Ronald</span>
            </h1>

            {/* Typing Effect Role */}
            <div 
              className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-8 animate-fade-in opacity-0"
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

          {/* Right - Profile Photo with Arc */}
          <div 
            className="hidden lg:flex justify-center items-center animate-fade-in opacity-0"
            style={{ animationDelay: '0.6s' }}
          >
            <div className="relative w-[420px] h-[420px] flex items-center justify-center">
              {/* Decorative arc ring */}
              <svg 
                className="absolute inset-0 w-full h-full animate-[spin_20s_linear_infinite]"
                viewBox="0 0 420 420"
              >
                <defs>
                  <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="50%" stopColor="hsl(var(--accent))" />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                  </linearGradient>
                </defs>
                {/* Main arc */}
                <circle 
                  cx="210" 
                  cy="210" 
                  r="180" 
                  fill="none" 
                  stroke="url(#arcGradient)" 
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="400 700"
                  className="drop-shadow-[0_0_15px_hsl(var(--primary)/0.5)]"
                />
                {/* Secondary arc */}
                <circle 
                  cx="210" 
                  cy="210" 
                  r="195" 
                  fill="none" 
                  stroke="hsl(var(--primary)/0.3)" 
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="200 900"
                />
              </svg>
              
              {/* Glow background */}
              <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent blur-2xl" />
              
              {/* Profile image */}
              <img
                src={profilePhoto}
                alt="Ronald Ritch Babu"
                className="relative z-10 w-[300px] h-auto object-contain drop-shadow-[0_0_30px_hsl(var(--primary)/0.3)]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
