import type { Metadata } from "next";

// Die Seite selbst ist eine Client-Komponente — Metadata lebt deshalb hier.
export const metadata: Metadata = {
  title: "Scotland Hiking Trip Planner",
  description:
    "Answer a few quick questions and get a personalised Scottish hiking itinerary — matched routes, guided tours and places to stay.",
};

export default function PlanLayout({ children }: { children: React.ReactNode }) {
  return children;
}
