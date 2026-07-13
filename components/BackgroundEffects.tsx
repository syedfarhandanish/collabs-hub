'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function BackgroundEffects({ isLight }: { isLight: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let particles: { x: number; y: number; vx: number; vy: number; radius: number }[] = [];
    let mouse = { x: -1000, y: -1000 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const densityDivisor = window.innerWidth < 768 ? 14000 : 9500;
      const numberOfParticles = Math.floor((canvas.width * canvas.height) / densityDivisor); 
      for (let i = 0; i < numberOfParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5, 
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 1.8 + 0.6,
        });
      }
    };

    window.addEventListener('resize', resize, { passive: true });
    resize();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const nodeColor = isLight ? 'rgba(99, 102, 241, 0.35)' : 'rgba(56, 189, 248, 0.4)';
      const lineBaseStr = isLight ? '99, 102, 241' : '147, 197, 253';
      const maxDistSq = 140 * 140;
      const mouseDistSq = 180 * 180;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            const distance = Math.sqrt(distSq);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${lineBaseStr}, ${isLight ? 0.16 - distance / 900 : 0.22 - distance / 650})`; 
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }

        const dxMouse = p.x - mouse.x;
        const dyMouse = p.y - mouse.y;
        const distMouseSq = dxMouse * dxMouse + dyMouse * dyMouse;
        if (distMouseSq < mouseDistSq) {
          const distMouse = Math.sqrt(distMouseSq);
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(${lineBaseStr}, ${isLight ? 0.35 - distMouse / 550 : 0.45 - distMouse / 400})`; 
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isLight]);

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex justify-center items-center">
        <motion.div 
          style={{ willChange: 'transform' }}
          animate={{ scale: [1, 1.1, 1], rotate: [0, 45, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full blur-[140px] transition-colors duration-1000 transform-gpu ${isLight ? 'bg-blue-300/40' : 'bg-indigo-900/40'}`} 
        />
        <motion.div 
          style={{ willChange: 'transform' }}
          animate={{ scale: [1, 1.2, 1], rotate: [0, -45, 0] }} transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[140px] transition-colors duration-1000 transform-gpu ${isLight ? 'bg-cyan-200/50' : 'bg-cyan-900/30'}`} 
        />
        {isLight && <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>}
      </div>
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-100 will-change-transform" />
    </>
  );
}