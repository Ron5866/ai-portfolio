import { useEffect, useRef } from 'react';
import { Mail, Linkedin, Github, MapPin, Send } from 'lucide-react';

const ContactSection = () => {
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

  const contactLinks = [
    {
      icon: Mail,
      label: 'Email',
      value: 'ronaldritchbabu@gmail.com',
      href: 'mailto:ronaldritchbabu@gmail.com',
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      value: 'ronald-ritch',
      href: 'https://www.linkedin.com/in/ronald-ritch-5a4636266/',
    },
    {
      icon: Github,
      label: 'GitHub',
      value: 'Ron5866',
      href: 'https://github.com/Ron5866',
    },
  ];

  return (
    <section id="contact" className="py-24 relative" ref={sectionRef}>
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="scroll-fade-up text-3xl md:text-4xl font-display font-bold mb-4">
            Get In <span className="gradient-text">Touch</span>
          </h2>
          <div className="scroll-fade-up delay-100 w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
          <p className="scroll-fade-up delay-200 text-muted-foreground mt-4 max-w-2xl mx-auto">
            I'm always open to discussing AI/ML projects, research opportunities, or potential collaborations. 
            Feel free to reach out!
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Contact Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {contactLinks.map((link, index) => (
              <a
                key={link.label}
                href={link.href}
                target={link.label !== 'Email' ? '_blank' : undefined}
                rel={link.label !== 'Email' ? 'noopener noreferrer' : undefined}
                className="scroll-fade-up glass-card p-6 text-center group hover:scale-105 transition-all duration-300"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex p-4 rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <link.icon size={28} />
                </div>
                <h3 className="font-semibold mb-1">{link.label}</h3>
                <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors duration-300">
                  {link.value}
                </p>
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="scroll-fade-up delay-400 text-center glass-card p-8 md:p-12">
            <div className="flex items-center justify-center gap-2 text-primary mb-4">
              <MapPin size={20} />
              <span className="text-sm">India</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-display font-bold mb-4">
              Let's Build Something <span className="gradient-text">Amazing</span>
            </h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Whether you have a project in mind, want to collaborate on AI research, 
              or just want to connect — I'd love to hear from you!
            </p>
            <a
              href="mailto:ronaldritchbabu@gmail.com"
              className="btn-neon-filled inline-flex items-center gap-2"
            >
              <Send size={18} />
              Send a Message
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
