import type { Metadata } from "next";
import { getStays } from "@/lib/catalog";
import StaysView from "./StaysView";

// ISR: DB-Änderungen erscheinen ohne Deploy (alle 5 Min revalidiert).
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Hiking Accommodation in Scotland — Bothies, Hostels & Lodges",
  description:
    "Places to stay on your Scottish hiking trip: bothies, hostels, B&Bs, lodges and campsites near the best trails — from the Highlands to the Borders.",
};

export default async function StaysPage() {
  const stays = await getStays();
  return <StaysView stays={stays} />;
}
