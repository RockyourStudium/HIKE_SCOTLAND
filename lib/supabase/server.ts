import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database.types";

/**
 * Cookie-bewusster Supabase-Client für Server Components, Route Handler und
 * Server Actions (anon/publishable Key, durch RLS abgesichert). Liest die
 * Session aus den Request-Cookies, sodass auth.uid() in RLS-Policies greift.
 *
 * In reinen Server Components ist das Setzen von Cookies nicht erlaubt — der
 * try/catch fängt das ab; die Middleware (updateSession) hält die Session
 * ohnehin frisch.
 */
export function createClient() {
  const cookieStore = cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Aufruf aus einer Server Component — Cookies sind dort read-only.
          }
        },
      },
    },
  );
}
