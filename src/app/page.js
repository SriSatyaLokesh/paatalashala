'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { PLACES } from '@/data/places';

// ── SVG Icons (no emoji) ──────────────────────────────────────────────────────
const IconTractor = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="7" cy="17" r="3"/><circle cx="17" cy="17" r="2"/>
    <path d="M5 17V9l3-5h7l2 4v9"/>
    <path d="M5 9h7"/>
  </svg>
);
const IconScissors = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>
    <line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/>
    <line x1="8.12" y1="8.12" x2="12" y2="12"/>
  </svg>
);
const IconAuto = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v4"/><circle cx="16" cy="17" r="2"/><circle cx="7" cy="17" r="2"/>
    <path d="M9 17H14"/>
  </svg>
);
const IconCup = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 8h1a4 4 0 010 8h-1"/><path d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z"/>
    <line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/>
  </svg>
);
const IconBus = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" rx="2"/><circle cx="5" cy="19" r="2"/><circle cx="12" cy="19" r="2"/>
    <path d="M8 3v13"/><path d="M1 7h15"/>
  </svg>
);
const IconCanteen = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/>
    <line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
  </svg>
);
const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const IconLock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
);
const IconUsers = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
  </svg>
);

const ICONS = {
  'tractor-anna': IconTractor,
  'saloon': IconScissors,
  'auto': IconAuto,
  'tea-stall': IconCup,
  'rtc-bus': IconBus,
  'college-canteen': IconCanteen,
};

export default function Home() {
  const [counts, setCounts] = useState({});
  const [entered, setEntered] = useState(null);
  const heroRef = useRef(null);

  useEffect(() => {
    const sim = () => {
      const c = {};
      for (const p of PLACES) {
        if (p.active) {
          const base = p.slug === 'tractor-anna' ? 83 : 41;
          const s = Math.floor(Date.now() / 4000);
          c[p.slug] = Math.max(1, Math.round(base + Math.sin(s * 0.5 + p.id.length) * 5 + Math.cos(s * 0.2) * 2));
        }
      }
      setCounts(c);
    };
    sim();
    const iv = setInterval(sim, 4000);
    return () => clearInterval(iv);
  }, []);

  const active = PLACES.filter(p => p.active);
  const coming = PLACES.filter(p => !p.active);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Akaya+Telivigala&family=Playfair+Display:wght@400;600;700;900&family=Inter:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html { scroll-behavior: smooth; }

        body {
          background: #0c0a08;
          color: #f0ebe3;
          font-family: 'Inter', sans-serif;
          overflow-x: hidden;
        }

        /* ── Grain overlay ── */
        body::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
          opacity: 0.6;
        }

        /* ── Ambient light blobs ── */
        .blob-amber {
          position: fixed; border-radius: 50%; pointer-events: none;
          width: 600px; height: 600px;
          top: -150px; left: -100px;
          background: radial-gradient(circle, rgba(180,100,20,0.12) 0%, transparent 70%);
          filter: blur(40px);
        }
        .blob-rust {
          position: fixed; border-radius: 50%; pointer-events: none;
          width: 500px; height: 500px;
          bottom: -100px; right: -80px;
          background: radial-gradient(circle, rgba(120,60,30,0.10) 0%, transparent 70%);
          filter: blur(50px);
        }

        /* ── Page wrapper ── */
        .page {
          position: relative;
          min-height: 100vh;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 60px 24px 80px;
        }

        /* ── Horizontal rule ── */
        .divider {
          width: 60px; height: 2px;
          background: linear-gradient(90deg, #b45309, #92400e);
          border-radius: 2px;
          margin: 0 auto;
        }

        /* ── Header ── */
        .site-header {
          text-align: center;
          margin-bottom: 70px;
          max-width: 560px;
        }
        .site-kicker {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #b45309;
          margin-bottom: 20px;
        }
        .site-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.8rem, 8vw, 4.4rem);
          font-weight: 900;
          line-height: 1.05;
          color: #f5ede0;
          letter-spacing: -0.02em;
          margin-bottom: 8px;
        }
        .site-title-telugu {
          display: block;
          font-family: 'Akaya Telivigala', serif;
          font-size: clamp(1.1rem, 3vw, 1.4rem);
          font-weight: 400;
          color: #a8855a;
          letter-spacing: 0.04em;
          margin-top: 6px;
        }
        .site-subtitle {
          margin-top: 18px;
          font-size: 1rem;
          font-weight: 300;
          color: #8a7060;
          letter-spacing: 0.02em;
          line-height: 1.6;
        }

        /* ── Section label ── */
        .section-label {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 28px;
          width: 100%;
          max-width: 900px;
        }
        .section-label span {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #6b5240;
          white-space: nowrap;
        }
        .section-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, rgba(107,82,64,0.4), transparent);
        }

        /* ── FEATURED CARDS (2 active places) ── */
        .featured-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          width: 100%;
          max-width: 900px;
          margin-bottom: 56px;
        }

        .featured-card {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          cursor: pointer;
          text-decoration: none;
          color: inherit;
          display: block;
          height: 320px;
          background: #15110d;
          border: 1px solid rgba(180,120,60,0.12);
          transition: border-color 0.35s ease, transform 0.35s cubic-bezier(0.23,1,0.32,1);
          will-change: transform;
        }

        .featured-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(160deg, rgba(255,255,255,0.04) 0%, transparent 50%);
          pointer-events: none;
          z-index: 2;
        }

        .featured-card .card-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          transition: transform 0.6s cubic-bezier(0.23,1,0.32,1);
          filter: brightness(0.32) saturate(0.6);
          z-index: 0;
        }

        .featured-card:hover { border-color: rgba(180,120,60,0.35); transform: translateY(-5px); }
        .featured-card:hover .card-bg { transform: scale(1.06); filter: brightness(0.42) saturate(0.75); }

        .featured-card .card-inner {
          position: absolute;
          inset: 0;
          z-index: 3;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 28px;
        }

        .card-icon-wrap {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 48px; height: 48px;
          border-radius: 12px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          color: #d4a96a;
        }

        .live-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 20px;
          background: rgba(20,15,10,0.7);
          border: 1px solid rgba(180,120,60,0.25);
          font-size: 0.7rem;
          font-weight: 600;
          color: #c49a5a;
          letter-spacing: 0.05em;
          backdrop-filter: blur(6px);
        }
        .live-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #c49a5a;
          box-shadow: 0 0 6px #c49a5a;
          animation: pulse-dot 2s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; } 50% { opacity: 0.4; }
        }

        .card-bottom { display: flex; flex-direction: column; gap: 8px; }

        .card-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.55rem;
          font-weight: 700;
          color: #f5ede0;
          line-height: 1.2;
        }
        .card-name-telugu {
          font-family: 'Akaya Telivigala', serif;
          font-size: 1rem;
          color: #b08050;
          margin-top: 2px;
          display: block;
        }
        .card-desc {
          font-size: 0.82rem;
          color: rgba(220,190,150,0.65);
          line-height: 1.55;
          font-weight: 300;
          margin-top: 6px;
        }
        .card-enter {
          margin-top: 14px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 0.78rem;
          font-weight: 600;
          color: #c49a5a;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          transition: gap 0.2s ease;
        }
        .featured-card:hover .card-enter { gap: 12px; }

        /* ── COMING SOON GRID ── */
        .coming-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          width: 100%;
          max-width: 900px;
        }

        .coming-card {
          border-radius: 14px;
          padding: 18px 16px;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.06);
          cursor: not-allowed;
          display: flex;
          flex-direction: column;
          gap: 10px;
          transition: background 0.25s ease;
          position: relative;
          overflow: hidden;
        }
        .coming-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 60%);
        }
        .coming-card:hover { background: rgba(255,255,255,0.04); }

        .coming-icon {
          width: 36px; height: 36px;
          border-radius: 9px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          display: flex; align-items: center; justify-content: center;
          color: rgba(180,140,90,0.4);
        }
        .coming-name {
          font-size: 0.82rem;
          font-weight: 600;
          color: rgba(240,220,190,0.45);
          line-height: 1.3;
        }
        .coming-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(130,100,70,0.6);
        }

        /* ── Footer ── */
        .site-footer {
          margin-top: 80px;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .footer-line {
          width: 40px; height: 1px;
          background: rgba(255,255,255,0.08);
          margin: 0 auto 14px;
        }
        .footer-text { font-size: 0.75rem; color: rgba(255,255,255,0.18); }

        /* ── Entrance animation ── */
        .fade-up {
          opacity: 0;
          transform: translateY(28px);
          animation: fadeUp 0.7s cubic-bezier(0.23,1,0.32,1) forwards;
        }
        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.34s; }
        .delay-4 { animation-delay: 0.48s; }
        .delay-5 { animation-delay: 0.6s; }

        /* ── Mobile ── */
        @media (max-width: 700px) {
          .page { padding: 40px 16px 60px; }
          .featured-grid { grid-template-columns: 1fr; gap: 16px; }
          .featured-card { height: 270px; }
          .card-name { font-size: 1.3rem; }
          .coming-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 400px) {
          .coming-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <div className="blob-amber" />
      <div className="blob-rust" />

      <div className="page">

        {/* ── HEADER ── */}
        <header className="site-header fade-up delay-1">
          <p className="site-kicker">Telugu Ambient Audio Spaces</p>
          <div className="divider" style={{ marginBottom: '22px' }} />
          <h1 className="site-title">
            Paatalashala
            <span className="site-title-telugu">పాటలశాల</span>
          </h1>
          <p className="site-subtitle">
            Handcrafted soundscapes from the places that shaped us.
            <br />Pick a place. Let it play.
          </p>
        </header>

        {/* ── FEATURED: 2 active places ── */}
        <div className="section-label fade-up delay-2">
          <span>Open now</span>
          <div className="section-line" />
        </div>

        <div className="featured-grid fade-up delay-3">
          {active.map((place) => {
            const Icon = ICONS[place.slug] || IconTractor;
            const bgMap = {
              'tractor-anna': '/images/sunset_farm_background.png',
              'saloon': '/images/saloon_background.jpg',
            };
            const bg = bgMap[place.slug] || '';
            const teluguNames = {
              'tractor-anna': 'ట్రాక్టర్ అన్న',
              'saloon': 'రాయల్ సెలూన్',
            };

            return (
              <Link href={`/places/${place.slug}`} key={place.id} className="featured-card"
                onClick={() => setEntered(place.slug)}
              >
                {bg && (
                  <div
                    className="card-bg"
                    style={{ backgroundImage: `url('${bg}')` }}
                  />
                )}
                <div className="card-inner">
                  {/* Top row */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div className="card-icon-wrap">
                      <Icon />
                    </div>
                    {counts[place.slug] && (
                      <div className="live-badge">
                        <span className="live-dot" />
                        <IconUsers />
                        <span>{counts[place.slug]}</span>
                      </div>
                    )}
                  </div>

                  {/* Bottom info */}
                  <div className="card-bottom">
                    <div>
                      <div className="card-name">{teluguNames[place.slug]}</div>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.95rem', fontWeight: 600, color: 'rgba(220,190,150,0.8)', marginTop: '3px' }}>
                        {place.name === 'Tractor Anna' ? 'Tractor Anna' : 'Royal Saloon'}
                      </div>
                    </div>
                    <p className="card-desc">{place.description}</p>
                    <div className="card-enter">
                      <span>Enter</span>
                      <IconArrow />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* ── COMING SOON ── */}
        <div className="section-label fade-up delay-4">
          <span>Coming soon</span>
          <div className="section-line" />
        </div>

        <div className="coming-grid fade-up delay-5">
          {coming.map((place) => {
            const Icon = ICONS[place.slug] || IconTractor;
            return (
              <div key={place.id} className="coming-card">
                <div className="coming-icon">
                  <Icon />
                </div>
                <div>
                  <div className="coming-name">{place.name}</div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(160,120,80,0.4)', marginTop: '4px', fontStyle: 'italic' }}>
                    {place.tagline}
                  </div>
                </div>
                <div className="coming-tag">
                  <IconLock />
                  <span>Soon</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── FOOTER ── */}
        <footer className="site-footer fade-up delay-5">
          <div className="footer-line" />
          <p className="footer-text">Paatalashala — a handcrafted Telugu audio space</p>
          <p className="footer-text" style={{ opacity: 0.5 }}>Streams via YouTube API. No media hosted.</p>
        </footer>

      </div>
    </>
  );
}
