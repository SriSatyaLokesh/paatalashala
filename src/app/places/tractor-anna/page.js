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
  const [timeString, setTimeString] = useState('');
  
  // UI states
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isVideoVisible, setIsVideoVisible] = useState(false);

  const currentSong = songs[currentSongIndex];

  // Clock updating
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase());
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

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

  // Sync full-screen ambient image background transitions (1.2s crossfade)
  useEffect(() => {
    if (currentSong && isExperienceStarted) {
      document.body.style.transition = 'background 1.2s ease, background-image 1.2s ease';
      document.body.style.background = `${currentSong.ambience.background} center/cover no-repeat fixed`;
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
    if (stateCode === 0) { // Song ended
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

  // Play retro vehicle horn sound function
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
              <h1 style={{ fontSize: '2.2rem', fontWeight: '900', letterSpacing: '-0.02em', color: '#fff' }}>ట్రాక్టర్ అన్న</h1>
              <p style={{ color: '#a1a1aa', fontSize: '1rem', marginTop: '6px' }}>
                South Indian Village Beats & Rural Farmland Vibes.
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
              <span>{presenceCount} in the fields</span>
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
              START HARVESTING
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

      {/* Hero Tractor Image: Core Highlight of the page (60% UI Rule) */}
      {isExperienceStarted && (
        <img 
          src={currentSong?.ambience?.vehicleSprite || "/images/tractor_anna_sprite.png"} 
          alt="Tractor Anna Hero" 
          className="tractor-hero-sprite"
          style={{
            animationPlayState: isPlaying ? 'running' : 'paused',
          }}
        />
      )}

      {/* Main Immersive Minimalist Overlay */}
      {isExperienceStarted && (
        <div style={{
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100vh',
          width: '100%',
          position: 'relative',
          padding: '24px 32px',
        }}>
          {/* Top Bar Navigation */}
          <header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}>
            {/* Left: Places Back Link & Clock */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Link href="/" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#fff',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: '600',
                padding: '8px 16px',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(12px)',
              }} className="hud-button">
                <ChevronLeft size={16} />
                <span>PLACES</span>
              </Link>
              {timeString && (
                <span style={{
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: 'rgba(255, 255, 255, 0.7)',
                  letterSpacing: '0.05em',
                }}>{timeString}</span>
              )}
            </div>

            {/* Center: Presence Counter Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.85rem',
              fontWeight: '600',
              color: '#a7f3d0',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(12px)',
              padding: '8px 18px',
              borderRadius: '9999px',
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block', boxShadow: '0 0 8px #10b981' }} />
              <span>{presenceCount} in the fields</span>
            </div>

            {/* Right: Video Preview Toggle */}
            <button
              onClick={() => setIsVideoVisible(!isVideoVisible)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: isVideoVisible ? '#fbbf24' : '#fff',
                fontSize: '0.85rem',
                fontWeight: '600',
                padding: '8px 16px',
                borderRadius: '9999px',
                background: isVideoVisible ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                border: isVideoVisible ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(12px)',
                cursor: 'pointer',
              }}
              className="hud-button"
            >
              <Tv size={15} />
              <span>{isVideoVisible ? "HIDE VIDEO" : "SHOW VIDEO"}</span>
            </button>
          </header>

          {/* Top-Aligned Clean Title & Quote Block (30% Secondary UI Rule) */}
          <div style={{
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            userSelect: 'none',
            marginTop: '12px',
            zIndex: 5,
          }}>
            <h2 style={{
              fontSize: '4.2rem',
              fontWeight: '900',
              letterSpacing: '0.04em',
              color: '#ffffff',
              margin: 0,
              textShadow: '0 6px 28px rgba(0, 0, 0, 0.75)',
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }} className="immersive-title">
              ట్రాక్టర్ అన్న
            </h2>
            
            <p style={{
              fontSize: '1.15rem',
              fontWeight: '600',
              color: '#f4f4f5',
              margin: 0,
              textShadow: '0 3px 12px rgba(0, 0, 0, 0.85)',
              letterSpacing: '0.02em',
              opacity: 0.95,
            }}>
              {currentSong?.title} • {currentSong?.movie} ({currentSong?.year})
            </p>

            {/* Rustic Telugu Quote Line */}
            {currentSong?.quote && (
              <p style={{
                fontSize: '1.05rem',
                fontWeight: '500',
                color: '#fef08a',
                margin: '2px 0 0 0',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.9)',
                fontStyle: 'italic',
                letterSpacing: '0.03em',
                maxWidth: '650px',
              }}>
                {currentSong.quote}
              </p>
            )}
          </div>

          {/* Horn button on the left */}
          <div style={{
            position: 'absolute',
            left: '32px',
            bottom: '120px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            zIndex: 15,
          }}>
            <button
              onClick={playHorn}
              style={{
                width: '58px',
                height: '58px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(12px)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              className="horn-button"
            >
              <span style={{ fontSize: '1.5rem' }}>📢</span>
            </button>
            <span style={{
              fontSize: '0.7rem',
              fontWeight: '700',
              color: '#fff',
              textShadow: '0 2px 6px rgba(0,0,0,0.9)',
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

          {/* Bottom Floating HUD Capsule Controller (10% Accent UI Rule) */}
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
                background: 'rgba(15, 17, 23, 0.92)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '24px',
                padding: '20px',
                maxHeight: '280px',
                overflowY: 'auto',
                boxShadow: '0 -12px 40px rgba(0,0,0,0.7)',
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
                  <span>PLAYLIST QUEUE ({songs.length} TRACKS)</span>
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
                        <span style={{ fontSize: '0.9rem', fontWeight: isActive ? '700' : '500' }}>{index + 1}. {song.title}</span>
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

            {/* Floating Glass Capsule HUD */}
            <div style={{
              background: 'rgba(20, 22, 28, 0.8)',
              backdropFilter: 'blur(20px) saturate(140%)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '28px',
              padding: '14px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.55)',
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
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                }}
              >
                <div style={{
                  height: '100%',
                  width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                  backgroundColor: '#fbbf24',
                  boxShadow: '0 0 8px #fbbf24',
                  transition: 'width 0.1s linear',
                }} />
              </div>

              {/* Left Section: Cover & Title */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '2px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                  animationName: 'spin',
                  animationDuration: '12s',
                  animationTimingFunction: 'linear',
                  animationIterationCount: 'infinite',
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

                {/* Track Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {currentSong?.title}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#a1a1aa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {currentSong?.movie} • {currentSong?.artist.split(',')[0]}
                  </span>
                </div>
              </div>

              {/* Center Section: Controls */}
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
                  }}
                  className="control-icon"
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
                    boxShadow: '0 4px 14px rgba(255,255,255,0.4)',
                    transition: 'transform 0.15s, background-color 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <span style={{ fontSize: '1.2rem', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                  }}
                  className="control-icon"
                >
                  <span style={{ fontSize: '1.3rem' }}>⏭</span>
                </button>
              </div>

              {/* Right Section: Volume & Queue */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', justifyContent: 'flex-end', flex: 1 }}>
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
                  />
                </div>

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
                    }}
                  >
                    <ExternalLink size={18} />
                  </a>
                )}

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
                  }}
                >
                  <ListMusic size={20} />
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Global Style Adjustments */}
      <style jsx global>{`
        /* Core Hero Tractor Sprite (60% UI Dominance Rule) */
        .tractor-hero-sprite {
          position: absolute;
          bottom: 100px;
          left: 50%;
          transform: translateX(-50%);
          width: 520px;
          max-width: 85vw;
          max-height: 52vh;
          object-fit: contain;
          height: auto;
          animation: tractor-smooth-drive 3.6s ease-in-out infinite;
          z-index: 2;
          filter: drop-shadow(0 15px 30px rgba(0,0,0,0.55));
          pointer-events: none;
        }

        @keyframes tractor-smooth-drive {
          0% {
            transform: translateX(-50%) translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateX(calc(-50% + 5px)) translateY(-6px) rotate(0.4deg);
          }
          50% {
            transform: translateX(-50%) translateY(-2px) rotate(0deg);
          }
          75% {
            transform: translateX(calc(-50% - 5px)) translateY(-7px) rotate(-0.4deg);
          }
          100% {
            transform: translateX(-50%) translateY(0px) rotate(0deg);
          }
        }

        .hud-button:hover {
          background: rgba(255, 255, 255, 0.14) !important;
          transform: translateY(-2px);
        }

        .horn-button:hover {
          background: rgba(255, 255, 255, 0.16) !important;
          transform: scale(1.08) !important;
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
        }

        @keyframes slide-up {
          from { transform: translateY(15px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .queue-item:hover {
          background: rgba(255, 255, 255, 0.08) !important;
        }

        @media (max-width: 768px) {
          .immersive-title {
            font-size: 2.8rem !important;
          }

          .tractor-hero-sprite {
            width: 320px !important;
            bottom: 120px !important;
          }
          
          .capsule-hud {
            padding: 12px 16px !important;
          }

          .volume-slider-container {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
