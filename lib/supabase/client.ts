"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";

let client: ReturnType<typeof createBrowserClient<Database>> | null = null;

/**
 * Browser-Supabase-Client (anon/publishable Key). Teilt sich die Session-Cookies
 * mit den Server-Clients, sodass Login-Status zwischen Client und Server
 * konsistent bleibt. Für Auth-Aktionen (Google-Login, Logout, onAuthStateChange).
 *
 * Modulweiter Singleton: alle Aufrufer (AuthProvider, NewsletterBand, …) teilen
 * sich dieselbe Instanz — es darf nur einen GoTrueClient pro Storage-Key geben.
 */
export function createClient() {
  if (!client) {
    client = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }
  return client;
}
