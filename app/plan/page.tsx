"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MapPin } from "lucide-react";
import AnimatedCTA from "@/components/AnimatedCTA";
import Eyebrow from "@/components/Eyebrow";
import RouteCard from "@/components/RouteCard";
import TourCard from "@/components/TourCard";
import StayCard from "@/components/StayCard";
import AddToTripButton from "@/components/AddToTripButton";
import { recommend, type Answers } from "@/lib/recommend";
import { routes, getRouteById } from "@/data/routes";
import { useTrip } from "@/lib/trip";
import type { Route, Terrain } from "@/data/types";

const regionOptions = ["Anywhere", ...Array.from(new Set(routes.map((r) => r.region)))];
const terrainOptions: Terrain[] = [
  "Mountain",
  "Loch",
  "Forest",
  "Coastal",
  "Glen",
  "Moorland",
];

type SingleStep = {
  key: keyof Answers;
  kind: "single";
  question: string;
  help: string;
  options: { value: string; label: string; hint?: string }[];
};
type MultiStep = {
  key: keyof Answers;
  kind: "multi";
  question: string;
  help: string;
  options: { value: string; label: string }[];
};
type Step = SingleStep | MultiStep;

const steps: Step[] = [
  {
    key: "experience",
    kind: "single",
    question: "How would you describe your hiking experience?",
    help: "This helps us match routes to your ability.",
    options: [
      { value: "Beginner", label: "Beginner", hint: "New to hiking" },
      { value: "Some", label: "Some experience", hint: "A few walks under my belt" },
      { value: "Experienced", label: "Experienced", hint: "Comfortable on hills" },
      { value: "Expert", label: "Expert", hint: "Bring on the Munros" },
    ],
  },
  {
    key: "time",
    kind: "single",
    question: "How much time do you have?",
    help: "From a quick outing to a full week of adventure.",
    options: [
      { value: "Half day", label: "Half a day" },
      { value: "Full day", label: "A full day" },
      { value: "Weekend", label: "A weekend" },
      { value: "A week", label: "About a week" },
    ],
  },
  {
    key: "scenery",
    kind: "multi",
    question: "What kind of scenery draws you in?",
    help: "Pick as many as you like.",
    options: terrainOptions.map((t) => ({ value: t, label: t })),
  },
  {
    key: "region",
    kind: "single",
    question: "Any region in mind?",
    help: "Choose a favourite, or let us surprise you.",
    options: regionOptions.map((r) => ({ value: r, label: r })),
  },
  {
    key: "dog",
    kind: "single",
    question: "Bringing a four-legged friend?",
    help: "We'll only suggest dog-friendly options.",
    options: [
      { value: "No", label: "Just humans" },
      { value: "Yes", label: "Yes, with a dog" },
    ],
  },
  {
    key: "guiding",
    kind: "single",
    question: "How do you like to travel?",
    help: "Guided support or going it alone?",
    options: [
      { value: "Independent", label: "Independently" },
      { value: "Guided", label: "With a guide" },
      { value: "Either", label: "Open to either" },
    ],
  },
  {
    key: "comfort",
    kind: "single",
    question: "What's your style for overnight stays?",
    help: "Shapes the accommodation we recommend.",
    options: [
      { value: "Budget", label: "Budget & wild", hint: "Bothies, hostels, camping" },
      { value: "Balanced", label: "Balanced", hint: "B&Bs and lodges" },
      { value: "Comfort", label: "Comfort", hint: "Hotels and treats" },
    ],
  },
];

const defaultAnswers: Partial<Answers> = { scenery: [] };

export default function PlanPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl px-4 py-20 text-center text-neutralgray sm:px-6 lg:px-8">
          Loading the trip planner…
        </div>
      }
    >
      <PlanFlow />
    </Suspense>
  );
}

function PlanFlow() {
  const searchParams = useSearchParams();
  const routeId = searchParams.get("route") ?? undefined;
  const anchorRoute = routeId ? getRouteById(routeId) : undefined;
  const { setAnchorRoute } = useTrip();

  // Drop the anchor route into the trip as soon as we arrive from its page.
  useEffect(() => {
    if (anchorRoute) setAnchorRoute(anchorRoute.id);
  }, [anchorRoute, setAnchorRoute]);

  // When planning around a specific route, its region and terrain are already
  // decided — skip those two questions and pre-fill the answers.
  const activeSteps = useMemo(
    () =>
      anchorRoute
        ? steps.filter((s) => s.key !== "region" && s.key !== "scenery")
        : steps,
    [anchorRoute]
  );

  const initialAnswers = useMemo<Partial<Answers>>(
    () =>
      anchorRoute
        ? { scenery: anchorRoute.terrain, region: anchorRoute.region }
        : defaultAnswers,
    [anchorRoute]
  );

  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [answers, setAnswers] = useState<Partial<Answers>>(initialAnswers);
  const [showResults, setShowResults] = useState(false);

  const step = activeSteps[stepIndex];
  const isLast = stepIndex === activeSteps.length - 1;
  const progress = Math.round(((stepIndex + 1) / activeSteps.length) * 100);

  const currentValue = answers[step.key];
  const answered =
    step.kind === "multi"
      ? Array.isArray(currentValue) && currentValue.length > 0
      : currentValue !== undefined;

  const setSingle = (value: string) => {
    setAnswers((prev) => ({ ...prev, [step.key]: value }));
  };

  const toggleMulti = (value: string) => {
    setAnswers((prev) => {
      const arr = (prev[step.key] as string[] | undefined) ?? [];
      const next = arr.includes(value)
        ? arr.filter((v) => v !== value)
        : [...arr, value];
      return { ...prev, [step.key]: next };
    });
  };

  const next = () => {
    if (isLast) setShowResults(true);
    else {
      setDirection("forward");
      setStepIndex((i) => i + 1);
    }
  };
  const back = () => {
    setDirection("back");
    setStepIndex((i) => Math.max(0, i - 1));
  };

  const restart = () => {
    setAnswers(initialAnswers);
    setDirection("forward");
    setStepIndex(0);
    setShowResults(false);
  };

  const recommendations = useMemo(
    () => (showResults ? recommend(answers as Answers) : null),
    [showResults, answers]
  );

  if (showResults && recommendations) {
    return (
      <Results
        answers={answers as Answers}
        recommendations={recommendations}
        anchorRoute={anchorRoute}
        onRestart={restart}
      />
    );
  }

  return (
    <>
      <header className="bg-forest-gradient text-fog">
        <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl font-bold sm:text-4xl">
            Let&apos;s plan your trip
          </h1>
          <p className="mt-3 text-fog/85">
            Answer a few quick questions and we&apos;ll match you with routes, tours
            and stays.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Anchor banner */}
        {anchorRoute && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-card">
            <MapPin aria-hidden className="h-5 w-5 flex-shrink-0" color="url(#hike-gradient)" />
            <p className="text-sm text-forest-dark">
              Planning around{" "}
              <Link
                href={`/routes/${anchorRoute.id}`}
                className="font-semibold text-forest-highland hover:underline"
              >
                {anchorRoute.name}
              </Link>{" "}
              in {anchorRoute.region} — it&apos;s already in your trip. Just a couple
              of questions to round it out.
            </p>
          </div>
        )}

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-neutralgray">
            <span>
              Question {stepIndex + 1} of {activeSteps.length}
            </span>
            <span>{progress}%</span>
          </div>
          <div
            className="mt-2 h-2 overflow-hidden rounded-full bg-white"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Questionnaire progress"
          >
            <div
              className="h-full rounded-full bg-forest-highland transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div
          key={stepIndex}
          role="group"
          aria-labelledby="step-question"
          aria-describedby="step-help"
          className={`rounded-2xl bg-white p-6 shadow-card sm:p-8 ${
            direction === "back" ? "quiz-slide-back" : "quiz-slide-forward"
          }`}
        >
          <h2
            id="step-question"
            className="font-display text-2xl font-bold text-forest-darkest"
          >
            {step.question}
          </h2>
          <p id="step-help" className="mt-2 text-sm text-neutralgray">
            {step.help}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {step.options.map((opt) => {
              const selected =
                step.kind === "multi"
                  ? Array.isArray(currentValue) &&
                    (currentValue as string[]).includes(opt.value)
                  : currentValue === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() =>
                    step.kind === "multi" ? toggleMulti(opt.value) : setSingle(opt.value)
                  }
                  aria-pressed={selected}
                  className={`flex items-center justify-between rounded-xl border-2 px-4 py-3.5 text-left transition-all ${
                    selected
                      ? "border-forest-highland bg-fog"
                      : "border-softgray/60 bg-white hover:border-mist hover:bg-fog/50"
                  }`}
                >
                  <span>
                    <span className="block font-semibold text-forest-darkest">
                      {opt.label}
                    </span>
                    {"hint" in opt && opt.hint && (
                      <span className="block text-xs text-neutralgray">{opt.hint}</span>
                    )}
                  </span>
                  <span
                    aria-hidden
                    className={`ml-3 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 text-xs ${
                      selected
                        ? "border-forest-highland bg-forest-highland text-white"
                        : "border-softgray"
                    }`}
                  >
                    {selected ? "✓" : ""}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Nav */}
        <div className="mt-6 flex items-center justify-between">
          {stepIndex === 0 ? (
            <span aria-hidden />
          ) : (
            <button
              type="button"
              onClick={back}
              className="rounded-full px-5 py-2.5 text-sm font-semibold text-forest-dark transition-colors hover:bg-white"
            >
              ← Back
            </button>
          )}
          <AnimatedCTA type="button" onClick={next} disabled={!answered}>
            {isLast ? "See my matches" : "Next →"}
          </AnimatedCTA>
        </div>
      </div>
    </>
  );
}

function Results({
  answers,
  recommendations,
  anchorRoute,
  onRestart,
}: {
  answers: Answers;
  recommendations: ReturnType<typeof recommend>;
  anchorRoute?: Route;
  onRestart: () => void;
}) {
  const { routes: rRoutes, tours: rTours, stays: rStays } = recommendations;
  const { count, hydrated } = useTrip();

  return (
    <>
      <header className="bg-forest-gradient text-fog">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <Eyebrow tone="mint" dash>Your personalised plan</Eyebrow>
          <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
            Adventures matched to you
          </h1>
          <p className="mt-3 max-w-2xl text-fog/85">
            {anchorRoute ? (
              <>Built around {anchorRoute.name}. </>
            ) : null}
            Based on a {answers.experience.toLowerCase()} hiker with{" "}
            {answers.time.toLowerCase()} to spare
            {answers.region !== "Anywhere" ? ` around ${answers.region}` : ""}
            {answers.dog === "Yes" ? ", travelling with a dog" : ""}.
          </p>
          <p className="mt-4 text-sm text-fog/80">
            Add anything you like to your trip, then open{" "}
            <Link href="/my-trip" className="font-semibold text-mint hover:underline">
              My Trip
            </Link>{" "}
            to put your stops in order.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <AnimatedCTA href="/my-trip">
              View my trip{hydrated && count > 0 ? ` (${count})` : ""}
            </AnimatedCTA>
            <button
              type="button"
              onClick={onRestart}
              className="inline-flex items-center justify-center rounded-full border border-fog/30 px-6 py-3 text-sm font-semibold text-fog transition-colors hover:bg-white/10"
            >
              ↺ Start over
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-16 px-4 py-14 sm:px-6 lg:px-8">
        {/* Routes */}
        <section>
          <h2 className="font-display text-2xl font-bold text-forest-darkest">
            Recommended routes
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rRoutes.map(({ item, reasons }) => (
              <div key={item.id} className="flex h-full flex-col">
                <div className="flex-1">
                  <RouteCard route={item} />
                </div>
                <ul className="mt-3 min-h-[4.5rem] space-y-1 px-1">
                  {reasons.map((reason) => (
                    <li
                      key={reason}
                      className="flex items-start gap-2 text-sm text-forest-dark"
                    >
                      <span aria-hidden className="mt-0.5 text-mist">✓</span>
                      {reason}
                    </li>
                  ))}
                </ul>
                <AddToTripButton kind="route" id={item.id} block className="mt-3" />
              </div>
            ))}
          </div>
        </section>

        {/* Tours */}
        {rTours.length > 0 && (
          <section>
            <h2 className="font-display text-2xl font-bold text-forest-darkest">
              Tours you might like
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rTours.map(({ item }) => (
                <div key={item.id} className="flex h-full flex-col">
                  <div className="flex-1">
                    <TourCard tour={item} />
                  </div>
                  <AddToTripButton kind="tour" id={item.id} block className="mt-3" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Stays */}
        <section>
          <h2 className="font-display text-2xl font-bold text-forest-darkest">
            Places to stay
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rStays.map(({ item }) => (
              <StayCard
                key={item.id}
                stay={item}
                action={<AddToTripButton kind="stay" id={item.id} compact />}
              />
            ))}
          </div>
        </section>

        <div className="rounded-2xl bg-white p-8 text-center shadow-card">
          <h2 className="font-display text-xl font-bold text-forest-darkest">
            Happy with your picks?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-neutralgray">
            Head to My Trip to order your stops into an itinerary, or browse the
            full collection to add more.
          </p>
          <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
            <AnimatedCTA href="/my-trip">Go to my trip</AnimatedCTA>
            <Link
              href="/routes"
              className="rounded-full border border-forest-highland px-6 py-2.5 text-sm font-semibold text-forest-highland transition-colors hover:bg-forest-highland hover:text-white"
            >
              Browse all routes
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
