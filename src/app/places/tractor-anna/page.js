'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSongsForPlace } from '@/data/songs';
import YouTubePlayer from '@/components/YouTubePlayer';
import AmbientWeather from '@/components/AmbientWeather';
import { ChevronLeft, Users, Tv, ListMusic, Volume2, VolumeX, ExternalLink, Music } from 'lucide-react';

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
  
  // New UI states
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isVideoVisible, setIsVideoVisible] = useState(false);

  const currentSong = songs[currentSongIndex];

  // Simulate dynamic presence count locally (no network calls, zero 404s)
  useEffect(() => {
    const simulatePresence = () => {
      const base = 83;
      const seconds = Math.floor(Date.now() / 4000);
      const variance = Math.sin(seconds * 0.5) * 5 + Math.cos(seconds * 0.2) * 2;
      setPresenceCount(Math.max(1, Math.round(base + variance)));
    };
    simulatePresence();
    const interval = setInterval(simulatePresence, 4000);
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

  // Play retro horn sound function
  const playHorn = () => {
    const audio = new Audio('https://www.soundjay.com/transportation/sounds/truck-horn-1.mp3');
    audio.volume = 0.4;
    audio.play().catch(e => console.log('Audio play failed:', e));
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
              <h1 style={{ fontSize: '2rem', fontWeight: '900', letterSpacing: '-0.02em', color: '#fff' }}>ట్రాక్టర్ అన్న</h1>
              <p style={{ color: '#a1a1aa', fontSize: '1rem', marginTop: '6px' }}>
                Telugu Village Beats & Agricultural Farmland Drive.
              </p>
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              color: '#fbbf24',
              fontSize: '0.9rem',
              fontWeight: '600',
              backgroundColor: 'rgba(245, 158, 11, 0.08)',
              padding: '8px 16px',
              borderRadius: '20px',
              alignSelf: 'center',
              border: '1px solid rgba(245, 158, 11, 0.2)'
            }}>
              <Users size={16} />
              <span>{presenceCount} on the farm</span>
            </div>

            <button
              onClick={startExperience}
              style={{
                padding: '16px 32px',
                borderRadius: '12px',
                backgroundColor: '#fbbf24',
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

          {/* Animated Road Layout */}
          {currentSong?.ambience?.roadType !== 'hidden' && (
            <div 
              className="farm-road-container" 
              style={{
                height: '150px',
                width: '100%',
                backgroundColor: currentSong?.ambience?.roadType === 'highway' ? '#374151' : '#8d6e63',
                position: 'relative',
                borderTop: currentSong?.ambience?.roadType === 'highway' ? '5px solid #4b5563' : '6px solid #a1887f',
                boxShadow: 'inset 0 10px 20px rgba(0,0,0,0.5)',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {/* Center Lane Markings */}
              <div 
                style={{
                  width: '100%',
                  height: currentSong?.ambience?.roadType === 'highway' ? '6px' : '8px',
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundImage: currentSong?.ambience?.roadType === 'highway' 
                    ? 'linear-gradient(to right, #fbbf24 40%, transparent 40%)' 
                    : 'linear-gradient(to right, #d7ccc8 30%, transparent 30%)',
                  backgroundSize: currentSong?.ambience?.roadType === 'highway' ? '180px 6px' : '160px 8px',
                  animation: `farm-road-scrolling ${currentSong?.ambience?.roadSpeed || '1.2s'} linear infinite`,
                  animationPlayState: isPlaying ? 'running' : 'paused',
                  opacity: currentSong?.ambience?.roadType === 'highway' ? 0.8 : 0.7,
                }} 
              />

              {/* Road boundary marker */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '4px',
                backgroundColor: currentSong?.ambience?.roadType === 'highway' ? '#1f2937' : '#5d4037',
                opacity: 0.3,
              }} />
            </div>
          )}

          {/* Vibrant Tractor Foreground Sprite Asset */}
          <img 
            src={currentSong?.ambience?.vehicleSprite || "/images/tractor_anna_sprite.png"} 
            alt="Tractor Anna" 
            className="tractor-sprite"
            style={{
              animationPlayState: isPlaying ? 'running' : 'paused',
              bottom: currentSong?.ambience?.roadType === 'hidden' ? '60px' : '140px',
            }}
          />

          {/* Windshield Wiper Overlay for Rain */}
          {currentSong?.ambience?.weather === 'rain' && (
            <div 
              style={{
                position: 'absolute',
                bottom: '150px',
                left: '10%',
                width: '80vw',
                height: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '3px',
                transformOrigin: 'left center',
                animation: 'wiper-swipe 2.2s ease-in-out infinite',
                animationPlayState: isPlaying ? 'running' : 'paused',
                zIndex: 3,
              }}
            />
          )}
        </div>
      )}

      {/* Main Immersive HUD Overlay */}
      {isExperienceStarted && (
        <div style={{
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100vh',
          width: '100%',
          position: 'relative',
          padding: '30px',
        }}>
          {/* Header Area */}
          <header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            {/* Back Button */}
            <Link href="/" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#fff',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: '600',
              padding: '10px 18px',
              borderRadius: '9999px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.2s ease',
            }}
            className="hud-button"
            >
              <ChevronLeft size={16} />
              <span>PLACES</span>
            </Link>

            {/* Presence Counter Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.85rem',
              fontWeight: '600',
              color: '#a7f3d0',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(8px)',
              padding: '8px 18px',
              borderRadius: '9999px',
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block', boxShadow: '0 0 8px #10b981' }} />
              <span>{presenceCount} in the fields</span>
            </div>

            {/* Video Preview Toggle Button */}
            <button
              onClick={() => setIsVideoVisible(!isVideoVisible)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: isVideoVisible ? '#fbbf24' : '#fff',
                fontSize: '0.9rem',
                fontWeight: '600',
                padding: '10px 18px',
                borderRadius: '9999px',
                background: isVideoVisible ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                border: isVideoVisible ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(8px)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              className="hud-button"
            >
              <Tv size={16} />
              <span>{isVideoVisible ? "HIDE VIDEO" : "SHOW VIDEO"}</span>
            </button>
          </header>

          {/* Centered Immersive Title Typography */}
          <div style={{
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            userSelect: 'none',
          }}>
            <h2 style={{
              fontSize: '4.5rem',
              fontWeight: '900',
              letterSpacing: '0.05em',
              color: '#fff',
              margin: 0,
              textShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }} className="immersive-title">
              ట్రాక్టర్ అన్న
            </h2>
            <p style={{
              fontSize: '1.1rem',
              fontWeight: '500',
              color: '#e4e4e7',
              margin: 0,
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.6)',
              opacity: 0.9,
              letterSpacing: '0.02em'
            }}>
              {currentSong?.title} • {currentSong?.movie} ({currentSong?.year})
            </p>
          </div>

          {/* Horn button on the left center */}
          <div style={{
            position: 'absolute',
            left: '30px',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
          }}>
            <button
              onClick={playHorn}
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(12px)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              className="horn-button"
            >
              <span style={{ fontSize: '1.8rem' }}>📢</span>
            </button>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: '700',
              color: '#fff',
              textShadow: '0 2px 4px rgba(0,0,0,0.8)',
              letterSpacing: '0.05em',
            }}>HORN PLEASE</span>
          </div>

          {/* Sleek Picture-in-Picture YouTube Player in bottom right */}
          <div 
            className="mini-youtube-container"
            style={{
              display: isVideoVisible ? 'block' : 'none',
            }}
          >
            <YouTubePlayer
              videoId={currentSong?.youtubeVideoId}
              isPlaying={isPlaying}
              volume={volume}
              onStateChange={handleStateChange}
              onPlayerReady={handlePlayerReady}
              onTimeUpdate={handleTimeUpdate}
            />
          </div>

          {/* Bottom Sleek Floating HUD Card Capsule */}
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '650px',
            margin: '0 auto',
            zIndex: 30,
          }}>
            {/* Slide-out Playlist Queue Panel */}
            {isQueueOpen && (
              <div style={{
                position: 'absolute',
                bottom: '90px',
                left: 0,
                right: 0,
                background: 'rgba(15, 17, 23, 0.85)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '24px',
                padding: '20px',
                maxHeight: '260px',
                overflowY: 'auto',
                boxShadow: '0 -12px 40px rgba(0,0,0,0.5)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                animation: 'slide-up 0.25s cubic-bezier(0.4, 0, 0.2, 1) forwards',
              }}>
                <div style={{
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  color: '#fbbf24',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  marginBottom: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  <Music size={12} />
                  <span>PLAYLIST QUEUE</span>
                </div>
                {songs.map((song, index) => {
                  const isActive = index === currentSongIndex;
                  return (
                    <button
                      key={song.id}
                      onClick={() => {
                        handleSongSelect(index);
                        setIsQueueOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        background: isActive ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                        border: isActive ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)',
                        color: isActive ? '#fbbf24' : '#fff',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease',
                      }}
                      className="queue-item"
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: isActive ? '700' : '500' }}>{song.title}</span>
                        <span style={{ fontSize: '0.75rem', color: isActive ? 'rgba(251, 191, 36, 0.7)' : '#a1a1aa' }}>{song.movie} • {song.artist}</span>
                      </div>
                      {isActive && (
                        <span style={{ fontSize: '0.75rem', fontWeight: '800', backgroundColor: '#fbbf24', color: '#000', padding: '2px 6px', borderRadius: '4px' }}>NOW PLAYING</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Capsule Controller Card */}
            <div style={{
              background: 'rgba(20, 22, 28, 0.7)',
              backdropFilter: 'blur(20px) saturate(140%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '24px',
              padding: '16px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.4)',
              position: 'relative',
              overflow: 'hidden',
            }} className="capsule-hud">
              
              {/* Premium Progress Bar top edge */}
              <div 
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const newPercent = clickX / rect.width;
                  handleSeek(newPercent * duration);
                }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  cursor: 'pointer',
                }}
              >
                <div style={{
                  height: '100%',
                  width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                  backgroundColor: '#fbbf24',
                  boxShadow: '0 0 6px #fbbf24',
                  transition: 'width 0.1s linear',
                }} />
              </div>

              {/* Left Section: Cover & Title */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
                {/* Rotating cover disc */}
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '2px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                  animation: 'spin 12s linear infinite',
                  animationPlayState: isPlaying ? 'running' : 'paused',
                  flexShrink: 0,
                  background: '#151515',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {currentSong ? (
                    <img 
                      src={`https://img.youtube.com/vi/${currentSong.youtubeVideoId}/mqdefault.jpg`}
                      alt="Disc"
                      style={{ width: '130%', height: '130%', objectFit: 'cover' }}
                    />
                  ) : (
                    <Music size={20} style={{ color: '#fbbf24' }} />
                  )}
                </div>

                {/* Text details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {currentSong?.title}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#a1a1aa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {currentSong?.movie} • {currentSong?.artist.split(',')[0]}
                  </span>
                </div>
              </div>

              {/* Center Section: Main Audio Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'center', padding: '0 20px' }}>
                <button
                  onClick={handlePrev}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.7)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px',
                    transition: 'color 0.2s',
                  }}
                  className="control-icon"
                  onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'}
                >
                  <span style={{ fontSize: '1.3rem' }}>⏮</span>
                </button>

                <button
                  onClick={handlePlayPauseToggle}
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    backgroundColor: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(255,255,255,0.3)',
                    transition: 'transform 0.15s, background-color 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <span style={{ fontSize: '1.2rem', color: '#000', display: 'flex', alignItems: 'center', justify: 'center' }}>
                    {isPlaying ? '⏸' : '▶'}
                  </span>
                </button>

                <button
                  onClick={handleNext}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.7)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px',
                    transition: 'color 0.2s',
                  }}
                  className="control-icon"
                  onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'}
                >
                  <span style={{ fontSize: '1.3rem' }}>⏭</span>
                </button>
              </div>

              {/* Right Section: Volume & Queue Toggles */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', justifyContent: 'flex-end', flex: 1 }}>
                
                {/* Volume Slider Block */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="volume-slider-container">
                  <button
                    onClick={() => handleVolumeChange(volume === 0 ? 50 : 0)}
                    style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer', padding: 0 }}
                  >
                    {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                    style={{
                      width: '60px',
                      height: '4px',
                      borderRadius: '2px',
                      background: 'rgba(255,255,255,0.2)',
                      accentColor: '#fbbf24',
                      cursor: 'pointer',
                    }}
                    className="volume-slider"
                  />
                </div>

                {/* External Spotify button */}
                {currentSong?.spotifyUrl && (
                  <a
                    href={currentSong.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#a1a1aa',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '4px',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#1ed760'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#a1a1aa'}
                  >
                    <ExternalLink size={18} />
                  </a>
                )}

                {/* Queue Toggle */}
                <button
                  onClick={() => setIsQueueOpen(!isQueueOpen)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: isQueueOpen ? '#fbbf24' : '#a1a1aa',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = isQueueOpen ? '#fbbf24' : '#fff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = isQueueOpen ? '#fbbf24' : '#a1a1aa'}
                >
                  <ListMusic size={20} />
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* CSS adjustments for mobile and desktop devices */}
      <style jsx global>{`
        .tractor-sprite {
          position: absolute;
          bottom: 140px;
          left: 15%;
          width: 250px;
          height: auto;
          animation: tractor-vibration 0.15s linear infinite;
          z-index: 2;
        }

        .hud-button {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .hud-button:hover {
          background: rgba(255, 255, 255, 0.12) !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .horn-button {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .horn-button:hover {
          background: rgba(255, 255, 255, 0.15) !important;
          transform: scale(1.08) !important;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5) !important;
        }
        .horn-button:active {
          transform: scale(0.95) !important;
        }

        .mini-youtube-container {
          position: absolute;
          bottom: 30px;
          right: 30px;
          width: 200px;
          height: 112px;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 12px 24px rgba(0,0,0,0.5);
          border: 1px solid rgba(255,255,255,0.15);
          opacity: 0.25;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 40;
          background: #000;
        }
        .mini-youtube-container:hover {
          opacity: 1;
          transform: scale(1.05);
          box-shadow: 0 16px 32px rgba(0,0,0,0.7);
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
          to { background-position-x: -160px; }
        }

        @keyframes slide-up {
          from { transform: translateY(15px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes wiper-swipe {
          0% { transform: rotate(0deg); }
          50% { transform: rotate(65deg); }
          100% { transform: rotate(0deg); }
        }

        .queue-item:hover {
          background: rgba(255, 255, 255, 0.08) !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
        }

        /* Responsive overrides for smaller screens */
        @media (max-width: 768px) {
          .immersive-title {
            font-size: 2.8rem !important;
          }
          
          .capsule-hud {
            padding: 12px 18px !important;
            border-radius: 20px !important;
          }

          .volume-slider-container {
            display: none !important; /* Hide volume on mobile to save space */
          }

          .tractor-sprite {
            width: 170px !important;
            bottom: 120px !important;
            left: 5% !important;
          }

          .farm-road-container {
            height: 120px !important;
          }

          .mini-youtube-container {
            bottom: 170px !important;
            right: 20px !important;
            width: 130px !important;
            height: 73px !important;
          }

          header {
            padding: 0 10px !important;
          }
        }
      `}</style>
    </div>
  );
}
