'use client';

import Link from 'next/link';
import { ChevronLeft, Wind } from 'lucide-react';

// Header shared by all 6 space pages: back link + clock + ambience toggle +
// video-visibility toggle. Only the accent color and (for auto) the video
// icon/labels differ per space.
export default function SpaceHudHeader({
  timeString,
  ambientOn,
  onToggleAmbient,
  videoVisible,
  onToggleVideo,
  accentText,
  accentRgb,
  VideoIcon,
  videoLabelOn = 'HIDE',
  videoLabelOff = 'VIDEO',
  className,
}) {
  return (
    <header
      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', width: '100%', minHeight: '44px' }}
      className={className}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fff', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '600', padding: '8px 14px', borderRadius: '9999px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', whiteSpace: 'nowrap' }} className="hud-button">
          <ChevronLeft size={16} /><span>SPACES</span>
        </Link>
        {timeString && <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.05em' }} className="hud-time">{timeString}</span>}
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button onClick={onToggleAmbient}
          title="Toggle background ambient sounds"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', color: ambientOn ? accentText : 'rgba(255,255,255,0.5)', fontSize: '0.78rem', fontWeight: '600', padding: '8px 12px', borderRadius: '9999px', background: ambientOn ? `rgba(${accentRgb}, 0.15)` : 'rgba(255,255,255,0.06)', border: ambientOn ? `1px solid rgba(${accentRgb}, 0.35)` : '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s' }} className="hud-button">
          <Wind size={14} /><span className="btn-label">{ambientOn ? 'AMBIENCE' : 'OFF'}</span>
        </button>
        <button onClick={onToggleVideo}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', color: videoVisible ? accentText : '#fff', fontSize: '0.78rem', fontWeight: '600', padding: '8px 12px', borderRadius: '9999px', background: videoVisible ? `rgba(${accentRgb}, 0.2)` : 'rgba(255,255,255,0.08)', border: videoVisible ? `1px solid rgba(${accentRgb}, 0.4)` : '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', cursor: 'pointer', whiteSpace: 'nowrap' }} className="hud-button">
          <VideoIcon size={14} /><span className="btn-label">{videoVisible ? videoLabelOn : videoLabelOff}</span>
        </button>
      </div>
    </header>
  );
}
