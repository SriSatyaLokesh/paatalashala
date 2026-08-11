# Requirements: Paatalashala

**Defined:** 2026-08-11
**Core Value:** Recreate the exact feeling of "being there" in familiar Telugu environments where music is naturally playing, through seamless cultural curation and subtle ambient environmental dynamics.

## v1 Requirements

Requirements for the initial release. Satisfied requirements from the existing brownfield codebase are marked as complete.

### Playback Experience (PLAY)

- [x] **PLAY-01**: User must click an explicit **[ START ]** button before playback begins, ensuring browser autoplay permissions are acquired.
- [x] **PLAY-02**: The official YouTube video player remains embedded and visible on the page (no fake/hidden custom players).
- [x] **PLAY-03**: Playback progresses sequentially through the curated playlist, automatically advancing to the next song when the active song ends.
- [x] **PLAY-04**: Displays active song metadata (Title, Movie, Year, Singer, Music Director).
- [x] **PLAY-05**: User can play/pause, skip, restart, volume-adjust, and seek using client controllers.
- [x] **PLAY-06**: Mobile layouts prevent clipping, keeping media buttons overlay-safe and bottom-aligned for thumb usability.

### Ambient Environment (ENV)

- [x] **ENV-01**: The screen's background color gradient transitions smoothly when the song changes, matching the song's ambient config (e.g., warm sunset, deep night).
- [x] **ENV-02**: Particle layers (stars, rain, mist, dust-motes) render on an HTML5 canvas layer above the background, moving dynamically based on active song weather definitions.
- [x] **ENV-03**: Supports independent theme layouts:
  - **Tractor Anna**: Farmland perspective.
  - **Deluxe Saloon**: Player embedded inside a retro television frame.
- [x] **ENV-04**: Tractor Anna farmland visuals support moving road markings, cloud drifts, and headlight flares on sunset/night transition.
- [ ] **ENV-05**: Deluxe Saloon visuals support a rotating ceiling fan animation, flickering tube lights, and dynamic TV screen glare matching active play states.

### Music Curation & Metadata (DATA)

- [x] **DATA-01**: Playlists and locations are curated editorially to match places (e.g., high-energy mass highway tracks for Tractor Anna).
- [x] **DATA-02**: Displays outbound destinations (links to official YouTube video and Spotify track).

### Social Signals & Presence (SOCL)

- [x] **SOCL-01**: Displays mock real-time presence counts (e.g., "83 on the road", "41 in the saloon") that fluctuate using time-based variance.

### Accessibility & Controls (ACC)

- [ ] **ACC-01**: Supports standard keyboard shortcuts (Space for play/pause, M for mute/unmute, left/right arrows for seek, up/down arrows for volume).
- [ ] **ACC-02**: Supports a clear "Pause Ambience" button to freeze canvas animations, respecting `prefers-reduced-motion` settings.

---

## v2 Requirements

Deferred to future releases.

### Playlist Synchronization

- **SYNC-01**: Add current curated playlist directly to user's Spotify library via OAuth.
- **SYNC-02**: Add current curated playlist directly to user's YouTube library via OAuth.

### Platform Expansion

- **PLAT-01**: Introduce "Auto Raja" city traffic environment.
- **PLAT-02**: Introduce "Nook Tea Stall" misty morning chai environment.
- **PLAT-03**: Introduce "RTC Bus" local travel window seat perspective.

---

## Out of Scope

| Feature | Reason |
|---------|--------|
| Copyrighted Audio Hosting | Audio must be streamed from official YouTube uploads to comply with copyright regulations. |
| User Profile Accounts | Not core to the nostalgic listening experience; increases database and security overhead. |
| Search Catalogs | Avoid duplicating general-purpose music player functions (e.g., search, recommendations). |

---

## Traceability

*Traceability mapping will be populated after roadmap creation.*

| Requirement | Phase | Status |
|-------------|-------|--------|
| PLAY-01 | Phase 1 | Complete |
| PLAY-02 | Phase 1 | Complete |
| PLAY-03 | Phase 1 | Complete |
| PLAY-04 | Phase 1 | Complete |
| PLAY-05 | Phase 1 | Complete |
| PLAY-06 | Phase 1 | Complete |
| ENV-01 | Phase 1 | Complete |
| ENV-02 | Phase 1 | Complete |
| ENV-03 | Phase 1 | Complete |
| ENV-04 | Phase 1 | Complete |
| ENV-05 | Phase 2 | Pending |
| DATA-01 | Phase 1 | Complete |
| DATA-02 | Phase 1 | Complete |
| SOCL-01 | Phase 1 | Complete |
| ACC-01 | Phase 2 | Pending |
| ACC-02 | Phase 2 | Pending |

**Coverage:**

- v1 requirements: 16 total
- Mapped to phases: 16
- Unmapped: 0 ✓

---
*Requirements defined: 2026-08-11*
*Last updated: 2026-08-11 after initial definition*
