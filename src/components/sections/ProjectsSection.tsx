import { motion } from 'framer-motion';
import { Github, ExternalLink, BookOpen, MessageSquare, Film, Users, Brain, Dumbbell } from 'lucide-react';
import AnimatedCard from '../AnimatedCard';
import AnimatedButton from '../AnimatedButton';

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
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
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
    <section id="projects" className="py-24 relative">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.h2 
            variants={itemVariants}
            className="text-3xl md:text-4xl font-display font-bold mb-4"
          >
            Featured <span className="gradient-text">Projects</span>
          </motion.h2>
          <motion.div 
            variants={itemVariants}
            className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" 
          />
          <motion.p 
            variants={itemVariants}
            className="text-muted-foreground mt-4 max-w-2xl mx-auto"
          >
            A showcase of my AI/ML projects demonstrating problem-solving skills and technical expertise
          </motion.p>
        </motion.div>

        {/* Featured Project */}
        {projects.filter(p => p.featured).map((project) => (
          <AnimatedCard
            key={project.title}
            className="glass-card group overflow-hidden mb-8 lg:flex"
            delay={0.2}
          >
            <div className="p-8 flex-1">
              <div className="flex items-center gap-3 mb-4">
                <motion.div 
                  className="p-3 rounded-xl bg-primary/20 text-primary"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <project.icon size={28} />
                </motion.div>
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
                  <motion.span
                    key={tech}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-secondary text-muted-foreground border border-border tag-hover"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
              <div className="flex gap-3">
                <AnimatedButton
                  asLink
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-neon-filled inline-flex items-center gap-2"
                >
                  <ExternalLink size={18} />
                  View Live
                </AnimatedButton>
                <AnimatedButton
                  asLink
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-neon inline-flex items-center gap-2"
                >
                  <Github size={18} />
                  Source Code
                </AnimatedButton>
              </div>
            </div>
          </AnimatedCard>
        ))}

        {/* Other Projects Grid */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {projects.filter(p => !p.featured).map((project, index) => (
            <AnimatedCard
              key={project.title}
              className="glass-card group overflow-hidden relative"
              delay={index * 0.1}
              hoverScale={1.03}
            >
              {/* Card Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-4">
                  <motion.div 
                    className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300"
                    whileHover={{ rotate: 10 }}
                  >
                    <project.icon size={24} />
                  </motion.div>
                  <div className="flex gap-2">
                    <motion.a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors duration-300"
                      aria-label="View on GitHub"
                      whileHover={{ scale: 1.15, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Github size={20} />
                    </motion.a>
                    <motion.a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors duration-300"
                      aria-label="View project"
                      whileHover={{ scale: 1.15, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ExternalLink size={20} />
                    </motion.a>
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
                    <motion.span
                      key={tech}
                      whileHover={{ scale: 1.05 }}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-secondary text-muted-foreground"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Hover glow effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent" />
              </div>
            </AnimatedCard>
          ))}
        </motion.div>

        {/* GitHub CTA */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <AnimatedButton
            asLink
            href="https://github.com/Ron5866"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-neon inline-flex items-center gap-2"
          >
            <Github size={20} />
            View All Projects on GitHub
          </AnimatedButton>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;
