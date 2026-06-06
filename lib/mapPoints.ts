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

/** id-Lookups, wie sie der CatalogProvider bereitstellt. */
export interface CatalogLookups {
  routeById: Map<string, Route>;
  tourById: Map<string, Tour>;
  stayById: Map<string, Stay>;
}

/** Map points for every item currently in the trip (any kind). */
export function tripPoints(items: TripItem[], cat: CatalogLookups): MapPoint[] {
  return items.flatMap((it) => {
    if (it.kind === "route") {
      const r = cat.routeById.get(it.id);
      return r ? [routePoint(r)] : [];
    }
    if (it.kind === "tour") {
      const t = cat.tourById.get(it.id);
      return t ? [tourPoint(t)] : [];
    }
    const s = cat.stayById.get(it.id);
    return s ? [stayPoint(s)] : [];
  });
}
