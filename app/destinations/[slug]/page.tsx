import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CalendarDays, TrainFront, Mountain } from "lucide-react";
import AnimatedCTA from "@/components/AnimatedCTA";
import CinematicHero from "@/components/CinematicHero";
import Container from "@/components/Container";
import Eyebrow from "@/components/Eyebrow";
import RouteCard from "@/components/RouteCard";
import { destinations, getDestinationBySlug } from "@/data/destinations";
import { routes } from "@/data/routes";
import { tours } from "@/data/tours";
import { stays } from "@/data/stays";
import { heroImage } from "@/lib/heroImage";

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

  const index = destinations.findIndex((d) => d.slug === dest.slug);
  const next = destinations[(index + 1) % destinations.length];

  const coordsLabel = `${dest.coords.lat.toFixed(2)}°N · ${Math.abs(dest.coords.lng).toFixed(2)}°W`;

  return (
    <div className="bg-forest-darkest text-fog">
      {/* Hero */}
      <CinematicHero
        image={heroImage(dest.slug)}
        size="md"
        topSlot={
          <nav aria-label="Breadcrumb" className="text-sm text-fog/70">
            <Link href="/destinations" className="hover:text-fog">
              Destinations
            </Link>
            <span aria-hidden className="mx-2">
              /
            </span>
            <span className="text-fog">{dest.name}</span>
          </nav>
        }
        eyebrow={`Destination · ${dest.number} · ${coordsLabel}`}
        title={dest.name}
        subtitle={dest.tagline}
      />

      {/* Intro + why hike here */}
      <Container as="section" py="standard">
        <div className="grid gap-10 lg:grid-cols-[1fr,0.8fr] lg:gap-16">
          <div>
            <Eyebrow dash>{dest.name}</Eyebrow>
            <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-fog sm:text-4xl sm:leading-tight lg:text-5xl lg:leading-tight">
              {dest.introHeading}
            </h2>
            <div className="mt-6 space-y-4">
              {dest.introParagraphs.map((p, i) => (
                <p key={i} className="text-base leading-loose text-fog/70">
                  {p}
                </p>
              ))}
            </div>
            <AnimatedCTA href="#featured" className="mt-8 text-sm">
              See the routes ↓
            </AnimatedCTA>
          </div>

          <aside className="rounded-2xl bg-white/[0.06] p-6 ring-1 ring-white/10 sm:p-8">
            <h3 className="font-display text-xl font-bold text-fog">Why hike here</h3>
            <ul className="mt-5 space-y-5">
              {dest.highlights.map((h) => (
                <li key={h.title} className="flex gap-3">
                  <Mountain aria-hidden className="mt-0.5 h-5 w-5 flex-shrink-0 text-mint" strokeWidth={2} />
                  <div>
                    <p className="font-semibold text-fog">{h.title}</p>
                    <p className="text-sm leading-relaxed text-fog/70">{h.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </Container>

      {/* Featured routes */}
      {featured.length > 0 && (
        <Container as="section" id="featured" className="pb-20 lg:pb-28">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow dash>Hand-picked · Top {featured.length}</Eyebrow>
              <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-fog sm:text-4xl">
                Routes in {dest.name}
              </h2>
            </div>
            <Link
              href="/routes"
              className="rounded-full border border-fog/30 px-5 py-2.5 text-sm font-semibold text-fog transition-colors hover:bg-white/10"
            >
              All routes
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((route) => (
              <RouteCard key={route.id} route={route} tone="tinted" />
            ))}
          </div>
        </Container>
      )}

      {/* Practical info */}
      <Container as="section" className="pb-20 lg:pb-28">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-white/[0.06] p-6 ring-1 ring-white/10 sm:p-8">
            <div className="flex items-center gap-3">
              <CalendarDays aria-hidden className="h-7 w-7 text-mint" strokeWidth={1.75} />
              <h3 className="font-display text-xl font-bold text-fog">Best time to visit</h3>
            </div>
            <p className="mt-4 text-base leading-loose text-fog/70">{dest.bestTime}</p>
          </div>
          <div className="rounded-2xl bg-white/[0.06] p-6 ring-1 ring-white/10 sm:p-8">
            <div className="flex items-center gap-3">
              <TrainFront aria-hidden className="h-7 w-7 text-mint" strokeWidth={1.75} />
              <h3 className="font-display text-xl font-bold text-fog">Getting there</h3>
            </div>
            <p className="mt-4 text-base leading-loose text-fog/70">{dest.gettingThere}</p>
          </div>
        </div>
      </Container>

      {/* Field notes gallery — full-bleed, sharp-cornered */}
      <section className="pb-20 lg:pb-28">
        <Container className="mb-10">
          <Eyebrow dash>Field notes · From the trail</Eyebrow>
          <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-fog sm:text-4xl">
            A glimpse of {dest.name}
          </h2>
        </Container>
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 lg:grid-cols-4">
          {dest.fieldNotes.map((note) => (
            <figure
              key={note.caption}
              className={`group relative flex aspect-[4/5] flex-col justify-end overflow-hidden bg-gradient-to-br p-4 ${note.gradient}`}
            >
              <Image
                src={note.image}
                alt={`${note.caption} — ${note.location}`}
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-forest-darkest/90 via-forest-darkest/20 to-transparent"
              />
              <figcaption className="relative text-fog">
                <p className="text-xs uppercase tracking-wider text-fog/70">{note.location}</p>
                <p className="mt-1 font-display text-lg font-semibold leading-snug">
                  {note.caption}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Tours & stays quick links */}
      {(regionTours.length > 0 || regionStays.length > 0) && (
        <Container as="section" className="pb-20">
          <div className="grid gap-4 sm:grid-cols-2">
            {regionTours.length > 0 && (
              <Link
                href="/tours"
                className="group flex items-center justify-between rounded-2xl bg-white/[0.06] p-6 ring-1 ring-white/10 transition-all hover:-translate-y-0.5 hover:bg-white/[0.1]"
              >
                <div>
                  <p className="font-display text-lg font-bold text-fog">
                    {regionTours.length} guided tour{regionTours.length !== 1 ? "s" : ""} here
                  </p>
                  <p className="text-sm text-fog/70">Let someone else handle the logistics.</p>
                </div>
                <span className="text-mint transition-transform group-hover:translate-x-1">→</span>
              </Link>
            )}
            {regionStays.length > 0 && (
              <Link
                href="/stays"
                className="group flex items-center justify-between rounded-2xl bg-white/[0.06] p-6 ring-1 ring-white/10 transition-all hover:-translate-y-0.5 hover:bg-white/[0.1]"
              >
                <div>
                  <p className="font-display text-lg font-bold text-fog">
                    {regionStays.length} place{regionStays.length !== 1 ? "s" : ""} to stay
                  </p>
                  <p className="text-sm text-fog/70">From bothies to country hotels.</p>
                </div>
                <span className="text-mint transition-transform group-hover:translate-x-1">→</span>
              </Link>
            )}
          </div>
        </Container>
      )}

      {/* CTA — full-bleed */}
      <section className="relative isolate overflow-hidden">
        <Image src={heroImage(dest.slug)} alt="" fill sizes="100vw" className="-z-10 object-cover" />
        <div className="absolute inset-0 -z-10 bg-forest-darkest/80" />
        <Container size="3xl" py="standard" className="flex flex-col items-center text-center">
          <h2 className="font-display text-3xl font-bold leading-tight text-fog sm:text-4xl lg:text-5xl">
            Ready to explore {dest.name}?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-fog/85">
            Build an itinerary around this region, or keep exploring the rest of
            Scotland.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <AnimatedCTA href="/plan">Plan a trip</AnimatedCTA>
            <Link
              href={`/destinations/${next.slug}`}
              className="inline-flex items-center justify-center rounded-full border border-fog/30 px-7 py-3.5 text-base font-semibold text-fog transition-colors hover:bg-white/10"
            >
              Next: {next.name} →
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
