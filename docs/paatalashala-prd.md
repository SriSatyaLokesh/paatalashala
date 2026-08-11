# PRD — Paatalashala

## 1. Product Overview

**Working name:** Paatalashala

**Tagline:** *What would you hear if you were there?*

Paatalashala is a collection of lightweight, immersive web experiences that represent the music and atmosphere associated with familiar Telugu cultural places and situations.

The first experience is **Truck Wala**: a Telugu highway/truck-driver listening environment featuring carefully curated Telugu songs that fit the mood of long-distance driving.

Future experiences can include:

- Saloon
- Auto
- Tea Stall
- RTC Bus
- College Canteen
- Pelli Sandadi
- Sunday TV
- Family Function
- Other culturally specific Telugu environments

The product is **not intended to be a general-purpose music streaming service**. The core product is cultural curation + atmosphere. YouTube provides the underlying music playback through its official embedded player.

---

## 2. Problem

Generic music platforms provide access to enormous catalogs but do not capture the cultural context of *where* and *why* people listen to particular songs.

For example:

- A Telugu truck driver may have a very different listening pattern from someone at a salon.
- A salon may evoke older Telugu melodies and familiar classics.
- An auto may have a different mix of energetic, mass-oriented songs.
- A tea stall may evoke a completely different period and mood.

Users should be able to enter a digital representation of that environment and immediately understand:

> “This is what it feels like to be there.”

---

## 3. Product Vision

Create a set of **digital Telugu places** where music, visual ambience, and cultural memory come together.

The user should feel less like they are opening a playlist and more like they are **entering a place where music is already playing**.

### Core principle

> **The environment is the interface.**

Do not compete with Spotify or YouTube on music discovery, catalog size, recommendations, or social features.

Instead, provide:

1. Strong cultural curation
2. A simple environment
3. Continuous music playback
4. Small visual changes synchronized with songs
5. A feeling of shared presence

---

# 4. Goals

## Primary goals

- Launch a highly polished **Telugu Truck Wala** experience.
- Keep users on the website while music plays.
- Use YouTube's official embedded player for playback.
- Curate a strong, editorially controlled Telugu playlist.
- Change the visual environment/ambience as songs change.
- Keep UX extremely simple and distraction-free.
- Make the experience immediately understandable without onboarding.
- Establish an architecture that supports multiple future "places."

## Secondary goals

- Show a lightweight real-time/near-real-time listener count.
- Provide Spotify and YouTube destinations for each song.
- Eventually allow users to add the complete curated playlist to Spotify or YouTube.
- Make each place independently themed while sharing the same underlying product architecture.

---

# 5. Non-Goals

The MVP will **not** attempt to:

- Host copyrighted audio files.
- Download or proxy YouTube audio.
- Become a general music streaming service.
- Build a Spotify-like search experience.
- Support user-created playlists.
- Support user accounts initially.
- Provide social profiles or comments.
- Provide algorithmic recommendations.
- Build a large music catalog.
- Reproduce YouTube's functionality.
- Build a complex CMS for public users.
- Monetize through intrusive advertising.

---

# 6. Target Users

## Primary user

Telugu-speaking or Telugu-culture-connected users who have familiarity with:

- Telugu cinema
- Telugu music
- Telugu nostalgia
- Indian roadside culture
- Salons/barber shops
- Autos
- Tea stalls
- RTC buses
- College culture
- Telugu family functions

## Secondary users

- Telugu diaspora
- People exploring Telugu music/culture
- Users who enjoy nostalgic internet experiences
- Users discovering individual songs through the curated environments

---

# 7. Product Structure

The product is organized around **Places**, not playlists.

```text
PAATALASHALA

🚚 Truck Wala
💈 Saloon
🛺 Auto
☕ Tea Stall
🚌 RTC Bus
🎓 College Canteen
💍 Pelli Sandadi
📺 Sunday TV
```

Each Place contains:

- A visual environment
- A curated song sequence
- Song-specific ambience
- A current-player state
- An optional listener count
- A song queue/up-next state

---

# 8. MVP — Truck Wala

## Concept

**Truck Wala** represents the experience of traveling through Andhra Pradesh/Telangana on a long highway journey with Telugu music playing.

The experience should not literally require a large truck illustration.

Instead, use environmental cues:

- Highway
- Road markings
- Distant lights
- Sky
- Dust
- Headlights
- Rain
- Sunset/sunrise
- Subtle motion
- Atmospheric lighting

### Example visual states

| Song | Ambience |
|---|---|
| Song A | Sunset highway |
| Song B | Night highway |
| Song C | Rain |
| Song D | Early morning |
| Song E | Warm dusk |
| Song F | Bright daytime highway |

The environment changes when the song changes.

---

# 9. Core User Experience

## Entry

User opens:

`/truck-wala`

The page immediately communicates:

```text
🚚 TRUCK WALA

Telugu songs for the highway.

83 on the road

[ START ]
```

The first user interaction starts playback.

This is important because modern browsers can block unmuted autoplay without user interaction.

## Playback

After the user presses Start:

1. Load the YouTube embedded player.
2. Begin the first curated song.
3. Display the current song metadata.
4. Apply the song's ambience.
5. When the song ends, load the next song.
6. Transition the ambience.
7. Continue indefinitely through the curated queue.

---

# 10. Player Experience

The YouTube player remains on the page.

The product should **not** download, proxy, or independently stream the YouTube audio.

### Recommended layout

```text
┌──────────────────────────────────────────┐
│                                          │
│              🚚 TRUCK WALA              │
│                                          │
│         83 ON THE HIGHWAY               │
│                                          │
│       ┌──────────────────────┐           │
│       │                      │           │
│       │    YOUTUBE PLAYER    │           │
│       │                      │           │
│       └──────────────────────┘           │
│                                          │
│             SONG TITLE                   │
│             Movie · Year                 │
│                                          │
│          ───────●────────                 │
│                                          │
│             ◀  ❚❚  ▶                    │
│                                          │
│                 UP NEXT                  │
│                                          │
│             Song 02                      │
│             Song 03                      │
│             Song 04                      │
│                                          │
└──────────────────────────────────────────┘
```

The YouTube player should remain a genuine visible embedded player and must not be hidden behind a fake custom player.

---

# 11. Song Transition System

Song transitions are a core product feature.

When YouTube reports that a song has ended:

```text
Song A ends
   ↓
Identify Song B
   ↓
Load Song B
   ↓
Load Song B ambience
   ↓
Crossfade/transition visual environment
   ↓
Song B plays
```

### Transition requirements

- Visual transition should feel natural.
- Avoid aggressive animations.
- Prefer 600–1200ms visual transitions.
- Avoid changing every visual element at once.
- Preserve spatial continuity.
- Music and ambience should feel connected.

---

# 12. Ambience System

Each song can have an ambience configuration.

Example:

```json
{
  "title": "Song Name",
  "youtube_video_id": "abc123",
  "place": "truck-wala",
  "ambience": {
    "background": "highway-night",
    "lighting": "headlights",
    "weather": "clear",
    "effect": "subtle-road-motion"
  }
}
```

Possible ambience properties:

- Background
- Lighting
- Sky/time of day
- Weather
- Particles
- Motion
- Color temperature
- Environmental objects
- Small animations

Ambience should remain subtle.

---

# 13. Future Place — Saloon

The Saloon should feel like entering an old Telugu barber/saloon.

The key design idea is to use an old television as the physical representation of the YouTube player.

```text
       DELUXE SALOON

    ┌────────────────────┐
    │                    │
    │   YOUTUBE PLAYER   │
    │       / TV         │
    │                    │
    └────────────────────┘

     Barber chair
     Mirror
     Comb
     Newspaper
     Tube light
```

The YouTube iframe is visually integrated into the TV frame.

The environment can change with songs:

- Lighting
- TV glow
- Time of day
- Window ambience
- Room brightness
- Small environmental animations

The TV should remain an actual visible YouTube player and should not be obscured by custom overlays.

---

# 14. Future Places

## Auto

Visual cues:

- Auto dashboard
- City lights
- Traffic
- Rain on windshield
- Evening/night ambience

## Tea Stall

Visual cues:

- Steel tea glass
- Counter
- Street lights
- Steam
- Evening environment
- Background traffic

## RTC Bus

Visual cues:

- Bus window
- Moving landscape
- Road reflections
- Morning/evening light
- Window-seat perspective

## College Canteen

Visual cues:

- Tables
- Fans
- Posters
- Campus atmosphere
- Afternoon/evening lighting

## Pelli Sandadi

Visual cues:

- Wedding hall
- Decorative lights
- People silhouettes
- Festive environment

---

# 15. Music Curation

Curation is a core product function, not an afterthought.

## Truck Wala initial criteria

Songs should generally fit a combination of:

- Telugu
- Strong road/highway energy
- Familiarity
- Mass appeal
- Nostalgia
- Commercial Telugu cinema
- Primarily older/classic eras where appropriate
- Songs culturally plausible for truck-driver listening

The exact year range should be determined through editorial research rather than rigidly limiting every song.

## Important principle

Do not create a generic:

> “Top Telugu Songs”

playlist.

Create:

> “Songs that feel right when you're driving a truck through Telugu country.”

---

# 16. Song Metadata

Each song should contain:

```text
Song
- id
- title
- movie
- year
- artist/singer
- music director
- place
- sequence
- youtube_video_id
- spotify_track_id
- youtube_url
- spotify_url
- ambience_id
- tags
- active
```

Potential tags:

```text
mass
road
energetic
nostalgia
90s
2000s
melody
rain
night
sunset
```

---

# 17. Data Model

## places

```text
id
slug
name
description
theme
active
created_at
```

## songs

```text
id
title
movie
year
artist
youtube_video_id
spotify_track_id
youtube_url
spotify_url
created_at
```

## place_songs

```text
id
place_id
song_id
sequence
ambience_id
active
```

## ambience

```text
id
background
lighting
weather
effect
transition
```

This separates songs from Places so the same song can eventually appear in multiple culturally relevant environments.

---

# 18. YouTube Integration

## MVP

Use the official YouTube IFrame Player/API approach.

Requirements:

- Embed the YouTube player on the page.
- Load the curated sequence.
- Detect playback state.
- Detect song completion.
- Advance to the next song.
- Maintain player state.
- Respect YouTube's embedded-player requirements.

YouTube supports embedded playback and playlist functionality through its player ecosystem.

## Autoplay

The product should attempt autoplay after an explicit user action such as:

**START TRUCK WALA**

Do not rely on guaranteed unmuted autoplay on first page load because browser autoplay policies can block it.

---

# 19. Spotify Integration

## MVP

Store Spotify track IDs/URLs for each song.

Display:

**Spotify**

as an optional destination.

## V2

Provide:

**Add Truck Wala to Spotify**

Flow:

```text
Click Add to Spotify
        ↓
Spotify OAuth
        ↓
User grants playlist permission
        ↓
Create playlist
        ↓
Add curated tracks
        ↓
Return user to experience
```

No Spotify authentication should be required simply to listen on the website.

---

# 20. YouTube Playlist Integration

## MVP

The website plays the curated sequence through embedded YouTube playback.

## V2

Provide:

**Add Truck Wala to YouTube**

Flow:

```text
Click Add to YouTube
        ↓
Google/YouTube OAuth
        ↓
User grants permission
        ↓
Create playlist
        ↓
Add selected videos
        ↓
Return to site
```

---

# 21. Listener Count

The experience can show:

> **83 on the highway**

or:

> **83 trucks on the road**

This is intended as an ambient/social signal rather than a critical product feature.

MVP implementation can use anonymous sessions.

Potential architecture:

```text
Visitor opens place
        ↓
Create anonymous session
        ↓
Increment presence
        ↓
Heartbeat
        ↓
Session expires
        ↓
Decrement/expire presence
```

The count does not need to represent synchronized listening.

---

# 22. Legal / Copyright Approach

## MVP principle

The product should **not host or distribute copyrighted audio files**.

Do not:

- Download YouTube audio.
- Extract MP3s.
- Proxy music through your server.
- Store copyrighted audio files.
- Build a hidden custom audio player around downloaded recordings.

Instead:

```text
Your website
     ↓
Official embedded YouTube player
     ↓
YouTube
```

Use legitimate/official YouTube uploads where possible.

Spotify links should point to the relevant Spotify tracks.

## Important legal note

Embedding a third-party platform does not automatically grant the website every possible copyright or commercial-use right.

Before monetizing or operating a large-scale music service, obtain legal advice covering:

- Sound recording rights
- Musical/lyrical work rights
- Public performance/communication rights
- Platform terms
- YouTube API policies
- Spotify developer/platform terms
- Commercial use
- Advertising/sponsorship
- User-generated content, if introduced later

The MVP should therefore be architected around official platform playback rather than independently hosting music.

---

# 23. UX Principles

## 1. Extremely simple

The user should understand the site within seconds.

## 2. No conventional dashboard

Avoid SaaS-style navigation.

## 3. Place-first design

The environment should communicate what the product is.

## 4. Music is continuous

Users should not have to repeatedly select songs.

## 5. Environment changes, not UI

Song transitions should primarily change the atmosphere rather than rearrange the interface.

## 6. Nostalgia without caricature

Use culturally recognizable details carefully.

Avoid turning Telugu culture into a cartoon.

## 7. Mobile-first

The experience should work especially well on phones.

## 8. Fast initial load

Load the minimum required assets and progressively enhance the environment.

---

# 24. Accessibility

The product should support:

- Keyboard controls
- Visible focus states
- Accessible play/pause controls where custom controls are provided
- Text alternatives for important visual information
- Sufficient contrast
- Reduced-motion preference
- Ability to pause environmental animation
- Clear current-song information

Respect:

```css
prefers-reduced-motion
```

for ambience transitions.

---

# 25. Responsive Design

## Mobile

Primary experience.

- Full viewport environment
- Compact player
- Minimal metadata
- Bottom/overlay-safe controls
- Vertical song queue

## Desktop

- Larger environmental canvas
- More visual depth
- Player integrated into environment
- More room for current/up-next metadata

The design should not become a conventional desktop music dashboard.

---

# 26. Technical Architecture

Recommended initial stack:

```text
Frontend
Next.js / React

Styling
CSS / Tailwind / CSS Modules

Backend
Next.js API routes or lightweight API

Database
PostgreSQL

Playback
YouTube IFrame Player API

Spotify
Spotify Web API for V2 playlist creation

YouTube
YouTube Data API for V2 playlist creation

Hosting
Vercel / Cloudflare / equivalent
```

Keep the architecture deliberately small.

---

# 27. Suggested Application Structure

```text
app/
├── page
├── places/
│   ├── truck-wala/
│   ├── saloon/
│   ├── auto/
│   └── ...
│
├── components/
│   ├── PlaceEnvironment
│   ├── YouTubePlayer
│   ├── NowPlaying
│   ├── UpNext
│   ├── PresenceCount
│   └── StartExperience
│
├── data/
│   ├── places
│   ├── songs
│   └── ambience
│
└── api/
    └── presence
```

---

# 28. Performance Requirements

Target:

- Fast first contentful render
- Avoid loading all ambience assets immediately
- Lazy-load future scene assets
- Preload only the next ambience where useful
- Optimize images/WebP/AVIF
- Avoid unnecessary JavaScript animation loops
- Keep environmental effects lightweight
- Avoid blocking page load on third-party APIs where possible

---

# 29. Analytics

Minimal analytics only.

Track:

- Place opened
- Start clicked
- Song started
- Song completed
- Song skipped
- Spotify clicked
- YouTube clicked
- Add-to-playlist initiated
- Add-to-playlist completed

Do not require user accounts for basic analytics.

---

# 30. Success Metrics

## Primary

- Percentage of visitors who start playback
- Average session duration
- Songs completed per session
- Repeat visits
- Percentage of sessions reaching 3+ songs

## Secondary

- Spotify outbound clicks
- YouTube outbound clicks
- Add-to-playlist conversions
- Place discovery
- Most replayed songs

### Strong qualitative signal

Users should describe the experience as:

> “This feels like actually being there.”

That is arguably more important than raw page views.

---

# 31. MVP Acceptance Criteria

Truck Wala is ready for launch when:

- [ ] User can open `/truck-wala`.
- [ ] User sees the environment immediately.
- [ ] User can press Start and begin playback.
- [ ] YouTube player remains embedded on the page.
- [ ] Curated songs play sequentially.
- [ ] Song completion advances to the next song.
- [ ] Current song title/movie/year are shown.
- [ ] Up-next songs are visible.
- [ ] Environment changes with each song.
- [ ] Transitions are smooth.
- [ ] Listener count is displayed.
- [ ] Spotify links work where available.
- [ ] YouTube links work where available.
- [ ] Mobile layout works.
- [ ] Desktop layout works.
- [ ] Reduced-motion behavior works.
- [ ] No copyrighted audio is stored or served by the application.
- [ ] YouTube embed/policy requirements are respected.

---

# 32. V2

After Truck Wala proves the concept:

1. Add Saloon.
2. Add Spotify playlist creation.
3. Add YouTube playlist creation.
4. Add more Places.
5. Improve presence counts.
6. Add richer ambience.
7. Add editorial/admin tooling.
8. Add place discovery.

---

# 33. V3 — Paatalashala Platform

Potential home page:

```text
                    PAATALASHALA

              What would you hear
                  if you were there?


       🚚                    💈
    TRUCK WALA              SALOON

       🛺                    ☕
       AUTO                TEA STALL

       🚌                    🎓
    RTC BUS             COLLEGE CANTEEN
```

Each place is a self-contained experience.

---

# 34. Editorial Philosophy

The quality of Paatalashala depends heavily on curation.

The playlist should not be generated purely from popularity metrics.

Every song should answer:

> **Would this genuinely feel right in this place?**

The product should favor:

- Cultural familiarity
- Emotional association
- Strong memories
- Context
- Era
- Place-specific plausibility

over:

- Pure streaming popularity
- Generic “best of Telugu” rankings
- Algorithmic recommendations

---

# 35. Product Differentiator

The core differentiator is:

> **Culturally specific music experiences represented as places.**

Not:

> “A website with Telugu songs.”

The product should feel like:

> “I entered a Telugu truck, salon, bus, tea stall, or college canteen, and the music was already playing.”

---

# 36. One-Sentence Product Definition

**Paatalashala is a collection of immersive digital environments where curated Telugu music plays continuously, with the surroundings changing subtly from song to song to recreate the feeling of being somewhere familiar.**

---

# 37. North Star

### Don't build a better music player.

### Build a better place to listen.
