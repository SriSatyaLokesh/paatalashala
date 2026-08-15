'use client';

import { Megaphone } from 'lucide-react';
import { prefixPath } from '@/utils/paths';

// Self-contained horn button (audio + click + styling). Only tractor-anna
// and auto use this — colors are a fixed amber in both, only the audio
// src/volume differ.
export default function HornButton({ variant, src, volume }) {
  const playHorn = () => {
    try {
      const a = new Audio(prefixPath(src));
      a.volume = volume;
      a.play().catch(() => {});
    } catch (_) {}
  };

  if (variant === 'mobile') {
    return (
      <button
        onClick={playHorn}
        title="Horn!"
        style={{ background: '#fbbf24', border: 'none', color: '#000', cursor: 'pointer', padding: '6px 10px', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: '700', boxShadow: '0 4px 12px rgba(245,158,11,0.4)', transition: 'transform 0.15s' }}
        className="horn-btn-mobile"
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <Megaphone size={14} fill="#000" />
        <span>HORN</span>
      </button>
    );
  }

  return (
    <button
      onClick={playHorn}
      title="Horn!"
      style={{ position: 'fixed', left: '32px', bottom: '24px', width: '48px', height: '48px', borderRadius: '50%', background: '#fbbf24', color: '#000', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(245, 158, 11, 0.45)', zIndex: 35, transition: 'transform 0.2s, background-color 0.2s' }}
      className="horn-btn-desktop"
      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.backgroundColor = '#f59e0b'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.backgroundColor = '#fbbf24'; }}
    >
      <Megaphone size={20} fill="#000" />
    </button>
  );
}
