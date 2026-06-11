import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

let client: SupabaseClient<Database> | null = null;

/**
 * Lazily erstellter Supabase-Client (öffentlicher anon/publishable Key, durch
 * RLS abgesichert).
 *
 * Bewusst LAZY (erst beim ersten Aufruf erstellt): Würde createClient schon
 * beim Import laufen, bräche der Next-Build im Schritt "Collecting page data",
 * sobald die Env-Variablen zur Build-Zeit fehlen. So crasht höchstens der
 * konkrete Request, nie der gesamte Build.
 *
 * Rein anonyme public-reads (Katalog/Verfügbarkeit) — Auth ist deaktiviert.
 * Ohne das legt dieser Client im Browser einen zweiten GoTrueClient unter
 * demselben Storage-Key an wie der Auth-Client aus lib/supabase/client.ts
 * ("Multiple GoTrueClient instances"-Warnung, potenziell undefiniertes
 * Verhalten). Für Session-Zugriff den Auth-Client verwenden, nie diesen.
 */
export function getSupabase(): SupabaseClient<Database> {
  if (!client) {
    client = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
          storageKey: "sb-hike-catalog-anon",
        },
      },
    );
  }
  return client;
}
