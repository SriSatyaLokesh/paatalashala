---
gsd_plan_version: '1.0'
phase: '01'
name: 'Tractor Anna Polish & Launch'
files_modified:
  - src/data/places.js
  - src/data/songs.js
  - src/app/places/tractor-anna/page.js
must_haves:
  truths:
    - "User can enter /places/tractor-anna, click START, and start audio playback"
    - "The blue tractor with driver and kids sprite is visible in the foreground"
    - "The farmland background art transitions smoothly (1.2s crossfade) and weather particles fade appropriately"
    - "CSS animated lane lines translate continuously representing road speed"
    - "On mobile screens (<768px), layout utilizes Floating Card design with player card overlay at the bottom"
  artifacts:
    - path: "src/data/places.js"
      provides: "Tractor Anna place metadata"
    - path: "src/data/songs.js"
      provides: "Tractor Anna place song configurations"
    - path: "src/app/places/tractor-anna/page.js"
      provides: "Tractor Anna interactive environment page"
  key_links:
    - from: "src/app/places/tractor-anna/page.js"
      to: "src/data/songs.js"
      via: "imports getSongsForPlace to load tractor-anna tracks"
      pattern: "getSongsForPlace\\('tractor-anna'\\)"
---

# Plan 01: Tractor Anna Polish & Launch

## Objective

Pivot the first environment from "Truck Wala" to "Tractor Anna", introducing rural farmland assets (farmland fields, animated dirt road lanes, and tractor foreground sprite) and implementing mobile layout enhancements and smoother crossfades.

## Context

- PRD: [paatalashala-prd.md](file:///d:/professional/code/SriSatyaLokesh/paatalashala/docs/paatalashala-prd.md)
- Context: [.planning/phases/01-truck-wala-polish-launch/01-CONTEXT.md](file:///d:/professional/code/SriSatyaLokesh/paatalashala/.planning/phases/01-truck-wala-polish-launch/01-CONTEXT.md)
- Existing layout: [src/app/places/truck-wala/page.js](file:///d:/professional/code/SriSatyaLokesh/paatalashala/src/app/places/truck-wala/page.js)

## Tasks

### Task 1: Rename Directories & Update Static Data
**Type**: auto
**Description**: Rename the Truck Wala route files and update place metadata to bind the "Tractor Anna" theme correctly.
**Action**:
- Rename `src/app/places/truck-wala` directory to `src/app/places/tractor-anna`.
- Modify `src/data/places.js` to change the `truck-wala` object:
  - `id` & `slug`: "tractor-anna"
  - `name`: "Tractor Anna"
  - `tagline`: "Telugu farmland driving vibes"
  - `emoji`: "🚜"
  - `description`: "Riding alongside green crop fields and ploughed farming land on a rustic tractor with rural mass folk beats."
- Modify `src/data/songs.js` to replace all `place: "truck-wala"` values with `place: "tractor-anna"`. Also update song ambience backgrounds to use public farm images:
  - `sunset-highway`: `/images/sunset_farm_background.png`
  - `night-highway`: `/images/night_farm_background.png`
  - `rainy-highway`: `/images/rainy_farm_background.png`
  - `morning-highway`: `/images/morning_farm_background.png`
**Verify**:
- Command: `node -e "const p = require('./src/data/places.js').PLACES; if (!p.find(x => x.id === 'tractor-anna')) throw new Error('places.js missing tractor-anna');"`
- Command: `node -e "const s = require('./src/data/songs.js').SONGS; if (s.find(x => x.place === 'truck-wala')) throw new Error('songs.js still contains truck-wala reference');"`

### Task 2: Implement Farmland & Tractor Scene Visuals
**Type**: auto
**Description**: Refactor `src/app/places/tractor-anna/page.js` to render the farmland backgrounds, the foreground tractor sprite, and CSS animated road lane markings.
**Action**:
- Edit `src/app/places/tractor-anna/page.js` to load Tractor Anna assets.
- Replace the perspective highway layout (the `clipPath: polygon(...)` road) with a farm road and foreground tractor:
  - Render a container for the road running along the bottom/side.
  - Position the `/images/tractor_anna_sprite.png` asset in the foreground. Apply a subtle float animation (`vehicle-float` keyframes) to simulate tractor engine vibration.
  - Render lane markings using SVG/PNG line templates and animate them horizontally/diagonally using CSS translations to simulate movement based on the track's `roadSpeed`.
**Verify**:
- Command: `node -e "const fs = require('fs'); const content = fs.readFileSync('./src/app/places/tractor-anna/page.js', 'utf8'); if (!content.includes('/images/tractor_anna_sprite.png')) throw new Error('page.js missing tractor sprite source');"`

### Task 3: Mobile Floating Card Layout & Crossfade transitions
**Type**: auto
**Description**: Adjust stylesheets, responsive layout templates, and opacity transition timers for a premium mobile experience.
**Action**:
- Edit `src/app/places/tractor-anna/page.js` to change layout:
  - Background image transition: update opacity fade to `1.2s ease` matching decision D-07.
  - CSS animations: ensure the page component overlays are structured correctly for mobile devices.
  - Mobile Styles: Add media query rules to stack the player container and controls card as a glassmorphic floating overlay card (`glass-panel`) sitting at the bottom of the viewport on screens `<768px`.
**Verify**:
- Command: `node -e "const fs = require('fs'); const content = fs.readFileSync('./src/app/places/tractor-anna/page.js', 'utf8'); if (!content.includes('1.2s')) throw new Error('transition timing does not match 1.2s crossfade');"`

### Task 4: Functional Verification
**Type**: checkpoint:human-verify
**Description**: Validate the interactive playback, visual animations, and mobile stacking on a live browser tab.
**Action**:
- Boot the Next.js dev server: `npm run dev`.
- Open `http://localhost:3000/places/tractor-anna`.
- Verify:
  - Clicking **START** loads the player, starts audio, and displays the tractor sprite vibrating over the farmland background.
  - Resizing the browser window to mobile width stacks controls as a bottom floating card overlay.
  - Song transitions trigger a smooth crossfade of background farm illustrations and rain/star particle canvas fades.
