import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import RouteCard from "@/components/RouteCard";
import TourCard from "@/components/TourCard";
import { routes } from "@/data/routes";
import { tours } from "@/data/tours";
import { heroImage } from "@/lib/heroImage";

const steps = [
  {
    icon: "🧭",
    title: "Tell us your style",
    body: "Answer a few quick questions about your experience, time and what you love about the outdoors.",
  },
  {
    icon: "🗺️",
    title: "Get matched routes",
    body: "We surface routes, guided tours and stays tailored to your preferences and ability.",
  },
  {
    icon: "🎒",
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

export default function HomePage() {
  const featuredRoutes = routes.slice(0, 3);
  const featuredTours = tours.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-forest-gradient text-fog">
        <div className="absolute inset-0" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImage("landing")}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-forest-darkest/85 via-forest-darkest/45 to-forest-darkest/10" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
          <div className="max-w-3xl animate-fade-up">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-mint ring-1 ring-inset ring-white/20">
              ⛰️ Discover Scotland on foot
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
              <Link
                href="/plan"
                className="inline-flex items-center justify-center rounded-full bg-mist px-7 py-3.5 text-base font-semibold text-forest-darkest transition-colors hover:bg-mint"
              >
                Start the trip planner
              </Link>
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

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <SectionHeading
          eyebrow="How it works"
          title="Three steps to the trail"
          description="No spreadsheets, no twenty browser tabs. Just a clear path from idea to adventure."
          align="center"
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="relative rounded-2xl bg-white p-6 shadow-card"
            >
              <span className="absolute -top-4 left-6 flex h-9 w-9 items-center justify-center rounded-full bg-forest-highland text-sm font-bold text-white">
                {i + 1}
              </span>
              <div aria-hidden className="text-3xl">{step.icon}</div>
              <h3 className="mt-3 font-display text-xl font-bold text-forest-darkest">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutralgray">{step.body}</p>
            </div>
          ))}
        </div>
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
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredRoutes.map((route) => (
              <RouteCard key={route.id} route={route} />
            ))}
          </div>
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
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredTours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-forest-gradient px-6 py-14 text-center text-fog sm:px-12">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Not sure where to start?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-fog/85">
            Our interactive planner asks a handful of questions and matches you
            with routes, tours and stays in minutes.
          </p>
          <Link
            href="/plan"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-mist px-8 py-3.5 text-base font-semibold text-forest-darkest transition-colors hover:bg-mint"
          >
            Find my adventure
          </Link>
        </div>
      </section>
    </>
  );
}
