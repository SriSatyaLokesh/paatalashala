'use client';

import { useState, useEffect } from 'react';
import { useSpacePlayer } from '@/hooks/useSpacePlayer';
import { useSpaceKeyboardShortcuts } from '@/hooks/useSpaceKeyboardShortcuts';
import placeSongs from '@/data/songs/campfire-jamming.json';
import SpaceHudHeader from '@/components/space/SpaceHudHeader';
import FloatingYouTubePlayer from '@/components/space/FloatingYouTubePlayer';
import PlayerErrorBanner from '@/components/space/PlayerErrorBanner';
import PlayerCapsule from '@/components/space/PlayerCapsule';
import RadialVignette from '@/components/space/RadialVignette';
import { ListenersBadgeSingle } from '@/components/space/ListenersBadge';
import ParallaxStars from '@/components/space/ParallaxStars';
import ThreeCampfireBackground from '@/components/space/ThreeCampfireBackground';
import { Tv, Sparkles, Wind, Info, X } from 'lucide-react';

const AMBIENT_AUDIO = { src: '/audio/night_sky_ambience.mp3', volume: 0.10, gate: 'none' };
const PRESENCE_CONFIG = { channel: 'presence-campfire-jamming', base: 48, sineAmp: 6, cosAmp: 3, syncPad: 12, catchSpread: 10, catchOffset: 5 };
const AUTO_SKIP = { enabled: true, delayMs: 1500, codes: [101, 150] };

const CAPSULE_THEME = {
  accentText: '#ff9800', accentRgb: '255, 152, 0',
  glassBg: 'rgba(15, 12, 10, 0.85)', glassBorder: 'rgba(255, 152, 0, 0.3)',
  glassShadow: '0 25px 60px -15px rgba(0,0,0,0.95), inset 0 1px 1px rgba(255,255,255,0.15)',
  vinylSize: 48, vinylBorder: '3px solid #3e1b00',
  vinylRingShadow: '0 0 0 2px rgba(255, 152, 0, 0.4), 0 8px 16px rgba(0,0,0,0.8)',
  vinylBg: '#000', spindleBg: '#1a0c00',
  artAlt: 'Track Art', fallbackEmoji: '🔥', fallbackTitle: 'క్యాంప్ ఫైర్ జామ్మింగ్',
  titleFontSize: '1.05rem', secondaryColor: '#ffcc80',
  subtitleFallback: 'Campfire Jamming Hits',
  subtitleFormat: (movie, year) => `${movie} • ${year}`,
  prevNextColor: 'rgba(255,255,255,0.9)', prevTitle: 'Previous Track', nextTitle: 'Next Track',
  dividerColor: 'rgba(255,255,255,0.15)',
  playIconColor: '#2b1000', playShadow: '0 4px 18px rgba(255, 152, 0, 0.6)',
  restoreVolume: 50, volumeTrackBg: 'rgba(255,255,255,0.2)', volumeWidth: 65,
  seekTrackBg: 'rgba(255, 255, 255, 0.2)', seekFillShadow: '0 0 12px rgba(255, 152, 0, 0.9)',
  showSeekThumb: false, showControlIconHoverClass: false,
};

export default function CampFireMelodies() {
  const player = useSpacePlayer(placeSongs, {
    initialVolume: 50,
    ambientAudio: AMBIENT_AUDIO,
    presence: PRESENCE_CONFIG,
    autoSkipOnError: AUTO_SKIP,
  });

  const {
    currentSong, isPlaying, volume, currentTime, duration, presenceCount, timeString,
    ambientOn, setAmbientOn, playerError, isShuffle, setIsShuffle, seekHovered, setSeekHovered,
    volumeHovered, setVolumeHovered, showShuffleHint, videoVisible, setVideoVisible,
    handlePlayerReady, handlePlayerError, handleStateChange, handleTimeUpdate,
    togglePlay, next, prev, seek, seekBy, changeVolume, fmt,
  } = player;

  useSpaceKeyboardShortcuts({
    onTogglePlay: togglePlay, onNext: next, onPrev: prev, onChangeVolume: changeVolume,
    onSeekBy: seekBy,
    volume, restoreVolume: CAPSULE_THEME.restoreVolume,
    toggleShuffle: () => setIsShuffle(prev => !prev),
  });

  const [showTooltip, setShowTooltip] = useState(true);
  const [pointerPos, setPointerPos] = useState({ x: -100, y: -100, visible: false });

  // Auto-dismiss tooltip after 9 seconds, but allow user to reopen at any time via small trigger button
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 9000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handlePointerMove = (e) => {
      setPointerPos({ x: e.clientX, y: e.clientY, visible: true });
    };
    const handleMouseLeave = () => {
      setPointerPos(prev => ({ ...prev, visible: false }));
    };

    window.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="campfire-page-root" style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', overflow: 'hidden', color: '#fff', background: '#0d0f17' }}>
      {/* ── Subtle Glowing Amber Pointer Dot ── */}
      {pointerPos.visible && (
        <div
          className="campfire-torch-cursor"
          style={{
            left: `${pointerPos.x}px`,
            top: `${pointerPos.y}px`,
          }}
        />
      )}

      {/* ── Background Sky & 3D Campfire ── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <ParallaxStars />
        <ThreeCampfireBackground isPlaying={isPlaying} />
        
        {/* Camping Tent Layered on Right-most Side of Campfire */}
        <div
          className="campfire-tent-container"
          style={{
            position: 'absolute',
            bottom: '32vh',
            right: '2vw',
            width: '480px',
            maxWidth: '36vw',
            pointerEvents: 'none',
            zIndex: 1,
            transition: 'transform 0.5s ease, filter 0.5s ease',
            filter: isPlaying
              ? 'drop-shadow(0 10px 25px rgba(0,0,0,0.85)) drop-shadow(-20px -5px 40px rgba(255, 152, 0, 0.4)) brightness(0.98)'
              : 'drop-shadow(0 10px 25px rgba(0,0,0,0.9)) brightness(0.72)',
          }}
        >
          <img
            src="/images/camping_tent.webp"
            alt="Camping Tent"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              objectFit: 'contain',
              userSelect: 'none',
            }}
          />
        </div>

        <RadialVignette innerColor="rgba(15, 23, 42, 0.02)" outerColor="rgba(5, 7, 12, 0.36)" />
      </div>

      {/* Top Header HUD */}
      <div style={{ position: 'fixed', top: '16px', left: '20px', right: '20px', zIndex: 50, pointerEvents: 'auto' }}>
        <SpaceHudHeader
          timeString={timeString}
          ambientOn={ambientOn}
          onToggleAmbient={() => setAmbientOn(a => !a)}
          videoVisible={videoVisible}
          onToggleVideo={() => setVideoVisible(v => !v)}
          accentText={CAPSULE_THEME.accentText}
          accentRgb={CAPSULE_THEME.accentRgb}
          VideoIcon={Tv}
          className="hud-top-header"
        />
      </div>

      {/* Immersive Space Title */}
      <div
        className="campfire-title-container"
        style={{
          position: 'fixed',
          top: '9vh',
          left: 0,
          right: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          userSelect: 'none',
          padding: '0 24px',
          zIndex: 10,
        }}
      >
        <h2 style={{ fontSize: '4.2rem', fontWeight: '900', letterSpacing: '0.04em', color: '#fff', margin: 0, textShadow: '0 2px 10px rgba(0,0,0,0.9), 0 0 35px rgba(245, 158, 11, 0.45)', fontFamily: "'Akaya Telivigala', 'Gurajada', serif", textAlign: 'center' }} className="campfire-title">
          క్యాంప్ ఫైర్ జామ్మింగ్
        </h2>
      </div>

      {/* Floating Picture-in-Picture YouTube Player */}
      <FloatingYouTubePlayer
        videoVisible={videoVisible}
        videoId={currentSong?.youtubeVideoId}
        isPlaying={isPlaying}
        volume={volume}
        onStateChange={handleStateChange}
        onPlayerReady={handlePlayerReady}
        onTimeUpdate={handleTimeUpdate}
        onError={handlePlayerError}
        trackTitle={currentSong?.title}
        trackArtist={currentSong?.artist}
        trackAlbum={currentSong?.movie}
        onPrev={prev}
        onNext={next}
        onPlayPause={togglePlay}
        bottom={100}
        zIndexVisible={40}
      />

      {/* Player Error Notification */}
      {playerError && (
        <PlayerErrorBanner code={playerError} formatMessage={(code) => (
          code === 150 || code === 101 ? '⚠ Video embedding restricted (Auto-skipping...)' : `⚠ Video Error: ${code}`
        )} />
      )}

      {/* Interactive Experience Tooltip Floating Cleanly Above Bottom Player Capsule */}
      <div
        className="campfire-interactive-toast"
        style={{
          position: 'fixed',
          bottom: '120px',
          left: '50%',
          transform: showTooltip ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(12px)',
          zIndex: 45,
          pointerEvents: showTooltip ? 'auto' : 'none',
          opacity: showTooltip ? 1 : 0,
          transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            background: 'rgba(18, 12, 8, 0.88)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(251, 191, 36, 0.35)',
            borderRadius: '9999px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.85), 0 0 16px rgba(245, 158, 11, 0.15)',
            color: '#fef3c7',
            fontSize: '0.82rem',
            fontWeight: '500',
            letterSpacing: '0.01em',
            whiteSpace: 'nowrap',
          }}
        >
          <span>Move mouse to direct wind and lantern light</span>
          <button
            onClick={() => setShowTooltip(false)}
            aria-label="Dismiss hint"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.12)',
              border: 'none',
              color: '#d4d4d8',
              cursor: 'pointer',
              marginLeft: '4px',
              transition: 'background 0.2s ease, color 0.2s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(245, 158, 11, 0.45)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'; e.currentTarget.style.color = '#d4d4d8'; }}
          >
            <X size={11} />
          </button>
        </div>
      </div>

      {/* Compact Re-open Button Positioned Discreetly Above Player on Right */}
      {!showTooltip && (
        <button
          onClick={() => setShowTooltip(true)}
          title="Interactive campfire tips"
          className="campfire-hint-reopen-btn"
          style={{
            position: 'fixed',
            bottom: '120px',
            right: '24px',
            zIndex: 45,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            background: 'rgba(18, 12, 8, 0.82)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(251, 191, 36, 0.25)',
            borderRadius: '9999px',
            color: '#fbbf24',
            fontSize: '0.76rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.6)',
            transition: 'all 0.25s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(28, 18, 10, 0.95)';
            e.currentTarget.style.borderColor = 'rgba(251, 191, 36, 0.5)';
            e.currentTarget.style.transform = 'scale(1.04)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(18, 12, 8, 0.82)';
            e.currentTarget.style.borderColor = 'rgba(251, 191, 36, 0.25)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <Sparkles size={11} />
          <span>Wind Guide</span>
        </button>
      )}

      {/* Bottom Floating Player Capsule */}
      <div style={{ position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)', width: '92%', maxWidth: '680px', zIndex: 40, pointerEvents: 'auto' }}>
        <PlayerCapsule
          theme={CAPSULE_THEME}
          currentSong={currentSong}
          isPlaying={isPlaying}
          onTogglePlay={togglePlay}
          isShuffle={isShuffle}
          onToggleShuffle={() => setIsShuffle(prev => !prev)}
          showShuffleHint={showShuffleHint}
          onPrev={prev}
          onNext={next}
          volume={volume}
          onChangeVolume={changeVolume}
          volumeHovered={volumeHovered}
          onVolumeHoverChange={setVolumeHovered}
          currentTime={currentTime}
          duration={duration}
          onSeek={seek}
          seekHovered={seekHovered}
          onSeekHoverChange={setSeekHovered}
          fmt={fmt}
        />
      </div>

      {/* Active Listeners Count Badge */}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 45, pointerEvents: 'auto' }}>
        <ListenersBadgeSingle
          count={presenceCount}
          label="listeners"
          textColor="#ffe0b2"
          background="rgba(15, 12, 10, 0.85)"
          border="rgba(255, 152, 0, 0.3)"
          iconColor="#ff9800"
        />
      </div>

      <style jsx global>{`
        .campfire-page-root {
          cursor: none;
        }
        .campfire-page-root a,
        .campfire-page-root button,
        .campfire-page-root input,
        .campfire-page-root [role="button"] {
          cursor: pointer;
        }

        .campfire-torch-cursor {
          position: fixed;
          top: 0;
          left: 0;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          transform: translate(-50%, -50%);
          background: #fbbf24;
          box-shadow: 
            0 0 6px 2px rgba(251, 191, 36, 0.8),
            0 0 14px 4px rgba(249, 115, 22, 0.5);
          transition: transform 0.08s ease-out, opacity 0.2s ease;
        }

        @media (max-width: 1024px) {
          .campfire-title-container {
            top: 11vh !important;
          }
          .campfire-tent-container {
            width: 320px !important;
            right: 15px !important;
            left: auto !important;
            bottom: 30vh !important;
          }
        }
        @media (max-width: 768px) {
          .campfire-page-root {
            cursor: auto !important;
          }
          .campfire-torch-cursor,
          .campfire-torch-halo,
          .campfire-interactive-toast,
          .campfire-hint-reopen-btn {
            display: none !important;
          }
          .campfire-title-container {
            top: 76px !important;
            padding: 0 16px !important;
          }
          .campfire-title {
            font-size: 2.1rem !important;
            line-height: 1.2 !important;
          }
          .campfire-tent-container {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
