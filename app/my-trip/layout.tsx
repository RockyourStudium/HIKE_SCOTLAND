import type { Metadata } from "next";

// Die Seite selbst ist eine Client-Komponente — Metadata lebt deshalb hier.
// Persönlicher Itinerary-Inhalt (localStorage) — gehört nicht in den Index.
export const metadata: Metadata = {
  title: "My Trip",
  robots: { index: false, follow: false },
};

export default function MyTripLayout({ children }: { children: React.ReactNode }) {
  return children;
}
