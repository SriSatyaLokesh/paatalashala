export const metadata = {
  title: "Tractor Anna | Immersive Telugu Farmland Beats | Paatalashala",
  description: "Ride a classic tractor through green paddy fields under a golden sunset. Experience high-energy Telugu folk songs, mass beats, and farm road ambient hums.",
  keywords: ["Tractor anna", "Telugu folk songs", "farmland driving soundscape", "Telugu mass beats", "village driving ambient", "high energy Telugu tracks"],
  alternates: {
    canonical: "https://srisatyalokesh.is-a.dev/paatalashala/spaces/tractor-anna"
  },
  openGraph: {
    title: "Tractor Anna | Immersive Telugu Farmland Beats | Paatalashala",
    description: "High-energy driving simulation across beautiful Telugu farmlands with pumping local rhythms.",
    url: "https://srisatyalokesh.is-a.dev/paatalashala/spaces/tractor-anna",
    siteName: "Paatalashala",
    images: [{ url: "https://srisatyalokesh.is-a.dev/paatalashala/images/sunset_farm_background.webp" }],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Tractor Anna | Immersive Telugu Farmland Beats | Paatalashala",
    description: "High-energy driving simulation across beautiful Telugu farmlands with pumping local rhythms.",
    images: ["https://srisatyalokesh.is-a.dev/paatalashala/images/sunset_farm_background.webp"]
  }
};

export default function TractorAnnaLayout({ children }) {
  const playlistSchema = {
    "@context": "https://schema.org",
    "@type": "MusicPlaylist",
    "name": "Tractor Anna Playlist",
    "description": "High-octane Telugu folk songs and energetic beats for farm field cruises.",
    "genre": "Telugu Folk & Mass Beats",
    "numTracks": 100,
    "creator": {
      "@type": "Person",
      "name": "SriSatyaLokesh"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is the Tractor Anna space?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "It is an interactive farmland driving simulator where you can cruise on a tractor through green rice paddies with dust/grain particles floating, synchronized with energetic Telugu folk songs."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(playlistSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
