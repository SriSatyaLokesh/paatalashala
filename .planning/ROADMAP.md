# Roadmap: Paatalashala

## Overview

The Paatalashala roadmap is structured to deliver themed, culturally immersive Telugu audio environments. We begin with Phase 1 by polishing and launching the **Truck Wala** Telugu highway environment. Phase 2 introduces the **Deluxe Saloon** barber shop experience alongside critical keyboard and motion accessibility controls. Phase 3 expands the platform by adding V2 OAuth playlist synchronization for Spotify and YouTube.

## Phases

- [ ] **Phase 1: Truck Wala Polish & Launch** - Fine-tune the highway simulation and mobile-responsiveness for launch.
- [ ] **Phase 2: Deluxe Saloon & Accessibility** - Integrate the retro barber shop theme and add keyboard and animation pausing controls.
- [ ] **Phase 3: Playlist Sync (V2 Integration)** - Build Spotify and YouTube OAuth integrations for playlist cloning.

---

## Phase Details

### Phase 1: Truck Wala Polish & Launch
**Goal**: Polish the Telugu highway environment (Truck Wala) to ensure smooth visuals, dawn/dusk lighting transitions, and full mobile usability.
**Depends on**: Nothing (first phase)
**Mode**: mvp
**Requirements**: PLAY-01, PLAY-02, PLAY-03, PLAY-04, PLAY-05, PLAY-06, ENV-01, ENV-02, ENV-03 (Truck Wala), ENV-04, DATA-01, DATA-02, SOCL-01
**Success Criteria**:
  1. User can enter `/places/truck-wala`, click START, and start high-energy playback with active progress tracking.
  2. The highway container elements (road markings, cloud drifts, horizon changes) transition smoothly along with canvas particles.
  3. Interactive elements and media overlays scale gracefully on mobile screens without clipping the YouTube player.
**Plans**: 2 plans

Plans:
- [ ] 01-01: Fine-tune highway visual assets, road speed transitions, and dawn/dusk headlight glare.
- [ ] 01-02: Adapt mobile responsive stylesheets and layout grids for overlay-safe boundaries.

### Phase 2: Deluxe Saloon & Accessibility
**Goal**: Implement the Deluxe Saloon Retro TV frame environment, matching animations, and add accessibility triggers.
**Depends on**: Phase 1
**Mode**: mvp
**Requirements**: ENV-03 (Saloon), ENV-05, ACC-01, ACC-02
**Success Criteria**:
  1. User can enter Deluxe Saloon, watching the YouTube video inside a retro TV frame with ceiling fan rotations and tube light flickers.
  2. User can play/pause, seek, and control volume using standard keyboard shortcuts.
  3. User can toggle canvas weather animations off via an ambient control panel, or the system does so automatically on detecting system reduced-motion preferences.
**Plans**: 2 plans

Plans:
- [ ] 02-01: Polish Saloon page markup, TV glare reflections, ceiling fan animations, and tube light triggers.
- [ ] 02-02: Build keyboard listeners and particle freeze controls.

### Phase 3: Playlist Sync (V2 Integration)
**Goal**: Enable users to clone the curated playlist directly into their Spotify or YouTube account.
**Depends on**: Phase 2
**Requirements**: SYNC-01, SYNC-02
**Success Criteria**:
  1. User can trigger the OAuth login flows for Spotify and Google/YouTube from the interface.
  2. The system successfully calls platform API endpoints to generate a new playlist containing the curated track IDs.
**Plans**: 2 plans

Plans:
- [ ] 03-01: Set up Next.js API endpoints for Spotify/Google OAuth session management.
- [ ] 03-02: Integrate Spotify and YouTube Data API endpoints for playlist generation.

---

## Progress

Phases execute in numeric order: 1 → 2 → 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Truck Wala Polish & Launch | 0/2 | Not started | - |
| 2. Deluxe Saloon & Accessibility | 0/2 | Not started | - |
| 3. Playlist Sync (V2 Integration) | 0/2 | Not started | - |
