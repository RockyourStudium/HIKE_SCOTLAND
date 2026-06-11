import { getRouteById } from "@/lib/catalog";
import { ogCard, ogSize, ogContentType } from "@/lib/og/card";

// ISR: DB-Änderungen erscheinen ohne Deploy (alle 5 Min revalidiert).
export const revalidate = 300;

export const alt = "Route details — Hike Scotland";
export const size = ogSize;
export const contentType = ogContentType;

export default async function OpengraphImage({
  params,
}: {
  params: { id: string };
}) {
  const route = await getRouteById(params.id);
  if (!route) {
    return ogCard({
      eyebrow: "Hiking routes",
      title: "Hike Scotland",
      image: "/heroes/landing.jpg",
    });
  }
  return ogCard({
    eyebrow: "Hiking route",
    title: route.name,
    facts: [
      `${route.distanceKm} km`,
      `${route.ascentM} m ascent`,
      route.difficulty,
      route.region,
    ],
    image: route.image ?? "/heroes/landing.jpg",
  });
}
