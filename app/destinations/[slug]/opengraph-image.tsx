import { getDestinationBySlug } from "@/data/destinations";
import { ogCard, ogSize, ogContentType } from "@/lib/og/card";

export const alt = "Destination — Hike Scotland";
export const size = ogSize;
export const contentType = ogContentType;

export default async function OpengraphImage({
  params,
}: {
  params: { slug: string };
}) {
  const dest = getDestinationBySlug(params.slug);
  if (!dest) {
    return ogCard({
      eyebrow: "Destinations",
      title: "Hike Scotland",
      image: "/heroes/landing.jpg",
    });
  }
  return ogCard({
    eyebrow: dest.tagline,
    title: `Hiking in ${dest.name}`,
    facts: [dest.region, "Routes · Tours · Stays"],
    // Bewusst direkter Pfad statt heroImage(): der fs-Check darin liefe auf
    // Vercel zur Laufzeit ins Leere — die Hero-JPGs existieren für alle Slugs.
    image: `/heroes/${dest.slug}.jpg`,
  });
}
