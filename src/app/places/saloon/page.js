'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSongsForPlace } from '@/data/songs';
import YouTubePlayer from '@/components/YouTubePlayer';
import NowPlaying from '@/components/NowPlaying';
import UpNext from '@/components/UpNext';
import AmbientWeather from '@/components/AmbientWeather';
import { ChevronLeft, Volume2, Users } from 'lucide-react';

export default function DeluxeSaloon() {
  const songs = getSongsForPlace('saloon');

  // State variables
  const [isExperienceStarted, setIsExperienceStarted] = useState(true);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(40); // Saloons usually play music at lower volume
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [presenceCount, setPresenceCount] = useState(41);
  const [playerObject, setPlayerObject] = useState(null);

  const currentSong = songs[currentSongIndex];

  // Simulate dynamic presence count locally
  useEffect(() => {
    const simulatePresence = () => {
      const base = 41;
      const seconds = Math.floor(Date.now() / 4000);
      const variance = Math.sin(seconds * 0.5) * 4 + Math.cos(seconds * 0.2) * 1;
      setPresenceCount(Math.max(1, Math.round(base + variance)));
    };
    simulatePresence();
    const interval = setInterval(simulatePresence, 4000);
    return () => clearInterval(interval);
  }, []);

  // Update room background when song changes
  useEffect(() => {
    if (currentSong && isExperienceStarted) {
      document.body.style.transition = 'background 1.8s ease';
      document.body.style.background = currentSong.ambience.background;
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
    if (stateCode === 0) { // ENDED
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

      {/* Start Experience Overlay */}
      {!isExperienceStarted && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(26, 18, 15, 0.96)',
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
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
            borderColor: 'rgba(62, 39, 35, 0.4)'
          }}>
            <div>
              <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '16px', animation: 'vehicle-float 4s ease-in-out infinite' }}>💈</span>
              <h1 style={{ fontSize: '2rem', fontWeight: '900', letterSpacing: '-0.02em', color: '#ffcc80' }}>DELUXE SALOON</h1>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', marginTop: '6px' }}>
                Retro barber shop ambiance and classic melodies.
              </p>
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              color: '#ffcc80',
              fontSize: '0.9rem',
              fontWeight: '600',
              backgroundColor: 'rgba(255, 204, 128, 0.08)',
              padding: '8px 16px',
              borderRadius: '20px',
              alignSelf: 'center',
              border: '1px solid rgba(255, 204, 128, 0.2)'
            }}>
              <Users size={16} />
              <span>{presenceCount} waiting in queue</span>
            </div>

            <button
              onClick={startExperience}
              style={{
                padding: '16px 32px',
                borderRadius: '12px',
                backgroundColor: '#ffb74d',
                color: '#2e1c16',
                fontSize: '1.1rem',
                fontWeight: '800',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(255, 183, 77, 0.4)',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              ENTER SALOON
            </button>
          </div>
        </div>
      )}

      {/* Render salon dust motes in background */}
      {isExperienceStarted && (
        <AmbientWeather
          weather="clear"
          particles="dust-motes"
          active={isPlaying}
        />
      )}

      {/* Retro Saloon Environmental Overlays */}
      {isExperienceStarted && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1,
        }}>
          {/* Ceiling Fan Blades (Spinning in center-top) */}
          <div style={{
            position: 'absolute',
            top: '-60px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '280px',
            height: '280px',
            opacity: 0.12,
            zIndex: 2,
          }}>
            {/* Fan Base */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: '#fff',
              transform: 'translate(-50%, -50%)',
            }} />
            {/* Blades */}
            <div 
              className="fan-blades"
              style={{
                width: '100%',
                height: '100%',
                backgroundImage: 'linear-gradient(to right, transparent 45%, #fff 45%, #fff 55%, transparent 55%), linear-gradient(to bottom, transparent 45%, #fff 45%, #fff 55%, transparent 55%)',
                animationName: 'fan-spin',
                animationDuration: '3s',
                animationTimingFunction: 'linear',
                animationIterationCount: 'infinite',
                animationPlayState: isPlaying ? 'running' : 'paused',
              }} 
            />
          </div>

          {/* Flickering Tube Light Visual Element */}
          <div 
            style={{
              position: 'absolute',
              top: '15px',
              left: '25%',
              width: '50%',
              height: '12px',
              backgroundColor: '#e2f1ff',
              borderRadius: '6px',
              border: '2px solid rgba(255, 255, 255, 0.4)',
              boxShadow: '0 0 20px rgba(226, 241, 255, 0.8)',
              animation: currentSong?.ambience?.lighting === 'flickering-neon' ? 'light-flicker 10s infinite' : 'none',
              opacity: 0.95,
              zIndex: 3,
            }}
          />

          {/* Retro counter shadows / mirror frame styling */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            boxShadow: 'inset 0 0 100px rgba(0,0,0,0.85), inset 0 0 200px rgba(0,0,0,0.5)',
            border: '20px solid #271612', // Wooden room frame borders
            zIndex: 4,
          }} />
        </div>
      )}

      {/* Main View Layout */}
      {isExperienceStarted && (
        <div style={{
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          padding: '36px',
          paddingBottom: 'calc(36px + var(--bottom-safe-area))',
        }}>
          {/* Header */}
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
              color: '#d7ccc8',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: '600',
              padding: '8px 12px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#ffcc80'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#d7ccc8'}
            >
              <ChevronLeft size={16} />
              <span>Back</span>
            </Link>

            <div style={{ textAlign: 'center' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', color: '#ffcc80' }}>
                <span>💈 DELUXE SALOON</span>
              </h1>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.75rem',
              color: '#d7ccc8',
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)',
              padding: '6px 12px',
              borderRadius: '16px',
            }}>
              <Users size={12} style={{ color: '#ffb74d' }} />
              <span>{presenceCount} inside</span>
            </div>
          </header>

          {/* Grid Panel Area */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
            gap: '32px',
            flex: 1,
            alignItems: 'start',
            maxWidth: '1200px',
            width: '100%',
            margin: '0 auto',
          }} className="responsive-grid-layout">
            
            {/* Left Panel: The Retro CRT TV Frame wrapping YouTube Player */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Outer CRT TV Cabinet Container */}
              <div 
                style={{
                  backgroundColor: '#4e342e', // Retro dark brown TV plastic/wood casing
                  borderRadius: '24px',
                  padding: '24px 36px 24px 24px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.6), inset 0 2px 10px rgba(255,255,255,0.1)',
                  border: '8px solid #3e2723',
                  display: 'grid',
                  gridTemplateColumns: '1fr 80px', // Screen vs controls column
                  gap: '20px',
                  alignItems: 'center',
                  position: 'relative',
                }}
                className="responsive-tv-layout"
              >
                {/* Screen outer bezel */}
                <div style={{
                  backgroundColor: '#151515',
                  padding: '16px',
                  borderRadius: '20px',
                  border: '6px solid #2e1c16',
                  boxShadow: 'inset 0 0 20px rgba(0,0,0,0.9)',
                  position: 'relative',
                  aspectRatio: '4/3', // Vintage ratio representation
                  width: '100%',
                }}>
                  {/* Scanline Flickering overlay filter */}
                  <div 
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
                      backgroundSize: '100% 4px, 6px 100%',
                      zIndex: 6,
                      pointerEvents: 'none',
                      opacity: 0.45,
                      animation: 'scanline-flicker 0.15s infinite',
                    }}
                  />
                  
                  {/* Embedded Player */}
                  <div style={{ width: '100%', height: '100%', borderRadius: '8px', overflow: 'hidden' }}>
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

                {/* TV Cabinet Dial Controls */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  height: '80%',
                  gap: '16px',
                }} className="tv-dials">
                  {/* Channel Knob */}
                  <div style={{ textAlign: 'center', width: '100%' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: '#2e1c16',
                      border: '3px solid #ffb74d',
                      margin: '0 auto 4px',
                      position: 'relative',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                      transform: `rotate(${currentSongIndex * 60}deg)`,
                      transition: 'transform 0.4s ease',
                      cursor: 'pointer'
                    }}
                    onClick={handleNext}
                    >
                      {/* Knob Indicator line */}
                      <div style={{
                        position: 'absolute',
                        top: '4px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '4px',
                        height: '10px',
                        backgroundColor: '#ffb74d',
                        borderRadius: '2px'
                      }} />
                    </div>
                    <span style={{ fontSize: '0.65rem', color: '#ffcc80', fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>CHANNELS</span>
                  </div>

                  {/* Volume Knob representation */}
                  <div style={{ textAlign: 'center', width: '100%' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#2e1c16',
                      border: '3px solid #d7ccc8',
                      margin: '0 auto 4px',
                      position: 'relative',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                      transform: `rotate(${volume * 2.7}deg)`,
                      transition: 'transform 0.1s ease',
                    }} />
                    <span style={{ fontSize: '0.65rem', color: '#d7ccc8', fontFamily: 'var(--font-mono)' }}>VOLUME</span>
                  </div>

                  {/* Speaker Grill slats */}
                  <div style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    padding: '8px 0',
                    borderTop: '2px solid rgba(0,0,0,0.4)',
                    borderBottom: '2px solid rgba(0,0,0,0.4)',
                  }}>
                    <div style={{ height: '3px', backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: '1px' }} />
                    <div style={{ height: '3px', backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: '1px' }} />
                    <div style={{ height: '3px', backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: '1px' }} />
                    <div style={{ height: '3px', backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: '1px' }} />
                    <div style={{ height: '3px', backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: '1px' }} />
                  </div>

                  {/* TV power indicator light */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: isPlaying ? '#4caf50' : '#d84315',
                      boxShadow: isPlaying ? '0 0 8px #4caf50' : '0 0 8px #d84315',
                      display: 'inline-block'
                    }} />
                    <span style={{ fontSize: '0.55rem', color: '#d7ccc8', fontFamily: 'var(--font-mono)' }}>POWER</span>
                  </div>
                </div>

              </div>

            </div>

            {/* Right Panel: Controls & Queue */}
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

      <style jsx global>{`
        @media (max-width: 768px) {
          .responsive-grid-layout {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .responsive-tv-layout {
            grid-template-columns: 1fr !important;
            padding: 16px !important;
          }
          .tv-dials {
            flex-direction: row !important;
            height: auto !important;
            width: 100% !important;
            justify-content: space-around !important;
            border-top: 1px solid rgba(0,0,0,0.2) !important;
            padding-top: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}
