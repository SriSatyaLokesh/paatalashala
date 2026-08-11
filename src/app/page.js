'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PLACES } from '@/data/places';
import { Compass, Sparkles, Lock, ArrowRight } from 'lucide-react';

export default function Home() {
  const [activeCounts, setActiveCounts] = useState({});

  useEffect(() => {
    // Fetch mock presence count for active places to display on home page
    const fetchCounts = async () => {
      const counts = {};
      for (const place of PLACES) {
        if (place.active) {
          try {
            const res = await fetch(`/api/presence?place=${place.slug}`);
            const data = await res.json();
            counts[place.slug] = data.count;
          } catch (e) {
            counts[place.slug] = place.slug === 'tractor-anna' ? 83 : 41; // Fallback
          }
        }
      }
      setActiveCounts(counts);
    };

    fetchCounts();
    const interval = setInterval(fetchCounts, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at top, #0f121e 0%, #05060b 100%)',
      padding: '40px 20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative ambient background glows */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '20%',
        width: '50vw',
        height: '50vw',
        background: 'radial-gradient(circle, rgba(245, 158, 11, 0.05) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '10%',
        width: '40vw',
        height: '40vw',
        background: 'radial-gradient(circle, rgba(14, 165, 233, 0.05) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Header Container */}
      <header style={{
        textAlign: 'center',
        marginBottom: '60px',
        maxWidth: '600px',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: '20px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.05)',
          color: 'var(--color-accent)',
          fontSize: '0.85rem',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }}>
          <Sparkles size={14} />
          <span>Ambient Audio Environments</span>
        </div>

        <h1 style={{
          fontSize: '3rem',
          fontWeight: '900',
          letterSpacing: '-0.03em',
          background: 'linear-gradient(to right, #fff 40%, var(--color-text-secondary) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: '1.1'
        }}>
          PAATALASHALA
        </h1>

        <p style={{
          fontSize: '1.25rem',
          color: 'var(--color-text-secondary)',
          fontStyle: 'italic',
          fontWeight: '300'
        }}>
          What would you hear if you were there?
        </p>
      </header>

      {/* Places Grid Container */}
      <section style={{
        width: '100%',
        maxWidth: '1000px',
        zIndex: 10,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        padding: '0 10px'
      }}>
        {PLACES.map((place) => {
          const count = activeCounts[place.slug];

          if (place.active) {
            return (
              <Link 
                href={`/places/${place.slug}`} 
                key={place.id}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div 
                  className="glass-panel"
                  style={{
                    padding: '28px',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.borderColor = place.theme === 'amber' ? 'rgba(245,158,11,0.4)' : 'rgba(14,165,233,0.4)';
                    e.currentTarget.style.boxShadow = place.theme === 'amber' 
                      ? '0 12px 30px rgba(245, 158, 11, 0.1)' 
                      : '0 12px 30px rgba(14, 165, 233, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'var(--color-border)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Top line with emoji and counts */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span 
                      style={{
                        fontSize: '2.5rem',
                        display: 'inline-block',
                        animation: 'vehicle-float 4s ease-in-out infinite',
                        animationDelay: place.slug === 'saloon' ? '2s' : '0s'
                      }}
                    >
                      {place.emoji}
                    </span>
                    
                    {count !== undefined && (
                      <span style={{
                        fontSize: '0.75rem',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        background: place.theme === 'amber' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(14, 165, 233, 0.1)',
                        color: place.theme === 'amber' ? 'var(--color-accent)' : 'var(--color-neon-blue)',
                        border: place.theme === 'amber' ? '1px solid rgba(245,158,11,0.2)' : '1px solid rgba(14,165,233,0.2)',
                        fontWeight: '600'
                      }}>
                        {place.slug === 'tractor-anna' ? `🚜 ${count} in fields` : `💈 ${count} waiting`}
                      </span>
                    )}
                  </div>

                  {/* Body text */}
                  <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {place.name}
                    </h2>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: '1.5' }}>
                      {place.description}
                    </p>
                  </div>

                  {/* Bottom Enter Row */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    fontSize: '0.85rem', 
                    fontWeight: '700', 
                    color: place.theme === 'amber' ? 'var(--color-accent)' : 'var(--color-neon-blue)',
                    marginTop: '10px'
                  }}>
                    <span>Enter Place</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            );
          } else {
            return (
              <div 
                key={place.id}
                className="glass-panel"
                style={{
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '20px',
                  opacity: 0.4,
                  cursor: 'not-allowed',
                  position: 'relative'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '2.5rem' }}>{place.emoji}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: '600' }}>
                      <Lock size={12} />
                      <span>LOCKED</span>
                    </div>
                  </div>

                  <div style={{ marginTop: '20px' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '8px', color: 'var(--color-text-secondary)' }}>
                      {place.name}
                    </h2>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
                      {place.description}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: '700', marginTop: '10px' }}>
                  <span>Locked</span>
                </div>
              </div>
            );
          }
        })}
      </section>

      {/* Footer copyright */}
      <footer style={{
        marginTop: '80px',
        zIndex: 10,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
          Powered by official YouTube embedded API integration. No copyrighted media hosted.
        </p>
        <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.15)' }}>
          Paatalashala © 2026
        </p>
      </footer>
    </main>
  );
}
