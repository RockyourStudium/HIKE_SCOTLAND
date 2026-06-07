"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Aktualisiert das eigene Profil (Name, Kontakt-E-Mail, Telefon, Adresse) über
 * den cookie-bewussten Server-Client — RLS „update own" stellt sicher, dass nur
 * die eigene Zeile geändert wird. Die Login-E-Mail (Google) bleibt unberührt.
 */
export async function updateProfile(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/?auth_required=1");

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();

  if (email && !EMAIL_RE.test(email)) {
    redirect("/account?err=email_invalid");
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      name: name || null,
      email: email || null,
      phone: phone || null,
      address: address || null,
    })
    .eq("id", user.id);

  if (error) {
    redirect(`/account?err=${error.code === "23505" ? "email_taken" : "save"}`);
  }

  revalidatePath("/account");
  redirect("/account?saved=1");
}

/**
 * Newsletter-Abo des eingeloggten Users umschalten. Schlüssel ist die
 * (Login-)E-Mail. Schreibzugriff läuft über service_role, da `subscribers` nur
 * dafür schreibbar ist. Reaktiviert bei erneutem Abonnieren bestehende Zeilen.
 */
export async function setNewsletter(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) redirect("/?auth_required=1");

  const subscribe = String(formData.get("intent") ?? "") === "subscribe";
  const email = user.email.toLowerCase();
  const admin = getSupabaseAdmin();
  const nowIso = new Date().toISOString();

  if (subscribe) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("name")
      .eq("id", user.id)
      .single();
    const firstName = profile?.name ? profile.name.slice(0, 100) : null;

    const { data: existing } = await admin
      .from("subscribers")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      await admin
        .from("subscribers")
        .update({
          status: "subscribed",
          confirmed_at: nowIso,
          unsubscribed_at: null,
          ...(firstName ? { first_name: firstName } : {}),
        })
        .eq("id", existing.id);
    } else {
      await admin.from("subscribers").insert({
        email,
        first_name: firstName,
        status: "subscribed",
        confirmed_at: nowIso,
        source: "account",
      });
    }
  } else {
    await admin
      .from("subscribers")
      .update({ status: "unsubscribed", unsubscribed_at: nowIso })
      .eq("email", email);
  }

  revalidatePath("/account");
  redirect(`/account?nl=${subscribe ? "on" : "off"}`);
}
