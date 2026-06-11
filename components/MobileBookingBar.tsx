"use client";

import { useRouter } from "next/navigation";
import AnimatedCTA from "@/components/AnimatedCTA";
import { useTrip } from "@/lib/trip";

/**
 * Sticky Buchungsleiste am unteren Rand — nur Mobile (lg:hidden). Auf
 * schmalen Screens rutscht die Buchungs-Sidebar ans Seitenende; diese Leiste
 * hält Preis + CTA permanent sichtbar. Verhalten wie BookTourButton:
 * Tour in den Trip (idempotent) und weiter zu /my-trip.
 */
export default function MobileBookingBar({
  tourId,
  price,
  nextDeparture,
}: {
  tourId: string;
  price: number;
  /** Bereits formatiertes Datum, z. B. "13 Jul 2026". */
  nextDeparture?: string;
}) {
  const router = useRouter();
  const { add } = useTrip();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-softgray/40 bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-4px_16px_rgba(8,28,21,0.12)] backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-base font-bold leading-tight text-forest-darkest">
            £{price}
            <span className="text-sm font-normal text-neutralgray"> / person</span>
          </p>
          {nextDeparture && (
            <p className="truncate text-xs text-neutralgray">Next departure: {nextDeparture}</p>
          )}
        </div>
        <AnimatedCTA
          type="button"
          size="sm"
          className="shrink-0 text-sm"
          onClick={() => {
            add("tour", tourId);
            router.push("/my-trip");
          }}
        >
          Enquire &amp; book
        </AnimatedCTA>
      </div>
    </div>
  );
}
