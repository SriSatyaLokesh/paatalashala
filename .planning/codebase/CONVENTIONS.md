# Coding Conventions

**Analysis Date:** 2026-08-11

## Naming Patterns

**Files:**
- React components: PascalCase.js (e.g., `NowPlaying.js`, `AmbientWeather.js`).
- Next.js core files: lower-case (e.g., `page.js`, `layout.js`, `route.js`).
- Static Data: lower-case (e.g., `songs.js`, `places.js`).

**Functions:**
- camelCase for functions (e.g., `handlePlayPauseToggle`, `getSongsForPlace`).
- Component functions use PascalCase (matching filename).

**Variables:**
- camelCase for variables (e.g., `currentSongIndex`, `presenceCount`).
- UPPER_SNAKE_CASE for constant lists (e.g., `PLACES`, `SONGS`, `BASE_COUNTS`).

## Code Style

**Formatting:**
- Standard Next.js/JavaScript spacing.
- Semicolons used consistently.
- 2-space indentation.
- Double quotes or single quotes used interchangeably, but single quotes preferred in source files.

**Styling/CSS:**
- **Inline Styling:** Visual elements (margins, positions, grid layouts) are declared directly in React components using JSX `style={{...}}` properties.
- **Global CSS Utility Classes:** CSS variables, animations (`fan-spin`, `wiper-wipe`), and base containers are written in `src/app/globals.css` and applied via `className` (e.g., `glass-panel`, `player-card`).

## Import Organization

**Order:**
1. React Hooks (`useState`, `useEffect`, `useRef`).
2. Next.js modules (`Link`, `Image`).
3. External modules / Icons (`lucide-react`).
4. Data modules (`@/data/songs`, `@/data/places`).
5. Common UI Components (`@/components/...`).
6. Stylesheets.

**Path Aliases:**
- `@/*` maps directly to `src/*` (configured in `jsconfig.json`).
- Relative paths (e.g., `./`, `../`) used for close local structures.

## Error Handling

**Strategy:**
- **Graceful degradation:** If external interfaces fail (e.g., API requests, browser autoplay limits), the application falls back to safe states or displays manual triggers rather than crashing.
- **Autoplay Mitigation:** Autoplay restrictions are bypassed by forcing the user to interact (click **[ START ]**) to initial player load.
- **Reference Safety checks:** Methods on volatile objects (like `playerObject`) must be checked before calling (e.g., `if (playerObject && typeof playerObject.seekTo === 'function')`).

## Comments

**When to Comment:**
- Explain visual rendering structures (e.g., canvas coordinates, rain calculations in `AmbientWeather.js`).
- State synchronizations (e.g., handling player states, API intervals).

---

*Convention analysis: 2026-08-11*
