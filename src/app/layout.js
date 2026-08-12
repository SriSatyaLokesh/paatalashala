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

export const metadata = {
  title: "Paatalashala — Telugu Cultural Ambience & Curation",
  description: "Immersive web experiences featuring curated Telugu music and atmosphere. Step into a highway truck, a retro saloon, and other places where nostalgia plays continuously.",
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
