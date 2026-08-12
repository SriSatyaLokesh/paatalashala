import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

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
  "url": "https://paatalashala.space",
  "logo": "https://paatalashala.space/images/landing_bg.avif",
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
  "url": "https://paatalashala.space",
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
  title: "Paatalashala — Telugu Cultural Ambience & Curation",
  description: "Handcrafted Telugu ambient soundscapes from nostalgic spaces. Cruise city streets in a Hyderabad mass auto, ride a farmland tractor, or relax in a retro saloon.",
  metadataBase: new URL("https://paatalashala.space"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎵</text></svg>',
  },
  openGraph: {
    title: "Paatalashala — Telugu Cultural Ambience & Curation",
    description: "Handcrafted Telugu ambient soundscapes from nostalgic spaces. Cruise city streets in a Hyderabad mass auto, ride a farmland tractor, or relax in a retro saloon.",
    url: "https://paatalashala.space",
    siteName: "Paatalashala",
    images: [
      {
        url: "https://paatalashala.space/images/readme_banner.png",
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
    title: "Paatalashala — Telugu Cultural Ambience & Curation",
    description: "Handcrafted Telugu ambient soundscapes from nostalgic spaces. Cruise city streets in a Hyderabad mass auto, ride a farmland tractor, or relax in a retro saloon.",
    images: ["https://paatalashala.space/images/readme_banner.png"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
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
      <body>
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
