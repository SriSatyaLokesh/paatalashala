'use client';

import { useState, useEffect } from 'react';
import { useSpacePlayer } from '@/hooks/useSpacePlayer';
import { useSpaceKeyboardShortcuts } from '@/hooks/useSpaceKeyboardShortcuts';
import placeSongs from '@/data/songs/auto.json';
import { prefixPath } from '@/utils/paths';
import SpaceHudHeader from '@/components/space/SpaceHudHeader';
import FloatingYouTubePlayer from '@/components/space/FloatingYouTubePlayer';
import PlayerCapsule from '@/components/space/PlayerCapsule';
import QuoteDisplay from '@/components/space/QuoteDisplay';
import HornButton from '@/components/space/HornButton';
import { ListenersBadgeDesktop, ListenersBadgeMobileRow } from '@/components/space/ListenersBadge';
import AmbientWeather from '@/components/AmbientWeather';
import { SlidersHorizontal } from 'lucide-react';

const AUTO_SPRITES = [
  { id: 'baasha', label: 'బాషా ఆటో', sprite: '/images/image-removebg-preview (1).png' },
  { id: 'front', label: 'ఆటో రాజా', sprite: '/images/image-removebg-preview.png' },
  { id: 'floral', label: 'మాస్ ఆటో', sprite: '/images/image-removebg-preview (2).png' }
];

const AUTO_BACKGROUNDS = [
  "url('/images/city_perspective_road1.jpg')",
  "url('/images/city_perspective_road2.jpg')",
  "url('/images/city_perspective_road3.jpg')",
  "url('/images/city_skyline_road.webp')",
  "url('/images/city_vector_road.webp')"
];

const AMBIENT_AUDIO = { src: '/audio/city_ambient.mp3', volume: 0.15, gate: 'ytReady' };
const PRESENCE_CONFIG = { channel: 'presence-auto', base: 98, sineAmp: 6, cosAmp: 3, syncPad: 15, catchSpread: 20, catchOffset: 10 };

const CAPSULE_THEME = {
  accentText: '#fbbf24', accentRgb: '245, 158, 11',
  glassBg: 'rgba(10, 11, 15, 0.55)', glassBorder: 'rgba(255, 255, 255, 0.14)',
  glassShadow: '0 25px 60px -15px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.08)',
  vinylSize: 46, vinylBorder: '4px solid #111',
  vinylRingShadow: '0 0 0 2px rgba(255,255,255,0.15), 0 8px 16px rgba(0,0,0,0.6)',
  vinylBg: '#000', spindleBg: 'rgba(18, 20, 26, 0.95)',
  artAlt: 'Album Art', fallbackEmoji: '🛺', fallbackTitle: 'Loading track…',
  titleFontSize: '1rem', secondaryColor: '#a1a1aa',
  subtitleFallback: 'Telugu Mass Hits',
  subtitleFormat: (movie, year) => `${movie} (${year || 'Hit'})`,
  prevNextColor: 'rgba(255,255,255,0.7)', prevTitle: 'Previous Song', nextTitle: 'Next Song',
  dividerColor: 'rgba(255,255,255,0.1)',
  playIconColor: '#000', playShadow: '0 4px 14px rgba(255,255,255,0.3)',
  restoreVolume: 60, volumeTrackBg: 'rgba(255,255,255,0.15)', volumeWidth: 70,
  seekTrackBg: 'rgba(255, 255, 255, 0.12)', seekFillShadow: '0 0 8px rgba(251, 191, 36, 0.6)',
  showSeekThumb: true, showControlIconHoverClass: true,
};

export default function AutoRaja() {
  const player = useSpacePlayer(placeSongs, {
    initialVolume: 60,
    initialStarted: false,
    ambientAudio: AMBIENT_AUDIO,
    presence: PRESENCE_CONFIG,
    autoUnlockRequiresPlaying: true,
    // backgroundImage omitted — auto manages its own crossfade below.
  });

  const {
    songs, currentSong, currentSongIndex, started, isPlaying, volume, currentTime, duration,
    presenceCount, timeString, ambientOn, setAmbientOn, playerError, isShuffle, setIsShuffle,
    seekHovered, setSeekHovered, volumeHovered, setVolumeHovered, showShuffleHint,
    videoVisible, setVideoVisible, setIsPlaying, setYtReady, setCurrentTime, setDuration,
    setVolume, setPlayerError, setCurrentSongIndex, playerRef, fmt,
  } = player;

  // Background Transition States (crossfade — kept local, not shared with the hook)
  const [activeBg, setActiveBg] = useState("url('/images/city_perspective_road1.jpg')");
  const [prevBg, setPrevBg] = useState(null);
  const [bgTransitioning, setBgTransitioning] = useState(false);

  const selectedSpriteIdx = currentSongIndex !== null ? (currentSongIndex % AUTO_SPRITES.length) : 0;
  const rawAmbience = currentSong?.ambience || {
    background: "url('/images/city_perspective_road1.jpg')",
    vehicleSprite: "/images/auto_hero_baasha.png",
    weather: 'clear',
    particles: 'dust'
  };
  const selectedSprite = AUTO_SPRITES[selectedSpriteIdx]?.sprite || "/images/image-removebg-preview.png";
  const selectedBgIdx = currentSongIndex !== null ? (currentSongIndex % AUTO_BACKGROUNDS.length) : 0;
  const selectedBg = AUTO_BACKGROUNDS[selectedBgIdx];

  const ambience = {
    ...rawAmbience,
    background: prefixPath(selectedBg),
    vehicleSprite: prefixPath(selectedSprite)
  };

  useEffect(() => {
    if (started && selectedBg && selectedBg !== activeBg) {
      setPrevBg(activeBg);
      setActiveBg(selectedBg);
      setBgTransitioning(true);
      const t = setTimeout(() => {
        setBgTransitioning(false);
        setPrevBg(null);
      }, 1000);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBg, activeBg, started]);

  // === Auto's own control logic (imperative + shuffle-collision-avoidance +
  // restart-if-elapsed prev) — composed from the hook's raw setters/refs
  // rather than the hook's default handlers, since it genuinely differs. ===
  const next = () => {
    if (songs.length === 0) return;
    if (isShuffle) {
      let r = Math.floor(Math.random() * songs.length);
      if (r === currentSongIndex && songs.length > 1) r = (r + 1) % songs.length;
      setCurrentSongIndex(r);
    } else {
      setCurrentSongIndex((prev) => (prev + 1) % songs.length);
    }
    setIsPlaying(true);
    setCurrentTime(0);
  };

  const prev = () => {
    if (songs.length === 0) return;
    if (currentTime > 3) {
      playerRef.current?.seekTo(0);
      setCurrentTime(0);
    } else {
      setCurrentSongIndex((prev) => (prev - 1 + songs.length) % songs.length);
      setIsPlaying(true);
      setCurrentTime(0);
    }
  };

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
    } else {
      playerRef.current.playVideo();
      setIsPlaying(true);
    }
  };

  const changeVolume = (val) => {
    setVolume(val);
    playerRef.current?.setVolume(val);
  };

  const seek = (e) => {
    if (!duration || !playerRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const targetTime = pct * duration;
    playerRef.current.seekTo(targetTime);
    setCurrentTime(targetTime);
  };

  const handleStateChange = (state) => {
    if (state === 1) {
      setIsPlaying(true);
      setPlayerError(null);
    } else if (state === 2) {
      setIsPlaying(false);
    } else if (state === 0) {
      next();
    }
  };

  useSpaceKeyboardShortcuts({
    onTogglePlay: togglePlay, onNext: next, onPrev: prev, onChangeVolume: changeVolume,
    volume, restoreVolume: CAPSULE_THEME.restoreVolume,
  });

  const rawQuote = currentSong?.quote || 'Andhamaina ammayini, finance lo theskuna auto ni maintain cheyandam kastam.';
  const cleanQuote = rawQuote.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100dvh', overflow: 'hidden', userSelect: 'none', background: '#090a0f' }}>
      <link href="https://fonts.googleapis.com/css2?family=Lakki+Reddy&family=Anek+Telugu:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {prevBg && (
        <div style={{ position: 'absolute', inset: 0, backgroundImage: prefixPath(prevBg), backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', zIndex: 0 }} />
      )}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: prefixPath(activeBg), backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', zIndex: 0, opacity: bgTransitioning ? 0 : 1, transition: 'opacity 1000ms ease-out' }} />

      <div className="fog-overlay" />
      <div className="fog-cloud" />

      <AmbientWeather weather={ambience.weather} particles={ambience.particles} />

      <FloatingYouTubePlayer
        videoVisible={videoVisible}
        videoId={currentSong?.youtubeVideoId}
        isPlaying={isPlaying}
        volume={volume}
        onStateChange={handleStateChange}
        onPlayerReady={(instance) => {
          playerRef.current = instance;
          setYtReady(true);
          instance.setVolume(volume);
          if (isPlaying) instance.playVideo();
        }}
        onTimeUpdate={(c, d) => { setCurrentTime(c); setDuration(d); }}
        onError={(err) => { setPlayerError('Failed to play video'); next(); }}
        trackTitle={currentSong?.title}
        trackArtist={currentSong?.artist}
        trackAlbum={currentSong?.movie}
        onPrev={prev}
        onNext={next}
        onPlayPause={togglePlay}
        bottom={110}
        zIndexVisible={45}
      />

      {started && (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 3, overflow: 'hidden' }}>
          <div className="speed-lines-container">
            <div className="speed-line speed-line-1" />
            <div className="speed-line speed-line-2" />
            <div className="speed-line speed-line-3" />
            <div className="speed-line speed-line-4" />
            <div className="speed-line speed-line-5" />
          </div>
          <div className="dust-particle-container">
            <div className="dust-spec dust-spec-1" />
            <div className="dust-spec dust-spec-2" />
            <div className="dust-spec dust-spec-3" />
            <div className="dust-spec dust-spec-4" />
          </div>
          <div className="smoke-container">
            <div className="smoke-puff smoke-puff-1" />
            <div className="smoke-puff smoke-puff-2" />
            <div className="smoke-puff smoke-puff-3" />
          </div>
        </div>
      )}

      {started && currentSong && (
        <img src={ambience.vehicleSprite} alt="Auto Raja Hero" className="auto-hero-sprite" style={{ animationPlayState: isPlaying ? 'running' : 'paused' }} />
      )}

      {started && (
        <div style={{ position: 'absolute', top: '68px', left: 0, right: 0, zIndex: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', userSelect: 'none', padding: '0 24px' }} className="immersive-title-container">
          <h1 style={{ fontSize: '4.8rem', fontWeight: '400', color: '#fef08a', margin: 0, lineHeight: 1.1, letterSpacing: '0.02em', textShadow: '0 4px 24px rgba(0,0,0,0.95), 0 2px 6px rgba(0,0,0,0.85)', fontFamily: "'Lakki Reddy', 'Ramabhadra', 'Anek Telugu', serif", textAlign: 'center' }} className="immersive-title">
            ఆటో జానీ
          </h1>
        </div>
      )}

      {started && currentSong && (
        <>
          <div className="hud-overlay" style={{ zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100dvh', width: '100%', position: 'relative', padding: '16px 20px 24px' }}>
            <div style={{ width: '100%' }}>
              <SpaceHudHeader
                timeString={timeString}
                ambientOn={ambientOn}
                onToggleAmbient={() => setAmbientOn(prev => !prev)}
                videoVisible={videoVisible}
                onToggleVideo={() => setVideoVisible(v => !v)}
                accentText={CAPSULE_THEME.accentText}
                accentRgb={CAPSULE_THEME.accentRgb}
                VideoIcon={SlidersHorizontal}
                videoLabelOn="CLOSE VIDEO"
                className="hud-top-header"
              />
            </div>

            <div style={{ position: 'relative', width: '100%', maxWidth: '680px', margin: '0 auto', zIndex: 30 }}>
              <QuoteDisplay
                variant="pill"
                text={cleanQuote}
                textColor="rgba(254, 240, 138, 0.95)"
                textShadow="0 1px 3px rgba(0,0,0,0.5)"
                fontFamily="'Anek Telugu', 'Akaya Telivigala', sans-serif"
              />

              <PlayerCapsule
                theme={CAPSULE_THEME}
                currentSong={currentSong}
                isPlaying={isPlaying} onTogglePlay={togglePlay}
                isShuffle={isShuffle} onToggleShuffle={() => setIsShuffle(prev => !prev)} showShuffleHint={showShuffleHint}
                onPrev={prev} onNext={next}
                volume={volume} onChangeVolume={changeVolume} volumeHovered={volumeHovered} onVolumeHoverChange={setVolumeHovered}
                currentTime={currentTime} duration={duration} onSeek={seek} seekHovered={seekHovered} onSeekHoverChange={setSeekHovered} fmt={fmt}
                hornSlot={<HornButton variant="mobile" src="/audio/auto_horn.mp3" volume={0.45} />}
                mobileListenersSlot={<ListenersBadgeMobileRow count={presenceCount} label="riders on road" />}
              />
            </div>
          </div>

          <HornButton variant="desktop" src="/audio/auto_horn.mp3" volume={0.45} />
          <ListenersBadgeDesktop count={presenceCount} label="riders on road" />
        </>
      )}

      <style jsx global>{`
        .fog-overlay {
          position: absolute; inset: 0; pointer-events: none; z-index: 1;
          background: linear-gradient(to bottom, rgba(8, 9, 12, 0.45) 0%, transparent 40%, rgba(8, 9, 12, 0.65) 100%);
        }
        .fog-cloud {
          position: absolute; width: 200%; height: 100%; top: 0; left: 0;
          background: url("data:image/svg+xml,%3Csvg viewBox='0 0 1000 1000' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='fog'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.012' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='1 0 0 0 1 0 1 0 0 1 0 0 1 0 1 0 0 0 0.14 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23fog)'/%3E%3C/svg%3E");
          opacity: 0.22; animation: fog-drift 75s linear infinite; pointer-events: none; z-index: 1;
        }
        @keyframes fog-drift { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

        .auto-hero-sprite {
          position: absolute; bottom: 40px; left: 50%;
          width: 980px; max-width: 98vw; max-height: 82vh;
          object-fit: contain; height: auto;
          animation: auto-engine-vibe 0.12s linear infinite;
          z-index: 2; filter: drop-shadow(0 20px 40px rgba(0,0,0,0.7)); pointer-events: none;
        }
        @keyframes auto-engine-vibe {
          0%   { transform: translateX(-50%) translateY(0px); }
          50%  { transform: translateX(-50%) translateY(-2px); }
          100% { transform: translateX(-50%) translateY(0px); }
        }

        .speed-lines-container, .dust-particle-container, .smoke-container { position: absolute; inset: 0; pointer-events: none; }
        .speed-line {
          position: absolute; height: 2px;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.65) 50%, transparent 100%);
          border-radius: 2px; animation: speed-flow 0.85s linear infinite;
        }
        .speed-line-1 { top: 22%; width: 260px; animation-duration: 0.75s; animation-delay: 0s; }
        .speed-line-2 { top: 38%; width: 320px; animation-duration: 0.95s; animation-delay: 0.2s; }
        .speed-line-3 { top: 55%; width: 280px; animation-duration: 0.7s;  animation-delay: 0.4s; }
        .speed-line-4 { top: 70%; width: 340px; animation-duration: 0.9s;  animation-delay: 0.6s; }
        .speed-line-5 { top: 82%; width: 240px; animation-duration: 0.8s;  animation-delay: 0.3s; }
        @keyframes speed-flow {
          0%   { transform: translateX(-30vw); opacity: 0; }
          40%  { opacity: 0.85; }
          100% { transform: translateX(100vw); opacity: 0; }
        }

        .dust-spec {
          position: absolute; width: 6px; height: 6px; border-radius: 50%;
          background: rgba(253, 230, 138, 0.8); box-shadow: 0 0 8px rgba(251,191,36,0.9);
          animation: dust-flow 1.3s ease-out infinite;
        }
        .dust-spec-1 { bottom: 95px; left: 42%; animation-delay: 0s; }
        .dust-spec-2 { bottom: 80px; left: 52%; animation-delay: 0.3s; }
        .dust-spec-3 { bottom: 100px; left: 45%; animation-delay: 0.7s; }
        .dust-spec-4 { bottom: 75px; left: 58%; animation-delay: 1.1s; }
        @keyframes dust-flow {
          0%   { transform: translate(0,0) scale(0.4); opacity: 0; }
          30%  { opacity: 0.9; }
          100% { transform: translate(170px, -30px) scale(1.6); opacity: 0; }
        }

        .smoke-puff {
          position: absolute; bottom: 85px; left: 36%; width: 16px; height: 16px; border-radius: 50%;
          background: rgba(210, 210, 210, 0.4); filter: blur(4px); animation: smoke-puff 1.2s ease-out infinite;
        }
        .smoke-puff-1 { animation-delay: 0s; }
        .smoke-puff-2 { animation-delay: 0.4s; }
        .smoke-puff-3 { animation-delay: 0.8s; }
        @keyframes smoke-puff {
          0%   { transform: translate(0,0) scale(0.5); opacity: 0.7; }
          100% { transform: translate(-100px, -45px) scale(3.8); opacity: 0; }
        }

        .control-icon:hover { color: #fff !important; transform: scale(1.1); }

        .horn-btn-mobile { display: none !important; }
        .mobile-listeners-row { display: none !important; }

        @media (max-width: 768px) {
          .hud-overlay { padding: 12px 16px max(16px, env(safe-area-inset-bottom)) !important; }
          .auto-hero-sprite {
            width: 120vw !important; max-width: none !important; bottom: 145px !important;
            left: 50% !important; filter: drop-shadow(0 20px 40px rgba(0,0,0,0.75)) !important;
          }
          .immersive-title { font-size: 2.2rem !important; }
          .immersive-quote { font-size: 1.0rem !important; line-height: 1.3 !important; }
          .auto-quote-pill { padding: 5px 16px !important; }
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
