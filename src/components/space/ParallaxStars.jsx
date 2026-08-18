'use client';

import { useEffect, useState, useMemo } from 'react';

function generateBoxShadows(count) {
  const shadows = [];
  for (let i = 0; i < count; i++) {
    const x = Math.floor(Math.random() * 2500);
    const y = Math.floor(Math.random() * 2500);
    shadows.push(`${x}px ${y}px #FFF`);
  }
  return shadows.join(', ');
}

export default function ParallaxStars() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const smallStars = useMemo(() => (mounted ? generateBoxShadows(600) : ''), [mounted]);
  const mediumStars = useMemo(() => (mounted ? generateBoxShadows(200) : ''), [mounted]);
  const bigStars = useMemo(() => (mounted ? generateBoxShadows(100) : ''), [mounted]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0 bg-[radial-gradient(ellipse_at_bottom,#1B2735_0%,#090A0F_100%)]">
      {mounted && (
        <>
          {/* Small Stars Layer (1px, 50s) */}
          <div
            className="absolute top-0 left-0 w-[1px] h-[1px] bg-transparent rounded-full"
            style={{
              boxShadow: smallStars,
              animation: 'animStar 50s linear infinite',
            }}
          />
          <div
            className="absolute top-[2000px] left-0 w-[1px] h-[1px] bg-transparent rounded-full"
            style={{
              boxShadow: smallStars,
              animation: 'animStar 50s linear infinite',
            }}
          />

          {/* Medium Stars Layer (2px, 100s) */}
          <div
            className="absolute top-0 left-0 w-[2px] h-[2px] bg-transparent rounded-full"
            style={{
              boxShadow: mediumStars,
              animation: 'animStar 100s linear infinite',
            }}
          />
          <div
            className="absolute top-[2000px] left-0 w-[2px] h-[2px] bg-transparent rounded-full"
            style={{
              boxShadow: mediumStars,
              animation: 'animStar 100s linear infinite',
            }}
          />

          {/* Big Stars Layer (3px, 150s) */}
          <div
            className="absolute top-0 left-0 w-[3px] h-[3px] bg-transparent rounded-full"
            style={{
              boxShadow: bigStars,
              animation: 'animStar 150s linear infinite',
            }}
          />
          <div
            className="absolute top-[2000px] left-0 w-[3px] h-[3px] bg-transparent rounded-full"
            style={{
              boxShadow: bigStars,
              animation: 'animStar 150s linear infinite',
            }}
          />
        </>
      )}

      <style jsx>{`
        @keyframes animStar {
          from {
            transform: translateY(0px);
          }
          to {
            transform: translateY(-2000px);
          }
        }
      `}</style>
    </div>
  );
}
