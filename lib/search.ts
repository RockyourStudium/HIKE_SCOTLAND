import type { Route, Stay, Tour } from "@/data/types";
import type { Catalog } from "@/lib/catalog-client";

export type SearchKind = "route" | "tour" | "stay";

export interface SearchResult {
  kind: SearchKind;
  id: string;
  title: string;
  /** Kurze Zeile unter dem Titel, z.B. Region · Schwierigkeit. */
  subtitle: string;
  /** Optionales Karten-Bild (Pfad unter /public). */
  image?: string;
  /** Tailwind-Gradient als Bild-Fallback. */
  gradient: string;
  href: string;
}

/**
 * Baut den durchsuchbaren Text eines Items: nicht nur der Name, sondern alles,
 * was man damit assoziieren könnte (Region, Zielorte, Art, Gelände, Saison,
 * Ausstattung …). Wird gegen die Such-Tokens per Substring gematcht.
 */
function haystack(parts: (string | string[] | undefined)[]): string {
  return parts
    .flat()
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function routeText(r: Route): string {
  return haystack([
    r.name,
    r.region,
    r.difficulty,
    r.terrain,
    r.seasons,
    r.summary,
    r.highlights,
    r.description,
    "route hike walk trail",
    r.dogFriendly ? "dog friendly pet" : undefined,
    r.days > 1 ? "multi-day overnight" : "day walk",
  ]);
}

function tourText(t: Tour): string {
  return haystack([
    t.name,
    t.region,
    t.difficulty,
    t.summary,
    t.includes,
    t.description,
    "tour trip",
    t.guided ? "guided" : "self-guided independent",
  ]);
}

/** Umgangssprachliche Synonyme je Unterkunfts-Art (beide Schreibweisen finden). */
const stayTypeSynonyms: Record<Stay["type"], string> = {
  "B&B": "bed and breakfast b and b guesthouse",
  Bothy: "hut shelter cabin",
  Hostel: "backpacker dorm",
  Lodge: "cabin chalet glamping",
  Campsite: "camping tent pitch",
  Hotel: "inn",
};

function stayText(s: Stay): string {
  return haystack([
    s.name,
    s.type,
    stayTypeSynonyms[s.type],
    s.region,
    s.amenities,
    s.summary,
    "stay accommodation place to stay",
  ]);
}

/** Felder mit hohem Gewicht (Name/Region/Art) für die Relevanz-Sortierung. */
function strongText(parts: (string | undefined)[]): string {
  return parts.filter(Boolean).join(" ").toLowerCase();
}

interface Indexed {
  result: SearchResult;
  text: string;
  strong: string;
}

function buildIndex(catalog: Catalog): Indexed[] {
  const routes = catalog.routes.map<Indexed>((r) => ({
    result: {
      kind: "route",
      id: r.id,
      title: r.name,
      subtitle: `Route · ${r.region} · ${r.difficulty}`,
      image: r.image,
      gradient: r.gradient,
      href: `/routes/${r.id}`,
    },
    text: routeText(r),
    strong: strongText([r.name, r.region, r.difficulty]),
  }));

  const tours = catalog.tours.map<Indexed>((t) => ({
    result: {
      kind: "tour",
      id: t.id,
      title: t.name,
      subtitle: `Guided Tour · ${t.region} · ${t.days} days`,
      image: t.image,
      gradient: t.gradient,
      href: `/tours/${t.id}`,
    },
    text: tourText(t),
    strong: strongText([t.name, t.region]),
  }));

  const stays = catalog.stays.map<Indexed>((s) => ({
    result: {
      kind: "stay",
      id: s.id,
      title: s.name,
      subtitle: `Stay · ${s.type} · ${s.region}`,
      gradient: s.gradient,
      href: "/stays",
    },
    text: stayText(s),
    strong: strongText([s.name, s.type, s.region]),
  }));

  return [...routes, ...tours, ...stays];
}

/**
 * Assoziative Volltextsuche über Routes/Tours/Stays. Tokenisiert die Anfrage
 * und verlangt, dass jedes Token irgendwo im Item-Text vorkommt (AND); sortiert
 * dann nach Relevanz (Treffer in Name/Region zählen stärker).
 */
export function searchCatalog(
  query: string,
  catalog: Catalog,
  limit = 8,
): SearchResult[] {
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];

  const index = buildIndex(catalog);

  const scored = index
    .map((item) => {
      let score = 0;
      for (const token of tokens) {
        if (!item.text.includes(token)) return null; // Token muss vorkommen
        if (item.strong.startsWith(token)) score += 6;
        else if (item.strong.includes(token)) score += 4;
        else score += 1;
      }
      return { result: item.result, score };
    })
    .filter((x): x is { result: SearchResult; score: number } => x !== null)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((x) => x.result);
}
