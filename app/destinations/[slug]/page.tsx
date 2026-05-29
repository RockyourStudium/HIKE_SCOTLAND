import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  destinations,
  getDestinationBySlug,
} from "@/data/destinations";
import { routes } from "@/data/routes";
import { tours } from "@/data/tours";
import { stays } from "@/data/stays";
import RouteCard from "@/components/RouteCard";

export function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const dest = getDestinationBySlug(params.slug);
  if (!dest) return { title: "Destination not found — Hike Scotland" };
  return {
    title: `${dest.name} — Hike Scotland`,
    description: dest.introParagraphs[0],
  };
}

export default function DestinationPage({
  params,
}: {
  params: { slug: string };
}) {
  const dest = getDestinationBySlug(params.slug);
  if (!dest) notFound();

  const regionRoutes = routes.filter((r) => r.region === dest.region);
  const featured = regionRoutes.slice(0, 3);
  const regionTours = tours.filter((t) => t.region === dest.region);
  const regionStays = stays.filter((s) => s.region === dest.region);

  // The next destination in the sequence, wrapping around.
  const index = destinations.findIndex((d) => d.slug === dest.slug);
  const next = destinations[(index + 1) % destinations.length];

  return (
    <>
      {/* Hero */}
      <section className={`relative overflow-hidden bg-gradient-to-br ${dest.heroGradient} text-fog`}>
        <div className="absolute inset-0 opacity-20" aria-hidden>
          <div className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-mist blur-3xl" />
          <div className="absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-forest-highland blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-fog/70">
            <Link href="/destinations" className="hover:text-fog">
              Destinations
            </Link>
            <span aria-hidden className="mx-2">/</span>
            <span className="text-fog">{dest.name}</span>
          </nav>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-mint">
            Destination · {dest.number}
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            {dest.name}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-fog/85 sm:text-xl">{dest.tagline}</p>
        </div>
      </section>

      {/* Intro */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr,0.8fr] lg:gap-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-mist">
              {dest.name}
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-forest-darkest sm:text-4xl">
              {dest.introHeading}
            </h2>
            <div className="mt-5 space-y-4">
              {dest.introParagraphs.map((p, i) => (
                <p key={i} className="text-base leading-relaxed text-neutralgray">
                  {p}
                </p>
              ))}
            </div>
            <Link
              href="#featured"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-forest-highland px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-forest-dark"
            >
              See the routes ↓
            </Link>
          </div>

          {/* Highlights */}
          <aside className="rounded-2xl bg-white p-6 shadow-card sm:p-8">
            <h3 className="font-display text-xl font-bold text-forest-darkest">
              Why hike here
            </h3>
            <ul className="mt-5 space-y-5">
              {dest.highlights.map((h) => (
                <li key={h.title} className="flex gap-3">
                  <span aria-hidden className="mt-1 text-mist">▲</span>
                  <div>
                    <p className="font-semibold text-forest-dark">{h.title}</p>
                    <p className="text-sm text-neutralgray">{h.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      {/* Featured hikes */}
      {featured.length > 0 && (
        <section id="featured" className="bg-white/60">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-mist">
                  Hand-picked · Top {featured.length}
                </p>
                <h2 className="mt-2 font-display text-3xl font-bold text-forest-darkest sm:text-4xl">
                  Routes in {dest.name}
                </h2>
              </div>
              <Link
                href="/routes"
                className="rounded-full border border-forest-highland px-5 py-2.5 text-sm font-semibold text-forest-highland transition-colors hover:bg-forest-highland hover:text-white"
              >
                All routes
              </Link>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((route) => (
                <RouteCard key={route.id} route={route} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Practical info */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-card sm:p-8">
            <div className="flex items-center gap-3">
              <span aria-hidden className="text-2xl">🗓️</span>
              <h3 className="font-display text-xl font-bold text-forest-darkest">
                Best time to visit
              </h3>
            </div>
            <p className="mt-4 text-base leading-relaxed text-neutralgray">
              {dest.bestTime}
            </p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-card sm:p-8">
            <div className="flex items-center gap-3">
              <span aria-hidden className="text-2xl">🚆</span>
              <h3 className="font-display text-xl font-bold text-forest-darkest">
                Getting there
              </h3>
            </div>
            <p className="mt-4 text-base leading-relaxed text-neutralgray">
              {dest.gettingThere}
            </p>
          </div>
        </div>
      </section>

      {/* Field notes gallery */}
      <section className="bg-white/60">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <p className="text-sm font-semibold uppercase tracking-wider text-mist">
            Field notes · From the trail
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-forest-darkest sm:text-4xl">
            A glimpse of {dest.name}
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {dest.fieldNotes.map((note) => (
              <figure
                key={note.caption}
                className={`group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-br p-4 ${note.gradient}`}
              >
                <figcaption className="relative text-fog">
                  <p className="text-xs uppercase tracking-wider text-fog/70">
                    {note.location}
                  </p>
                  <p className="mt-1 font-display text-lg font-semibold leading-snug">
                    {note.caption}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Tours & stays quick links (if any) */}
      {(regionTours.length > 0 || regionStays.length > 0) && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2">
            {regionTours.length > 0 && (
              <Link
                href="/tours"
                className="group flex items-center justify-between rounded-2xl bg-white p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                <div>
                  <p className="font-display text-lg font-bold text-forest-darkest">
                    {regionTours.length} guided tour{regionTours.length !== 1 ? "s" : ""} here
                  </p>
                  <p className="text-sm text-neutralgray">Let someone else handle the logistics.</p>
                </div>
                <span className="text-forest-highland transition-transform group-hover:translate-x-1">→</span>
              </Link>
            )}
            {regionStays.length > 0 && (
              <Link
                href="/stays"
                className="group flex items-center justify-between rounded-2xl bg-white p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                <div>
                  <p className="font-display text-lg font-bold text-forest-darkest">
                    {regionStays.length} place{regionStays.length !== 1 ? "s" : ""} to stay
                  </p>
                  <p className="text-sm text-neutralgray">From bothies to country hotels.</p>
                </div>
                <span className="text-forest-highland transition-transform group-hover:translate-x-1">→</span>
              </Link>
            )}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 overflow-hidden rounded-3xl bg-forest-gradient px-6 py-14 text-center text-fog sm:px-12">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Ready to explore {dest.name}?
          </h2>
          <p className="max-w-xl text-lg text-fog/85">
            Use the trip planner to build an itinerary around this region, or keep
            exploring the rest of Scotland.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/plan"
              className="inline-flex items-center justify-center rounded-full bg-mist px-7 py-3.5 text-base font-semibold text-forest-darkest transition-colors hover:bg-mint"
            >
              Plan a trip
            </Link>
            <Link
              href={`/destinations/${next.slug}`}
              className="inline-flex items-center justify-center rounded-full border border-fog/30 px-7 py-3.5 text-base font-semibold text-fog transition-colors hover:bg-white/10"
            >
              Next: {next.name} →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
