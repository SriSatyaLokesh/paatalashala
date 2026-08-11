# Codebase Concerns

**Analysis Date:** 2026-08-11

## Tech Debt

**Inline Styles for Aesthetic Complexity:**
- **Issue:** Visual styling and responsive parameters are heavily coded as inline JS style objects in the main layout files rather than being separated into modular CSS classes.
- **Files:** `src/app/places/truck-wala/page.js` and `src/app/places/saloon/page.js`.
- **Impact:** Harder to manage responsiveness, media queries, and themes. Adding new locations will duplicate styling code.
- **Fix approach:** Extract common container definitions, layouts, and cards into modular CSS classes or utility rules in `src/app/globals.css`.

**Static Data Hardcoding:**
- **Issue:** Songs and places configurations are hardcoded into static JavaScript arrays (`src/data/songs.js`, `src/data/places.js`).
- **Impact:** Scale limits are low. Editing song queues requires editing source files directly.
- **Fix approach:** In future iterations, move the songs metadata and places profiles to a local database (e.g., PostgreSQL) or fetch them from a headless CMS.

## Known Bugs

**Browser Autoplay Interception:**
- **Symptoms:** Occasional silent player initialization if the browser's autoplay permissions are extremely strict, despite the "START" interaction page.
- **Trigger:** Browser window tab has not had any prior clicks, or browser setting disables all autoplay media.
- **Workaround:** User must click the play button inside the YouTube IFrame player itself.
- **Root cause:** Native browser safety constraints around media.

## Security Considerations

**API Key Exposure Risk:**
- **Risk:** If Spotify OAuth or YouTube Data APIs are integrated (V2 goals) directly client-side, API credentials could be exposed to the client.
- **Recommendations:** Ensure all OAuth token exchanges and playlist writes are proxied through Next.js server-side API routes, storing secrets securely in environment variables.

## Performance Bottlenecks

**YouTube IFrame Load Lag:**
- **Problem:** Dynamic loading of the YouTube API script and IFrame creation on "START" click can lead to a visual delay (1-2s) before playback begins.
- **Measurement:** ~1.5s p95 load latency on standard broadband.
- **Cause:** Third-party script execution and document nesting.
- **Improvement path:** Preconnect to `https://www.youtube.com` and preload the IFrame player in the background (hidden) on first page load before the user clicks START.

## Fragile Areas

**YouTube API Object Syncing:**
- **File:** `src/components/YouTubePlayer.js`.
- **Why fragile:** Hooking global window events (such as `window.onYouTubeIframeAPIReady`) in a React component is prone to race conditions if multiple player instances are mounted or during hot-reloads.
- **Safe modification:** Ensure proper ref tracking for the script element and clean up global hooks on component unmount.

---

*Concerns audit: 2026-08-11*
