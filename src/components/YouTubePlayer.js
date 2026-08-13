'use client';

import { useEffect, useRef } from 'react';

export default function YouTubePlayer({
  videoId,
  isPlaying,
  volume = 50,
  onStateChange,
  onPlayerReady,
  onTimeUpdate,
  onError,
  // Media Session Props
  trackTitle,
  trackArtist,
  trackAlbum,
  onPrev,
  onNext,
  onPlayPause,
}) {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const isReadyRef = useRef(false);

  // Sync Media Session metadata and action handlers
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;

    if (videoId && trackTitle) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: trackTitle,
        artist: trackArtist || 'Paatalashala',
        album: trackAlbum || 'Telugu Melodies',
        artwork: [
          {
            src: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
            sizes: '480x360',
            type: 'image/jpeg'
          }
        ]
      });
    }

    if (onPlayPause) {
      navigator.mediaSession.setActionHandler('play', onPlayPause);
      navigator.mediaSession.setActionHandler('pause', onPlayPause);
    } else {
      navigator.mediaSession.setActionHandler('play', null);
      navigator.mediaSession.setActionHandler('pause', null);
    }

    if (onPrev) {
      navigator.mediaSession.setActionHandler('previoustrack', onPrev);
    } else {
      navigator.mediaSession.setActionHandler('previoustrack', null);
    }

    if (onNext) {
      navigator.mediaSession.setActionHandler('nexttrack', onNext);
    } else {
      navigator.mediaSession.setActionHandler('nexttrack', null);
    }

    return () => {
      if ('mediaSession' in navigator) {
        navigator.mediaSession.setActionHandler('play', null);
        navigator.mediaSession.setActionHandler('pause', null);
        navigator.mediaSession.setActionHandler('previoustrack', null);
        navigator.mediaSession.setActionHandler('nexttrack', null);
      }
    };
  }, [videoId, trackTitle, trackArtist, trackAlbum, onPrev, onNext, onPlayPause]);

  // Sync Media Session Playback State
  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
    }
  }, [isPlaying]);

  useEffect(() => {
    // Helper to check and initialize the player
    const checkAndInit = () => {
      if (window.YT && window.YT.Player) {
        initPlayer();
      }
    };

    // If YT API is already loaded in window, init immediately
    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      // Inject YouTube IFrame API script tag if not present
      if (!document.getElementById('youtube-iframe-api-script')) {
        const tag = document.createElement('script');
        tag.id = 'youtube-iframe-api-script';
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }

      // Hook up the global callback
      const previousCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (previousCallback) previousCallback();
        checkAndInit();
      };

      // Periodic check just in case callback misses
      const interval = setInterval(() => {
        if (window.YT && window.YT.Player) {
          clearInterval(interval);
          checkAndInit();
        }
      }, 500);

      return () => clearInterval(interval);
    }

    function initPlayer() {
      if (playerRef.current || !containerRef.current) return;

      playerRef.current = new window.YT.Player(containerRef.current, {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
          autoplay: isPlaying ? 1 : 0,
          controls: 1, // Keep player controls visible per PRD
          disablekb: 0,
          fs: 1,
          modestbranding: 1,
          rel: 0,
          showinfo: 0
        },
        events: {
          onReady: (event) => {
            isReadyRef.current = true;
            event.target.setVolume(volume);
            if (isPlaying && videoId) {
              event.target.playVideo();
            }
            if (onPlayerReady) onPlayerReady(event.target);
          },
          onStateChange: (event) => {
            if (onStateChange) onStateChange(event.data);
            
            // Track progress during active playback
            if (event.data === window.YT.PlayerState.PLAYING) {
              startProgressTracker(event.target);
            } else {
              stopProgressTracker();
            }
          },
          onError: (event) => {
            console.error('[YT Player Error]:', event.data);
            if (onError) onError(event.data);
          }
        }
      });
    }

    return () => {
      stopProgressTracker();
    };
  }, []);

  // Sync videoId
  useEffect(() => {
    if (isReadyRef.current && playerRef.current && typeof playerRef.current.loadVideoById === 'function' && videoId) {
      try {
        const currentUrl = playerRef.current.getVideoUrl ? playerRef.current.getVideoUrl() : '';
        if (!currentUrl.includes(videoId)) {
          if (isPlaying) {
            playerRef.current.loadVideoById({ videoId });
          } else {
            playerRef.current.cueVideoById({ videoId });
          }
        }
      } catch (err) {
        if (isPlaying) {
          playerRef.current.loadVideoById({ videoId });
        } else {
          playerRef.current.cueVideoById({ videoId });
        }
      }
    }
  }, [videoId]);

  // Sync playback state (play/pause)
  useEffect(() => {
    if (isReadyRef.current && playerRef.current) {
      try {
        const state = playerRef.current.getPlayerState();
        if (isPlaying && state !== window.YT.PlayerState.PLAYING) {
          playerRef.current.playVideo();
        } else if (!isPlaying && state === window.YT.PlayerState.PLAYING) {
          playerRef.current.pauseVideo();
        }
      } catch (err) {
        // Suppress errors during load
      }
    }
  }, [isPlaying]);

  // Sync volume
  useEffect(() => {
    if (isReadyRef.current && playerRef.current && typeof playerRef.current.setVolume === 'function') {
      playerRef.current.setVolume(volume);
    }
  }, [volume]);

  function startProgressTracker(player) {
    stopProgressTracker();
    progressIntervalRef.current = setInterval(() => {
      try {
        if (player && typeof player.getCurrentTime === 'function' && typeof player.getDuration === 'function') {
          const current = player.getCurrentTime();
          const duration = player.getDuration();
          if (onTimeUpdate) {
            onTimeUpdate(current, duration);
          }
        }
      } catch (err) {
        // player might be destroyed
      }
    }, 500);
  }

  function stopProgressTracker() {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: '#000', borderRadius: '12px', overflow: 'hidden' }}>
      <div ref={containerRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
    </div>
  );
}
