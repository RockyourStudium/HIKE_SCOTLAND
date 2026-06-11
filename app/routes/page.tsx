import type { Metadata } from "next";
import { getRoutes } from "@/lib/catalog";
import RoutesView from "./RoutesView";

// ISR: DB-Änderungen erscheinen ohne Deploy (alle 5 Min revalidiert).
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Hiking Routes & Trails in Scotland",
  description:
    "Browse Scotland's best hiking routes — from loch-side strolls to Munro summits. Filter by region, difficulty, distance, terrain and season.",
};

export default async function RoutesPage() {
  const routes = await getRoutes();
  return <RoutesView routes={routes} />;
}
