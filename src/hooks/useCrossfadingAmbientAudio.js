'use client';

import { useEffect, useRef } from 'react';
import { prefixPath } from '@/utils/paths';

// Per-song ambient audio crossfade, used only by the Sammelanam (random)
// space — kept fully isolated from useSpacePlayer's own ambient effect
// rather than teaching that shared, already-fragile effect a second mode
// (it only ever creates one persistent Audio element and never re-sources
// it; every other space's ambient track is a build-time constant, so it
// never needs to). Sammelanam passes ambientAudio: null into useSpacePlayer
// and drives its ambient audio entirely through this hook instead.
const FADE_MS = 700;
const FADE_STEPS = 14;

// ambientConfig: { src, volume, gate } | null, gate: 'started+ytReady' | 'ytReady' | 'none'
// Recompute ambientConfig fresh every render from the current song's theme —
// this hook reacts to `src` changing by crossfading to the new track.
export function useCrossfadingAmbientAudio(ambientConfig, { started, ytReady, isPlaying, ambientOn }) {
  const activeRef = useRef(null); // currently loaded/fading-in Audio element
  const activeSrcRef = useRef(null); // raw (un-prefixed) src currently loaded
  const outgoingRef = useRef(null); // element currently fading out, if any
  const fadeTimerRef = useRef(null);

  const src = ambientConfig?.src ?? null;
  const volume = ambientConfig?.volume ?? 0.15;
  const gate = ambientConfig?.gate ?? 'none';

  const ambientOnRef = useRef(ambientOn);
  useEffect(() => { ambientOnRef.current = ambientOn; }, [ambientOn]);

  const gateOpen = gate === 'started+ytReady' ? (started && ytReady) : gate === 'ytReady' ? ytReady : true;
  const shouldPlay = gateOpen && isPlaying && ambientOn;

  useEffect(() => {
    if (!src || !gateOpen) return;

    if (activeSrcRef.current !== src) {
      // Track changed — crossfade: ramp the outgoing element to silence while
      // ramping the new one up, then drop the outgoing element entirely.
      const outgoing = activeRef.current;
      const incoming = new Audio(prefixPath(src));
      incoming.loop = true;
      incoming.volume = 0;
      activeRef.current = incoming;
      activeSrcRef.current = src;
      outgoingRef.current = outgoing;

      if (shouldPlay) incoming.play().catch(() => {});

      if (fadeTimerRef.current) clearInterval(fadeTimerRef.current);
      let step = 0;
      const outStart = outgoing?.volume ?? 0;
      fadeTimerRef.current = setInterval(() => {
        step++;
        const t = step / FADE_STEPS;
        if (outgoing) outgoing.volume = Math.max(0, outStart * (1 - t));
        incoming.volume = Math.min(volume, volume * t);
        if (step >= FADE_STEPS) {
          clearInterval(fadeTimerRef.current);
          fadeTimerRef.current = null;
          if (outgoing) outgoing.pause();
          outgoingRef.current = null;
        }
      }, FADE_MS / FADE_STEPS);
      return;
    }

    // Same track already loaded — just reflect current play/pause intent.
    const el = activeRef.current;
    if (!el) return;
    if (shouldPlay) {
      if (!fadeTimerRef.current) el.volume = volume;
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [src, gateOpen, shouldPlay, volume]);

  // Mount-once autoplay-unlock for this page's ambient element, same pattern
  // useSpacePlayer's own unlock effect uses (see its comment on why
  // isPlaying/ambientOn must be read from a ref, not the dependency array).
  useEffect(() => {
    const unlock = () => {
      if (activeRef.current && ambientOnRef.current) {
        activeRef.current.play().catch(() => {});
      }
    };
    window.addEventListener('click', unlock, { once: true });
    return () => window.removeEventListener('click', unlock);
  }, []);

  useEffect(() => {
    return () => {
      if (fadeTimerRef.current) clearInterval(fadeTimerRef.current);
      activeRef.current?.pause();
      outgoingRef.current?.pause();
    };
  }, []);
}
