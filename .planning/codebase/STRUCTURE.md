# Codebase Structure

**Analysis Date:** 2026-08-11

## Directory Layout

```
paatalashala/
├── docs/                      # Product requirement documents and PRDs
├── public/                    # Static assets (images, icons)
├── src/                       # Application source code
│   ├── app/                   # Next.js App Router directories
│   │   ├── api/               # API routes (presence)
│   │   ├── places/            # Specific place routes (truck-wala, saloon)
│   │   ├── globals.css        # Global CSS stylesheet, variables, animations
│   │   ├── layout.js          # Main HTML frame wrapper
│   │   └── page.js            # Home page (place selection grid)
│   ├── components/            # Shared React components
│   └── data/                  # Static song and place configurations
├── next.config.mjs            # Next.js settings
├── package.json               # Dependencies and scripts
└── jsconfig.json              # Path aliases Configuration
```

## Directory Purposes

**docs/**
- Purpose: Contains product spec guides and documentation.
- Key files: `paatalashala-prd.md` (the product requirements document).

**src/app/**
- Purpose: Application routing and pages.
- Contains: Next.js pages, layouts, and global styles.

**src/app/api/presence/**
- Purpose: Endpoint serving listener metrics.
- Key files: `route.js` (time-variance mock API handler).

**src/app/places/**
- Purpose: Theme-specific digital environments.
- Subdirectories:
  - `truck-wala/`: The Telugu highway experience page (`page.js`).
  - `saloon/`: The retro barber shop experience page (`page.js`).

**src/components/**
- Purpose: Reusable UI widgets and playback modules.
- Key files:
  - `YouTubePlayer.js`: YouTube API loader and handler.
  - `NowPlaying.js`: Main metadata and media controller.
  - `UpNext.js`: Visual song queue manager.
  - `AmbientWeather.js`: HTML5 canvas rendering script.

**src/data/**
- Purpose: Static data config.
- Key files:
  - `places.js`: Place definitions (slug, tagline, emoji, active state).
  - `songs.js`: Track listings and theme metadata definitions.

## Key File Locations

**Entry Points:**
- `src/app/page.js`: Global root page (place selection screen).
- `src/app/places/truck-wala/page.js`: Highway simulator entry point.
- `src/app/places/saloon/page.js`: Saloon simulator entry point.

**Configuration:**
- `next.config.mjs`: Core Next.js compiler parameters.
- `jsconfig.json`: Path configuration (binds `@/*` to `src/*`).
- `src/app/globals.css`: Base visual framework (color vars, layout classes).

## Naming Conventions

**Files:**
- React components: PascalCase.js (e.g., `YouTubePlayer.js`).
- Next.js Router files: standard lower-case matching Next.js routing patterns (e.g., `page.js`, `layout.js`, `route.js`).
- Data files: lower-case plural nouns (e.g., `places.js`, `songs.js`).

**Directories:**
- URL routes: lower-case kebab-case (e.g., `places/truck-wala`).

## Where to Add New Code

**Adding a New Place (e.g. Auto):**
1. Add the place profile object into `src/data/places.js` (with active set to `true`).
2. Add the place's song collection and ambient weather configs into `src/data/songs.js`.
3. Create a new directory under `src/app/places/` (e.g., `src/app/places/auto/`).
4. Write `page.js` inside that folder, defining the themed container, layout structure, and unique UI elements (e.g., dashboard, windshield outline).

**Adding a Global UI Component:**
- Create a new PascalCase file in `src/components/` and import it into pages as needed.

---

*Structure analysis: 2026-08-11*
