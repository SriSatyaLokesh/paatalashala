# Architecture

**Analysis Date:** 2026-08-11

## Pattern Overview

**Overall:** Next.js Client-Side Rendered (SPA-like) Client Components with API Route for Ambient Social Presence.

**Key Characteristics:**
- **Dynamic CSS Ambient Styling:** The environment's background, lighting, and movement speed change in sync with the active song's ambient config.
- **Dynamic HTML5 Canvas Effects:** Custom particle simulations (rain, stars, fog, dust motes) rendered via HTML5 canvas, responsive to browser resizing.
- **Third-Party IFrame Integration:** Plays music through the official YouTube IFrame Player API.
- **Client-Driven State:** Player controls, volume, seeking, and queue progression are managed using standard React state hooks.

## Layers

**UI Pages (Entry Points):**
- **Home page (`src/app/page.js`):** Landing page showcasing available "places" and their active listener counts.
- **Places pages (`src/app/places/`):** Specific, highly themed environments (e.g., `truck-wala`, `saloon`) containing layout templates, local state, and environment-specific aesthetics.

**Ambient Components (`src/components/`):**
- `YouTubePlayer.js`: Wraps the YouTube IFrame API and exposes handlers for play, pause, volume sync, and progress tracking.
- `NowPlaying.js`: Displays song metadata, playback timers, control buttons (play/pause, skip, prev), volume slider, and outbound destination links.
- `UpNext.js`: Renders the scrollable queue/playlist of curated songs.
- `AmbientWeather.js`: HTML5 canvas rendering engine for ambient particles (rain, stars, fog, dust).

**Data Layer (`src/data/`):**
- Static, structured objects (`places.js`, `songs.js`) serving as the source of truth for the curated playlists and visual configurations.

**API Layer (`src/app/api/`):**
- Next.js API route (`src/app/api/presence/route.js`) serving mock listener counts with dynamic fluctuations based on standard time-based variance.

## Data Flow

**Music Playback & Ambience Flow:**
1. User navigates to `/places/truck-wala` and clicks **[ START ]**.
2. React state `isExperienceStarted` changes to `true`, triggering:
   - Dynamic document body background transition to `currentSong.ambience.background`.
   - Initial loading of the `YouTubePlayer` IFrame.
3. YouTube player transitions state to `PLAYING` (code `1`), starting the progress tracking interval (every 500ms) in `YouTubePlayer.js`.
4. Progress updates bubble up to page-level state via `onTimeUpdate` to update the slider and timer displays.
5. When a song finishes (state code `0`), `handleNext` is triggered, advancing the `currentSongIndex`.
6. Ambience properties (weather, particles, background) transition smoothly based on the new song's metadata.

**State Management:**
- Application state is localized to page components (e.g., `TruckWala()`) and passed down to child components as props.
- API updates (e.g., presence counts) are fetched periodically via `setInterval`.

## Key Abstractions

**Ambience Config (`src/data/songs.js`):**
- Each song is paired with an `ambience` object detailing:
  - `background`: CSS gradients.
  - `weather`: Particle flags (`rain`, `misty`, `clear`).
  - `particles`: Star or dust overlays.
  - `roadSpeed`: Speed animations.
  - `visualEffects`: Layout cues (wipers, clouds, reflections).

## Entry Points

- `src/app/page.js` - Global entry point (home page).
- `src/app/places/truck-wala/page.js` - Truck Wala highway experience.
- `src/app/places/saloon/page.js` - Retro Saloon barber shop experience.

## Error Handling

- **API Fallbacks:** If the presence API call fails, the client falls back to baseline counts hardcoded per place in `page.js` (e.g., 83 for truck-wala, 41 for saloon).
- **YouTube Safety:** IFrame operations are wrapped in safe property checks (e.g., `typeof playerObject.seekTo === 'function'`) to prevent crashes during player load.

---

*Architecture analysis: 2026-08-11*
