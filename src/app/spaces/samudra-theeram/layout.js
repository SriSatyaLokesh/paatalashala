import { Space_Grotesk, Space_Mono } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "700"],
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
  weight: ["400", "700"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.paatalashala.space";

export const metadata = {
  title: "Samudra Theeram | Best Telugu Beach Songs, Sea Shore & Ocean Bed Melodies",
  description: "Experience 24-hour day & night ocean cycles on the beach with interactive WebGL raymarching wave animations, sunrise to sunset transitions, and soothing Telugu beach melodies.",
  keywords: [
    "samudra theeram",
    "telugu beach songs",
    "telugu ocean melodies",
    "sea shore telugu songs",
    "ocean bed melodies telugu",
    "sunrise sunset telugu melodies",
    "beach songs telugu playlist",
    "telugu coastal melodies",
    "alalu kalalu ilayaraja",
    "paatalashala samudra theeram"
  ],
  alternates: {
    canonical: "/spaces/samudra-theeram",
  },
  openGraph: {
    title: "Samudra Theeram | Best Telugu Beach Songs & Ocean Bed Melodies",
    description: "Interactive 24-hour WebGL raymarched ocean shader, dawn to night beach transitions, and curated Telugu sea shore melodies.",
    url: `${SITE_URL}/spaces/samudra-theeram`,
    siteName: "Paatalashala",
    images: [
      {
        url: `${SITE_URL}/images/samudra_theeram.webp`,
        width: 1200,
        height: 630,
        alt: "Samudra Theeram Telugu Beach Melodies Soundscape",
      },
    ],
    locale: "te_IN",
    type: "music.playlist",
  },
  twitter: {
    card: "summary_large_image",
    title: "Samudra Theeram | Telugu Beach & Sea Shore Melodies",
    description: "Interactive WebGL ocean waves player with 24-hr day/night cycle and curated Telugu ocean songs.",
    images: [`${SITE_URL}/images/samudra_theeram.webp`],
  },
};

const musicPlaylistSchema = {
  "@context": "https://schema.org",
  "@type": "MusicPlaylist",
  "name": "Samudra Theeram - Telugu Beach & Sea Shore Melodies",
  "description": "24-hour interactive ocean audio environment featuring classic and soothing Telugu beach melodies, sunset tunes, and ocean bed songs.",
  "numTracks": 1,
  "genre": "Telugu Beach Melodies",
  "url": `${SITE_URL}/spaces/samudra-theeram`,
  "publisher": {
    "@type": "Organization",
    "name": "Paatalashala",
    "url": SITE_URL
  }
};

export default function SamudraTheeramLayout({ children }) {
  return (
    <div className={`${spaceGrotesk.variable} ${spaceMono.variable}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(musicPlaylistSchema) }}
      />
      {children}
    </div>
  );
}
