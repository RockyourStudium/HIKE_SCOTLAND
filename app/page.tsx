import Link from "next/link";
import Image from "next/image";
import {
  Compass,
  Map,
  Backpack,
  MountainSnow,
  Castle,
  Bird,
  Mountain,
} from "lucide-react";
import AnimatedCTA from "@/components/AnimatedCTA";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import RouteCard from "@/components/RouteCard";
import TourCard from "@/components/TourCard";
import { routes } from "@/data/routes";
import { tours } from "@/data/tours";
import { heroImage } from "@/lib/heroImage";

const steps = [
  {
    icon: Compass,
    title: "Tell us your style",
    body: "Answer a few quick questions about your experience, time and what you love about the outdoors.",
  },
  {
    icon: Map,
    title: "Get matched routes",
    body: "We surface routes, guided tours and stays tailored to your preferences and ability.",
  },
  {
    icon: Backpack,
    title: "Build your itinerary",
    body: "Combine walks, tours and accommodation into one plan — ready when you are.",
  },
];

const stats = [
  { value: "282", label: "Munros to bag" },
  { value: "10+", label: "Hand-picked routes" },
  { value: "6", label: "Regions covered" },
  { value: "0", label: "Booking headaches" },
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
    body: "Discover remote glens, hidden waterfalls and wildlife you'll never meet from a car window. Scotland, raw and real.",
  },
];

// Bento mosaic — span classes tile cleanly on both 2-col and 4-col grids.
const galleryTiles = [
  { src: "/gallery/island-studded-loch.jpg", caption: "Island-studded loch", span: "col-span-2 row-span-2" },
  { src: "/gallery/highland-loch.jpg", caption: "Highland loch under snow", span: "col-span-2" },
  { src: "/gallery/hebridean-shore.jpg", caption: "Hebridean shore", span: "" },
  { src: "/gallery/argyll-coast.jpg", caption: "Argyll coast at dusk", span: "" },
  { src: "/gallery/hidden-glen.jpg", caption: "A hidden glen", span: "col-span-2" },
  { src: "/gallery/heather-in-bloom.jpg", caption: "Heather in bloom", span: "" },
  { src: "/gallery/sea-cliffs.jpg", caption: "Wild sea cliffs", span: "" },
];

const levels = [
  {
    name: "Easy",
    accent: "bg-mint",
    body: "Relaxed walks on well-maintained trails, ideal for anyone who wants to take it slow.",
    examples: "Loch Lomond shoreline, Perthshire forest trails",
  },
  {
    name: "Moderate",
    accent: "bg-mist",
    body: "A steady climb and varied terrain for walkers who want a little more underfoot.",
    examples: "Glen Affric trails, ridge walks with moderate ascent",
  },
  {
    name: "Challenging",
    accent: "bg-forest-highland",
    body: "Long hikes, steep ascents and raw nature for experienced, well-prepared hikers.",
    examples: "Ben Nevis ascent, the ridges of Torridon",
  },
];

export default function HomePage() {
  const featuredRoutes = routes.slice(0, 3);
  const featuredTours = tours.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-forest-gradient text-fog">
        <div className="absolute inset-0" aria-hidden>
          <Image
            src={heroImage("landing")}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-forest-darkest/85 via-forest-darkest/45 to-forest-darkest/10" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
          <div className="max-w-3xl animate-fade-up">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-mint ring-1 ring-inset ring-white/20">
              <Mountain aria-hidden className="h-4 w-4" strokeWidth={2} />
              Discover Scotland on foot
            </p>
            <h1 className="mt-6 font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Plan your perfect Scottish hiking adventure
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fog/85">
              From misty glens to soaring Munros, Hike Scotland brings route
              discovery, guided tours and accommodation into one place — with a
              planner that builds an itinerary around you.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <AnimatedCTA href="/plan">Start the trip planner</AnimatedCTA>
              <Link
                href="/routes"
                className="inline-flex items-center justify-center rounded-full border border-fog/30 px-7 py-3.5 text-base font-semibold text-fog transition-colors hover:bg-white/10"
              >
                Browse routes
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-softgray/40 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-3xl font-bold text-forest-highland sm:text-4xl">
                {s.value}
              </p>
              <p className="mt-1 text-sm text-neutralgray">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story / intro */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-mist">
            Why hike Scotland
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-forest-darkest sm:text-4xl">
            Where nature speaks in silence
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-neutralgray">
            Imagine standing on a windswept ridge, the air crisp and clear, as
            endless green hills roll out before you under a sky painted in soft
            greys and gold. This is Scotland — where beauty waits around every bend.
          </p>
          <p className="mt-4 text-base leading-relaxed text-neutralgray">
            Scotland isn&apos;t just a destination, it&apos;s a feeling that stays
            with you. From the haunting beauty of Glencoe to the rugged trails of
            the Isle of Skye, the Highlands reward every kind of walker — whether
            you&apos;re a seasoned trekker or lacing up for the very first time.
          </p>
          <p className="mt-6 font-display text-xl font-semibold text-forest-highland">
            You walk, we plan — together we discover the soul of the Highlands.
          </p>
        </Reveal>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
        <SectionHeading
          eyebrow="How it works"
          title="Three steps to the trail"
          description="No spreadsheets, no twenty browser tabs. Just a clear path from idea to adventure."
          align="center"
        />
        <Reveal className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="relative rounded-2xl bg-white p-6 shadow-card"
            >
              <span className="absolute -top-4 left-6 flex h-9 w-9 items-center justify-center rounded-full bg-forest-highland text-sm font-bold text-white">
                {i + 1}
              </span>
              <step.icon
                aria-hidden
                className="h-9 w-9"
                color="url(#hike-gradient)"
                strokeWidth={1.75}
              />
              <h3 className="mt-3 font-display text-xl font-bold text-forest-darkest">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutralgray">{step.body}</p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* Featured routes */}
      <section className="bg-white/60">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Featured"
              title="Routes worth lacing up for"
              description="A taste of what's waiting — from gentle loch loops to serious summit days."
            />
            <Link
              href="/routes"
              className="rounded-full border border-forest-highland px-5 py-2.5 text-sm font-semibold text-forest-highland transition-colors hover:bg-forest-highland hover:text-white"
            >
              View all routes
            </Link>
          </div>
          <Reveal className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredRoutes.map((route) => (
              <RouteCard key={route.id} route={route} />
            ))}
          </Reveal>
        </div>
      </section>

      {/* Featured tours */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Guided & supported"
            title="Let someone else carry the planning"
            description="Small-group guided tours and self-guided trips with the logistics handled."
          />
          <Link
            href="/tours"
            className="rounded-full border border-forest-highland px-5 py-2.5 text-sm font-semibold text-forest-highland transition-colors hover:bg-forest-highland hover:text-white"
          >
            View all tours
          </Link>
        </div>
        <Reveal className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredTours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </Reveal>
      </section>

      {/* Why Scotland — benefits */}
      <section className="bg-white/60">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="The draw"
            title="What makes Scotland a hiker's dream?"
            description="Looking for adventure or quiet moments in nature? Scotland's trails offer both — with breathtaking views every step of the way."
            align="center"
          />
          <Reveal className="mt-12 grid gap-6 md:grid-cols-3">
            {benefits.map((b) => (
              <div key={b.title} className="rounded-2xl bg-white p-6 shadow-card">
                <b.icon
                  aria-hidden
                  className="h-9 w-9"
                  color="url(#hike-gradient)"
                  strokeWidth={1.75}
                />
                <h3 className="mt-3 font-display text-xl font-bold text-forest-darkest">
                  {b.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutralgray">{b.body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Choose your challenge */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <SectionHeading
          eyebrow="For every pace"
          title="Choose your challenge"
          description="No matter your experience or fitness, there's a perfect walk for you. You choose how far — and how wild — you want to go."
          align="center"
        />
        <Reveal className="mt-12 grid gap-6 md:grid-cols-3">
          {levels.map((level) => (
            <div
              key={level.name}
              className="overflow-hidden rounded-2xl bg-white shadow-card"
            >
              <div className={`h-2 ${level.accent}`} />
              <div className="p-6">
                <h3 className="font-display text-xl font-bold text-forest-darkest">
                  {level.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutralgray">{level.body}</p>
                <p className="mt-4 text-sm text-forest-dark">
                  <span className="font-semibold">Try:</span> {level.examples}
                </p>
              </div>
            </div>
          ))}
        </Reveal>
        <div className="mt-10 text-center">
          <AnimatedCTA href="/routes">Browse all routes</AnimatedCTA>
        </div>
      </section>

      {/* Field notes — bento gallery */}
      <section className="bg-white/60">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Field notes"
            title="Scenes from the trail"
            description="A glimpse of the landscapes waiting for you — from island-studded lochs to wild sea cliffs."
            align="center"
          />
          <Reveal className="mt-12 grid auto-rows-[150px] grid-cols-2 gap-3 sm:auto-rows-[200px] sm:gap-4 lg:grid-cols-4">
            {galleryTiles.map((tile) => (
              <figure
                key={tile.src}
                className={`group relative overflow-hidden rounded-2xl shadow-card ${tile.span}`}
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
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-forest-gradient px-6 py-14 text-center text-fog sm:px-12">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            The Highlands are calling
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-fog/85">
            Lace up your boots and pack your sense of adventure — let us handle
            the planning while you focus on the wonder. Answer a few questions and
            we&apos;ll match you with routes, tours and stays in minutes.
          </p>
          <AnimatedCTA href="/plan" className="mt-8">
            Book your journey
          </AnimatedCTA>
        </div>
      </section>
    </>
  );
}
