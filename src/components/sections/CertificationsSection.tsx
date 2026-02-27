import { motion } from 'framer-motion';
import { Award, ExternalLink } from 'lucide-react';
import AnimatedCard from '../AnimatedCard';

interface Certification {
  title: string;
  issuer: string;
  icon: string;
  link?: string;
}

const certifications: Certification[] = [
  { title: 'Python for Data Science', issuer: 'IBM', icon: '🐍', link: '/certs/ibm_python.pdf' },
  { title: 'Career Essentials in Generative AI', issuer: 'Microsoft & LinkedIn', icon: '🤖', link: '/certs/microsoft.png' },
  { title: 'Machine Learning Specialization', issuer: 'Stanford / Coursera', icon: '🧠', link: '/certs/coursera_ml.jpeg' },
  { title: 'Deep Learning Specialization', issuer: 'deeplearning.ai', icon: '🔬' },
];

const CertificationsSection = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            <span className="gradient-text">Certifications</span>
          </h2>
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full origin-center" 
          />
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {certifications.map((cert, index) => (
            <AnimatedCard
              key={cert.title}
              className="glass-card p-6 text-center group"
              delay={index * 0.1}
              hoverScale={1.05}
            >
              <motion.div 
                className="text-4xl mb-4"
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ duration: 0.2 }}
              >
                {cert.icon}
              </motion.div>
              <div className="inline-flex p-2 rounded-lg bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <Award size={20} />
              </div>
              <h3 className="font-semibold text-sm mb-2 min-h-[40px] flex items-center justify-center">
                {cert.title}
              </h3>
              <p className="text-xs text-muted-foreground">{cert.issuer}</p>
              {cert.link && (
                <motion.a
                  href={cert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 text-xs text-primary flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mx-auto"
                  whileHover={{ scale: 1.05 }}
                >
                  <ExternalLink size={12} />
                  View Certificate
                </motion.a>
              )}
            </AnimatedCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CertificationsSection;
