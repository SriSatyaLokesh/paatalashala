# Paatalashala

## What This Is

Paatalashala is a collection of lightweight, immersive web experiences that represent the music and atmosphere associated with familiar Telugu cultural places and situations (such as truck driving on a highway, a local barber shop, a tea stall, or an auto ride). It combines editorially curated Telugu playlists, dynamic environmental atmospheres, and simulated social presence using the official YouTube Player API.

## Core Value

To recreate the exact feeling of "being there" in familiar Telugu environments where music is naturally playing, through seamless cultural curation and subtle ambient environmental dynamics.

## Requirements

### Validated

- ✓ **Place Selection Landing Page** - Grid layout showing available environments (active and coming soon) with live listener counts (`src/app/page.js`).
- ✓ **YouTube IFrame API Integration** - Standard player embedded directly inside themed containers (`src/components/YouTubePlayer.js`).
- ✓ **Now Playing Controller** - Media indicators (timers, title, movie, artists, music director) and controls (play/pause, skip, volume slider, seek bar) synced to the player (`src/components/NowPlaying.js`).
- ✓ **Up Next Queue** - Renders the scrollable track queue, allowing users to jump directly to any track (`src/components/UpNext.js`).
- ✓ **Ambient Particle Canvas** - HTML5 canvas-rendered particle engine managing weather effects (rain, stars, fog, dust-motes) matching song ambience (`src/components/AmbientWeather.js`).
- ✓ **Dynamic CSS Ambience Transitions** - Page backgrounds and element styles transition smoothly as tracks change.
- ✓ **Social Signal (Presence API)** - Endpoint serving mock listener counts with dynamic time-based variance (`src/app/api/presence/route.js`).
- ✓ **Truck Wala Place** - Fully structured highway container supporting sunset, night, rain, and misty morning ambient states (`src/app/places/truck-wala/page.js`).
- ✓ **Deluxe Saloon Place** - Themed barber shop container integrating the player inside a retro TV frame (`src/app/places/saloon/page.js`).

### Active

- [ ] **Polishing Truck Wala Experience** - Fine-tuning highway visuals, road animations, windshield wipers, and dusk/dawn headlight flares to create a premium, immersive drive.
- [ ] **Polishing Deluxe Saloon Experience** - Enhancing TV frame flicker, mirror reflections, rotating ceiling fan animations, and vintage lighting changes.
- [ ] **Accessibility Controls** - Support for keyboard shortcuts (Space for play/pause, M for mute, arrow keys), visible focus outlines, and responsive pause buttons for particle animations (prefers-reduced-motion).
- [ ] **Spotify & YouTube Outbound Integrations** - Connect external links to original tracks, and eventually support V2 features like playlist creation.

### Out of Scope

- **Direct Music Hosting** - Hosting, distributing, or proxying copyrighted audio files (done strictly via official YouTube embeds).
- **User Accounts** - Storing user profiles, custom playlists, or algorithmic recommendations.
- **General-Purpose Streaming** - Competing with Spotify or YouTube on catalog search or recommendation systems.

## Context

- **Current Architecture**: Built on Next.js 16 (App Router) and React 19, utilising vanilla CSS variables and inline JSX styles.
- **Curation Focus**: Curation is human-first and editorially driven. Songs must evoke a specific cultural place and time (e.g., songs a Telugu truck driver would play on a long drive).
- **Client Playback**: autoplay constraints require explicit user interaction (a "START" screen) before loading the player API.

## Constraints

- **Platform Terms**: Must adhere strictly to YouTube IFrame API developer terms (e.g., the embedded player must remain visible and unobstructed).
- **Copyright Policy**: Cannot copy, store, or modify copyrighted source streams.
- **Performance**: Canvas-rendered weather effects must remain lightweight to avoid blocking page execution loops on mobile devices.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| YouTube Player Embed | Complies with copyright guidelines and uses official streams | — Pending |
| Canvas-Based Particles | Allows lightweight, customizable weather effects (rain, stars, fog) without loading heavy video assets | — Pending |
| Interaction-based Start | Bypasses modern browser autoplay blocks on unmuted media | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-08-11 after initialization*
