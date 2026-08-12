# 🎵 Paatalashala (పాటలశాల)

<img width="1895" height="378" alt="image" src="https://github.com/user-attachments/assets/298a57a7-0f2f-4431-a4ff-bd3c4b63f395" />


> **Handcrafted Telugu ambient soundscapes from the nostalgic places that shaped us. Pick a place. Let it play.**

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

---

## 🚀 Key Features

* **🎛️ Multi-Channel Ambient Mixer:** Adjust the volume of the ambient soundscapes (e.g. tractor hum, street traffic, wind) independently of the main music track.
* **👥 Optional Real-Time Listener Counter:** Displays the exact count of active, concurrent listeners on each page using **Supabase Presence**. If no database configuration keys are provided, the system automatically falls back to clean, realistic simulated counters.
* **⚡ Smooth Cross-Fade Transitions:** Implements the Double Background Layer Pattern to fade viewports seamlessly when changing songs, eliminating abrupt image resizing.
* **🛱 Custom Air Horns & Sounds:** Interactive horn triggers that play custom vehicle audio overlays on demand.
* **🌫️ Drifting Cinematic Fog:** Features procedural animated fog clouds generated via inline SVG fractal noise filters.
* **📱 Responsive HUD Canopy:** Designed to resemble actual vehicle windshield sticker frames and dashboard audio decks. Full mobile optimization with specialized swipe/tap HUD actions.

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
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── page.js         # Main landing dashboard
│   │   └── places/         # Location page components
│   │       ├── auto/       # Auto Janie workspace
│   │       ├── saloon/     # Royal Saloon workspace
│   │       └── tractor-anna/
│   ├── components/         # Shared modules (YouTube Player, AmbientWeather)
│   ├── data/               # Static places and song metadata
│   └── utils/              # Path helpers & Supabase client wrapper
└── .env.local              # Local environment credentials (git-ignored)
```
---

*Handcrafted with ❤️ for nostalgic Telugu souls.*
