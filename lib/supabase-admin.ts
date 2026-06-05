import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

let admin: SupabaseClient<Database> | null = null;

/**
 * Server-only Supabase-Client mit dem service_role-Key. Umgeht RLS — daher
 * NIEMALS in einer Client-Komponente importieren. Nur in Route Handlers /
 * Server Actions verwenden. (Der Key hat keinen NEXT_PUBLIC_-Prefix und landet
 * deshalb ohnehin nie im Browser-Bundle.)
 */
export function getSupabaseAdmin(): SupabaseClient<Database> {
  if (!admin) {
    admin = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
  }
  return admin;
}
