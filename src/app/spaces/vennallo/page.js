'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { getSongsForPlace } from '@/data/songs';
import { prefixPath } from '@/utils/paths';
import YouTubePlayer from '@/components/YouTubePlayer';
import AmbientWeather from '@/components/AmbientWeather';
import { supabase } from '@/utils/supabase';
import { ChevronLeft, Tv, Volume2, VolumeX, Wind, Shuffle, Play, Pause, Users } from 'lucide-react';

export default function Vennallo() {
  const songs = useMemo(() => getSongsForPlace('vennallo'), []);

  // State variables
  const [started, setStarted]                     = useState(true);
  const [currentSongIndex, setCurrentSongIndex]   = useState(null);
  const [isPlaying, setIsPlaying]                 = useState(false);
  const [ytReady, setYtReady]                     = useState(false);
  const [volume, setVolume]                       = useState(50);
  const [currentTime, setCurrentTime]             = useState(0);
  const [duration, setDuration]                   = useState(0);
  const [presenceCount, setPresenceCount]         = useState(68);
  const [timeString, setTimeString]               = useState('');
  const [videoVisible, setVideoVisible]           = useState(false);
  const [ambientOn, setAmbientOn]                 = useState(true);
  const [playerError, setPlayerError]             = useState(null);
  const [isShuffle, setIsShuffle]                 = useState(false);
  const [seekHovered, setSeekHovered]             = useState(false);
  const [volumeHovered, setVolumeHovered]         = useState(false);
  const [showQueue, setShowQueue]                 = useState(false);
  const [showShuffleHint, setShowShuffleHint]     = useState(false);

  const playerRef = useRef(null);
  const ambientRef = useRef(null);

  const currentSong = currentSongIndex !== null ? (songs[currentSongIndex] || {}) : null;
  
  const bgImages = [
    '/images/vennela_1.webp',
    '/images/vennela_2.webp',
    '/images/vennela_3.webp'
  ];
  const bgIndex = currentSongIndex !== null ? (currentSongIndex % bgImages.length) : 0;
  const rawBackground = `url('${bgImages[bgIndex]}')`;
  const bgUrl = prefixPath(rawBackground);

  const VENNELA_LYRICS = [
    "జామురాతిరి జాబిలమ్మ జోలపాడనా ఇలా... జోరుగాలిలో జోడు చేరి జోడు పాడనా...",
    "వెన్నెలве వెన్నెలవే నాతో కొంచెం మాట్లాడవా... వానలాగా కురవమంటే గుండె తలుపు తీయుదునే...",
    "చుక్కలారా చుక్కలారా చుట్టుముట్టండి... మా అన్నయ్యకు జోల పాడండి...",
    "జాబిలి కోసం ఆకాశమల్లే వేచి చూశాను నీ రాక కోసం...",
    "చిన్న చిన్న ఆశ చిలిపి చిన్న ఆశ... వెన్నెలని పట్టి ముద్దెట్టుకోవాలని ఆశ...",
    "గుసగుసలాడే వెన్నెల... హృదయమున రేగె కొత్త అల...",
    "మౌనమే నీ భాష ఓ మూగ మనసా... వెన్నెల లోన విరిసిన నీలి కలువల కలువ పూల వనమా...",
    "కమ్మని ఈ ప్రేమలేఖ రాసింది హృదయమే... ప్రియతమా నీవను రాగమే అనురాగమై..."
  ];
  const currentLyric = currentSongIndex !== null ? VENNELA_LYRICS[currentSongIndex % VENNELA_LYRICS.length] : "";

  // === Ambient Night Sky audio ===
  useEffect(() => {
    if (!ambientRef.current) {
      const a = new Audio(prefixPath('/audio/night_sky_ambience.mp3'));
      a.loop = true;
      a.volume = 0.12;
      ambientRef.current = a;
    }
    if (isPlaying && ambientOn) {
      ambientRef.current.play().catch(() => {});
    } else {
      ambientRef.current.pause();
    }
    return () => { ambientRef.current?.pause(); };
  }, [isPlaying, ambientOn]);

  // === Initial song ===
  useEffect(() => {
    if (songs.length > 0) {
      const range = Math.min(songs.length, 5);
      const randomIndex = Math.floor(Math.random() * range);
      setCurrentSongIndex(randomIndex);
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
        setPresenceCount(Math.max(1, Math.round(52 + Math.sin(s * 0.5) * 5 + Math.cos(s * 0.2) * 2)));
      };
      sim();
      const t = setInterval(sim, 4000);
      return () => clearInterval(t);
    }

    const channel = supabase.channel('presence-vennela');

    channel
      .on('presence', { event: 'sync' }, () => {
        try {
          const state = channel.presenceState();
          const userIds = Object.keys(state || {});
          const count = Math.max(1, userIds.length + 18); // Add realistic base count for late night
          setPresenceCount(count);
        } catch (e) {
          console.error('Error reading presence state:', e);
          setPresenceCount(Math.max(1, 52 + Math.floor(Math.random() * 8) - 4));
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
    if (!started || !bgUrl) return;
    document.body.style.transition = 'background 2.0s ease';
    document.body.style.backgroundImage = bgUrl;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center 40%';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundAttachment = 'fixed';
    return () => { document.body.style.background = ''; };
  }, [currentSongIndex, started, bgUrl]);

  // === Auto-unlock playback on first click ===
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

  // === Controls ===
  const next = useCallback(() => {
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
    setPlayerError(null);
  }, [songs, isShuffle]);

  const prev = useCallback(() => {
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
    setPlayerError(null);
  }, [songs, isShuffle]);

  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  // === Player Callbacks ===
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

  // === Auto-skip on unplayable video errors ===
  useEffect(() => {
    if (playerError === 2 || playerError === 100 || playerError === 101 || playerError === 150) {
      const timer = setTimeout(() => {
        next();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [playerError, next]);

  const handleStateChange = (code) => {
    if (code === 0) { // ENDED - auto play next track
      next();
    } else if (code === 1) { // PLAYING
      setIsPlaying(true);
      setYtReady(true);
      setPlayerError(null);
    } else if (code === 2) { // PAUSED
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = (cur, dur) => {
    setCurrentTime(cur);
    setDuration(dur);
  };

  const changeVolume = (v) => {
    setVolume(v);
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

  const fmt = (s) => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <div style={{
      minHeight: '100dvh',
      width: '100vw',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      color: '#fff',
    }}>
      {/* Night Ambient Darkness Overlay to create a magical terrace midnight vibe */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(circle at center, rgba(12, 16, 33, 0.25) 0%, rgba(8, 10, 24, 0.75) 100%)',
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      {/* Starry Night Weather particles effect */}
      <AmbientWeather weather="clear" particles="stars" active={isPlaying} />

      {/* YouTube player */}
      <div style={{
        position: 'fixed',
        bottom: '100px',
        right: '30px',
        width: '220px',
        height: '124px',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: videoVisible ? '0 12px 24px rgba(0,0,0,0.6)' : 'none',
        border: videoVisible ? '1px solid rgba(255,255,255,0.15)' : 'none',
        opacity: videoVisible ? 1 : 0,
        visibility: videoVisible ? 'visible' : 'hidden',
        transition: 'opacity 0.3s, visibility 0.3s',
        zIndex: videoVisible ? 40 : -1,
        background: '#000',
        pointerEvents: videoVisible ? 'auto' : 'none',
      }}>
        {currentSong?.youtubeVideoId && (
          <YouTubePlayer
            videoId={currentSong.youtubeVideoId}
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
        )}
      </div>

      {playerError && (
        <div style={{ position: 'fixed', bottom: '170px', right: '30px', background: 'rgba(220,38,38,0.9)', color: '#fff', padding: '8px 14px', borderRadius: '10px', fontSize: '0.75rem', zIndex: 50 }}>
          {playerError === 150 || playerError === 101 ? '⚠ Embedding restricted on localhost (Auto-skipping...)' : `⚠ Video Error: ${playerError}`}
        </div>
      )}

      {/* Top Header */}
      <header style={{
        zIndex: 10,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 20px',
        width: '100%',
      }} className="hud-top-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link href="/" style={{
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
          }} className="hud-button">
            <ChevronLeft size={16} />
            <span>SPACES</span>
          </Link>
          {timeString && (
            <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.05em' }} className="hud-time">
              {timeString}
            </span>
          )}
        </div>

        {/* Right Controls */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={() => setAmbientOn(a => !a)}
            title="Toggle background ambient sounds"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: ambientOn ? '#818cf8' : 'rgba(255,255,255,0.5)',
              fontSize: '0.78rem',
              fontWeight: '600',
              padding: '8px 12px',
              borderRadius: '9999px',
              background: ambientOn ? 'rgba(129, 140, 248, 0.15)' : 'rgba(255,255,255,0.06)',
              border: ambientOn ? '1px solid rgba(129, 140, 248, 0.35)' : '1px solid rgba(255,255,255,0.1)',
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
              color: videoVisible ? '#818cf8' : '#fff',
              fontSize: '0.78rem',
              fontWeight: '600',
              padding: '8px 12px',
              borderRadius: '9999px',
              background: videoVisible ? 'rgba(129, 140, 248, 0.2)' : 'rgba(255,255,255,0.08)',
              border: videoVisible ? '1px solid rgba(129, 140, 248, 0.4)' : '1px solid rgba(255,255,255,0.12)',
              backdropFilter: 'blur(12px)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
            className="hud-button"
          >
            <Tv size={14} />
            <span className="btn-label">{videoVisible ? 'HIDE' : 'VIDEO'}</span>
          </button>
        </div>
      </header>

      {/* Immersive Title Overlay */}
      <div style={{
        position: 'absolute',
        top: '12vh',
        left: 0, right: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        userSelect: 'none',
        padding: '0 24px',
        zIndex: 5,
      }} className="immersive-title-container">
        <h2 style={{
          fontSize: '4.8rem',
          fontWeight: '900',
          letterSpacing: '0.04em',
          color: '#fff',
          margin: 0,
          textShadow: '0 2px 10px rgba(0,0,0,0.85), 0 0 30px rgba(99, 102, 241, 0.3)',
          fontFamily: "'Akaya Telivigala', 'Gurajada', 'Ravi Prakash', serif",
          textAlign: 'center'
        }} className="immersive-title">
          మేడ మీద వెన్నెల్లో
        </h2>
      </div>

      {/* Bottom HUD Capsule Media Player */}
      <div style={{
        zIndex: 20,
        width: '100%',
        maxWidth: '680px',
        margin: '0 auto 24px',
        padding: '0 20px',
        display: 'flex',
        flexDirection: 'column',
      }}>

        <div style={{
          background: 'rgba(10, 12, 26, 0.7)',
          backdropFilter: 'blur(30px) saturate(150%)',
          border: '1px solid rgba(129, 140, 248, 0.2)',
          borderRadius: '24px',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          boxShadow: '0 25px 60px -15px rgba(0,0,0,0.85), inset 0 1px 1px rgba(255,255,255,0.08)',
        }}>
          {/* Top Row: Track Info & Album Art (Left) | Controls & Volume (Right) */}
          <div className="player-main-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '16px' }}>
            
            {/* Track Info & Vinyl Art */}
            <div className="track-info-container" style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '3px solid #1e2238',
                boxShadow: '0 0 0 2px rgba(129, 140, 248, 0.3), 0 8px 16px rgba(0,0,0,0.6)',
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
                    alt="Track Art"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <span style={{ fontSize: '1.2rem' }}>🌌</span>
                )}
                <div style={{
                  position: 'absolute',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#0d0e1a',
                  border: '1px solid rgba(255,255,255,0.2)',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 2
                }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
                <span style={{ fontSize: '1.05rem', fontWeight: '800', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentSong?.title || 'వెన్నెల్లో మైమరపు గీతాలు'}
                </span>
                <span style={{ fontSize: '0.78rem', color: '#a5b4fc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentSong?.movie ? `${currentSong.movie} • ${currentSong.year}` : 'Nostalgic Night Melodies'}
                </span>
              </div>
            </div>

            {/* Playback Controls & Volume */}
            <div className="player-controls-container" style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => setIsShuffle(prev => !prev)}
                  title="Toggle shuffle mode (play songs in random order)"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: isShuffle ? '#818cf8' : 'rgba(255,255,255,0.4)',
                    cursor: 'pointer',
                    padding: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'color 0.2s',
                    position: 'relative',
                  }}
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

                <button onClick={prev} title="Previous Track" style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', padding: '6px', fontSize: '1.2rem' }}>⏮</button>

                <button
                  onClick={togglePlay}
                  title={isPlaying ? "Pause" : "Play"}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: '#818cf8',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 16px rgba(129, 140, 248, 0.4)',
                    transition: 'transform 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  {isPlaying ? (
                    <Pause size={18} fill="#0f111a" color="#0f111a" />
                  ) : (
                    <Play size={18} fill="#0f111a" color="#0f111a" style={{ transform: 'translateX(1px)' }} />
                  )}
                </button>

                <button onClick={next} title="Next Track" style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', padding: '6px', fontSize: '1.2rem' }}>⏭</button>
              </div>

              <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255,255,255,0.12)' }} />

              {/* Volume Control */}
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                className="volume-slider-container"
                onMouseEnter={() => setVolumeHovered(true)}
                onMouseLeave={() => setVolumeHovered(false)}
              >
                <button
                  onClick={() => changeVolume(volume === 0 ? 50 : 0)}
                  style={{ background: 'none', border: 'none', color: volume === 0 ? '#ef4444' : '#a5b4fc', cursor: 'pointer', padding: 0 }}
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
                    width: '65px',
                    height: volumeHovered ? '6px' : '4px',
                    borderRadius: '3px',
                    background: 'rgba(255,255,255,0.2)',
                    accentColor: '#818cf8',
                    cursor: 'pointer',
                    transition: 'height 0.15s ease',
                  }}
                />
              </div>
            </div>

          </div>

          {/* Bottom Row: Timeline Progress & Timestamps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
            <div
              onClick={seek}
              onMouseEnter={() => setSeekHovered(true)}
              onMouseLeave={() => setSeekHovered(false)}
              style={{
                height: seekHovered ? '8px' : '6px',
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '4px',
                position: 'relative',
                cursor: 'pointer',
                transition: 'height 0.15s ease',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                  background: '#818cf8',
                  borderRadius: '4px',
                  boxShadow: '0 0 10px rgba(129, 140, 248, 0.7)',
                  transition: 'width 0.1s linear',
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#a5b4fc', fontFamily: 'monospace' }}>
              <span>{fmt(currentTime)}</span>
              <span>{duration > 0 ? fmt(duration) : '0:00'}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Floating Listeners Badge (Bottom Right) */}
      <div style={{
        position: 'fixed',
        right: '24px',
        bottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '0.85rem',
        fontWeight: '600',
        color: '#c7d2fe',
        background: 'rgba(10, 12, 26, 0.75)',
        border: '1px solid rgba(129, 140, 248, 0.25)',
        backdropFilter: 'blur(12px)',
        padding: '8px 16px',
        borderRadius: '9999px',
        zIndex: 35,
        boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
      }} className="listeners-badge">
        <Users size={14} style={{ color: '#818cf8' }} />
        <span>{presenceCount} listeners</span>
      </div>

      {/* CSS Animations & Mobile Responsiveness */}
      <style jsx global>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .hud-button:hover { background: rgba(255,255,255,0.16) !important; transform: translateY(-1px); }
        @media (max-width: 768px) {
          .immersive-title { font-size: 2.2rem !important; }
          .immersive-title-container { top: 76px !important; }
          .volume-slider-container { display: none !important; }
          .listeners-badge { display: none !important; }
          .hud-time { display: none !important; }
          .btn-label { font-size: 0.7rem !important; }
        }
        @media (max-width: 520px) {
          .player-main-row {
            flex-direction: column !important;
            align-items: center !important;
            gap: 12px !important;
          }
          .track-info-container {
            width: 100% !important;
            justify-content: flex-start !important;
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
