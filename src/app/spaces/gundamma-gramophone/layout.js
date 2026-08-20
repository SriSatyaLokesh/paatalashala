const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://srisatyalokesh.is-a.dev/paatalashala";

export const metadata = {
  title: "Gundamma Gari Gramophone | Best 60s, 70s, 80s Telugu Old Songs & Black & White Classics",
  description: "Listen to 400+ evergreen 50s, 60s, 70s & 80s Telugu classics on Gundamma Gari Gramophone. Featuring legendary songs by Ghantasala, P. Susheela, S. Janaki & SPB with nostalgic retro vinyl soundscapes.",
  keywords: [
    "gundamma gari gramophone",
    "best 60s telugu songs",
    "best 70s telugu songs",
    "best 80s telugu songs",
    "best telugu black and white songs",
    "old telugu melodies",
    "telugu golden era songs",
    "telugu gramophone songs",
    "ghantasala telugu hits",
    "p susheela old telugu songs",
    "suryakantham vintage songs",
    "retro telugu old hits",
    "paatalashala old classics"
  ],
  alternates: {
    canonical: "/spaces/gundamma-gramophone",
  },
  openGraph: {
    title: "Gundamma Gari Gramophone | Best 60s, 70s, 80s Telugu Old Songs & Black & White Classics",
    description: "Spin 400+ evergreen vintage Telugu classics from the 50s, 60s, 70s & 80s. Nostalgic Suryakantham retro vinyl courtyard.",
    url: `${SITE_URL}/spaces/gundamma-gramophone`,
    siteName: "Paatalashala",
    images: [
      {
        url: `${SITE_URL}/images/gundamma_1.webp`,
        width: 1280,
        height: 720,
        alt: "Gundamma Gari Gramophone - Vintage Telugu Old Songs",
      },
    ],
    locale: "te_IN",
    type: "music.playlist",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gundamma Gari Gramophone | 50s-80s Telugu Evergreen Classics",
    description: "400+ Telugu black and white and golden vintage melodies on brass horn gramophone.",
    images: [`${SITE_URL}/images/gundamma_1.webp`],
  },
};

const musicPlaylistSchema = {
  "@context": "https://schema.org",
  "@type": "MusicPlaylist",
  "name": "Gundamma Gari Gramophone - 60s 70s 80s Telugu Evergreen Classics",
  "description": "Comprehensive collection of over 400 iconic Telugu songs from the 1950s, 1960s, 1970s, and 1980s, including black & white masterpieces and vintage gramophone hits.",
  "numTracks": 406,
  "genre": "Telugu Vintage Classical",
  "url": `${SITE_URL}/spaces/gundamma-gramophone`,
  "image": `${SITE_URL}/images/gundamma_1.webp`,
  "publisher": {
    "@type": "Organization",
    "name": "Paatalashala",
    "url": SITE_URL
  }
};

export default function GundammaGramophoneLayout({ children }) {
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
