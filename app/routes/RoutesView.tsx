"use client";

import { useMemo, useState } from "react";
import Container from "@/components/Container";
import RouteCard from "@/components/RouteCard";
import MapPanel from "@/components/MapPanel";
import type { Difficulty, Route } from "@/data/types";
import { useTrip } from "@/lib/trip";
import { tripPoints, routePoint } from "@/lib/mapPoints";

const difficulties: (Difficulty | "All")[] = [
  "All",
  "Easy",
  "Moderate",
  "Challenging",
  "Expert",
];

const durations = ["All", "Day walk", "Multi-day"] as const;

export default function RoutesView({ routes }: { routes: Route[] }) {
  const [difficulty, setDifficulty] = useState<(typeof difficulties)[number]>("All");
  const [region, setRegion] = useState<string>("All");
  const [duration, setDuration] = useState<(typeof durations)[number]>("All");
  const [hovered, setHovered] = useState<string | null>(null);
  const { trip } = useTrip();

  const regions = useMemo(
    () => ["All", ...Array.from(new Set(routes.map((r) => r.region)))],
    [routes],
  );
  const allRoutePoints = useMemo(() => routes.map(routePoint), [routes]);

  const filtered = useMemo(() => {
    return routes.filter((r) => {
      if (difficulty !== "All" && r.difficulty !== difficulty) return false;
      if (region !== "All" && r.region !== region) return false;
      if (duration === "Day walk" && r.days > 1) return false;
      if (duration === "Multi-day" && r.days === 1) return false;
      return true;
    });
  }, [routes, difficulty, region, duration]);

  const bookedPoints = useMemo(() => tripPoints(trip.items), [trip.items]);
  const hoveredRoute = hovered ? routes.find((r) => r.id === hovered) : undefined;
  const extraPoint = hoveredRoute ? routePoint(hoveredRoute) : null;

  const reset = () => {
    setDifficulty("All");
    setRegion("All");
    setDuration("All");
  };

  return (
    <>
      <header className="bg-forest-gradient text-fog">
        <Container py="compact">
          <h1 className="font-display text-4xl font-bold sm:text-5xl">Hiking Routes</h1>
          <p className="mt-3 max-w-2xl text-lg text-fog/85">
            Browse hand-picked walks across Scotland and filter by difficulty,
            region and length.
          </p>
        </Container>
      </header>

      <Container py="compact">
        {/* Filters */}
        <section
          aria-label="Filter routes"
          className="rounded-2xl bg-white p-5 shadow-card sm:p-6"
        >
          <div className="grid gap-5 sm:grid-cols-3">
            <Filter
              label="Difficulty"
              value={difficulty}
              options={difficulties}
              onChange={(v) => setDifficulty(v as (typeof difficulties)[number])}
            />
            <Filter
              label="Region"
              value={region}
              options={regions}
              onChange={setRegion}
            />
            <Filter
              label="Length"
              value={duration}
              options={[...durations]}
              onChange={(v) => setDuration(v as (typeof durations)[number])}
            />
          </div>
          <div className="mt-5 flex items-center justify-between">
            <p className="text-sm text-neutralgray" aria-live="polite">
              Showing <strong className="text-forest-dark">{filtered.length}</strong>{" "}
              of {routes.length} routes
            </p>
            <button
              type="button"
              onClick={reset}
              className="text-sm font-semibold text-forest-highland underline-offset-4 hover:underline"
            >
              Reset filters
            </button>
          </div>
        </section>

        {/* Results + map */}
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[1fr,22rem]">
          <div className="order-2 lg:order-1">
            {filtered.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {filtered.map((route) => (
                  <div
                    key={route.id}
                    onMouseEnter={() => setHovered(route.id)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <RouteCard route={route} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-6 text-center text-neutralgray">
                No routes match those filters. Try widening your search.
              </p>
            )}
          </div>

          <div className="order-1 lg:order-2 lg:sticky lg:top-24 lg:self-start">
            <MapPanel
              points={bookedPoints}
              fitPoints={allRoutePoints}
              highlightId={hovered}
              extraPoint={extraPoint}
              className="h-[20rem] lg:h-[32rem]"
              emptyHint="Hover a route to see where it is — added trip stops stay pinned here."
            />
            <p className="mt-2 text-center text-xs text-neutralgray">
              Pins show your trip; hover a route to place it on the map.
            </p>
          </div>
        </div>
      </Container>
    </>
  );
}

function Filter({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
}) {
  const id = `filter-${label.toLowerCase()}`;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-forest-dark">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-softgray bg-fog/40 px-4 py-2.5 text-sm text-forest-dark transition-colors focus:border-forest-highland"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
