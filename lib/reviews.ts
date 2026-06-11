import { getSupabase } from "@/lib/supabase";

// Review-Lesezugriff über die View public_reviews (Owner-Rights): liefert
// Review + unbedenkliche Autorendaten (Name/Avatar; Username nur bei
// öffentlichem Profil). Siehe supabase/migrations/*_public_reviews_view.sql.

export type ReviewSubject = "tour" | "route" | "stay";

export interface PublicReview {
  id: string;
  rating: number;
  body: string | null;
  createdAt: string;
  authorName: string;
  authorAvatarUrl: string | null;
  /** Gesetzt nur, wenn das Profil öffentlich ist — dann auf /profiles/[username] verlinken. */
  authorUsername: string | null;
}

export async function getReviews(
  subjectType: ReviewSubject,
  subjectId: string,
): Promise<PublicReview[]> {
  const { data, error } = await getSupabase()
    .from("public_reviews")
    .select("*")
    .eq("subject_type", subjectType)
    .eq("subject_id", subjectId)
    .order("created_at", { ascending: false });
  // Defensive: Reviews dürfen eine Detailseite nie zum Scheitern bringen
  // (z. B. solange die View-Migration noch nicht eingespielt ist).
  if (error) return [];
  return (data ?? [])
    .filter((r) => r.id && r.rating)
    .map((r) => ({
      id: r.id!,
      rating: r.rating!,
      body: r.body,
      createdAt: r.created_at ?? "",
      authorName: r.author_name ?? "Hiker",
      authorAvatarUrl: r.author_avatar_url,
      authorUsername: r.author_username,
    }));
}
