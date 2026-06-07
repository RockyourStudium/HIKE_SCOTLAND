"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import sharp from "sharp";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import {
  SOCIAL_PLATFORMS,
  normalizeHandle,
  normalizeUsername,
  normalizeWebsite,
  validateUsername,
  type Socials,
} from "@/lib/profile";

const AVATAR_BUCKET = "avatars";
const MAX_AVATAR_BYTES = 5 * 1024 * 1024; // 5 MB Rohdatei vor dem Resize

/**
 * Aktualisiert das öffentliche Profil über den cookie-bewussten Client
 * (RLS „update own"). Username case-insensitiv eindeutig (DB-Index → 23505).
 * Öffentlich-Schalten setzt einen gültigen Username voraus.
 */
export async function updatePublicProfile(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/?auth_required=1");

  const username = normalizeUsername(String(formData.get("username") ?? ""));
  const usernameState = validateUsername(username);
  if (usernameState === "format") redirect("/account/profile?err=username_format");
  if (usernameState === "reserved") redirect("/account/profile?err=username_reserved");

  const isPublic = formData.get("is_public") === "on";
  if (isPublic && !username) redirect("/account/profile?err=public_needs_username");

  const websiteRaw = String(formData.get("website") ?? "").trim();
  const website = websiteRaw ? normalizeWebsite(websiteRaw) : null;
  if (websiteRaw && !website) redirect("/account/profile?err=website_invalid");

  const socials: Socials = {};
  for (const { key } of SOCIAL_PLATFORMS) {
    const handle = normalizeHandle(String(formData.get(`social_${key}`) ?? ""));
    if (handle) socials[key] = handle;
  }

  const displayName = String(formData.get("display_name") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();

  const { error } = await supabase
    .from("profiles")
    .update({
      username,
      display_name: displayName || null,
      location: location || null,
      bio: bio ? bio.slice(0, 600) : null,
      website,
      socials,
      is_public: isPublic,
    })
    .eq("id", user.id);

  if (error) {
    redirect(`/account/profile?err=${error.code === "23505" ? "username_taken" : "save"}`);
  }

  if (username) revalidatePath(`/profiles/${username}`);
  revalidatePath("/account/profile");
  redirect("/account/profile?saved=1");
}

/**
 * Avatar-Upload: serverseitig mit sharp auf 400×400 webp normalisiert und über
 * service_role in den public-read Bucket gelegt. Die Public-URL (mit Cache-Bust)
 * landet in profiles.avatar_url.
 */
export async function uploadAvatar(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/?auth_required=1");

  const file = formData.get("avatar");
  if (!(file instanceof File) || file.size === 0) {
    redirect("/account/profile?err=avatar_missing");
  }
  if (!file.type.startsWith("image/")) redirect("/account/profile?err=avatar_type");
  if (file.size > MAX_AVATAR_BYTES) redirect("/account/profile?err=avatar_size");

  let webp: Buffer;
  try {
    const input = Buffer.from(await file.arrayBuffer());
    webp = await sharp(input)
      .rotate()
      .resize(400, 400, { fit: "cover", position: "centre" })
      .webp({ quality: 82 })
      .toBuffer();
  } catch {
    redirect("/account/profile?err=avatar_type");
  }

  const admin = getSupabaseAdmin();
  const path = `${user.id}/avatar.webp`;
  const { error: upErr } = await admin.storage
    .from(AVATAR_BUCKET)
    .upload(path, webp, { contentType: "image/webp", upsert: true });
  if (upErr) redirect("/account/profile?err=avatar_save");

  const {
    data: { publicUrl },
  } = admin.storage.from(AVATAR_BUCKET).getPublicUrl(path);
  // Cache-Bust, weil der Pfad konstant bleibt.
  const url = `${publicUrl}?v=${Date.now()}`;

  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: url })
    .eq("id", user.id);
  if (error) redirect("/account/profile?err=avatar_save");

  revalidatePath("/account/profile");
  redirect("/account/profile?saved=avatar");
}

/**
 * Setzt den Avatar auf das Google-Bild zurück (bzw. leert ihn, falls keins
 * vorhanden). Die hochgeladene Datei bleibt im Bucket, wird aber nicht mehr
 * referenziert (und beim nächsten Upload überschrieben).
 */
export async function resetAvatar() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/?auth_required=1");

  const googleAvatar =
    (user.user_metadata?.avatar_url as string | undefined) ??
    (user.user_metadata?.picture as string | undefined) ??
    null;

  await supabase.from("profiles").update({ avatar_url: googleAvatar }).eq("id", user.id);

  revalidatePath("/account/profile");
  redirect("/account/profile?saved=avatar");
}
