import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  baseX: number;
  baseY: number;
}

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animationRef = useRef<number>();
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      // More particles for denser web
      const particleCount = Math.min(150, Math.floor((window.innerWidth * window.innerHeight) / 8000));
      particlesRef.current = [];
      
      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particlesRef.current.push({
          x,
          y,
          baseX: x,
          baseY: y,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          size: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.4 + 0.2,
        });
      }
    };

    const drawParticles = () => {
      timeRef.current += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;

      // First pass: draw all web connections
      particlesRef.current.forEach((particle, i) => {
        particlesRef.current.slice(i + 1).forEach((otherParticle) => {
          const pdx = particle.x - otherParticle.x;
          const pdy = particle.y - otherParticle.y;
          const pDistance = Math.sqrt(pdx * pdx + pdy * pdy);

          // Longer connection distance for web effect
          if (pDistance < 180) {
            // Check if line is near mouse for highlight effect
            const midX = (particle.x + otherParticle.x) / 2;
            const midY = (particle.y + otherParticle.y) / 2;
            const mouseDistToLine = Math.sqrt((midX - mouseX) ** 2 + (midY - mouseY) ** 2);
            const mouseHighlight = mouseX > 0 ? Math.max(0, 1 - mouseDistToLine / 200) : 0;
            
            const baseOpacity = 0.06 * (1 - pDistance / 180);
            const lineOpacity = baseOpacity + mouseHighlight * 0.12;
            
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            
            const hue = 200 + mouseHighlight * 20;
            const lightness = 50 + mouseHighlight * 15;
            ctx.strokeStyle = `hsla(${hue}, 50%, ${lightness}%, ${lineOpacity})`;
            ctx.lineWidth = 0.3 + mouseHighlight * 0.4;
            ctx.stroke();
          }
        });
      });

      // Second pass: update positions and draw particles
      particlesRef.current.forEach((particle, i) => {
        // Mouse interaction - subtle push effect
        const dx = particle.x - mouseX;
        const dy = particle.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 120;
        
        if (distance < maxDistance && mouseX > 0) {
          const force = (maxDistance - distance) / maxDistance;
          const angle = Math.atan2(dy, dx);
          particle.x += Math.cos(angle) * force * 1.5;
          particle.y += Math.sin(angle) * force * 1.5;
        } else {
          // Slow drift back to base
          particle.x += (particle.baseX - particle.x) * 0.01;
          particle.y += (particle.baseY - particle.y) * 0.01;
        }

        // Gentle floating motion
        particle.x += particle.vx + Math.sin(timeRef.current * 0.015 + i * 0.5) * 0.1;
        particle.y += particle.vy + Math.cos(timeRef.current * 0.015 + i * 0.5) * 0.1;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Mouse proximity glow
        const mouseGlowIntensity = Math.max(0, 1 - distance / 150);
        const dotSize = particle.size + mouseGlowIntensity * 1;
        const dotOpacity = particle.opacity + mouseGlowIntensity * 0.3;

        // Draw dot
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, dotSize, 0, Math.PI * 2);
        const hue = 200 + mouseGlowIntensity * 20;
        ctx.fillStyle = `hsla(${hue}, 60%, 55%, ${dotOpacity})`;
        ctx.fill();
      });

      // Draw subtle mouse glow
      if (mouseX > 0 && mouseY > 0) {
        const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 150);
        gradient.addColorStop(0, 'hsla(200, 60%, 50%, 0.04)');
        gradient.addColorStop(1, 'hsla(200, 60%, 50%, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 150, 0, Math.PI * 2);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(drawParticles);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    resizeCanvas();
    createParticles();
    drawParticles();

    window.addEventListener('resize', () => {
      resizeCanvas();
      createParticles();
    });
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
};

export default ParticleBackground;
