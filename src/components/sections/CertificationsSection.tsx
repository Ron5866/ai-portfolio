import { useEffect, useRef } from 'react';
import { Award, ExternalLink } from 'lucide-react';

interface Certification {
  title: string;
  issuer: string;
  icon: string;
}

const certifications: Certification[] = [
  {
    title: 'Python for Data Science',
    issuer: 'IBM',
    icon: '🐍',
  },
  {
    title: 'Generative AI Fundamentals',
    issuer: 'Google Cloud / Coursera',
    icon: '🤖',
  },
  {
    title: 'Machine Learning',
    issuer: 'Stanford / Coursera',
    icon: '🧠',
  },
  {
    title: 'Deep Learning Specialization',
    issuer: 'deeplearning.ai',
    icon: '🔬',
  },
];

const CertificationsSection = () => {
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
    <section className="py-24 relative" ref={sectionRef}>
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="scroll-fade-up text-3xl md:text-4xl font-display font-bold mb-4">
            <span className="gradient-text">Certifications</span>
          </h2>
          <div className="scroll-fade-up delay-100 w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
        </div>

        {/* Certifications Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {certifications.map((cert, index) => (
            <div
              key={cert.title}
              className="scroll-fade-up glass-card p-6 text-center group hover:scale-105 transition-all duration-300"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <div className="text-4xl mb-4">{cert.icon}</div>

              {/* Award icon */}
              <div className="inline-flex p-2 rounded-lg bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <Award size={20} />
              </div>

              {/* Title */}
              <h3 className="font-semibold text-sm mb-2 min-h-[40px] flex items-center justify-center">
                {cert.title}
              </h3>

              {/* Issuer */}
              <p className="text-xs text-muted-foreground">{cert.issuer}</p>

              {/* View link */}
              <button className="mt-4 text-xs text-primary flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mx-auto">
                <ExternalLink size={12} />
                View Certificate
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CertificationsSection;
