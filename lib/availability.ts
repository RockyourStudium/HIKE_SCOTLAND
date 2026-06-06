import { getSupabase } from "@/lib/supabase";
import type { Json } from "@/types/database.types";

export type BookableKind = "route" | "tour" | "stay";

export interface AvailabilityReason {
  code:
    | "guides_full"
    | "stay_full"
    | "stay_unknown"
    | "invalid_dates"
    | "invalid_party";
  message: string;
  item_id?: string;
}

export interface AvailabilityResult {
  ok: boolean;
  reasons: AvailabilityReason[];
}

export interface AvailabilityQuery {
  items: { item_type: BookableKind; item_id: string }[];
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  partySize: number;
}

/**
 * Prüft serverseitig (SQL-Funktion, SECURITY DEFINER), ob eine Buchung im
 * gewählten Zeitraum möglich ist: globale Begleitkapazität (Routes+Tours) und
 * Stay-Personen-Kapazität. Gibt nur { ok, reasons } zurück — keine fremden Daten.
 */
export async function checkBookingAvailability(
  q: AvailabilityQuery,
): Promise<AvailabilityResult> {
  const { data, error } = await getSupabase().rpc("check_booking_availability", {
    p_items: q.items as unknown as Json,
    p_start: q.startDate,
    p_end: q.endDate,
    p_party_size: q.partySize,
  });
  if (error) throw error;
  return (data as unknown as AvailabilityResult) ?? { ok: false, reasons: [] };
}
