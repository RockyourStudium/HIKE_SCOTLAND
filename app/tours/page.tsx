"use client";

import { useMemo, useState } from "react";
import Container from "@/components/Container";
import TourCard from "@/components/TourCard";
import MapPanel from "@/components/MapPanel";
import { tours } from "@/data/tours";
import { useTrip } from "@/lib/trip";
import { tripPoints, tourPoint } from "@/lib/mapPoints";

const types = ["All", "Guided", "Self-guided"] as const;
const regions = ["All", ...Array.from(new Set(tours.map((t) => t.region)))];
const allTourPoints = tours.map(tourPoint);

export default function ToursPage() {
  const [type, setType] = useState<(typeof types)[number]>("All");
  const [region, setRegion] = useState("All");
  const [hovered, setHovered] = useState<string | null>(null);
  const { trip } = useTrip();

  const filtered = useMemo(() => {
    return tours.filter((t) => {
      if (type === "Guided" && !t.guided) return false;
      if (type === "Self-guided" && t.guided) return false;
      if (region !== "All" && t.region !== region) return false;
      return true;
    });
  }, [type, region]);

  const bookedPoints = useMemo(() => tripPoints(trip.items), [trip.items]);
  const hoveredTour = hovered ? tours.find((t) => t.id === hovered) : undefined;
  const extraPoint = hoveredTour ? tourPoint(hoveredTour) : null;

  return (
    <>
      <header className="bg-forest-gradient text-fog">
        <Container py="compact">
          <h1 className="font-display text-4xl font-bold sm:text-5xl">Guided Tours</h1>
          <p className="mt-3 max-w-2xl text-lg text-fog/85">
            Small-group guided adventures and self-guided trips with the
            logistics taken care of.
          </p>
        </Container>
      </header>

      <Container py="compact">
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

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[1fr,22rem]">
          {/* Results */}
          <div className="order-2 lg:order-1">
            {filtered.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {filtered.map((tour) => (
                  <div
                    key={tour.id}
                    onMouseEnter={() => setHovered(tour.id)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <TourCard tour={tour} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-6 text-center text-neutralgray">
                No tours match those filters yet.
              </p>
            )}
          </div>

          {/* Map */}
          <div className="order-1 lg:order-2 lg:sticky lg:top-24 lg:self-start">
            <MapPanel
              points={bookedPoints}
              fitPoints={allTourPoints}
              highlightId={hovered}
              extraPoint={extraPoint}
              className="h-[20rem] lg:h-[32rem]"
              emptyHint="Hover a tour to see where it is — added trip stops stay pinned here."
            />
            <p className="mt-2 text-center text-xs text-neutralgray">
              Pins show your trip; hover a tour to place it on the map.
            </p>
          </div>
        </div>
      </Container>
    </>
  );
}
