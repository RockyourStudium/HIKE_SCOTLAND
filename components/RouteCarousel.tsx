"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import RouteCard from "./RouteCard";
import type { Route } from "@/data/types";

/**
 * Horizontally scrollable, snap-to-card carousel of routes.
 * Swipe on touch; prev/next buttons on larger screens.
 */
export default function RouteCarousel({ routes }: { routes: Route[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + 24 /* gap-6 */ : el.clientWidth * 0.8;
    el.scrollBy({ left: step * dir, behavior: "smooth" });
  };

  return (
    <div className="relative lg:px-16">
      <div
        ref={trackRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2"
      >
        {routes.map((route) => (
          <div
            key={route.id}
            data-card
            className="w-[82%] shrink-0 snap-start sm:w-[46%] lg:w-[32%]"
          >
            <RouteCard route={route} tone="tinted" />
          </div>
        ))}
      </div>

      {/* Controls sit in the side gutters (lg only) so they never cover card text;
          on smaller screens the carousel is swiped. */}
      <button
        type="button"
        onClick={() => scrollByCard(-1)}
        aria-label="Previous routes"
        className="absolute left-0 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-forest-darkest text-fog ring-1 ring-white/20 transition-colors hover:bg-forest-dark lg:flex"
      >
        <ChevronLeft aria-hidden className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => scrollByCard(1)}
        aria-label="Next routes"
        className="absolute right-0 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-forest-darkest text-fog ring-1 ring-white/20 transition-colors hover:bg-forest-dark lg:flex"
      >
        <ChevronRight aria-hidden className="h-5 w-5" />
      </button>
    </div>
  );
}
