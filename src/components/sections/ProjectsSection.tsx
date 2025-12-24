import { useEffect, useRef } from 'react';
import { Github, ExternalLink, BookOpen, MessageSquare, Film, Users, Brain, Dumbbell } from 'lucide-react';

interface Project {
  title: string;
  description: string;
  techStack: string[];
  githubUrl: string;
  liveUrl?: string;
  icon: React.ElementType;
  featured?: boolean;
}

const projects: Project[] = [
  {
    title: 'FitHub - AI Fitness Tracker',
    description: 'A comprehensive AI-powered fitness tracking application that helps users achieve their fitness goals with personalized workout plans, progress tracking, and intelligent recommendations.',
    techStack: ['React', 'TypeScript', 'AI/ML', 'Tailwind CSS', 'Vercel'],
    githubUrl: 'https://github.com/Ron5866',
    liveUrl: 'https://fithub-ai.vercel.app/',
    icon: Dumbbell,
    featured: true,
  },
  {
    title: 'Book Recommendation System',
    description: 'An intelligent book recommendation engine using LangChain and vector embeddings to provide personalized suggestions based on user preferences and reading history.',
    techStack: ['Python', 'LangChain', 'Embeddings', 'Vector DB', 'Streamlit'],
    githubUrl: 'https://github.com/Ron5866',
    icon: BookOpen,
  },
  {
    title: 'Career Assistant Chatbot',
    description: 'An AI-powered chatbot that provides career guidance, resume tips, and job search assistance using natural language processing and LLM capabilities.',
    techStack: ['Python', 'LLMs', 'NLP', 'Gradio', 'RAG'],
    githubUrl: 'https://github.com/Ron5866/chat_bot',
    icon: MessageSquare,
  },
  {
    title: 'Sentiment Analysis System',
    description: 'Deep learning-based sentiment analysis combining computer vision and NLP techniques to analyze emotions from text and visual content.',
    techStack: ['Python', 'TensorFlow', 'CNN', 'NLP', 'OpenCV'],
    githubUrl: 'https://github.com/Ron5866',
    icon: Brain,
  },
  {
    title: 'Movie Recommendation System',
    description: 'A collaborative filtering-based recommendation system that suggests movies based on user preferences and viewing patterns using ML algorithms.',
    techStack: ['Python', 'Scikit-learn', 'Pandas', 'Collaborative Filtering'],
    githubUrl: 'https://github.com/Ron5866/ML_Project',
    icon: Film,
  },
  {
    title: 'Mentor Recommendation System',
    description: 'An intelligent platform that matches students with suitable mentors based on skills, interests, and learning goals using NLP and matching algorithms.',
    techStack: ['Python', 'NLP', 'Machine Learning', 'Flask'],
    githubUrl: 'https://github.com/Ron5866/mentor_recommdation',
    icon: Users,
  },
];

const ProjectsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.scroll-fade-up').forEach((el) => {
              el.classList.add('visible');
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="projects" className="py-24 relative" ref={sectionRef}>
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="scroll-fade-up text-3xl md:text-4xl font-display font-bold mb-4">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <div className="scroll-fade-up delay-100 w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
          <p className="scroll-fade-up delay-200 text-muted-foreground mt-4 max-w-2xl mx-auto">
            A showcase of my AI/ML projects demonstrating problem-solving skills and technical expertise
          </p>
        </div>

        {/* Featured Project */}
        {projects.filter(p => p.featured).map((project) => (
          <div
            key={project.title}
            className="scroll-fade-up glass-card group overflow-hidden mb-8 lg:flex"
          >
            <div className="p-8 flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-primary/20 text-primary">
                  <project.icon size={28} />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary border border-primary/30">
                  Featured Project
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                {project.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-secondary text-muted-foreground border border-border"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex gap-3">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-neon-filled inline-flex items-center gap-2"
                >
                  <ExternalLink size={18} />
                  View Live
                </a>
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-neon inline-flex items-center gap-2"
                >
                  <Github size={18} />
                  Source Code
                </a>
              </div>
            </div>
          </div>
        ))}

        {/* Other Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.filter(p => !p.featured).map((project, index) => (
            <div
              key={project.title}
              className="scroll-fade-up glass-card group overflow-hidden relative"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Card Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <project.icon size={24} />
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors duration-300"
                      aria-label="View on GitHub"
                    >
                      <Github size={20} />
                    </a>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors duration-300"
                      aria-label="View project"
                    >
                      <ExternalLink size={20} />
                    </a>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Tech Stack */}
              <div className="px-6 pb-6">
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-secondary text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hover glow effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent" />
              </div>
            </div>
          ))}
        </div>

        {/* GitHub CTA */}
        <div className="scroll-fade-up delay-600 text-center mt-12">
          <a
            href="https://github.com/Ron5866"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-neon inline-flex items-center gap-2"
          >
            <Github size={20} />
            View All Projects on GitHub
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
