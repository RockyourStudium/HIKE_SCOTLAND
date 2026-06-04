import Link from "next/link";
import { Mountain, TreePine } from "lucide-react";
import Container from "@/components/Container";

const columns = [
  {
    title: "Explore",
    links: [
      { href: "/destinations", label: "Destinations" },
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
      { href: "/newsletter", label: "Newsletter" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-forest-darkest text-fog">
      <Container py="compact">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <Mountain aria-hidden className="h-6 w-6 text-mint" strokeWidth={2} />
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
          <div className="flex items-center gap-4">
            <Link href="/credits" className="transition-colors hover:text-fog">
              Image Credits
            </Link>
            <span aria-hidden>·</span>
            <p className="inline-flex items-center gap-1.5">
              Made for outdoor enthusiasts
              <TreePine aria-hidden className="h-4 w-4 text-mint" />
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
