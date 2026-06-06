"use client";

import { useState } from "react";
import { CalendarDays, CheckCircle2, Loader2, XCircle } from "lucide-react";
import {
  checkBookingAvailability,
  type AvailabilityResult,
  type BookableKind,
} from "@/lib/availability";

/**
 * Pick dates + party size and check whether the assembled trip can be booked.
 * Shows only "available / not possible" + reasons — AI-driven alternatives
 * will come later.
 */
export default function AvailabilityCheck({
  items,
}: {
  items: { item_type: BookableKind; item_id: string }[];
}) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [party, setParty] = useState(2);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [result, setResult] = useState<AvailabilityResult | null>(null);

  const canCheck = !!start && !!end && party >= 1 && items.length > 0 && state !== "loading";

  async function onCheck() {
    setState("loading");
    setResult(null);
    try {
      const r = await checkBookingAvailability({
        items,
        startDate: start,
        endDate: end,
        partySize: party,
      });
      setResult(r);
      setState("done");
    } catch {
      setState("error");
    }
  }

  return (
    <section className="mt-10 rounded-2xl bg-white p-6 shadow-card sm:p-8">
      <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-forest-darkest">
        <CalendarDays aria-hidden className="h-6 w-6" color="url(#hike-gradient)" />
        Check availability
      </h2>
      <p className="mt-1 text-sm text-neutralgray">
        Pick your dates and party size — we&apos;ll check whether your trip can be
        booked.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="av-start" className="block text-sm font-semibold text-forest-dark">
            From
          </label>
          <input
            id="av-start"
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="mt-2 w-full rounded-xl border border-softgray bg-fog/40 px-4 py-2.5 text-sm text-forest-dark focus:border-forest-highland"
          />
        </div>
        <div>
          <label htmlFor="av-end" className="block text-sm font-semibold text-forest-dark">
            To
          </label>
          <input
            id="av-end"
            type="date"
            value={end}
            min={start || undefined}
            onChange={(e) => setEnd(e.target.value)}
            className="mt-2 w-full rounded-xl border border-softgray bg-fog/40 px-4 py-2.5 text-sm text-forest-dark focus:border-forest-highland"
          />
        </div>
        <div>
          <label htmlFor="av-party" className="block text-sm font-semibold text-forest-dark">
            People
          </label>
          <input
            id="av-party"
            type="number"
            min={1}
            value={party}
            onChange={(e) => setParty(Math.max(1, Number(e.target.value) || 1))}
            className="mt-2 w-full rounded-xl border border-softgray bg-fog/40 px-4 py-2.5 text-sm text-forest-dark focus:border-forest-highland"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onCheck}
        disabled={!canCheck}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-forest-highland px-6 py-3 font-semibold text-white transition-colors hover:bg-forest-dark disabled:opacity-50"
      >
        {state === "loading" && <Loader2 aria-hidden className="h-4 w-4 animate-spin" />}
        {state === "loading" ? "Checking …" : "Check availability"}
      </button>

      {state === "error" && (
        <p className="mt-4 text-sm font-medium text-danger">
          Something went wrong. Please try again later.
        </p>
      )}

      {state === "done" && result?.ok && (
        <div className="mt-5 flex items-start gap-3 rounded-xl bg-mint/15 p-4 ring-1 ring-inset ring-forest-highland/30">
          <CheckCircle2 aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-forest-highland" />
          <p className="text-sm font-medium text-forest-dark">
            This trip can be booked for the selected dates for {party}{" "}
            {party === 1 ? "person" : "people"}.
          </p>
        </div>
      )}

      {state === "done" && result && !result.ok && (
        <div className="mt-5 flex items-start gap-3 rounded-xl bg-danger/10 p-4 ring-1 ring-inset ring-danger/30">
          <XCircle aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-danger" />
          <div className="text-sm">
            <p className="font-semibold text-danger">
              This trip can&apos;t be booked for the selected dates.
            </p>
            <ul className="mt-1 list-disc space-y-0.5 pl-5 text-forest-dark">
              {result.reasons.map((r, i) => (
                <li key={i}>{r.message}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
