const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://srisatyalokesh.is-a.dev/paatalashala";

export const metadata = {
  title: "Campfire Jamming | Best Telugu Campfire Songs, Late Night Acoustic & Travel Melodies",
  description: "Experience late-night Telugu campfire melodies with interactive 3D flame visualizer, camping tent, starry wilderness skies, and cozy acoustic travel hits.",
  keywords: [
    "campfire jamming",
    "best telugu campfire songs",
    "telugu acoustic songs",
    "late night telugu melodies",
    "telugu guitar songs",
    "telugu travel songs",
    "midnight telugu songs playlist",
    "campfire music player",
    "telugu unplugged songs",
    "paatalashala campfire"
  ],
  alternates: {
    canonical: "/spaces/campfire-jamming",
  },
  openGraph: {
    title: "Campfire Jamming | Best Telugu Campfire Songs & Late Night Acoustic Melodies",
    description: "Interactive 3D crackling campfire visualizer, starry night mountains, and curated Telugu late-night acoustic music.",
    url: `${SITE_URL}/spaces/campfire-jamming`,
    siteName: "Paatalashala",
    images: [
      {
        url: `${SITE_URL}/images/camping_tent.webp`,
        width: 605,
        height: 412,
        alt: "Campfire Jamming Telugu Music Soundscape",
      },
    ],
    locale: "te_IN",
    type: "music.playlist",
  },
  twitter: {
    card: "summary_large_image",
    title: "Campfire Jamming | Telugu Late Night Acoustic Hits",
    description: "Interactive 3D Three.js crackling campfire player with curated Telugu acoustic travel tunes.",
    images: [`${SITE_URL}/images/camping_tent.webp`],
  },
};

const musicPlaylistSchema = {
  "@context": "https://schema.org",
  "@type": "MusicPlaylist",
  "name": "Campfire Jamming - Telugu Acoustic & Travel Melodies",
  "description": "Late-night acoustic Telugu songs, guitar chords, and soothing travel melodies framed by interactive 3D campfire visualizer.",
  "numTracks": 38,
  "genre": "Acoustic Telugu Melodies",
  "url": `${SITE_URL}/spaces/campfire-jamming`,
  "image": `${SITE_URL}/images/camping_tent.webp`,
  "publisher": {
    "@type": "Organization",
    "name": "Paatalashala",
    "url": SITE_URL
  }
};

export default function CampfireJammingLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(musicPlaylistSchema) }}
      />
      {children}
    </>
  );
}
