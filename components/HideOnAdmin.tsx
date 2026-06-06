"use client";

import { usePathname } from "next/navigation";

/**
 * Blendet die öffentliche Site-Chrome (Navbar/NewsletterBand/Footer) auf
 * /admin-Pfaden aus. Das Admin-Dashboard bringt sein eigenes Layout mit und
 * soll nicht vom dunklen Marketing-Rahmen umschlossen sein.
 *
 * Bewusst minimal-invasiv statt Route-Groups: kein Verschieben der bestehenden
 * Routen nötig.
 */
export default function HideOnAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <>{children}</>;
}
