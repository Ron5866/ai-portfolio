import { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  pulseOffset: number;
}

interface Streak {
  x: number;
  y: number;
  angle: number;
  speed: number;
  length: number;
  life: number;
  maxLife: number;
}

const PALETTE = {
  base: '#020817',
  deep: '#0F172A',
  navy: '#1E3A8A',
  blue: '#2563EB',
  bright: '#3B82F6',
};

const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const streaksRef = useRef<Streak[]>([]);
  const animationRef = useRef<number>();
  const timeRef = useRef(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const isMobile = window.innerWidth < 768;

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const createParticles = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const density = isMobile ? 12000 : 7000;
      const count = Math.min(isMobile ? 40 : 90, Math.floor((w * h) / density));
      particlesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.08,
        size: Math.random() * 1.6 + 0.4,
        opacity: Math.random() * 0.25 + 0.05,
        pulseOffset: Math.random() * Math.PI * 2,
      }));
    };

    const spawnStreak = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const fromSide = Math.random() < 0.5;
      streaksRef.current.push({
        x: fromSide ? -100 : Math.random() * w,
        y: fromSide ? Math.random() * h : -100,
        angle: fromSide ? (Math.random() * 0.3 - 0.15) : (Math.PI / 2 + Math.random() * 0.3 - 0.15),
        speed: 0.4 + Math.random() * 0.5,
        length: 120 + Math.random() * 180,
        life: 0,
        maxLife: 400 + Math.random() * 300,
      });
    };

    // Pre-render gradient mesh blobs offscreen for perf
    const drawMesh = (t: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      // Base fill
      ctx.fillStyle = PALETTE.base;
      ctx.fillRect(0, 0, w, h);

      const blobs = [
        { cx: 0.2, cy: 0.3, color: PALETTE.navy, r: 0.55, sp: 0.00012 },
        { cx: 0.8, cy: 0.7, color: PALETTE.blue, r: 0.5, sp: 0.00009 },
        { cx: 0.5, cy: 0.9, color: PALETTE.deep, r: 0.6, sp: 0.00015 },
        { cx: 0.9, cy: 0.1, color: PALETTE.navy, r: 0.45, sp: 0.00011 },
      ];

      blobs.forEach((b, i) => {
        const phase = t * b.sp + i * 1.7;
        const x = (b.cx + Math.sin(phase) * 0.12) * w;
        const y = (b.cy + Math.cos(phase * 0.8) * 0.12) * h;
        const r = b.r * Math.max(w, h);
        const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
        const alpha = i === 1 ? 0.22 : 0.28;
        grad.addColorStop(0, hexA(b.color, alpha));
        grad.addColorStop(1, hexA(b.color, 0));
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      });
    };

    const drawWaves = (t: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        const yBase = h * (0.3 + i * 0.25);
        const amp = 40 + i * 20;
        const freq = 0.003 + i * 0.0005;
        const phase = t * 0.0004 + i * 1.2;
        ctx.moveTo(0, yBase);
        for (let x = 0; x <= w; x += 12) {
          const y = yBase + Math.sin(x * freq + phase) * amp + Math.sin(x * freq * 0.5 + phase * 1.3) * amp * 0.4;
          ctx.lineTo(x, y);
        }
        const grad = ctx.createLinearGradient(0, 0, w, 0);
        grad.addColorStop(0, hexA(PALETTE.bright, 0));
        grad.addColorStop(0.5, hexA(PALETTE.bright, 0.06));
        grad.addColorStop(1, hexA(PALETTE.bright, 0));
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.restore();
    };

    const drawParticles = (t: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        const pulse = (Math.sin(t * 0.0015 + p.pulseOffset) + 1) * 0.5;
        const op = p.opacity * (0.5 + pulse * 0.5);
        const halo = p.size * 4;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, halo);
        g.addColorStop(0, hexA(PALETTE.bright, op));
        g.addColorStop(1, hexA(PALETTE.bright, 0));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, halo, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    };

    const drawStreaks = () => {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      streaksRef.current = streaksRef.current.filter((s) => {
        s.life++;
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        const fade = s.life < 60 ? s.life / 60 : s.life > s.maxLife - 80 ? Math.max(0, (s.maxLife - s.life) / 80) : 1;
        const tx = s.x - Math.cos(s.angle) * s.length;
        const ty = s.y - Math.sin(s.angle) * s.length;
        const grad = ctx.createLinearGradient(tx, ty, s.x, s.y);
        grad.addColorStop(0, hexA(PALETTE.bright, 0));
        grad.addColorStop(1, hexA(PALETTE.bright, 0.35 * fade));
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();
        return s.life < s.maxLife;
      });
      ctx.restore();
    };

    let lastStreak = 0;
    const render = () => {
      timeRef.current += 1;
      const t = timeRef.current;
      drawMesh(t);
      drawWaves(t);
      drawParticles(t);
      if (t - lastStreak > 220 && streaksRef.current.length < 3 && Math.random() < 0.02) {
        spawnStreak();
        lastStreak = t;
      }
      drawStreaks();
      animationRef.current = requestAnimationFrame(render);
    };

    // Static fallback for reduced motion
    const renderStatic = () => {
      drawMesh(0);
    };

    resize();
    createParticles();

    if (reducedMotion) {
      renderStatic();
    } else {
      render();
    }

    const onResize = () => {
      resize();
      createParticles();
      if (reducedMotion) renderStatic();
    };
    window.addEventListener('resize', onResize);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', onResize);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: PALETTE.base, willChange: 'transform' }}
    />
  );
};

function hexA(hex: string, alpha: number) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export default AnimatedBackground;
