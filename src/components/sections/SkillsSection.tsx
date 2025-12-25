import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Skill {
  name: string;
  level: number;
  category: string;
}

const skills: Skill[] = [
  // Languages
  { name: 'Python', level: 95, category: 'Languages' },
  { name: 'Java', level: 75, category: 'Languages' },
  { name: 'SQL', level: 80, category: 'Languages' },
  // ML/DL
  { name: 'CNNs', level: 85, category: 'ML/DL' },
  { name: 'RNNs', level: 80, category: 'ML/DL' },
  { name: 'Transfer Learning', level: 85, category: 'ML/DL' },
  { name: 'TensorFlow', level: 85, category: 'ML/DL' },
  { name: 'PyTorch', level: 80, category: 'ML/DL' },
  // AI/NLP
  { name: 'LLMs', level: 90, category: 'AI/NLP' },
  { name: 'RAG Systems', level: 88, category: 'AI/NLP' },
  { name: 'LangChain', level: 90, category: 'AI/NLP' },
  { name: 'Hugging Face', level: 85, category: 'AI/NLP' },
  { name: 'NLTK', level: 80, category: 'AI/NLP' },
  // Computer Vision
  { name: 'OpenCV', level: 85, category: 'Computer Vision' },
  { name: 'YOLOv5', level: 80, category: 'Computer Vision' },
  // Tools
  { name: 'Streamlit', level: 90, category: 'Tools' },
  { name: 'Gradio', level: 85, category: 'Tools' },
  { name: 'Git', level: 85, category: 'Tools' },
  { name: 'Data Visualization', level: 85, category: 'Tools' },
];

const categories = ['Languages', 'ML/DL', 'AI/NLP', 'Computer Vision', 'Tools'];

const SkillsSection = () => {
  const [activeCategory, setActiveCategory] = useState('AI/NLP');

  const filteredSkills = skills.filter((skill) => skill.category === activeCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
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
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section id="skills" className="py-24 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/4 -right-32 w-64 h-64 bg-accent/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
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
            Technical <span className="gradient-text">Skills</span>
          </motion.h2>
          <motion.div 
            variants={itemVariants}
            className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" 
          />
          <motion.p 
            variants={itemVariants}
            className="text-muted-foreground mt-4 max-w-2xl mx-auto"
          >
            Proficient in a wide range of AI/ML technologies and tools
          </motion.p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div 
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80'
              }`}
              style={{
                boxShadow: activeCategory === category ? '0 0 20px hsl(var(--primary) / 0.4)' : 'none',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Skills Grid */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeCategory}
              className="grid gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {filteredSkills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                  className="glass-card p-6"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-foreground">{skill.name}</span>
                    <span className="text-primary font-display font-bold">{skill.level}%</span>
                  </div>
                  <div className="skill-bar">
                    <motion.div
                      className="skill-bar-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ 
                        delay: index * 0.1 + 0.3,
                        duration: 1,
                        ease: [0.22, 1, 0.36, 1]
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* All Skills Tags */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <h3 className="text-lg font-semibold mb-6 text-muted-foreground">All Technologies</h3>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {skills.map((skill, index) => (
              <motion.span
                key={skill.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.02, duration: 0.4 }}
                whileHover={{ 
                  scale: 1.1, 
                  y: -3,
                  borderColor: 'hsl(var(--primary))',
                  color: 'hsl(var(--primary))'
                }}
                className="px-4 py-2 rounded-full border border-primary/30 text-sm text-muted-foreground transition-colors duration-300 cursor-default"
              >
                {skill.name}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsSection;
