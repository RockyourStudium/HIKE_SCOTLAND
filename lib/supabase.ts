import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

/**
 * Supabase-Client mit dem öffentlichen (anon/publishable) Key.
 * Sicher, weil Row Level Security greift. Für serverseitige Admin-Aufgaben
 * später einen separaten Client mit SUPABASE_SERVICE_ROLE_KEY anlegen.
 */
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
