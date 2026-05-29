import { routes } from "@/data/routes";
import { tours } from "@/data/tours";
import { stays } from "@/data/stays";
import type { Difficulty, Route, Stay, Terrain, Tour } from "@/data/types";

export interface Answers {
  experience: "Beginner" | "Some" | "Experienced" | "Expert";
  time: "Half day" | "Full day" | "Weekend" | "A week";
  scenery: Terrain[];
  region: string; // region name or "Anywhere"
  dog: "Yes" | "No";
  comfort: "Budget" | "Balanced" | "Comfort";
  guiding: "Independent" | "Guided" | "Either";
}

/** Difficulties a given experience level is comfortable with. */
const experienceToDifficulties: Record<Answers["experience"], Difficulty[]> = {
  Beginner: ["Easy"],
  Some: ["Easy", "Moderate"],
  Experienced: ["Easy", "Moderate", "Challenging"],
  Expert: ["Easy", "Moderate", "Challenging", "Expert"],
};

const timeToDays: Record<Answers["time"], { min: number; max: number }> = {
  "Half day": { min: 1, max: 1 },
  "Full day": { min: 1, max: 1 },
  Weekend: { min: 1, max: 3 },
  "A week": { min: 1, max: 8 },
};

const comfortToTypes: Record<Answers["comfort"], Stay["type"][]> = {
  Budget: ["Bothy", "Hostel", "Campsite"],
  Balanced: ["B&B", "Hostel", "Lodge", "Campsite"],
  Comfort: ["Hotel", "Lodge", "B&B"],
};

export interface Scored<T> {
  item: T;
  score: number;
  reasons: string[];
}

function scoreRoute(route: Route, a: Answers): Scored<Route> {
  let score = 0;
  const reasons: string[] = [];

  const allowed = experienceToDifficulties[a.experience];
  if (allowed.includes(route.difficulty)) {
    score += 4;
    // Prefer routes near the top of the user's ability.
    if (route.difficulty === allowed[allowed.length - 1]) {
      score += 1;
      reasons.push(`A good ${route.difficulty.toLowerCase()} challenge for your level`);
    } else {
      reasons.push(`Comfortable for a ${a.experience.toLowerCase()} hiker`);
    }
  } else {
    score -= 5; // too hard (or trivially easy for experts) — heavily downweight
  }

  const { min, max } = timeToDays[a.time];
  if (route.days >= min && route.days <= max) {
    score += 3;
    if (route.days > 1) reasons.push(`Fits a ${route.days}-day plan`);
    else reasons.push("Doable in a single outing");
  } else {
    score -= 2;
  }

  if (a.scenery.length > 0) {
    const overlap = route.terrain.filter((t) => a.scenery.includes(t));
    if (overlap.length > 0) {
      score += overlap.length * 2;
      reasons.push(`Features the ${overlap.join(" & ").toLowerCase()} you love`);
    }
  }

  if (a.region !== "Anywhere") {
    if (route.region === a.region) {
      score += 3;
      reasons.push(`In ${route.region}`);
    } else {
      score -= 1;
    }
  }

  if (a.dog === "Yes") {
    if (route.dogFriendly) {
      score += 2;
      reasons.push("Dog friendly");
    } else {
      score -= 4; // hard requirement
    }
  }

  return { item: route, score, reasons: reasons.slice(0, 3) };
}

function scoreTour(tour: Tour, a: Answers): Scored<Tour> {
  let score = 0;
  const reasons: string[] = [];

  const allowed = experienceToDifficulties[a.experience];
  if (allowed.includes(tour.difficulty)) score += 3;
  else score -= 4;

  const { min, max } = timeToDays[a.time];
  if (tour.days >= min && tour.days <= max) {
    score += 3;
    reasons.push(`A ${tour.days}-day trip that fits your time`);
  } else {
    score -= 2;
  }

  if (a.region !== "Anywhere" && tour.region === a.region) {
    score += 3;
    reasons.push(`Based in ${tour.region}`);
  }

  if (a.guiding === "Guided") {
    if (tour.guided) {
      score += 3;
      reasons.push("Fully guided");
    } else score -= 3;
  } else if (a.guiding === "Independent") {
    if (!tour.guided) {
      score += 3;
      reasons.push("Self-guided freedom");
    } else score -= 2;
  } else {
    score += 1;
  }

  return { item: tour, score, reasons: reasons.slice(0, 3) };
}

function scoreStay(stay: Stay, a: Answers): Scored<Stay> {
  let score = 0;
  const reasons: string[] = [];

  if (comfortToTypes[a.comfort].includes(stay.type)) {
    score += 3;
    reasons.push(`A ${stay.type.toLowerCase()} suits a ${a.comfort.toLowerCase()} trip`);
  }

  if (a.region !== "Anywhere" && stay.region === a.region) {
    score += 3;
    reasons.push(`Right in ${stay.region}`);
  }

  if (a.dog === "Yes" && stay.amenities.some((x) => /dog|pet/i.test(x))) {
    score += 2;
    reasons.push("Welcomes dogs");
  }

  score += stay.rating; // nudge by quality

  return { item: stay, score, reasons: reasons.slice(0, 2) };
}

export interface Recommendations {
  routes: Scored<Route>[];
  tours: Scored<Tour>[];
  stays: Scored<Stay>[];
}

export function recommend(a: Answers): Recommendations {
  const rankedRoutes = routes
    .map((r) => scoreRoute(r, a))
    .sort((x, y) => y.score - x.score)
    .slice(0, 3);

  const rankedTours = tours
    .map((t) => scoreTour(t, a))
    .filter((t) => t.score > 0)
    .sort((x, y) => y.score - x.score)
    .slice(0, 2);

  const rankedStays = stays
    .map((s) => scoreStay(s, a))
    .sort((x, y) => y.score - x.score)
    .slice(0, 3);

  return { routes: rankedRoutes, tours: rankedTours, stays: rankedStays };
}
