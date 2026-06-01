"use client";

import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";
import type { MapPoint } from "./TripMap";

// Leaflet touches `window`, so it must never run during SSR.
const TripMap = dynamic(() => import("./TripMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sm text-neutralgray">
      Loading map…
    </div>
  ),
});

export type { MapPoint };

export default function MapPanel({
  points,
  fitPoints,
  connect,
  highlightId,
  extraPoint,
  onPointHover,
  emptyHint = "Add stops to see them on the map.",
  className = "",
}: {
  points: MapPoint[];
  fitPoints?: MapPoint[];
  connect?: boolean;
  highlightId?: string | null;
  extraPoint?: MapPoint | null;
  onPointHover?: (id: string | null) => void;
  emptyHint?: string;
  className?: string;
}) {
  const hasAnything =
    points.length > 0 || !!extraPoint || (fitPoints?.length ?? 0) > 0;

  return (
    <div
      className={`overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-softgray/40 ${className}`}
    >
      {hasAnything ? (
        <TripMap
          points={points}
          fitPoints={fitPoints}
          connect={connect}
          highlightId={highlightId}
          extraPoint={extraPoint}
          onPointHover={onPointHover}
        />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
          <MapPin aria-hidden className="h-8 w-8" color="url(#hike-gradient)" />
          <p className="max-w-[18rem] text-sm text-neutralgray">{emptyHint}</p>
        </div>
      )}
    </div>
  );
}
