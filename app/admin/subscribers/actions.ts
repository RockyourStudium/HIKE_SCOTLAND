"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Setzt confirmed_at / unsubscribed_at passend zum Zielstatus. */
function statusTimestamps(status: string) {
  const now = new Date().toISOString();
  if (status === "subscribed")
    return { confirmed_at: now, unsubscribed_at: null };
  if (status === "unsubscribed")
    return { unsubscribed_at: now };
  return {}; // pending: nichts setzen
}

export async function addSubscriber(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const firstName = String(formData.get("first_name") ?? "").trim() || null;
  const status = String(formData.get("status") ?? "subscribed");
  const source = String(formData.get("source") ?? "").trim() || "admin";

  if (!EMAIL_RE.test(email)) redirect("/admin/subscribers?err=email");

  const { error } = await getSupabaseAdmin().from("subscribers").insert({
    email,
    first_name: firstName,
    status,
    source,
    ...statusTimestamps(status),
  });

  if (error) {
    // 23505 = unique violation → E-Mail existiert bereits.
    if ((error as { code?: string }).code === "23505")
      redirect("/admin/subscribers?err=dup");
    redirect("/admin/subscribers?err=db");
  }

  revalidatePath("/admin/subscribers");
  redirect("/admin/subscribers?ok=added");
}

export async function updateSubscriberStatus(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !status) return;

  const { error } = await getSupabaseAdmin()
    .from("subscribers")
    .update({ status, ...statusTimestamps(status) })
    .eq("id", id);
  if (error) redirect("/admin/subscribers?err=db");

  revalidatePath("/admin/subscribers");
}

export async function deleteSubscriber(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const { error } = await getSupabaseAdmin()
    .from("subscribers")
    .delete()
    .eq("id", id);
  if (error) redirect("/admin/subscribers?err=db");

  revalidatePath("/admin/subscribers");
  redirect("/admin/subscribers?ok=deleted");
}
