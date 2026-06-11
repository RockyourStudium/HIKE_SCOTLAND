"use client";

import { useRouter } from "next/navigation";
import AnimatedCTA from "@/components/AnimatedCTA";
import { useTrip } from "@/lib/trip";

/**
 * Haupt-CTA der Tour-Detailseite: legt die Tour in den Trip (idempotent) und
 * führt zu /my-trip, wo das BookingPanel die Anfrage übernimmt.
 */
export default function BookTourButton({ tourId }: { tourId: string }) {
  const router = useRouter();
  const { add } = useTrip();

  return (
    <AnimatedCTA
      type="button"
      block
      className="mt-5 text-sm"
      onClick={() => {
        add("tour", tourId);
        router.push("/my-trip");
      }}
    >
      Enquire &amp; book this tour
    </AnimatedCTA>
  );
}
