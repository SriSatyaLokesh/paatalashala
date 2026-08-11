# External Integrations

**Analysis Date:** 2026-08-11

## APIs & External Services

**Music / Video Playback:**
- **YouTube IFrame Player API** - Used for streaming the audio and video of curated Telugu songs.
  - SDK/Client: Direct script injection of `https://www.youtube.com/iframe_api`.
  - Auth: None (publicly accessible embeds).
  - Implementation: Embedded IFrame rendered via `src/components/YouTubePlayer.js`.

**Song Metadata & Destinations (V1):**
- **Spotify Links** - External links pointing to the official Spotify track pages for each curated song.
  - Auth: None in V1 (metadata redirect).
  - URL format: `https://open.spotify.com/track/{id}`.
- **YouTube Links** - External links pointing to the original YouTube videos.
  - URL format: `https://www.youtube.com/watch?v={id}`.

## Data Storage

**Static Configuration:**
- No database in V1. Data is served statically from memory using JS objects defined in:
  - `src/data/places.js` (place profiles).
  - `src/data/songs.js` (curated songs list and ambient configs).

## Authentication & Identity

**User Auth:**
- None implemented or required. Playback and browsing are completely anonymous.

## Monitoring & Observability

**Error Tracking / Logging:**
- Standard browser console logs.
- Next.js development server console output.

## CI/CD & Deployment

**Hosting:**
- Ready for Vercel/Cloudflare deployments. Deployment is triggered via Git push.

## Environment Configuration

**Development:**
- No environment variables are strictly required for local development.

## Webhooks & Callbacks

**Incoming:**
- None.

**Outgoing:**
- None.

---

*Integration audit: 2026-08-11*
