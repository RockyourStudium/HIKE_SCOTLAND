import "server-only";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

// Server-only Auth-Helfer. Liest den eingeloggten User und seine Rolle aus der
// `profiles`-Tabelle (RLS „read own" erlaubt das Lesen des eigenen Profils).

export type Role = "user" | "admin";

/**
 * Liefert den eingeloggten User samt Rolle. Ohne Login: { user: null, role: "user" }.
 */
export async function getUserWithRole(): Promise<{
  user: User | null;
  role: Role;
}> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { user: null, role: "user" };

  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return { user, role: data?.role === "admin" ? "admin" : "user" };
}
