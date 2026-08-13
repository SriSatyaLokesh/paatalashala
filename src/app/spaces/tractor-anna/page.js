'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { getSongsForPlace } from '@/data/songs';
import { prefixPath } from '@/utils/paths';
import YouTubePlayer from '@/components/YouTubePlayer';
import AmbientWeather from '@/components/AmbientWeather';
import { supabase } from '@/utils/supabase';
import { ChevronLeft, Tv, Volume2, VolumeX, Wind, Shuffle, Play, Pause, Megaphone } from 'lucide-react';

export default function TractorAnna() {
  const songs = getSongsForPlace('tractor-anna');

  // State variables
  const [started, setStarted]             = useState(true);
  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const [isPlaying, setIsPlaying]       = useState(false);
  const [ytReady, setYtReady]           = useState(false);
  const [volume, setVolume]             = useState(60);
  const [currentTime, setCurrentTime]   = useState(0);
  const [duration, setDuration]         = useState(0);
  const [presenceCount, setPresenceCount] = useState(83);
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
    background: "url('/images/sunset_farm_background.png')",
    weather: 'clear',
    particles: 'dust'
  };
  const ambience = {
    ...rawAmbience,
    background: prefixPath(rawAmbience.background),
    vehicleSprite: prefixPath(rawAmbience.vehicleSprite || '/images/tractor_anna_sprite.png')
  };

  // === Random initial song/background ===
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

  // === Supabase Realtime Live Presence Counter ===
  useEffect(() => {
    if (!supabase) {
      const sim = () => {
        const s = Math.floor(Date.now() / 4000);
        setPresenceCount(Math.max(1, Math.round(83 + Math.sin(s * 0.5) * 5 + Math.cos(s * 0.2) * 2)));
      };
      sim();
      const t = setInterval(sim, 4000);
      return () => clearInterval(t);
    }

    const channel = supabase.channel('presence-tractor');

    channel
      .on('presence', { event: 'sync' }, () => {
        try {
          const state = channel.presenceState();
          // Count unique users in presence state
          // Each key is a user ID, value is an array of presence objects
          const userIds = Object.keys(state || {});
          const count = Math.max(1, userIds.length + 12); // Add realistic base count
          setPresenceCount(count);
        } catch (e) {
          console.error('Error reading presence state:', e);
          setPresenceCount(Math.max(1, 83 + Math.floor(Math.random() * 18) - 9));
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

  // === Background ===
  useEffect(() => {
    if (!started || !ambience.background) return;
    document.body.style.transition = 'background 1.8s ease';
    document.body.style.backgroundImage = ambience.background;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundAttachment = 'fixed';
    return () => { document.body.style.background = ''; };
  }, [currentSongIndex, started, ambience.background]);

  // === Ambient tractor audio ===
  useEffect(() => {
    if (!started || !ytReady) return;
    if (!ambientRef.current) {
      const a = new Audio(prefixPath('/audio/tractor_ambient.mp3'));
      a.loop   = true;
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

  // === Auto-unlock playback on first click anywhere ===
  useEffect(() => {
    const unlock = () => {
      try {
        if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
          playerRef.current.playVideo();
        }
        if (ambientRef.current && ambientOn) {
          ambientRef.current.play().catch(() => {});
        }
      } catch (_) {}
    };
    window.addEventListener('click', unlock, { once: true });
    return () => window.removeEventListener('click', unlock);
  }, [ambientOn]);

  // === Player callbacks ===
  const handlePlayerReady = (player) => {
    playerRef.current = player;
    player.setVolume(volume);
    if (isPlaying) {
      player.playVideo();
    }
  };

  const handlePlayerError = (code) => {
    setPlayerError(code);
    console.error('YouTube player error code:', code);
  };

  const handleStateChange = (code) => {
    if (code === 0) {  // ENDED - auto play next song
      next();
    } else if (code === 1) {  // PLAYING
      setIsPlaying(true);
      setYtReady(true);
      setPlayerError(null);
    } else if (code === 2) {  // PAUSED
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = (cur, dur) => {
    setCurrentTime(cur);
    setDuration(dur);
  };

  // === Controls ===
  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  const next = () => {
    if (songs.length === 0) return;
    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * songs.length);
      setCurrentSongIndex(randomIndex);
    } else {
      setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
    }
    setIsPlaying(true);
    setCurrentTime(0);
    setDuration(0);
  };

  const prev = () => {
    if (songs.length === 0) return;
    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * songs.length);
      setCurrentSongIndex(randomIndex);
    } else {
      setCurrentSongIndex((prevIndex) => (prevIndex - 1 + songs.length) % songs.length);
    }
    setIsPlaying(true);
    setCurrentTime(0);
    setDuration(0);
  };

  const seek = (e) => {
    if (!duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const t = ((e.clientX - rect.left) / rect.width) * duration;
    setCurrentTime(t);
    try {
      if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
        playerRef.current.seekTo(t, true);
      }
    } catch (_) {}
  };

  const changeVolume = (v) => {
    setVolume(v);
  };

  const playHorn = () => {
    const a = new Audio(prefixPath('/audio/horn.mp3'));
    a.volume = 0.55;
    a.play().catch(() => {});
  };

  const fmt = (s) => {
    if (typeof s !== 'number' || isNaN(s) || !isFinite(s)) return '0:00';
    const m   = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const startExperience = () => {
    setStarted(true);
    setIsPlaying(true);
  };

  // === Render ===
  return (
    <div style={{ minHeight: '100dvh', position: 'relative', overflow: 'hidden' }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* Top and Bottom Vignetting Gradient Overlays for High Contrast Visibility */}
      {started && (
        <>
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '180px',
            background: 'linear-gradient(to bottom, rgba(5, 6, 11, 0.75) 0%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 4
          }} />
          <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: '240px',
            background: 'linear-gradient(to top, rgba(5, 6, 11, 0.9) 0%, rgba(5, 6, 11, 0.3) 50%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 4
          }} />
        </>
      )}

      {/* === Start Overlay === */}
      {!started && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(5,6,11,0.96)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div style={{ padding: '40px', maxWidth: '440px', width: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '24px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', backdropFilter: 'blur(16px)' }}>
            <div>
              <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '14px' }}>🚜</span>
              <h1 style={{ fontSize: '2.4rem', fontWeight: '900', color: '#fff', fontFamily: "'Noto Serif Telugu', serif", margin: 0 }}>ట్రాక్టర్ అన్న</h1>
              <p style={{ color: '#a1a1aa', fontSize: '0.95rem', marginTop: '8px' }}>South Indian Village Beats & Rural Farmland Vibes</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#fbbf24', fontSize: '0.9rem', fontWeight: '600', background: 'rgba(245,158,11,0.08)', padding: '8px 16px', borderRadius: '20px', border: '1px solid rgba(245,158,11,0.2)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              <span>{presenceCount} listeners on field</span>
            </div>
            <button
              onClick={startExperience}
              style={{ padding: '16px 32px', borderRadius: '12px', background: '#fbbf24', color: '#000', fontSize: '1.1rem', fontWeight: '800', border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px rgba(245,158,11,0.4)', transition: 'transform 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              START HARVESTING
            </button>
          </div>
        </div>
      )}

      {/* === EXPERIENCE (mounted only after user clicks START) === */}
      {started && currentSong && (
        <>
          {/* Ambient weather */}
          <AmbientWeather weather={ambience.weather} particles={ambience.particles} active={isPlaying} />

          {/* Speed lines */}
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

          {/* Hero tractor */}
          <img src={ambience.vehicleSprite} alt="Tractor Anna" className="tractor-hero-sprite"
            style={{ animationPlayState: isPlaying ? 'running' : 'paused' }} />

          {/* Hero Title (zIndex: 5, above weather/ tractor layers) */}
          <div style={{
            position: 'absolute',
            top: '4vh',
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
            <h2 style={{
              fontSize: '4.8rem',
              fontWeight: '900',
              letterSpacing: '0.04em',
              color: '#fff',
              margin: 0,
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
              fontFamily: "'Akaya Telivigala', 'Gurajada', 'Ravi Prakash', serif",
              textAlign: 'center'
            }} className="immersive-title">
              ట్రాక్టర్ అన్న
            </h2>
          </div>

          {/* YouTube player — visibility:hidden keeps proper dimensions for YT init */}
          <div style={{
            position: 'fixed',
            bottom: '100px',
            right: '30px',
            width: '220px', height: '124px',
            borderRadius: '16px', overflow: 'hidden',
            boxShadow: videoVisible ? '0 12px 24px rgba(0,0,0,0.5)' : 'none',
            border: videoVisible ? '1px solid rgba(255,255,255,0.15)' : 'none',
            opacity: videoVisible ? 1 : 0,
            visibility: videoVisible ? 'visible' : 'hidden',
            transition: 'opacity 0.3s, visibility 0.3s',
            zIndex: videoVisible ? 40 : -1,
            background: '#000',
            pointerEvents: videoVisible ? 'auto' : 'none',
          }}>
            <YouTubePlayer
              videoId={currentSong?.youtubeVideoId}
              isPlaying={isPlaying}
              volume={volume}
              onStateChange={handleStateChange}
              onPlayerReady={handlePlayerReady}
              onTimeUpdate={handleTimeUpdate}
              onError={handlePlayerError}
            />
          </div>
          {playerError && (
            <div style={{ position: 'fixed', bottom: '170px', right: '30px', background: 'rgba(220,38,38,0.9)', color: '#fff', padding: '8px 14px', borderRadius: '10px', fontSize: '0.75rem', zIndex: 50 }}>
              ⚠ YT Player Error: {playerError}
            </div>
          )}

          {/* === HUD Overlay === */}
          <div style={{ zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100dvh', width: '100%', position: 'relative', padding: '16px 20px 24px' }}>

            {/* Top */}
            <div style={{ width: '100%' }}>
              <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', width: '100%', minHeight: '44px' }}>
                {/* Left */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fff', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '600', padding: '8px 14px', borderRadius: '9999px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', whiteSpace: 'nowrap' }} className="hud-button">
                    <ChevronLeft size={16} /><span>SPACES</span>
                  </Link>
                  {timeString && <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.05em' }} className="hud-time">{timeString}</span>}
                </div>


                {/* Right */}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button onClick={() => setAmbientOn(a => !a)}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', color: ambientOn ? '#fbbf24' : 'rgba(255,255,255,0.5)', fontSize: '0.78rem', fontWeight: '600', padding: '8px 12px', borderRadius: '9999px', background: ambientOn ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.06)', border: ambientOn ? '1px solid rgba(245,158,11,0.35)' : '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s' }} className="hud-button">
                    <Wind size={14} /><span className="btn-label">{ambientOn ? 'AMBIENCE' : 'OFF'}</span>
                  </button>
                  <button onClick={() => setVideoVisible(v => !v)}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', color: videoVisible ? '#fbbf24' : '#fff', fontSize: '0.78rem', fontWeight: '600', padding: '8px 12px', borderRadius: '9999px', background: videoVisible ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.08)', border: videoVisible ? '1px solid rgba(245,158,11,0.4)' : '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', cursor: 'pointer', whiteSpace: 'nowrap' }} className="hud-button">
                    <Tv size={14} /><span className="btn-label">{videoVisible ? 'HIDE' : 'VIDEO'}</span>
                  </button>
                </div>
              </header>
            </div>

            {/* Bottom HUD capsule */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '680px', margin: '0 auto', zIndex: 30 }}>

              {/* Quote right above the player capsule */}
              <div style={{ textAlign: 'center', marginBottom: '12px', width: '100%', pointerEvents: 'none' }}>
                <p style={{
                  fontSize: '1.2rem',
                  fontWeight: '400',
                  color: 'rgba(254, 240, 138, 0.95)',
                  margin: 0,
                  textShadow: '0 2px 8px rgba(0,0,0,0.85)',
                  fontStyle: 'normal',
                  letterSpacing: '0.03em',
                  lineHeight: '1.4',
                  fontFamily: "'Akaya Telivigala', 'Gurajada', 'Ravi Prakash', serif"
                }} className="immersive-quote">
                  {(currentSong?.quote || 'చేను చెలకా మనదేరా, రైతు అన్న రాజేరా!').replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim()}
                </p>
              </div>

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

                {/* Top Row: Art + Info (Left) & Playback Controls + Volume (Right) */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '16px' }}>
                  
                  {/* Left: Track Info & Album Art */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
                    {/* Spinning Vinyl Record Disc design */}
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
                      {currentSong.youtubeVideoId ? (
                        <img 
                          src={`https://img.youtube.com/vi/${currentSong.youtubeVideoId}/hqdefault.jpg`} 
                          alt="Album Art" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                      ) : (
                        <span style={{ fontSize: '1.2rem' }}>🚜</span>
                      )}
                      {/* Center Spindle Hole */}
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
                        {currentSong?.title || 'Loading song…'}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#a1a1aa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {currentSong?.movie ? `${currentSong.movie} (${currentSong.year || 'Classic'})` : 'Telugu Classics'}
                      </span>
                    </div>
                  </div>

                  {/* Right: Controls & Volume */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.3rem', flexShrink: 0 }}>
                    {/* Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      


                      <button 
                        onClick={() => setIsShuffle(prev => !prev)} 
                        title={isShuffle ? "Disable Shuffle" : "Shuffle Tracks (🔀)"}
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
                      
                      <button onClick={prev} title="Previous Song (⏮)" style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', padding: '6px', fontSize: '1.2rem', transition: 'transform 0.2s' }} className="control-icon">⏮</button>
                      
                      <button onClick={togglePlay}
                        title={isPlaying ? "Pause (⏸)" : "Play (▶)"}
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
                      
                      <button onClick={next} title="Next Song (⏭)" style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', padding: '6px', fontSize: '1.2rem', transition: 'transform 0.2s' }} className="control-icon">⏭</button>

                      {/* Horn — mobile only, lives inside capsule */}
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
                          transition: 'transform 0.15s',
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

                    {/* Volume */}
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

                {/* Bottom Row: Progress Timeline and Timestamps */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
                  {/* Progress Track Line (thicker and cleaner for dragging/seeking) */}
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
                    {/* Thumb handle */}
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
                  
                  {/* Timestamps */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#a1a1aa', fontFamily: 'monospace', letterSpacing: '0.02em' }}>
                    <span>{fmt(currentTime)}</span>
                    <span>{duration > 0 ? fmt(duration) : '0:00'}</span>
                  </div>
                </div>

                {/* Listeners row — mobile only */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#a7f3d0',
                  justifyContent: 'center',
                }} className="mobile-listeners-row">
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 6px #10b981' }} />
                  <span>{presenceCount} listeners on field</span>
                </div>

              </div>
            </div>
          </div>

          {/* Horn button + Listeners badge — desktop only */}
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

          {/* Listeners badge — desktop only */}
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
            <span>{presenceCount} listeners on field</span>
          </div>
        </>
      )}

      {/* === Global CSS === */}
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
        .hud-button:hover { background: rgba(255,255,255,0.14) !important; transform: translateY(-1px); }
        .horn-button:hover { background: rgba(255,255,255,0.16) !important; transform: scale(1.08) !important; }
        .control-icon:hover { color: #fff !important; transform: scale(1.1); }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        /* Desktop: hide mobile-only elements */
        .horn-btn-mobile { display: none !important; }
        .mobile-listeners-row { display: none !important; }

        @media (max-width: 768px) {
          /* TRACTOR — massive, bleed off edges for impact */
          .tractor-hero-sprite {
            width: 120vw !important;
            max-width: none !important;
            bottom: 150px !important;
            left: 50% !important;
            filter: drop-shadow(0 20px 40px rgba(0,0,0,0.75)) !important;
          }
          /* Title — smaller and higher up */
          .immersive-title { font-size: 2rem !important; }
          .immersive-title-container { top: 76px !important; }
          .immersive-quote { font-size: 1.05rem !important; line-height: 1.3 !important; }
          /* HUD capsule — tighter padding */
          .capsule-hud { padding: 12px 14px !important; border-radius: 16px !important; gap: 8px !important; }
          /* Hide desktop-only elements */
          .volume-slider-container { display: none !important; }
          .hud-time { display: none !important; }
          .horn-btn-desktop { display: none !important; }
          .listeners-badge-desktop { display: none !important; }
          /* Show mobile-only elements */
          .horn-btn-mobile { display: flex !important; }
          .mobile-listeners-row { display: flex !important; }
          /* Compact nav button labels */
          .btn-label { font-size: 0.65rem !important; }
        }
      `}</style>
    </div>
  );
}
