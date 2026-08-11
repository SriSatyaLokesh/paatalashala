# Testing Patterns

**Analysis Date:** 2026-08-11

## Test Framework

- **None Configured:** The codebase currently does not contain any automated unit, integration, or end-to-end testing frameworks (such as Jest, Vitest, Cypress, or Playwright).
- **No tests found:** No `tests/` or `__tests__/` directories, and no `*.test.js` or `*.spec.js` files are present in the repository.

## Manual Verification Flow

To verify features and ensure regressions do not occur:

### 1. Verification of Audio Playback
- Open the dev server (`npm run dev`).
- Navigate to the themed page (e.g., `/places/truck-wala`).
- Verify the **START** overlay is visible and blocks immediate autoplay.
- Click **[ START ]** and verify:
  - The YouTube IFrame loads in the player card container.
  - The first song begins playing.
  - The play/pause button switches correctly.
  - Volume slider successfully changes volume without crashing.
  - Clicking a song in the queue (UpNext) skips directly to that song and loads its appropriate metadata.
  - When a song ends, the player automatically triggers the next song in sequence.

### 2. Verification of Ambient Styling & Particle Canvas
- When a song starts, verify the background gradient changes to the song's themed gradient.
- Verify canvas particles (stars, rain, fog, dust-motes) match the song's ambient config:
  - Check weather speed and particle count.
  - Verify canvas resizing works when you toggle the browser's responsive design mode or adjust screen size.
- Enable browser reduced-motion preferences (`prefers-reduced-motion: reduce`) and verify that particle animations stop or follow user requirements.

### 3. Verification of Social Signal API
- Load the home page and check if counts update.
- Navigate to `/api/presence?place=truck-wala` and verify the JSON output contains `count`, `place`, and `timestamp`.
- Refresh and check if count varies slightly.

---

*Testing analysis: 2026-08-11*
