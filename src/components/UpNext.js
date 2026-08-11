'use client';

import { Play, Disc } from 'lucide-react';

export default function UpNext({
  songs = [],
  currentSongIndex = 0,
  onSongSelect,
}) {
  if (!songs || songs.length === 0) return null;

  return (
    <div className="up-next-card glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h3 style={{
        fontSize: '1rem',
        fontWeight: '700',
        color: 'var(--color-text-primary)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        paddingBottom: '12px'
      }}>
        <Disc size={18} style={{ color: 'var(--color-accent)', animation: 'fan-spin 8s linear infinite' }} />
        <span>Queue ({songs.length} Tracks)</span>
      </h3>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        maxHeight: '260px',
        overflowY: 'auto',
        paddingRight: '4px'
      }}>
        {songs.map((song, index) => {
          const isActive = index === currentSongIndex;

          return (
            <div
              key={song.id}
              onClick={() => onSongSelect && onSongSelect(index)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: isActive ? 'rgba(245, 158, 11, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                border: isActive ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid transparent',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.transform = 'translateX(2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }
              }}
            >
              {/* Index or Play icon */}
              <div style={{
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem',
                color: isActive ? 'var(--color-accent)' : 'var(--color-text-muted)',
                fontWeight: '600'
              }}>
                {isActive ? <Play size={14} fill="var(--color-accent)" /> : (index + 1).toString().padStart(2, '0')}
              </div>

              {/* Title & movie */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden' }}>
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: isActive ? '600' : '500',
                  color: isActive ? 'var(--color-accent)' : 'var(--color-text-primary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {song.title}
                </span>
                <span style={{
                  fontSize: '0.75rem',
                  color: 'var(--color-text-secondary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {song.movie}
                </span>
              </div>

              {/* Year */}
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-muted)',
                fontFamily: 'var(--font-mono)'
              }}>
                {song.year}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
