'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { getSongsForPlace } from '@/data/songs';
import { prefixPath } from '@/utils/paths';
import YouTubePlayer from '@/components/YouTubePlayer';
import AmbientWeather from '@/components/AmbientWeather';
import { supabase } from '@/utils/supabase';
import { ChevronLeft, Volume2, VolumeX, Wind, Shuffle, Play, Pause, Megaphone, SlidersHorizontal } from 'lucide-react';

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

export default function AutoRaja() {
  const songs = getSongsForPlace('auto');

  // State variables
  const [started, setStarted]             = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const [isPlaying, setIsPlaying]       = useState(false);
  const [ytReady, setYtReady]           = useState(false);
  const [volume, setVolume]             = useState(60);
  const [currentTime, setCurrentTime]   = useState(0);
  const [duration, setDuration]         = useState(0);
  const [presenceCount, setPresenceCount] = useState(98);
  const [timeString, setTimeString]     = useState('');
  const [videoVisible, setVideoVisible] = useState(false);
  const [ambientOn, setAmbientOn]       = useState(true);
  const [playerError, setPlayerError]   = useState(null);
  const [isShuffle, setIsShuffle]       = useState(false);
  const [seekHovered, setSeekHovered]   = useState(false);
  const [volumeHovered, setVolumeHovered] = useState(false);
  const [showShuffleHint, setShowShuffleHint] = useState(false);

  const playerRef  = useRef(null);
  const ambientRef = useRef(null);

  // Background Transition States
  const [activeBg, setActiveBg]               = useState("url('/images/city_perspective_road1.jpg')");
  const [prevBg, setPrevBg]                   = useState(null);
  const [bgTransitioning, setBgTransitioning] = useState(false);

  const selectedSpriteIdx = currentSongIndex !== null ? (currentSongIndex % AUTO_SPRITES.length) : 0;
  const currentSong = currentSongIndex !== null ? (songs[currentSongIndex] || {}) : null;
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

  // === Initial song ===
  useEffect(() => {
    if (songs.length > 0) {
      const range = Math.min(songs.length, 5);
      const randomIndex = Math.floor(Math.random() * range);
      setCurrentSongIndex(randomIndex);
    }
    // Mark as started (client-side only) after hydration
    setStarted(true);
  }, []);

  // === Clock ===
  useEffect(() => {
    const tick = () =>
      setTimeString(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase());
    tick();
    const t = setInterval(tick, 10000);
    return () => clearInterval(t);
  }, []);
  
  // === Shuffle Hint Timer ===
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isShuffle) {
        setShowShuffleHint(true);
      }
    }, 10000);
    return () => clearTimeout(timer);
  }, [isShuffle]);

  useEffect(() => {
    if (showShuffleHint) {
      const timer = setTimeout(() => {
        setShowShuffleHint(false);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [showShuffleHint]);

  // === Supabase Realtime Live Presence Counter ===
  useEffect(() => {
    if (!supabase) {
      const sim = () => {
        const s = Math.floor(Date.now() / 4000);
        setPresenceCount(Math.max(1, Math.round(98 + Math.sin(s * 0.5) * 6 + Math.cos(s * 0.2) * 3)));
      };
      sim();
      const t = setInterval(sim, 4000);
      return () => clearInterval(t);
    }

    const channel = supabase.channel('presence-auto');

    channel
      .on('presence', { event: 'sync' }, () => {
        try {
          const state = channel.presenceState();
          // Count unique users in presence state
          // Each key is a user ID, value is an array of presence objects
          const userIds = Object.keys(state || {});
          const count = Math.max(1, userIds.length + 15); // Add realistic base count
          setPresenceCount(count);
        } catch (e) {
          console.error('Error reading presence state:', e);
          setPresenceCount(Math.max(1, 98 + Math.floor(Math.random() * 20) - 10));
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ online_at: new Date().toISOString() });
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  // === Background Transition Effect ===
  useEffect(() => {
    if (started && selectedBg && selectedBg !== activeBg) {
      setPrevBg(activeBg);
      setActiveBg(selectedBg);
      setBgTransitioning(true);
      const t = setTimeout(() => {
        setBgTransitioning(false);
        setPrevBg(null);
      }, 1000); // 1s cross-fade transition
      return () => clearTimeout(t);
    }
  }, [selectedBg, activeBg, started]);

  // === Ambient City Traffic Audio ===
  useEffect(() => {
    if (!ytReady) return;
    if (!ambientRef.current) {
      const a = new Audio(prefixPath('/audio/city_ambient.mp3'));
      a.loop = true;
      a.volume = 0.15;
      ambientRef.current = a;
    }
    if (isPlaying && ambientOn) {
      ambientRef.current.play().catch(() => {});
    } else {
      ambientRef.current.pause();
    }
    return () => { ambientRef.current?.pause(); };
  }, [isPlaying, ambientOn, ytReady]);

  // === Auto-unlock playback on click ===
  useEffect(() => {
    const handleFirstClick = () => {
      if (playerRef.current && isPlaying) {
        try { playerRef.current.playVideo(); } catch (e) {}
      }
      if (ambientRef.current && ambientOn) {
        ambientRef.current.play().catch(() => {});
      }
    };
    window.addEventListener('click', handleFirstClick, { once: true });
    return () => window.removeEventListener('click', handleFirstClick);
  }, [isPlaying, ambientOn]);

  // === Navigation Handlers ===
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

  // Play custom auto horn MP3 sound
  const playHorn = () => {
    try {
      const audio = new Audio(prefixPath('/audio/auto_horn.mp3'));
      audio.volume = 0.45;
      audio.play().catch(() => {});
    } catch (e) {}
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

  const fmt = (s) => {
    if (typeof s !== 'number' || isNaN(s) || !isFinite(s)) return '0:00';
    const m   = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  // Dynamic Telugu quote for auto sticker
  const rawQuote = currentSong?.quote || 'Andhamaina ammayini, finance lo theskuna auto ni maintain cheyandam kastam.';
  const cleanQuote = rawQuote.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100dvh', overflow: 'hidden', userSelect: 'none', background: '#090a0f' }}>
      <link href="https://fonts.googleapis.com/css2?family=Lakki+Reddy&family=Anek+Telugu:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      
      {/* Background Layer 1: Previous Background */}
      {prevBg && (
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: prefixPath(prevBg),
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: 0
        }} />
      )}

      {/* Background Layer 2: Active Background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: prefixPath(activeBg),
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        zIndex: 0,
        opacity: bgTransitioning ? 0 : 1,
        transition: 'opacity 1000ms ease-out',
      }} />

      {/* Fog/Atmospheric Layers */}
      <div className="fog-overlay" />
      <div className="fog-cloud" />
      
      {/* Background Weather/Particles */}
      <AmbientWeather weather={ambience.weather} particles={ambience.particles} />

      {/* Floating YouTube Player Engine (Corner PiP toggled by VIDEO button) */}
      <div style={{
        position: 'fixed',
        bottom: '110px',
        right: '30px',
        width: '220px',
        height: '124px',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: videoVisible ? '0 12px 28px rgba(0,0,0,0.6)' : 'none',
        border: videoVisible ? '1px solid rgba(255,255,255,0.2)' : 'none',
        opacity: videoVisible ? 1 : 0,
        visibility: videoVisible ? 'visible' : 'hidden',
        transition: 'opacity 0.3s, visibility 0.3s',
        zIndex: videoVisible ? 45 : -1,
        background: '#000',
        pointerEvents: videoVisible ? 'auto' : 'none',
      }}>
        {currentSong?.youtubeVideoId && (
          <YouTubePlayer
            videoId={currentSong.youtubeVideoId}
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
          />
        )}
      </div>
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

      {/* HERO AUTO — same pattern as tractor-anna: absolute img, bleeds off sides */}
      {started && currentSong && (
        <img
          src={ambience.vehicleSprite}
          alt="Auto Raja Hero"
          className="auto-hero-sprite"
          style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
        />
      )}

      {/* Screen Center Title (zIndex: 5, above weather/auto layers) */}
      {started && (
        <div style={{
          position: 'absolute',
          top: '68px',
          left: 0,
          right: 0,
          zIndex: 5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          userSelect: 'none',
          padding: '0 24px'
        }} className="immersive-title-container">
          <h1 style={{
            fontSize: '4.8rem',
            fontWeight: '400',
            color: '#fef08a',
            margin: 0,
            lineHeight: 1.1,
            letterSpacing: '0.02em',
            textShadow: '0 4px 24px rgba(0,0,0,0.95), 0 2px 6px rgba(0,0,0,0.85)',
            fontFamily: "'Lakki Reddy', 'Ramabhadra', 'Anek Telugu', serif",
            textAlign: 'center'
          }} className="immersive-title">
            ఆటో జానీ
          </h1>
        </div>
      )}

      {/* === HUD Overlay === */}
      {started && currentSong && (
        <>
          <div className="hud-overlay" style={{
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100dvh',
            width: '100%',
            position: 'relative',
            padding: '16px 20px 24px'
          }}>
          {/* Top Header */}
          <div style={{ width: '100%' }}>
            <header style={{
              zIndex: 40,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              position: 'relative',
              minHeight: '44px'
            }} className="hud-top-header">
              {/* Left: Back button & time */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Link
                  href="/"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#fff',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    padding: '8px 14px',
                    borderRadius: '9999px',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    backdropFilter: 'blur(12px)',
                    whiteSpace: 'nowrap'
                  }}
                  className="hud-button"
                >
                  <ChevronLeft size={16} />
                  <span>SPACES</span>
                </Link>
                {timeString && (
                  <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.05em' }} className="hud-time">
                    {timeString}
                  </span>
                )}
              </div>

              {/* Right: Ambience & Video controls */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  onClick={() => setAmbientOn(prev => !prev)}
                  title="Toggle background ambient sounds"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: ambientOn ? '#fbbf24' : 'rgba(255,255,255,0.5)',
                    fontSize: '0.78rem',
                    fontWeight: '600',
                    padding: '8px 12px',
                    borderRadius: '9999px',
                    background: ambientOn ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255,255,255,0.06)',
                    border: ambientOn ? '1px solid rgba(245, 158, 11, 0.35)' : '1px solid rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(12px)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s',
                  }}
                  className="hud-button"
                >
                  <Wind size={14} />
                  <span className="btn-label">{ambientOn ? 'AMBIENCE' : 'OFF'}</span>
                </button>

                <button
                  onClick={() => setVideoVisible(v => !v)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: videoVisible ? '#fbbf24' : '#fff',
                    fontSize: '0.78rem',
                    fontWeight: '600',
                    padding: '8px 12px',
                    borderRadius: '9999px',
                    background: videoVisible ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.08)',
                    border: videoVisible ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(255,255,255,0.12)',
                    backdropFilter: 'blur(12px)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                  className="hud-button"
                >
                  <SlidersHorizontal size={14} />
                  <span className="btn-label">{videoVisible ? 'CLOSE VIDEO' : 'VIDEO'}</span>
                </button>
              </div>
            </header>
          </div>

          {/* Bottom Area: Controls & HUD */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '680px', margin: '0 auto', zIndex: 30 }}>

            {/* Quote — wrapped in a dark translucent glassmorphic pill for high legibility on busy graphics */}
            <div style={{ textAlign: 'center', marginBottom: '12px', width: '100%', pointerEvents: 'none' }}>
              <span className="auto-quote-pill" style={{
                display: 'inline-block',
                background: 'rgba(10, 11, 15, 0.72)',
                backdropFilter: 'blur(16px)',
                padding: '8px 24px',
                borderRadius: '9999px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
                maxWidth: '90%'
              }}>
                <p style={{
                  fontSize: '1.15rem',
                  fontWeight: '500',
                  color: 'rgba(254, 240, 138, 0.95)',
                  margin: 0,
                  textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                  letterSpacing: '0.01em',
                  lineHeight: '1.4',
                  fontFamily: "'Anek Telugu', 'Akaya Telivigala', sans-serif"
                }} className="immersive-quote">
                  {cleanQuote}
                </p>
              </span>
            </div>

            <div style={{
              background: 'rgba(10, 11, 15, 0.55)',
              backdropFilter: 'blur(30px) saturate(160%)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              borderRadius: '24px',
              padding: '20px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              boxShadow: '0 25px 60px -15px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.08)',
              position: 'relative'
            }} className="capsule-hud">

              {/* Top Row: Track info & Controls */}
              <div className="player-main-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '16px' }}>
                
                {/* Left: Album Art & Track details */}
                <div className="track-info-container" style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '4px solid #111',
                    boxShadow: '0 0 0 2px rgba(255,255,255,0.15), 0 8px 16px rgba(0,0,0,0.6)',
                    flexShrink: 0,
                    position: 'relative',
                    background: '#000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animationName: 'spin',
                    animationDuration: '8s',
                    animationTimingFunction: 'linear',
                    animationIterationCount: 'infinite',
                    animationPlayState: isPlaying ? 'running' : 'paused'
                  }}>
                    {currentSong?.youtubeVideoId ? (
                      <img
                        src={`https://img.youtube.com/vi/${currentSong.youtubeVideoId}/hqdefault.jpg`}
                        alt="Album Art"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <span style={{ fontSize: '1.2rem' }}>🛺</span>
                    )}
                    <div style={{
                      position: 'absolute',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'rgba(18, 20, 26, 0.95)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      zIndex: 2
                    }} />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
                    <span style={{ fontSize: '1rem', fontWeight: '800', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: '0.01em' }}>
                      {currentSong?.title || 'Loading track…'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#a1a1aa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {currentSong?.movie ? `${currentSong.movie} (${currentSong.year || 'Hit'})` : 'Telugu Mass Hits'}
                    </span>
                  </div>
                </div>

                {/* Right: Controls & Volume */}
                <div className="player-controls-container" style={{ display: 'flex', alignItems: 'center', gap: '1.3rem', flexShrink: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    
                    <button
                      onClick={() => setIsShuffle(prev => !prev)}
                      title="Toggle shuffle mode (play songs in random order)"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: isShuffle ? '#fbbf24' : 'rgba(255,255,255,0.4)',
                        cursor: 'pointer',
                        padding: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'color 0.2s, transform 0.2s',
                        position: 'relative'
                      }}
                      className="control-icon"
                    >
                      <Shuffle size={16} />
                      {showShuffleHint && (
                        <div style={{
                          position: 'absolute',
                          bottom: '100%',
                          left: '50%',
                          transform: 'translateX(-50%) translateY(-8px)',
                          background: '#fbbf24',
                          color: '#000',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          fontSize: '0.7rem',
                          fontWeight: '700',
                          whiteSpace: 'nowrap',
                          boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                          pointerEvents: 'none',
                          zIndex: 10,
                        }}>
                          Shuffle to surprise with new songs!
                          <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: 0,
                            height: 0,
                            borderLeft: '5px solid transparent',
                            borderRight: '5px solid transparent',
                            borderTop: '5px solid #fbbf24'
                          }} />
                        </div>
                      )}
                    </button>
                    
                    <button onClick={prev} title="Previous Song" style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', padding: '6px', fontSize: '1.2rem', transition: 'transform 0.2s' }} className="control-icon">⏮</button>
                    
                    <button onClick={togglePlay}
                      title={isPlaying ? "Pause" : "Play"}
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: '#fff',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 14px rgba(255,255,255,0.3)',
                        transition: 'transform 0.2s, background-color 0.2s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {isPlaying ? (
                          <Pause size={18} fill="#000" color="#000" />
                        ) : (
                          <Play size={18} fill="#000" color="#000" style={{ transform: 'translateX(1px)' }} />
                        )}
                      </span>
                    </button>
                    
                    <button onClick={next} title="Next Song" style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', padding: '6px', fontSize: '1.2rem', transition: 'transform 0.2s' }} className="control-icon">⏭</button>

                    {/* Horn button inside capsule for mobile */}
                    <button
                      onClick={playHorn}
                      title="Horn!"
                      style={{
                        background: '#fbbf24',
                        border: 'none',
                        color: '#000',
                        cursor: 'pointer',
                        padding: '6px 10px',
                        borderRadius: '9999px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        boxShadow: '0 4px 12px rgba(245,158,11,0.4)',
                        transition: 'transform 0.15s'
                      }}
                      className="horn-btn-mobile"
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      <Megaphone size={14} fill="#000" />
                      <span>HORN</span>
                    </button>
                  </div>

                  {/* Divider */}
                  <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255,255,255,0.1)' }} />

                  {/* Volume Slider */}
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    className="volume-slider-container"
                    onMouseEnter={() => setVolumeHovered(true)}
                    onMouseLeave={() => setVolumeHovered(false)}
                  >
                    <button
                      onClick={() => changeVolume(volume === 0 ? 60 : 0)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: volume === 0 ? '#ef4444' : '#a1a1aa',
                        cursor: 'pointer',
                        padding: 0,
                        transition: 'color 0.2s'
                      }}
                      title={volume === 0 ? "Unmute" : "Mute"}
                    >
                      {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={e => changeVolume(parseInt(e.target.value))}
                      style={{
                        width: '70px',
                        height: volumeHovered ? '6px' : '4px',
                        borderRadius: '3px',
                        background: 'rgba(255,255,255,0.15)',
                        accentColor: '#fbbf24',
                        cursor: 'pointer',
                        transition: 'height 0.15s ease'
                      }}
                    />
                  </div>
                </div>

              </div>

              {/* Bottom Row: Progress timeline */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
                <div
                  onClick={seek}
                  onMouseEnter={() => setSeekHovered(true)}
                  onMouseLeave={() => setSeekHovered(false)}
                  style={{
                    height: seekHovered ? '8px' : '6px',
                    width: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.12)',
                    borderRadius: '4px',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'height 0.15s ease, background-color 0.2s'
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                      background: '#fbbf24',
                      borderRadius: '4px',
                      boxShadow: '0 0 8px rgba(251, 191, 36, 0.6)',
                      transition: 'width 0.1s linear'
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                      transform: 'translate(-50%, -50%)',
                      width: seekHovered ? '14px' : '10px',
                      height: seekHovered ? '14px' : '10px',
                      borderRadius: '50%',
                      backgroundColor: '#fff',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
                      opacity: 1,
                      pointerEvents: 'none',
                      transition: 'width 0.15s ease, height 0.15s ease'
                    }}
                  />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#a1a1aa', fontFamily: 'monospace', letterSpacing: '0.02em' }}>
                  <span>{fmt(currentTime)}</span>
                  <span>{duration > 0 ? fmt(duration) : '0:00'}</span>
                </div>
              </div>

              {/* Mobile Listeners Row */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.75rem',
                fontWeight: '600',
                color: '#a7f3d0',
                justifyContent: 'center'
              }} className="mobile-listeners-row">
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 6px #10b981' }} />
                <span>{presenceCount} riders on road</span>
              </div>

            </div>
          </div>
        </div>

        {/* Floating Horn button (desktop) */}
        <button
          onClick={playHorn}
          title="Horn!"
          style={{
            position: 'fixed',
            left: '32px',
            bottom: '24px',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: '#fbbf24',
            color: '#000',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(245, 158, 11, 0.45)',
            zIndex: 35,
            transition: 'transform 0.2s, background-color 0.2s'
          }}
          className="horn-btn-desktop"
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.backgroundColor = '#f59e0b';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.backgroundColor = '#fbbf24';
          }}
        >
          <Megaphone size={20} fill="#000" />
        </button>

        {/* Floating Listeners badge (desktop) */}
        <div style={{
          position: 'fixed',
          right: '32px',
          bottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.85rem',
          fontWeight: '600',
          color: '#a7f3d0',
          background: 'rgba(10, 11, 15, 0.65)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(12px)',
          padding: '8px 16px',
          borderRadius: '9999px',
          zIndex: 35,
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          whiteSpace: 'nowrap'
        }} className="listeners-badge-desktop">
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 8px #10b981' }} />
          <span>{presenceCount} riders on road</span>
        </div>
      </>
      )}

      {/* Global & Auto-Specific Styles */}
      <style jsx global>{`
        /* FOG & ATMOSPHERE EFFECTS */
        .fog-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          background: linear-gradient(to bottom, rgba(8, 9, 12, 0.45) 0%, transparent 40%, rgba(8, 9, 12, 0.65) 100%);
        }

        .fog-cloud {
          position: absolute;
          width: 200%;
          height: 100%;
          top: 0;
          left: 0;
          background: url("data:image/svg+xml,%3Csvg viewBox='0 0 1000 1000' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='fog'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.012' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='1 0 0 0 1 0 1 0 0 1 0 0 1 0 1 0 0 0 0.14 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23fog)'/%3E%3C/svg%3E");
          opacity: 0.22;
          animation: fog-drift 75s linear infinite;
          pointer-events: none;
          z-index: 1;
        }

        @keyframes fog-drift {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* AUTO HERO SPRITE — exact tractor-anna pattern */
        .auto-hero-sprite {
          position: absolute;
          bottom: 40px;
          left: 50%;
          width: 980px;
          max-width: 98vw;
          max-height: 82vh;
          object-fit: contain;
          height: auto;
          animation: auto-engine-vibe 0.12s linear infinite;
          z-index: 2;
          filter: drop-shadow(0 20px 40px rgba(0,0,0,0.7));
          pointer-events: none;
        }

        @keyframes auto-engine-vibe {
          0%   { transform: translateX(-50%) translateY(0px); }
          50%  { transform: translateX(-50%) translateY(-2px); }
          100% { transform: translateX(-50%) translateY(0px); }
        }

        /* MOTION EFFECTS: SPEED LINES, DUST & SMOKE */
        .speed-lines-container, .dust-particle-container, .smoke-container {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .speed-line {
          position: absolute;
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.65) 50%, transparent 100%);
          border-radius: 2px;
          animation: speed-flow 0.85s linear infinite;
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
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(253, 230, 138, 0.8);
          box-shadow: 0 0 8px rgba(251,191,36,0.9);
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
          position: absolute;
          bottom: 85px;
          left: 36%;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: rgba(210, 210, 210, 0.4);
          filter: blur(4px);
          animation: smoke-puff 1.2s ease-out infinite;
        }
        .smoke-puff-1 { animation-delay: 0s; }
        .smoke-puff-2 { animation-delay: 0.4s; }
        .smoke-puff-3 { animation-delay: 0.8s; }

        @keyframes smoke-puff {
          0%   { transform: translate(0,0) scale(0.5); opacity: 0.7; }
          100% { transform: translate(-100px, -45px) scale(3.8); opacity: 0; }
        }

        .control-icon:hover { color: #fff !important; transform: scale(1.1); }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        /* Desktop: hide mobile-only elements */
        .horn-btn-mobile { display: none !important; }
        .mobile-listeners-row { display: none !important; }

        /* Mobile Adjustments */
        @media (max-width: 768px) {
          .hud-overlay {
            padding: 12px 16px max(16px, env(safe-area-inset-bottom)) !important;
          }
          .auto-hero-sprite {
            width: 120vw !important;
            max-width: none !important;
            bottom: 145px !important;
            left: 50% !important;
            filter: drop-shadow(0 20px 40px rgba(0,0,0,0.75)) !important;
          }
          .immersive-title { font-size: 2.2rem !important; }
          .immersive-title-container { top: 76px !important; }
          .immersive-quote { font-size: 1.0rem !important; line-height: 1.3 !important; }
          .auto-quote-pill { padding: 5px 16px !important; }
          .capsule-hud { padding: 12px 14px !important; border-radius: 16px !important; gap: 8px !important; }
          .volume-slider-container { display: none !important; }
          .hud-time { display: none !important; }
          .horn-btn-desktop { display: none !important; }
          .listeners-badge-desktop { display: none !important; }
          .horn-btn-mobile { display: flex !important; }
          .mobile-listeners-row { display: flex !important; }
          .btn-label { font-size: 0.65rem !important; }
        }
        @media (max-width: 520px) {
          .player-main-row {
            flex-direction: column !important;
            align-items: center !important;
            gap: 12px !important;
          }
          .track-info-container {
            width: 100% !important;
            justify-content: center !important;
          }
          .player-controls-container {
            width: 100% !important;
            justify-content: center !important;
          }
        }
      `}</style>

    </div>
  );
}
