'use client';

import YouTubePlayer from '@/components/YouTubePlayer';

// The fixed-position PiP box wrapping <YouTubePlayer>, shared by all 6 space
// pages. The {videoId && ...} mount-gating decision is left to each page
// (tractor renders unconditionally, others gate on youtubeVideoId) — pass
// videoId as undefined/null from the caller to skip mounting the player.
export default function FloatingYouTubePlayer({
  videoVisible,
  videoId,
  isPlaying,
  volume,
  onStateChange,
  onPlayerReady,
  onTimeUpdate,
  onError,
  trackTitle,
  trackArtist,
  trackAlbum,
  onPrev,
  onNext,
  onPlayPause,
  bottom = 100,
  zIndexVisible = 40,
}) {
  return (
    <div style={{
      position: 'fixed',
      bottom: `${bottom}px`,
      right: '30px',
      width: '220px', height: '124px',
      borderRadius: '16px', overflow: 'hidden',
      boxShadow: videoVisible ? '0 12px 24px rgba(0,0,0,0.5)' : 'none',
      border: videoVisible ? '1px solid rgba(255,255,255,0.15)' : 'none',
      opacity: videoVisible ? 1 : 0,
      visibility: videoVisible ? 'visible' : 'hidden',
      transition: 'opacity 0.3s, visibility 0.3s',
      zIndex: videoVisible ? zIndexVisible : -1,
      background: '#000',
      pointerEvents: videoVisible ? 'auto' : 'none',
    }}>
      {videoId && (
        <YouTubePlayer
          videoId={videoId}
          isPlaying={isPlaying}
          volume={volume}
          onStateChange={onStateChange}
          onPlayerReady={onPlayerReady}
          onTimeUpdate={onTimeUpdate}
          onError={onError}
          trackTitle={trackTitle}
          trackArtist={trackArtist}
          trackAlbum={trackAlbum}
          onPrev={onPrev}
          onNext={onNext}
          onPlayPause={onPlayPause}
        />
      )}
    </div>
  );
}
