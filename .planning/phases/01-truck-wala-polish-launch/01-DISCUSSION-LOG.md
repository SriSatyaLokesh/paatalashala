# Phase 1: Truck Wala Polish & Launch - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-08-11
**Phase:** 01-Truck Wala Polish & Launch
**Areas discussed:** Highway Visuals & Road Motion, Mobile Responsive Layout, Transition Speed & Timing, MVP Theme Pivot

---

## MVP Theme Pivot

**User's choice:** Swapped "Truck Wala" theme for "Tractor Anna" (tractor on green farmland, farming land, ploughed land; cartoonish/anime comic aesthetic; user curates playlist).
**Notes:** Swapped the primary theme to Tractor Anna as it fits rural Telugu vibes and is more common than heavy trucks.

---

## Highway Visuals & Road Motion

| Option | Description | Selected |
|--------|-------------|----------|
| CSS Animations | Smooth 2D lane-line translation (highly performant on mobile, uses custom keyframes in globals.css) | ✓ |
| HTML5 Canvas road rendering | Draw lines dynamically in the AmbientWeather canvas | |
| Static road | Keep the road background static and rely solely on rain/stars/fog motion to convey speed | |

**User's choice:** CSS Animations using SVG or PNG assets for the 2D lane lines and markings.
**Notes:** Performant on mobile and simple to implement using keyframes.

---

## Mobile Responsive Layout

| Option | Description | Selected |
|--------|-------------|----------|
| Floating Card Layout | Farmland background occupies the full viewport; player controls and YouTube player float as a glassmorphism overlay at the bottom | ✓ |
| Stacked Split Layout | Cartoon tractor view at the top (40% height) with the player, controls and queue scrollable below it | |
| Minimal Player HUD | Focus entirely on the tractor artwork and controls; hide the playlist queue behind a menu button | |

**User's choice:** Floating Card Layout.
**Notes:** Maximizes background artwork visibility while offering a clean, modern glassmorphic card for overlays.

---

## Transition Speed & Timing

| Option | Description | Selected |
|--------|-------------|----------|
| Smooth 1.2s Crossfade | CSS transitions on the background art with a 1.2s fade-in/out for the canvas weather particles | ✓ |
| Instant swap | Change background art instantly, but fade particles slowly (0.8s) | |
| Slow environmental fade (2.0s) | Very gradual, slow-paced transition matching the speed of a tractor | |

**User's choice:** Smooth 1.2s Crossfade.
**Notes:** Smooth transitions prevent screen flickers and visual jarring.

---

## Claude's Discretion
- Choice of specific CSS class names, container structuring, and performance adjustments for canvas animations.

---

## Deferred Ideas
- Tractor Anna playlist curation - deferred to the user.
