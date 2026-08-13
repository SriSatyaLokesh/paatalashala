export const metadata = {
  title: "Ammama Radio | Amma Radio Playlist & Lullabies | Paatalashala",
  description: "Experience the warmth of grandma's traditional village kitchen. Play the famous Amma radio playlist, classic lullabies, and vintage Telugu playlists from a nostalgic transistor radio.",
  keywords: ["amma radio playlist", "ammama radio", "telugu playlists", "paatalashala", "telugu lullabies", "S. Janaki hits", "Susheela melodies", "traditional Telugu kitchen", "village soundscape", "old Telugu radio songs"],
  alternates: {
    canonical: "https://srisatyalokesh.is-a.dev/paatalashala/spaces/ammama"
  },
  openGraph: {
    title: "Ammama Radio | Amma Radio Playlist & Lullabies | Paatalashala",
    description: "Play the famous Amma radio playlist, classic lullabies, and vintage Telugu playlists from a nostalgic kitchen transistor radio.",
    url: "https://srisatyalokesh.is-a.dev/paatalashala/spaces/ammama",
    siteName: "Paatalashala",
    images: [{ url: "https://srisatyalokesh.is-a.dev/paatalashala/images/grandma_1.png" }],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Ammama Radio | Amma Radio Playlist & Lullabies | Paatalashala",
    description: "Play the famous Amma radio playlist, classic lullabies, and vintage Telugu playlists from a nostalgic kitchen transistor radio.",
    images: ["https://srisatyalokesh.is-a.dev/paatalashala/images/grandma_1.png"]
  }
};

export default function AmmamaLayout({ children }) {
  const playlistSchema = {
    "@context": "https://schema.org",
    "@type": "MusicPlaylist",
    "name": "Ammama Radio Playlist",
    "description": "Nostalgic maternal songs, lullabies, and old hits by S. Janaki and P. Susheela.",
    "genre": "Classic Telugu Lullabies & Melodies",
    "numTracks": 120,
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
        "name": "What is the Ammama Radio space?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "It is an immersive audio environment that captures the warm atmosphere of a traditional South Indian village kitchen (clay pots, spices, brass vessels) mixed with nostalgic music from a classic dial-up transistor radio."
        }
      },
      {
        "@type": "Question",
        "name": "What kind of lyrics are displayed on Ammama Radio?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "It displays famous Telugu maternal lullabies, including 'Jo Achyutananda' by Annamacharya and cinema hits like 'Sirimalle Puvva' and 'Lali Lali'."
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
