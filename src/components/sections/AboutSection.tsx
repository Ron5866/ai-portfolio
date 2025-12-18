import { useEffect, useRef } from 'react';
import { GraduationCap, Brain, Cpu, Sparkles } from 'lucide-react';

const focusAreas = [
  { icon: Brain, label: 'Machine Learning' },
  { icon: Cpu, label: 'Deep Learning' },
  { icon: Sparkles, label: 'Large Language Models' },
  { icon: Brain, label: 'RAG Systems' },
];

const AboutSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.scroll-fade-up, .scroll-fade-left, .scroll-fade-right').forEach((el) => {
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
    <section id="about" className="py-24 relative" ref={sectionRef}>
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="scroll-fade-up text-3xl md:text-4xl font-display font-bold mb-4">
            About <span className="gradient-text">Me</span>
          </h2>
          <div className="scroll-fade-up delay-100 w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Bio */}
          <div className="space-y-6">
            <p className="scroll-fade-left text-lg text-muted-foreground leading-relaxed">
              I'm a passionate <span className="text-primary font-semibold">AI Engineer</span> currently 
              pursuing my B.Tech in Computer Science with a specialization in Artificial Intelligence. 
              My journey in tech is driven by a deep fascination with how machines can learn and 
              make intelligent decisions.
            </p>
            <p className="scroll-fade-left delay-100 text-lg text-muted-foreground leading-relaxed">
              I specialize in building intelligent systems using <span className="text-accent font-semibold">Machine Learning</span>, 
              <span className="text-accent font-semibold"> Deep Learning</span>, and 
              <span className="text-accent font-semibold"> Large Language Models</span>. From recommendation 
              systems to NLP-powered chatbots, I love tackling real-world problems with data-driven solutions.
            </p>

            {/* Education Card */}
            <div className="scroll-fade-left delay-200 glass-card p-6 mt-8">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <GraduationCap size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Education</h3>
                  <p className="text-foreground font-medium">B.Tech in Computer Science Engineering</p>
                  <p className="text-primary">Specialization in Artificial Intelligence</p>
                </div>
              </div>
            </div>
          </div>

          {/* Focus Areas */}
          <div className="scroll-fade-right">
            <h3 className="text-xl font-semibold mb-6 text-center lg:text-left">Focus Areas</h3>
            <div className="grid grid-cols-2 gap-4">
              {focusAreas.map((area, index) => (
                <div
                  key={area.label}
                  className="glass-card p-6 text-center group hover:scale-105 transition-transform duration-300"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="inline-flex p-4 rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <area.icon size={28} />
                  </div>
                  <p className="font-medium text-sm">{area.label}</p>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center p-4">
                <div className="text-3xl font-display font-bold text-primary text-glow">5+</div>
                <div className="text-sm text-muted-foreground">Projects</div>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl font-display font-bold text-primary text-glow">2+</div>
                <div className="text-sm text-muted-foreground">Internships</div>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl font-display font-bold text-primary text-glow">3+</div>
                <div className="text-sm text-muted-foreground">Certifications</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
