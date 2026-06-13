import { motion } from 'framer-motion';
import { Code, Smartphone, Server } from 'lucide-react';
import { AnimatedIconWrapper } from '../AnimatedIcon';

const services = [
  { icon: Code, label: 'AI Development' },
  { icon: Smartphone, label: 'ML Solutions' },
  { icon: Server, label: 'LLM Integration' },
];


const AboutSection = () => {
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

  const leftItemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section id="about" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left - Services */}
          <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {services.map((service, index) => (
              <motion.div
                key={service.label}
                variants={leftItemVariants}
                custom={index}
                className="flex items-center gap-4 group"
              >
                <motion.div 
                  className="p-3 rounded-lg border border-border group-hover:border-primary transition-colors duration-300"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <AnimatedIconWrapper>
                    <service.icon size={24} className="text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                  </AnimatedIconWrapper>
                </motion.div>
                <span className="text-lg font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                  {service.label}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Right - About Content */}
          <motion.div 
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <div>
              <motion.h2 
                variants={itemVariants}
                className="text-3xl md:text-4xl font-display font-bold mb-6"
              >
                About me
              </motion.h2>
              <motion.p 
                variants={itemVariants}
                className="text-muted-foreground leading-relaxed"
              >
                I'm a Computer Science and Engineering student specializing in Artificial Intelligence 
                at Parul University. I'm passionate about developing AI solutions that address real-world 
                challenges. My focus areas include Machine Learning, Deep Learning, and Large Language Models, 
                with a growing interest in RAG systems.
              </motion.p>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
