'use client';

import { useEffect, useState } from 'react';

/**
 * Pure Vector / SVG Code-Generated Multi-Layer Parallax Mountain Horizon
 * Creates organic curved ridges, midground peaks, and misty pine tree silhouettes
 * that respond to mouse movement and ambient night light.
 */
export default function ParallaxMountainHorizon({ isPlaying = true }) {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function handleMouseMove(e) {
      const normX = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      const normY = (e.clientY / window.innerHeight - 0.5) * 2;
      setMouseOffset({ x: normX, y: normY });
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const dx = mouseOffset.x;
  const dy = mouseOffset.y;

  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0"
      style={{
        display: 'flex',
        alignItems: 'flex-end',
      }}
    >
      {/* ── Layer 1: Distant Majestic Peaks (Deepest Night Sky Blue) ── */}
      <div
        className="absolute bottom-0 left-[-5%] w-[110%] h-[55vh] pointer-events-none transition-transform duration-700 ease-out"
        style={{
          transform: `translate3d(${dx * -8}px, ${dy * -4}px, 0)`,
          opacity: 0.90,
          zIndex: 1,
        }}
      >
        <svg
          viewBox="0 0 1440 400"
          preserveAspectRatio="none"
          className="w-full h-full block"
        >
          <defs>
            <linearGradient id="farPeakGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1a2436" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#0d131f" stopOpacity="1" />
            </linearGradient>
          </defs>
          <path
            fill="url(#farPeakGrad)"
            d="M0,400 L0,220 Q120,130 240,190 T480,110 Q600,40 720,130 T960,80 Q1120,30 1260,140 Q1360,190 1440,160 L1440,400 Z"
          />
        </svg>
      </div>

      {/* ── Layer 2: Mid-Distant Curved Mountain Ridges ── */}
      <div
        className="absolute bottom-0 left-[-5%] w-[110%] h-[46vh] pointer-events-none transition-transform duration-500 ease-out"
        style={{
          transform: `translate3d(${dx * -16}px, ${dy * -7}px, 0)`,
          opacity: 0.94,
          zIndex: 2,
        }}
      >
        <svg
          viewBox="0 0 1440 360"
          preserveAspectRatio="none"
          className="w-full h-full block"
        >
          <defs>
            <linearGradient id="midRidgeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#141c2a" stopOpacity="0.92" />
              <stop offset="100%" stopColor="#0a0e17" stopOpacity="1" />
            </linearGradient>
          </defs>
          <path
            fill="url(#midRidgeGrad)"
            d="M0,360 L0,200 C160,140 280,240 440,170 C600,100 680,180 840,140 C1000,100 1140,210 1300,160 C1380,135 1420,160 1440,175 L1440,360 Z"
          />
        </svg>
      </div>

      {/* ── Layer 3: Foreground Foothills & Pine Tree Ridges ── */}
      <div
        className="absolute bottom-0 left-[-5%] w-[110%] h-[36vh] pointer-events-none transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${dx * -24}px, ${dy * -10}px, 0)`,
          opacity: 0.98,
          zIndex: 3,
        }}
      >
        <svg
          viewBox="0 0 1440 300"
          preserveAspectRatio="none"
          className="w-full h-full block"
        >
          <defs>
            <linearGradient id="foreRidgeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0e141e" stopOpacity="0.98" />
              <stop offset="60%" stopColor="#070a0f" stopOpacity="1" />
              <stop offset="100%" stopColor="#040608" stopOpacity="1" />
            </linearGradient>
          </defs>
          <path
            fill="url(#foreRidgeGrad)"
            d="M0,300 L0,180 Q100,120 200,150 T420,130 Q540,80 660,130 T900,110 Q1050,70 1200,125 Q1340,170 1440,140 L1440,300 Z"
          />
        </svg>
      </div>
    </div>
  );
}
