'use client';

import { Volume2, VolumeX, Shuffle, Play, Pause } from 'lucide-react';

// The bottom glass "capsule" player card shared by all 6 spaces: vinyl art,
// track info, shuffle/prev/play/next, volume, seek bar + timestamps.
// `theme` carries every literal that differs per space (colors, sizes,
// fallback text) — see each space page's own THEME object, copied 1:1 from
// its original inline styles. `hornSlot`/`mobileListenersSlot` are optional
// rendered nodes (null for spaces without them).
export default function PlayerCapsule({
  theme,
  currentSong,
  isPlaying, onTogglePlay,
  isShuffle, onToggleShuffle, showShuffleHint,
  onPrev, onNext,
  volume, onChangeVolume, volumeHovered, onVolumeHoverChange,
  currentTime, duration, onSeek, seekHovered, onSeekHoverChange, fmt,
  hornSlot = null,
  mobileListenersSlot = null,
}) {
  const t = theme;
  const iconClass = t.showControlIconHoverClass ? 'control-icon' : undefined;
  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div style={{
      background: t.glassBg,
      backdropFilter: 'blur(30px) saturate(160%)',
      border: `1px solid ${t.glassBorder}`,
      borderRadius: '24px',
      padding: '20px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      boxShadow: t.glassShadow,
      position: 'relative',
    }} className="capsule-hud">

      <div className="player-main-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '16px' }}>

        <div className="track-info-container" style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
          <div style={{
            width: `${t.vinylSize}px`,
            height: `${t.vinylSize}px`,
            borderRadius: '50%',
            overflow: 'hidden',
            border: t.vinylBorder,
            boxShadow: t.vinylRingShadow,
            flexShrink: 0,
            position: 'relative',
            background: t.vinylBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animationName: 'spin',
            animationDuration: '8s',
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            animationPlayState: isPlaying ? 'running' : 'paused',
          }}>
            {currentSong?.youtubeVideoId ? (
              <img
                src={`https://img.youtube.com/vi/${currentSong.youtubeVideoId}/hqdefault.jpg`}
                alt={t.artAlt}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <span style={{ fontSize: '1.2rem' }}>{t.fallbackEmoji}</span>
            )}
            <div style={{
              position: 'absolute', width: '8px', height: '8px', borderRadius: '50%',
              background: t.spindleBg, border: '1px solid rgba(255,255,255,0.2)',
              top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 2,
            }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
            <span style={{ fontSize: t.titleFontSize, fontWeight: '800', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: '0.01em' }}>
              {currentSong?.title || t.fallbackTitle}
            </span>
            <span style={{ fontSize: '0.75rem', color: t.secondaryColor, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {currentSong?.movie ? t.subtitleFormat(currentSong.movie, currentSong.year) : t.subtitleFallback}
            </span>
          </div>
        </div>

        <div className="player-controls-container" style={{ display: 'flex', alignItems: 'center', gap: '1.3rem', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={onToggleShuffle}
              title="Toggle shuffle mode (play songs in random order)"
              style={{ background: 'none', border: 'none', color: isShuffle ? t.accentText : 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center', transition: 'color 0.2s, transform 0.2s', position: 'relative' }}
              className={iconClass}
            >
              <Shuffle size={16} />
              {showShuffleHint && (
                <div style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%) translateY(-8px)', background: '#fbbf24', color: '#000', padding: '6px 10px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '700', whiteSpace: 'nowrap', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', pointerEvents: 'none', zIndex: 10 }}>
                  Shuffle to surprise with new songs!
                  <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '5px solid #fbbf24' }} />
                </div>
              )}
            </button>

            <button onClick={onPrev} title={t.prevTitle} style={{ background: 'none', border: 'none', color: t.prevNextColor, cursor: 'pointer', padding: '6px', fontSize: '1.2rem', transition: 'transform 0.2s' }} className={iconClass}>⏮</button>

            <button onClick={onTogglePlay}
              title={isPlaying ? 'Pause' : 'Play'}
              style={{ width: '44px', height: '44px', borderRadius: '50%', background: t.accentText, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: t.playShadow, transition: 'transform 0.2s, background-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isPlaying ? (
                  <Pause size={18} fill={t.playIconColor} color={t.playIconColor} />
                ) : (
                  <Play size={18} fill={t.playIconColor} color={t.playIconColor} style={{ transform: 'translateX(1px)' }} />
                )}
              </span>
            </button>

            <button onClick={onNext} title={t.nextTitle} style={{ background: 'none', border: 'none', color: t.prevNextColor, cursor: 'pointer', padding: '6px', fontSize: '1.2rem', transition: 'transform 0.2s' }} className={iconClass}>⏭</button>

            {hornSlot}
          </div>

          <div style={{ width: '1px', height: '24px', backgroundColor: t.dividerColor }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="volume-slider-container"
            onMouseEnter={() => onVolumeHoverChange(true)}
            onMouseLeave={() => onVolumeHoverChange(false)}
          >
            <button
              onClick={() => onChangeVolume(volume === 0 ? t.restoreVolume : 0)}
              style={{ background: 'none', border: 'none', color: volume === 0 ? '#ef4444' : t.secondaryColor, cursor: 'pointer', padding: 0, transition: 'color 0.2s' }}
              title={volume === 0 ? 'Unmute' : 'Mute'}
            >
              {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <input
              type="range" min="0" max="100" value={volume}
              onChange={e => onChangeVolume(parseInt(e.target.value))}
              style={{ width: `${t.volumeWidth}px`, height: volumeHovered ? '6px' : '4px', borderRadius: '3px', background: t.volumeTrackBg, accentColor: t.accentText, cursor: 'pointer', transition: 'height 0.15s ease' }}
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
        <div
          onClick={onSeek}
          onMouseEnter={() => onSeekHoverChange(true)}
          onMouseLeave={() => onSeekHoverChange(false)}
          style={{ height: seekHovered ? '8px' : '6px', width: '100%', backgroundColor: t.seekTrackBg, borderRadius: '4px', position: 'relative', cursor: 'pointer', transition: 'height 0.15s ease, background-color 0.2s' }}
        >
          <div style={{ height: '100%', width: `${progressPct}%`, background: t.accentText, borderRadius: '4px', boxShadow: t.seekFillShadow, transition: 'width 0.1s linear' }} />
          {t.showSeekThumb && (
            <div style={{
              position: 'absolute', top: '50%', left: `${progressPct}%`, transform: 'translate(-50%, -50%)',
              width: seekHovered ? '14px' : '10px', height: seekHovered ? '14px' : '10px', borderRadius: '50%',
              backgroundColor: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.5)', opacity: 1, pointerEvents: 'none',
              transition: 'width 0.15s ease, height 0.15s ease',
            }} />
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: t.secondaryColor, fontFamily: 'monospace', letterSpacing: '0.02em' }}>
          <span>{fmt(currentTime)}</span>
          <span>{duration > 0 ? fmt(duration) : '0:00'}</span>
        </div>
      </div>

      {mobileListenersSlot}
    </div>
  );
}
