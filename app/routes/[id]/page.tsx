import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CalendarDays, TrainFront, Backpack, Dumbbell, PawPrint } from "lucide-react";
import { getRouteById, getRoutes } from "@/lib/catalog";
import AnimatedCTA from "@/components/AnimatedCTA";
import AddToTripButton from "@/components/AddToTripButton";
import Button from "@/components/Button";
import { DifficultyBadge } from "@/components/Badge";
import Container from "@/components/Container";
import { gearFor, fitnessNote, destinationForRegion } from "@/lib/detail";

// ISR: DB-Änderungen erscheinen ohne Deploy (alle 5 Min revalidiert).
export const revalidate = 300;

export async function generateStaticParams() {
  const routes = await getRoutes();
  return routes.map((r) => ({ id: r.id }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const route = await getRouteById(params.id);
  if (!route) return { title: "Route not found — Hike Scotland" };
  return { title: `${route.name} — Hike Scotland`, description: route.summary };
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-softgray/40 py-3 last:border-0">
      <dt className="text-sm text-neutralgray">{label}</dt>
      <dd className="text-right text-sm font-semibold text-forest-dark">{value}</dd>
    </div>
  );
}

export default async function RouteDetailPage({ params }: { params: { id: string } }) {
  const route = await getRouteById(params.id);
  if (!route) notFound();

  const dest = destinationForRegion(route.region);
  const gear = gearFor(route.difficulty);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden text-fog">
        <Image
          src={route.image ?? "/heroes/landing.jpg"}
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-darkest/90 via-forest-darkest/55 to-forest-darkest/40" />
        <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col justify-end px-4 py-12 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-4 text-sm text-fog/80">
            <Link href="/routes" className="hover:text-fog">Routes</Link>
            <span aria-hidden className="mx-2">/</span>
            <span className="text-fog">{route.name}</span>
          </nav>
          <div className="flex flex-wrap items-center gap-3">
            <DifficultyBadge level={route.difficulty} />
            <span className="rounded-full bg-white/15 px-3 py-1 text-sm font-medium text-fog ring-1 ring-inset ring-white/25">
              {route.region}
            </span>
          </div>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-tight sm:text-5xl">
            {route.name}
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-fog/90">{route.summary}</p>
        </div>
      </section>

      <Container py="compact">
        <div className="grid gap-10 lg:grid-cols-[1fr,20rem] lg:gap-14">
          {/* Main content */}
          <div className="space-y-12">
            {/* Overview */}
            <section>
              <h2 className="font-display text-2xl font-bold text-forest-darkest">Overview</h2>
              <div className="mt-4 space-y-4">
                {route.description.map((p, i) => (
                  <p key={i} className="text-base leading-relaxed text-neutralgray">{p}</p>
                ))}
              </div>
            </section>

            {/* Best of */}
            <section>
              <h2 className="font-display text-2xl font-bold text-forest-darkest">Best of this route</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {route.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-card">
                    <span aria-hidden className="mt-0.5 text-mist">▲</span>
                    <span className="text-sm font-medium text-forest-dark">{h}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Good to know */}
            <section>
              <h2 className="font-display text-2xl font-bold text-forest-darkest">Good to know</h2>
              <div className="mt-4 grid gap-6 sm:grid-cols-2">
                <div className="rounded-2xl bg-white p-6 shadow-card">
                  <h3 className="flex items-center gap-2 font-semibold text-forest-darkest">
                    <CalendarDays aria-hidden className="h-5 w-5" color="url(#hike-gradient)" /> Best time to walk
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutralgray">
                    {dest?.bestTime ??
                      `Best enjoyed in ${route.seasons.join(", ").toLowerCase()}.`}
                  </p>
                  <p className="mt-2 text-sm text-neutralgray">
                    <span className="font-medium text-forest-dark">Ideal seasons:</span>{" "}
                    {route.seasons.join(", ")}
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-6 shadow-card">
                  <h3 className="flex items-center gap-2 font-semibold text-forest-darkest">
                    <TrainFront aria-hidden className="h-5 w-5" color="url(#hike-gradient)" /> Getting there
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutralgray">
                    {dest?.gettingThere ??
                      `Located in ${route.region}. Check local transport for the nearest trailhead.`}
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-6 shadow-card">
                  <h3 className="flex items-center gap-2 font-semibold text-forest-darkest">
                    <Backpack aria-hidden className="h-5 w-5" color="url(#hike-gradient)" /> What to bring
                  </h3>
                  <ul className="mt-2 space-y-1.5">
                    {gear.map((g) => (
                      <li key={g} className="flex items-start gap-2 text-sm text-neutralgray">
                        <span aria-hidden className="mt-0.5 text-mist">✓</span>
                        {g}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl bg-white p-6 shadow-card">
                  <h3 className="flex items-center gap-2 font-semibold text-forest-darkest">
                    <Dumbbell aria-hidden className="h-5 w-5" color="url(#hike-gradient)" /> Fitness & experience
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutralgray">
                    {fitnessNote(route.difficulty)}
                  </p>
                  {route.dogFriendly && (
                    <p className="mt-2 flex items-center gap-1.5 text-sm text-neutralgray">
                      <PawPrint aria-hidden className="h-4 w-4 flex-shrink-0" color="url(#hike-gradient)" />
                      Dog friendly — well-behaved dogs welcome.
                    </p>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl bg-white p-6 shadow-card">
              <h2 className="font-display text-lg font-bold text-forest-darkest">At a glance</h2>
              <dl className="mt-3">
                <Fact label="Distance" value={`${route.distanceKm} km`} />
                <Fact label="Total ascent" value={`${route.ascentM} m`} />
                <Fact
                  label={route.days > 1 ? "Duration" : "Time on foot"}
                  value={route.days > 1 ? `${route.days} days` : `${route.durationHours} hours`}
                />
                <Fact label="Difficulty" value={route.difficulty} />
                <Fact label="Terrain" value={route.terrain.join(", ")} />
                <Fact label="Region" value={route.region} />
                <Fact label="Dog friendly" value={route.dogFriendly ? "Yes" : "No"} />
              </dl>
              <AnimatedCTA href={`/plan?route=${route.id}`} block className="mt-5 text-sm">
                Plan a trip around this route
              </AnimatedCTA>
              <div className="mt-2">
                <AddToTripButton kind="route" id={route.id} block />
              </div>
              {dest && (
                <Button href={`/destinations/${dest.slug}`} variant="outline" size="sm" block className="mt-2">
                  Explore {dest.name}
                </Button>
              )}
            </div>

            <div className="mt-4 flex gap-3">
              <Link href="/tours" className="flex-1 rounded-xl bg-white p-4 text-center text-sm font-semibold text-forest-dark shadow-card transition-transform hover:-translate-y-0.5">
                Guided tours
              </Link>
              <Link href="/stays" className="flex-1 rounded-xl bg-white p-4 text-center text-sm font-semibold text-forest-dark shadow-card transition-transform hover:-translate-y-0.5">
                Places to stay
              </Link>
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}
