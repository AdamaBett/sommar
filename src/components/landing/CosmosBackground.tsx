'use client';

import { useEffect, useRef } from 'react';

const COLORS = ['#1DFFA8', '#FF6B3D', '#FFB840', '#00D4FF', '#A855F7', '#EC4899'];
const PARTICLE_COUNT = 70;

interface Particle {
  x: number;
  y: number;
  radius: number;
  color: string;
  alpha: number;
  phase: number;
  speed: number;
  dx: number;
  dy: number;
}

export function CosmosBackground(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: false });
    if (!ctx) return;

    let animId = 0;
    let particles: Particle[] = [];
    let time = 0;

    function resize(): void {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function initParticles(): void {
      if (!canvas) return;
      particles = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 1 + Math.random() * 2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: 0.3 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.7,
        dx: (Math.random() - 0.5) * 0.15,
        dy: (Math.random() - 0.5) * 0.15,
      }));
    }

    function draw(): void {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.01;

      const w = canvas.width;
      const h = canvas.height;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Drift
        p.x += p.dx;
        p.y += p.dy;

        // Wrap around edges
        if (p.x < 0) p.x = w;
        else if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        else if (p.y > h) p.y = 0;

        // Sinusoidal opacity pulsing
        const opacity = p.alpha * (0.5 + 0.5 * Math.sin(time * p.speed + p.phase));

        // Hex alpha suffix for the color
        const hexAlpha = Math.round(opacity * 255)
          .toString(16)
          .padStart(2, '0');

        // Radial gradient glow
        const glowRadius = p.radius * 3;
        const gradient = ctx.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          glowRadius
        );
        gradient.addColorStop(0, p.color + hexAlpha);
        gradient.addColorStop(1, p.color + '00');

        ctx.beginPath();
        ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    }

    // Lazy init: defer to next frame so we don't block first paint
    const initId = requestAnimationFrame(() => {
      resize();
      initParticles();
      draw();
    });

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(initId);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
