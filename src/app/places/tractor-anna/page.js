'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSongsForPlace } from '@/data/songs';
import YouTubePlayer from '@/components/YouTubePlayer';
import NowPlaying from '@/components/NowPlaying';
import UpNext from '@/components/UpNext';
import AmbientWeather from '@/components/AmbientWeather';
import { ChevronLeft, Compass, Users } from 'lucide-react';

export default function TractorAnna() {
  const songs = getSongsForPlace('tractor-anna');
  
  // State variables
  const [isExperienceStarted, setIsExperienceStarted] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [presenceCount, setPresenceCount] = useState(83);
  const [playerObject, setPlayerObject] = useState(null);

  const currentSong = songs[currentSongIndex];

  // Fetch real-time listener count
  useEffect(() => {
    const fetchPresence = async () => {
      try {
        const res = await fetch('/api/presence?place=tractor-anna');
        const data = await res.json();
        const seconds = Math.floor(Date.now() / 4000);
        const localVariance = Math.round(Math.sin(seconds * 0.5) * 3 + Math.cos(seconds * 0.2) * 1);
        setPresenceCount(Math.max(1, data.count + localVariance));
      } catch (e) {
        // Local simulation fallback
        const base = 83;
        const seconds = Math.floor(Date.now() / 4000);
        const variance = Math.sin(seconds * 0.5) * 5 + Math.cos(seconds * 0.2) * 2;
        setPresenceCount(Math.max(1, Math.round(base + variance)));
      }
    };
    fetchPresence();
    const interval = setInterval(fetchPresence, 5000);
    return () => clearInterval(interval);
  }, []);

  // Sync window styling for ambient transitions (using 1.2s crossfade)
  useEffect(() => {
    if (currentSong && isExperienceStarted) {
      document.body.style.transition = 'background 1.2s ease, background-image 1.2s ease';
      document.body.style.background = `${currentSong.ambience.background} center/cover no-repeat`;
    }
    return () => {
      document.body.style.background = '';
    };
  }, [currentSongIndex, isExperienceStarted, currentSong]);

  // Audio Handlers
  const handlePlayPauseToggle = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
    setIsPlaying(true);
    setCurrentTime(0);
  };

  const handlePrev = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex - 1 + songs.length) % songs.length);
    setIsPlaying(true);
    setCurrentTime(0);
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
  };

  const handleSeek = (timeInSeconds) => {
    setCurrentTime(timeInSeconds);
    if (playerObject && typeof playerObject.seekTo === 'function') {
      playerObject.seekTo(timeInSeconds, true);
    }
  };

  const handleSongSelect = (index) => {
    setCurrentSongIndex(index);
    setIsPlaying(true);
    setCurrentTime(0);
  };

  const handlePlayerReady = (player) => {
    setPlayerObject(player);
  };

  const handleStateChange = (stateCode) => {
    // When song ends (stateCode == 0), auto play next song
    if (stateCode === 0) {
      handleNext();
    } else if (stateCode === 1) { // PLAYING
      setIsPlaying(true);
    } else if (stateCode === 2) { // PAUSED
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = (current, total) => {
    setCurrentTime(current);
    setDuration(total);
  };

  const startExperience = () => {
    setIsExperienceStarted(true);
    setIsPlaying(true);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
    }} className="ambient-transition">

      {/* Start Experience Overlay (Autoplay gatekeeper) */}
      {!isExperienceStarted && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(5, 6, 11, 0.95)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px',
        }}>
          <div className="glass-panel" style={{
            padding: '40px',
            maxWidth: '480px',
            width: '100%',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          }}>
            <div>
              <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '16px', animation: 'vehicle-float 3s ease-in-out infinite' }}>🚜</span>
              <h1 style={{ fontSize: '2rem', fontWeight: '900', letterSpacing: '-0.02em' }}>TRACTOR ANNA</h1>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', marginTop: '6px' }}>
                Telugu farming songs and agricultural field vistas.
              </p>
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              color: 'var(--color-accent)',
              fontSize: '0.9rem',
              fontWeight: '600',
              backgroundColor: 'rgba(245, 158, 11, 0.08)',
              padding: '8px 16px',
              borderRadius: '20px',
              alignSelf: 'center',
              border: '1px solid rgba(245, 158, 11, 0.2)'
            }}>
              <Users size={16} />
              <span>{presenceCount} tractors in the fields</span>
            </div>

            <button
              onClick={startExperience}
              style={{
                padding: '16px 32px',
                borderRadius: '12px',
                backgroundColor: 'var(--color-accent)',
                color: '#000',
                fontSize: '1.1rem',
                fontWeight: '800',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(245, 158, 11, 0.4)',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              START DRIVING
            </button>
          </div>
        </div>
      )}

      {/* Render weather effects based on active song metadata */}
      {isExperienceStarted && currentSong && (
        <AmbientWeather
          weather={currentSong.ambience.weather}
          particles={currentSong.ambience.particles}
          active={isPlaying}
        />
      )}

      {/* Immersive Moving Farmland Visual Scene */}
      {isExperienceStarted && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}>
          {/* Horizon separator / skyline gradient glow */}
          <div style={{
            height: '45%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)',
          }} />

          {/* Animated Dirt Road Layout */}
          <div className="farm-road-container" style={{
            height: '30%',
            width: '100%',
            backgroundColor: '#6d4c41', // Rustic dirt road color
            position: 'relative',
            borderTop: '6px solid #8d6e63',
            boxShadow: 'inset 0 10px 20px rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
          }}>
            {/* Center Dashed Lane Markings / Scrolling Pebbles */}
            <div 
              style={{
                width: '100%',
                height: '12px',
                position: 'absolute',
                top: '40%',
                backgroundImage: 'linear-gradient(to right, #a1887f 40%, transparent 40%)',
                backgroundSize: '120px 12px',
                animation: `farm-road-scrolling ${currentSong?.ambience?.roadSpeed || '1s'} linear infinite`,
                animationPlayState: isPlaying ? 'running' : 'paused',
                opacity: 0.8,
              }} 
            />

            {/* Left/Bottom Boundary Line */}
            <div style={{
              position: 'absolute',
              bottom: '10%',
              width: '100%',
              height: '4px',
              backgroundColor: '#5d4037',
              opacity: 0.4,
            }} />

            {/* Dynamic Headlight/Lantern Glow Effect */}
            {(currentSong?.ambience?.theme === 'night' || currentSong?.ambience?.theme === 'rainy') && isPlaying && (
              <div style={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                height: '100%',
                background: 'radial-gradient(ellipse at bottom left, rgba(253,224,71,0.2) 0%, transparent 60%)',
                pointerEvents: 'none',
              }} />
            )}
          </div>

          {/* Vibrant Tractor Foreground Sprite Asset */}
          <img 
            src="/images/tractor_anna_sprite.png" 
            alt="Tractor Anna" 
            className="tractor-container"
            style={{
              animationPlayState: isPlaying ? 'running' : 'paused',
            }}
          />

          {/* Windshield Wiper Overlay for Rain */}
          {currentSong?.ambience?.weather === 'rain' && (
            <div 
              style={{
                position: 'absolute',
                bottom: '10%',
                left: '5%',
                width: '90vw',
                height: '4px',
                backgroundColor: 'rgba(15, 23, 42, 0.4)',
                borderRadius: '2px',
                transformOrigin: 'left center',
                animation: 'wiper-swipe 2.2s ease-in-out infinite',
                animationPlayState: isPlaying ? 'running' : 'paused',
                zIndex: 3,
              }}
            />
          )}
        </div>
      )}

      {/* Main View Layout */}
      {isExperienceStarted && (
        <div style={{
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          padding: '24px',
          paddingBottom: 'calc(24px + var(--bottom-safe-area))',
        }}>
          {/* Navigation and Title Header */}
          <header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px',
          }}>
            <Link href="/" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--color-text-secondary)',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: '600',
              padding: '8px 12px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-secondary)'}
            >
              <ChevronLeft size={16} />
              <span>Back</span>
            </Link>

            <div style={{ textAlign: 'center' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: '800', tracking: '-0.02em', display: 'flex', alignItems: 'center', gap: '8px', justifycontent: 'center' }}>
                <span>🚜 TRACTOR ANNA</span>
              </h1>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.75rem',
              color: 'var(--color-text-secondary)',
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)',
              padding: '6px 12px',
              borderRadius: '16px',
            }}>
              <Users size={12} style={{ color: 'var(--color-accent)' }} />
              <span>{presenceCount} on road</span>
            </div>
          </header>

          {/* Grid Panel Area */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
            gap: '24px',
            flex: 1,
            alignItems: 'start',
            maxWidth: '1200px',
            width: '100%',
            margin: '0 auto',
          }} className="responsive-grid-layout">
            
            {/* Left Panel: Embedded YouTube Player inside Dashboard navigator frame */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div 
                className="glass-panel"
                style={{
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  border: '2px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                }}
              >
                {/* Navigator title bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Compass size={12} style={{ color: 'var(--color-accent)' }} />
                    <span>FARMLAND NAVIGATION SCREEN</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: isPlaying ? 'var(--color-neon-green)' : 'var(--color-accent)', display: 'inline-block' }} />
                    <span>{isPlaying ? 'PLAYING' : 'READY'}</span>
                  </div>
                </div>

                {/* Player screen wrapper */}
                <div style={{ aspectRatio: '16/9', width: '100%' }}>
                  <YouTubePlayer
                    videoId={currentSong?.youtubeVideoId}
                    isPlaying={isPlaying}
                    volume={volume}
                    onStateChange={handleStateChange}
                    onPlayerReady={handlePlayerReady}
                    onTimeUpdate={handleTimeUpdate}
                  />
                </div>
              </div>
            </div>

            {/* Right Panel: Controls, Metadata, and Song Queue */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <NowPlaying
                song={currentSong}
                isPlaying={isPlaying}
                volume={volume}
                currentTime={currentTime}
                duration={duration}
                onPlayPauseToggle={handlePlayPauseToggle}
                onNext={handleNext}
                onPrev={handlePrev}
                onVolumeChange={handleVolumeChange}
                onSeek={handleSeek}
              />

              <UpNext
                songs={songs}
                currentSongIndex={currentSongIndex}
                onSongSelect={handleSongSelect}
              />
            </div>
          </div>
        </div>
      )}

      {/* CSS adjustments for mobile devices */}
      <style jsx global>{`
        .tractor-container {
          position: absolute;
          bottom: 15%;
          left: 10%;
          width: 320px;
          height: auto;
          animation: tractor-vibration 0.15s linear infinite;
          z-index: 2;
        }

        @keyframes tractor-vibration {
          0% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-1.5px) rotate(0.2deg); }
          50% { transform: translateY(0px) rotate(0deg); }
          75% { transform: translateY(1px) rotate(-0.2deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }

        @keyframes farm-road-scrolling {
          from { background-position-x: 0px; }
          to { background-position-x: -240px; }
        }

        @media (max-width: 768px) {
          .responsive-grid-layout {
            display: flex !important;
            flex-direction: column !important;
            justify-content: flex-end !important;
            position: fixed !important;
            bottom: 16px !important;
            left: 16px !important;
            right: 16px !important;
            width: calc(100% - 32px) !important;
            max-height: 55vh !important;
            overflow-y: auto !important;
            background: rgba(10, 11, 15, 0.75) !important;
            backdrop-filter: blur(20px) !important;
            -webkit-backdrop-filter: blur(20px) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            border-radius: 20px !important;
            padding: 16px !important;
            z-index: 20 !important;
            gap: 12px !important;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6) !important;
          }
          
          .responsive-grid-layout > div {
            width: 100% !important;
          }

          .tractor-container {
            width: 180px !important;
            bottom: 60% !important;
            left: 5% !important;
          }

          .farm-road-container {
            height: 15% !important;
            bottom: 57% !important;
          }
        }
      `}</style>
    </div>
  );
}
