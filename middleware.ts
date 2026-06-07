import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Auth-Middleware:
 *  1) Frischt bei jedem Request die Supabase-Session auf (Cookies).
 *  2) `/account*`  -> nur eingeloggt (sonst zurück zur Startseite mit Hinweis).
 *  3) `/admin*`    -> nur eingeloggt UND profiles.role = 'admin' (sonst 404,
 *     damit die Existenz des Bereichs nicht durchsickert — ersetzt das alte
 *     ADMIN_ENABLED-Gate durch echte Auth).
 */
export async function middleware(req: NextRequest) {
  const { response, supabase, user } = await updateSession(req);
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/account")) {
    if (!user) {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      url.search = "";
      url.searchParams.set("auth_required", "1");
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith("/admin")) {
    if (!user) return new NextResponse("Not found", { status: 404 });
    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (data?.role !== "admin") {
      return new NextResponse("Not found", { status: 404 });
    }
  }

  return response;
}

export const config = {
  // Auf allen Routen außer statischen Assets — damit Sessions frisch bleiben.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|woff2?)$).*)",
  ],
};
