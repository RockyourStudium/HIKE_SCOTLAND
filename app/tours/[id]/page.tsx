import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CalendarDays, TrainFront, Backpack, Dumbbell } from "lucide-react";
import { getTourById, getTourDepartures, getTours } from "@/lib/catalog";
import AddToTripButton from "@/components/AddToTripButton";
import BookTourButton from "@/components/BookTourButton";
import Button from "@/components/Button";
import { DifficultyBadge } from "@/components/Badge";
import Container from "@/components/Container";
import ReviewsSection from "@/components/ReviewsSection";
import { gearFor, fitnessNote, destinationForRegion } from "@/lib/detail";

// ISR: DB-Änderungen erscheinen ohne Deploy (alle 5 Min revalidiert).
export const revalidate = 300;

export async function generateStaticParams() {
  const tours = await getTours();
  return tours.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const tour = await getTourById(params.id);
  if (!tour) return { title: "Tour not found" };
  return {
    title: `${tour.name} · ${tour.days}-Day ${tour.guided ? "Guided" : "Self-Guided"} Hiking Tour`,
    description: tour.summary,
  };
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-softgray/40 py-3 last:border-0">
      <dt className="text-sm text-neutralgray">{label}</dt>
      <dd className="text-right text-sm font-semibold text-forest-dark">{value}</dd>
    </div>
  );
}

// Server-Komponente → deterministisch formatiert, kein Hydration-Thema.
function departureDate(iso: string, style: "long" | "short" = "long") {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    ...(style === "long" ? { weekday: "short" } : {}),
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function SeatsBadge({ remaining, capacity }: { remaining: number; capacity: number }) {
  if (remaining === 0) {
    return (
      <span className="rounded-full bg-softgray/30 px-3 py-1 text-xs font-semibold text-neutralgray">
        Sold out
      </span>
    );
  }
  if (remaining <= 3) {
    return (
      <span className="rounded-full bg-danger/10 px-3 py-1 text-xs font-semibold text-danger">
        Only {remaining} {remaining === 1 ? "seat" : "seats"} left
      </span>
    );
  }
  return (
    <span className="rounded-full bg-mint/30 px-3 py-1 text-xs font-semibold text-forest-dark">
      {remaining} of {capacity} seats left
    </span>
  );
}

export default async function TourDetailPage({ params }: { params: { id: string } }) {
  const [tour, departures] = await Promise.all([
    getTourById(params.id),
    getTourDepartures(params.id),
  ]);
  if (!tour) notFound();
  const nextBookable = departures.find((d) => d.seatsRemaining > 0);

  const dest = destinationForRegion(tour.region);
  const gear = gearFor(tour.difficulty);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden text-fog">
        <Image
          src={tour.image ?? "/heroes/landing.jpg"}
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-darkest/90 via-forest-darkest/55 to-forest-darkest/40" />
        <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col justify-end px-4 py-12 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-4 text-sm text-fog/80">
            <Link href="/tours" className="hover:text-fog">Guided Tours</Link>
            <span aria-hidden className="mx-2">/</span>
            <span className="text-fog">{tour.name}</span>
          </nav>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-forest-darkest">
              {tour.guided ? "Guided" : "Self-guided"}
            </span>
            <DifficultyBadge level={tour.difficulty} />
            <span className="rounded-full bg-white/15 px-3 py-1 text-sm font-medium text-fog ring-1 ring-inset ring-white/25">
              {tour.region}
            </span>
          </div>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-tight sm:text-5xl">
            {tour.name}
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-fog/90">{tour.summary}</p>
        </div>
      </section>

      <Container py="compact">
        <div className="grid gap-10 lg:grid-cols-[1fr,20rem] lg:gap-14">
          {/* Main content */}
          <div className="space-y-12">
            {/* Overview */}
            <section>
              <h2 className="font-display text-2xl font-bold text-forest-darkest">About this trip</h2>
              <div className="mt-4 space-y-4">
                {tour.description.map((p, i) => (
                  <p key={i} className="text-base leading-relaxed text-neutralgray">{p}</p>
                ))}
              </div>
            </section>

            {/* What's included */}
            <section>
              <h2 className="font-display text-2xl font-bold text-forest-darkest">What&apos;s included</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {tour.includes.map((item) => (
                  <li key={item} className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-card">
                    <span aria-hidden className="mt-0.5 text-mist">✓</span>
                    <span className="text-sm font-medium text-forest-dark">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Upcoming departures */}
            <section id="departures">
              <h2 className="font-display text-2xl font-bold text-forest-darkest">
                Upcoming departures
              </h2>
              {departures.length === 0 ? (
                <p className="mt-4 text-sm leading-relaxed text-neutralgray">
                  New season dates are being finalised. Enquire and we&apos;ll let you
                  know first — private departures are often possible.
                </p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {departures.map((d) => (
                    <li
                      key={d.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white p-4 shadow-card"
                    >
                      <div className="flex items-center gap-3">
                        <CalendarDays aria-hidden className="h-5 w-5" color="url(#hike-gradient)" />
                        <div>
                          <p className="text-sm font-semibold text-forest-dark">
                            {departureDate(d.date)}
                          </p>
                          <p className="text-xs text-neutralgray">
                            {tour.days} {tour.days === 1 ? "day" : "days"} · £
                            {d.pricePerPerson ?? tour.pricePerPerson} per person
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {d.status === "weather_hold" && (
                          <span className="rounded-full bg-fog px-3 py-1 text-xs font-semibold text-forest-dark">
                            Weather hold
                          </span>
                        )}
                        <SeatsBadge remaining={d.seatsRemaining} capacity={d.capacity} />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Good to know */}
            <section>
              <h2 className="font-display text-2xl font-bold text-forest-darkest">Good to know</h2>
              <div className="mt-4 grid gap-6 sm:grid-cols-2">
                <div className="rounded-2xl bg-white p-6 shadow-card">
                  <h3 className="flex items-center gap-2 font-semibold text-forest-darkest">
                    <CalendarDays aria-hidden className="h-5 w-5" color="url(#hike-gradient)" /> Best time to travel
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutralgray">
                    {dest?.bestTime ?? "Available across the main walking season, spring to autumn."}
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-6 shadow-card">
                  <h3 className="flex items-center gap-2 font-semibold text-forest-darkest">
                    <TrainFront aria-hidden className="h-5 w-5" color="url(#hike-gradient)" /> Getting there
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutralgray">
                    {dest?.gettingThere ?? `Based in ${tour.region}. Full meeting-point details on booking.`}
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
                    {fitnessNote(tour.difficulty)}
                  </p>
                  <p className="mt-2 text-sm text-neutralgray">
                    <span className="font-medium text-forest-dark">Group size:</span> {tour.groupSize}
                  </p>
                </div>
              </div>
            </section>

            <ReviewsSection
              subjectType="tour"
              subjectId={tour.id}
              path={`/tours/${tour.id}`}
            />
          </div>

          {/* Booking sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl bg-white p-6 shadow-card">
              <p className="text-sm text-neutralgray">From</p>
              <p className="font-display text-3xl font-bold text-forest-darkest">
                £{tour.pricePerPerson}
                <span className="text-base font-normal text-neutralgray"> / person</span>
              </p>
              <dl className="mt-4">
                <Fact label="Duration" value={`${tour.days} days`} />
                <Fact label="Type" value={tour.guided ? "Guided" : "Self-guided"} />
                <Fact label="Group size" value={tour.groupSize} />
                <Fact label="Difficulty" value={tour.difficulty} />
                <Fact label="Region" value={tour.region} />
                {nextBookable && (
                  <Fact
                    label="Next departure"
                    value={departureDate(nextBookable.date, "short")}
                  />
                )}
              </dl>
              <BookTourButton tourId={tour.id} />
              <div className="mt-2">
                <AddToTripButton kind="tour" id={tour.id} block />
              </div>
              <Button href="/plan" variant="outline" size="sm" block className="mt-2">
                Not sure? Try the trip planner
              </Button>
              <p className="mt-3 text-center text-xs text-neutralgray">
                No payment taken now — we&apos;ll confirm availability first.
              </p>
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}
