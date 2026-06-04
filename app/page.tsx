import Link from "next/link";
import Image from "next/image";
import { MountainSnow, Castle, Bird } from "lucide-react";
import AnimatedCTA from "@/components/AnimatedCTA";
import CinematicHero from "@/components/CinematicHero";
import Container from "@/components/Container";
import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";
import RouteCarousel from "@/components/RouteCarousel";
import { routes } from "@/data/routes";
import { destinations } from "@/data/destinations";
import { heroImage } from "@/lib/heroImage";

const stats = [
  { value: "282", label: "Munros" },
  { value: "6", label: "Regions" },
  { value: "10+", label: "Routes" },
];

const galleryTiles = [
  { src: "/gallery/island-studded-loch.jpg", caption: "Island-studded loch", span: "col-span-2 row-span-2" },
  { src: "/gallery/highland-loch.jpg", caption: "Highland loch under snow", span: "col-span-2" },
  { src: "/gallery/hebridean-shore.jpg", caption: "Hebridean shore", span: "" },
  { src: "/gallery/argyll-coast.jpg", caption: "Argyll coast at dusk", span: "" },
  { src: "/gallery/hidden-glen.jpg", caption: "A hidden glen", span: "col-span-2" },
  { src: "/gallery/heather-in-bloom.jpg", caption: "Heather in bloom", span: "" },
  { src: "/gallery/sea-cliffs.jpg", caption: "Wild sea cliffs", span: "" },
];

// Ordered easy → expert; `step` staggers them into an ascending staircase on lg.
const levels = [
  {
    name: "Easy",
    accent: "bg-mint",
    body: "Relaxed walks on well-maintained trails, ideal for anyone who wants to take it slow.",
    examples: "Loch an Eilein, Falls of Bruar",
    step: "lg:mt-24",
  },
  {
    name: "Moderate",
    accent: "bg-mist",
    body: "A steady climb and varied terrain for walkers who want a little more underfoot.",
    examples: "Old Man of Storr, the Quiraing",
    step: "lg:mt-16",
  },
  {
    name: "Challenging",
    accent: "bg-forest-highland",
    body: "Long hikes, steep ascents and raw nature for experienced, well-prepared hikers.",
    examples: "Ben Nevis, Ben Lomond",
    step: "lg:mt-8",
  },
  {
    name: "Expert",
    accent: "bg-forest-dark",
    body: "Exposed ridges, scrambling and serious navigation — for seasoned hill-walkers only.",
    examples: "Cairn Gorm plateau, Aonach Eagach ridge",
    step: "lg:mt-0",
  },
];

const benefits = [
  {
    icon: MountainSnow,
    title: "Breathtaking landscapes",
    body: "From the windswept peaks of Glencoe to the lush trails of Glen Affric, experience nature's grandeur one step at a time.",
  },
  {
    icon: Castle,
    title: "Walking through history",
    body: "Follow ancient footpaths past castles, cairns and clan lands — from Culloden to the ruins of Urquhart Castle.",
  },
  {
    icon: Bird,
    title: "Wild, untouched beauty",
    body: "Discover remote glens, hidden waterfalls and wildlife you'll never meet from a car window.",
  },
];

export default function HomePage() {
  const featuredRoutes = routes.slice(0, 5);

  return (
    <div className="bg-forest-darkest text-fog">
      {/* Hero */}
      <CinematicHero
        image={heroImage("landing")}
        eyebrow="Discover Scotland on foot"
        title={
          <>
            The Highlands
            <br className="hidden sm:block" /> are calling.
          </>
        }
        subtitle="Misty glens, soaring Munros and trails that stay with you for life — route discovery, guided tours and stays, all in one place."
        topSlot={
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm tracking-wide text-fog/80">
            {stats.map((s, i) => (
              <li key={s.label} className="flex items-center gap-6">
                <span>
                  <span className="font-display text-base font-bold text-mint">{s.value}</span>{" "}
                  <span className="uppercase tracking-[0.2em] text-fog/70">{s.label}</span>
                </span>
                {i < stats.length - 1 && <span aria-hidden className="text-fog/30">·</span>}
              </li>
            ))}
          </ul>
        }
      >
        <AnimatedCTA href="/plan">Start the trip planner</AnimatedCTA>
        <Link
          href="/routes"
          className="inline-flex items-center justify-center rounded-full border border-fog/30 px-7 py-3.5 text-base font-semibold text-fog transition-colors hover:bg-white/10"
        >
          Browse routes
        </Link>
      </CinematicHero>

      {/* Feeling statement */}
      <Container as="section" size="4xl" py="dramatic" className="text-center">
        <Reveal>
          <Eyebrow>Why hike Scotland</Eyebrow>
          <h2 className="mx-auto mt-10 max-w-3xl font-display text-3xl font-bold leading-snug text-fog sm:text-4xl sm:leading-snug lg:text-5xl lg:leading-snug">
            Scotland isn&apos;t a destination. It&apos;s a feeling that stays with you.
          </h2>
          <p className="mx-auto mt-12 max-w-2xl text-lg leading-loose text-fog/70">
            Stand on a windswept ridge, the air crisp and clear, as endless green
            hills roll out beneath a sky of soft greys and gold. From the haunting
            beauty of Glencoe to the rugged trails of Skye, the Highlands reward
            every kind of walker — seasoned trekker or first-timer alike.
          </p>
        </Reveal>
      </Container>

      {/* Destinations */}
      <Container as="section" className="pb-8">
        <Reveal className="mb-10">
          <Eyebrow dash>Six regions</Eyebrow>
          <h2 className="mt-3 font-display text-3xl font-bold text-fog sm:text-4xl lg:text-5xl">
            Where the trail begins
          </h2>
        </Reveal>
        <Reveal className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((d) => (
            <Link
              key={d.slug}
              href={`/destinations/${d.slug}`}
              className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl"
            >
              <Image
                src={heroImage(d.slug)}
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-darkest via-forest-darkest/30 to-transparent" />
              <div className="relative p-5">
                <p className="font-display text-sm font-semibold text-mint">{d.number}</p>
                <h3 className="mt-1 font-display text-2xl font-bold text-fog">{d.name}</h3>
                <p className="mt-1 text-sm text-fog/75">{d.tagline}</p>
              </div>
            </Link>
          ))}
        </Reveal>
      </Container>

      {/* Featured routes */}
      <Container as="section" py="standard">
        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow dash>Featured</Eyebrow>
            <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-fog sm:text-4xl sm:leading-tight lg:text-5xl lg:leading-tight">
              Trails worth lacing up for
            </h2>
          </div>
          <Link
            href="/routes"
            className="rounded-full border border-fog/30 px-5 py-2.5 text-sm font-semibold text-fog transition-colors hover:bg-white/10"
          >
            View all routes
          </Link>
        </Reveal>
        <Reveal>
          <RouteCarousel routes={featuredRoutes} />
        </Reveal>
      </Container>

      {/* What makes Scotland a hiker's dream — full-bleed cinematic band */}
      <section className="relative isolate overflow-hidden">
        <Image
          src={heroImage("highlands")}
          alt=""
          fill
          sizes="100vw"
          className="-z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-forest-darkest/75 via-forest-darkest/55 to-forest-darkest/80" />
        <Container py="dramatic">
          <Reveal className="mx-auto max-w-2xl text-center">
            <Eyebrow>The draw</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-fog sm:text-4xl sm:leading-tight lg:text-5xl lg:leading-tight">
              A hiker&apos;s dream, in every direction
            </h2>
          </Reveal>
          <Reveal className="mt-12 grid gap-6 md:grid-cols-3">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="rounded-2xl bg-forest-darkest/55 p-6 ring-1 ring-white/10 backdrop-blur-sm"
              >
                <b.icon aria-hidden className="h-9 w-9 text-mint" strokeWidth={1.75} />
                <h3 className="mt-3 font-display text-xl font-bold text-fog">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fog/80">{b.body}</p>
              </div>
            ))}
          </Reveal>
        </Container>
      </section>

      {/* Choose your challenge */}
      <section>
        <Container py="standard">
          <Reveal className="mx-auto max-w-2xl text-center">
            <Eyebrow>For every pace</Eyebrow>
            <h2 className="mt-3 font-display text-3xl font-bold text-fog sm:text-4xl lg:text-5xl">
              Choose your challenge
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-fog/70">
              No matter your experience, there&apos;s a perfect walk for you. You
              choose how far — and how wild — you want to go.
            </p>
          </Reveal>
          <Reveal className="mt-12 grid items-start gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {levels.map((level) => (
              <div
                key={level.name}
                className={`overflow-hidden rounded-2xl bg-white/[0.08] ring-1 ring-white/15 ${level.step}`}
              >
                <div className={`h-1.5 ${level.accent}`} />
                <div className="p-6">
                  <h3 className="font-display text-xl font-bold text-fog">{level.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-fog/70">{level.body}</p>
                  <p className="mt-4 text-sm text-fog/60">
                    <span className="font-semibold text-mint">Try:</span> {level.examples}
                  </p>
                </div>
              </div>
            ))}
          </Reveal>
          <div className="mt-10 text-center">
            <AnimatedCTA href="/routes">Browse all routes</AnimatedCTA>
          </div>
        </Container>
      </section>

      {/* Scenes from the trail — full-bleed bento gallery (connects straight into the CTA) */}
      <section className="pt-24 lg:pt-40">
        <Reveal className="mx-auto mb-10 max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <Eyebrow>Field notes</Eyebrow>
          <h2 className="mt-3 font-display text-3xl font-bold text-fog sm:text-4xl lg:text-5xl">
            Scenes from the trail
          </h2>
        </Reveal>
        <Reveal className="grid auto-rows-[160px] grid-cols-2 gap-1.5 sm:auto-rows-[250px] sm:gap-2 lg:grid-cols-4">
          {galleryTiles.map((tile) => (
            <figure
              key={tile.src}
              className={`group relative overflow-hidden ${tile.span}`}
            >
              <Image
                src={tile.src}
                alt={tile.caption}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-darkest/80 via-transparent to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-4 font-display text-sm font-semibold text-fog drop-shadow sm:text-base">
                {tile.caption}
              </figcaption>
            </figure>
          ))}
        </Reveal>
      </section>

      {/* CTA */}
      <section className="relative isolate overflow-hidden">
        <Image
          src={heroImage("glencoe")}
          alt=""
          fill
          sizes="100vw"
          className="-z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-forest-darkest/80" />
        <Container size="3xl" py="standard" className="text-center">
          <h2 className="font-display text-4xl font-bold leading-tight text-fog sm:text-5xl sm:leading-tight lg:text-6xl lg:leading-tight">
            Lace up. We&apos;ll handle the rest.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-fog/85">
            Answer a few questions and we&apos;ll match you with routes, tours and
            stays — then build it into one itinerary, in minutes.
          </p>
          <div className="mt-8 flex justify-center">
            <AnimatedCTA href="/plan">Start the trip planner</AnimatedCTA>
          </div>
        </Container>
      </section>
    </div>
  );
}
