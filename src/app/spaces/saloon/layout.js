export const metadata = {
  title: "Royal Saloon | Retro Telugu TV Melodies | Paatalashala",
  description: "Sit back in a retro barbershop chair, watch classic Telugu music videos inside a vintage TV frame, and let the afternoon breeze and ceiling fan hum take you back.",
  keywords: ["Royal saloon", "retro barbershop TV", "classic Telugu video songs", "90s Telugu music", "barber shop ambient", "ceiling fan hum", "retro television filter"],
  openGraph: {
    title: "Royal Saloon | Retro Telugu TV Melodies | Paatalashala",
    description: "timeless Telugu classics playing inside a vintage barbershop TV frame.",
    images: [{ url: "/images/saloon_background.jpg" }],
  }
};

export default function SaloonLayout({ children }) {
  return <>{children}</>;
}
