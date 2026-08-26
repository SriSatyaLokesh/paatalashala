'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSpacePlayer } from '@/hooks/useSpacePlayer';
import { useSpaceKeyboardShortcuts } from '@/hooks/useSpaceKeyboardShortcuts';
import placeSongs from '@/data/songs/samudra-theeram.json';
import FloatingYouTubePlayer from '@/components/space/FloatingYouTubePlayer';
import PlayerErrorBanner from '@/components/space/PlayerErrorBanner';
import PlayerCapsule from '@/components/space/PlayerCapsule';
import { ListenersBadgeDesktop, ListenersBadgeMobileRow } from '@/components/space/ListenersBadge';
import SamudraTheeramBackground from '@/components/space/SamudraTheeramBackground';
import { ChevronLeft, Wind, Tv } from 'lucide-react';
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

export default function SamudraTheeramPage() {
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
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.04 * white)) / 1.04;
        lastOut = output[i];
        output[i] *= 3.5;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.08, ctx.currentTime);

      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.12, ctx.currentTime);

      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(280, ctx.currentTime);

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

  return (
    <div className="samudra-container">
      {/* ── Fixed WebGL Canvas ── */}
      <SamudraTheeramBackground />

      {/* ── HUD ── */}
      <div id="hud">
        <div id="hud-top">
          <div className="hud-top-left">
            <div className="hud-row">
              <Link href="/" className="hud-back-link">
                <ChevronLeft size={15} />
                <span>SPACES</span>
              </Link>
              {timeString && <span className="hud-time-chip">{timeString}</span>}
            </div>

            <div className="hud-listeners-row">
              <ListenersBadgeDesktop count={presenceCount} label="listeners" />
            </div>
          </div>

          <div className="hud-top-right">
            {/* Ambient sound and video buttons */}
            <div className="hud-row">
              <button
                onClick={() => setAmbientOn(!ambientOn)}
                className={`hud-toggle-btn ${ambientOn ? 'active' : ''}`}
                title="Toggle ocean surf ambient sound"
              >
                <Wind size={14} />
                <span>{ambientOn ? 'AMBIENCE ON' : 'AMBIENCE OFF'}</span>
              </button>

              <button
                onClick={() => setVideoVisible(!videoVisible)}
                className={`hud-toggle-btn ${videoVisible ? 'active' : ''}`}
                title="Toggle floating video player"
              >
                <Tv size={14} />
                <span>{videoVisible ? 'HIDE VIDEO' : 'VIDEO'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* HUD Bottom Player Capsule */}
        <div id="hud-bottom">
          {playerError && (
            <PlayerErrorBanner
              error={playerError}
              onRetry={() => {}}
              onDismiss={() => {}}
            />
          )}

          <PlayerCapsule
            currentSong={currentSong}
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            volume={volume}
            isShuffle={isShuffle}
            showShuffleHint={showShuffleHint}
            seekHovered={seekHovered}
            volumeHovered={volumeHovered}
            onTogglePlay={togglePlay}
            onPrev={prev}
            onNext={next}
            onSeek={seek}
            onSeekHoverChange={setSeekHovered}
            onChangeVolume={changeVolume}
            onVolumeHoverChange={setVolumeHovered}
            onToggleShuffle={() => setIsShuffle(prev => !prev)}
            fmt={fmt}
            theme={CAPSULE_THEME}
            mobileListenersSlot={<ListenersBadgeMobileRow count={presenceCount} label="listeners" />}
          />
        </div>
      </div>

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
