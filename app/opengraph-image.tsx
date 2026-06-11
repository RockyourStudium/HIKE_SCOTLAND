import { ogCard, ogSize, ogContentType } from "@/lib/og/card";

export const alt =
  "Hike Scotland — hiking routes, guided tours and trip planner for Scotland";
export const size = ogSize;
export const contentType = ogContentType;

// Site-weite Default-Card; Detailseiten (Tours/Routes/Destinations) haben
// eigene opengraph-image.tsx mit Item-Daten.
export default async function OpengraphImage() {
  return ogCard({
    eyebrow: "Explore Scotland on foot",
    title: "Discover & plan Scottish hiking adventures",
    facts: ["Hiking routes", "Guided tours", "Places to stay", "Trip planner"],
    image: "/heroes/landing.jpg",
  });
}
