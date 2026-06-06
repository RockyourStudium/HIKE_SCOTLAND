import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import type { Tables } from "@/types/database.types";

// Admin-Lesezugriff auf den Katalog. Bewusst über service_role (nicht den
// anon-Client aus lib/catalog.ts), damit auch INAKTIVE Items sichtbar sind.
// Server-only — nie clientseitig importieren.

export type TourRow = Tables<"tours">;
export type RouteRow = Tables<"routes">;
export type StayRow = Tables<"stays">;
export type DepartureRow = Tables<"tour_departures">;

// Erlaubte Werte (gespiegelt aus data/types.ts).
export const REGIONS = [
  "Highlands",
  "Isle of Skye",
  "Cairngorms",
  "Loch Lomond & Trossachs",
  "Glencoe",
  "Borders",
] as const;
export const DIFFICULTIES = ["Easy", "Moderate", "Challenging", "Expert"] as const;
export const TERRAINS = [
  "Coastal",
  "Mountain",
  "Forest",
  "Loch",
  "Glen",
  "Moorland",
] as const;
export const SEASONS = ["Spring", "Summer", "Autumn", "Winter"] as const;
export const STAY_TYPES = [
  "Bothy",
  "Hostel",
  "B&B",
  "Lodge",
  "Campsite",
  "Hotel",
] as const;
export const DEPARTURE_STATUSES = [
  "scheduled",
  "weather_hold",
  "cancelled",
  "completed",
] as const;

export async function listTours(): Promise<TourRow[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("tours")
    .select("*")
    .order("name");
  if (error) throw error;
  return data ?? [];
}

export async function getTour(id: string): Promise<TourRow | null> {
  const { data, error } = await getSupabaseAdmin()
    .from("tours")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function listRoutes(): Promise<RouteRow[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("routes")
    .select("*")
    .order("name");
  if (error) throw error;
  return data ?? [];
}

export async function getRoute(id: string): Promise<RouteRow | null> {
  const { data, error } = await getSupabaseAdmin()
    .from("routes")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function listStays(): Promise<StayRow[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("stays")
    .select("*")
    .order("name");
  if (error) throw error;
  return data ?? [];
}

export async function getStay(id: string): Promise<StayRow | null> {
  const { data, error } = await getSupabaseAdmin()
    .from("stays")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function listDeparturesForTour(
  tourId: string,
): Promise<DepartureRow[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("tour_departures")
    .select("*")
    .eq("tour_id", tourId)
    .order("departure_date");
  if (error) throw error;
  return data ?? [];
}

/** JSON-Array (string[]) für die "eine Zeile pro Eintrag"-Textareas. */
export function linesFromJson(j: unknown): string {
  return Array.isArray(j) ? (j as unknown[]).map(String).join("\n") : "";
}
