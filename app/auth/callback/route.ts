import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * OAuth-Callback: Google leitet nach erfolgreichem Login hierher zurück. Wir
 * tauschen den `code` gegen eine Session (setzt die Session-Cookies) und leiten
 * dann auf `next` (Ausgangsseite) weiter.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  // Nur interne Pfade zulassen (Open-Redirect-Schutz).
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/";

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${safeNext}`);
    }
  }

  return NextResponse.redirect(`${origin}/?auth_error=1`);
}
