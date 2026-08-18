# 🎵 Paatalashala (పాటలశాల)

<img width="1895" height="378" alt="image" src="https://github.com/user-attachments/assets/298a57a7-0f2f-4431-a4ff-bd3c4b63f395" />


> **Handcrafted Telugu ambient soundscapes from the nostalgic spaces that shaped us. Pick a space. Let it play.**

Paatalashala is an immersive, interactive audio web application designed to trigger warm nostalgia by pairing traditional Telugu music with ambient background soundscapes. Escape to rural farms, retro street-corner barber shops, or the bustling roads of Hyderabad.

## 🗺️ Ambient Sound Spaces

### 1. 🚜 Tractor Anna (ట్రాక్టర్ అన్న)
* **Vibe:** Telugu farmland driving vibes.
* **Atmosphere:** Rhythmic tractor engine rattles, golden rice fields, gentle afternoon breezes, and high-fidelity birds chirping.
* **Music:** Authentic rural and traditional Telugu folk beats.

### 2. 💈 Royal Saloon (రాయల్ సెలూన్)
* **Vibe:** Nostalgic neighborhood saloon memories.
* **Atmosphere:** Clatter of scissors, running ceiling fans, muffled conversations, street traffic, and vintage radio filters.
* **Music:** Timeless Telugu cinema classics from the golden era.

### 3. 🛺 Auto Janie (ఆటో జానీ)
* **Vibe:** High-energy Hyderabad street cruise.
* **Atmosphere:** Revving 3-wheeler engine hums, dynamic rain/dust city weather particle lines, street noise, and loud pneumatic air-horn triggers.
* **Music:** High-octane Telugu mass beats and commercial chart-busters.

### 4. 📼 Thathayya Tape Recorder (తాతయ్య టేప్ రికార్డర్)
* **Vibe:** Nostalgic village veranda music.
* **Atmosphere:** Rhythmic hums of birds, gentle nature, and classic Telugu lyrics display banner. Shifted camera view to make the tape recorder and grandfather's face clearly visible.
* **Music:** Legendary classic melodies by Ghantasala, SPB, and Ilaiyaraaja.
* **Dynamic Visuals:** Cycles through three custom veranda background pictures on song changes.

### 5. 📻 Ammama Radio (అమ్మమ్మ రేడియో)
* **Vibe:** Traditional village kitchen cooking vibes.
* **Atmosphere:** Gentle morning birds, warm kitchen mist fog + dust particle effects, and classic maternal lullaby lyrics displayed above the player.
* **Music:** Beautiful vintage tracks and maternal melodies by S. Janaki, Susheela, and Koti.
* **Dynamic Visuals:** Cycles through custom village kitchen background pictures on song changes.

### 6. 🌙 Meda Meeda Vennallo (మేడ మీద వెన్నెల్లో)
* **Vibe:** Soothing terrace night breeze and stargazing under the moonlit sky.
* **Atmosphere:** Deep cosmic night sky, shooting stars, warm terrace lighting, and serene ambient breeze.
* **Music:** Gentle, nocturnal Telugu melodies and soul-soothing acoustics.

### 7. 🔀 Sammelanam / Surprise Me (సమ్మేళనం)
* **Vibe:** Dynamic cross-space journey and infinite surprise discoveries.
* **Atmosphere:** Adaptive ambiance that transitions fluidly across farms, retro verandas, night terraces, and city roads.
* **Music:** Curated cross-genre Telugu songs pulling live from all unique spaces.

---

## 🎶 Song Catalog & Modular Splitting

To ensure optimal web performance and minimal bundle sizes, song catalogs are code-split per space:

* **Source of Truth (`src/data/songs.json`):** Master catalog containing metadata for all songs.
* **Split Catalogs (`src/data/songs/<space>.json`):** Individual per-space JSON files imported directly by each space page component to prevent shipping unnecessary catalog weight to visitors.

### Song Entry Schema
```json
{
  "id": "saloon-1",
  "place": "saloon",
  "title": "Chinnadhana",
  "artist": "Haricharan",
  "movie": "Ishq",
  "year": "2012",
  "genre": "Melody",
  "mood": "Romantic",
  "active": true,
  "sequence": 1,
  "youtubeVideoId": "dQw4w9WgXcQ",
  "ambience": {
    "background": "/images/saloon_background.webp"
  }
}
```

### Regenerating Per-Space Catalogs
After modifying `src/data/songs.json`, run the split script to synchronize the per-space song files:
```bash
npm run split-songs
```

---

## 🚀 Key Features

* **🎛️ Multi-Channel Ambient Mixer:** Adjust the volume of the ambient soundscapes (e.g. tractor hum, street traffic, wind) independently of the main music track.
* **👥 Real-Time & Simulated Listener Counter:** Displays active concurrent listener counts using **Supabase Presence** or authentic simulated sinusoidal traffic generators.
* **🩹 Self-Healing Playlist Loop:** When the client player catches a blocked/restricted embedding error (YouTube Error `150` or `101`), it calls the Next.js API route `/api/delete-song` to automatically purge the unplayable track from `songs.json` in real-time, then seamlessly skips to the next track.
* **🌪️ Concurrent Weather Particle Systems:** Upgraded Canvas weather engine in `AmbientWeather` supporting glowing upward-drifting dust motes and soft kitchen mist/fog concurrently.
* **⚡ Smooth Cross-Fade Transitions:** Double Background Layer Pattern to fade viewports seamlessly when changing songs, eliminating abrupt image resizing.
* **🎛️ Rich Page-Level SEO:** Static Server Component layouts injecting tailored metadata, titles, canonical tags, and OpenGraph/FAQ schemas.
* **📱 Responsive HUD Canopy:** Designed to resemble actual vehicle windshield sticker frames and dashboard audio decks with full mobile optimization.

---

## 🛠️ Tech Stack

* **Framework:** Next.js (with Turbopack engine)
* **Realtime Sync:** Optional Supabase Realtime (Presence WebSockets)
* **Styling:** Vanilla CSS, CSS modules, CSS Global, and Tailwind utility tokens
* **Icons:** Custom SVG inline components and Lucide React

---

## 💻 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org) installed on your system.

### Installation
Clone the repository and install the dependencies:
```bash
npm install
```

### Local Development
Run the hot-reloading Next.js dev server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### Production Build & Serve
Build the static application and host the local serving proxy:
```bash
npm run build
npm run serve:prod
```
The optimized server will accept connections at `http://localhost:<PORT>/paatalashala`.

---

## 📂 Project Structure

```text
paatalashala/
├── public/                 # Static assets
│   ├── audio/              # Ambient loops and custom horns
│   └── images/             # Sprite components and city/farm backdrops
├── scripts/
│   └── split-songs.js      # Utility to split songs.json into per-space JSON files
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── api/            # API endpoints (Self-healing playlist route)
│   │   │   └── delete-song/
│   │   ├── spaces/         # Individual location space components
│   │   │   ├── ammama/     # Ammama Radio
│   │   │   ├── auto/       # Auto Janie
│   │   │   ├── saloon/     # Royal Saloon
│   │   │   ├── sammelanam/ # Sammelanam (Surprise Me)
│   │   │   ├── thathayya/  # Thathayya Tape Recorder
│   │   │   ├── tractor-anna/
│   │   │   └── vennallo/   # Meda Meeda Vennallo
│   │   ├── page.js         # Main landing dashboard
│   │   └── layout.js       # Root layout with WebApp and FAQ schemas
│   ├── components/         # Shared modules (PlayerCapsule, YouTube Player, AmbientWeather)
│   ├── data/
│   │   ├── songs/          # Code-split per-space songs JSON files
│   │   ├── songs.json      # Master song catalog
│   │   └── spaces.js       # Space definitions and metadata
│   └── utils/              # Path helpers & Supabase client wrapper
└── .env.local              # Local environment credentials (git-ignored)
```
---

*Handcrafted with ❤️ for nostalgic Telugu souls.*
