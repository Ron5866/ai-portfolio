import { useLayoutEffect, useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface Tech {
  id: string;
  name: string;
  slug: string;
  description: string;
  experience: string;
  projects: number;
  tier: 'core' | 'primary' | 'secondary';
  fallback?: string;
  iconFx: 'orbit' | 'pulse' | 'ring' | 'chain' | 'bounce' | 'flow' | 'particles' | 'glow';
}

const techs: Tech[] = [
  { id: 'python', name: 'Python', slug: 'python', description: 'Primary language for ML, data pipelines, and backend AI services.', experience: 'Advanced · 4+ yrs', projects: 12, tier: 'core', iconFx: 'orbit' },
  { id: 'tensorflow', name: 'TensorFlow', slug: 'tensorflow', description: 'Deep learning framework used for CNN/RNN model training and deployment.', experience: 'Advanced · 3 yrs', projects: 6, tier: 'primary', iconFx: 'pulse' },
  { id: 'pytorch', name: 'PyTorch', slug: 'pytorch', description: 'Research-grade DL framework for transformer and vision model experiments.', experience: 'Intermediate · 2 yrs', projects: 5, tier: 'primary', iconFx: 'ring' },
  { id: 'langchain', name: 'LangChain', slug: 'langchain', description: 'LLM orchestration framework for RAG pipelines and agentic workflows.', experience: 'Advanced · 2 yrs', projects: 7, tier: 'core', iconFx: 'chain' },
  { id: 'huggingface', name: 'Hugging Face', slug: 'huggingface', description: 'Transformers, datasets, and model hub for NLP and multimodal tasks.', experience: 'Advanced · 2 yrs', projects: 6, tier: 'primary', iconFx: 'bounce' },
  { id: 'opencv', name: 'OpenCV', slug: 'opencv', description: 'Computer vision toolkit for image processing and real-time detection.', experience: 'Intermediate · 2 yrs', projects: 4, tier: 'primary', iconFx: 'particles' },
  { id: 'streamlit', name: 'Streamlit', slug: 'streamlit', description: 'Rapid AI app prototyping with interactive Python frontends.', experience: 'Advanced · 2 yrs', projects: 5, tier: 'secondary', iconFx: 'glow' },
  { id: 'gradio', name: 'Gradio', slug: 'gradio', description: 'Shareable ML demos with minimal UI overhead.', experience: 'Intermediate · 1 yr', projects: 3, tier: 'secondary', iconFx: 'glow' },
  { id: 'nltk', name: 'NLTK', slug: '', fallback: 'Nl', description: 'Classical NLP toolkit for tokenization, parsing, and corpora.', experience: 'Intermediate · 2 yrs', projects: 3, tier: 'secondary', iconFx: 'pulse' },
  { id: 'git', name: 'Git', slug: 'git', description: 'Version control and collaborative workflows across projects.', experience: 'Advanced · 4 yrs', projects: 20, tier: 'secondary', iconFx: 'flow' },
  { id: 'sql', name: 'SQL', slug: 'postgresql', description: 'Relational data modeling, query optimization, and analytics.', experience: 'Intermediate · 3 yrs', projects: 6, tier: 'secondary', iconFx: 'glow' },
  { id: 'java', name: 'Java', slug: 'openjdk', description: 'Object-oriented systems programming and academic projects.', experience: 'Intermediate · 3 yrs', projects: 4, tier: 'secondary', iconFx: 'glow' },
];

const connections: [string, string][] = [
  ['python', 'tensorflow'],
  ['python', 'pytorch'],
  ['python', 'langchain'],
  ['python', 'huggingface'],
  ['python', 'opencv'],
  ['python', 'nltk'],
  ['python', 'sql'],
  ['tensorflow', 'pytorch'],
  ['langchain', 'huggingface'],
  ['huggingface', 'nltk'],
  ['opencv', 'pytorch'],
];

const tierSize: Record<Tech['tier'], string> = {
  core: 'col-span-2 row-span-2 min-h-[200px]',
  primary: 'col-span-2 row-span-1 min-h-[160px] sm:col-span-1',
  secondary: 'col-span-1 row-span-1 min-h-[150px]',
};

interface Burst { id: number; x: number; y: number; }

const IconFx = ({ fx, active }: { fx: Tech['iconFx']; active: boolean }) => {
  // Decorative layer behind/around the icon
  switch (fx) {
    case 'orbit':
      return (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        >
          <div className="absolute top-0 left-1/2 w-1.5 h-1.5 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary))]" />
          <div className="absolute bottom-0 left-1/2 w-1 h-1 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_8px_hsl(var(--accent))]" />
        </motion.div>
      );
    case 'pulse':
      return (
        <motion.div
          className="absolute inset-[-30%] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.35), transparent 60%)' }}
          animate={{ scale: [0.8, 1.15, 0.8], opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      );
    case 'ring':
      return (
        <>
          {[0, 1].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full border border-primary/60 pointer-events-none"
              animate={{ scale: [1, 2], opacity: [0.7, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: i * 1.2, ease: 'easeOut' }}
            />
          ))}
        </>
      );
    case 'chain':
      return (
        <motion.div className="absolute inset-[-20%] pointer-events-none flex items-center justify-between">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary"
              animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.4, 0.8] }}
              transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.25, ease: 'easeInOut' }}
            />
          ))}
        </motion.div>
      );
    case 'bounce':
      return null; // handled by icon parent
    case 'flow':
      return (
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none overflow-hidden"
          style={{
            background: 'conic-gradient(from 0deg, transparent, hsl(var(--primary) / 0.4), transparent 50%)',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />
      );
    case 'particles':
      return (
        <>
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full bg-primary pointer-events-none"
              animate={{
                x: [0, Math.cos((i / 4) * Math.PI * 2) * 22, 0],
                y: [0, Math.sin((i / 4) * Math.PI * 2) * 22, 0],
                opacity: [0.2, 1, 0.2],
              }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
            />
          ))}
        </>
      );
    case 'glow':
    default:
      return (
        <motion.div
          className="absolute inset-[-20%] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.25), transparent 70%)' }}
          animate={{ opacity: active ? [0.5, 1, 0.5] : [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      );
  }
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
  onClick: (e: React.MouseEvent) => void;
  index: number;
  cardRef: (el: HTMLDivElement | null) => void;
}) => {
  const [hovered, setHovered] = useState(false);
  const innerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // Magnetic spring offsets
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 200, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 200, damping: 18, mass: 0.6 });
  const rotateX = useTransform(sy, [-30, 30], [8, -8]);
  const rotateY = useTransform(sx, [-30, 30], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = innerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    mx.set(dx * 0.18);
    my.set(dy * 0.18);
    // Update glow via ref to avoid re-rendering the card
    if (glowRef.current) {
      const gx = ((e.clientX - rect.left) / rect.width) * 100;
      const gy = ((e.clientY - rect.top) / rect.height) * 100;
      glowRef.current.style.background = `radial-gradient(circle at ${gx}% ${gy}%, hsl(var(--primary) / 0.3), transparent 55%)`;
    }
  };

  const handleMouseLeave = () => {
    setHovered(false);
    mx.set(0);
    my.set(0);
  };

  const floatDelay = (index % 5) * 0.4;
  const floatDuration = 4 + (index % 3) * 0.7;
  const bounceY = tech.iconFx === 'bounce' ? [0, -4, 0] : 0;

  return (
    <motion.div
      ref={(el) => {
        innerRef.current = el;
        cardRef(el);
      }}
      data-tech-id={tech.id}
      className={`relative ${tierSize[tech.tier]} cursor-pointer group`}
      style={{ perspective: 800 }}
      initial={{ opacity: 0, y: 40, scale: 0.9, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: floatDuration, repeat: Infinity, ease: 'easeInOut', delay: floatDelay }}
        className="h-full w-full"
      >
        <motion.div
          style={{
            x: sx,
            y: sy,
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
          }}
          className="h-full w-full relative"
        >
          {/* Animated gradient border */}
          <div className="absolute -inset-px rounded-2xl overflow-hidden pointer-events-none">
            <motion.div
              className="absolute inset-[-100%]"
              style={{
                background: active
                  ? 'conic-gradient(from 0deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--primary)))'
                  : 'conic-gradient(from 0deg, hsl(var(--primary) / 0.5), transparent 30%, transparent 70%, hsl(var(--primary) / 0.5))',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: active ? 3 : 10, repeat: Infinity, ease: 'linear' }}
            />
          </div>

          {/* Card body */}
          <motion.div
            className="relative h-full w-full rounded-2xl p-5 flex flex-col items-center justify-center text-center backdrop-blur-xl border border-white/5 overflow-hidden"
            animate={{
              boxShadow: active
                ? '0 24px 70px -10px hsl(var(--primary) / 0.55), inset 0 1px 0 hsl(var(--primary) / 0.3)'
                : hovered
                ? '0 16px 50px -10px hsl(var(--primary) / 0.45), inset 0 1px 0 hsl(255 255 255 / 0.06)'
                : '0 4px 20px -4px hsl(220 70% 5% / 0.5)',
            }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            style={{
              background: 'linear-gradient(145deg, hsl(var(--card) / 0.85), hsl(var(--card) / 0.55))',
            }}
          >
            {/* Reflection sweep */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(115deg, transparent 30%, hsl(255 255 255 / 0.08) 45%, hsl(var(--primary) / 0.12) 50%, transparent 65%)',
              }}
              animate={{ x: ['-120%', '120%'] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: index * 0.6 }}
            />

            {/* Mouse-follow glow (updated via ref to avoid re-renders) */}
            <div
              ref={glowRef}
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            />


            {/* Pulse ring when active */}
            {active && (
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                animate={{ boxShadow: ['0 0 0 0 hsl(var(--primary) / 0.55)', '0 0 0 16px hsl(var(--primary) / 0)'] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
              />
            )}

            {/* AI energy ring behind icon when active */}
            {active && (
              <motion.div
                className="absolute top-[28%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full pointer-events-none"
                style={{
                  background:
                    'conic-gradient(from 0deg, hsl(var(--primary) / 0.6), transparent 40%, hsl(var(--accent) / 0.5), transparent 80%)',
                  filter: 'blur(6px)',
                }}
                animate={{ rotate: 360, scale: [1, 1.15, 1] }}
                transition={{
                  rotate: { duration: 4, repeat: Infinity, ease: 'linear' },
                  scale: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' },
                }}
              />
            )}

            {/* Icon container */}
            <motion.div
              className="relative z-10 flex items-center justify-center mb-3"
              animate={active ? { scale: 1.15, y: bounceY } : { scale: 1, y: bounceY }}
              transition={{
                scale: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                y: tech.iconFx === 'bounce'
                  ? { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }
                  : { duration: 0 },
              }}
            >
              <div className={`relative ${tech.tier === 'core' ? 'w-16 h-16' : 'w-12 h-12'} flex items-center justify-center`}>
                <IconFx fx={tech.iconFx} active={active || hovered} />
                {tech.slug ? (
                  <img
                    src={`https://cdn.simpleicons.org/${tech.slug}/ffffff`}
                    alt={`${tech.name} logo`}
                    loading="lazy"
                    className={`relative z-10 ${tech.tier === 'core' ? 'w-12 h-12' : 'w-9 h-9'} object-contain drop-shadow-[0_0_12px_hsl(var(--primary)/0.6)]`}
                  />
                ) : (
                  <div
                    className={`relative z-10 ${tech.tier === 'core' ? 'w-12 h-12 text-xl' : 'w-9 h-9 text-sm'} rounded-xl flex items-center justify-center font-display font-bold text-primary border border-primary/30 bg-primary/5`}
                  >
                    {tech.fallback}
                  </div>
                )}
              </div>
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
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="relative z-10 w-full overflow-hidden"
                >
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.4 }}
                    className="text-xs text-muted-foreground leading-relaxed mb-3 px-1"
                  >
                    {tech.description}
                  </motion.p>
                  <div className="flex items-center justify-center gap-2 flex-wrap text-[10px] uppercase tracking-wider">
                    {[
                      { label: tech.experience, cls: 'bg-primary/15 text-primary border-primary/30' },
                      { label: `${tech.projects} projects`, cls: 'bg-accent/15 text-accent border-accent/30' },
                    ].map((b, i) => (
                      <motion.span
                        key={b.label}
                        initial={{ opacity: 0, scale: 0.6, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.12, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className={`px-2 py-1 rounded-full border ${b.cls}`}
                      >
                        {b.label}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
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
  const [bursts, setBursts] = useState<Burst[]>([]);
  const burstId = useRef(0);

  // Parallax mouse position
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spx = useSpring(px, { stiffness: 50, damping: 20 });
  const spy = useSpring(py, { stiffness: 50, damping: 20 });
  const bgX = useTransform(spx, [-1, 1], [-20, 20]);
  const bgY = useTransform(spy, [-1, 1], [-20, 20]);
  const midX = useTransform(spx, [-1, 1], [-10, 10]);
  const midY = useTransform(spy, [-1, 1], [-10, 10]);
  const fgX = useTransform(spx, [-1, 1], [-4, 4]);
  const fgY = useTransform(spy, [-1, 1], [-4, 4]);


  const handleContainerMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    px.set(nx);
    py.set(ny);
  };

  const measure = useCallback(() => {
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
  }, []);

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(() => measure());
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  useEffect(() => {
    const t = setTimeout(measure, 450);
    return () => clearTimeout(t);
  }, [activeId, measure]);

  const handleCardClick = (techId: string) => (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const id = ++burstId.current;
      setBursts((b) => [...b, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
      setTimeout(() => setBursts((b) => b.filter((x) => x.id !== id)), 1200);
    }
    setActiveId(activeId === techId ? null : techId);
  };

  const pointMap = Object.fromEntries(points.map((p) => [p.id, p]));

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseMove={handleContainerMouseMove}
      style={{ perspective: 1200 }}
    >
      {/* Layer 1: AI energy background - light beams + neural flow */}
      <motion.div
        className="absolute inset-[-10%] pointer-events-none overflow-hidden rounded-3xl"
        style={{ x: bgX, y: bgY, opacity: 0.14 }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 20% 30%, hsl(var(--primary) / 0.6), transparent 40%), radial-gradient(circle at 80% 70%, hsl(var(--accent) / 0.5), transparent 45%)',
          }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute h-[140%] w-[2px]"
            style={{
              left: `${20 + i * 30}%`,
              top: '-20%',
              background:
                'linear-gradient(180deg, transparent, hsl(var(--primary) / 0.9), transparent)',
              filter: 'blur(2px)',
            }}
            animate={{ y: ['-20%', '20%', '-20%'], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 10 + i * 2, repeat: Infinity, ease: 'easeInOut', delay: i * 1.5 }}
          />
        ))}
      </motion.div>

      {/* Layer 2: neural connection lines */}
      <motion.svg
        className="absolute inset-0 pointer-events-none z-0"
        width={size.w}
        height={size.h}
        style={{ overflow: 'visible', x: midX, y: midY }}
      >
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.7" />
            <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.7" />
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
                strokeWidth={isActive ? 1.8 : 0.9}
                strokeDasharray="4 6"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: 1,
                  opacity: activeId ? (isActive ? 0.95 : 0.1) : 0.4,
                  strokeDashoffset: [0, -20],
                }}
                transition={{
                  pathLength: { duration: 1.2, delay: 0.3 + i * 0.05, ease: 'easeOut' },
                  opacity: { duration: 0.6 },
                  strokeDashoffset: { duration: 3, repeat: Infinity, ease: 'linear' },
                }}
              />
              {/* energy pulse always traveling */}
              <motion.circle
                r={isActive ? 3.5 : 2}
                fill="hsl(var(--primary))"
                initial={{ offsetDistance: '0%' }}
                animate={{ offsetDistance: '100%' }}
                transition={{ duration: isActive ? 1.4 : 2.6, repeat: Infinity, ease: 'linear', delay: i * 0.2 }}
                style={{
                  offsetPath: `path('M ${pa.x} ${pa.y} L ${pb.x} ${pb.y}')`,
                  filter: 'drop-shadow(0 0 5px hsl(var(--primary)))',
                  opacity: activeId ? (isActive ? 1 : 0.2) : 0.6,
                }}
              />
            </g>
          );
        })}
      </motion.svg>

      {/* Particle bursts */}
      <div className="absolute inset-0 pointer-events-none z-20 overflow-visible">
        <AnimatePresence>
          {bursts.map((burst) => (
            <ParticleBurst key={burst.id} x={burst.x} y={burst.y} />
          ))}
        </AnimatePresence>
      </div>

      {/* Layer 3: cards (parallax via motion values - no React re-renders) */}
      <motion.div
        style={{ x: fgX, y: fgY }}
        className="relative z-10 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 auto-rows-[minmax(150px,auto)] gap-4 md:gap-5"
      >
        {techs.map((tech, i) => (
          <TechCard
            key={tech.id}
            tech={tech}
            index={i}
            active={activeId === tech.id}
            onClick={handleCardClick(tech.id)}
            cardRef={(el) => {
              cardRefs.current[tech.id] = el;
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

const ParticleBurst = ({ x, y }: { x: number; y: number }) => {
  const particles = Array.from({ length: 14 });
  return (
    <div className="absolute" style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}>
      {particles.map((_, i) => {
        const angle = (i / particles.length) * Math.PI * 2;
        const dist = 50 + Math.random() * 40;
        return (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              background: 'hsl(var(--primary))',
              boxShadow: '0 0 8px hsl(var(--primary))',
              willChange: 'transform, opacity',
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos(angle) * dist,
              y: Math.sin(angle) * dist,
              opacity: 0,
              scale: 0.3,
            }}
            transition={{ duration: 0.9 + Math.random() * 0.3, ease: 'easeOut' }}
          />
        );
      })}
    </div>
  );
};

export default TechEcosystem;
