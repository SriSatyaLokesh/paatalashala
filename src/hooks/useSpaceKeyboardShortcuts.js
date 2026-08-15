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

    const isEditableTarget = (el) =>
      !!el && (['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName) || el.isContentEditable);

    const handleKeyDown = (e) => {
      if (e.repeat) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isEditableTarget(document.activeElement)) return;

      const { onTogglePlay, onNext, onPrev, onChangeVolume, volume, restoreVolume, volumeStep } = latest.current;
      switch (e.key) {
        case ' ':
        case 'Spacebar':
          e.preventDefault();
          onTogglePlay();
          break;
        case 'ArrowRight':
          e.preventDefault();
          onNext();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          onPrev();
          break;
        case 'ArrowUp':
          e.preventDefault();
          onChangeVolume(Math.min(100, volume + volumeStep));
          break;
        case 'ArrowDown':
          e.preventDefault();
          onChangeVolume(Math.max(0, volume - volumeStep));
          break;
        case 'm':
        case 'M':
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
