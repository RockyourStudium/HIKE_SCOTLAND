import { getRouteById } from "@/data/routes";
import { getTourById } from "@/data/tours";
import { getStayById } from "@/data/stays";
import type { Route, Stay, Tour } from "@/data/types";
import type { TripItem } from "@/lib/trip";
import type { MapPoint } from "@/components/TripMap";

export function routePoint(r: Route): MapPoint {
  return { id: r.id, kind: "route", name: r.name, region: r.region, lat: r.coords.lat, lng: r.coords.lng };
}
export function tourPoint(t: Tour): MapPoint {
  return { id: t.id, kind: "tour", name: t.name, region: t.region, lat: t.coords.lat, lng: t.coords.lng };
}
export function stayPoint(s: Stay): MapPoint {
  return { id: s.id, kind: "stay", name: s.name, region: s.region, lat: s.coords.lat, lng: s.coords.lng };
}

/** Map points for every item currently in the trip (any kind). */
export function tripPoints(items: TripItem[]): MapPoint[] {
  return items.flatMap((it) => {
    if (it.kind === "route") {
      const r = getRouteById(it.id);
      return r ? [routePoint(r)] : [];
    }
    if (it.kind === "tour") {
      const t = getTourById(it.id);
      return t ? [tourPoint(t)] : [];
    }
    const s = getStayById(it.id);
    return s ? [stayPoint(s)] : [];
  });
}
