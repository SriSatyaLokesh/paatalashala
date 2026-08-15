'use client';

import { useEffect, useRef } from 'react';
import { useSpacePlayer } from '@/hooks/useSpacePlayer';
import { useSpaceKeyboardShortcuts } from '@/hooks/useSpaceKeyboardShortcuts';
import { useCrossfadingAmbientAudio } from '@/hooks/useCrossfadingAmbientAudio';
import { ALL_SONGS, SPACE_THEMES } from '@/data/sammelanam';
import SpaceHudHeader from '@/components/space/SpaceHudHeader';
import FloatingYouTubePlayer from '@/components/space/FloatingYouTubePlayer';
import PlayerErrorBanner from '@/components/space/PlayerErrorBanner';
import PlayerCapsule from '@/components/space/PlayerCapsule';
import QuoteDisplay from '@/components/space/QuoteDisplay';
import RadialVignette from '@/components/space/RadialVignette';
import { ListenersBadgeSingle } from '@/components/space/ListenersBadge';
import AmbientWeather from '@/components/AmbientWeather';
import { Tv } from 'lucide-react';

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

  const quoteText = currentSong ? theme.getQuote(currentSong) : null;

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
          🔀 సమ్మేళనం
        </h2>
        <div style={{ fontSize: '1.7rem', fontWeight: '700', letterSpacing: '0.03em', color: theme.capsuleTheme.accentText, margin: 0, textShadow: '0 2px 8px rgba(0,0,0,0.8)', fontFamily: theme.titleFontFamily, transition: 'color 0.3s ease, font-family 0.3s ease' }} className="sammelanam-badge">
          {theme.capsuleTheme.fallbackEmoji} {theme.titleText}
        </div>
      </div>

      <div style={{ zIndex: 20, width: '100%', maxWidth: '680px', margin: '0 auto 24px', padding: '0 20px', display: 'flex', flexDirection: 'column' }}>
        {quoteText && (
          <QuoteDisplay
            variant="box"
            text={quoteText}
            textColor={theme.quoteTextColor}
            textShadow={theme.quoteTextShadow}
            borderColor={theme.quoteBorderColor}
            fontFamily={theme.titleFontFamily}
          />
        )}

        <PlayerCapsule
          theme={theme.capsuleTheme}
          currentSong={currentSong}
          isPlaying={isPlaying} onTogglePlay={togglePlay}
          isShuffle={isShuffle} onToggleShuffle={() => setIsShuffle(prev => !prev)} showShuffleHint={showShuffleHint}
          onPrev={prev} onNext={next}
          volume={volume} onChangeVolume={changeVolume} volumeHovered={volumeHovered} onVolumeHoverChange={setVolumeHovered}
          currentTime={currentTime} duration={duration} onSeek={seek} seekHovered={seekHovered} onSeekHoverChange={setSeekHovered} fmt={fmt}
        />
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
          .sammelanam-badge { font-size: 1.1rem !important; }
          .btn-label { font-size: 0.7rem !important; }
        }
      `}</style>
    </div>
  );
}
