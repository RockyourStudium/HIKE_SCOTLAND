"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";

/**
 * Browser-Supabase-Client (anon/publishable Key). Teilt sich die Session-Cookies
 * mit den Server-Clients, sodass Login-Status zwischen Client und Server
 * konsistent bleibt. Für Auth-Aktionen (Google-Login, Logout, onAuthStateChange).
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
