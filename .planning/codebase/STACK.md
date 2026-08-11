# Technology Stack

**Analysis Date:** 2026-08-11

## Languages

**Primary:**
- JavaScript (ES6+) - All application logic, UI components, and API routes.
- CSS (Vanilla CSS) - Layouts, animations, and typography (via `src/app/globals.css`).

## Runtime

**Environment:**
- Node.js (v18+ or v20+ recommended for Next.js 16)
- Browser runtime - Main target for audio playback and rendering canvas-based ambient particle systems.

**Package Manager:**
- npm
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- Next.js 16.3.0 (App Router) - Server-side rendering, routing, API routes, and page optimization.
- React 19.2.8 - Component architecture, UI state, and side effects.

**Testing:**
- None configured in the codebase currently (no test runners or tests found).

**Build/Dev:**
- Next.js built-in bundler/compiler (SWC/webpack).

## Key Dependencies

**Critical:**
- `lucide-react` (v1.31.0) - Iconography library for UI controls and overlays.

**Infrastructure:**
- YouTube IFrame Player API - Third-party player integration for audio/video streaming (loaded dynamically from `https://www.youtube.com/iframe_api`).

## Configuration

**Environment:**
- Uses standard Next.js environment configurations (if any) - none strictly required for the current MVP mockup.

**Build:**
- `next.config.mjs` - Next.js configuration.
- `jsconfig.json` - Path alias mappings (`@/*` to `src/*`).
- `eslint.config.mjs` - ESLint linter configuration.

## Platform Requirements

**Development:**
- Any platform with Node.js support (Windows/macOS/Linux).

**Production:**
- Optimized for deployment on Vercel or equivalent static/serverless hosting platforms.

---

*Stack analysis: 2026-08-11*
