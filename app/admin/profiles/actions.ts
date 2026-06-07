"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { createClient } from "@/lib/supabase/server";
import { ROLES } from "@/lib/admin/queries";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function currentUserId(): Promise<string | null> {
  const {
    data: { user },
  } = await createClient().auth.getUser();
  return user?.id ?? null;
}

/** Rolle eines Profils ändern (Schnellaktion aus der Liste). */
export async function updateProfileRole(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  const role = String(formData.get("role") ?? "");
  if (!id || !ROLES.includes(role as (typeof ROLES)[number])) return;

  // Selbst-Sperre vermeiden: der eingeloggte Admin kann sich nicht selbst herabstufen.
  if (id === (await currentUserId()) && role !== "admin") {
    redirect("/admin/profiles?err=self");
  }

  const { error } = await getSupabaseAdmin()
    .from("profiles")
    .update({ role })
    .eq("id", id);
  if (error) redirect("/admin/profiles?err=db");

  revalidatePath("/admin/profiles");
  redirect("/admin/profiles?ok=role");
}

/** Vollständiges Profil bearbeiten (Detailseite). */
export async function updateProfileFields(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const name = String(formData.get("name") ?? "").trim() || null;
  const email = String(formData.get("email") ?? "").trim().toLowerCase() || null;
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const address = String(formData.get("address") ?? "").trim() || null;
  const role = String(formData.get("role") ?? "user");

  if (email && !EMAIL_RE.test(email)) redirect(`/admin/profiles/${id}?err=email`);
  if (!ROLES.includes(role as (typeof ROLES)[number]))
    redirect(`/admin/profiles/${id}?err=role`);

  if (id === (await currentUserId()) && role !== "admin") {
    redirect(`/admin/profiles/${id}?err=self`);
  }

  const { error } = await getSupabaseAdmin()
    .from("profiles")
    .update({ name, email, phone, address, role })
    .eq("id", id);

  if (error) {
    const code = (error as { code?: string }).code === "23505" ? "dup" : "db";
    redirect(`/admin/profiles/${id}?err=${code}`);
  }

  revalidatePath(`/admin/profiles/${id}`);
  revalidatePath("/admin/profiles");
  redirect(`/admin/profiles/${id}?ok=saved`);
}
