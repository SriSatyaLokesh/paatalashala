'use client';

import { useEffect, useRef, useCallback } from 'react';

/**
 * YouTubePlayer — uses a plain <iframe> embed with enablejsapi=1 + postMessage.
 * This is more reliable than the IFrame API constructor for playlist playback.
 *
 * YouTube embed URL for a playlist:
 *   https://www.youtube.com/embed/videoseries?list=PLAYLIST_ID&autoplay=1&enablejsapi=1
 */
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
  const iframeRef    = useRef(null);
  const intervalRef  = useRef(null);
  const readyRef     = useRef(false);
  const volumeRef    = useRef(volume);

  // Build the embed URL
  const src = playlistId
    ? `https://www.youtube.com/embed/videoseries?list=${playlistId}&autoplay=1&enablejsapi=1&controls=1&modestbranding=1&rel=0&fs=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`
    : videoId
      ? `https://www.youtube.com/embed/${videoId}?autoplay=${isPlaying ? 1 : 0}&enablejsapi=1&controls=1&modestbranding=1&rel=0&fs=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`
      : null;

  // ── postMessage sender helper ─────────────────────────────────────────────
  const sendCmd = useCallback((func, args = '') => {
    try {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func, args }),
        'https://www.youtube.com'
      );
    } catch (_) {}
  }, []);

  // ── Listen for YouTube postMessage events ─────────────────────────────────
  useEffect(() => {
    const onMessage = (e) => {
      if (!e.origin.includes('youtube.com')) return;
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;

        if (data?.event === 'onReady') {
          readyRef.current = true;
          // Set volume immediately
          sendCmd('setVolume', [volumeRef.current]);
          if (onPlayerReady) {
            // Expose a minimal player-like object so page.js controls work
            onPlayerReady({
              playVideo:     () => sendCmd('playVideo'),
              pauseVideo:    () => sendCmd('pauseVideo'),
              nextVideo:     () => sendCmd('nextVideo'),
              previousVideo: () => sendCmd('previousVideo'),
              seekTo:        (s) => sendCmd('seekTo', [s, true]),
              setVolume:     (v) => { volumeRef.current = v; sendCmd('setVolume', [v]); },
              getPlayerState: () => -1, // not available via postMessage
              getVideoData:  () => ({}),
            });
          }
        }

        if (data?.event === 'onStateChange') {
          const stateCode = data?.info;
          if (onStateChange) onStateChange(stateCode);
        }

        if (data?.event === 'onError') {
          console.error('[YT] error:', data?.info,
            '(101/150=embed blocked, 100=not found, 2=bad param)');
          if (onError) onError(data?.info);
        }

        // infoDelivery carries currentTime / duration
        if (data?.event === 'infoDelivery' && data?.info) {
          const { currentTime, duration } = data.info;
          if (onTimeUpdate && currentTime !== undefined && duration !== undefined) {
            onTimeUpdate(currentTime, duration);
          }
        }
      } catch (_) {}
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [sendCmd, onPlayerReady, onStateChange, onTimeUpdate, onError]);

  // ── Sync volume via postMessage ────────────────────────────────────────────
  useEffect(() => {
    volumeRef.current = volume;
    if (readyRef.current) sendCmd('setVolume', [volume]);
  }, [volume, sendCmd]);

  // ── Sync play/pause (only for single videoId mode, playlist autoplays) ────
  useEffect(() => {
    if (!readyRef.current || playlistId) return;
    if (isPlaying) sendCmd('playVideo');
    else sendCmd('pauseVideo');
  }, [isPlaying, playlistId, sendCmd]);

  if (!src) return null;

  return (
    <iframe
      ref={iframeRef}
      src={src}
      style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
      allow="autoplay; encrypted-media; fullscreen"
      allowFullScreen
      title="YouTube Player"
    />
  );
}
