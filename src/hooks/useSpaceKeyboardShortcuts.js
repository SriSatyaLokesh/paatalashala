'use client';

import { useEffect, useRef } from 'react';

// Global keyboard shortcuts for the space player capsule (ACC-01):
// Space = play/pause, →/← = next/prev track, ↑/↓ = volume ±step, M = mute.
//
// Takes control functions as params rather than sourcing them itself, since
// callers must pass whichever functions are actually wired to their
// <PlayerCapsule> — useSpacePlayer's defaults for 5 spaces, or auto's own
// local imperative overrides for auto. See src/app/spaces/auto/page.js.
export function useSpaceKeyboardShortcuts({
  onTogglePlay,
  onNext,
  onPrev,
  onChangeVolume,
  volume,
  restoreVolume,
  volumeStep = 5,
  enabled = true,
}) {
  const latest = useRef();
  useEffect(() => {
    latest.current = { onTogglePlay, onNext, onPrev, onChangeVolume, volume, restoreVolume, volumeStep };
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

    const handleKeyDown = (e) => {
      if (e.repeat) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const active = document.activeElement;
      const { onTogglePlay, onNext, onPrev, onChangeVolume, volume, restoreVolume, volumeStep } = latest.current;
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
          onNext();
          break;
        case 'ArrowLeft':
          if (isTextEntry(active) || isRangeOrSelect(active)) return;
          e.preventDefault();
          onPrev();
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

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled]);
}
