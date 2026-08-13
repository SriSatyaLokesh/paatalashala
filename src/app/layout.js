import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

// Set NEXT_PUBLIC_SITE_URL in .env to override (e.g. for custom domain)
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://srisatyalokesh.is-a.dev/paatalashala";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Paatalashala",
  "url": SITE_URL,
  "logo": `${SITE_URL}/images/readme_banner.png`,
  "sameAs": [
    "https://github.com/SriSatyaLokesh/paatalashala",
    "https://srisatyalokesh.is-a.dev/"
  ],
  "description": "Handcrafted Telugu ambient soundscapes from nostalgic spaces like farm tractors, street barber shops, and auto-rickshaws."
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Paatalashala",
  "url": SITE_URL,
  "applicationCategory": "MultimediaApplication",
  "operatingSystem": "All",
  "browserRequirements": "Requires JavaScript. Requires HTML5.",
  "description": "An interactive Telugu cultural soundscape player featuring rural farmland tractors, vintage saloons, and Hyderabad city auto-rickshaws mixed with curated local music.",
  "creator": {
    "@type": "Person",
    "name": "SriSatyaLokesh",
    "url": "https://srisatyalokesh.is-a.dev/"
  }
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is Paatalashala?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Paatalashala is an interactive ambient audio player that blends curated Telugu music with nostalgic cultural soundscapes like farmland tractors, retro saloons, and Hyderabad city auto-rickshaws."
      }
    },
    {
      "@type": "Question",
      "name": "How does the live listener counter work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The live listener counters are powered in real-time by Supabase Presence WebSocket channels, showing the exact count of concurrent visitors on each space."
      }
    },
    {
      "@type": "Question",
      "name": "Are the music files hosted on Paatalashala?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No, all music is streamed dynamically in real-time using the official YouTube Player API. No audio files are hosted on our servers."
      }
    }
  ]
};

export const metadata = {
  title: "Paatalashala | Handcrafted Nostalgic Telugu Playlists & Ambience",
  description: "Explore the best handcrafted Telugu playlists and cultural ambient soundscapes. Relive memories with Amma radio playlist, Thathayya tape recorder, saloon TV classics, and city auto rides.",
  keywords: ["paatalashala", "telugu playlists", "amma radio playlist", "ammama radio", "thathayya tape recorder", "telugu old songs playlist", "retro telugu soundscapes", "nostalgic telugu music", "telugu ambient audio"],
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: "Paatalashala | Handcrafted Nostalgic Telugu Playlists & Ambience",
    description: "Explore the best handcrafted Telugu playlists and cultural ambient soundscapes. Relive memories with Amma radio playlist, Thathayya tape recorder, saloon TV classics, and city auto rides.",
    url: SITE_URL,
    siteName: "Paatalashala",
    images: [
      {
        url: `${SITE_URL}/images/readme_banner.png`,
        width: 1200,
        height: 630,
        alt: "Paatalashala Ambient Player Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Paatalashala | Handcrafted Nostalgic Telugu Playlists & Ambience",
    description: "Explore the best handcrafted Telugu playlists and cultural ambient soundscapes. Relive memories with Amma radio playlist, Thathayya tape recorder, saloon TV classics, and city auto rides.",
    images: [`${SITE_URL}/images/readme_banner.png`],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://www.youtube.com" />
        <link rel="preconnect" href="https://s.ytimg.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
      <body suppressHydrationWarning>
        {children}
        <Script
          id="youtube-iframe-api-global-script"
          src="https://www.youtube.com/iframe_api"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
