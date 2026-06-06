import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
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
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const startDate = String(body.startDate ?? "");
  const endDate = String(body.endDate ?? "");
  const partySize = Number(body.partySize ?? 0);

  if (items.length === 0)
    return fail([{ code: "empty_trip", message: "Your trip is empty." }]);
  if (!name)
    return fail([{ code: "missing_contact", message: "Please provide your name." }]);
  if (!EMAIL_RE.test(email))
    return fail([{ code: "missing_contact", message: "Please provide a valid email address." }]);

  const admin = getSupabaseAdmin();
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
  return NextResponse.json(data);
}
