'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { getSongsForPlace } from '@/data/songs';
import { prefixPath } from '@/utils/paths';
import YouTubePlayer from '@/components/YouTubePlayer';
import AmbientWeather from '@/components/AmbientWeather';
import { supabase } from '@/utils/supabase';
import { ChevronLeft, Tv, Volume2, VolumeX, Wind, Shuffle, Play, Pause, Users } from 'lucide-react';

export default function AmmamaRadio() {
  const songs = useMemo(() => getSongsForPlace('ammama'), []);

  // State variables
  const [started, setStarted]                     = useState(true);
  const [currentSongIndex, setCurrentSongIndex]   = useState(null);
  const [isPlaying, setIsPlaying]                 = useState(false);
  const [ytReady, setYtReady]                     = useState(false);
  const [volume, setVolume]                       = useState(50);
  const [currentTime, setCurrentTime]             = useState(0);
  const [duration, setDuration]                   = useState(0);
  const [presenceCount, setPresenceCount]         = useState(43);
  const [timeString, setTimeString]               = useState('');
  const [videoVisible, setVideoVisible]           = useState(false);
  const [ambientOn, setAmbientOn]                 = useState(true);
  const [playerError, setPlayerError]             = useState(null);
  const [isShuffle, setIsShuffle]                 = useState(false);
  const [seekHovered, setSeekHovered]             = useState(false);
  const [volumeHovered, setVolumeHovered]         = useState(false);
  const [showQueue, setShowQueue]                 = useState(false);

  const playerRef = useRef(null);
  const ambientRef = useRef(null);

  const currentSong = currentSongIndex !== null ? (songs[currentSongIndex] || {}) : null;
  
  const bgImages = [
    '/images/grandma_1.png',
    '/images/grandma_2.png',
    '/images/grandma_3.png'
  ];
  const bgIndex = currentSongIndex !== null ? (currentSongIndex % bgImages.length) : 0;
  const rawBackground = `url('${bgImages[bgIndex]}')`;
  const bgUrl = prefixPath(rawBackground);

  const AMMAMA_LYRICS = [
    "జో అచ్యుతానంద జోజో ముకుందా... రావె పరమానంద రామ గోవిందా...",
    "చందమామ రావే జాబిల్లి రావే... కొండెక్కి రావే గోరుముద్ద తీవే...",
    "లాలీ లాలీ జో లాలీ... లాలీ లాలీ వటపత్ర శాయీ...",
    "చిన్ని చిన్ని కలలే ఏవేవో కంటూ... వెన్నెలమ్మ ఒడిలో నిదురించు బాబు...",
    "అమ్మ ఒడి ప్రశాంతమైన ఆలయము... అమ్మ పిలుపు అమృత భాండము...",
    "గోరుముద్దలు తినిపించు అమ్మ ప్రేమ... గోవుల కాచే గోపాలుని చల్లని నీడ...",
    "జో జో లాలి జో జో లాలి... జోల పాడుతా నిదురపోవమ్మ...",
    "తెలిమంచు కరిగింది తూరుపు కనులలో... తొలికిరణమొచ్చింది నీ నయనాలలో...",
    "చిన్నారి పొన్నారి చిరునవ్వులు... చిలకమ్మ పలికిన తీయని పలుకులు..."
  ];
  const currentLyric = currentSongIndex !== null ? AMMAMA_LYRICS[currentSongIndex % AMMAMA_LYRICS.length] : "";

  // === Ambient Village audio ===
  useEffect(() => {
    if (!ambientRef.current) {
      const a = new Audio(prefixPath('/audio/grandfather_ambient.mp3'));
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
  }, [isPlaying, ambientOn]);

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

  // === Supabase Realtime Live Presence Counter ===
  useEffect(() => {
    if (!supabase) {
      const sim = () => {
        const s = Math.floor(Date.now() / 4000);
        setPresenceCount(Math.max(1, Math.round(43 + Math.sin(s * 0.5) * 4 + Math.cos(s * 0.2) * 2)));
      };
      sim();
      const t = setInterval(sim, 4000);
      return () => clearInterval(t);
    }

    const channel = supabase.channel('presence-ammama');

    channel
      .on('presence', { event: 'sync' }, () => {
        try {
          const state = channel.presenceState();
          const userIds = Object.keys(state || {});
          const count = Math.max(1, userIds.length + 9);
          setPresenceCount(count);
        } catch (e) {
          console.error('Error reading presence state:', e);
          setPresenceCount(Math.max(1, 43 + Math.floor(Math.random() * 8) - 4));
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
    document.body.style.transition = 'background 1.8s ease';
    document.body.style.backgroundImage = bgUrl;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center 30%';
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
    if ((code === 101 || code === 150) && currentSong?.youtubeVideoId) {
      fetch('/api/delete-song', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId: currentSong.youtubeVideoId })
      }).catch(err => console.error('Failed to report bad song:', err));
    }
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
      {/* Dark Vignette Overlay to showcase background image nicely */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(circle at center, rgba(15, 23, 42, 0.2) 0%, rgba(15, 23, 42, 0.65) 100%)',
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      {/* Weather / Dust particles effect (both fog and dust concurrently) */}
      <AmbientWeather weather="fog" particles="dust" active={isPlaying && ambientOn} />

      {/* YouTube player — visibility:hidden keeps proper dimensions for YT init */}
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
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: ambientOn ? '#ffb74d' : 'rgba(255,255,255,0.5)',
              fontSize: '0.78rem',
              fontWeight: '600',
              padding: '8px 12px',
              borderRadius: '9999px',
              background: ambientOn ? 'rgba(255, 183, 77, 0.15)' : 'rgba(255,255,255,0.06)',
              border: ambientOn ? '1px solid rgba(255, 183, 77, 0.35)' : '1px solid rgba(255,255,255,0.1)',
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
              color: videoVisible ? '#ffb74d' : '#fff',
              fontSize: '0.78rem',
              fontWeight: '600',
              padding: '8px 12px',
              borderRadius: '9999px',
              background: videoVisible ? 'rgba(255, 183, 77, 0.2)' : 'rgba(255,255,255,0.08)',
              border: videoVisible ? '1px solid rgba(255, 183, 77, 0.4)' : '1px solid rgba(255,255,255,0.12)',
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
          textShadow: '0 2px 8px rgba(0,0,0,0.75)',
          fontFamily: "'Akaya Telivigala', 'Gurajada', 'Ravi Prakash', serif",
          textAlign: 'center'
        }} className="immersive-title">
          అమ్మమ్మ రేడియో
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
        {/* Lullaby Lyric Display */}
        {currentLyric && (
          <div style={{
            textAlign: 'center',
            fontSize: '0.95rem',
            fontWeight: '500',
            color: '#ffcc80',
            textShadow: '0 2px 4px rgba(0,0,0,0.9), 0 0 10px rgba(255, 183, 77, 0.3)',
            marginBottom: '14px',
            padding: '8px 16px',
            background: 'rgba(23, 14, 11, 0.7)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 183, 77, 0.2)',
            width: 'fit-content',
            alignSelf: 'center',
            fontFamily: "'Akaya Telivigala', 'Gurajada', serif",
          }}>
            "{currentLyric}"
          </div>
        )}

        <div style={{
          background: 'rgba(15, 17, 26, 0.65)',
          backdropFilter: 'blur(30px) saturate(160%)',
          border: '1px solid rgba(255, 204, 128, 0.2)',
          borderRadius: '24px',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          boxShadow: '0 25px 60px -15px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.1)',
        }}>
          {/* Top Row: Track Info & Album Art (Left) | Controls & Volume (Right) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '16px' }}>
            
            {/* Track Info & Vinyl Art */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid rgba(255,255,255,0.15)',
                boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
                flexShrink: 0,
                position: 'relative',
                background: '#151515',
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
                  <span style={{ fontSize: '1.2rem' }}>📻</span>
                )}
                <div style={{
                  position: 'absolute',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#151515',
                  border: '1px solid rgba(255,255,255,0.2)',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 2
                }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
                <span style={{ fontSize: '1.05rem', fontWeight: '800', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentSong?.title || 'అమ్మమ్మ రేడియో గీతాలు'}
                </span>
                <span style={{ fontSize: '0.78rem', color: '#ffcc80', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentSong?.movie ? `${currentSong.movie} • ${currentSong.year}` : 'Classic Telugu Melodies'}
                </span>
              </div>
            </div>

            {/* Playback Controls & Volume */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => setIsShuffle(prev => !prev)}
                  title={isShuffle ? "Shuffle On" : "Shuffle Off"}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: isShuffle ? '#ffb74d' : 'rgba(255,255,255,0.4)',
                    cursor: 'pointer',
                    padding: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'color 0.2s',
                  }}
                >
                  <Shuffle size={16} />
                </button>

                <button onClick={prev} title="Previous Track" style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', padding: '6px', fontSize: '1.2rem' }}>⏮</button>

                <button
                  onClick={togglePlay}
                  title={isPlaying ? "Pause" : "Play"}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: '#ffb74d',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 16px rgba(255, 183, 77, 0.4)',
                    transition: 'transform 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  {isPlaying ? (
                    <Pause size={18} fill="#2e1c16" color="#2e1c16" />
                  ) : (
                    <Play size={18} fill="#2e1c16" color="#2e1c16" style={{ transform: 'translateX(1px)' }} />
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
                  style={{ background: 'none', border: 'none', color: volume === 0 ? '#ef4444' : '#ffcc80', cursor: 'pointer', padding: 0 }}
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
                    accentColor: '#ffb74d',
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
                  background: '#ffb74d',
                  borderRadius: '4px',
                  boxShadow: '0 0 10px rgba(255, 183, 77, 0.7)',
                  transition: 'width 0.1s linear',
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#ffcc80', fontFamily: 'monospace' }}>
              <span>{fmt(currentTime)}</span>
              <span>{duration > 0 ? fmt(duration) : '0:00'}</span>
            </div>
          </div>

          {/* Quote Display Removed */}

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
        color: '#ffe0b2',
        background: 'rgba(15, 17, 26, 0.7)',
        border: '1px solid rgba(255, 204, 128, 0.25)',
        backdropFilter: 'blur(12px)',
        padding: '8px 16px',
        borderRadius: '9999px',
        zIndex: 35,
        boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
      }} className="listeners-badge">
        <Users size={14} style={{ color: '#ffb74d' }} />
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
      `}</style>
    </div>
  );
}
