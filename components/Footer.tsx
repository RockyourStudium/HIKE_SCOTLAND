import Link from "next/link";

const columns = [
  {
    title: "Explore",
    links: [
      { href: "/routes", label: "Hiking Routes" },
      { href: "/tours", label: "Guided Tours" },
      { href: "/stays", label: "Accommodation" },
    ],
  },
  {
    title: "Plan",
    links: [
      { href: "/plan", label: "Trip Planner" },
      { href: "/routes", label: "By Difficulty" },
      { href: "/tours", label: "By Region" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-forest-darkest text-fog">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span aria-hidden className="text-2xl">⛰️</span>
              <span className="font-display text-xl font-semibold">Hike Scotland</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-fog/70">
              Discover and organise hiking adventures across Scotland — routes,
              guided tours and places to stay, all in one place.
            </p>
          </div>

          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-mint">
                {col.title}
              </h2>
              <ul className="mt-4 space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-fog/70 transition-colors hover:text-fog"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-forest-highland/30 pt-6 text-sm text-fog/60 sm:flex-row">
          <p>© {new Date().getFullYear()} Hike Scotland. Walk wild, tread lightly.</p>
          <p>Made for outdoor enthusiasts 🌲</p>
        </div>
      </div>
    </footer>
  );
}
