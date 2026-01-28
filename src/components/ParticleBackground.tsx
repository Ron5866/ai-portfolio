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
      const particleCount = Math.min(120, Math.floor((window.innerWidth * window.innerHeight) / 12000));
      particlesRef.current = [];
      
      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particlesRef.current.push({
          x,
          y,
          baseX: x,
          baseY: y,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 2.5 + 1,
          opacity: Math.random() * 0.6 + 0.3,
        });
      }
    };

    const drawGrid = () => {
      const gridSize = 80;
      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;
      
      // Draw subtle vertical lines
      for (let x = 0; x < canvas.width; x += gridSize) {
        const distToMouse = Math.abs(x - mouseX);
        const intensity = Math.max(0, 1 - distToMouse / 400);
        
        ctx.beginPath();
        ctx.strokeStyle = `hsla(210, 80%, 40%, ${0.015 + intensity * 0.04})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      // Draw subtle horizontal lines
      for (let y = 0; y < canvas.height; y += gridSize) {
        const distToMouse = Math.abs(y - mouseY);
        const intensity = Math.max(0, 1 - distToMouse / 400);
        
        ctx.beginPath();
        ctx.strokeStyle = `hsla(210, 80%, 40%, ${0.015 + intensity * 0.04})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };

    const drawMouseGlow = () => {
      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;
      
      if (mouseX < 0 || mouseY < 0) return;
      
      // Soft outer glow
      const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 200);
      gradient.addColorStop(0, 'hsla(200, 80%, 50%, 0.06)');
      gradient.addColorStop(0.4, 'hsla(220, 70%, 45%, 0.03)');
      gradient.addColorStop(1, 'hsla(220, 70%, 45%, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const drawParticles = () => {
      timeRef.current += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid first
      drawGrid();
      
      // Draw mouse glow
      drawMouseGlow();

      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;

      particlesRef.current.forEach((particle, i) => {
        // Mouse repulsion/attraction effect
        const dx = particle.x - mouseX;
        const dy = particle.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 200;
        
        if (distance < maxDistance && mouseX > 0) {
          const force = (maxDistance - distance) / maxDistance;
          const angle = Math.atan2(dy, dx);
          // Push particles away from mouse
          particle.x += Math.cos(angle) * force * 3;
          particle.y += Math.sin(angle) * force * 3;
        } else {
          // Return to base position slowly
          particle.x += (particle.baseX - particle.x) * 0.02;
          particle.y += (particle.baseY - particle.y) * 0.02;
        }

        // Add gentle floating motion
        particle.x += particle.vx + Math.sin(timeRef.current * 0.02 + i) * 0.2;
        particle.y += particle.vy + Math.cos(timeRef.current * 0.02 + i) * 0.2;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Calculate glow intensity based on mouse proximity
        const mouseGlowIntensity = Math.max(0, 1 - distance / 200);
        const glowSize = particle.size + mouseGlowIntensity * 2;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2);
        const hue = 200 + mouseGlowIntensity * 15;
        ctx.fillStyle = `hsla(${hue}, 70%, 55%, ${particle.opacity * 0.6 + mouseGlowIntensity * 0.2})`;
        ctx.fill();

        // Draw subtle connections between particles
        particlesRef.current.slice(i + 1).forEach((otherParticle) => {
          const pdx = particle.x - otherParticle.x;
          const pdy = particle.y - otherParticle.y;
          const pDistance = Math.sqrt(pdx * pdx + pdy * pdy);

          if (pDistance < 120) {
            const lineOpacity = 0.08 * (1 - pDistance / 120);
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `hsla(200, 60%, 50%, ${lineOpacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });

        // Draw subtle lines to mouse cursor
        if (distance < 150 && mouseX > 0) {
          const lineOpacity = 0.2 * (1 - distance / 150);
          
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(mouseX, mouseY);
          ctx.strokeStyle = `hsla(200, 70%, 55%, ${lineOpacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      });

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
