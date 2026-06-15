import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Tech {
  id: string;
  name: string;
  slug: string; // simpleicons slug, or '' for monogram
  description: string;
  experience: string;
  projects: number;
  tier: 'core' | 'primary' | 'secondary';
  fallback?: string;
}

const techs: Tech[] = [
  { id: 'python', name: 'Python', slug: 'python', description: 'Primary language for ML, data pipelines, and backend AI services.', experience: 'Advanced · 4+ yrs', projects: 12, tier: 'core' },
  { id: 'tensorflow', name: 'TensorFlow', slug: 'tensorflow', description: 'Deep learning framework used for CNN/RNN model training and deployment.', experience: 'Advanced · 3 yrs', projects: 6, tier: 'primary' },
  { id: 'pytorch', name: 'PyTorch', slug: 'pytorch', description: 'Research-grade DL framework for transformer and vision model experiments.', experience: 'Intermediate · 2 yrs', projects: 5, tier: 'primary' },
  { id: 'langchain', name: 'LangChain', slug: 'langchain', description: 'LLM orchestration framework for RAG pipelines and agentic workflows.', experience: 'Advanced · 2 yrs', projects: 7, tier: 'core' },
  { id: 'huggingface', name: 'Hugging Face', slug: 'huggingface', description: 'Transformers, datasets, and model hub for NLP and multimodal tasks.', experience: 'Advanced · 2 yrs', projects: 6, tier: 'primary' },
  { id: 'opencv', name: 'OpenCV', slug: 'opencv', description: 'Computer vision toolkit for image processing and real-time detection.', experience: 'Intermediate · 2 yrs', projects: 4, tier: 'primary' },
  { id: 'streamlit', name: 'Streamlit', slug: 'streamlit', description: 'Rapid AI app prototyping with interactive Python frontends.', experience: 'Advanced · 2 yrs', projects: 5, tier: 'secondary' },
  { id: 'gradio', name: 'Gradio', slug: 'gradio', description: 'Shareable ML demos with minimal UI overhead.', experience: 'Intermediate · 1 yr', projects: 3, tier: 'secondary' },
  { id: 'nltk', name: 'NLTK', slug: '', fallback: 'Nl', description: 'Classical NLP toolkit for tokenization, parsing, and corpora.', experience: 'Intermediate · 2 yrs', projects: 3, tier: 'secondary' },
  { id: 'git', name: 'Git', slug: 'git', description: 'Version control and collaborative workflows across projects.', experience: 'Advanced · 4 yrs', projects: 20, tier: 'secondary' },
  { id: 'sql', name: 'SQL', slug: 'postgresql', description: 'Relational data modeling, query optimization, and analytics.', experience: 'Intermediate · 3 yrs', projects: 6, tier: 'secondary' },
  { id: 'java', name: 'Java', slug: 'openjdk', description: 'Object-oriented systems programming and academic projects.', experience: 'Intermediate · 3 yrs', projects: 4, tier: 'secondary' },
];

const connections: [string, string][] = [
  ['python', 'tensorflow'],
  ['python', 'pytorch'],
  ['python', 'langchain'],
  ['python', 'huggingface'],
  ['python', 'opencv'],
  ['python', 'nltk'],
  ['tensorflow', 'pytorch'],
  ['langchain', 'huggingface'],
  ['huggingface', 'nltk'],
  ['opencv', 'pytorch'],
];

const tierSize: Record<Tech['tier'], string> = {
  core: 'col-span-2 row-span-2 min-h-[180px]',
  primary: 'col-span-2 row-span-1 min-h-[150px] sm:col-span-1',
  secondary: 'col-span-1 row-span-1 min-h-[140px]',
};

const TechCard = ({
  tech,
  active,
  onClick,
  index,
  cardRef,
}: {
  tech: Tech;
  active: boolean;
  onClick: () => void;
  index: number;
  cardRef: (el: HTMLDivElement | null) => void;
}) => {
  const [hovered, setHovered] = useState(false);
  const [mouse, setMouse] = useState({ x: 50, y: 50 });
  const innerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = innerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMouse({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  // Subtle float offset per card
  const floatDelay = (index % 5) * 0.4;

  return (
    <motion.div
      ref={(el) => {
        innerRef.current = el;
        cardRef(el);
      }}
      data-tech-id={tech.id}
      className={`relative ${tierSize[tech.tier]} cursor-pointer group`}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      layout
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4 + (index % 3), repeat: Infinity, ease: 'easeInOut', delay: floatDelay }}
        className="h-full w-full"
      >
        {/* Animated gradient border */}
        <div className="absolute -inset-px rounded-2xl overflow-hidden pointer-events-none">
          <motion.div
            className="absolute inset-[-100%]"
            style={{
              background: active
                ? 'conic-gradient(from 0deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--primary)))'
                : 'conic-gradient(from 0deg, hsl(var(--primary) / 0.4), transparent 30%, transparent 70%, hsl(var(--primary) / 0.4))',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: active ? 4 : 12, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        {/* Card body */}
        <div
          className="relative h-full w-full rounded-2xl p-5 flex flex-col items-center justify-center text-center backdrop-blur-xl border border-white/5 overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, hsl(var(--card) / 0.85), hsl(var(--card) / 0.55))',
            boxShadow: active
              ? '0 20px 60px -10px hsl(var(--primary) / 0.5), inset 0 1px 0 hsl(var(--primary) / 0.2)'
              : hovered
              ? '0 12px 40px -10px hsl(var(--primary) / 0.35), inset 0 1px 0 hsl(255 255 255 / 0.05)'
              : '0 4px 20px -4px hsl(220 70% 5% / 0.5)',
            transform: hovered && !active ? 'translateY(-4px)' : undefined,
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          }}
        >
          {/* Mouse-follow glow */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: `radial-gradient(circle at ${mouse.x}% ${mouse.y}%, hsl(var(--primary) / 0.25), transparent 50%)`,
            }}
          />

          {/* Pulse ring when active */}
          {active && (
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              animate={{ boxShadow: ['0 0 0 0 hsl(var(--primary) / 0.5)', '0 0 0 12px hsl(var(--primary) / 0)'] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
            />
          )}

          {/* Logo */}
          <motion.div
            className="relative z-10 flex items-center justify-center mb-3"
            animate={active ? { scale: 1.1 } : { scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            {tech.slug ? (
              <img
                src={`https://cdn.simpleicons.org/${tech.slug}/ffffff`}
                alt={`${tech.name} logo`}
                loading="lazy"
                className={`${tech.tier === 'core' ? 'w-14 h-14' : 'w-10 h-10'} object-contain drop-shadow-[0_0_12px_hsl(var(--primary)/0.5)]`}
              />
            ) : (
              <div
                className={`${tech.tier === 'core' ? 'w-14 h-14 text-2xl' : 'w-10 h-10 text-base'} rounded-xl flex items-center justify-center font-display font-bold text-primary border border-primary/30 bg-primary/5`}
              >
                {tech.fallback}
              </div>
            )}
          </motion.div>

          <h3 className={`relative z-10 font-display font-semibold ${tech.tier === 'core' ? 'text-lg' : 'text-sm'} text-foreground`}>
            {tech.name}
          </h3>

          <AnimatePresence>
            {active && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 w-full overflow-hidden"
              >
                <p className="text-xs text-muted-foreground leading-relaxed mb-3 px-1">
                  {tech.description}
                </p>
                <div className="flex items-center justify-center gap-3 text-[10px] uppercase tracking-wider">
                  <span className="px-2 py-1 rounded-full bg-primary/15 text-primary border border-primary/30">
                    {tech.experience}
                  </span>
                  <span className="px-2 py-1 rounded-full bg-accent/15 text-accent border border-accent/30">
                    {tech.projects} projects
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

interface Point { x: number; y: number; id: string; }

const TechEcosystem = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [points, setPoints] = useState<Point[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });

  const measure = () => {
    const container = containerRef.current;
    if (!container) return;
    const cRect = container.getBoundingClientRect();
    setSize({ w: cRect.width, h: cRect.height });
    const next: Point[] = [];
    for (const t of techs) {
      const el = cardRefs.current[t.id];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      next.push({
        id: t.id,
        x: r.left - cRect.left + r.width / 2,
        y: r.top - cRect.top + r.height / 2,
      });
    }
    setPoints(next);
  };

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(() => measure());
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Re-measure after expansion animations settle
    const t = setTimeout(measure, 400);
    return () => clearTimeout(t);
  }, [activeId]);

  const pointMap = Object.fromEntries(points.map((p) => [p.id, p]));

  return (
    <div ref={containerRef} className="relative">
      {/* SVG connection layer */}
      <svg
        className="absolute inset-0 pointer-events-none z-0"
        width={size.w}
        height={size.h}
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        {connections.map(([a, b], i) => {
          const pa = pointMap[a];
          const pb = pointMap[b];
          if (!pa || !pb) return null;
          const isActive = activeId === a || activeId === b;
          return (
            <g key={`${a}-${b}`}>
              <motion.line
                x1={pa.x}
                y1={pa.y}
                x2={pb.x}
                y2={pb.y}
                stroke="url(#lineGrad)"
                strokeWidth={isActive ? 1.6 : 0.8}
                strokeDasharray="4 6"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: 1,
                  opacity: activeId ? (isActive ? 0.9 : 0.12) : 0.35,
                }}
                transition={{ duration: 1.2, delay: 0.3 + i * 0.05, ease: 'easeOut' }}
              />
              {isActive && (
                <motion.circle
                  r="3"
                  fill="hsl(var(--primary))"
                  initial={{ offsetDistance: '0%' }}
                  animate={{ offsetDistance: '100%' }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
                  style={{
                    offsetPath: `path('M ${pa.x} ${pa.y} L ${pb.x} ${pb.y}')`,
                    filter: 'drop-shadow(0 0 4px hsl(var(--primary)))',
                  }}
                />
              )}
            </g>
          );
        })}
      </svg>

      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 auto-rows-[minmax(140px,auto)] gap-4 md:gap-5">
        {techs.map((tech, i) => (
          <TechCard
            key={tech.id}
            tech={tech}
            index={i}
            active={activeId === tech.id}
            onClick={() => setActiveId(activeId === tech.id ? null : tech.id)}
            cardRef={(el) => {
              cardRefs.current[tech.id] = el;
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default TechEcosystem;
