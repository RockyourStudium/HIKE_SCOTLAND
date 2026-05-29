"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import RouteCard from "@/components/RouteCard";
import TourCard from "@/components/TourCard";
import StayCard from "@/components/StayCard";
import { recommend, type Answers } from "@/lib/recommend";
import { routes } from "@/data/routes";
import type { Terrain } from "@/data/types";

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
      { value: "Yes", label: "Yes, with a dog 🐾" },
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
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<Answers>>(defaultAnswers);
  const [showResults, setShowResults] = useState(false);

  const step = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;
  const progress = Math.round(((stepIndex + 1) / steps.length) * 100);

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
    else setStepIndex((i) => i + 1);
  };
  const back = () => setStepIndex((i) => Math.max(0, i - 1));

  const restart = () => {
    setAnswers(defaultAnswers);
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
        onRestart={restart}
      />
    );
  }

  return (
    <>
      <header className="bg-forest-gradient text-fog">
        <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl font-bold sm:text-4xl">
            Let's plan your trip
          </h1>
          <p className="mt-3 text-fog/85">
            Answer a few quick questions and we'll match you with routes, tours
            and stays.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-neutralgray">
            <span>
              Question {stepIndex + 1} of {steps.length}
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
        <fieldset className="rounded-2xl bg-white p-6 shadow-card sm:p-8">
          <legend className="font-display text-2xl font-bold text-forest-darkest">
            {step.question}
          </legend>
          <p className="mt-2 text-sm text-neutralgray">{step.help}</p>

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
        </fieldset>

        {/* Nav */}
        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={back}
            disabled={stepIndex === 0}
            className="rounded-full px-5 py-2.5 text-sm font-semibold text-forest-dark transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={next}
            disabled={!answered}
            className="rounded-full bg-forest-highland px-7 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-forest-dark disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isLast ? "See my matches" : "Next →"}
          </button>
        </div>
      </div>
    </>
  );
}

function Results({
  answers,
  recommendations,
  onRestart,
}: {
  answers: Answers;
  recommendations: ReturnType<typeof recommend>;
  onRestart: () => void;
}) {
  const { routes: rRoutes, tours: rTours, stays: rStays } = recommendations;

  return (
    <>
      <header className="bg-forest-gradient text-fog">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-mint">
            Your personalised plan
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
            Adventures matched to you
          </h1>
          <p className="mt-3 max-w-2xl text-fog/85">
            Based on a {answers.experience.toLowerCase()} hiker with{" "}
            {answers.time.toLowerCase()} to spare
            {answers.region !== "Anywhere" ? ` around ${answers.region}` : ""}
            {answers.dog === "Yes" ? ", travelling with a dog" : ""}.
          </p>
          <button
            type="button"
            onClick={onRestart}
            className="mt-6 inline-flex rounded-full bg-mist px-6 py-2.5 text-sm font-semibold text-forest-darkest transition-colors hover:bg-mint"
          >
            ↺ Start over
          </button>
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
              <div key={item.id} className="space-y-3">
                <RouteCard route={item} />
                {reasons.length > 0 && (
                  <ul className="space-y-1 px-1">
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
                )}
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
                <TourCard key={item.id} tour={item} />
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
              <StayCard key={item.id} stay={item} />
            ))}
          </div>
        </section>

        <div className="rounded-2xl bg-white p-8 text-center shadow-card">
          <h2 className="font-display text-xl font-bold text-forest-darkest">
            Like what you see?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-neutralgray">
            Browse the full collection to fine-tune your itinerary, or adjust your
            answers to explore other options.
          </p>
          <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/routes"
              className="rounded-full bg-forest-highland px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-forest-dark"
            >
              Browse all routes
            </Link>
            <button
              type="button"
              onClick={onRestart}
              className="rounded-full border border-forest-highland px-6 py-2.5 text-sm font-semibold text-forest-highland transition-colors hover:bg-forest-highland hover:text-white"
            >
              Retake the quiz
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
