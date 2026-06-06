"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/subscribers", label: "Newsletter" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/catalog", label: "Catalog" },
];

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-wrap gap-1" aria-label="Admin">
      {LINKS.map((l) => {
        // /admin exakt, Unterseiten per Präfix.
        const active =
          l.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              active
                ? "bg-forest-highland text-white"
                : "text-forest-dark hover:bg-fog"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
