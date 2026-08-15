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
export function useSpacePlayer(placeSongs, config) {
  const {
    initialVolume = 60,
    initialStarted = true,
    ambientAudio = null,
    presence,
    backgroundImage = null,
    autoSkipOnError = null,
    autoUnlockRequiresPlaying = false,
  } = config;

  const songs = useMemo(() => getActiveSongs(placeSongs), [placeSongs]);

  const [started, setStarted] = useState(initialStarted);
  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [ytReady, setYtReady] = useState(false);
  const [volume, setVolume] = useState(initialVolume);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [presenceCount, setPresenceCount] = useState(presence.base);
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

  // === Initial song pick (+ flip started if the page starts unstarted, matching auto) ===
  useEffect(() => {
    if (songs.length > 0) {
      const range = Math.min(songs.length, 5);
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
  const { channel: presenceChannel, base: presenceBase, sineAmp, cosAmp, syncPad, catchSpread, catchOffset } = presence;
  useEffect(() => {
    if (!supabase) {
      const sim = () => {
        const s = Math.floor(Date.now() / 4000);
        setPresenceCount(Math.max(1, Math.round(presenceBase + Math.sin(s * 0.5) * sineAmp + Math.cos(s * 0.2) * cosAmp)));
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
          // Each key is a user ID, value is an array of presence objects
          const userIds = Object.keys(state || {});
          const count = Math.max(1, userIds.length + syncPad); // Add realistic base count
          setPresenceCount(count);
        } catch (e) {
          console.error('Error reading presence state:', e);
          setPresenceCount(Math.max(1, presenceBase + Math.floor(Math.random() * catchSpread) - catchOffset));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presenceChannel, presenceBase, sineAmp, cosAmp, syncPad, catchSpread, catchOffset]);

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
    document.body.style.transition = `background ${bgTransitionMs / 1000}s ease`;
    document.body.style.backgroundImage = bgUrl;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = bgPosition;
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundAttachment = 'fixed';
    return () => { document.body.style.background = ''; };
  }, [currentSongIndex, started, bgUrl, bgPosition, bgTransitionMs]);

  // === Auto-unlock playback on first click anywhere ===
  // autoUnlockRequiresPlaying: auto's original unlock only calls playVideo()
  // if isPlaying was already true (its togglePlay controls the player
  // imperatively, so this avoids silently starting playback the UI doesn't
  // reflect); the other 5 spaces call playVideo() unconditionally whenever
  // the ref exists.
  useEffect(() => {
    const unlock = () => {
      try {
        if (
          playerRef.current &&
          typeof playerRef.current.playVideo === 'function' &&
          (!autoUnlockRequiresPlaying || isPlaying)
        ) {
          playerRef.current.playVideo();
        }
        if (ambientRef.current && ambientOn) {
          ambientRef.current.play().catch(() => {});
        }
      } catch (_) {}
    };
    window.addEventListener('click', unlock, { once: true });
    return () => window.removeEventListener('click', unlock);
  }, [ambientOn, isPlaying, autoUnlockRequiresPlaying]);

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
    togglePlay, next, prev, seek, changeVolume, fmt,
  };
}
