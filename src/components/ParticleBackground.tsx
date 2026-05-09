import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  pulseOffset: number;
  speedMultiplier: number;
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
      // Many more particles for denser web
      const particleCount = Math.min(220, Math.floor((window.innerWidth * window.innerHeight) / 5000));
      particlesRef.current = [];
      
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          size: Math.random() * 1.4 + 0.5,
          opacity: Math.random() * 0.35 + 0.55,
          pulseOffset: Math.random() * Math.PI * 2,
          speedMultiplier: Math.random() * 0.5 + 0.75,
        });
      }
    };

    const drawParticles = () => {
      timeRef.current += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;
      const time = timeRef.current;

      // First pass: draw all web connections
      particlesRef.current.forEach((particle, i) => {
        particlesRef.current.slice(i + 1).forEach((otherParticle) => {
          const pdx = particle.x - otherParticle.x;
          const pdy = particle.y - otherParticle.y;
          const pDistance = Math.sqrt(pdx * pdx + pdy * pdy);

          // Connection distance for web effect
          if (pDistance < 150) {
            // Check if line is near mouse for highlight effect
            const midX = (particle.x + otherParticle.x) / 2;
            const midY = (particle.y + otherParticle.y) / 2;
            const mouseDistToLine = Math.sqrt((midX - mouseX) ** 2 + (midY - mouseY) ** 2);
            const mouseHighlight = mouseX > 0 ? Math.max(0, 1 - mouseDistToLine / 180) : 0;
            
            // Pulsing opacity for animation
            const pulse = Math.sin(time * 0.02 + particle.pulseOffset) * 0.015;
            const baseOpacity = (0.06 + pulse) * (1 - pDistance / 150);
            const lineOpacity = baseOpacity + mouseHighlight * 0.15;
            
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            
            ctx.strokeStyle = `rgba(255, 255, 255, ${lineOpacity})`;
            ctx.lineWidth = 0.3 + mouseHighlight * 0.5;
            ctx.stroke();
          }
        });
      });

      // Second pass: update positions and draw particles
      particlesRef.current.forEach((particle, i) => {
        // Mouse interaction - push effect
        const dx = particle.x - mouseX;
        const dy = particle.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 150;
        
        if (distance < maxDistance && mouseX > 0) {
          const force = (maxDistance - distance) / maxDistance;
          const angle = Math.atan2(dy, dx);
          particle.x += Math.cos(angle) * force * 2.5;
          particle.y += Math.sin(angle) * force * 2.5;
        }

        // Continuous flowing motion
        const waveX = Math.sin(time * 0.008 * particle.speedMultiplier + i * 0.3) * 0.4;
        const waveY = Math.cos(time * 0.006 * particle.speedMultiplier + i * 0.3) * 0.4;
        
        particle.x += particle.vx * particle.speedMultiplier + waveX;
        particle.y += particle.vy * particle.speedMultiplier + waveY;

        // Wrap around edges smoothly
        if (particle.x < -10) particle.x = canvas.width + 10;
        if (particle.x > canvas.width + 10) particle.x = -10;
        if (particle.y < -10) particle.y = canvas.height + 10;
        if (particle.y > canvas.height + 10) particle.y = -10;

        // Pulsing size animation
        const sizePulse = Math.sin(time * 0.03 + particle.pulseOffset) * 0.3;
        const mouseGlowIntensity = Math.max(0, 1 - distance / 150);
        const dotSize = particle.size + sizePulse + mouseGlowIntensity * 1.5;
        const dotOpacity = particle.opacity + mouseGlowIntensity * 0.4;

        // Always draw soft glow halo for cosmic feel
        const haloRadius = dotSize * (3 + mouseGlowIntensity * 2);
        const glow = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, haloRadius);
        glow.addColorStop(0, `rgba(200, 220, 240, ${0.14 + mouseGlowIntensity * 0.25})`);
        glow.addColorStop(0.5, `rgba(180, 200, 230, ${0.04 + mouseGlowIntensity * 0.08})`);
        glow.addColorStop(1, 'rgba(180, 200, 230, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, haloRadius, 0, Math.PI * 2);
        ctx.fill();

        // Draw dot
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, dotSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, dotOpacity * 0.9 + 0.15)})`;
        ctx.fill();
      });

      // Draw mouse glow
      if (mouseX > 0 && mouseY > 0) {
        const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 180);
        gradient.addColorStop(0, 'hsla(200, 20%, 55%, 0.05)');
        gradient.addColorStop(0.5, 'hsla(210, 12%, 50%, 0.02)');
        gradient.addColorStop(1, 'hsla(210, 12%, 50%, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 180, 0, Math.PI * 2);
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
