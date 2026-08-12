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
}) {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const isReadyRef = useRef(false);

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
          showinfo: 0,
          origin: typeof window !== 'undefined' ? window.location.origin : ''
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
