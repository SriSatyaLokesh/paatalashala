'use client';

import { useSpacePlayer } from '@/hooks/useSpacePlayer';
import { useSpaceKeyboardShortcuts } from '@/hooks/useSpaceKeyboardShortcuts';
import placeSongs from '@/data/songs/vennallo.json';
import { prefixPath } from '@/utils/paths';
import SpaceHudHeader from '@/components/space/SpaceHudHeader';
import FloatingYouTubePlayer from '@/components/space/FloatingYouTubePlayer';
import PlayerErrorBanner from '@/components/space/PlayerErrorBanner';
import PlayerCapsule from '@/components/space/PlayerCapsule';
import RadialVignette from '@/components/space/RadialVignette';
import { ListenersBadgeSingle } from '@/components/space/ListenersBadge';
import AmbientWeather from '@/components/AmbientWeather';
import { Tv } from 'lucide-react';

const BG_IMAGES = ['/images/vennela_1.webp', '/images/vennela_2.webp', '/images/vennela_3.webp'];

const AMBIENT_AUDIO = { src: '/audio/night_sky_ambience.mp3', volume: 0.12, gate: 'none' };
const PRESENCE_CONFIG = { channel: 'presence-vennela', base: 52, sineAmp: 5, cosAmp: 2, syncPad: 18, catchSpread: 8, catchOffset: 4 };
const AUTO_SKIP = { enabled: true };

const CAPSULE_THEME = {
  accentText: '#818cf8', accentRgb: '129, 140, 248',
  glassBg: 'rgba(10, 12, 26, 0.7)', glassBorder: 'rgba(129, 140, 248, 0.2)',
  glassShadow: '0 25px 60px -15px rgba(0,0,0,0.85), inset 0 1px 1px rgba(255,255,255,0.08)',
  vinylSize: 48, vinylBorder: '3px solid #1e2238',
  vinylRingShadow: '0 0 0 2px rgba(129, 140, 248, 0.3), 0 8px 16px rgba(0,0,0,0.6)',
  vinylBg: '#000', spindleBg: '#0d0e1a',
  artAlt: 'Track Art', fallbackEmoji: '🌌', fallbackTitle: 'వెన్నెల్లో మైమరపు గీతాలు',
  titleFontSize: '1.05rem', secondaryColor: '#a5b4fc',
  subtitleFallback: 'Nostalgic Night Melodies',
  subtitleFormat: (movie, year) => `${movie} • ${year}`,
  prevNextColor: 'rgba(255,255,255,0.8)', prevTitle: 'Previous Track', nextTitle: 'Next Track',
  dividerColor: 'rgba(255,255,255,0.12)',
  playIconColor: '#0f111a', playShadow: '0 4px 16px rgba(129, 140, 248, 0.4)',
  restoreVolume: 50, volumeTrackBg: 'rgba(255,255,255,0.2)', volumeWidth: 65,
  seekTrackBg: 'rgba(255, 255, 255, 0.15)', seekFillShadow: '0 0 10px rgba(129, 140, 248, 0.7)',
  showSeekThumb: false, showControlIconHoverClass: false,
};

export default function Vennallo() {
  const player = useSpacePlayer(placeSongs, {
    initialVolume: 50,
    ambientAudio: AMBIENT_AUDIO,
    presence: PRESENCE_CONFIG,
    autoSkipOnError: AUTO_SKIP,
    backgroundImage: (song, index) => ({
      url: prefixPath(`url('${BG_IMAGES[index !== null ? index % BG_IMAGES.length : 0]}')`),
      position: 'center 40%',
      transitionMs: 2000,
    }),
  });

  const {
    currentSong, isPlaying, volume, currentTime, duration, presenceCount, timeString,
    ambientOn, setAmbientOn, playerError, isShuffle, setIsShuffle, seekHovered, setSeekHovered,
    volumeHovered, setVolumeHovered, showShuffleHint, videoVisible, setVideoVisible,
    handlePlayerReady, handlePlayerError, handleStateChange, handleTimeUpdate,
    togglePlay, next, prev, seek, changeVolume, fmt,
  } = player;

  useSpaceKeyboardShortcuts({
    onTogglePlay: togglePlay, onNext: next, onPrev: prev, onChangeVolume: changeVolume,
    volume, restoreVolume: CAPSULE_THEME.restoreVolume,
  });

  return (
    <div style={{ minHeight: '100dvh', width: '100vw', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#fff' }}>
      <RadialVignette innerColor="rgba(12, 16, 33, 0.25)" outerColor="rgba(8, 10, 24, 0.75)" />

      <AmbientWeather weather="clear" particles="stars" active={isPlaying} />

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
        accentText={CAPSULE_THEME.accentText}
        accentRgb={CAPSULE_THEME.accentRgb}
        VideoIcon={Tv}
        className="hud-top-header"
      />

      <div style={{ position: 'absolute', top: '12vh', left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', userSelect: 'none', padding: '0 24px', zIndex: 5 }} className="immersive-title-container">
        <h2 style={{ fontSize: '4.8rem', fontWeight: '900', letterSpacing: '0.04em', color: '#fff', margin: 0, textShadow: '0 2px 10px rgba(0,0,0,0.85), 0 0 30px rgba(99, 102, 241, 0.3)', fontFamily: "'Akaya Telivigala', 'Gurajada', 'Ravi Prakash', serif", textAlign: 'center' }} className="immersive-title">
          మేడ మీద వెన్నెల్లో
        </h2>
      </div>

      <div style={{ zIndex: 20, width: '100%', maxWidth: '680px', margin: '0 auto 24px', padding: '0 20px', display: 'flex', flexDirection: 'column' }}>
        <PlayerCapsule
          theme={CAPSULE_THEME}
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
        textColor="#c7d2fe"
        background="rgba(10, 12, 26, 0.75)"
        border="rgba(129, 140, 248, 0.25)"
        iconColor="#818cf8"
      />

      <style jsx global>{`
        @media (max-width: 768px) {
          .immersive-title { font-size: 2.2rem !important; }
          .btn-label { font-size: 0.7rem !important; }
        }
      `}</style>
    </div>
  );
}
