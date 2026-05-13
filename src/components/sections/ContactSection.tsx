import { motion } from 'framer-motion';
import { Mail, Linkedin, Github, MapPin, Send } from 'lucide-react';
import AnimatedCard from '../AnimatedCard';
import AnimatedButton from '../AnimatedButton';
import SplineScene from '../SplineScene';

const ContactSection = () => {
  const contactLinks = [
    { icon: Mail, label: 'Email', value: 'ronaldmanapuzha@gmail.com', href: 'mailto:ronaldmanapuzha@gmail.com' },
    { icon: Linkedin, label: 'LinkedIn', value: 'ronald-ritch', href: 'https://www.linkedin.com/in/ronald-ritch-5a4636266/' },
    { icon: Github, label: 'GitHub', value: 'Ron5866', href: 'https://github.com/Ron5866' },
  ];

  return (
    <section id="contact" className="py-24 relative">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
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
            Get In <span className="gradient-text">Touch</span>
          </h2>
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full origin-center" 
          />
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-muted-foreground mt-4 max-w-2xl mx-auto"
          >
            I'm always open to discussing AI/ML projects, research opportunities, or potential collaborations. Feel free to reach out!
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-[55fr_45fr] gap-12 items-center">
          {/* Left side - Contact content */}
          <div className="max-w-xl">
            <div className="grid sm:grid-cols-3 gap-6 mb-12">
              {contactLinks.map((link, index) => (
                <AnimatedCard
                  key={link.label}
                  className="glass-card p-6 text-center group cursor-pointer"
                  delay={index * 0.1}
                  hoverScale={1.05}
                >
                  <a href={link.href} target={link.label !== 'Email' ? '_blank' : undefined} rel={link.label !== 'Email' ? 'noopener noreferrer' : undefined} className="block">
                    <motion.div 
                      className="inline-flex p-4 rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300"
                      whileHover={{ rotate: 10 }}
                    >
                      <link.icon size={28} />
                    </motion.div>
                    <h3 className="font-semibold mb-1">{link.label}</h3>
                    <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors duration-300 truncate max-w-full break-all">{link.value}</p>
                  </a>
                </AnimatedCard>
              ))}
            </div>

            <AnimatedCard className="glass-card p-8 md:p-12 text-center" delay={0.4}>
              <div className="flex items-center justify-center gap-2 text-primary mb-4">
                <MapPin size={20} />
                <span className="text-sm">India</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-display font-bold mb-4">
                Let's Build Something <span className="gradient-text">Amazing</span>
              </h3>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Whether you have a project in mind, want to collaborate on AI research, or just want to connect — I'd love to hear from you!
              </p>
              <AnimatedButton asLink href="mailto:ronaldmanapuzha@gmail.com" className="btn-neon-filled inline-flex items-center gap-2">
                <Send size={18} />
                Send a Message
              </AnimatedButton>
            </AnimatedCard>
          </div>

          {/* Right side - Spline 3D Scene */}
          <motion.div 
            className="hidden lg:flex items-center justify-center w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-center w-full h-full overflow-hidden p-6 md:p-10">
              <div className="w-full max-w-[480px] h-[440px] md:h-[480px] scale-[0.85] mx-auto">
                <SplineScene
                  url="https://prod.spline.design/cbvPgiD9LNEdMnt0/scene.splinecode"
                  offset={false}
                  className="relative w-full h-full overflow-hidden bg-transparent"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
