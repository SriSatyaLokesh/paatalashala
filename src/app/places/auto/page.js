'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { getSongsForPlace } from '@/data/songs';
import { prefixPath } from '@/utils/paths';
import YouTubePlayer from '@/components/YouTubePlayer';
import AmbientWeather from '@/components/AmbientWeather';
import { ChevronLeft, Tv, Volume2, VolumeX, Wind, Shuffle, Play, Pause, Megaphone } from 'lucide-react';

export default function AutoRaja() {
  const songs = getSongsForPlace('auto');

  // State variables
  const [started, setStarted]             = useState(true);
  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const [isPlaying, setIsPlaying]       = useState(true);
  const [ytReady, setYtReady]           = useState(false);
  const [volume, setVolume]             = useState(60);
  const [currentTime, setCurrentTime]   = useState(0);
  const [duration, setDuration]         = useState(0);
  const [presenceCount, setPresenceCount] = useState(94);
  const [timeString, setTimeString]     = useState('');
  const [videoVisible, setVideoVisible] = useState(false);
  const [ambientOn, setAmbientOn]       = useState(true);
  const [playerError, setPlayerError]   = useState(null);
  const [isShuffle, setIsShuffle]       = useState(false);
  const [seekHovered, setSeekHovered]   = useState(false);
  const [volumeHovered, setVolumeHovered] = useState(false);

  const playerRef  = useRef(null);
  const ambientRef = useRef(null);

  const currentSong = currentSongIndex !== null ? (songs[currentSongIndex] || {}) : null;
  const rawAmbience = currentSong?.ambience || {
    background: "url('/images/hyderabad_street_background.jpg')",
    weather: 'clear',
    particles: 'dust'
  };
  const ambience = {
    ...rawAmbience,
    background: prefixPath(rawAmbience.background),
    vehicleSprite: prefixPath('/images/auto_raja_sprite.png')
  };

  // === Random initial song ===
  useEffect(() => {
    if (songs.length > 0) {
      const rand = Math.floor(Math.random() * songs.length);
      setCurrentSongIndex(rand);
    }
  }, []);

  // === Clock ===
  useEffect(() => {
    const tick = () =>
      setTimeString(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase());
    tick();
    const t = setInterval(tick, 10000);
    return () => clearInterval(t);
  }, []);

  // === Presence ===
  useEffect(() => {
    const sim = () => {
      const s = Math.floor(Date.now() / 4000);
      setPresenceCount(Math.max(1, Math.round(94 + Math.sin(s * 0.5) * 6 + Math.cos(s * 0.2) * 3)));
    };
    sim();
    const t = setInterval(sim, 4000);
    return () => clearInterval(t);
  }, []);

  // === Background ===
  useEffect(() => {
    if (!started || !ambience.background) return;
    document.body.style.transition = 'background 1.8s ease';
    document.body.style.background = `${ambience.background} center/cover no-repeat fixed`;
    return () => { document.body.style.background = ''; };
  }, [currentSongIndex, started, ambience.background]);

  // === Ambient City Audio (Safe fallback) ===
  useEffect(() => {
    if (!started || !ytReady) return;
    if (!ambientRef.current) {
      // Audio file will be added later by user; handled safely without error
      const a = new Audio(prefixPath('/audio/city_ambient.mp3'));
      a.loop = true;
      a.volume = 0.03;
      ambientRef.current = a;
    }
    if (isPlaying && ambientOn) {
      ambientRef.current.play().catch(() => {});
    } else {
      ambientRef.current.pause();
    }
    return () => { ambientRef.current?.pause(); };
  }, [started, isPlaying, ambientOn, ytReady]);

  // === Auto-unlock playback on click ===
  useEffect(() => {
    const handleFirstClick = () => {
      if (playerRef.current && isPlaying) {
        try { playerRef.current.playVideo(); } catch (e) {}
      }
    };
    window.addEventListener('click', handleFirstClick, { once: true });
    return () => window.removeEventListener('click', handleFirstClick);
  }, [isPlaying]);

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

  // Auto Horn Beep Synthesizer
  const playHorn = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'square';
      osc1.frequency.setValueAtTime(420, ctx.currentTime);
      osc2.frequency.setValueAtTime(445, ctx.currentTime);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.35);
      osc2.stop(ctx.currentTime + 0.35);
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

  const fmt = (sec) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Dynamic Telugu quote for auto sticker
  const rawQuote = currentSong?.quote || 'జనం ప్రశాంతంగా ఉంటేనే... ఆటోకి ఏ ఇబ్బంది లేకుండా ముందుకు వెళ్తుంది';
  const cleanQuote = rawQuote.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', userSelect: 'none' }}>
      
      {/* Background Weather/Particles */}
      <AmbientWeather weather={ambience.weather} particles={ambience.particles} />

      {/* Hidden YouTube Player Engine */}
      <YouTubePlayer
        videoId={currentSong?.youtubeVideoId}
        onReady={(instance) => {
          playerRef.current = instance;
          setYtReady(true);
          instance.setVolume(volume);
          if (isPlaying) instance.playVideo();
        }}
        onStateChange={handleStateChange}
        onTimeUpdate={(c, d) => { setCurrentTime(c); setDuration(d); }}
        onError={(err) => { setPlayerError('Failed to play video'); next(); }}
      />

      {/* Video Overlay Modal */}
      {videoVisible && currentSong?.youtubeVideoId && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.92)',
          backdropFilter: 'blur(20px)',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <button
            onClick={() => setVideoVisible(false)}
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff',
              padding: '10px 20px',
              borderRadius: '9999px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '0.85rem'
            }}
          >
            ✕ CLOSE VIDEO
          </button>

          <div style={{ width: '100%', maxWidth: '900px', aspectRatio: '16/9', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,0.8)' }}>
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${currentSong.youtubeVideoId}?autoplay=1`}
              title="YouTube Video"
              width="100%"
              height="100%"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Main Container */}
      <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 10 }}>

        {/* Top Floating Glass Navigation Header */}
        <header style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 40px)',
          maxWidth: '1000px',
          zIndex: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(10, 11, 15, 0.55)',
          backdropFilter: 'blur(20px) saturate(160%)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          padding: '10px 18px',
          borderRadius: '9999px',
          boxShadow: '0 16px 36px rgba(0,0,0,0.4)'
        }}>
          {/* Back button */}
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#fff',
              textDecoration: 'none',
              fontSize: '0.8rem',
              fontWeight: '700',
              letterSpacing: '0.05em',
              background: 'rgba(255,255,255,0.08)',
              padding: '6px 14px',
              borderRadius: '9999px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <ChevronLeft size={16} />
            <span>PLACES</span>
          </Link>

          {/* Right Action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setAmbientOn(prev => !prev)}
              style={{
                background: ambientOn ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.06)',
                border: ambientOn ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(255,255,255,0.1)',
                color: ambientOn ? '#fbbf24' : '#a1a1aa',
                padding: '6px 12px',
                borderRadius: '9999px',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap'
              }}
            >
              <Wind size={14} />
              <span className="btn-label">{ambientOn ? 'AMBIENCE' : 'OFF'}</span>
            </button>

            <button
              onClick={() => setVideoVisible(true)}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#fff',
                padding: '6px 12px',
                borderRadius: '9999px',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap'
              }}
            >
              <Tv size={14} />
              <span className="btn-label">VIDEO</span>
            </button>

            {timeString && (
              <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'rgba(255,255,255,0.5)', paddingLeft: '6px' }} className="hud-time">
                {timeString}
              </span>
            )}
          </div>
        </header>

        {/* Center Telugu Title */}
        <div style={{
          position: 'absolute',
          top: '90px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          pointerEvents: 'none',
          zIndex: 15,
          width: '100%'
        }} className="title-container">
          <h1 style={{
            fontSize: '3.6rem',
            fontWeight: '900',
            color: '#fef08a',
            margin: 0,
            lineHeight: 1,
            letterSpacing: '0.02em',
            textShadow: '0 4px 20px rgba(0,0,0,0.9), 0 2px 4px rgba(0,0,0,0.8)',
            fontFamily: "'Akaya Telivigala', 'Gurajada', 'Ravi Prakash', serif"
          }} className="immersive-title">
            ఆటో రాజా
          </h1>
          <p style={{
            fontSize: '0.85rem',
            color: 'rgba(253, 230, 138, 0.75)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginTop: '4px',
            fontWeight: '600',
            textShadow: '0 2px 8px rgba(0,0,0,0.8)'
          }} className="immersive-sub">
            AUTO RAJA • MASS BEATS ON THE ROAD
          </p>
        </div>

        {/* Center Vehicle & Motion Layer */}
        <div style={{
          position: 'relative',
          flex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}>
          {/* Speed Lines */}
          <div className="speed-lines-container">
            <div className="speed-line speed-line-1" />
            <div className="speed-line speed-line-2" />
            <div className="speed-line speed-line-3" />
            <div className="speed-line speed-line-4" />
            <div className="speed-line speed-line-5" />
          </div>

          {/* Dust Spec Particles */}
          <div className="dust-particle-container">
            <div className="dust-spec dust-spec-1" />
            <div className="dust-spec dust-spec-2" />
            <div className="dust-spec dust-spec-3" />
            <div className="dust-spec dust-spec-4" />
          </div>

          {/* Exhaust Smoke Puffs */}
          <div className="smoke-container">
            <div className="smoke-puff smoke-puff-1" />
            <div className="smoke-puff smoke-puff-2" />
            <div className="smoke-puff smoke-puff-3" />
          </div>

          {/* HERO AUTO RICKSHAW SPRITE CONTAINER */}
          <div className="auto-hero-container">
            <img
              src={ambience.vehicleSprite}
              alt="Auto Raja"
              className="auto-hero-sprite"
            />

            {/* REALISTIC TELUGU AUTO STICKERS / QUOTATION BADGES (Sticked on Auto) */}
            
            {/* 1. Main Rear Canopy Sticker */}
            <div className="auto-sticker-canopy">
              <div className="sticker-glow" />
              <p className="sticker-telugu-text">
                {cleanQuote}
              </p>
              <div className="sticker-footer-badge">
                <span>★ ఆటో రాజా ★</span>
              </div>
            </div>

            {/* 2. Top Visor Banner Sticker */}
            <div className="auto-sticker-visor">
              <span>నమస్తే • TS 09 AUTO • జై మైసమ్మ</span>
            </div>

            {/* 3. Front Bumper Sticker */}
            <div className="auto-sticker-bumper">
              <span>FOR HIRE • మాస్ రాజా</span>
            </div>
          </div>

        </div>

        {/* Bottom Area: Controls & HUD */}
        <div style={{ position: 'relative', width: '100%', padding: '0 20px 24px', zIndex: 30 }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '680px', margin: '0 auto', zIndex: 30 }}>

            {/* HUD Capsule */}
            <div style={{
              background: 'rgba(10, 11, 15, 0.45)',
              backdropFilter: 'blur(30px) saturate(160%)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '24px',
              padding: '20px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              boxShadow: '0 25px 60px -15px rgba(0,0,0,0.7), inset 0 1px 1px rgba(255,255,255,0.06)',
              position: 'relative'
            }} className="capsule-hud">

              {/* Top Row: Track info & Controls */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '16px' }}>
                
                {/* Left: Album Art & Track details */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.3rem', flexShrink: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    
                    <button
                      onClick={() => setIsShuffle(prev => !prev)}
                      title={isShuffle ? "Disable Shuffle" : "Shuffle Tracks"}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: isShuffle ? '#fbbf24' : 'rgba(255,255,255,0.4)',
                        cursor: 'pointer',
                        padding: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'color 0.2s, transform 0.2s'
                      }}
                      className="control-icon"
                    >
                      <Shuffle size={16} />
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

      </div>

      {/* Global & Auto-Specific Styles */}
      <style jsx global>{`
        /* Hero Auto Rickshaw Container */
        .auto-hero-container {
          position: absolute;
          bottom: 35px;
          left: 50%;
          transform: translateX(-50%);
          width: 820px;
          max-width: 90vw;
          max-height: 75vh;
          z-index: 5;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .auto-hero-sprite {
          width: 100%;
          height: auto;
          object-fit: contain;
          filter: drop-shadow(0 20px 35px rgba(0,0,0,0.7));
          animation: auto-engine-vibe 0.1s linear infinite;
          pointer-events: none;
        }

        @keyframes auto-engine-vibe {
          0%   { transform: translateY(0px); }
          50%  { transform: translateY(-1.2px); }
          100% { transform: translateY(0px); }
        }

        /* REALISTIC TELUGU AUTO STICKERS STICKED ON AUTO */
        .auto-sticker-canopy {
          position: absolute;
          top: 36%;
          left: 48%;
          transform: translate(-50%, -50%) rotate(-1deg);
          width: 55%;
          background: rgba(15, 15, 18, 0.92);
          border: 2px solid rgba(251, 191, 36, 0.7);
          border-radius: 12px;
          padding: 10px 14px;
          text-align: center;
          box-shadow: 0 6px 18px rgba(0,0,0,0.7), inset 0 0 10px rgba(0,0,0,0.9);
          backdrop-filter: blur(4px);
          z-index: 8;
          transition: all 0.4s ease;
        }

        .sticker-glow {
          position: absolute;
          inset: 0;
          border-radius: 10px;
          border: 1px dashed rgba(255,255,255,0.25);
          pointer-events: none;
        }

        .sticker-telugu-text {
          font-family: "'Akaya Telivigala', 'Ravi Prakash', 'Gurajada', serif";
          font-size: 1.15rem;
          font-weight: 700;
          color: #fef08a;
          margin: 0;
          line-height: 1.35;
          letter-spacing: 0.02em;
          text-shadow: 0 2px 6px rgba(0,0,0,0.9);
        }

        .sticker-footer-badge {
          margin-top: 4px;
          font-size: 0.65rem;
          font-weight: 800;
          color: #ef4444;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .auto-sticker-visor {
          position: absolute;
          top: 18%;
          left: 48%;
          transform: translate(-50%, -50%);
          background: rgba(16, 185, 129, 0.85);
          color: #fff;
          font-family: "'Akaya Telivigala', serif";
          font-size: 0.8rem;
          font-weight: 700;
          padding: 3px 14px;
          border-radius: 4px;
          border: 1px solid rgba(255,255,255,0.4);
          box-shadow: 0 3px 8px rgba(0,0,0,0.6);
          white-space: nowrap;
          z-index: 8;
        }

        .auto-sticker-bumper {
          position: absolute;
          bottom: 22%;
          left: 48%;
          transform: translate(-50%, 0);
          background: #fbbf24;
          color: #000;
          font-size: 0.7rem;
          font-weight: 900;
          padding: 2px 10px;
          border-radius: 3px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.7);
          letter-spacing: 0.08em;
          z-index: 8;
        }

        /* MOTION EFFECTS: DUST, AIR & SPEED LINES */
        .speed-lines-container, .dust-particle-container, .smoke-container {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .speed-line {
          position: absolute;
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%);
          border-radius: 2px;
          animation: speed-flow 0.9s linear infinite;
        }
        .speed-line-1 { top: 25%; width: 220px; animation-duration: 0.8s;  animation-delay: 0s; }
        .speed-line-2 { top: 40%; width: 280px; animation-duration: 1.0s;  animation-delay: 0.2s; }
        .speed-line-3 { top: 58%; width: 240px; animation-duration: 0.75s; animation-delay: 0.4s; }
        .speed-line-4 { top: 72%; width: 310px; animation-duration: 0.95s; animation-delay: 0.6s; }
        .speed-line-5 { top: 84%; width: 200px; animation-duration: 0.85s; animation-delay: 0.3s; }

        @keyframes speed-flow {
          0%   { transform: translateX(-30vw); opacity: 0; }
          40%  { opacity: 0.8; }
          100% { transform: translateX(100vw); opacity: 0; }
        }

        .dust-spec {
          position: absolute;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(253, 230, 138, 0.7);
          box-shadow: 0 0 6px rgba(251,191,36,0.8);
          animation: dust-flow 1.4s ease-out infinite;
        }
        .dust-spec-1 { bottom: 85px; left: 42%; animation-delay: 0s; }
        .dust-spec-2 { bottom: 70px; left: 52%; animation-delay: 0.3s; }
        .dust-spec-3 { bottom: 90px; left: 45%; animation-delay: 0.7s; }
        .dust-spec-4 { bottom: 65px; left: 58%; animation-delay: 1.1s; }

        @keyframes dust-flow {
          0%   { transform: translate(0,0) scale(0.4); opacity: 0; }
          30%  { opacity: 0.9; }
          100% { transform: translate(160px, -25px) scale(1.5); opacity: 0; }
        }

        .smoke-puff {
          position: absolute;
          bottom: 75px;
          left: 36%;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: rgba(200, 200, 200, 0.35);
          filter: blur(4px);
          animation: smoke-puff 1.2s ease-out infinite;
        }
        .smoke-puff-1 { animation-delay: 0s; }
        .smoke-puff-2 { animation-delay: 0.4s; }
        .smoke-puff-3 { animation-delay: 0.8s; }

        @keyframes smoke-puff {
          0%   { transform: translate(0,0) scale(0.5); opacity: 0.7; }
          100% { transform: translate(-90px, -40px) scale(3.5); opacity: 0; }
        }

        .control-icon:hover { color: #fff !important; transform: scale(1.1); }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        /* Desktop: hide mobile-only elements */
        .horn-btn-mobile { display: none !important; }
        .mobile-listeners-row { display: none !important; }

        /* Mobile Adjustments */
        @media (max-width: 768px) {
          .auto-hero-container {
            width: 110vw !important;
            max-width: none !important;
            bottom: 140px !important;
            left: 50% !important;
          }
          .auto-sticker-canopy {
            width: 70% !important;
            padding: 8px 10px !important;
          }
          .sticker-telugu-text {
            font-size: 0.92rem !important;
          }
          .auto-sticker-visor {
            font-size: 0.68rem !important;
            padding: 2px 8px !important;
          }
          .immersive-title { font-size: 2.2rem !important; }
          .capsule-hud { padding: 12px 14px !important; border-radius: 16px !important; gap: 8px !important; }
          .volume-slider-container { display: none !important; }
          .hud-time { display: none !important; }
          .horn-btn-desktop { display: none !important; }
          .listeners-badge-desktop { display: none !important; }
          .horn-btn-mobile { display: flex !important; }
          .mobile-listeners-row { display: flex !important; }
          .btn-label { display: none !important; }
        }
      `}</style>

    </div>
  );
}
