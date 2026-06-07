import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/types/database.types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Reason = { code: string; message: string; item_id?: string };
const fail = (reasons: Reason[], status = 400) =>
  NextResponse.json({ ok: false, reasons }, { status });

/**
 * Gast-Buchung anlegen. Validiert, ruft dann die race-sichere DB-Funktion
 * create_booking via service_role auf (Verfügbarkeit + Preise + Insert in einer
 * Transaktion). Gibt { ok, booking_id, total } oder { ok:false, reasons } zurück.
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return fail([{ code: "invalid_body", message: "Invalid request." }]);
  }

  const items = Array.isArray(body.items) ? body.items : [];
  const startDate = String(body.startDate ?? "");
  const endDate = String(body.endDate ?? "");
  const partySize = Number(body.partySize ?? 0);

  if (items.length === 0)
    return fail([{ code: "empty_trip", message: "Your trip is empty." }]);

  const admin = getSupabaseAdmin();

  // Eingeloggte Nutzer müssen keine Kontaktdaten eingeben — wir leiten Name und
  // E-Mail aus Konto/Profil ab (Client-Werte werden für sie ignoriert). Gäste
  // liefern Name + E-Mail wie bisher.
  const {
    data: { user },
  } = await createClient().auth.getUser();

  let name: string;
  let email: string;
  if (user) {
    const { data: profile } = await admin
      .from("profiles")
      .select("name, email")
      .eq("id", user.id)
      .single();
    const meta = user.user_metadata as { full_name?: string; name?: string } | null;
    email = (profile?.email || user.email || "").trim().toLowerCase();
    name = (profile?.name || meta?.full_name || meta?.name || email).trim();
  } else {
    name = String(body.name ?? "").trim();
    email = String(body.email ?? "").trim().toLowerCase();
    if (!name)
      return fail([{ code: "missing_contact", message: "Please provide your name." }]);
    if (!EMAIL_RE.test(email))
      return fail([{ code: "missing_contact", message: "Please provide a valid email address." }]);
  }
  const { data, error } = await admin.rpc("create_booking", {
    p_items: items as unknown as Json,
    p_start: startDate,
    p_end: endDate,
    p_party_size: partySize,
    p_guest_name: name,
    p_guest_email: email,
  });

  if (error) {
    return fail([{ code: "db_error", message: "Booking failed. Please try again." }], 500);
  }

  // Ist der Besucher eingeloggt, die soeben angelegte Buchung mit dem Konto
  // verknüpfen (sonst bleibt es eine Gastbuchung mit user_id = null).
  const result = data as { ok?: boolean; booking_id?: string } | null;
  if (result?.booking_id && user) {
    await admin
      .from("bookings")
      .update({ user_id: user.id })
      .eq("id", result.booking_id);
  }

  return NextResponse.json(data);
}
