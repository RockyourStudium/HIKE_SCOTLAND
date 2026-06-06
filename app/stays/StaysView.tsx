"use client";

import { useMemo, useState } from "react";
import Container from "@/components/Container";
import StayCard from "@/components/StayCard";
import AddToTripButton from "@/components/AddToTripButton";
import MapPanel from "@/components/MapPanel";
import type { Stay } from "@/data/types";
import { useTrip } from "@/lib/trip";
import { useCatalog } from "@/lib/catalog-client";
import { tripPoints, stayPoint } from "@/lib/mapPoints";

export default function StaysView({ stays }: { stays: Stay[] }) {
  const [type, setType] = useState("All");
  const [region, setRegion] = useState("All");
  const [hovered, setHovered] = useState<string | null>(null);
  const { trip } = useTrip();
  const catalog = useCatalog();

  const types = useMemo(
    () => ["All", ...Array.from(new Set(stays.map((s) => s.type)))],
    [stays],
  );
  const regions = useMemo(
    () => ["All", ...Array.from(new Set(stays.map((s) => s.region)))],
    [stays],
  );
  const allStayPoints = useMemo(() => stays.map(stayPoint), [stays]);

  const filtered = useMemo(() => {
    return stays.filter((s) => {
      if (type !== "All" && s.type !== type) return false;
      if (region !== "All" && s.region !== region) return false;
      return true;
    });
  }, [stays, type, region]);

  const bookedPoints = useMemo(() => tripPoints(trip.items, catalog), [trip.items, catalog]);
  const hoveredStay = hovered ? stays.find((s) => s.id === hovered) : undefined;
  const extraPoint = hoveredStay ? stayPoint(hoveredStay) : null;

  return (
    <>
      <header className="bg-forest-gradient text-fog">
        <Container py="compact">
          <h1 className="font-display text-4xl font-bold sm:text-5xl">Where to Stay</h1>
          <p className="mt-3 max-w-2xl text-lg text-fog/85">
            From free mountain bothies to comfortable country hotels — rest well
            between the miles.
          </p>
        </Container>
      </header>

      <Container py="compact">
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

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[1fr,22rem]">
          <div className="order-2 lg:order-1">
            {filtered.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((stay) => (
                  <div
                    key={stay.id}
                    onMouseEnter={() => setHovered(stay.id)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <StayCard
                      stay={stay}
                      action={<AddToTripButton kind="stay" id={stay.id} compact />}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-6 text-center text-neutralgray">
                No stays match those filters yet.
              </p>
            )}
          </div>

          <div className="order-1 lg:order-2 lg:sticky lg:top-24 lg:self-start">
            <MapPanel
              points={bookedPoints}
              fitPoints={allStayPoints}
              highlightId={hovered}
              extraPoint={extraPoint}
              className="h-[20rem] lg:h-[32rem]"
              emptyHint="Hover a stay to see where it is — added trip stops stay pinned here."
            />
            <p className="mt-2 text-center text-xs text-neutralgray">
              Pins show your trip; hover a stay to place it on the map.
            </p>
          </div>
        </div>
      </Container>
    </>
  );
}
