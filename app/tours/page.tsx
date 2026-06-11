import type { Metadata } from "next";
import { getTours } from "@/lib/catalog";
import ToursView from "./ToursView";

// ISR: DB-Änderungen erscheinen ohne Deploy (alle 5 Min revalidiert).
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Guided Hiking Tours in Scotland",
  description:
    "Small-group guided hiking tours across the Highlands, Isle of Skye, Glencoe and the Cairngorms — from gentle day walks to multi-day Munro adventures.",
};

export default async function ToursPage() {
  const tours = await getTours();
  return <ToursView tours={tours} />;
}
