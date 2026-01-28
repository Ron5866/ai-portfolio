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
      const gridSize = 60;
      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;
      
      ctx.strokeStyle = 'hsla(210, 100%, 50%, 0.03)';
      ctx.lineWidth = 1;
      
      // Draw vertical lines
      for (let x = 0; x < canvas.width; x += gridSize) {
        const distToMouse = Math.abs(x - mouseX);
        const intensity = Math.max(0, 1 - distToMouse / 300);
        
        ctx.beginPath();
        ctx.strokeStyle = `hsla(210, 100%, 60%, ${0.03 + intensity * 0.15})`;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      // Draw horizontal lines
      for (let y = 0; y < canvas.height; y += gridSize) {
        const distToMouse = Math.abs(y - mouseY);
        const intensity = Math.max(0, 1 - distToMouse / 300);
        
        ctx.beginPath();
        ctx.strokeStyle = `hsla(210, 100%, 60%, ${0.03 + intensity * 0.15})`;
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };

    const drawMouseGlow = () => {
      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;
      
      if (mouseX < 0 || mouseY < 0) return;
      
      // Outer glow
      const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 250);
      gradient.addColorStop(0, 'hsla(200, 100%, 60%, 0.15)');
      gradient.addColorStop(0.3, 'hsla(220, 100%, 50%, 0.08)');
      gradient.addColorStop(0.6, 'hsla(260, 100%, 60%, 0.04)');
      gradient.addColorStop(1, 'hsla(260, 100%, 60%, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Inner pulse glow
      const pulseSize = 80 + Math.sin(timeRef.current * 0.05) * 20;
      const innerGradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, pulseSize);
      innerGradient.addColorStop(0, 'hsla(195, 100%, 70%, 0.25)');
      innerGradient.addColorStop(0.5, 'hsla(220, 100%, 60%, 0.1)');
      innerGradient.addColorStop(1, 'hsla(220, 100%, 60%, 0)');
      
      ctx.fillStyle = innerGradient;
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, pulseSize, 0, Math.PI * 2);
      ctx.fill();
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
        const mouseGlowIntensity = Math.max(0, 1 - distance / 250);
        const glowSize = particle.size + mouseGlowIntensity * 4;
        
        // Draw particle glow
        if (mouseGlowIntensity > 0) {
          const particleGlow = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, glowSize * 3
          );
          particleGlow.addColorStop(0, `hsla(195, 100%, 70%, ${mouseGlowIntensity * 0.5})`);
          particleGlow.addColorStop(1, 'hsla(195, 100%, 70%, 0)');
          ctx.fillStyle = particleGlow;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, glowSize * 3, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2);
        const hue = 195 + mouseGlowIntensity * 30;
        const lightness = 50 + mouseGlowIntensity * 20;
        ctx.fillStyle = `hsla(${hue}, 100%, ${lightness}%, ${particle.opacity + mouseGlowIntensity * 0.3})`;
        ctx.fill();

        // Draw connections between particles
        particlesRef.current.slice(i + 1).forEach((otherParticle) => {
          const pdx = particle.x - otherParticle.x;
          const pdy = particle.y - otherParticle.y;
          const pDistance = Math.sqrt(pdx * pdx + pdy * pdy);

          if (pDistance < 150) {
            const lineOpacity = 0.2 * (1 - pDistance / 150);
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `hsla(200, 100%, 60%, ${lineOpacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        });

        // Draw lines to mouse cursor with enhanced visibility
        if (distance < 200 && mouseX > 0) {
          const lineOpacity = 0.6 * (1 - distance / 200);
          
          // Draw glowing line to mouse
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(mouseX, mouseY);
          
          // Create gradient for the line
          const lineGradient = ctx.createLinearGradient(particle.x, particle.y, mouseX, mouseY);
          lineGradient.addColorStop(0, `hsla(195, 100%, 70%, ${lineOpacity})`);
          lineGradient.addColorStop(1, `hsla(280, 100%, 70%, ${lineOpacity * 0.8})`);
          
          ctx.strokeStyle = lineGradient;
          ctx.lineWidth = 1.5 + (1 - distance / 200) * 1.5;
          ctx.stroke();
        }
      });

      // Draw hex pattern near mouse
      if (mouseX > 0 && mouseY > 0) {
        drawHexPattern(mouseX, mouseY);
      }

      animationRef.current = requestAnimationFrame(drawParticles);
    };

    const drawHexPattern = (centerX: number, centerY: number) => {
      const hexRadius = 30;
      const rings = 3;
      
      for (let ring = 1; ring <= rings; ring++) {
        const distance = ring * hexRadius * 1.8;
        const opacity = (1 - ring / (rings + 1)) * 0.15;
        
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2 + timeRef.current * 0.01;
          const x = centerX + Math.cos(angle) * distance;
          const y = centerY + Math.sin(angle) * distance;
          
          // Draw small hexagon
          ctx.beginPath();
          for (let j = 0; j < 6; j++) {
            const hAngle = (j / 6) * Math.PI * 2;
            const hx = x + Math.cos(hAngle) * (hexRadius / 2);
            const hy = y + Math.sin(hAngle) * (hexRadius / 2);
            if (j === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
          }
          ctx.closePath();
          ctx.strokeStyle = `hsla(200, 100%, 60%, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
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
