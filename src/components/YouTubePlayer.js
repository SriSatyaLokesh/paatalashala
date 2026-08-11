'use client';

import { useEffect, useRef } from 'react';

export default function YouTubePlayer({
  videoId,
  playlistId,
  isPlaying,
  volume = 50,
  onStateChange,
  onPlayerReady,
  onTimeUpdate,
  onError,
}) {
  const containerRef = useRef(null);
  const playerRef    = useRef(null);
  const intervalRef  = useRef(null);
  const readyRef     = useRef(false);

  // ── Initialize player once ────────────────────────────────────────────────
  useEffect(() => {
    let pollInterval;

    function init() {
      if (playerRef.current || !containerRef.current) return;

      // Base playerVars
      const playerVars = {
        controls:       1,
        disablekb:      0,
        fs:             1,
        modestbranding: 1,
        rel:            0,
        origin:         typeof window !== 'undefined' ? window.location.origin : '',
      };

      playerRef.current = new window.YT.Player(containerRef.current, {
        height:   '100%',
        width:    '100%',
        // When using playlistId, do NOT pass videoId here — onReady calls loadPlaylist
        videoId:  playlistId ? undefined : videoId,
        playerVars,
        events: {
          onReady: (event) => {
            readyRef.current = true;
            const player = event.target;
            player.setVolume(volume);

            if (playlistId) {
              // IMPORTANT: must use object form — bare string is treated as videoId, not playlistId
              player.loadPlaylist({
                listType: 'playlist',
                list: playlistId,
                index: 0,
                startSeconds: 0,
              });
            } else if (videoId) {
              if (isPlaying) player.playVideo();
            }

            if (onPlayerReady) onPlayerReady(player);
          },

          onStateChange: (event) => {
            if (onStateChange) onStateChange(event.data);
            if (event.data === window.YT.PlayerState.PLAYING) {
              startTracker(event.target);
            } else {
              stopTracker();
            }
          },

          onError: (event) => {
            console.error('[YT] error code:', event.data,
              '(101/150 = embed blocked, 100 = not found, 2 = bad param, 5 = HTML5 error)');
            if (onError) onError(event.data);
          },
        },
      });
    }

    if (window.YT && window.YT.Player) {
      init();
    } else {
      // Inject API script once
      if (!document.getElementById('yt-iframe-api')) {
        const s = document.createElement('script');
        s.id  = 'yt-iframe-api';
        s.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(s);
      }
      // Global callback
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prev) prev();
        init();
      };
      // Polling fallback (in case callback missed)
      pollInterval = setInterval(() => {
        if (window.YT && window.YT.Player) {
          clearInterval(pollInterval);
          init();
        }
      }, 300);
    }

    return () => {
      clearInterval(pollInterval);
      stopTracker();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Sync play/pause ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!readyRef.current || !playerRef.current) return;
    // Don't override playlist autoplay on first render
    if (playlistId) return;
    try {
      const state = playerRef.current.getPlayerState();
      if (isPlaying && state !== window.YT.PlayerState.PLAYING) {
        playerRef.current.playVideo();
      } else if (!isPlaying && state === window.YT.PlayerState.PLAYING) {
        playerRef.current.pauseVideo();
      }
    } catch (_) {}
  }, [isPlaying]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Sync volume ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (readyRef.current && playerRef.current) {
      try { playerRef.current.setVolume(volume); } catch (_) {}
    }
  }, [volume]);

  // ── Progress tracker ──────────────────────────────────────────────────────
  function startTracker(player) {
    stopTracker();
    intervalRef.current = setInterval(() => {
      try {
        const cur = player.getCurrentTime();
        const dur = player.getDuration();
        if (onTimeUpdate) onTimeUpdate(cur, dur);
      } catch (_) {}
    }, 500);
  }

  function stopTracker() {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#000', borderRadius: '12px', overflow: 'hidden' }}>
      <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} />
    </div>
  );
}
