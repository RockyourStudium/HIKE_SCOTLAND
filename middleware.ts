import { NextResponse, type NextRequest } from "next/server";

/**
 * Schutz-Gate für /admin (Phase 1, noch ohne echtes Login).
 *
 * Der Admin-Bereich zeigt PII (E-Mails) und erlaubt Schreibzugriff. Push auf
 * `main` löst einen Production-Deploy aus — ohne dieses Gate läge das Dashboard
 * dort ungeschützt offen. Solange `ADMIN_ENABLED !== "true"` antwortet /admin
 * mit 404, ist also faktisch unsichtbar.
 *
 * Lokal: ADMIN_ENABLED=true in .env.local setzen → voller Zugriff.
 * Echte Auth (Login/Rollen) wird später nachgezogen und ersetzt dieses Gate.
 */
export function middleware(req: NextRequest) {
  if (process.env.ADMIN_ENABLED !== "true") {
    return new NextResponse("Not found", { status: 404 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin"],
};
