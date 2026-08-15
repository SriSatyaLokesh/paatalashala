'use client';

import { useEffect, useRef } from 'react';

// Global keyboard shortcuts for the space player capsule (ACC-01):
// Space = play/pause, →/← tap = next/prev track, →/← hold = seek ±5s
// repeatedly, ↑/↓ = volume ±step, M = mute.
//
// Takes control functions as params rather than sourcing them itself, since
// callers must pass whichever functions are actually wired to their
// <PlayerCapsule> — useSpacePlayer's defaults for 5 spaces, or auto's own
// local imperative overrides for auto. See src/app/spaces/auto/page.js.
// onSeekBy is the one exception: all 6 callers pass useSpacePlayer's own
// seekBy directly (no per-page override needed — see useSpacePlayer.js).

// How long ArrowLeft/ArrowRight must stay down before a press is promoted
// from "tap" (next/prev) to "hold" (repeated ±5s seek). Ordinary deliberate
// taps — including fast repeated tapping to skip several tracks — dwell
// ~80-180ms between keydown and keyup; 220ms sits above that range so taps
// aren't misclassified as holds, while staying low enough that a genuine
// hold still feels like it starts immediately.
const HOLD_THRESHOLD_MS = 220;
// Cadence of repeated seeks once a hold is confirmed, and the seek step.
// 5s every 200ms scrubs ~25s of track per second held: fast enough to cross
// a multi-minute track in a few seconds, slow enough to stop precisely.
const SEEK_REPEAT_INTERVAL_MS = 200;
const SEEK_STEP_SECONDS = 5;

export function useSpaceKeyboardShortcuts({
  onTogglePlay,
  onNext,
  onPrev,
  onChangeVolume,
  onSeekBy,
  volume,
  restoreVolume,
  volumeStep = 5,
  enabled = true,
}) {
  const latest = useRef();
  useEffect(() => {
    latest.current = { onTogglePlay, onNext, onPrev, onChangeVolume, onSeekBy, volume, restoreVolume, volumeStep };
  });

  // Per-key hold tracking for ArrowLeft/ArrowRight, fully independent so
  // holding both simultaneously seeks both directions correctly.
  const holdState = useRef({
    ArrowLeft: { down: false, holdFired: false, timeoutId: null, intervalId: null },
    ArrowRight: { down: false, holdFired: false, timeoutId: null, intervalId: null },
  });

  useEffect(() => {
    if (!enabled) return;

    // Guard per key, not blanket: a focused BUTTON only natively conflicts
    // with Space (native click-on-space activation); a focused range/select
    // only natively conflicts with the arrow keys (native value stepping).
    // A blanket "any interactive element focused -> ignore everything" guard
    // silently killed 4 of 5 shortcuts after the ordinary act of clicking
    // the play button, since focus remains on it afterward.
    const isTextEntry = (el) => {
      if (!el) return false;
      if (el.isContentEditable) return true;
      if (el.tagName === 'TEXTAREA') return true;
      if (el.tagName === 'INPUT') {
        const type = (el.type || 'text').toLowerCase();
        return !['range', 'checkbox', 'radio', 'button', 'submit', 'reset'].includes(type);
      }
      return false;
    };
    const isRangeOrSelect = (el) =>
      !!el && (el.tagName === 'SELECT' || (el.tagName === 'INPUT' && (el.type || '').toLowerCase() === 'range'));
    const isButton = (el) => !!el && el.tagName === 'BUTTON';

    const clearArrow = (key) => {
      const s = holdState.current[key];
      if (s.timeoutId) { clearTimeout(s.timeoutId); s.timeoutId = null; }
      if (s.intervalId) { clearInterval(s.intervalId); s.intervalId = null; }
      s.down = false;
      s.holdFired = false;
    };

    const startArrowHold = (key, direction) => {
      const s = holdState.current[key];
      if (s.down) return; // defensive; the e.repeat filter already prevents re-entry
      s.down = true;
      s.holdFired = false;
      s.timeoutId = setTimeout(() => {
        s.timeoutId = null;
        s.holdFired = true;
        const tick = () => {
          const { onSeekBy } = latest.current;
          onSeekBy(direction * SEEK_STEP_SECONDS);
        };
        tick(); // first seek exactly when the hold is confirmed, no extra wait
        s.intervalId = setInterval(tick, SEEK_REPEAT_INTERVAL_MS);
      }, HOLD_THRESHOLD_MS);
    };

    const endArrowHold = (key, onTap) => {
      const s = holdState.current[key];
      if (!s.down) return; // keyup with no tracked keydown (guard skipped it, e.g. focus was on the slider) — no-op
      const wasHold = s.holdFired;
      clearArrow(key);
      if (!wasHold) onTap();
    };

    const handleKeyDown = (e) => {
      if (e.repeat) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const active = document.activeElement;
      const { onTogglePlay, onChangeVolume, volume, restoreVolume, volumeStep } = latest.current;
      switch (e.key) {
        case ' ':
        case 'Spacebar':
          if (isTextEntry(active) || isButton(active)) return; // native typing/click owns Space here
          e.preventDefault();
          onTogglePlay();
          break;
        case 'ArrowRight':
          if (isTextEntry(active) || isRangeOrSelect(active)) return;
          e.preventDefault();
          startArrowHold('ArrowRight', 1);
          break;
        case 'ArrowLeft':
          if (isTextEntry(active) || isRangeOrSelect(active)) return;
          e.preventDefault();
          startArrowHold('ArrowLeft', -1);
          break;
        case 'ArrowUp':
          if (isTextEntry(active) || isRangeOrSelect(active)) return;
          e.preventDefault();
          onChangeVolume(Math.min(100, volume + volumeStep));
          break;
        case 'ArrowDown':
          if (isTextEntry(active) || isRangeOrSelect(active)) return;
          e.preventDefault();
          onChangeVolume(Math.max(0, volume - volumeStep));
          break;
        case 'm':
        case 'M':
          if (isTextEntry(active)) return; // nothing else in this app conflicts with M
          e.preventDefault();
          onChangeVolume(volume === 0 ? restoreVolume : 0);
          break;
        default:
          return;
      }
    };

    // Separate listener: only ArrowLeft/ArrowRight need keyup, to resolve
    // tap-vs-hold. All other keys still act entirely on keydown, unchanged.
    const handleKeyUp = (e) => {
      switch (e.key) {
        case 'ArrowRight':
          endArrowHold('ArrowRight', () => latest.current.onNext());
          break;
        case 'ArrowLeft':
          endArrowHold('ArrowLeft', () => latest.current.onPrev());
          break;
        default:
          return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      // Component could unmount (or enabled could flip false) mid-hold, e.g.
      // navigating away while a key is held — stop any pending/running
      // timers so they never fire after teardown.
      clearArrow('ArrowLeft');
      clearArrow('ArrowRight');
    };
  }, [enabled]);
}
