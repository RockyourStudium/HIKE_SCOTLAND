"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Mountain, Backpack } from "lucide-react";
import AnimatedCTA from "@/components/AnimatedCTA";
import { destinations } from "@/data/destinations";
import { useTrip } from "@/lib/trip";

function TripLink({ block = false }: { block?: boolean }) {
  const { count, hydrated } = useTrip();
  const showCount = hydrated && count > 0;
  return (
    <Link
      href="/my-trip"
      className={`relative flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium uppercase tracking-wide text-fog/90 transition-colors hover:bg-forest-highland/40 ${
        block ? "w-full" : ""
      }`}
    >
      <Backpack aria-hidden className="h-4 w-4" strokeWidth={2} />
      My Trip
      {showCount && (
        <span
          aria-label={`${count} items in your trip`}
          className="ml-0.5 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-mint px-1.5 text-xs font-bold text-forest-darkest"
        >
          {count}
        </span>
      )}
    </Link>
  );
}

const links = [
  { href: "/routes", label: "ROUTES" },
  { href: "/tours", label: "GUIDED TOURS" },
  { href: "/stays", label: "STAYS" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [destOpen, setDestOpen] = useState(false);
  const destRef = useRef<HTMLLIElement>(null);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
    setDestOpen(false);
  }, [pathname]);

  // Close the destinations dropdown on outside click or Escape.
  useEffect(() => {
    if (!destOpen) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      // Clicks inside the desktop dropdown are fine.
      if (destRef.current?.contains(target)) return;
      // Clicks inside the mobile menu are fine too — otherwise this mousedown
      // would unmount a destination link before the tap navigates (mobile bug).
      if (document.getElementById("mobile-menu")?.contains(target)) return;
      setDestOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDestOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [destOpen]);

  const destinationsActive = pathname.startsWith("/destinations");

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-forest-darkest text-fog">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8"
      >
        <Link
          href="/"
          className="flex flex-shrink-0 items-center gap-2 whitespace-nowrap text-lg font-semibold tracking-tight"
        >
          <Mountain aria-hidden className="h-6 w-6 text-mint" strokeWidth={2} />
          <span className="font-display text-xl">Hike Scotland</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {/* Destinations dropdown */}
          <li ref={destRef} className="relative">
            <button
              type="button"
              onClick={() => setDestOpen((v) => !v)}
              aria-expanded={destOpen}
              aria-haspopup="true"
              aria-current={destinationsActive ? "page" : undefined}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium uppercase tracking-wide transition-colors hover:bg-forest-highland/40 ${
                destinationsActive ? "bg-forest-highland text-white" : "text-fog/90"
              }`}
            >
              Destinations
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
                className={`transition-transform ${destOpen ? "rotate-180" : ""}`}
              >
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {destOpen && (
              <ul className="absolute left-0 top-full mt-2 w-64 overflow-hidden rounded-2xl bg-white py-2 text-forest-dark shadow-card-hover ring-1 ring-black/5">
                {destinations.map((d) => {
                  const active = pathname === `/destinations/${d.slug}`;
                  return (
                    <li key={d.slug}>
                      <Link
                        href={`/destinations/${d.slug}`}
                        aria-current={active ? "page" : undefined}
                        className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-fog ${
                          active ? "bg-fog font-semibold" : ""
                        }`}
                      >
                        <span className="text-xs font-semibold text-mist">{d.number}</span>
                        <span>{d.name}</span>
                      </Link>
                    </li>
                  );
                })}
                <li className="mt-1 border-t border-softgray/40">
                  <Link
                    href="/destinations"
                    className="block px-4 py-2.5 text-sm font-semibold text-forest-highland hover:bg-fog"
                  >
                    View all destinations →
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium uppercase tracking-wide transition-colors hover:bg-forest-highland/40 ${
                    active ? "bg-forest-highland text-white" : "text-fog/90"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
          <li>
            <TripLink />
          </li>
          <li>
            <AnimatedCTA href="/plan" size="sm" className="ml-2 text-sm uppercase tracking-wide">
              Start Planning
            </AnimatedCTA>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="inline-flex items-center justify-center rounded-lg p-2 text-fog hover:bg-forest-highland/40 lg:hidden"
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          {open ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div id="mobile-menu" className="border-t border-forest-highland/30 lg:hidden">
          <ul className="space-y-1 px-4 py-3">
            {/* Mobile destinations group */}
            <li>
              <button
                type="button"
                onClick={() => setDestOpen((v) => !v)}
                aria-expanded={destOpen}
                className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-base font-medium uppercase tracking-wide transition-colors hover:bg-forest-highland/40 ${
                  destinationsActive ? "bg-forest-highland text-white" : "text-fog/90"
                }`}
              >
                Destinations
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                  className={`transition-transform ${destOpen ? "rotate-180" : ""}`}
                >
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {destOpen && (
                <ul className="mb-1 ml-3 mt-1 space-y-1 border-l border-forest-highland/30 pl-3">
                  {destinations.map((d) => {
                    const active = pathname === `/destinations/${d.slug}`;
                    return (
                      <li key={d.slug}>
                        <Link
                          href={`/destinations/${d.slug}`}
                          aria-current={active ? "page" : undefined}
                          className={`block rounded-lg px-4 py-2.5 text-sm transition-colors hover:bg-forest-highland/40 ${
                            active ? "bg-forest-highland/60 text-white" : "text-fog/80"
                          }`}
                        >
                          {d.name}
                        </Link>
                      </li>
                    );
                  })}
                  <li>
                    <Link
                      href="/destinations"
                      className="block rounded-lg px-4 py-2.5 text-sm font-semibold text-mint hover:bg-forest-highland/40"
                    >
                      View all destinations →
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`block rounded-lg px-4 py-3 text-base font-medium uppercase tracking-wide transition-colors hover:bg-forest-highland/40 ${
                      active ? "bg-forest-highland text-white" : "text-fog/90"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
            <li>
              <TripLink block />
            </li>
            <li className="pt-2">
              <AnimatedCTA href="/plan" block className="text-base uppercase tracking-wide">
                Start Planning
              </AnimatedCTA>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
