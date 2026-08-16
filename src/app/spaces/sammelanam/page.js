'use client';

import { useEffect, useRef } from 'react';
import { useSpacePlayer } from '@/hooks/useSpacePlayer';
import { useSpaceKeyboardShortcuts } from '@/hooks/useSpaceKeyboardShortcuts';
import { useCrossfadingAmbientAudio } from '@/hooks/useCrossfadingAmbientAudio';
import { ALL_SONGS, SPACE_THEMES } from '@/data/sammelanam';
import SpaceHudHeader from '@/components/space/SpaceHudHeader';
import FloatingYouTubePlayer from '@/components/space/FloatingYouTubePlayer';
import PlayerErrorBanner from '@/components/space/PlayerErrorBanner';
import RadialVignette from '@/components/space/RadialVignette';
import { ListenersBadgeSingle } from '@/components/space/ListenersBadge';
import AmbientWeather from '@/components/AmbientWeather';
import { Tv, Play, Pause, Volume2 } from 'lucide-react';

const PRESENCE_CONFIG = { channel: 'presence-sammelanam', base: 60, sineAmp: 6, cosAmp: 3, syncPad: 14, catchSpread: 16, catchOffset: 8 };
const ERROR_SKIP_DELAY_MS = 2500;
const ERROR_SKIP_CODES = [2, 100, 101, 150];
const MAX_HISTORY = 50;
const DEFAULT_THEME = SPACE_THEMES['tractor-anna'];

export default function Sammelanam() {
  const player = useSpacePlayer(ALL_SONGS, {
    initialVolume: 55,
    ambientAudio: null, // ambient is driven entirely by useCrossfadingAmbientAudio below
    presence: PRESENCE_CONFIG,
    initialPickRange: Infinity, // true whole-pool random start, not the default first-5-of-array bias
    backgroundImage: (song) => {
      const theme = song ? SPACE_THEMES[song.place] : null;
      return theme ? theme.getBackground(song) : null;
    },
  });

  const {
    songs, currentSong, currentSongIndex, started, ytReady, isPlaying, volume, currentTime, duration,
    presenceCount, timeString, ambientOn, setAmbientOn, playerError, isShuffle, setIsShuffle,
    seekHovered, setSeekHovered, volumeHovered, setVolumeHovered, showShuffleHint, videoVisible, setVideoVisible,
    setIsPlaying, setYtReady, setCurrentTime, setDuration, setPlayerError, setCurrentSongIndex, playerRef,
    handlePlayerReady, handleTimeUpdate, togglePlay, seek, seekBy, changeVolume, fmt,
  } = player;

  const theme = (currentSong && SPACE_THEMES[currentSong.place]) || DEFAULT_THEME;

  // Cross-space random next()/prev() — kept local (not the hook's own
  // next/prev) because the hook's internal ended/error handling always calls
  // its own next/prev closures, not a caller's override. Mirrors the pattern
  // src/app/spaces/auto/page.js already uses for the same reason.
  const historyRef = useRef([]);

  const next = () => {
    if (songs.length === 0) return;
    // Two-step "pick a space, then a song from it" — not a flat pool pick,
    // which would let saloon's ~326 songs dominate over vennallo's ~55.
    const otherPlaces = Object.keys(SPACE_THEMES).filter((p) => p !== currentSong?.place);
    const chosenPlace = otherPlaces.length > 0
      ? otherPlaces[Math.floor(Math.random() * otherPlaces.length)]
      : currentSong?.place;
    const candidates = songs.filter((s) => s.place === chosenPlace);
    const pool = candidates.length > 0 ? candidates : songs.filter((_, i) => i !== currentSongIndex);
    if (pool.length === 0) return;
    const chosenSong = pool[Math.floor(Math.random() * pool.length)];
    const chosenIndex = songs.indexOf(chosenSong);
    if (chosenIndex === -1) return;

    if (currentSongIndex !== null) {
      historyRef.current.push(currentSongIndex);
      if (historyRef.current.length > MAX_HISTORY) historyRef.current.shift();
    }
    setCurrentSongIndex(chosenIndex);
    setIsPlaying(true);
    setCurrentTime(0);
    setDuration(0);
    setPlayerError(null);
  };

  const prev = () => {
    if (songs.length === 0) return;
    // Elapsed-time-first, matching auto's own prev() convention: restart the
    // current track in place rather than jumping back if we're partway in.
    if (currentTime > 3) {
      playerRef.current?.seekTo(0);
      setCurrentTime(0);
      return;
    }
    const prevIndex = historyRef.current.pop();
    if (prevIndex === undefined) return;
    setCurrentSongIndex(prevIndex);
    setIsPlaying(true);
    setCurrentTime(0);
    setDuration(0);
    setPlayerError(null);
  };

  const handleStateChange = (state) => {
    if (state === 0) { // ENDED
      next();
    } else if (state === 1) { // PLAYING
      setIsPlaying(true);
      setYtReady(true);
      setPlayerError(null);
    } else if (state === 2) { // PAUSED
      setIsPlaying(false);
    }
  };

  const handlePlayerError = (code) => {
    setPlayerError(code);
    console.error('YouTube player error code:', code);
  };

  // Delayed auto-skip on unplayable videos — same dwell/codes as the 5
  // "uniform chassis" pages' shared autoSkipOnError config, reimplemented
  // locally since it must call the local next() above, not the hook's own.
  useEffect(() => {
    if (!ERROR_SKIP_CODES.includes(playerError)) return;
    const t = setTimeout(() => next(), ERROR_SKIP_DELAY_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerError]);

  useCrossfadingAmbientAudio(theme.ambientAudio, { started, ytReady, isPlaying, ambientOn });

  useSpaceKeyboardShortcuts({
    onTogglePlay: togglePlay, onNext: next, onPrev: prev, onChangeVolume: changeVolume,
    onSeekBy: seekBy,
    volume, restoreVolume: theme.capsuleTheme.restoreVolume,
  });

  return (
    <div style={{ minHeight: '100dvh', width: '100vw', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#fff' }}>
      {/* Always loaded (not conditional) since any song, including an auto-sourced one, can appear at any time. */}
      <link href="https://fonts.googleapis.com/css2?family=Lakki+Reddy&family=Anek+Telugu:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      <RadialVignette innerColor="rgba(15, 23, 42, 0.2)" outerColor="rgba(15, 23, 42, 0.7)" />

      <AmbientWeather weather={theme.weather} particles={theme.particles} active={isPlaying && ambientOn} />

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
      />

      {playerError && (
        <PlayerErrorBanner code={playerError} formatMessage={(code) => (
          code === 150 || code === 101 ? '⚠ Embedding restricted on localhost (Auto-skipping...)' : `⚠ Video Error: ${code}`
        )} />
      )}

      <SpaceHudHeader
        timeString={timeString}
        ambientOn={ambientOn}
        onToggleAmbient={() => setAmbientOn(a => !a)}
        videoVisible={videoVisible}
        onToggleVideo={() => setVideoVisible(v => !v)}
        accentText={theme.capsuleTheme.accentText}
        accentRgb={theme.capsuleTheme.accentRgb}
        VideoIcon={Tv}
        className="hud-top-header"
      />

      <div style={{ position: 'absolute', top: '10vh', left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', pointerEvents: 'none', userSelect: 'none', padding: '0 24px', zIndex: 5 }} className="immersive-title-container">
        <h2 style={{ fontSize: '4.4rem', fontWeight: '900', letterSpacing: '0.03em', color: '#fff', margin: 0, textShadow: '0 2px 10px rgba(0,0,0,0.85), 0 0 30px rgba(0,0,0,0.3)', fontFamily: "'Akaya Telivigala', 'Gurajada', 'Ravi Prakash', serif", textAlign: 'center' }} className="immersive-title">
          Surprise Me
        </h2>
      </div>

      <div style={{ zIndex: 20, width: '100%', maxWidth: '680px', margin: '0 auto 24px', padding: '0 20px', display: 'flex', flexDirection: 'column' }}>
        <div style={{
          background: 'rgba(15, 17, 26, 0.65)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            <button onClick={prev} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', padding: '4px', display: 'flex', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>⏮</button>
            <button onClick={togglePlay} style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: '#f59e0b', border: 'none', color: '#000',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)',
              transition: 'transform 0.2s, background-color 0.2s',
            }} onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.backgroundColor = '#fbbf24'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.backgroundColor = '#f59e0b'; }}>
              {isPlaying ? <Pause size={14} fill="#000" /> : <Play size={14} fill="#000" style={{ transform: 'translateX(1px)' }} />}
            </button>
            <button onClick={next} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', padding: '4px', display: 'flex', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>⏭</button>
          </div>

          <div style={{ width: '1px', height: '18px', backgroundColor: 'rgba(255,255,255,0.1)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0, width: '80px' }}>
            <Volume2 size={13} style={{ color: 'rgba(255,255,255,0.6)' }} />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => changeVolume(parseInt(e.target.value))}
              style={{
                flex: 1,
                height: '3px',
                backgroundColor: 'rgba(255,255,255,0.15)',
                borderRadius: '2px',
                accentColor: '#f59e0b',
                cursor: 'pointer',
              }}
            />
          </div>

          <div style={{ flex: 1, minWidth: 0 }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace', letterSpacing: '0.02em', flexShrink: 0 }}>
            <span>{fmt(currentTime)}</span>
            <span>/</span>
            <span>{duration > 0 ? fmt(duration) : '0:00'}</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px' }}>
          <div
            onClick={seek}
            onMouseEnter={() => setSeekHovered(true)}
            onMouseLeave={() => setSeekHovered(false)}
            style={{
              height: '4px',
              width: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              borderRadius: '2px',
              position: 'relative',
              cursor: 'pointer',
            }}
          >
            <div style={{
              height: '100%',
              width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
              backgroundColor: '#f59e0b',
              borderRadius: '2px',
              transition: 'width 0.1s linear',
            }} />
          </div>
        </div>
      </div>

      <ListenersBadgeSingle
        count={presenceCount}
        label="listeners"
        textColor="#e5e7eb"
        background="rgba(15, 17, 26, 0.7)"
        border="rgba(255, 255, 255, 0.2)"
        iconColor={theme.capsuleTheme.accentText}
      />

      <style jsx global>{`
        @media (max-width: 768px) {
          .immersive-title { font-size: 2.1rem !important; }
          .btn-label { font-size: 0.7rem !important; }
        }
      `}</style>
    </div>
  );
}
