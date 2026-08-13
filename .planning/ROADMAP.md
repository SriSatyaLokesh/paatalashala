# Roadmap: Paatalashala

## Overview

The Paatalashala roadmap is structured to deliver themed, culturally immersive Telugu audio environments. We begin with Phase 1 by polishing and launching the **Tractor Anna** Telugu farmland environment. Phase 2 introduces the **Deluxe Saloon** barber shop experience alongside critical keyboard and motion accessibility controls. Phase 3 expands the platform by adding V2 OAuth playlist synchronization for Spotify and YouTube.

## Phases

- [x] **Phase 1: Tractor Anna Polish & Launch** - Fine-tune the farmland simulation and mobile-responsiveness for launch. (completed 2026-08-11)
- [x] **Phase 2: Thathayya Tape Recorder** - Implement the vintage veranda theme, grandfather background, and parse the nostalgic Telugu music playlist. (completed 2026-08-13)
- [x] **Phase 3: Ammama Radio** - Implement the grandma's rustic kitchen radio theme, cycle 3 custom background images, parse the Telugu playlist, display Veturi/lullaby lyrics, and hook self-healing unplayable skips. (completed 2026-08-13)
- [ ] **Phase 4: Meda Midha Vennallo** - Implement the terrace midnight space, clean and parse playlists, add starry village backgrounds, and configure page navigation.
- [ ] **Phase 5: Deluxe Saloon & Accessibility** - Integrate the retro barber shop theme and add keyboard and animation pausing controls.
- [ ] **Phase 6: Playlist Sync (V2 Integration)** - Build Spotify and YouTube OAuth integrations for playlist cloning.

---

## Phase Details

### Phase 1: Tractor Anna Polish & Launch

**Goal**: Polish the Telugu farmland environment (Tractor Anna) to ensure smooth visuals, farm road transitions, and full mobile usability.
**Depends on**: Nothing (first phase)
**Mode**: mvp
**Requirements**: PLAY-01, PLAY-02, PLAY-03, PLAY-04, PLAY-05, PLAY-06, ENV-01, ENV-02, ENV-03 (Tractor Anna), ENV-04, DATA-01, DATA-02, SOCL-01
**Success Criteria**:
  1. User can enter `/places/tractor-anna`, click START, and start high-energy playback with active progress tracking.
  2. The farmland container elements transition smoothly.
  3. Interactive elements scale gracefully on mobile.

**Plans**: 1 plan
- [x] 01-01: Adapt static data, build cartoonish farm and animated road visuals, and configure mobile card layouts. (completed)

### Phase 2: Thathayya Tape Recorder

**Goal**: Implement the Thathayya Tape Recorder veranda environment with a black and white grandpa background, a colored tape recorder player, and parse the nostalgic Telugu music playlist.
**Depends on**: Phase 1
**Mode**: mvp
**Requirements**: ENV-03 (Tape Recorder), DATA-01, DATA-02
**Success Criteria**:
  1. User can enter `/places/tape-recorder`, watch a beautiful responsive veranda background, and play classic Telugu melodies.
  2. The media player functions (play, pause, seek, volume, shuffle, queue, next/prev) work perfectly.
  3. Active listener counting is simulated or connected to Supabase Presence.

**Plans**: 1 plan
- [x] 02-01: Create parser, populate songs database, set up tape-recorder page layout, and integrate home page routing. (completed)

### Phase 3: Ammama Radio
 
**Goal**: Implement the Ammama Radio kitchen environment with 3 cycling background images, custom grandma/mother lyrics, and parse the YouTube playlist.
**Depends on**: Phase 2
**Mode**: mvp
**Requirements**: ENV-03 (Ammama Radio), DATA-01, DATA-02
**Success Criteria**:
  1. User can enter `/places/radio`, see a beautiful responsive village kitchen background, and play nostalgic radio tracks.
  2. The background cycles dynamically on song change.
  3. Lyrics of Veturi and popular lullabies are displayed in a clean container above the media player.
 
**Plans**: 1 plan
- [x] 03-01: Create parse script, save top 150 non-Tamil songs, set up radio page, implement background cycling, lyrics container, and home page routing. (completed 2026-08-13)

### Phase 4: Meda Midha Vennallo

**Goal**: Implement the Meda Midha Vennallo terrace midnight space, clean and parse playlists, add starry village backgrounds, and configure page navigation.
**Depends on**: Phase 3
**Mode**: mvp
**Requirements**: ENV-03 (Terrace), DATA-01, DATA-02
**Success Criteria**:
  1. User can enter `/spaces/vennallo`, see a beautiful starry night village terrace background, and play cozy midnight melodies.
  2. The background images cycle dynamically on song change.
  3. Cozy midnight lyrics are displayed on the media player.

**Plans**: 1 plan
- [ ] 04-01: Parse playlists, filter rhymes, add custom telugu songs, generate background illustrations, and build the space page.
 
### Phase 5: Deluxe Saloon & Accessibility
 
**Goal**: Implement the Deluxe Saloon Retro TV frame environment, matching animations, and add accessibility triggers.
**Depends on**: Phase 4
**Mode**: mvp
**Requirements**: ENV-03 (Saloon), ENV-05, ACC-01, ACC-02
**Success Criteria**:
  1. User can enter Deluxe Saloon, watching the YouTube video inside a retro TV frame.
  2. User can play/pause, seek, and control volume using standard keyboard shortcuts.
 
**Plans**: 2 plans
- [ ] 05-01: Polish Saloon page markup, TV glare reflections, ceiling fan animations, and tube light triggers.
- [ ] 05-02: Build keyboard listeners and particle freeze controls.
 
### Phase 6: Playlist Sync (V2 Integration)
 
**Goal**: Enable users to clone the curated playlist directly into their Spotify or YouTube account.
**Depends on**: Phase 5
**Requirements**: SYNC-01, SYNC-02
**Success Criteria**:
  1. User can trigger the OAuth login flows.
  2. The system successfully calls platform API endpoints to generate playlists.
 
**Plans**: 2 plans
- [ ] 06-01: Set up Next.js API endpoints for Spotify/Google OAuth.
- [ ] 06-02: Integrate Spotify and YouTube Data API endpoints.
 
---
 
## Progress
 
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6
 
| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Tractor Anna Polish & Launch | 1/1 | Complete    | 2026-08-11 |
| 2. Thathayya Tape Recorder | 1/1 | Complete    | 2026-08-13 |
| 3. Ammama Radio | 1/1 | Complete    | 2026-08-13 |
| 4. Meda Midha Vennallo | 0/1 | Planning    | - |
| 5. Deluxe Saloon & Accessibility | 0/2 | Not started | - |
| 6. Playlist Sync (V2 Integration) | 0/2 | Not started | - |
