'use client';

import { useSpacePlayer } from '@/hooks/useSpacePlayer';
import placeSongs from '@/data/songs/saloon.json';
import { prefixPath } from '@/utils/paths';
import SpaceHudHeader from '@/components/space/SpaceHudHeader';
import FloatingYouTubePlayer from '@/components/space/FloatingYouTubePlayer';
import PlayerErrorBanner from '@/components/space/PlayerErrorBanner';
import PlayerCapsule from '@/components/space/PlayerCapsule';
import RadialVignette from '@/components/space/RadialVignette';
import { ListenersBadgeSingle } from '@/components/space/ListenersBadge';
import AmbientWeather from '@/components/AmbientWeather';
import { Tv } from 'lucide-react';

const AMBIENT_AUDIO = { src: '/audio/village_ambience.mp3', volume: 0.15, gate: 'none' };
const PRESENCE_CONFIG = { channel: 'presence-saloon', base: 43, sineAmp: 4, cosAmp: 2, syncPad: 8, catchSpread: 15, catchOffset: 7 };

const CAPSULE_THEME = {
  accentText: '#ffb74d', accentRgb: '255, 183, 77',
  glassBg: 'rgba(15, 17, 26, 0.65)', glassBorder: 'rgba(255, 204, 128, 0.2)',
  glassShadow: '0 25px 60px -15px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.1)',
  vinylSize: 48, vinylBorder: '3px solid #2e1c16',
  vinylRingShadow: '0 0 0 2px rgba(255, 183, 77, 0.3), 0 8px 16px rgba(0,0,0,0.6)',
  vinylBg: '#000', spindleBg: '#151515',
  artAlt: 'Track Art', fallbackEmoji: '💈', fallbackTitle: 'రాయల్ సెలూన్ గీతాలు',
  titleFontSize: '1.05rem', secondaryColor: '#ffcc80',
  subtitleFallback: 'S.A. Rajkumar Melodies',
  subtitleFormat: (movie, year) => `${movie} • ${year}`,
  prevNextColor: 'rgba(255,255,255,0.8)', prevTitle: 'Previous Track', nextTitle: 'Next Track',
  dividerColor: 'rgba(255,255,255,0.12)',
  playIconColor: '#2e1c16', playShadow: '0 4px 16px rgba(255, 183, 77, 0.4)',
  restoreVolume: 50, volumeTrackBg: 'rgba(255,255,255,0.2)', volumeWidth: 65,
  seekTrackBg: 'rgba(255, 255, 255, 0.15)', seekFillShadow: '0 0 10px rgba(255, 183, 77, 0.7)',
  showSeekThumb: false, showControlIconHoverClass: false,
};

export default function RoyalSaloon() {
  const player = useSpacePlayer(placeSongs, {
    initialVolume: 50,
    ambientAudio: AMBIENT_AUDIO,
    presence: PRESENCE_CONFIG,
    backgroundImage: (song) => ({
      url: prefixPath(song?.ambience?.background || "url('/images/saloon_background.webp')"),
      position: 'center',
      transitionMs: 1800,
    }),
  });

  const {
    currentSong, isPlaying, volume, currentTime, duration, presenceCount, timeString,
    ambientOn, setAmbientOn, playerError, isShuffle, setIsShuffle, seekHovered, setSeekHovered,
    volumeHovered, setVolumeHovered, showShuffleHint, videoVisible, setVideoVisible,
    handlePlayerReady, handlePlayerError, handleStateChange, handleTimeUpdate,
    togglePlay, next, prev, seek, changeVolume, fmt,
  } = player;

  return (
    <div style={{ minHeight: '100dvh', width: '100vw', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#fff' }}>
      <RadialVignette innerColor="rgba(15, 23, 42, 0.25)" outerColor="rgba(15, 23, 42, 0.75)" />

      <AmbientWeather weather="clear" particles="dust" active={isPlaying && ambientOn} />

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
        <PlayerErrorBanner code={playerError} formatMessage={(code) => `⚠ Video Error: ${code}`} />
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
        <h2 style={{ fontSize: '4.8rem', fontWeight: '900', letterSpacing: '0.04em', color: '#fff', margin: 0, textShadow: '0 2px 8px rgba(0,0,0,0.75)', fontFamily: "'Akaya Telivigala', 'Gurajada', 'Ravi Prakash', serif", textAlign: 'center' }} className="immersive-title">
          రాయల్ సెలూన్
        </h2>
      </div>

      <div style={{ zIndex: 20, width: '100%', maxWidth: '680px', margin: '0 auto 24px', padding: '0 20px' }}>
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
        textColor="#ffe0b2"
        background="rgba(15, 17, 26, 0.7)"
        border="rgba(255, 204, 128, 0.25)"
        iconColor="#ffb74d"
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
