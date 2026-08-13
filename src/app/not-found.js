'use client';

import Link from 'next/link';
import { prefixPath } from '@/utils/paths';

const IconHome = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const IconMusic = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18V5l12-2v13"/>
    <circle cx="6" cy="18" r="3"/>
    <circle cx="18" cy="16" r="3"/>
  </svg>
);

export default function NotFound() {
  const bgUrl = prefixPath('/images/landing_bg.avif');

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Akaya+Telivigala&family=Playfair+Display:wght@400;700;900&family=Inter:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; overflow: hidden; font-family: 'Inter', sans-serif; }

        /* ── Fixed background — same as landing ── */
        .nf-bg {
          position: fixed; inset: 0;
          background-image: url('${bgUrl}');
          background-size: cover;
          background-position: 18% top;
          background-repeat: no-repeat;
          filter: brightness(0.38) saturate(0.7);
          z-index: 0;
        }

        /* Fog layers — matching landing */
        .nf-fog-top {
          position: fixed; top: 0; left: 0; right: 0; height: 50%;
          background: linear-gradient(to bottom,
            rgba(6,3,1,0.92) 0%,
            rgba(6,3,1,0.5) 55%,
            transparent 100%
          );
          z-index: 1; pointer-events: none;
        }
        .nf-fog-bottom {
          position: fixed; bottom: 0; left: 0; right: 0; height: 60%;
          background: linear-gradient(to top,
            rgba(5,2,0,0.97) 0%,
            rgba(5,2,0,0.6) 45%,
            transparent 100%
          );
          z-index: 1; pointer-events: none;
        }
        .nf-glow {
          position: fixed;
          top: 25%; left: 20%; right: 20%; height: 50%;
          background: radial-gradient(ellipse at center,
            rgba(140,65,8,0.22) 0%,
            rgba(90,35,5,0.10) 50%,
            transparent 80%
          );
          filter: blur(70px);
          z-index: 1; pointer-events: none;
        }
        .nf-grain {
          position: fixed; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
          z-index: 2; pointer-events: none; opacity: 0.6;
        }

        /* ── Main content ── */
        .nf-page {
          position: relative; z-index: 10;
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px;
          color: #f0e8dc;
          text-align: center;
          gap: 0;
        }

        /* Floating music icon */
        .nf-icon-wrap {
          width: 64px; height: 64px;
          border-radius: 18px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(220,170,80,0.18);
          backdrop-filter: blur(12px);
          color: #c49a5a;
          margin-bottom: 32px;
          animation: float 3.5s ease-in-out infinite;
          box-shadow: 0 0 30px rgba(180,100,20,0.15), inset 0 1px 0 rgba(255,255,255,0.07);
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }

        /* 404 giant number */
        .nf-number {
          font-family: 'Playfair Display', serif;
          font-size: clamp(6rem, 20vw, 11rem);
          font-weight: 900;
          line-height: 1;
          letter-spacing: -0.04em;
          background: linear-gradient(160deg,
            rgba(245,225,180,0.9) 0%,
            rgba(180,110,40,0.7) 60%,
            rgba(120,65,15,0.5) 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: none;
          margin-bottom: 4px;
          position: relative;
        }
        /* subtle shimmer line under the number */
        .nf-number::after {
          content: '';
          position: absolute;
          bottom: 0; left: 50%;
          transform: translateX(-50%);
          width: 60px; height: 2px;
          background: linear-gradient(90deg, transparent, rgba(196,154,90,0.5), transparent);
          border-radius: 2px;
        }

        /* Telugu subtitle */
        .nf-telugu {
          font-family: 'Akaya Telivigala', serif;
          font-size: clamp(1.2rem, 4vw, 1.7rem);
          color: rgba(220,185,130,0.75);
          letter-spacing: 0.04em;
          margin-top: 12px;
          margin-bottom: 10px;
        }

        /* English headline */
        .nf-headline {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1rem, 3vw, 1.3rem);
          font-weight: 400;
          color: rgba(235,210,170,0.6);
          font-style: italic;
          letter-spacing: 0.01em;
          max-width: 380px;
          line-height: 1.55;
          margin-bottom: 40px;
        }

        /* Divider */
        .nf-divider {
          width: 40px; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(196,154,90,0.35), transparent);
          margin: 0 auto 36px;
        }

        /* CTA button — glassmorphism */
        .nf-cta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 28px;
          border-radius: 50px;
          text-decoration: none;
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #f0e0c0;
          background: rgba(180,100,20,0.2);
          border: 1px solid rgba(220,170,80,0.3);
          backdrop-filter: blur(16px) saturate(120%);
          -webkit-backdrop-filter: blur(16px) saturate(120%);
          box-shadow:
            0 8px 32px rgba(0,0,0,0.4),
            inset 0 1px 0 rgba(255,255,255,0.07);
          transition:
            background 0.3s ease,
            border-color 0.3s ease,
            transform 0.3s cubic-bezier(0.23,1,0.32,1),
            box-shadow 0.3s ease;
          cursor: pointer;
        }
        .nf-cta:hover {
          background: rgba(196,154,90,0.28);
          border-color: rgba(220,170,80,0.55);
          transform: translateY(-3px);
          box-shadow:
            0 16px 40px rgba(0,0,0,0.5),
            0 0 0 1px rgba(220,170,80,0.2),
            inset 0 1px 0 rgba(255,255,255,0.10);
        }

        /* Soft caption below CTA */
        .nf-caption {
          margin-top: 20px;
          font-size: 0.7rem;
          color: rgba(180,140,80,0.4);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        /* Entrance animation */
        .nf-enter {
          opacity: 0;
          transform: translateY(20px);
          animation: nfUp 0.8s cubic-bezier(0.23,1,0.32,1) forwards;
        }
        .nf-d1 { animation-delay: 0.05s; }
        .nf-d2 { animation-delay: 0.18s; }
        .nf-d3 { animation-delay: 0.3s; }
        .nf-d4 { animation-delay: 0.44s; }
        .nf-d5 { animation-delay: 0.58s; }
        @keyframes nfUp { to { opacity: 1; transform: translateY(0); } }

        /* Ambient musical notes drifting up */
        .notes-field {
          position: fixed; inset: 0;
          z-index: 3; pointer-events: none;
          overflow: hidden;
        }
        .note {
          position: absolute;
          font-size: 1rem;
          opacity: 0;
          color: rgba(196,154,90,0.25);
          animation: noteFloat linear infinite;
          user-select: none;
        }
        .note:nth-child(1)  { left: 8%;  animation-duration: 9s;  animation-delay: 0s; }
        .note:nth-child(2)  { left: 22%; animation-duration: 12s; animation-delay: 2s; }
        .note:nth-child(3)  { left: 38%; animation-duration: 8s;  animation-delay: 4s; }
        .note:nth-child(4)  { left: 55%; animation-duration: 11s; animation-delay: 1s; }
        .note:nth-child(5)  { left: 70%; animation-duration: 10s; animation-delay: 3s; }
        .note:nth-child(6)  { left: 85%; animation-duration: 13s; animation-delay: 0.5s; }
        .note:nth-child(7)  { left: 15%; animation-duration: 9.5s; animation-delay: 6s; }
        .note:nth-child(8)  { left: 48%; animation-duration: 14s; animation-delay: 5s; }
        @keyframes noteFloat {
          0%   { transform: translateY(100vh) rotate(-10deg); opacity: 0; }
          10%  { opacity: 0.6; }
          90%  { opacity: 0.2; }
          100% { transform: translateY(-20vh) rotate(15deg); opacity: 0; }
        }

        @media (max-width: 480px) {
          .nf-bg { background-position: left top; }
          .nf-icon-wrap { width: 52px; height: 52px; margin-bottom: 24px; }
          .nf-headline { margin-bottom: 28px; font-size: 0.95rem; }
          .nf-cta { padding: 12px 22px; }
        }
      `}</style>

      {/* ── Background ── */}
      <div className="nf-bg" />
      <div className="nf-fog-top" />
      <div className="nf-fog-bottom" />
      <div className="nf-glow" />
      <div className="nf-grain" />

      {/* ── Floating musical note symbols (SVG paths, no emoji) ── */}
      <div className="notes-field" aria-hidden="true">
        {['♩','♪','♫','♬','♩','♪','♫','♬'].map((n, i) => (
          <span key={i} className="note">{n}</span>
        ))}
      </div>

      {/* ── Content ── */}
      <div className="nf-page">

        {/* Music icon */}
        <div className="nf-icon-wrap nf-enter nf-d1">
          <IconMusic />
        </div>

        {/* 404 */}
        <div className="nf-number nf-enter nf-d2">404</div>

        {/* Telugu */}
        <div className="nf-telugu nf-enter nf-d3">
          చోటు దొరకలేదు
        </div>

        {/* English */}
        <p className="nf-headline nf-enter nf-d4">
          Place not found — but the best music is right here, waiting for you.
        </p>

        <div className="nf-divider nf-enter nf-d4" />

        {/* CTA */}
        <Link href="/" className="nf-cta nf-enter nf-d5">
          <IconHome />
          <span>Find your space</span>
        </Link>

        <p className="nf-caption nf-enter nf-d5">
          Go home · Explore all spaces
        </p>

      </div>
    </>
  );
}
