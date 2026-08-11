# Phase 1: Truck Wala Polish & Launch - Context

**Gathered:** 2026-08-11
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase delivers the visual aesthetics, road motion animations, mobile layout responsiveness, and crossfade transitions for the first MVP environment. While named "Truck Wala" in the initial roadmap, it is being pivoted to the **Tractor Anna** theme.

</domain>

<decisions>
## Implementation Decisions

### MVP Branding Pivot (Tractor Anna)
- **D-01:** Swap the "Truck Wala" theme for **Tractor Anna**.
- **D-02:** Visual elements will depict a tractor on a green field/farm road alongside crop and ploughing lands, using a cartoonish/anime comic-style illustration.
- **D-03:** Curation of the tractor playlists is fully deferred to the user.

### Highway Visuals & Road Motion
- **D-04:** Use SVG or PNG assets for the 2D lane lines and road markings.
- **D-05:** Animate the road markings using CSS keyframe translations for maximum mobile performance.

### Mobile Responsive Layout
- **D-06:** Apply the **Floating Card Layout**. The cartoonish farmland background occupies the full viewport, and the player controls + YouTube iframe float as a glassmorphic overlay card at the bottom.

### Transition Speed & Timing
- **D-07:** Apply a **Smooth 1.2s Crossfade** using CSS opacity/background transitions, alongside a 1.2s fade-in/fade-out for the HTML5 canvas weather particles.

### Claude's Discretion
- Choice of specific CSS class names, container structuring, and performance adjustments for canvas animations.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Product Specs
- `docs/paatalashala-prd.md` — Defines overall project vision, goals, and layout requirements.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/YouTubePlayer.js`: Wraps YouTube IFrame player APIs, tracking play/pause state and volume changes.
- `src/components/AmbientWeather.js`: HTML5 canvas rendering engine for rain, stars, fog, and dust-motes.
- `src/components/NowPlaying.js` / `src/components/UpNext.js`: Media interface controller and playlist queue components.

### Established Patterns
- Client-side React page state syncing with the YouTube IFrame player reference.
- Dynamic body background gradient adjustments triggered on song change.

### Integration Points
- `src/app/places/truck-wala/page.js`: To be renamed and refactored into the new cartoonish Tractor Anna field layout using floating overlays and CSS animated lane SVGs.

</code_context>

<specifics>
## Specific Ideas
- The environment should look like a cartoon/anime style farm road.
- One common tractor asset in the foreground, with scrolling fields/road lines alongside it.

</specifics>

<deferred>
## Deferred Ideas
- Tractor Anna playlist curation - deferred to the user.

</deferred>

---
*Phase: 01-Truck Wala Polish & Launch*
*Context gathered: 2026-08-11*
