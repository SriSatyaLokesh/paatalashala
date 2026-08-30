'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSpacePlayer } from '@/hooks/useSpacePlayer';
import { useSpaceKeyboardShortcuts } from '@/hooks/useSpaceKeyboardShortcuts';
import placeSongs from '@/data/songs/samudra-theeram.json';
import FloatingYouTubePlayer from '@/components/space/FloatingYouTubePlayer';
import PlayerErrorBanner from '@/components/space/PlayerErrorBanner';
import PlayerCapsule from '@/components/space/PlayerCapsule';
import SpaceHudHeader from '@/components/space/SpaceHudHeader';
import { ListenersBadgeSingle, ListenersBadgeMobileRow } from '@/components/space/ListenersBadge';
import SamudraTheeramBackground from '@/components/space/SamudraTheeramBackground';
import { ChevronLeft, Wind, Tv, Sun, X, Orbit } from 'lucide-react';
import './samudra.css';

const PRESENCE_CONFIG = { channel: 'presence-samudra-theeram', base: 42, sineAmp: 5, cosAmp: 3, syncPad: 10, catchSpread: 8, catchOffset: 4 };
const AUTO_SKIP = { enabled: true, delayMs: 1500, codes: [101, 150] };

const CAPSULE_THEME = {
  accentText: 'var(--fg-hud, #f0cfa0)',
  accentRgb: '240, 207, 160',
  glassBg: 'rgba(10, 10, 15, 0.88)',
  glassBorder: 'rgba(255, 255, 255, 0.12)',
  glassShadow: '0 25px 60px -15px rgba(0,0,0,0.95), inset 0 1px 1px rgba(255,255,255,0.15)',
  vinylSize: 48,
  vinylBorder: '3px solid rgba(255,255,255,0.15)',
  vinylRingShadow: '0 0 0 2px var(--fg-dot, rgba(240, 207, 160, 0.4)), 0 8px 16px rgba(0,0,0,0.8)',
  vinylBg: '#05070f',
  spindleBg: '#1e293b',
  artAlt: 'Track Art',
  fallbackEmoji: '🌊',
  fallbackTitle: 'సముద్ర తీరం',
  titleFontSize: '1.02rem',
  secondaryColor: 'var(--fg-dim, rgba(240, 207, 160, 0.65))',
  subtitleFallback: 'Beach & Sea Shore Melodies',
  subtitleFormat: (movie, year) => `${movie} • ${year}`,
  prevNextColor: 'rgba(255,255,255,0.9)',
  prevTitle: 'Previous Track',
  nextTitle: 'Next Track',
  dividerColor: 'rgba(255,255,255,0.15)',
  playIconColor: '#0a0a0f',
  playShadow: '0 4px 18px var(--fg-dotact, rgba(240, 207, 160, 0.6))',
  restoreVolume: 50,
  volumeTrackBg: 'rgba(255,255,255,0.2)',
  volumeWidth: 65,
  seekTrackBg: 'rgba(255, 255, 255, 0.2)',
  seekFillShadow: '0 0 12px var(--fg-dotact, rgba(240, 207, 160, 0.9))',
  showSeekThumb: false,
  showControlIconHoverClass: false,
};

// UI/UX Pro Max Sun & Moon Dual Celestial Cycle Logo
function SunMoonCycleIcon({ size = 22, active = false, className = '', style = {} }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
    >
      {/* Sun Rays & Core Disc (Upper Left) */}
      <circle cx="8.5" cy="8.5" r="3" fill={active ? "#fbbf24" : "none"} stroke={active ? "#fbbf24" : "currentColor"} />
      <path d="M8.5 2.2v1.2M8.5 13.6v1.2M2.2 8.5h1.2M13.6 8.5h1.2M4 4l.9.9M12.1 12.1l.9.9M4 13l.9-.9M12.1 4.9l.9-.9" stroke={active ? "#f59e0b" : "currentColor"} strokeWidth="1.3" opacity="0.85" />
      
      {/* Crescent Moon (Bottom Right) */}
      <path
        d="M13.5 10.5 A 5 5 0 0 0 19.5 16.5 A 5.5 5.5 0 1 1 13.5 10.5 Z"
        fill={active ? "#38bdf8" : "none"}
        stroke={active ? "#38bdf8" : "currentColor"}
        strokeWidth="1.6"
      />
      
      {/* Orbiting Sync Ring Arrows */}
      <path
        d="M 20.5 10.5 A 9 9 0 0 0 10.5 3.5 M 3.5 13.5 A 9 9 0 0 0 13.5 20.5"
        stroke={active ? "#22d3ee" : "currentColor"}
        strokeWidth="1.5"
        strokeDasharray="4 2.5"
        opacity="0.8"
      />
    </svg>
  );
}

export default function SamudraTheeramPage() {
  const [showTooltip, setShowTooltip] = useState(true);
  const [autoCycle, setAutoCycle] = useState(false);

  const player = useSpacePlayer(placeSongs, {
    initialVolume: 50,
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

  // Auto-dismiss scroll hint tooltip after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const { documentElement: html, body } = document;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    };
  }, []);

  // Web Audio procedural sea waves whoosh for realistic ambient immersion
  const waveAudioRef = useRef(null);

  useEffect(() => {
    if (!ambientOn) {
      if (waveAudioRef.current) {
        try { waveAudioRef.current.close(); } catch {}
        waveAudioRef.current = null;
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      waveAudioRef.current = ctx;

      const bufferSize = ctx.sampleRate * 4;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(380, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.06, ctx.currentTime);

      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.12, ctx.currentTime);

      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(260, ctx.currentTime);

      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start();
      lfo.start();
    } catch {}

    return () => {
      if (waveAudioRef.current) {
        try { waveAudioRef.current.close(); } catch {}
        waveAudioRef.current = null;
      }
    };
  }, [ambientOn]);

  const autoCycleMobileSlot = (
    <button
      onClick={() => setAutoCycle(prev => !prev)}
      title={autoCycle ? "Pause Auto Day ⇄ Night Motion" : "Auto Day ⇄ Night Motion"}
      className="samudra-autocycle-mobile"
      style={{
        background: 'none',
        border: 'none',
        color: autoCycle ? '#22d3ee' : 'rgba(255, 255, 255, 0.6)',
        cursor: 'pointer',
        padding: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'color 0.2s, transform 0.2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.color = '#22d3ee';
        e.currentTarget.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.color = autoCycle ? '#22d3ee' : 'rgba(255, 255, 255, 0.6)';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <SunMoonCycleIcon size={18} active={autoCycle} style={{ animation: autoCycle ? 'spin 10s linear infinite' : 'none' }} />
    </button>
  );

  return (
    <div className="samudra-container">
      {/* ── Fixed WebGL Canvas ── */}
      <SamudraTheeramBackground autoCycle={autoCycle} />

      {/* ── Fixed Desktop Auto Day-to-Night Motion Button ── */}
      <button
        onClick={() => setAutoCycle(prev => !prev)}
        title={autoCycle ? "Pause Auto Day ⇄ Night Motion" : "Start Auto Day ⇄ Night Motion (Slow motion scroll)"}
        className="samudra-autocycle-desktop"
        style={{
          position: 'fixed',
          left: '32px',
          bottom: '24px',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: autoCycle ? 'rgba(10, 18, 28, 0.92)' : 'rgba(10, 18, 28, 0.85)',
          color: autoCycle ? '#22d3ee' : '#f0cfa0',
          border: autoCycle ? '1.5px solid #22d3ee' : '1px solid rgba(240, 207, 160, 0.4)',
          boxShadow: autoCycle
            ? '0 0 24px rgba(34, 211, 238, 0.6), 0 0 40px rgba(245, 158, 11, 0.25), 0 8px 24px rgba(0,0,0,0.8)'
            : '0 8px 24px rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          cursor: 'pointer',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 35,
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <SunMoonCycleIcon size={23} active={autoCycle} style={{ animation: autoCycle ? 'spin 10s linear infinite' : 'none' }} />
      </button>

      {/* ── Top Header HUD ── */}
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

      {/* ── Immersive Title ── */}
      <div className="immersive-title-container">
        <h2 className="immersive-title">సముద్ర తీరం</h2>
      </div>

      {/* ── Interactive Experience Tooltip Floating Cleanly Above Player Capsule ── */}
      <div
        className="samudra-interactive-toast"
        style={{
          position: 'fixed',
          bottom: '165px',
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
            padding: '7px 16px',
            background: 'rgba(10, 18, 28, 0.88)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(34, 211, 238, 0.35)',
            borderRadius: '9999px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.85), 0 0 16px rgba(34, 211, 238, 0.15)',
            color: '#e0f2fe',
            fontSize: '0.82rem',
            fontWeight: '500',
            letterSpacing: '0.01em',
            whiteSpace: 'nowrap',
          }}
        >
          <Sun size={15} color="#22d3ee" style={{ flexShrink: 0 }} />
          <span>Scroll up / down to move the sun & experience day-to-night beach movement</span>
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
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(34, 211, 238, 0.4)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'; e.currentTarget.style.color = '#d4d4d8'; }}
          >
            <X size={11} />
          </button>
        </div>
      </div>

      {/* ── Fixed Bottom Floating Player Capsule Container ── */}
      <div style={{ position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)', width: '92%', maxWidth: '680px', zIndex: 40, pointerEvents: 'auto' }}>
        {playerError && (
          <PlayerErrorBanner
            code={playerError}
            formatMessage={(code) => (
              code === 150 || code === 101 ? '⚠ Video embedding restricted (Auto-skipping...)' : `⚠ Video Error: ${code}`
            )}
          />
        )}

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
          hornSlot={autoCycleMobileSlot}
          mobileListenersSlot={<ListenersBadgeMobileRow count={presenceCount} label="listeners" />}
          spaceName="Samudra Theeram"
        />
      </div>

      {/* ── Desktop Listeners Badge ── */}
      <ListenersBadgeSingle
        count={presenceCount}
        label="listeners"
        textColor="var(--fg-hud, #f0cfa0)"
        background="rgba(10, 18, 28, 0.75)"
        border="rgba(34, 211, 238, 0.3)"
        iconColor="#22d3ee"
      />

      {/* ── Floating YouTube Video ── */}
      <FloatingYouTubePlayer
        videoId={currentSong?.youtubeVideoId}
        isPlaying={isPlaying}
        volume={volume}
        videoVisible={videoVisible}
        onPlayerReady={handlePlayerReady}
        onError={handlePlayerError}
        onStateChange={handleStateChange}
        onTimeUpdate={handleTimeUpdate}
      />
    </div>
  );
}
