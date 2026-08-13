export const metadata = {
  title: "Thathayya Tape Recorder | Timeless Telugu Classics | Paatalashala",
  description: "Step onto a warm vintage village veranda, listen to the gentle morning hum, and enjoy the timeless golden era of Telugu music playing from a nostalgic cassette tape recorder.",
  keywords: ["Telugu old songs", "Thathayya tape recorder", "Ghantasala songs", "SPB melodies", "Ilaiyaraaja classics", "nostalgic Telugu music", "retro soundscape", "village veranda ambient"],
  alternates: {
    canonical: "https://srisatyalokesh.is-a.dev/paatalashala/spaces/thathayya"
  },
  openGraph: {
    title: "Thathayya Tape Recorder | Timeless Telugu Classics | Paatalashala",
    description: "Relax on a vintage veranda with a warm cup of tea and timeless classic Telugu melodies playing from an old cassette tape recorder.",
    url: "https://srisatyalokesh.is-a.dev/paatalashala/spaces/thathayya",
    siteName: "Paatalashala",
    images: [{ url: "https://srisatyalokesh.is-a.dev/paatalashala/images/tape_recorder_background.webp" }],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Thathayya Tape Recorder | Timeless Telugu Classics | Paatalashala",
    description: "Relax on a vintage veranda with a warm cup of tea and timeless classic Telugu melodies playing from an old cassette tape recorder.",
    images: ["https://srisatyalokesh.is-a.dev/paatalashala/images/tape_recorder_background.webp"]
  }
};

export default function ThathayyaLayout({ children }) {
  const playlistSchema = {
    "@context": "https://schema.org",
    "@type": "MusicPlaylist",
    "name": "Thathayya Tape Recorder Playlist",
    "description": "Nostalgic Telugu classics from Ghantasala, SP Balasubrahmanyam, and Ilaiyaraaja.",
    "genre": "Classic Telugu Cinema Music",
    "numTracks": 300,
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
        "name": "What is the Thathayya Tape Recorder space?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "It is an immersive audio environment depicting a peaceful village veranda with birds chirping and leaves rustling, paired with classic old Telugu melodies playing from a vintage cassette deck."
        }
      },
      {
        "@type": "Question",
        "name": "What kind of music plays in Thathayya Tape Recorder?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The playlist features 300 curated golden classics from composers like Ilaiyaraaja and legendary singers like S.P. Balasubrahmanyam and Ghantasala."
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
