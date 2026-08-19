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
      {/* ── Layer 1: Distant Massive Alpine Mountain Range (Deep Slate Navy) ── */}
      <div
        className="absolute bottom-[16vh] left-[-4%] w-[108%] h-[48vh] pointer-events-none transition-transform duration-700 ease-out"
        style={{
          transform: `translate3d(${dx * -10}px, ${dy * -4}px, 0)`,
          zIndex: 1,
        }}
      >
        <svg
          viewBox="0 0 1440 450"
          preserveAspectRatio="none"
          className="w-full h-full block"
          style={{ filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.8))' }}
        >
          <defs>
            <linearGradient id="farAlpineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#25354e" />
              <stop offset="35%" stopColor="#182333" />
              <stop offset="100%" stopColor="#0c111a" />
            </linearGradient>
          </defs>
          <path
            fill="url(#farAlpineGrad)"
            d="M0,450 L0,220 L70,160 L140,205 L230,120 L310,185 L420,95 L510,165 L620,70 L730,150 L840,110 L940,175 L1060,85 L1160,155 L1260,105 L1350,180 L1440,135 L1440,450 Z"
          />
        </svg>
      </div>

      {/* ── Layer 2: Midground Sculpted Curved Ridges & Slopes (Atmospheric Charcoal) ── */}
      <div
        className="absolute bottom-[12vh] left-[-4%] w-[108%] h-[38vh] pointer-events-none transition-transform duration-500 ease-out"
        style={{
          transform: `translate3d(${dx * -18}px, ${dy * -7}px, 0)`,
          zIndex: 2,
        }}
      >
        <svg
          viewBox="0 0 1440 380"
          preserveAspectRatio="none"
          className="w-full h-full block"
          style={{ filter: 'drop-shadow(0 -2px 10px rgba(0,0,0,0.5))' }}
        >
          <defs>
            <linearGradient id="midAlpineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e2a3c" />
              <stop offset="50%" stopColor="#111822" />
              <stop offset="100%" stopColor="#070a0f" />
            </linearGradient>
          </defs>
          <path
            fill="url(#midAlpineGrad)"
            d="M0,380 L0,210 Q90,140 190,175 T390,115 Q490,75 590,145 T810,105 Q920,65 1030,135 T1250,95 Q1350,150 1440,125 L1440,380 Z"
          />
        </svg>
      </div>

      {/* ── Layer 3: Foreground Pine Forest Horizon Silhouettes ── */}
      <div
        className="absolute bottom-[8vh] left-[-4%] w-[108%] h-[26vh] pointer-events-none transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${dx * -26}px, ${dy * -10}px, 0)`,
          zIndex: 3,
        }}
      >
        <svg
          viewBox="0 0 1440 260"
          preserveAspectRatio="none"
          className="w-full h-full block"
        >
          <defs>
            <linearGradient id="foreAlpineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#131b26" />
              <stop offset="60%" stopColor="#090d13" />
              <stop offset="100%" stopColor="#05070a" />
            </linearGradient>
          </defs>
          <path
            fill="url(#foreAlpineGrad)"
            d="M0,260 L0,140 Q80,110 160,130 T340,95 Q420,65 520,110 T720,85 Q810,60 900,105 T1110,80 Q1210,120 1310,95 Q1380,120 1440,105 L1440,260 Z"
          />
        </svg>
      </div>
    </div>
  );
}
