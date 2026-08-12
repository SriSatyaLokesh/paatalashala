'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PLACES } from '@/data/places';
import { prefixPath } from '@/utils/paths';

// ── SVG Icons (no emoji) ──────────────────────────────────────────────────────
const IconTractor = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="7" cy="17" r="3"/><circle cx="17" cy="17" r="2"/>
    <path d="M5 17V9l3-5h7l2 4v9"/><path d="M5 9h7"/>
  </svg>
);
const IconScissors = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>
    <line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/>
    <line x1="8.12" y1="8.12" x2="12" y2="12"/>
  </svg>
);
const IconAuto = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v4"/><circle cx="16" cy="17" r="2"/><circle cx="7" cy="17" r="2"/>
    <path d="M9 17H14"/>
  </svg>
);
const IconCup = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 8h1a4 4 0 010 8h-1"/><path d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z"/>
    <line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/>
  </svg>
);
const IconBus = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" rx="2"/><circle cx="5" cy="19" r="2"/><circle cx="12" cy="19" r="2"/>
    <path d="M8 3v13"/><path d="M1 7h15"/>
  </svg>
);
const IconCanteen = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/>
    <line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
  </svg>
);
const IconArrow = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const IconLock = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
);
const IconUsers = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

const TELUGU_NAMES = {
  'tractor-anna': 'ట్రాక్టర్ అన్న',
  'saloon': 'రాయల్ సెలూన్',
};

const CARD_BG = {
  'tractor-anna': '/images/sunset_farm_background.png',
  'saloon': '/images/saloon_background.jpg',
};

export default function Home() {
  const [counts, setCounts] = useState({});

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
  const bgUrl = prefixPath('/images/landing_bg.avif');

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Akaya+Telivigala&family=Playfair+Display:wght@400;600;700;900&family=Inter:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { overflow-x: hidden; font-family: 'Inter', sans-serif; }

        /* ── Full-screen background ── */
        .landing-bg {
          position: fixed;
          inset: 0;
          background-image: url('${bgUrl}');
          background-size: cover;
          background-position: center top;
          background-repeat: no-repeat;
          filter: brightness(0.55) saturate(0.85);
          z-index: 0;
        }

        /* ── Multi-layer fog / atmosphere ── */
        /* 1. Top gradient darkener */
        .fog-top {
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 45%;
          background: linear-gradient(to bottom,
            rgba(8, 5, 3, 0.82) 0%,
            rgba(8, 5, 3, 0.45) 55%,
            transparent 100%
          );
          z-index: 1;
          pointer-events: none;
        }
        /* 2. Bottom gradient to ground page in dark */
        .fog-bottom {
          position: fixed;
          bottom: 0; left: 0; right: 0;
          height: 55%;
          background: linear-gradient(to top,
            rgba(6, 4, 2, 0.95) 0%,
            rgba(6, 4, 2, 0.55) 50%,
            transparent 100%
          );
          z-index: 1;
          pointer-events: none;
        }
        /* 3. Warm amber center glow — gives the festival warmth */
        .fog-center {
          position: fixed;
          top: 20%; left: 15%; right: 15%;
          height: 60%;
          background: radial-gradient(ellipse at center,
            rgba(160, 80, 10, 0.18) 0%,
            rgba(100, 40, 5, 0.08) 50%,
            transparent 80%
          );
          filter: blur(60px);
          z-index: 1;
          pointer-events: none;
        }
        /* 4. Film grain */
        .grain {
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
          z-index: 2;
          pointer-events: none;
          opacity: 0.7;
        }

        /* ── Scrollable page content ── */
        .page {
          position: relative;
          z-index: 10;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 64px 24px 80px;
          color: #f0e8dc;
        }

        /* ── Header ── */
        .site-header {
          text-align: center;
          margin-bottom: 64px;
          max-width: 560px;
          width: 100%;
        }
        .kicker {
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: #c49a5a;
          margin-bottom: 18px;
        }
        .title-divider {
          width: 48px; height: 1.5px;
          background: linear-gradient(90deg, transparent, #b45309, transparent);
          margin: 0 auto 20px;
        }
        .site-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.6rem, 9vw, 4.8rem);
          font-weight: 900;
          line-height: 1.04;
          color: #f7efe2;
          letter-spacing: -0.025em;
          text-shadow: 0 2px 40px rgba(0,0,0,0.7);
        }
        .telugu-title {
          display: block;
          font-family: 'Akaya Telivigala', serif;
          font-size: clamp(1.1rem, 2.8vw, 1.5rem);
          color: #b08050;
          font-weight: 400;
          letter-spacing: 0.05em;
          margin-top: 8px;
        }
        .site-tagline {
          margin-top: 18px;
          font-size: 0.97rem;
          font-weight: 300;
          color: rgba(230,200,160,0.65);
          line-height: 1.65;
          letter-spacing: 0.01em;
        }

        /* ── Section label ── */
        .section-label {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 22px;
          width: 100%;
          max-width: 900px;
        }
        .section-label-text {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(180,140,80,0.6);
          white-space: nowrap;
        }
        .section-hr {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, rgba(180,120,60,0.25), transparent);
        }

        /* ── FEATURED CARDS ── */
        .featured-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 18px;
          width: 100%;
          max-width: 900px;
          margin-bottom: 52px;
        }

        .featured-card {
          position: relative;
          border-radius: 22px;
          overflow: hidden;
          height: 330px;
          display: block;
          text-decoration: none;
          color: inherit;
          cursor: pointer;
          /* ── glassmorphism ── */
          background: rgba(20, 14, 8, 0.45);
          border: 1px solid rgba(220, 170, 90, 0.14);
          backdrop-filter: blur(12px) saturate(120%);
          -webkit-backdrop-filter: blur(12px) saturate(120%);
          box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.06);
          transition:
            border-color 0.35s ease,
            transform 0.38s cubic-bezier(0.23, 1, 0.32, 1),
            box-shadow 0.38s ease;
          will-change: transform;
        }
        .featured-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(160deg, rgba(255,255,255,0.05) 0%, transparent 55%);
          pointer-events: none;
          z-index: 2;
        }
        .featured-card .card-scene {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
          filter: brightness(0.3) saturate(0.6);
          z-index: 0;
        }
        /* Inner vignette on each card */
        .featured-card .card-vignette {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(to top, rgba(10,6,2,0.9) 0%, transparent 60%),
            linear-gradient(to bottom, rgba(10,6,2,0.5) 0%, transparent 40%);
          z-index: 1;
          pointer-events: none;
        }
        .featured-card:hover {
          border-color: rgba(220, 170, 90, 0.32);
          transform: translateY(-6px);
          box-shadow:
            0 20px 60px rgba(0, 0, 0, 0.65),
            0 0 0 1px rgba(220,170,90,0.18),
            inset 0 1px 0 rgba(255,255,255,0.08);
        }
        .featured-card:hover .card-scene {
          transform: scale(1.07);
          filter: brightness(0.4) saturate(0.75);
        }

        .card-content {
          position: absolute;
          inset: 0;
          z-index: 3;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 24px 26px;
        }

        /* Icon pill */
        .card-icon {
          width: 46px; height: 46px;
          border-radius: 13px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.10);
          backdrop-filter: blur(8px);
          color: #d4a96a;
        }

        /* Live badge */
        .live-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 10px;
          border-radius: 20px;
          background: rgba(15, 10, 5, 0.65);
          border: 1px solid rgba(200,150,70,0.22);
          font-size: 0.68rem;
          font-weight: 600;
          color: #c49a5a;
          letter-spacing: 0.06em;
          backdrop-filter: blur(8px);
        }
        .live-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #c49a5a;
          box-shadow: 0 0 6px rgba(196,154,90,0.8);
          animation: blink 2.2s ease-in-out infinite;
        }
        @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0.35; } }

        .card-body { display: flex; flex-direction: column; gap: 0; }

        /* Primary name — Telugu script, large and readable */
        .card-name-telugu {
          font-family: 'Akaya Telivigala', serif;
          font-size: 1.9rem;
          color: #f7f0e5;
          line-height: 1.2;
          text-shadow: 0 2px 16px rgba(0,0,0,0.8), 0 1px 4px rgba(0,0,0,0.9);
          letter-spacing: 0.01em;
        }
        /* English subtitle — small, clearly secondary */
        .card-name-en {
          font-size: 0.72rem;
          font-weight: 500;
          color: rgba(200,165,105,0.6);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-top: 5px;
        }
        /* Tagline — italic mood line */
        .card-tagline {
          font-size: 0.76rem;
          font-style: italic;
          color: rgba(200,170,120,0.5);
          margin-top: 2px;
          font-weight: 300;
          letter-spacing: 0.01em;
        }
        /* Description — legible, not overpowering */
        .card-desc {
          font-size: 0.8rem;
          color: rgba(215,185,145,0.7);
          line-height: 1.58;
          font-weight: 400;
          margin-top: 12px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .card-enter {
          margin-top: 14px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #c49a5a;
          transition: gap 0.22s ease;
        }
        .featured-card:hover .card-enter { gap: 13px; }

        /* ── COMING SOON GRID ── */
        .coming-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          width: 100%;
          max-width: 900px;
        }
        .coming-card {
          border-radius: 16px;
          padding: 16px 14px;
          /* glassmorphism — lighter than featured */
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255,255,255,0.07);
          backdrop-filter: blur(10px) saturate(110%);
          -webkit-backdrop-filter: blur(10px) saturate(110%);
          box-shadow: 0 4px 16px rgba(0,0,0,0.3);
          cursor: not-allowed;
          display: flex;
          flex-direction: column;
          gap: 10px;
          position: relative;
          overflow: hidden;
          transition: background 0.25s ease;
        }
        .coming-card::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.025) 0%, transparent 60%);
          pointer-events: none;
        }
        .coming-card:hover { background: rgba(255,255,255,0.065); }

        .coming-icon {
          width: 34px; height: 34px;
          border-radius: 9px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          display: flex; align-items: center; justify-content: center;
          color: rgba(180,140,90,0.35);
        }
        .coming-name {
          font-size: 0.8rem;
          font-weight: 600;
          color: rgba(230,200,160,0.4);
          line-height: 1.3;
        }
        .coming-tag {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 0.6rem; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(140,100,60,0.5);
        }

        /* ── Footer ── */
        .site-footer {
          margin-top: 72px;
          text-align: center;
          display: flex; flex-direction: column; gap: 5px;
        }
        .footer-rule {
          width: 36px; height: 1px;
          background: rgba(255,255,255,0.07);
          margin: 0 auto 12px;
        }
        .footer-text { font-size: 0.73rem; color: rgba(255,255,255,0.17); }

        /* ── Entrance animations ── */
        .fade-up {
          opacity: 0;
          transform: translateY(24px);
          animation: fu 0.7s cubic-bezier(0.23,1,0.32,1) forwards;
        }
        @keyframes fu { to { opacity:1; transform:translateY(0); } }
        .d1 { animation-delay: 0.1s; }
        .d2 { animation-delay: 0.22s; }
        .d3 { animation-delay: 0.36s; }
        .d4 { animation-delay: 0.52s; }
        .d5 { animation-delay: 0.66s; }

        /* ── Mobile ── */
        @media (max-width: 680px) {
          .page { padding: 44px 16px 60px; }
          .site-header { margin-bottom: 48px; }
          .featured-grid {
            grid-template-columns: 1fr;
            gap: 14px;
          }
          .featured-card { height: 280px; }
          .card-name-telugu { font-size: 1.45rem; }
          .coming-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
        }
        @media (max-width: 380px) {
          .featured-card { height: 260px; }
        }
      `}</style>

      {/* ── Background layers ── */}
      <div className="landing-bg" />
      <div className="fog-top" />
      <div className="fog-bottom" />
      <div className="fog-center" />
      <div className="grain" />

      {/* ── Page ── */}
      <div className="page">

        {/* HEADER */}
        <header className="site-header fade-up d1">
          <p className="kicker">Telugu Ambient Audio Spaces</p>
          <div className="title-divider" />
          <h1 className="site-title">
            Paatalashala
            <span className="telugu-title">పాటలశాల</span>
          </h1>
          <p className="site-tagline">
            Handcrafted soundscapes from the places that shaped us.<br />
            Pick a place. Let it play.
          </p>
        </header>

        {/* ── FEATURED ── */}
        <div className="section-label fade-up d2">
          <span className="section-label-text">Open now</span>
          <div className="section-hr" />
        </div>

        <div className="featured-grid fade-up d3">
          {active.map((place) => {
            const Icon = ICONS[place.slug] || IconTractor;
            const bg = CARD_BG[place.slug];

            return (
              <Link href={`/places/${place.slug}`} key={place.id} className="featured-card">
                {bg && (
                  <div
                    className="card-scene"
                    style={{ backgroundImage: `url('${prefixPath(bg)}')` }}
                  />
                )}
                <div className="card-vignette" />

                <div className="card-content">
                  {/* Top row: icon + live badge */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div className="card-icon"><Icon /></div>
                    {counts[place.slug] && (
                      <div className="live-badge">
                        <span className="live-dot" />
                        <IconUsers />
                        <span>{counts[place.slug]}</span>
                      </div>
                    )}
                  </div>

                  {/* Bottom: name block + desc + enter */}
                  <div className="card-body">
                    {/* Name block: Telugu primary, English secondary */}
                    <div>
                      <div className="card-name-telugu">
                        {TELUGU_NAMES[place.slug] || place.name}
                      </div>
                      <div className="card-name-en">{place.name}</div>
                      <div className="card-tagline">{place.tagline}</div>
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
        <div className="section-label fade-up d4">
          <span className="section-label-text">Coming soon</span>
          <div className="section-hr" />
        </div>

        <div className="coming-grid fade-up d5">
          {coming.map((place) => {
            const Icon = ICONS[place.slug] || IconTractor;
            return (
              <div key={place.id} className="coming-card">
                <div className="coming-icon"><Icon /></div>
                <div>
                  <div className="coming-name">{place.name}</div>
                  <div style={{ fontSize: '0.67rem', color: 'rgba(150,110,70,0.38)', marginTop: '3px', fontStyle: 'italic' }}>
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

        {/* FOOTER */}
        <footer className="site-footer fade-up d5">
          <div className="footer-rule" />
          <p className="footer-text">Paatalashala — a handcrafted Telugu audio space</p>
          <p className="footer-text" style={{ opacity: 0.5 }}>
            Streams via YouTube API. No media hosted.
          </p>
        </footer>

      </div>
    </>
  );
}
