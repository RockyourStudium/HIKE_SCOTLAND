"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const BASE = "/admin/catalog/routes";

const lines = (v: FormDataEntryValue | null): string[] =>
  String(v ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
const bool = (fd: FormData, k: string) => fd.get(k) === "on";
const num = (v: FormDataEntryValue | null) => Number(v ?? 0);
const str = (v: FormDataEntryValue | null) => String(v ?? "").trim();
const orNull = (v: FormDataEntryValue | null) => str(v) || null;

function revalidateRoute(id: string) {
  revalidatePath(BASE);
  revalidatePath(`${BASE}/${id}`);
  revalidatePath("/routes");
  revalidatePath(`/routes/${id}`);
  revalidatePath("/plan");
}

export async function saveRoute(formData: FormData): Promise<void> {
  const originalId = str(formData.get("original_id"));
  const id = str(formData.get("id"));
  const name = str(formData.get("name"));
  if (!id || !name) redirect(`${BASE}/${originalId || "new"}?err=required`);

  const row = {
    name,
    region: str(formData.get("region")),
    difficulty: str(formData.get("difficulty")),
    distance_km: num(formData.get("distance_km")),
    ascent_m: Math.trunc(num(formData.get("ascent_m"))),
    duration_hours: num(formData.get("duration_hours")),
    days: Math.trunc(num(formData.get("days"))),
    terrain: formData.getAll("terrain").map(String),
    seasons: formData.getAll("seasons").map(String),
    dog_friendly: bool(formData, "dog_friendly"),
    summary: str(formData.get("summary")),
    description: lines(formData.get("description")),
    highlights: lines(formData.get("highlights")),
    gradient: orNull(formData.get("gradient")),
    image: orNull(formData.get("image")),
    lat: num(formData.get("lat")),
    lng: num(formData.get("lng")),
    active: bool(formData, "active"),
  };

  const admin = getSupabaseAdmin();
  if (originalId) {
    const { error } = await admin.from("routes").update(row).eq("id", originalId);
    if (error) redirect(`${BASE}/${originalId}?err=db`);
    revalidateRoute(originalId);
  } else {
    const { error } = await admin.from("routes").insert({ id, ...row });
    if (error) {
      if ((error as { code?: string }).code === "23505")
        redirect(`${BASE}/new?err=dup`);
      redirect(`${BASE}/new?err=db`);
    }
    revalidateRoute(id);
  }
  redirect(`${BASE}?ok=saved`);
}

export async function toggleRoute(formData: FormData): Promise<void> {
  const id = str(formData.get("id"));
  const active = formData.get("active") === "true";
  if (!id) return;
  const { error } = await getSupabaseAdmin()
    .from("routes")
    .update({ active })
    .eq("id", id);
  if (error) redirect(`${BASE}?err=db`);
  revalidateRoute(id);
}

export async function deleteRoute(formData: FormData): Promise<void> {
  const id = str(formData.get("id"));
  if (!id) return;
  const { error } = await getSupabaseAdmin().from("routes").delete().eq("id", id);
  if (error) redirect(`${BASE}?err=db`);
  revalidateRoute(id);
  redirect(`${BASE}?ok=deleted`);
}
