'use client';

import { useEffect, useRef } from 'react';

export default function AmbientWeather({ weather, particles, active = true }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = canvas.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.offsetHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      width = canvas.width = rect.width || canvas.offsetWidth || window.innerWidth;
      height = canvas.height = rect.height || canvas.offsetHeight || window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    // Initial size check
    setTimeout(handleResize, 100);

    class Particle {
      constructor(type) {
        this.type = type;
        this.reset();
        // Stagger y start positions initially so they don't all appear from the top together
        this.y = Math.random() * height;
      }

      reset() {
        this.x = Math.random() * width;
        
        if (this.type === 'rain') {
          this.y = -20 - Math.random() * 50;
          this.vy = 12 + Math.random() * 8;
          this.vx = -3 - Math.random() * 4; // diagonal wind to simulate forward driving
          this.len = 15 + Math.random() * 20;
          this.color = 'rgba(165, 203, 240, 0.4)';
          this.lineWidth = 1 + Math.random() * 1.5;
        } else if (this.type === 'stars') {
          this.y = Math.random() * (height * 0.75); // upper sky mostly
          this.vy = (Math.random() - 0.5) * 0.05; // tiny drift
          this.vx = -1.2 - Math.random() * 1.5; // fast drift representing truck moving forward
          this.size = 0.6 + Math.random() * 1.4;
          this.color = `rgba(255, 255, 255, ${0.15 + Math.random() * 0.7})`;
        } else if (this.type === 'dust-motes') {
          // floating dust
          this.y = height + Math.random() * 20;
          this.vy = -0.2 - Math.random() * 0.5; // slow upward drift
          this.vx = (Math.random() - 0.5) * 0.3; // drift side to side
          this.size = 1.5 + Math.random() * 3.0; // slightly larger
          this.color = `rgba(245, 158, 11, ${0.18 + Math.random() * 0.32})`; // Brighter Amber warm dust glow
        } else {
          // fog / mist
          this.y = Math.random() * height;
          this.vy = (Math.random() - 0.5) * 0.15;
          this.vx = -0.3 - Math.random() * 0.4;
          this.size = 80 + Math.random() * 120; // larger fog patches
          this.color = `rgba(245, 237, 219, ${0.015 + Math.random() * 0.03})`; // Soft warm kitchen fog/mist
        }
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around bounds
        if (this.type === 'rain') {
          if (this.y > height || this.x < -20) {
            this.reset();
            this.y = -20;
          }
        } else if (this.type === 'stars') {
          if (this.x < -10) {
            this.x = width + 10;
            this.y = Math.random() * (height * 0.75);
          }
        } else if (this.type === 'dust-motes') {
          if (this.y < -10 || this.x < -10 || this.x > width + 10) {
            this.reset();
          }
        } else {
          // fog
          if (this.x < -this.size * 2) {
            this.x = width + this.size * 2;
            this.y = Math.random() * height;
          }
        }
      }

      draw() {
        ctx.beginPath();
        if (this.type === 'rain') {
          ctx.strokeStyle = this.color;
          ctx.lineWidth = this.lineWidth;
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(this.x + this.vx * 0.8, this.y + this.len);
          ctx.stroke();
        } else if (this.type === 'stars') {
          ctx.fillStyle = this.color;
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (this.type === 'dust-motes') {
          ctx.fillStyle = this.color;
          ctx.shadowBlur = 6;
          ctx.shadowColor = 'rgba(245, 158, 11, 0.4)';
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0; // reset
        } else {
          // fog
          ctx.fillStyle = this.color;
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Determine target counts and type
    const pools = [];

    // 1. Weather effect
    if (weather === 'rain') {
      for (let i = 0; i < 75; i++) {
        pools.push(new Particle('rain'));
      }
    } else if (weather === 'misty' || weather === 'fog') {
      for (let i = 0; i < 15; i++) {
        pools.push(new Particle('fog'));
      }
    }

    // 2. Extra particles
    if (particles === 'stars') {
      for (let i = 0; i < 45; i++) {
        pools.push(new Particle('stars'));
      }
    } else if (particles === 'dust' || particles === 'dust-motes') {
      for (let i = 0; i < 80; i++) {
        pools.push(new Particle('dust-motes'));
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      if (active && pools.length > 0) {
        for (let i = 0; i < pools.length; i++) {
          pools[i].update();
          pools[i].draw();
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [weather, particles, active]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 2,
        opacity: active ? 1 : 0,
        transition: 'opacity 1s ease',
      }}
    />
  );
}
