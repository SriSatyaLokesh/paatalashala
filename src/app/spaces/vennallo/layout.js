export const metadata = {
  title: "మేడ మీద వెన్నెల్లో | Best Telugu Sleep Songs & Soothing Night Playlist | Paatalashala",
  description: "Listen to the best Telugu sleep songs and soothing night playlist on a cozy village terrace (midde) under a starry sky. Relax with comforting midnight melodies, cool breeze, and ambient night sounds.",
  keywords: ["best telugu sleeping songs", "telugu sleep songs", "telugu night songs", "best night playlist", "sleeping playlist", "మేడ మీద వెన్నెల్లో", "Meda Midha Vennallo", "Telugu night melodies", "terrace midnight breeze", "village night ambient", "starry sky audio", "cozy Telugu soundtrack"],
  alternates: {
    canonical: "https://srisatyalokesh.is-a.dev/paatalashala/spaces/vennallo"
  },
  openGraph: {
    title: "మేడ మీద వెన్నెల్లో | Best Telugu Sleep Songs & Soothing Night Playlist | Paatalashala",
    description: "Relax on an open terrace under a starry night sky with a soothing cool breeze and the best Telugu sleep songs playlist playing.",
    url: "https://srisatyalokesh.is-a.dev/paatalashala/spaces/vennallo",
    siteName: "Paatalashala",
    images: [{ url: "https://srisatyalokesh.is-a.dev/paatalashala/images/vennela_1.png" }],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "మేడ మీద వెన్నెల్లో | Best Telugu Sleep Songs & Soothing Night Playlist | Paatalashala",
    description: "Relax on an open terrace under a starry night sky with a soothing cool breeze and the best Telugu sleep songs playlist playing.",
    images: ["https://srisatyalokesh.is-a.dev/paatalashala/images/vennela_1.png"]
  }
};

export default function VennalloLayout({ children }) {
  const playlistSchema = {
    "@context": "https://schema.org",
    "@type": "MusicPlaylist",
    "name": "Meda Midha Vennallo Playlist",
    "description": "Cozy, soothing Telugu melodies for starry nights, featuring Rahman, Keeravani, and timeless composers.",
    "genre": "Soothing Telugu Cinema Melodies",
    "numTracks": 56,
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
        "name": "What is the Meda Midha Vennallo space?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "It is an immersive night space representing a quiet village terrace (midde) under a starry sky with a cool breeze, paired with cozy and comforting Telugu melodies."
        }
      },
      {
        "@type": "Question",
        "name": "What songs are featured in the Meda Midha Vennallo space?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "It features 56 selected tracks centered around moon (vennela), stars (chukkalu), and evening comfort, from legendary composers like A.R. Rahman, M.M. Keeravani, and Ilaiyaraaja."
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
