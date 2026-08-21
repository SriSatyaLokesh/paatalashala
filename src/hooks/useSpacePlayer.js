'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { getActiveSongs } from '@/data/songs';
import { prefixPath } from '@/utils/paths';
import { supabase } from '@/utils/supabase';

// Shared state/effects/default-handlers for the 6 space pages. Auto composes
// its own next/prev/togglePlay/changeVolume/seek/player-callbacks locally
// from the raw setters/refs this hook returns, instead of using the defaults
// below — see src/app/spaces/auto/page.js.
//
// config:
//   initialVolume, initialStarted           - per-space
//   ambientAudio: { src, volume, gate } | null   gate: 'started+ytReady' | 'ytReady' | 'none'
//   presence: { channel, base, sineAmp, cosAmp, syncPad, catchSpread, catchOffset }  - required
//   backgroundImage: { url, position, transitionMs } | null   - null = page manages its own (auto)
//   autoSkipOnError: { enabled, delayMs, codes } | null
//   initialPickRange: number, default 5   - width of the random window for the
//     first song pick (index 0..range-1 of the sorted song list). Sammelanam
//     passes Infinity for a true whole-pool random start — see
//     src/app/spaces/sammelanam/page.js.
export function useSpacePlayer(placeSongs, config) {
  const {
    initialVolume = 60,
    initialStarted = true,
    ambientAudio = null,
    presence,
    backgroundImage = null,
    autoSkipOnError = null,
    autoUnlockRequiresPlaying = false,
    initialPickRange = 5,
  } = config;

  const songs = useMemo(() => getActiveSongs(placeSongs), [placeSongs]);

  const [started, setStarted] = useState(initialStarted);
  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [ytReady, setYtReady] = useState(false);
  const [volume, setVolume] = useState(initialVolume);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  // Stable deterministic baseline for SSR; randomized on client mount to prevent hydration mismatch
  const [syncPad, setSyncPad] = useState(8);
  const [presenceCount, setPresenceCount] = useState(9);
  const [timeString, setTimeString] = useState('');
  const [videoVisible, setVideoVisible] = useState(false);
  const [ambientOn, setAmbientOn] = useState(true);
  const [playerError, setPlayerError] = useState(null);
  const [isShuffle, setIsShuffle] = useState(false);
  const [seekHovered, setSeekHovered] = useState(false);
  const [volumeHovered, setVolumeHovered] = useState(false);
  const [showShuffleHint, setShowShuffleHint] = useState(false);

  const playerRef = useRef(null);
  const ambientRef = useRef(null);

  const currentSong = currentSongIndex !== null ? (songs[currentSongIndex] || {}) : null;

  // Initialize client-side random session padding (3 to 15)
  useEffect(() => {
    const pad = Math.floor(Math.random() * 13) + 3;
    setSyncPad(pad);
    setPresenceCount(1 + pad);
  }, []);

  // === Initial song pick (+ flip started if the page starts unstarted, matching auto) ===
  useEffect(() => {
    if (songs.length > 0) {
      const range = Math.min(songs.length, initialPickRange);
      const randomIndex = Math.floor(Math.random() * range);
      console.log('RANDOM START SONG:', songs[randomIndex]?.title, 'INDEX:', randomIndex);
      setCurrentSongIndex(randomIndex);
    }
    if (!initialStarted) setStarted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // === Clock ===
  useEffect(() => {
    const tick = () =>
      setTimeString(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase());
    tick();
    const t = setInterval(tick, 10000);
    return () => clearInterval(t);
  }, []);

  // === Shuffle hint show/hide ===
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isShuffle) setShowShuffleHint(true);
    }, 10000);
    return () => clearTimeout(timer);
  }, [isShuffle]);

  useEffect(() => {
    if (showShuffleHint) {
      const timer = setTimeout(() => setShowShuffleHint(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [showShuffleHint]);

  // === Supabase Realtime Live Presence Counter ===
  const presenceChannel = presence?.channel || 'presence-space';
  useEffect(() => {
    if (!supabase) {
      const sim = () => {
        const s = Math.floor(Date.now() / 4000);
        setPresenceCount(Math.max(1, Math.round(1 + syncPad + Math.sin(s * 0.5) * 1.5)));
      };
      sim();
      const t = setInterval(sim, 4000);
      return () => clearInterval(t);
    }

    const channel = supabase.channel(presenceChannel);

    channel
      .on('presence', { event: 'sync' }, () => {
        try {
          const state = channel.presenceState();
          // Count unique users in presence state
          const userIds = Object.keys(state || {});
          const realCount = Math.max(1, userIds.length);
          const count = realCount + syncPad; // Real active users + random syncPad between 3 and 15
          setPresenceCount(count);
        } catch (e) {
          console.error('Error reading presence state:', e);
          setPresenceCount(1 + syncPad);
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
  }, [presenceChannel, syncPad]);

  // === Ambient audio ===
  const ambientSrc = ambientAudio?.src;
  const ambientVolume = ambientAudio?.volume;
  const ambientGate = ambientAudio?.gate;
  useEffect(() => {
    if (!ambientSrc) return;
    if (ambientGate === 'started+ytReady' && (!started || !ytReady)) return;
    if (ambientGate === 'ytReady' && !ytReady) return;
    if (!ambientRef.current) {
      const a = new Audio(prefixPath(ambientSrc));
      a.loop = true;
      a.volume = ambientVolume;
      ambientRef.current = a;
    }
    if (isPlaying && ambientOn) {
      ambientRef.current.play().catch(() => {});
    } else {
      ambientRef.current.pause();
    }
    return () => { ambientRef.current?.pause(); };
  }, [started, isPlaying, ambientOn, ytReady, ambientSrc, ambientVolume, ambientGate]);

  // === Background image applied to document.body ===
  // backgroundImage is a function (currentSong, currentSongIndex) => { url, position?, transitionMs? } | null,
  // computed here (not by the caller before calling the hook) since it needs
  // currentSong/currentSongIndex, which are themselves derived from
  // hook-internal state. currentSongIndex is passed too because ammama/
  // thathayya/vennallo cycle backgrounds by index modulo, not by song data.
  const resolvedBackground = backgroundImage ? backgroundImage(currentSong, currentSongIndex) : null;
  const bgUrl = resolvedBackground?.url;
  const bgPosition = resolvedBackground?.position ?? 'center';
  const bgTransitionMs = resolvedBackground?.transitionMs ?? 1800;
  useEffect(() => {
    if (!bgUrl || !started) return;

    // Create or retrieve the container for background layers
    let container = document.getElementById('space-bg-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'space-bg-container';
      container.style.position = 'fixed';
      container.style.inset = '0';
      container.style.zIndex = '-1';
      container.style.overflow = 'hidden';
      container.style.pointerEvents = 'none';
      container.style.backgroundColor = '#000';
      document.body.appendChild(container);
    }
    
    // Clear body background color to ensure container is visible
    document.body.style.backgroundColor = 'transparent';

    // Get or create the two layers
    let layer1 = document.getElementById('space-bg-layer-1');
    let layer2 = document.getElementById('space-bg-layer-2');

    if (!layer1) {
      layer1 = document.createElement('div');
      layer1.id = 'space-bg-layer-1';
      layer1.style.position = 'absolute';
      layer1.style.inset = '0';
      layer1.style.backgroundSize = 'cover';
      layer1.style.backgroundRepeat = 'no-repeat';
      layer1.style.transition = 'opacity 0.8s ease-in-out';
      layer1.style.opacity = '0';
      container.appendChild(layer1);
    }

    if (!layer2) {
      layer2 = document.createElement('div');
      layer2.id = 'space-bg-layer-2';
      layer2.style.position = 'absolute';
      layer2.style.inset = '0';
      layer2.style.backgroundSize = 'cover';
      layer2.style.backgroundRepeat = 'no-repeat';
      layer2.style.transition = 'opacity 0.8s ease-in-out';
      layer2.style.opacity = '0';
      container.appendChild(layer2);
    }

    // Determine active and next layers
    const isLayer1Active = layer1.style.opacity === '1';
    const activeLayer = isLayer1Active ? layer1 : layer2;
    const nextLayer = isLayer1Active ? layer2 : layer1;

    // Setup transition durations
    const duration = `${bgTransitionMs / 1000}s`;
    nextLayer.style.transition = `opacity ${duration} ease-in-out`;
    activeLayer.style.transition = `opacity ${duration} ease-in-out`;

    // Apply background properties to next layer
    nextLayer.style.backgroundImage = bgUrl;
    nextLayer.style.backgroundPosition = bgPosition;

    // Trigger crossfade
    nextLayer.style.opacity = '1';
    activeLayer.style.opacity = '0';
  }, [currentSongIndex, started, bgUrl, bgPosition, bgTransitionMs]);

  // Clean up background container on unmount
  useEffect(() => {
    return () => {
      const container = document.getElementById('space-bg-container');
      if (container) {
        container.remove();
      }
      document.body.style.backgroundColor = '';
    };
  }, []);

  // === Auto-unlock playback on first click anywhere ===
  // autoUnlockRequiresPlaying: auto's original unlock only calls playVideo()
  // if isPlaying was already true (its togglePlay controls the player
  // imperatively, so this avoids silently starting playback the UI doesn't
  // reflect); the other 5 spaces call playVideo() unconditionally whenever
  // the ref exists.
  //
  // This must attach exactly one { once: true } listener for the page's
  // whole lifetime (mount-only deps) — isPlaying/ambientOn are read from
  // refs kept in sync below, NOT from the effect's own dependency array.
  // Including them there previously caused the listener to be removed and
  // re-armed on every play/pause click, so the very next click after any
  // state change (e.g. pausing) was mistaken for the "first click" and
  // force-called playVideo() again, undoing the pause.
  const isPlayingRef = useRef(isPlaying);
  const ambientOnRef = useRef(ambientOn);
  useEffect(() => {
    isPlayingRef.current = isPlaying;
    ambientOnRef.current = ambientOn;
  }, [isPlaying, ambientOn]);

  useEffect(() => {
    const unlock = () => {
      try {
        if (
          playerRef.current &&
          typeof playerRef.current.playVideo === 'function' &&
          (!autoUnlockRequiresPlaying || isPlayingRef.current)
        ) {
          playerRef.current.playVideo();
        }
        if (ambientRef.current && ambientOnRef.current) {
          ambientRef.current.play().catch(() => {});
        }
      } catch (_) {}
    };
    window.addEventListener('click', unlock, { once: true });
    return () => window.removeEventListener('click', unlock);
    // Mount-only: see comment above for why isPlaying/ambientOn must not be deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // === Player callbacks ===
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
  };

  const handleStateChange = (code) => {
    if (code === 0) {  // ENDED - auto play next song
      next();
    } else if (code === 1) {  // PLAYING
      setIsPlaying(true);
      setYtReady(true);
      setPlayerError(null);
    } else if (code === 2) {  // PAUSED
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = (cur, dur) => {
    setCurrentTime(cur);
    setDuration(dur);
  };

  // === Controls ===
  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  // useCallback so autoSkipOnError's effect (below) gets a stable reference —
  // required for its delay timer to actually hold across re-renders.
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

  // seekBy: relative seek (±seconds), for hold-to-scrub keyboard shortcuts.
  // Unlike seek(e) above (absolute position from a click event), this takes a
  // plain delta. Uses the functional setState form so back-to-back calls
  // fired rapidly (e.g. every 200ms while a key is held) always clamp against
  // the latest currentTime even if a call fires before the previous one's
  // re-render has committed.
  const seekBy = (deltaSeconds) => {
    setCurrentTime((prevTime) => {
      const next = Math.max(0, Math.min(duration, prevTime + deltaSeconds));
      try {
        if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
          playerRef.current.seekTo(next, true);
        }
      } catch (_) {}
      return next;
    });
  };

  const changeVolume = (v) => {
    setVolume(v);
  };

  const fmt = (s) => {
    if (typeof s !== 'number' || isNaN(s) || !isFinite(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  // === Auto-skip on unplayable video errors ===
  const autoSkipEnabled = autoSkipOnError?.enabled ?? false;
  const autoSkipDelay = autoSkipOnError?.delayMs ?? 2500;
  const autoSkipCodes = autoSkipOnError?.codes ?? [2, 100, 101, 150];
  useEffect(() => {
    if (!autoSkipEnabled) return;
    if (autoSkipCodes.includes(playerError)) {
      const timer = setTimeout(() => {
        next();
      }, autoSkipDelay);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerError, next, autoSkipEnabled, autoSkipDelay]);

  return {
    songs, currentSong, currentSongIndex,
    started, isPlaying, ytReady, volume, currentTime, duration, presenceCount, timeString,
    ambientOn, playerError, isShuffle, seekHovered, volumeHovered, showShuffleHint, videoVisible,
    setAmbientOn, setVideoVisible, setIsShuffle, setSeekHovered, setVolumeHovered,
    setIsPlaying, setYtReady, setCurrentTime, setDuration, setVolume, setPlayerError, setCurrentSongIndex,
    playerRef, ambientRef,
    handlePlayerReady, handlePlayerError, handleStateChange, handleTimeUpdate,
    togglePlay, next, prev, seek, seekBy, changeVolume, fmt,
  };
}
