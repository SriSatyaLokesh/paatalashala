export const SONGS = [
  // --- TRUCK WALA PLACE SONGS ---
  {
    id: "tw-chaila-chaila",
    place: "tractor-anna",
    title: "Chaila Chaila",
    movie: "Shankar Dada M.B.B.S.",
    year: "2004",
    artist: "Chiranjeevi, K.S. Chithra, KK",
    musicDirector: "Devi Sri Prasad",
    youtubeVideoId: "m7R5z3uM69E",
    youtubeUrl: "https://www.youtube.com/watch?v=m7R5z3uM69E",
    spotifyUrl: "https://open.spotify.com/track/5cW40w2zF5V7V7V7V7V7V7", // Mock/V2 Spotify
    sequence: 1,
    active: true,
    ambience: {
      id: "sunset-highway",
      theme: "sunset",
      background: "url('/images/sunset_farm_background.png')",
      roadSpeed: "1s",
      weather: "clear",
      skyState: "dusk",
      particles: "dust",
      brightness: 1.0,
      visualEffects: ["moving-clouds", "sunset-glow"],
      description: "Sunset highway cruise"
    }
  },
  {
    id: "tw-sada-siva",
    place: "tractor-anna",
    title: "Sada Siva",
    movie: "Khaleja",
    year: "2010",
    artist: "Ramesh Chandra, Karunya",
    musicDirector: "Mani Sharma",
    youtubeVideoId: "w95M6g7fJ84",
    youtubeUrl: "https://www.youtube.com/watch?v=w95M6g7fJ84",
    spotifyUrl: "https://open.spotify.com/track/4eY4eY4eY4eY4eY4eY4eY4",
    sequence: 2,
    active: true,
    ambience: {
      id: "night-highway",
      theme: "night",
      background: "url('/images/night_farm_background.png')",
      roadSpeed: "0.7s", /* Fast driving feel */
      weather: "clear",
      skyState: "night",
      particles: "stars",
      brightness: 0.6,
      visualEffects: ["headlight-glare", "passing-streetlights"],
      description: "Midnight fast driving"
    }
  },
  {
    id: "tw-oke-oka-jeevitham",
    place: "tractor-anna",
    title: "Oke Oka Jeevitham",
    movie: "Mr. Nookayya",
    year: "2012",
    artist: "Haricharan",
    musicDirector: "Yuvan Shankar Raja",
    youtubeVideoId: "T59b7U2Qe84",
    youtubeUrl: "https://www.youtube.com/watch?v=T59b7U2Qe84",
    spotifyUrl: "https://open.spotify.com/track/3d3d3d3d3d3d3d3d3d3d3d",
    sequence: 3,
    active: true,
    ambience: {
      id: "rainy-highway",
      theme: "rainy",
      background: "url('/images/rainy_farm_background.png')",
      roadSpeed: "1.5s", /* Slower speed for safety in rain */
      weather: "rain",
      skyState: "stormy",
      particles: "rain",
      brightness: 0.7,
      visualEffects: ["windshield-wipers", "raindrops-on-glass", "water-splashes"],
      description: "Rainy drive with reflections"
    }
  },
  {
    id: "tw-priya-raagale",
    place: "tractor-anna",
    title: "Priya Raagale",
    movie: "Hello Brother",
    year: "1994",
    artist: "S.P. Balasubrahmanyam, K.S. Chithra",
    musicDirector: "Raj-Koti",
    youtubeVideoId: "J32V-H_1Gys",
    youtubeUrl: "https://www.youtube.com/watch?v=J32V-H_1Gys",
    spotifyUrl: "https://open.spotify.com/track/1a1a1a1a1a1a1a1a1a1a1a",
    sequence: 4,
    active: true,
    ambience: {
      id: "morning-highway",
      theme: "morning",
      background: "url('/images/morning_farm_background.png')",
      roadSpeed: "1.2s",
      weather: "misty",
      skyState: "sunrise",
      particles: "fog",
      brightness: 0.9,
      visualEffects: ["misty-fog", "golden-sunrise-rays"],
      description: "Early morning golden drive"
    }
  },

  // --- RETRO SALOON PLACE SONGS ---
  {
    id: "sa-o-priya",
    place: "saloon",
    title: "O Priya Priya",
    movie: "Geethanjali",
    year: "1989",
    artist: "S.P. Balasubrahmanyam, K.S. Chithra",
    musicDirector: "Ilaiyaraaja",
    youtubeVideoId: "kYvM-xR5v_c",
    youtubeUrl: "https://www.youtube.com/watch?v=kYvM-xR5v_c",
    spotifyUrl: "https://open.spotify.com/track/7b7b7b7b7b7b7b7b7b7b7b",
    sequence: 1,
    active: true,
    ambience: {
      id: "retro-saloon-day",
      theme: "saloon-day",
      background: "#3e2723", /* Deep warm wood brown */
      lighting: "warm-tube",
      weather: "clear",
      particles: "dust-motes",
      brightness: 1.0,
      visualEffects: ["rotating-ceiling-fan", "tv-flicker-soft", "mirror-reflections"],
      description: "Daytime warm salon lighting"
    }
  },
  {
    id: "sa-priya-priyathama",
    place: "saloon",
    title: "Priya Priyathama",
    movie: "Killer",
    year: "1992",
    artist: "S.P. Balasubrahmanyam, K.S. Chithra",
    musicDirector: "Ilaiyaraaja",
    youtubeVideoId: "S0T0j_lGq6I",
    youtubeUrl: "https://www.youtube.com/watch?v=S0T0j_lGq6I",
    spotifyUrl: "https://open.spotify.com/track/8c8c8c8c8c8c8c8c8c8c8c",
    sequence: 2,
    active: true,
    ambience: {
      id: "retro-saloon-evening",
      theme: "saloon-evening",
      background: "#1e120f", /* Dim wood brown / dusk shadows */
      lighting: "flickering-neon",
      weather: "clear",
      particles: "dust-motes-dim",
      brightness: 0.7,
      visualEffects: ["rotating-ceiling-fan", "flickering-tube-light", "tv-glow-dynamic"],
      description: "Cozy twilight salon mood"
    }
  }
];

export const getSongsForPlace = (placeId) => {
  return SONGS.filter(song => song.place === placeId && song.active)
    .sort((a, b) => a.sequence - b.sequence);
};
