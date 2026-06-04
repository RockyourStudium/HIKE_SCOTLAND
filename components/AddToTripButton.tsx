"use client";

import { Check, Plus } from "lucide-react";
import { buttonVariants } from "@/components/Button";
import { useTrip, type TripItemKind } from "@/lib/trip";

type Variant = "solid" | "outline";

const labels: Record<TripItemKind, string> = {
  route: "route",
  tour: "tour",
  stay: "stay",
};

/**
 * Toggles a route / tour / stay in the site-wide "My Trip" collection.
 * Safe to drop anywhere — it reads the shared trip state from context.
 */
export default function AddToTripButton({
  kind,
  id,
  block = false,
  variant = "outline",
  compact = false,
  className = "",
}: {
  kind: TripItemKind;
  id: string;
  block?: boolean;
  variant?: Variant;
  /** Short label ("Add" / "Added") for tight spots like narrow cards. */
  compact?: boolean;
  className?: string;
}) {
  const { has, toggle, hydrated } = useTrip();
  const inTrip = hydrated && has(kind, id);

  const base = compact
    ? "inline-flex items-center justify-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold transition-colors"
    : "inline-flex items-center justify-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors";
  const tone =
    inTrip || variant === "solid" ? buttonVariants.secondary : buttonVariants.outline;

  return (
    <button
      type="button"
      onClick={() => toggle(kind, id)}
      aria-pressed={inTrip}
      aria-label={inTrip ? "Remove from your trip" : `Add ${labels[kind]} to your trip`}
      className={`${base} ${tone} ${block ? "w-full" : ""} ${className}`}
    >
      {inTrip ? (
        <>
          <Check aria-hidden className="h-4 w-4" /> {compact ? "Added" : "In your trip"}
        </>
      ) : (
        <>
          <Plus aria-hidden className="h-4 w-4" /> {compact ? "Add" : `Add ${labels[kind]} to trip`}
        </>
      )}
    </button>
  );
}
