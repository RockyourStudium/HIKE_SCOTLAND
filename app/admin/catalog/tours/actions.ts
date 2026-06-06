"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const BASE = "/admin/catalog/tours";

// --- Hilfen ------------------------------------------------------------------
const lines = (v: FormDataEntryValue | null): string[] =>
  String(v ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
const bool = (fd: FormData, k: string) => fd.get(k) === "on";
const num = (v: FormDataEntryValue | null) => Number(v ?? 0);
const str = (v: FormDataEntryValue | null) => String(v ?? "").trim();
const orNull = (v: FormDataEntryValue | null) => str(v) || null;

/** Frischt die öffentlichen (statisch gerenderten) Tour-Seiten + Admin auf. */
function revalidateTour(id: string) {
  revalidatePath(BASE);
  revalidatePath(`${BASE}/${id}`);
  revalidatePath("/tours");
  revalidatePath(`/tours/${id}`);
  revalidatePath("/plan");
}

export async function saveTour(formData: FormData): Promise<void> {
  const originalId = str(formData.get("original_id"));
  const id = str(formData.get("id"));
  const name = str(formData.get("name"));
  if (!id || !name) redirect(`${BASE}/${originalId || "new"}?err=required`);

  const row = {
    name,
    region: str(formData.get("region")),
    difficulty: str(formData.get("difficulty")),
    days: Math.trunc(num(formData.get("days"))),
    group_size: str(formData.get("group_size")),
    price_per_person: num(formData.get("price_per_person")),
    guided: bool(formData, "guided"),
    summary: str(formData.get("summary")),
    description: lines(formData.get("description")),
    includes: lines(formData.get("includes")),
    gradient: orNull(formData.get("gradient")),
    image: orNull(formData.get("image")),
    lat: num(formData.get("lat")),
    lng: num(formData.get("lng")),
    active: bool(formData, "active"),
  };

  const admin = getSupabaseAdmin();
  if (originalId) {
    const { error } = await admin.from("tours").update(row).eq("id", originalId);
    if (error) redirect(`${BASE}/${originalId}?err=db`);
    revalidateTour(originalId);
  } else {
    const { error } = await admin.from("tours").insert({ id, ...row });
    if (error) {
      if ((error as { code?: string }).code === "23505")
        redirect(`${BASE}/new?err=dup`);
      redirect(`${BASE}/new?err=db`);
    }
    revalidateTour(id);
  }
  redirect(`${BASE}?ok=saved`);
}

export async function toggleTour(formData: FormData): Promise<void> {
  const id = str(formData.get("id"));
  const active = formData.get("active") === "true";
  if (!id) return;
  const { error } = await getSupabaseAdmin()
    .from("tours")
    .update({ active })
    .eq("id", id);
  if (error) redirect(`${BASE}?err=db`);
  revalidateTour(id);
}

export async function deleteTour(formData: FormData): Promise<void> {
  const id = str(formData.get("id"));
  if (!id) return;
  const { error } = await getSupabaseAdmin().from("tours").delete().eq("id", id);
  if (error) redirect(`${BASE}?err=db`);
  revalidateTour(id);
  redirect(`${BASE}?ok=deleted`);
}

// --- Termine (tour_departures) ----------------------------------------------
export async function saveDeparture(formData: FormData): Promise<void> {
  const tourId = str(formData.get("tour_id"));
  const id = str(formData.get("id")); // leer = neu
  const capacity = Math.max(0, Math.trunc(num(formData.get("capacity"))));
  const seats = Math.max(0, Math.trunc(num(formData.get("seats_remaining"))));
  const date = str(formData.get("departure_date"));
  const priceRaw = str(formData.get("price_per_person"));
  const status = str(formData.get("status"));

  if (!tourId || !date) redirect(`${BASE}/${tourId}?err=dep_required`);
  // seats_remaining darf Kapazität nicht übersteigen (DB-Constraint spiegeln).
  const seatsClamped = Math.min(seats, capacity);

  const row = {
    tour_id: tourId,
    departure_date: date,
    capacity,
    seats_remaining: seatsClamped,
    price_per_person: priceRaw ? num(priceRaw) : null,
    status: status || "scheduled",
  };

  const admin = getSupabaseAdmin();
  if (id) {
    const { error } = await admin
      .from("tour_departures")
      .update(row)
      .eq("id", id);
    if (error) redirect(`${BASE}/${tourId}?err=db`);
  } else {
    const { error } = await admin.from("tour_departures").insert(row);
    if (error) redirect(`${BASE}/${tourId}?err=db`);
  }
  revalidatePath(`${BASE}/${tourId}`);
  redirect(`${BASE}/${tourId}?ok=dep_saved`);
}

export async function deleteDeparture(formData: FormData): Promise<void> {
  const tourId = str(formData.get("tour_id"));
  const id = str(formData.get("id"));
  if (!id) return;
  const { error } = await getSupabaseAdmin()
    .from("tour_departures")
    .delete()
    .eq("id", id);
  if (error) redirect(`${BASE}/${tourId}?err=db`);
  revalidatePath(`${BASE}/${tourId}`);
  redirect(`${BASE}/${tourId}?ok=dep_deleted`);
}
