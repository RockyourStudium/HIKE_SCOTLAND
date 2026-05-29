"use client";

import { useMemo, useState } from "react";
import TourCard from "@/components/TourCard";
import { tours } from "@/data/tours";

const types = ["All", "Guided", "Self-guided"] as const;
const regions = ["All", ...Array.from(new Set(tours.map((t) => t.region)))];

export default function ToursPage() {
  const [type, setType] = useState<(typeof types)[number]>("All");
  const [region, setRegion] = useState("All");

  const filtered = useMemo(() => {
    return tours.filter((t) => {
      if (type === "Guided" && !t.guided) return false;
      if (type === "Self-guided" && t.guided) return false;
      if (region !== "All" && t.region !== region) return false;
      return true;
    });
  }, [type, region]);

  return (
    <>
      <header className="bg-forest-gradient text-fog">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl font-bold sm:text-5xl">Guided Tours</h1>
          <p className="mt-3 max-w-2xl text-lg text-fog/85">
            Small-group guided adventures and self-guided trips with the
            logistics taken care of.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section
          aria-label="Filter tours"
          className="flex flex-wrap items-end gap-5 rounded-2xl bg-white p-5 shadow-card sm:p-6"
        >
          <div className="min-w-[160px] flex-1">
            <label htmlFor="tour-type" className="block text-sm font-semibold text-forest-dark">
              Tour type
            </label>
            <select
              id="tour-type"
              value={type}
              onChange={(e) => setType(e.target.value as (typeof types)[number])}
              className="mt-2 w-full rounded-xl border border-softgray bg-fog/40 px-4 py-2.5 text-sm text-forest-dark focus:border-forest-highland"
            >
              {types.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="min-w-[160px] flex-1">
            <label htmlFor="tour-region" className="block text-sm font-semibold text-forest-dark">
              Region
            </label>
            <select
              id="tour-region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="mt-2 w-full rounded-xl border border-softgray bg-fog/40 px-4 py-2.5 text-sm text-forest-dark focus:border-forest-highland"
            >
              {regions.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
          <p className="text-sm text-neutralgray" aria-live="polite">
            {filtered.length} tour{filtered.length !== 1 ? "s" : ""}
          </p>
        </section>

        {filtered.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        ) : (
          <p className="mt-16 text-center text-neutralgray">
            No tours match those filters yet.
          </p>
        )}
      </div>
    </>
  );
}
