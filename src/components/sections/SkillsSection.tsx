import { useEffect, useRef, useState } from 'react';

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
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState('AI/NLP');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
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

  const filteredSkills = skills.filter((skill) => skill.category === activeCategory);

  return (
    <section id="skills" className="py-24 relative" ref={sectionRef}>
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="scroll-fade-up text-3xl md:text-4xl font-display font-bold mb-4">
            Technical <span className="gradient-text">Skills</span>
          </h2>
          <div className="scroll-fade-up delay-100 w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
          <p className="scroll-fade-up delay-200 text-muted-foreground mt-4 max-w-2xl mx-auto">
            Proficient in a wide range of AI/ML technologies and tools
          </p>
        </div>

        {/* Category Tabs */}
        <div className="scroll-fade-up delay-300 flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80'
              }`}
              style={{
                boxShadow: activeCategory === category ? '0 0 20px hsl(var(--primary) / 0.4)' : 'none',
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-6">
            {filteredSkills.map((skill, index) => (
              <div
                key={skill.name}
                className="scroll-fade-up glass-card p-6"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold text-foreground">{skill.name}</span>
                  <span className="text-primary font-display font-bold">{skill.level}%</span>
                </div>
                <div className="skill-bar">
                  <div
                    className="skill-bar-fill"
                    style={{
                      width: isVisible ? `${skill.level}%` : '0%',
                      transitionDelay: `${index * 100 + 300}ms`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Skills Tags */}
        <div className="scroll-fade-up delay-500 mt-16 text-center">
          <h3 className="text-lg font-semibold mb-6 text-muted-foreground">All Technologies</h3>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {skills.map((skill) => (
              <span
                key={skill.name}
                className="px-4 py-2 rounded-full border border-primary/30 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors duration-300"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
