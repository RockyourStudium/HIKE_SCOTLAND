"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import type { TripItemKind } from "@/lib/trip";

export interface MapPoint {
  id: string;
  kind: TripItemKind;
  name: string;
  region: string;
  lat: number;
  lng: number;
  /** Sequence number for ordered itinerary pins. */
  order?: number;
}

const SCOTLAND_CENTER: [number, number] = [56.9, -4.4];

const kindColor: Record<TripItemKind, string> = {
  route: "#2D6A4F", // forest-highland
  tour: "#1B4332", // forest-dark
  stay: "#52796F", // muted teal-green
};

function pinIcon(point: MapPoint, active: boolean) {
  const color = kindColor[point.kind];
  const base = point.order != null ? 30 : 22;
  const size = active ? base + 8 : base;
  const ring = active ? "box-shadow:0 0 0 4px rgba(45,106,79,0.30);" : "";
  const label = point.order != null ? String(point.order) : "";
  const html = `<div style="width:${size}px;height:${size}px;border-radius:9999px;background:${color};color:#fff;display:flex;align-items:center;justify-content:center;font-family:system-ui,sans-serif;font-weight:700;font-size:13px;line-height:1;border:2px solid #fff;${ring}transition:all .15s;">${label}</div>`;
  return L.divIcon({
    html,
    className: "hike-pin",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

/** Fit the map to the given points; only re-fits when the point SET changes. */
function FitBounds({ boundsKey, points }: { boundsKey: string; points: MapPoint[] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) {
      map.setView(SCOTLAND_CENTER, 6);
      return;
    }
    if (points.length === 1) {
      map.setView([points[0].lat, points[0].lng], 9);
      return;
    }
    const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [45, 45], maxZoom: 11 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boundsKey, map]);
  return null;
}

export default function TripMap({
  points,
  fitPoints,
  connect = false,
  highlightId = null,
  extraPoint = null,
  onPointHover,
}: {
  /** Points that are always drawn as fixed pins. */
  points: MapPoint[];
  /** Points the viewport fits to (defaults to `points`). Use this to keep a
   *  hovered/transient point in view without re-fitting on every hover. */
  fitPoints?: MapPoint[];
  /** Draw a dashed line through the points in order. */
  connect?: boolean;
  /** Id of a point in `points` to render enlarged/highlighted. */
  highlightId?: string | null;
  /** A transient point (e.g. a hovered card not yet in the trip). */
  extraPoint?: MapPoint | null;
  /** Notified when a marker is hovered (id) or left (null). */
  onPointHover?: (id: string | null) => void;
}) {
  const bounds = fitPoints && fitPoints.length > 0 ? fitPoints : points;
  const boundsKey = useMemo(() => bounds.map((p) => p.id).join("|"), [bounds]);

  // Avoid plotting the transient point twice if it's already a fixed point.
  const extra = extraPoint && !points.some((p) => p.id === extraPoint.id) ? extraPoint : null;

  const line = useMemo(
    () => points.map((p) => [p.lat, p.lng] as [number, number]),
    [points]
  );

  return (
    <MapContainer
      center={SCOTLAND_CENTER}
      zoom={6}
      scrollWheelZoom
      className="h-full w-full"
      style={{ background: "#dfeee4" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds boundsKey={boundsKey} points={bounds} />

      {connect && line.length > 1 && (
        <Polyline
          positions={line}
          pathOptions={{ color: "#2D6A4F", weight: 3, dashArray: "6 8", opacity: 0.8 }}
        />
      )}

      {points.map((p) => (
        <Marker
          key={`${p.kind}-${p.id}`}
          position={[p.lat, p.lng]}
          icon={pinIcon(p, highlightId === p.id)}
          eventHandlers={
            onPointHover
              ? {
                  mouseover: () => onPointHover(p.id),
                  mouseout: () => onPointHover(null),
                }
              : undefined
          }
        >
          <Popup>
            <strong>{p.name}</strong>
            <br />
            {p.region}
          </Popup>
        </Marker>
      ))}

      {extra && (
        <Marker
          key={`extra-${extra.kind}-${extra.id}`}
          position={[extra.lat, extra.lng]}
          icon={pinIcon(extra, true)}
          zIndexOffset={1000}
        >
          <Popup>
            <strong>{extra.name}</strong>
            <br />
            {extra.region}
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
