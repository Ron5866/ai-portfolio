import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin } from 'lucide-react';
import AnimatedCard from '../AnimatedCard';

interface Experience {
  title: string;
  company: string;
  duration: string;
  location: string;
  description: string[];
  type: string;
}

const experiences: Experience[] = [
  {
    title: 'Machine Learning Intern',
    company: 'Infotact',
    duration: 'Summer 2024',
    location: 'Remote',
    description: [
      'Developed a legal document recommendation system using NLP techniques',
      'Implemented text classification and entity extraction for legal documents',
      'Built a search engine with semantic similarity matching',
      'Utilized Python, NLTK, and machine learning algorithms',
    ],
    type: 'Internship',
  },
  {
    title: 'Data Analytics Virtual Intern',
    company: 'Deloitte',
    duration: '2024',
    location: 'Virtual',
    description: [
      'Completed virtual internship program focused on data analytics',
      'Gained hands-on experience with data visualization tools',
      'Analyzed business datasets to derive actionable insights',
      'Developed reports and dashboards for stakeholder presentations',
    ],
    type: 'Virtual Internship',
  },
];

const ExperienceSection = () => {
  return (
    <section id="experience" className="py-24 relative">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Work <span className="gradient-text">Experience</span>
          </h2>
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full origin-center" 
          />
        </motion.div>

        <div className="max-w-3xl mx-auto relative">
          <div className="absolute left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary opacity-30" />

          {experiences.map((exp, index) => (
            <motion.div
              key={exp.company}
              className={`relative flex flex-col md:flex-row gap-8 mb-12 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div 
                className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background z-10"
                style={{ boxShadow: '0 0 15px hsl(var(--primary) / 0.5)' }}
                whileHover={{ scale: 1.3 }}
              />

              <div className={`flex-1 ml-12 md:ml-0 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                <AnimatedCard className="glass-card p-6" delay={index * 0.1} hoverScale={1.02}>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-4">
                    {exp.type}
                  </span>
                  <h3 className="text-xl font-semibold mb-1">{exp.title}</h3>
                  <div className="flex items-center gap-2 text-primary font-medium mb-3">
                    <Briefcase size={16} />
                    {exp.company}
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1"><Calendar size={14} />{exp.duration}</span>
                    <span className="flex items-center gap-1"><MapPin size={14} />{exp.location}</span>
                  </div>
                  <ul className="space-y-2">
                    {exp.description.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </AnimatedCard>
              </div>
              <div className="hidden md:block flex-1" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
