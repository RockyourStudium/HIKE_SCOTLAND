"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin/catalog/tours", label: "Tours" },
  { href: "/admin/catalog/routes", label: "Routes" },
  { href: "/admin/catalog/stays", label: "Stays" },
];

export default function CatalogNav() {
  const pathname = usePathname();
  return (
    <nav className="mb-6 flex flex-wrap gap-1" aria-label="Catalog">
      {TABS.map((t) => {
        const active = pathname.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              active
                ? "bg-forest-highland text-white"
                : "border border-mint/60 text-forest-dark hover:bg-fog"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
