import { useEffect, useRef } from 'react';
import { Code, Smartphone, Server } from 'lucide-react';

const services = [
  { icon: Code, label: 'AI Development' },
  { icon: Smartphone, label: 'ML Solutions' },
  { icon: Server, label: 'LLM Integration' },
];

const stats = [
  { value: '5+', label: 'Completed Projects' },
  { value: '8.2', label: 'CGPA' },
  { value: '2+', label: 'Years of Experience' },
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
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left - Services */}
          <div className="space-y-6">
            {services.map((service, index) => (
              <div
                key={service.label}
                className="scroll-fade-left flex items-center gap-4 group"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="p-3 rounded-lg border border-border group-hover:border-primary transition-colors">
                  <service.icon size={24} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <span className="text-lg font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  {service.label}
                </span>
              </div>
            ))}
          </div>

          {/* Right - About Content */}
          <div className="space-y-8">
            <div>
              <h2 className="scroll-fade-up text-3xl md:text-4xl font-display font-bold mb-6">
                About me
              </h2>
              <p className="scroll-fade-up delay-100 text-muted-foreground leading-relaxed">
                I'm a Computer Science and Engineering student specializing in Artificial Intelligence 
                at Parul University. I'm passionate about developing AI solutions that address real-world 
                challenges. My focus areas include Machine Learning, Deep Learning, and Large Language Models, 
                with a growing interest in RAG systems.
              </p>
            </div>

            {/* Stats */}
            <div className="scroll-fade-up delay-200 grid grid-cols-3 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl md:text-4xl font-display font-bold text-primary">
                    {stat.value}<span className="text-accent">+</span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
