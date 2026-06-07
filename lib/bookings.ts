import type { AvailabilityReason, BookableKind } from "@/lib/availability";

export interface BookingItemInput {
  item_type: BookableKind;
  item_id: string;
  nights?: number;
  position?: number;
}

export interface CreateBookingInput {
  items: BookingItemInput[];
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  partySize: number;
  /** Nur für Gäste nötig; bei eingeloggten Nutzern leitet der Server die
   *  Kontaktdaten aus dem Konto/Profil ab. */
  name?: string;
  email?: string;
}

export interface CreateBookingResult {
  ok: boolean;
  booking_id?: string;
  total?: number;
  reasons?: AvailabilityReason[];
}

/**
 * Legt eine (Gast-)Buchung an. Geht über /api/bookings (serverseitig,
 * service_role) — die DB-Funktion create_booking prüft race-sicher die
 * Verfügbarkeit, friert Preise ein und legt Buchung + Posten an.
 */
export async function createBooking(
  input: CreateBookingInput,
): Promise<CreateBookingResult> {
  try {
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = (await res.json()) as CreateBookingResult;
    return data;
  } catch {
    return {
      ok: false,
      reasons: [{ code: "network", message: "Something went wrong. Please try again." }],
    };
  }
}
