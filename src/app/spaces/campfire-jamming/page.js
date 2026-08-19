'use client';

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
import { Tv } from 'lucide-react';

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

  return (
    <div style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', overflow: 'hidden', color: '#fff', background: '#090A0F' }}>
      {/* ── Background Sky & 3D Campfire ── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <ParallaxStars />
        <ThreeCampfireBackground isPlaying={isPlaying} />
        
        {/* Camping Tent Layered on Right Side of Campfire */}
        <div
          className="campfire-tent-container"
          style={{
            position: 'absolute',
            bottom: '12vh',
            right: 'calc(50% - 480px)',
            width: '380px',
            pointerEvents: 'none',
            zIndex: 1,
            transition: 'transform 0.5s ease, filter 0.5s ease',
            filter: isPlaying
              ? 'drop-shadow(0 10px 25px rgba(0,0,0,0.85)) drop-shadow(-15px -5px 35px rgba(255, 152, 0, 0.35)) brightness(0.92)'
              : 'drop-shadow(0 10px 25px rgba(0,0,0,0.9)) brightness(0.65)',
          }}
        >
          <img
            src="/images/camping_tent.png"
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

        <RadialVignette innerColor="rgba(15, 23, 42, 0.08)" outerColor="rgba(5, 7, 12, 0.65)" />
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
      <div style={{ position: 'fixed', top: '9vh', left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', userSelect: 'none', padding: '0 24px', zIndex: 10 }}>
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
        @media (max-width: 1024px) {
          .campfire-tent-container {
            width: 270px !important;
            right: 15px !important;
            left: auto !important;
            bottom: 14vh !important;
          }
        }
        @media (max-width: 768px) {
          .campfire-title { font-size: 2.2rem !important; }
          .campfire-tent-container {
            width: 180px !important;
            right: 10px !important;
            left: auto !important;
            bottom: 18vh !important;
            opacity: 0.85 !important;
          }
        }
      `}</style>
    </div>
  );
}
