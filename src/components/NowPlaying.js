'use client';

import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  ExternalLink,
  Music,
  Compass
} from 'lucide-react';

export default function NowPlaying({
  song,
  isPlaying,
  volume,
  currentTime,
  duration,
  onPlayPauseToggle,
  onNext,
  onPrev,
  onVolumeChange,
  onSeek,
}) {
  if (!song) return null;

  // Format time (seconds to MM:SS)
  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return '00:00';
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleProgressBarClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const clickPercent = clickX / width;
    if (onSeek && duration > 0) {
      onSeek(clickPercent * duration);
    }
  };

  return (
    <div className="player-card glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Song Metadata */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '10px',
          background: 'rgba(255, 255, 255, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          <Music size={24} style={{ color: 'var(--color-accent)' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, overflow: 'hidden' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {song.title}
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {song.movie} • {song.year}
          </p>
        </div>
      </div>

      {/* Artists details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '0.8rem', color: 'var(--color-text-muted)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px' }}>
        <div><strong style={{ color: 'rgba(255,255,255,0.6)' }}>Singers:</strong> {song.artist}</div>
        <div><strong style={{ color: 'rgba(255,255,255,0.6)' }}>Music:</strong> {song.musicDirector}</div>
      </div>

      {/* Progress Bar & Timers */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div 
          onClick={handleProgressBarClick}
          style={{
            height: '6px',
            width: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '3px',
            position: 'relative',
            cursor: 'pointer',
            overflow: 'hidden',
          }}
        >
          <div 
            style={{
              height: '100%',
              width: `${progressPercent}%`,
              backgroundColor: 'var(--color-accent)',
              borderRadius: '3px',
              transition: 'width 0.2s linear',
            }}
          />
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)' }}>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Playback Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
        <button 
          onClick={onPrev}
          aria-label="Previous song"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-secondary)'}
        >
          <SkipBack size={22} />
        </button>

        <button 
          onClick={onPlayPauseToggle}
          aria-label={isPlaying ? "Pause music" : "Play music"}
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-accent)',
            border: 'none',
            color: '#000',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s, background-color 0.2s',
            boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.backgroundColor = '#fbbf24';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.backgroundColor = 'var(--color-accent)';
          }}
        >
          {isPlaying ? <Pause size={24} fill="#000" /> : <Play size={24} fill="#000" style={{ transform: 'translateX(2px)' }} />}
        </button>

        <button 
          onClick={onNext}
          aria-label="Next song"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-secondary)'}
        >
          <SkipForward size={22} />
        </button>
      </div>

      {/* Volume Control */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '4px 0' }}>
        <Volume2 size={16} style={{ color: 'var(--color-text-secondary)' }} />
        <input 
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => onVolumeChange(parseInt(e.target.value))}
          style={{
            flex: 1,
            height: '4px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '2px',
            outline: 'none',
            cursor: 'pointer',
            accentColor: 'var(--color-accent)',
          }}
          aria-label="Volume slider"
        />
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', width: '28px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
          {volume}%
        </span>
      </div>

      {/* Destinations Outbound Links */}
      <div style={{
        display: 'flex',
        gap: '12px',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        paddingTop: '16px',
        justifyContent: 'space-between',
        fontSize: '0.8rem',
      }}>
        <a 
          href={song.youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--color-text-secondary)',
            textDecoration: 'none',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-secondary)'}
        >
          <Compass size={14} />
          <span>YouTube Video</span>
          <ExternalLink size={12} />
        </a>

        {song.spotifyUrl && (
          <a 
            href={song.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--color-text-secondary)',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#1db954'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-secondary)'}
          >
            <Music size={14} />
            <span>Spotify Track</span>
            <ExternalLink size={12} />
          </a>
        )}
      </div>
    </div>
  );
}
