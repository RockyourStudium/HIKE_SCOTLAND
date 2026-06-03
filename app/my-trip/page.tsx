"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUp,
  ArrowDown,
  Trash2,
  Minus,
  Plus,
  MapPin,
  Backpack,
  Route as RouteIcon,
  Compass,
  BedDouble,
} from "lucide-react";
import AnimatedCTA from "@/components/AnimatedCTA";
import MapPanel, { type MapPoint } from "@/components/MapPanel";
import { useTrip, type TripItem, type TripItemKind } from "@/lib/trip";
import { getRouteById } from "@/data/routes";
import { getTourById } from "@/data/tours";
import { getStayById } from "@/data/stays";

/** Resolve a trip item to a uniform shape the itinerary row can render. */
function resolve(item: TripItem) {
  if (item.kind === "route") {
    const r = getRouteById(item.id);
    if (!r) return null;
    return {
      kind: "route" as const,
      name: r.name,
      region: r.region,
      href: `/routes/${r.id}`,
      meta: r.days > 1 ? `${r.days} days · ${r.distanceKm} km` : `${r.durationHours} h · ${r.distanceKm} km`,
      walkingDays: r.days,
      nights: 0,
      cost: 0,
      coords: r.coords,
    };
  }
  if (item.kind === "tour") {
    const t = getTourById(item.id);
    if (!t) return null;
    return {
      kind: "tour" as const,
      name: t.name,
      region: t.region,
      href: `/tours/${t.id}`,
      meta: `${t.days} days · ${t.guided ? "Guided" : "Self-guided"}`,
      walkingDays: t.days,
      nights: 0,
      cost: t.pricePerPerson,
      coords: t.coords,
    };
  }
  const s = getStayById(item.id);
  if (!s) return null;
  const nights = item.nights ?? 1;
  return {
    kind: "stay" as const,
    name: s.name,
    region: s.region,
    href: "/stays",
    meta: `${s.type} · £${s.pricePerNight}/night`,
    walkingDays: 0,
    nights,
    cost: s.pricePerNight * nights,
    coords: s.coords,
  };
}

const kindIcon: Record<TripItemKind, typeof RouteIcon> = {
  route: RouteIcon,
  tour: Compass,
  stay: BedDouble,
};
const kindLabel: Record<TripItemKind, string> = {
  route: "Route",
  tour: "Tour",
  stay: "Stay",
};

export default function MyTripPage() {
  const { trip, hydrated, move, remove, setNights, clear } = useTrip();
  const [sent, setSent] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  const rows = useMemo(
    () => trip.items.map((item) => ({ item, data: resolve(item) })),
    [trip.items]
  );

  const points = useMemo<MapPoint[]>(
    () =>
      rows.flatMap(({ item, data }, i) =>
        data
          ? [
              {
                id: item.id,
                kind: item.kind,
                name: data.name,
                region: data.region,
                lat: data.coords.lat,
                lng: data.coords.lng,
                order: i + 1,
              },
            ]
          : []
      ),
    [rows]
  );

  const totals = useMemo(() => {
    const regions = new Set<string>();
    let walkingDays = 0;
    let nights = 0;
    let cost = 0;
    for (const { data } of rows) {
      if (!data) continue;
      regions.add(data.region);
      walkingDays += data.walkingDays;
      nights += data.nights;
      cost += data.cost;
    }
    return { regions: regions.size, walkingDays, nights, cost };
  }, [rows]);

  // Avoid an SSR/CSR flash: wait until the persisted trip has loaded.
  if (!hydrated) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center text-neutralgray sm:px-6 lg:px-8">
        Loading your trip…
      </div>
    );
  }

  if (trip.items.length === 0) {
    return (
      <>
        <Header />
        <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-white p-10 shadow-card">
            <Backpack aria-hidden className="mx-auto h-12 w-12" color="url(#hike-gradient)" />
            <h2 className="mt-4 font-display text-2xl font-bold text-forest-darkest">
              Your trip is empty
            </h2>
            <p className="mx-auto mt-2 max-w-md text-neutralgray">
              Add routes, guided tours and places to stay as you browse — then
              order them into your perfect Highland itinerary.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <AnimatedCTA href="/plan">Start the trip planner</AnimatedCTA>
              <Link
                href="/routes"
                className="inline-flex items-center justify-center rounded-full border border-forest-highland px-6 py-2.5 text-sm font-semibold text-forest-highland transition-colors hover:bg-forest-highland hover:text-white"
              >
                Browse routes
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Summary bar */}
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Summary label="Stops" value={String(trip.items.length)} />
          <Summary label="Regions" value={String(totals.regions)} />
          <Summary
            label="Walking days"
            value={totals.walkingDays > 0 ? String(totals.walkingDays) : "—"}
          />
          <Summary label="Est. cost" value={totals.cost > 0 ? `£${totals.cost}` : "—"} />
        </dl>

        {/* Map */}
        <div className="mt-8">
          <MapPanel
            points={points}
            connect
            highlightId={hovered}
            onPointHover={setHovered}
            className="h-[20rem] sm:h-[26rem]"
          />
          <p className="mt-2 text-center text-xs text-neutralgray">
            Numbered pins follow your itinerary order — hover a stop to find it on the map.
          </p>
        </div>

        {/* Itinerary */}
        <h2 className="mt-10 font-display text-2xl font-bold text-forest-darkest">
          Your itinerary
        </h2>
        <p className="mt-1 text-sm text-neutralgray">
          Reorder your stops to plan the route you&apos;ll travel — top to bottom.
        </p>

        <ol className="mt-6 space-y-3">
          {rows.map(({ item, data }, index) => {
            if (!data) return null;
            const Icon = kindIcon[item.kind];
            return (
              <li
                key={`${item.kind}-${item.id}`}
                onMouseEnter={() => setHovered(item.id)}
                onMouseLeave={() => setHovered(null)}
                className={`flex items-center gap-4 rounded-2xl bg-white p-4 shadow-card transition-shadow sm:p-5 ${
                  hovered === item.id ? "ring-2 ring-forest-highland" : ""
                }`}
              >
                {/* Order controls */}
                <div className="flex flex-col items-center gap-1">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    aria-label="Move stop earlier"
                    className="rounded-md p-1 text-forest-dark transition-colors hover:bg-fog disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <ArrowUp aria-hidden className="h-4 w-4" />
                  </button>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-forest-highland text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === rows.length - 1}
                    aria-label="Move stop later"
                    className="rounded-md p-1 text-forest-dark transition-colors hover:bg-fog disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <ArrowDown aria-hidden className="h-4 w-4" />
                  </button>
                </div>

                {/* Body */}
                <div className="min-w-0 flex-1">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-fog px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-forest-highland">
                    <Icon aria-hidden className="h-3.5 w-3.5" />
                    {kindLabel[item.kind]}
                  </span>
                  <Link
                    href={data.href}
                    className="mt-1.5 block truncate font-display text-lg font-bold text-forest-darkest hover:text-forest-highland"
                  >
                    {data.name}
                  </Link>
                  <p className="flex items-center gap-1.5 text-sm text-neutralgray">
                    <MapPin aria-hidden className="h-3.5 w-3.5" />
                    {data.region} · {data.meta}
                  </p>

                  {/* Nights stepper for stays */}
                  {item.kind === "stay" && (
                    <div className="mt-2 flex items-center gap-2 text-sm">
                      <span className="text-neutralgray">Nights:</span>
                      <div className="inline-flex items-center rounded-full border border-softgray">
                        <button
                          type="button"
                          onClick={() => setNights(item.id, (item.nights ?? 1) - 1)}
                          aria-label="One fewer night"
                          className="rounded-l-full px-2.5 py-1 text-forest-dark hover:bg-fog"
                        >
                          <Minus aria-hidden className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-[2rem] text-center font-semibold text-forest-darkest">
                          {item.nights ?? 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => setNights(item.id, (item.nights ?? 1) + 1)}
                          aria-label="One more night"
                          className="rounded-r-full px-2.5 py-1 text-forest-dark hover:bg-fog"
                        >
                          <Plus aria-hidden className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="text-neutralgray">· £{data.cost} total</span>
                    </div>
                  )}
                </div>

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => remove(item.kind, item.id)}
                  aria-label={`Remove ${data.name} from your trip`}
                  className="self-start rounded-md p-2 text-neutralgray transition-colors hover:bg-fog hover:text-red-600"
                >
                  <Trash2 aria-hidden className="h-4 w-4" />
                </button>
              </li>
            );
          })}
        </ol>

        <div className="mt-4 text-right">
          <button
            type="button"
            onClick={clear}
            className="text-sm font-medium text-neutralgray underline-offset-2 hover:text-red-600 hover:underline"
          >
            Clear trip
          </button>
        </div>

        {/* Finalise — placeholder until the booking backend lands */}
        <section className="mt-10 rounded-2xl bg-forest-gradient p-8 text-center text-fog">
          <h2 className="font-display text-2xl font-bold">This is your trip</h2>
          <p className="mx-auto mt-2 max-w-md text-fog/85">
            {totals.walkingDays > 0 && `${totals.walkingDays} walking days`}
            {totals.nights > 0 && ` · ${totals.nights} nights`}
            {totals.cost > 0 && ` · from £${totals.cost} per person`}.
          </p>
          {sent ? (
            <p
              role="status"
              className="mx-auto mt-6 max-w-md rounded-xl bg-white/10 px-4 py-3 text-sm text-fog ring-1 ring-inset ring-white/20"
            >
              Thanks! Online booking is coming soon — for now your itinerary lives
              on this device. We&apos;ll wire this button up to real enquiries in the
              next step.
            </p>
          ) : (
            <AnimatedCTA type="button" onClick={() => setSent(true)} className="mt-6">
              Request this itinerary
            </AnimatedCTA>
          )}
          {/*
            TODO (backend course module): replace the local setSent() above with a
            real submission. The whole `trip` object (anchorRouteId + ordered items
            with nights) is already shaped to POST straight to an enquiry/booking
            endpoint — e.g. fetch("/api/enquiry", { method: "POST", body: JSON.stringify(trip) }).
            Add a name/email lead form here at that point.
          */}
        </section>
      </div>
    </>
  );
}

function Header() {
  return (
    <header className="bg-forest-gradient text-fog">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="flex items-center gap-3 text-sm font-semibold uppercase tracking-wider text-mint">
          <span aria-hidden className="h-px w-8 bg-mint/60" />
          Your plan
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">My Trip</h1>
        <p className="mt-3 max-w-2xl text-fog/85">
          Everything you&apos;ve gathered, in the order you&apos;ll travel it. Add
          more as you browse, fine-tune the sequence, then send it our way.
        </p>
      </div>
    </header>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-4 text-center shadow-card">
      <dd className="font-display text-2xl font-bold text-forest-highland">{value}</dd>
      <dt className="mt-0.5 text-xs uppercase tracking-wide text-neutralgray">{label}</dt>
    </div>
  );
}
