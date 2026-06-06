import { getSupabase } from "@/lib/supabase";
import type { Tables } from "@/types/database.types";
import type { Difficulty, Region, Route, Stay, Terrain, Tour } from "@/data/types";

// Katalog-Zugriff: liest Tours/Routes/Stays aus Supabase (public-read via anon)
// und mappt die DB-Zeilen (snake_case, jsonb) auf die App-Typen (camelCase,
// coords{lat,lng}). So bleiben die Props der Komponenten unverändert.

type Season = Route["seasons"][number];

const arr = <T,>(j: unknown): T[] => (Array.isArray(j) ? (j as T[]) : []);

function toTour(r: Tables<"tours">): Tour {
  return {
    id: r.id,
    name: r.name,
    region: r.region as Region,
    difficulty: r.difficulty as Difficulty,
    days: r.days,
    groupSize: r.group_size,
    pricePerPerson: r.price_per_person,
    guided: r.guided,
    summary: r.summary,
    description: arr<string>(r.description),
    includes: arr<string>(r.includes),
    gradient: r.gradient ?? "",
    coords: { lat: r.lat, lng: r.lng },
    image: r.image ?? undefined,
  };
}

function toRoute(r: Tables<"routes">): Route {
  return {
    id: r.id,
    name: r.name,
    region: r.region as Region,
    difficulty: r.difficulty as Difficulty,
    distanceKm: r.distance_km,
    ascentM: r.ascent_m,
    durationHours: r.duration_hours,
    days: r.days,
    terrain: arr<Terrain>(r.terrain),
    seasons: arr<Season>(r.seasons),
    dogFriendly: r.dog_friendly,
    summary: r.summary,
    description: arr<string>(r.description),
    highlights: arr<string>(r.highlights),
    gradient: r.gradient ?? "",
    coords: { lat: r.lat, lng: r.lng },
    image: r.image ?? undefined,
  };
}

function toStay(r: Tables<"stays">): Stay {
  return {
    id: r.id,
    name: r.name,
    type: r.type as Stay["type"],
    region: r.region as Region,
    pricePerNight: r.price_per_night,
    rating: r.rating,
    amenities: arr<string>(r.amenities),
    summary: r.summary,
    gradient: r.gradient ?? "",
    coords: { lat: r.lat, lng: r.lng },
  };
}

// --- Tours -------------------------------------------------------------------
export async function getTours(): Promise<Tour[]> {
  const { data, error } = await getSupabase()
    .from("tours").select("*").eq("active", true).order("name");
  if (error) throw error;
  return (data ?? []).map(toTour);
}

export async function getTourById(id: string): Promise<Tour | null> {
  const { data, error } = await getSupabase()
    .from("tours").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? toTour(data) : null;
}

// --- Routes ------------------------------------------------------------------
export async function getRoutes(): Promise<Route[]> {
  const { data, error } = await getSupabase()
    .from("routes").select("*").eq("active", true).order("name");
  if (error) throw error;
  return (data ?? []).map(toRoute);
}

export async function getRouteById(id: string): Promise<Route | null> {
  const { data, error } = await getSupabase()
    .from("routes").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? toRoute(data) : null;
}

// --- Stays -------------------------------------------------------------------
export async function getStays(): Promise<Stay[]> {
  const { data, error } = await getSupabase()
    .from("stays").select("*").eq("active", true).order("name");
  if (error) throw error;
  return (data ?? []).map(toStay);
}

export async function getStayById(id: string): Promise<Stay | null> {
  const { data, error } = await getSupabase()
    .from("stays").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? toStay(data) : null;
}
