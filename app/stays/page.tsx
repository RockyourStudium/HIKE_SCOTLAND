"use client";

import { useMemo, useState } from "react";
import StayCard from "@/components/StayCard";
import { stays } from "@/data/stays";

const types = ["All", ...Array.from(new Set(stays.map((s) => s.type)))];
const regions = ["All", ...Array.from(new Set(stays.map((s) => s.region)))];

export default function StaysPage() {
  const [type, setType] = useState("All");
  const [region, setRegion] = useState("All");

  const filtered = useMemo(() => {
    return stays.filter((s) => {
      if (type !== "All" && s.type !== type) return false;
      if (region !== "All" && s.region !== region) return false;
      return true;
    });
  }, [type, region]);

  return (
    <>
      <header className="bg-forest-gradient text-fog">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl font-bold sm:text-5xl">Where to Stay</h1>
          <p className="mt-3 max-w-2xl text-lg text-fog/85">
            From free mountain bothies to comfortable country hotels — rest well
            between the miles.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section
          aria-label="Filter accommodation"
          className="flex flex-wrap items-end gap-5 rounded-2xl bg-white p-5 shadow-card sm:p-6"
        >
          <div className="min-w-[160px] flex-1">
            <label htmlFor="stay-type" className="block text-sm font-semibold text-forest-dark">
              Type
            </label>
            <select
              id="stay-type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="mt-2 w-full rounded-xl border border-softgray bg-fog/40 px-4 py-2.5 text-sm text-forest-dark focus:border-forest-highland"
            >
              {types.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="min-w-[160px] flex-1">
            <label htmlFor="stay-region" className="block text-sm font-semibold text-forest-dark">
              Region
            </label>
            <select
              id="stay-region"
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
            {filtered.length} place{filtered.length !== 1 ? "s" : ""} to stay
          </p>
        </section>

        {filtered.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((stay) => (
              <StayCard key={stay.id} stay={stay} />
            ))}
          </div>
        ) : (
          <p className="mt-16 text-center text-neutralgray">
            No stays match those filters yet.
          </p>
        )}
      </div>
    </>
  );
}
