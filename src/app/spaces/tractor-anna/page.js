'use client';

import { useSpacePlayer } from '@/hooks/useSpacePlayer';
import { useSpaceKeyboardShortcuts } from '@/hooks/useSpaceKeyboardShortcuts';
import placeSongs from '@/data/songs/tractor-anna.json';
import { prefixPath } from '@/utils/paths';
import SpaceHudHeader from '@/components/space/SpaceHudHeader';
import FloatingYouTubePlayer from '@/components/space/FloatingYouTubePlayer';
import PlayerErrorBanner from '@/components/space/PlayerErrorBanner';
import PlayerCapsule from '@/components/space/PlayerCapsule';
import QuoteDisplay from '@/components/space/QuoteDisplay';
import HornButton from '@/components/space/HornButton';
import { ListenersBadgeDesktop, ListenersBadgeMobileRow } from '@/components/space/ListenersBadge';
import AmbientWeather from '@/components/AmbientWeather';
import { Tv } from 'lucide-react';

const AMBIENT_AUDIO = { src: '/audio/tractor_ambient.mp3', volume: 0.03, gate: 'started+ytReady' };
const PRESENCE_CONFIG = { channel: 'presence-tractor', base: 42, sineAmp: 4, cosAmp: 2, syncPad: 12, catchSpread: 10, catchOffset: 5 };

function getAmbience(currentSong) {
  const raw = currentSong?.ambience || {
    background: "url('/images/sunset_farm_background.webp')",
    weather: 'clear',
    particles: 'dust'
  };
  return {
    ...raw,
    background: prefixPath(raw.background),
    vehicleSprite: prefixPath(raw.vehicleSprite || '/images/tractor_anna_sprite.webp')
  };
}

const CAPSULE_THEME = {
  accentText: '#fbbf24', accentRgb: '245, 158, 11',
  glassBg: 'rgba(10, 11, 15, 0.45)', glassBorder: 'rgba(255, 255, 255, 0.12)',
  glassShadow: '0 25px 60px -15px rgba(0,0,0,0.7), inset 0 1px 1px rgba(255,255,255,0.06)',
  vinylSize: 46, vinylBorder: '4px solid #111',
  vinylRingShadow: '0 0 0 2px rgba(255,255,255,0.15), 0 8px 16px rgba(0,0,0,0.6)',
  vinylBg: '#000', spindleBg: 'rgba(18, 20, 26, 0.95)',
  artAlt: 'Album Art', fallbackEmoji: '🚜', fallbackTitle: 'Loading song…',
  titleFontSize: '1rem', secondaryColor: '#a1a1aa',
  subtitleFallback: 'Telugu Classics',
  subtitleFormat: (movie, year) => `${movie} (${year || 'Classic'})`,
  prevNextColor: 'rgba(255,255,255,0.7)', prevTitle: 'Previous Song', nextTitle: 'Next Song',
  dividerColor: 'rgba(255,255,255,0.1)',
  playIconColor: '#000', playShadow: '0 4px 14px rgba(255,255,255,0.3)',
  restoreVolume: 60, volumeTrackBg: 'rgba(255,255,255,0.15)', volumeWidth: 70,
  seekTrackBg: 'rgba(255, 255, 255, 0.12)', seekFillShadow: '0 0 8px rgba(251, 191, 36, 0.6)',
  showSeekThumb: true, showControlIconHoverClass: true,
};

export default function TractorAnna() {
  const player = useSpacePlayer(placeSongs, {
    initialVolume: 60,
    ambientAudio: AMBIENT_AUDIO,
    presence: PRESENCE_CONFIG,
    backgroundImage: (song) => {
      const a = getAmbience(song);
      return { url: a.background, position: 'center', transitionMs: 1800 };
    },
  });

  const {
    currentSong, started, isPlaying, volume, currentTime, duration, presenceCount, timeString,
    ambientOn, setAmbientOn, playerError, isShuffle, setIsShuffle, seekHovered, setSeekHovered,
    volumeHovered, setVolumeHovered, showShuffleHint, videoVisible, setVideoVisible,
    handlePlayerReady, handlePlayerError, handleStateChange, handleTimeUpdate,
    togglePlay, next, prev, seek, seekBy, changeVolume, fmt,
  } = player;

  useSpaceKeyboardShortcuts({
    onTogglePlay: togglePlay, onNext: next, onPrev: prev, onChangeVolume: changeVolume,
    onSeekBy: seekBy,
    volume, restoreVolume: CAPSULE_THEME.restoreVolume,
  });

  const ambience = getAmbience(currentSong);

  const cleanQuote = (currentSong?.quote || 'చేను చెలకా మనదేరా, రైతు అన్న రాజేరా!').replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();

  return (
    <div style={{ minHeight: '100dvh', position: 'relative', overflow: 'hidden' }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* Top and Bottom Vignetting Gradient Overlays for High Contrast Visibility */}
      {started && (
        <>
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '180px', background: 'linear-gradient(to bottom, rgba(5, 6, 11, 0.75) 0%, transparent 100%)', pointerEvents: 'none', zIndex: 4 }} />
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '240px', background: 'linear-gradient(to top, rgba(5, 6, 11, 0.9) 0%, rgba(5, 6, 11, 0.3) 50%, transparent 100%)', pointerEvents: 'none', zIndex: 4 }} />
        </>
      )}

      {started && currentSong && (
        <>
          <AmbientWeather weather={ambience.weather} particles={ambience.particles} active={isPlaying} />

          {isPlaying && (
            <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 3, overflow: 'hidden' }}>
              <div className="speed-lines-container">
                {[1,2,3,4,5,6,7].map(n => <div key={n} className={`speed-line speed-line-${n}`} />)}
              </div>
              <div className="dust-particle-container">
                {[1,2,3,4,5].map(n => <div key={n} className={`dust-p dust-p-${n}`} />)}
              </div>
            </div>
          )}

          <img src={ambience.vehicleSprite} alt="Tractor Anna" className="tractor-hero-sprite"
            style={{ animationPlayState: isPlaying ? 'running' : 'paused' }} />

          <div style={{ position: 'absolute', top: '4vh', left: 0, right: 0, zIndex: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', userSelect: 'none', padding: '0 24px' }} className="immersive-title-container">
            <h2 style={{ fontSize: '4.8rem', fontWeight: '900', letterSpacing: '0.04em', color: '#fff', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.5)', fontFamily: "'Akaya Telivigala', 'Gurajada', 'Ravi Prakash', serif", textAlign: 'center' }} className="immersive-title">
              ట్రాక్టర్ అన్న
            </h2>
          </div>

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
            <PlayerErrorBanner code={playerError} formatMessage={(code) => `⚠ YT Player Error: ${code}`} />
          )}

          <div style={{ zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100dvh', width: '100%', position: 'relative', padding: '16px 20px 24px' }}>
            <div style={{ width: '100%' }}>
              <SpaceHudHeader
                timeString={timeString}
                ambientOn={ambientOn}
                onToggleAmbient={() => setAmbientOn(a => !a)}
                videoVisible={videoVisible}
                onToggleVideo={() => setVideoVisible(v => !v)}
                accentText={CAPSULE_THEME.accentText}
                accentRgb={CAPSULE_THEME.accentRgb}
                VideoIcon={Tv}
              />
            </div>

            <div style={{ position: 'relative', width: '100%', maxWidth: '680px', margin: '0 auto', zIndex: 30 }}>
              <QuoteDisplay
                variant="bare"
                text={cleanQuote}
                textColor="rgba(254, 240, 138, 0.95)"
                textShadow="0 2px 8px rgba(0,0,0,0.85)"
                fontFamily="'Akaya Telivigala', 'Gurajada', 'Ravi Prakash', serif"
              />

              <PlayerCapsule
                theme={CAPSULE_THEME}
                currentSong={currentSong}
                isPlaying={isPlaying} onTogglePlay={togglePlay}
                isShuffle={isShuffle} onToggleShuffle={() => setIsShuffle(prev => !prev)} showShuffleHint={showShuffleHint}
                onPrev={prev} onNext={next}
                volume={volume} onChangeVolume={changeVolume} volumeHovered={volumeHovered} onVolumeHoverChange={setVolumeHovered}
                currentTime={currentTime} duration={duration} onSeek={seek} seekHovered={seekHovered} onSeekHoverChange={setSeekHovered} fmt={fmt}
                hornSlot={<HornButton variant="mobile" src="/audio/horn.mp3" volume={0.55} />}
                mobileListenersSlot={<ListenersBadgeMobileRow count={presenceCount} label="listeners on field" />}
              />
            </div>
          </div>

          <HornButton variant="desktop" src="/audio/horn.mp3" volume={0.55} />
          <ListenersBadgeDesktop count={presenceCount} label="listeners on field" />
        </>
      )}

      <style jsx global>{`
        .tractor-hero-sprite {
          position: absolute; bottom: 45px; left: 50%;
          width: 980px; max-width: 98vw; max-height: 80vh;
          object-fit: contain; height: auto;
          animation: tractor-engine-idle 0.12s linear infinite;
          z-index: 2;
          filter: drop-shadow(0 20px 40px rgba(0,0,0,0.65));
          pointer-events: none;
        }
        @keyframes tractor-engine-idle {
          0%   { transform: translateX(-50%) translateY(0px); }
          50%  { transform: translateX(-50%) translateY(-1.5px); }
          100% { transform: translateX(-50%) translateY(0px); }
        }
        .speed-lines-container, .dust-particle-container { position: absolute; inset: 0; pointer-events: none; }
        .speed-line {
          position: absolute; height: 2px;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%);
          border-radius: 2px; animation: speed-line-flow 1.0s linear infinite;
        }
        .speed-line-1 { top: 20%; width: 180px; animation-duration: 0.9s;  animation-delay: 0s; }
        .speed-line-2 { top: 35%; width: 260px; animation-duration: 1.1s;  animation-delay: 0.2s; }
        .speed-line-3 { top: 50%; width: 220px; animation-duration: 0.85s; animation-delay: 0.4s; }
        .speed-line-4 { top: 68%; width: 300px; animation-duration: 1.05s; animation-delay: 0.6s; }
        .speed-line-5 { top: 82%; width: 240px; animation-duration: 0.95s; animation-delay: 0.8s; }
        .speed-line-6 { top: 45%; width: 190px; animation-duration: 1.15s; animation-delay: 0.3s; }
        .speed-line-7 { top: 60%; width: 280px; animation-duration: 1.0s;  animation-delay: 0.7s; }
        @keyframes speed-line-flow {
          0%   { transform: translateX(-30vw); opacity: 0; }
          20%  { opacity: 0.75; }
          80%  { opacity: 0.75; }
          100% { transform: translateX(100vw); opacity: 0; }
        }
        .dust-p {
          position: absolute; width: 5px; height: 5px;
          background: rgba(254,240,138,0.7); border-radius: 50%;
          box-shadow: 0 0 8px rgba(254,240,138,0.9);
          animation: dust-particle-flow 1.6s ease-out infinite;
        }
        .dust-p-1 { bottom: 65px; left: 46%; animation-delay: 0s; }
        .dust-p-2 { bottom: 55px; left: 54%; animation-delay: 0.3s; }
        .dust-p-3 { bottom: 75px; left: 47%; animation-delay: 0.6s; }
        .dust-p-4 { bottom: 60px; left: 52%; animation-delay: 0.9s; }
        .dust-p-5 { bottom: 70px; left: 43%; animation-delay: 1.6s; }
        @keyframes dust-particle-flow {
          0%   { transform: translate(0,0) scale(0.5); opacity: 0; }
          30%  { opacity: 0.9; }
          100% { transform: translate(180px,-20px) scale(1.6); opacity: 0; }
        }
        .control-icon:hover { color: #fff !important; transform: scale(1.1); }

        /* Desktop: hide mobile-only elements */
        .horn-btn-mobile { display: none !important; }
        .mobile-listeners-row { display: none !important; }

        @media (max-width: 768px) {
          .tractor-hero-sprite {
            width: 120vw !important;
            max-width: none !important;
            bottom: 150px !important;
            left: 50% !important;
            filter: drop-shadow(0 20px 40px rgba(0,0,0,0.75)) !important;
          }
          .immersive-title { font-size: 2rem !important; }
          .immersive-quote { font-size: 1.05rem !important; line-height: 1.3 !important; }
          .capsule-hud { padding: 12px 14px !important; border-radius: 16px !important; gap: 8px !important; }
          .horn-btn-desktop { display: none !important; }
          .listeners-badge-desktop { display: none !important; }
          .horn-btn-mobile { display: flex !important; }
          .mobile-listeners-row { display: flex !important; }
          .btn-label { font-size: 0.65rem !important; }
        }
      `}</style>
    </div>
  );
}
