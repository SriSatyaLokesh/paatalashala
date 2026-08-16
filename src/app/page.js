'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SPACES } from '@/data/spaces';
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
const IconRadio = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="8" width="20" height="14" rx="2" ry="2"/>
    <path d="M6 14h.01"/><path d="M10 14h.01"/><path d="M14 14h.01"/><path d="M18 14h.01"/>
    <circle cx="12" cy="18" r="2"/>
    <path d="M16 3L8 8"/>
  </svg>
);
const IconTape = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" ry="2"/>
    <circle cx="8" cy="12" r="3"/><circle cx="16" cy="12" r="3"/>
    <path d="M6 12h12"/><path d="M6 16h12"/>
  </svg>
);
const IconBusLocal = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="13" rx="2"/><circle cx="7" cy="19" r="2"/><circle cx="17" cy="19" r="2"/>
    <path d="M3 10h18"/><path d="M8 3v7"/><path d="M16 3v7"/>
  </svg>
);
const IconVanTrip = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 18H6a2 2 0 01-2-2V8a2 2 0 012-2h12l4 4v6a2 2 0 01-2 2h-2"/>
    <circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>
    <path d="M4 10h18"/><path d="M9 6v4"/>
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
const IconStars = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
  </svg>
);
const IconSparkles = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5.5z" fill="currentColor" stroke="none" />
    <path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z" fill="currentColor" stroke="none" />
  </svg>
);

const ICONS = {
  'tractor-anna': IconTractor,
  'saloon': IconScissors,
  'auto': IconAuto,
  'tea-stall': IconCup,
  'ammama': IconRadio,
  'thathayya': IconTape,
  'vennallo': IconStars,
  'sammelanam': IconSparkles,
  'palle-velugu': IconBusLocal,
  'trip-bus': IconVanTrip,
};

const TELUGU_NAMES = {
  'tractor-anna': 'ట్రాక్టర్ అన్న',
  'saloon': 'రాయల్ సెలూన్',
  'auto': 'ఆటో జానీ',
  'thathayya': 'తాతయ్య టేప్ రికార్డర్',
  'ammama': 'అమ్మమ్మ రేడియో',
  'vennallo': 'మేడ మీద వెన్నెల్లో',
  'sammelanam': 'Surprise Me',
};

const CARD_BG = {
  'tractor-anna': '/images/sunset_farm_background.webp',
  'saloon': '/images/saloon_background.webp',
  'auto': '/images/hyderabad_street_background.jpg',
  'thathayya': '/images/tape_recorder_background.webp',
  'ammama': '/images/grandma_1.webp',
  'vennallo': '/images/vennela_1.webp',
  'sammelanam': '/images/vennela_2.webp',
};

const PRESENCE_SIM_CONFIG = {
  'tractor-anna': { base: 83, sineAmp: 5, cosAmp: 2 },
  'saloon': { base: 43, sineAmp: 4, cosAmp: 2 },
  'auto': { base: 98, sineAmp: 6, cosAmp: 3 },
  'ammama': { base: 43, sineAmp: 4, cosAmp: 2 },
  'thathayya': { base: 35, sineAmp: 3, cosAmp: 1 },
  'vennallo': { base: 52, sineAmp: 5, cosAmp: 2 },
  'sammelanam': { base: 60, sineAmp: 6, cosAmp: 3 },
};

export default function Home() {
  const [counts, setCounts] = useState({});
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const sim = () => {
      const c = {};
      for (const p of SPACES) {
        if (p.active) {
          const cfg = PRESENCE_SIM_CONFIG[p.slug] || { base: 40, sineAmp: 4, cosAmp: 2 };
          const s = Math.floor(Date.now() / 4000);
          c[p.slug] = Math.max(1, Math.round(cfg.base + Math.sin(s * 0.5 + p.id.length) * cfg.sineAmp + Math.cos(s * 0.2) * cfg.cosAmp));
        }
      }
      setCounts(c);
    };
    sim();
    const iv = setInterval(sim, 4000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  const active = SPACES.filter(p => p.active && p.slug !== 'sammelanam');
  const sammelanamSpace = SPACES.find(p => p.slug === 'sammelanam');
  const coming = SPACES.filter(p => !p.active);
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
          /* Push right so woman is centre-left; decorative text falls behind card area */
          background-position: 18% top;
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
          margin-bottom: 24px;
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
          margin-bottom: 12px;
          width: 100%;
          max-width: 1020px;
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
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
          width: 100%;
          max-width: 1020px;
          margin-bottom: 18px;
        }

        .surprise-me-button {
          position: relative;
          border-radius: 22px;
          overflow: hidden;
          width: 100%;
          max-width: 1020px;
          height: 68px;
          display: block;
          text-decoration: none;
          color: inherit;
          cursor: pointer;
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
          margin-bottom: 52px;
        }
        .surprise-me-button::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(160deg, rgba(255,255,255,0.05) 0%, transparent 55%);
          pointer-events: none;
          z-index: 2;
        }
        .surprise-me-button .surprise-me-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
          filter: brightness(0.25) saturate(0.6);
          z-index: 0;
        }
        .surprise-me-button .surprise-me-vignette {
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, rgba(10,6,2,0.85) 0%, transparent 100%);
          z-index: 1;
          pointer-events: none;
        }
        .surprise-me-button:hover {
          border-color: rgba(220, 170, 90, 0.32);
          transform: translateY(-2px);
          box-shadow:
            0 12px 40px rgba(0, 0, 0, 0.6),
            0 0 0 1px rgba(220,170,90,0.18),
            inset 0 1px 0 rgba(255,255,255,0.08);
        }
        .surprise-me-button:hover .surprise-me-bg {
          transform: scale(1.02);
          filter: brightness(0.3) saturate(0.75);
        }
        .surprise-me-content {
          position: absolute;
          inset: 0;
          z-index: 3;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
        }
        .surprise-me-left {
          display: flex;
          align-items: center;
          gap: 16px;
          min-width: 0;
        }
        .surprise-me-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(8px);
          color: #d4a96a;
          flex-shrink: 0;
        }
        .surprise-me-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.25rem;
          font-weight: 800;
          color: #f7f0e5;
          text-shadow: 0 1px 4px rgba(0,0,0,0.9);
        }
        .surprise-me-desc {
          font-size: 0.75rem;
          color: rgba(218,188,148,0.7);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 480px;
        }
        .surprise-me-right {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }
        .surprise-me-button:hover .card-enter {
          gap: 10px;
        }

        @media (max-width: 680px) {
          .surprise-me-desc { display: none; }
          .surprise-me-button { height: 56px; }
          .surprise-me-title { font-size: 1.05rem; }
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

        /* PRIMARY — Telugu name, bold headline */
        .card-name-telugu {
          font-family: 'Akaya Telivigala', serif;
          font-size: 1.9rem;
          color: #f7f0e5;
          line-height: 1.2;
          text-shadow: 0 2px 18px rgba(0,0,0,0.9), 0 1px 4px rgba(0,0,0,0.95);
          letter-spacing: 0.01em;
        }
        /* SECONDARY — English subtitle, clearly subordinate */
        .card-name-en {
          font-size: 0.7rem;
          font-weight: 600;
          color: rgba(200,162,100,0.62);
          letter-spacing: 0.13em;
          text-transform: uppercase;
          margin-top: 6px;
        }
        /* Description */
        .card-desc {
          font-size: 0.8rem;
          color: rgba(218,188,148,0.72);
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
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
          width: 100%;
          max-width: 1020px;
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
          color: rgba(229, 185, 126, 0.7);
        }
        .coming-name {
          font-size: 0.8rem;
          font-weight: 600;
          color: rgba(243, 222, 194, 0.9);
          line-height: 1.3;
        }
        .coming-tag {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 0.6rem; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(245, 158, 11, 0.85);
        }

        /* ── Footer ── */
        .site-footer {
          margin-top: 72px;
          text-align: center;
          display: flex; flex-direction: column; gap: 8px;
          align-items: center;
        }
        .footer-rule {
          width: 36px; height: 1px;
          background: rgba(255,255,255,0.07);
          margin: 0 auto 14px;
        }
        .footer-text { font-size: 0.73rem; color: rgba(255,255,255,0.17); }
        .footer-craft {
          font-size: 0.78rem;
          color: rgba(200,165,100,0.55);
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .footer-link {
          color: rgba(210,175,110,0.75);
          text-decoration: none;
          border-bottom: 1px solid rgba(210,175,110,0.25);
          transition: color 0.2s ease, border-color 0.2s ease;
          font-weight: 600;
          letter-spacing: 0.02em;
        }
        .footer-link:hover {
          color: #c49a5a;
          border-color: rgba(196,154,90,0.6);
        }
        .footer-divot {
          width: 3px; height: 3px;
          border-radius: 50%;
          background: rgba(180,130,70,0.35);
          display: inline-block;
        }

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

        @media (max-width: 960px) {
          .featured-grid {
            grid-template-columns: repeat(2, 1fr);
            max-width: 680px;
          }
          .section-label {
            max-width: 680px;
          }
          .coming-grid {
            grid-template-columns: repeat(3, 1fr);
            max-width: 680px;
          }
        }

        /* ── Mobile ── */
        @media (max-width: 680px) {
          /* Shift bg left so woman is visible, decorative text pushed off right */
          .landing-bg {
            background-position: left top !important;
          }
          .page { padding: 44px 16px 60px; }
          .site-header { margin-bottom: 48px; }
          .featured-grid {
            grid-template-columns: 1fr;
            gap: 14px;
          }
          .featured-card { height: 270px; }
          .card-name-telugu { font-size: 1.5rem; }
          .card-desc { -webkit-line-clamp: 2; }
          .coming-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
        }
        @media (max-width: 380px) {
          .landing-bg { background-position: left top !important; }
          .featured-card { height: 250px; }
          .card-name-telugu { font-size: 1.35rem; }
        }

        /* ── FAQ Section Styles ── */
        .faq-section {
          width: 100%;
          max-width: 1020px;
          margin-top: 64px;
          margin-bottom: 32px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .faq-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.6rem;
          color: #f7efe2;
          font-weight: 700;
          letter-spacing: -0.01em;
          border-left: 3px solid #b45309;
          padding-left: 12px;
        }
        .faq-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .faq-item {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 14px;
          padding: 20px;
          backdrop-filter: blur(8px);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .faq-question {
          font-size: 0.92rem;
          font-weight: 600;
          color: #e6c8a0;
          line-height: 1.4;
        }
        .faq-answer {
          font-size: 0.82rem;
          font-weight: 300;
          color: rgba(240, 232, 220, 0.65);
          line-height: 1.5;
        }
        @media (max-width: 960px) {
          .faq-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 680px) {
          .faq-grid {
            grid-template-columns: 1fr;
          }
          .faq-section {
            margin-top: 48px;
          }
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
            Handcrafted soundscapes from the spaces that shaped us.<br />
            Pick a space. Let it play.
          </p>
        </header>

        {/* ── FEATURED ── */}
        <h2 className="section-label fade-up d2" style={{ fontSize: 'inherit', fontWeight: 'inherit', margin: '0 0 12px 0' }}>
          <span className="section-label-text">Open now</span>
          <span className="section-hr" />
        </h2>

        <div className="featured-grid fade-up d3">
          {active.map((place) => {
            const Icon = ICONS[place.slug] || IconTractor;
            const bg = CARD_BG[place.slug];

            return (
              <Link href={`/spaces/${place.slug}`} key={place.id} className="featured-card">
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

                  {/* Bottom: just two lines — Telugu + English */}
                  <div className="card-body">
                    <div>
                      <div className="card-name-telugu">
                        {TELUGU_NAMES[place.slug] || place.name}
                      </div>
                      <div className="card-name-en">{place.name}</div>
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

        {sammelanamSpace && (
          <Link href={`/spaces/${sammelanamSpace.slug}`} className="surprise-me-button fade-up d3">
            {CARD_BG[sammelanamSpace.slug] && (
              <div
                className="surprise-me-bg"
                style={{ backgroundImage: `url('${prefixPath(CARD_BG[sammelanamSpace.slug])}')` }}
              />
            )}
            <div className="surprise-me-vignette" />

            <div className="surprise-me-content">
              <div className="surprise-me-left">
                <div className="surprise-me-icon">
                  <IconSparkles />
                </div>
                <div>
                  <div className="surprise-me-title">Surprise Me</div>
                  <p className="surprise-me-desc">{sammelanamSpace.description}</p>
                </div>
              </div>

              <div className="surprise-me-right">
                {counts[sammelanamSpace.slug] && (
                  <div className="live-badge" style={{ marginRight: '16px' }}>
                    <span className="live-dot" />
                    <IconUsers />
                    <span>{counts[sammelanamSpace.slug]}</span>
                  </div>
                )}
                <div className="card-enter" style={{ marginTop: 0 }}>
                  <span>Enter</span>
                  <IconArrow />
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* ── COMING SOON ── */}
        <h2 className="section-label fade-up d4" style={{ fontSize: 'inherit', fontWeight: 'inherit', margin: '0 0 12px 0' }}>
          <span className="section-label-text">Coming soon</span>
          <span className="section-hr" />
        </h2>

        <div className="coming-grid fade-up d5">
          {coming.map((place) => {
            const Icon = ICONS[place.slug] || IconTractor;
            return (
              <div key={place.id} className="coming-card">
                <div className="coming-icon"><Icon /></div>
                <div>
                  <div className="coming-name">{place.name}</div>
                  <div style={{ fontSize: '0.67rem', color: 'rgba(230, 220, 200, 0.62)', marginTop: '3px', fontStyle: 'italic' }}>
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

        {isInstallable && (
          <div className="fade-up d5" style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '32px', marginBottom: '8px' }}>
            <button
              onClick={handleInstallClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'rgba(196, 154, 90, 0.1)',
                border: '1px solid rgba(196, 154, 90, 0.4)',
                borderRadius: '9999px',
                color: '#e6c8a0',
                padding: '12px 28px',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(196, 154, 90, 0.2)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(196, 154, 90, 0.1)';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Install Paatalashala App</span>
            </button>
          </div>
        )}

        {/* ── FAQ SECTION ── */}
        <section className="faq-section fade-up d5">
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3 className="faq-question">What is Paatalashala?</h3>
              <p className="faq-answer">
                Paatalashala is an interactive ambient audio player that blends curated Telugu music with nostalgic cultural soundscapes like farmland tractors, retro saloons, and Hyderabad city auto-rickshaws.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">How does the live listener counter work?</h3>
              <p className="faq-answer">
                The live listener counters are powered in real-time by Supabase Presence WebSocket channels, showing the exact count of concurrent visitors on each space.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">Are the music files hosted on Paatalashala?</h3>
              <p className="faq-answer">
                No, all music is streamed dynamically in real-time using the official YouTube Player API. No audio files are hosted on our servers.
              </p>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="site-footer fade-up d5">
          <div className="footer-rule" />

          {/* Handcrafted by line */}
          <div className="footer-craft">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color:'rgba(196,154,90,0.6)'}}>
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
            <span>Handcrafted by</span>
            <a href="https://srisatyalokesh.is-a.dev/" target="_blank" rel="noopener noreferrer" className="footer-link">
              SriSatyaLokesh
            </a>
          </div>

          {/* Visit my work line */}
          <div className="footer-craft" style={{gap:'10px', marginTop:'4px'}}>
            <a href="https://srisatyalokesh.is-a.dev/" target="_blank" rel="noopener noreferrer" className="footer-link">
              Know about me
            </a>
            <span className="footer-divot" />
            <a href="https://github.com/SriSatyaLokesh/paatalashala" target="_blank" rel="noopener noreferrer" className="footer-link" style={{display:'inline-flex',alignItems:'center',gap:'5px'}}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              View on GitHub
            </a>
          </div>

          <p className="footer-text" style={{marginTop:'10px'}}>
            Streams via YouTube API. No media hosted.
          </p>
        </footer>

      </div>
    </>
  );
}
