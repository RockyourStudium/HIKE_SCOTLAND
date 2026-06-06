"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const BASE = "/admin/catalog/stays";

const lines = (v: FormDataEntryValue | null): string[] =>
  String(v ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
const bool = (fd: FormData, k: string) => fd.get(k) === "on";
const num = (v: FormDataEntryValue | null) => Number(v ?? 0);
const str = (v: FormDataEntryValue | null) => String(v ?? "").trim();
const orNull = (v: FormDataEntryValue | null) => str(v) || null;

function revalidateStay(id: string) {
  revalidatePath(BASE);
  revalidatePath(`${BASE}/${id}`);
  revalidatePath("/stays");
  revalidatePath("/plan");
}

export async function saveStay(formData: FormData): Promise<void> {
  const originalId = str(formData.get("original_id"));
  const id = str(formData.get("id"));
  const name = str(formData.get("name"));
  if (!id || !name) redirect(`${BASE}/${originalId || "new"}?err=required`);

  const row = {
    name,
    type: str(formData.get("type")),
    region: str(formData.get("region")),
    price_per_night: num(formData.get("price_per_night")),
    rating: Math.min(5, Math.max(0, num(formData.get("rating")))),
    max_guests: Math.max(1, Math.trunc(num(formData.get("max_guests")))),
    amenities: lines(formData.get("amenities")),
    summary: str(formData.get("summary")),
    gradient: orNull(formData.get("gradient")),
    lat: num(formData.get("lat")),
    lng: num(formData.get("lng")),
    active: bool(formData, "active"),
  };

  const admin = getSupabaseAdmin();
  if (originalId) {
    const { error } = await admin.from("stays").update(row).eq("id", originalId);
    if (error) redirect(`${BASE}/${originalId}?err=db`);
    revalidateStay(originalId);
  } else {
    const { error } = await admin.from("stays").insert({ id, ...row });
    if (error) {
      if ((error as { code?: string }).code === "23505")
        redirect(`${BASE}/new?err=dup`);
      redirect(`${BASE}/new?err=db`);
    }
    revalidateStay(id);
  }
  redirect(`${BASE}?ok=saved`);
}

export async function toggleStay(formData: FormData): Promise<void> {
  const id = str(formData.get("id"));
  const active = formData.get("active") === "true";
  if (!id) return;
  const { error } = await getSupabaseAdmin()
    .from("stays")
    .update({ active })
    .eq("id", id);
  if (error) redirect(`${BASE}?err=db`);
  revalidateStay(id);
}

export async function deleteStay(formData: FormData): Promise<void> {
  const id = str(formData.get("id"));
  if (!id) return;
  const { error } = await getSupabaseAdmin().from("stays").delete().eq("id", id);
  if (error) redirect(`${BASE}?err=db`);
  revalidateStay(id);
  redirect(`${BASE}?ok=deleted`);
}
