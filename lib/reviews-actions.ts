"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const SUBJECTS = new Set(["tour", "route", "stay"]);

/**
 * Legt die Review des eingeloggten Users an bzw. überschreibt sie (Upsert auf
 * den Unique-Key user_id/subject_type/subject_id; RLS „insert/update own").
 * Danach Revalidate + Redirect zurück zur Detailseite.
 */
export async function submitReview(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/?auth_required=1");

  const subjectType = String(formData.get("subject_type") ?? "");
  const subjectId = String(formData.get("subject_id") ?? "");
  const rating = Number(formData.get("rating"));
  const body = String(formData.get("body") ?? "").trim().slice(0, 2000);

  // Redirect-Ziel nur auf interne Detailseiten zulassen (kein Open Redirect).
  const path = String(formData.get("path") ?? "");
  const safePath = /^\/(tours|routes|stays)\/[a-z0-9-]+$/.test(path) ? path : "/";

  if (
    !SUBJECTS.has(subjectType) ||
    !subjectId ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    redirect(`${safePath}#reviews`);
  }

  const { error } = await supabase.from("reviews").upsert(
    {
      user_id: user.id,
      subject_type: subjectType,
      subject_id: subjectId,
      rating,
      body: body || null,
    },
    { onConflict: "user_id,subject_type,subject_id" },
  );
  if (error) redirect(`${safePath}?review=error#reviews`);

  revalidatePath(safePath);
  redirect(`${safePath}#reviews`);
}
