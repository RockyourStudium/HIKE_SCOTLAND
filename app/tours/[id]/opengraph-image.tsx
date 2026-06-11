import { getTourById } from "@/lib/catalog";
import { ogCard, ogSize, ogContentType } from "@/lib/og/card";

// ISR: DB-Änderungen erscheinen ohne Deploy (alle 5 Min revalidiert).
export const revalidate = 300;

export const alt = "Tour details — Hike Scotland";
export const size = ogSize;
export const contentType = ogContentType;

export default async function OpengraphImage({
  params,
}: {
  params: { id: string };
}) {
  const tour = await getTourById(params.id);
  if (!tour) {
    return ogCard({
      eyebrow: "Guided hiking tours",
      title: "Hike Scotland",
      image: "/heroes/landing.jpg",
    });
  }
  return ogCard({
    eyebrow: tour.guided ? "Guided hiking tour" : "Self-guided hiking tour",
    title: tour.name,
    facts: [
      `${tour.days} ${tour.days === 1 ? "day" : "days"}`,
      tour.difficulty,
      tour.region,
      `from £${tour.pricePerPerson} pp`,
    ],
    image: tour.image ?? "/heroes/landing.jpg",
  });
}
