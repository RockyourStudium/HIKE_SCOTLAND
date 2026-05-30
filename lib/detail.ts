import type { Difficulty, Region } from "@/data/types";
import { destinations } from "@/data/destinations";

/** Recommended kit, scaled to how demanding the walk is. */
export function gearFor(difficulty: Difficulty): string[] {
  const base = [
    "Sturdy walking boots",
    "Waterproof jacket & warm layers",
    "Plenty of water & snacks",
    "Map / GPS or phone with offline maps",
  ];
  if (difficulty === "Easy") return base;
  if (difficulty === "Moderate") {
    return [...base, "Walking poles (optional)", "Spare warm layer"];
  }
  // Challenging & Expert
  return [
    ...base,
    "Walking poles",
    "Full waterproofs & spare insulating layers",
    "Head torch, whistle & first-aid kit",
    "Hat, gloves & sun protection",
  ];
}

/** A short fitness note keyed to difficulty. */
export function fitnessNote(difficulty: Difficulty): string {
  switch (difficulty) {
    case "Easy":
      return "Suitable for most people, including families. No special experience needed.";
    case "Moderate":
      return "A reasonable level of fitness helps; expect some sustained climbs or uneven ground.";
    case "Challenging":
      return "For fit, regular walkers. Expect long days, significant ascent and exposed sections.";
    case "Expert":
      return "Serious mountain terrain for experienced hill-walkers with navigation skills.";
  }
}

/** The destination record for a region, for reusing best-time / getting-there copy. */
export function destinationForRegion(region: Region) {
  return destinations.find((d) => d.region === region);
}
