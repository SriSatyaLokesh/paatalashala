export const dynamic = 'force-static';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://srisatyalokesh.is-a.dev/paatalashala";

export default function sitemap() {
  const routes = [
    "",
    "/spaces/gundamma-gramophone",
    "/spaces/campfire-jamming",
    "/spaces/ammama",
    "/spaces/thathayya",
    "/spaces/saloon",
    "/spaces/auto",
    "/spaces/tractor-anna",
    "/spaces/vennallo",
    "/spaces/sammelanam",
  ];

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : 0.85,
  }));
}
