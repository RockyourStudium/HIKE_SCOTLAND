"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { BOOKING_STATUSES, PAYMENT_STATUSES } from "@/lib/admin/queries";

const ALLOWED: Record<string, readonly string[]> = {
  status: BOOKING_STATUSES,
  payment_status: PAYMENT_STATUSES,
};

/**
 * Ändert ein einzelnes Status-Feld einer Buchung (status oder payment_status).
 * `field` wählt die Spalte, `status` trägt den neuen Wert (Konvention von
 * AutoSubmitSelect). Whitelist verhindert Schreiben fremder Spalten/Werte.
 */
export async function updateBookingField(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  const field = String(formData.get("field") ?? "");
  const value = String(formData.get("status") ?? "");

  const allowed = ALLOWED[field];
  if (!id || !allowed || !allowed.includes(value)) return;

  // Explizit getypt statt dynamischem Key — Supabase' Update-Typ verbietet
  // String-Index-Signaturen.
  const patch =
    field === "status" ? { status: value } : { payment_status: value };

  const { error } = await getSupabaseAdmin()
    .from("bookings")
    .update(patch)
    .eq("id", id);
  if (error) redirect("/admin/bookings?err=db");

  revalidatePath("/admin/bookings");
  revalidatePath(`/admin/bookings/${id}`);
}

/** Setzt bookings.total auf die Summe der verbleibenden Posten-Zeilen. */
async function recomputeBookingTotal(bookingId: string): Promise<void> {
  const admin = getSupabaseAdmin();
  const { data } = await admin
    .from("booking_items")
    .select("line_total")
    .eq("booking_id", bookingId);
  const total = (data ?? []).reduce((s, r) => s + Number(r.line_total ?? 0), 0);
  await admin
    .from("bookings")
    .update({ total: Math.round(total * 100) / 100 })
    .eq("id", bookingId);
}

/**
 * Bearbeitet einen Buchungs-Posten (Titel, Menge, Einzelpreis). Zeilensumme
 * wird serverseitig als Menge × Einzelpreis neu berechnet, danach die
 * Buchungs-Summe. item_type/item_id bleiben unangetastet.
 */
export async function updateBookingItem(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  const bookingId = String(formData.get("booking_id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const quantity = Math.max(1, Math.trunc(Number(formData.get("quantity") ?? 1)));
  const unitPrice = Math.max(0, Number(formData.get("unit_price") ?? 0));

  if (!id || !bookingId || !title || !Number.isFinite(unitPrice)) return;

  const lineTotal = Math.round(quantity * unitPrice * 100) / 100;

  const { error } = await getSupabaseAdmin()
    .from("booking_items")
    .update({
      title,
      quantity,
      unit_price: unitPrice,
      line_total: lineTotal,
    })
    .eq("id", id);
  if (error) redirect(`/admin/bookings/${bookingId}?err=db`);

  await recomputeBookingTotal(bookingId);
  revalidatePath("/admin/bookings");
  revalidatePath(`/admin/bookings/${bookingId}`);
  redirect(`/admin/bookings/${bookingId}?ok=item_saved`);
}

/** Löscht einen Buchungs-Posten und rechnet die Buchungs-Summe neu. */
export async function deleteBookingItem(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  const bookingId = String(formData.get("booking_id") ?? "");
  if (!id || !bookingId) return;

  const { error } = await getSupabaseAdmin()
    .from("booking_items")
    .delete()
    .eq("id", id);
  if (error) redirect(`/admin/bookings/${bookingId}?err=db`);

  await recomputeBookingTotal(bookingId);
  revalidatePath("/admin/bookings");
  revalidatePath(`/admin/bookings/${bookingId}`);
  redirect(`/admin/bookings/${bookingId}?ok=item_deleted`);
}
