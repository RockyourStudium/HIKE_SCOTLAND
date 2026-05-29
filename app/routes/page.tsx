"use client";

import { useMemo, useState } from "react";
import RouteCard from "@/components/RouteCard";
import { routes } from "@/data/routes";
import type { Difficulty } from "@/data/types";

const difficulties: (Difficulty | "All")[] = [
  "All",
  "Easy",
  "Moderate",
  "Challenging",
  "Expert",
];

const regions = ["All", ...Array.from(new Set(routes.map((r) => r.region)))];
const durations = ["All", "Day walk", "Multi-day"] as const;

export default function RoutesPage() {
  const [difficulty, setDifficulty] = useState<(typeof difficulties)[number]>("All");
  const [region, setRegion] = useState<string>("All");
  const [duration, setDuration] = useState<(typeof durations)[number]>("All");

  const filtered = useMemo(() => {
    return routes.filter((r) => {
      if (difficulty !== "All" && r.difficulty !== difficulty) return false;
      if (region !== "All" && r.region !== region) return false;
      if (duration === "Day walk" && r.days > 1) return false;
      if (duration === "Multi-day" && r.days === 1) return false;
      return true;
    });
  }, [difficulty, region, duration]);

  const reset = () => {
    setDifficulty("All");
    setRegion("All");
    setDuration("All");
  };

  return (
    <>
      <header className="bg-forest-gradient text-fog">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl font-bold sm:text-5xl">Hiking Routes</h1>
          <p className="mt-3 max-w-2xl text-lg text-fog/85">
            Browse hand-picked walks across Scotland and filter by difficulty,
            region and length.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
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

        {/* Results */}
        {filtered.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((route) => (
              <RouteCard key={route.id} route={route} />
            ))}
          </div>
        ) : (
          <p className="mt-16 text-center text-neutralgray">
            No routes match those filters. Try widening your search.
          </p>
        )}
      </div>
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
