"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type TripItemKind = "route" | "tour" | "stay";

export interface TripItem {
  kind: TripItemKind;
  id: string;
  /** Nights booked — only meaningful for stays. Defaults to 1. */
  nights?: number;
}

export interface Trip {
  /** The route a trip was started "around" (from a route detail page). */
  anchorRouteId?: string;
  items: TripItem[];
}

const STORAGE_KEY = "hike-scotland-trip";
const emptyTrip: Trip = { items: [] };

interface TripContextValue {
  trip: Trip;
  /** True once the persisted trip has been read from localStorage. */
  hydrated: boolean;
  count: number;
  has: (kind: TripItemKind, id: string) => boolean;
  add: (kind: TripItemKind, id: string) => void;
  remove: (kind: TripItemKind, id: string) => void;
  toggle: (kind: TripItemKind, id: string) => void;
  /** Reorder an item within the list (for sequencing stops A → B → C). */
  move: (index: number, direction: -1 | 1) => void;
  /** Set the number of nights for a stay (clamped to >= 1). */
  setNights: (id: string, nights: number) => void;
  /** Mark a route as the trip's anchor and make sure it's in the list. */
  setAnchorRoute: (id: string) => void;
  clear: () => void;
}

const TripContext = createContext<TripContextValue | null>(null);

function sameItem(a: TripItem, kind: TripItemKind, id: string) {
  return a.kind === kind && a.id === id;
}

export function TripProvider({ children }: { children: ReactNode }) {
  const [trip, setTrip] = useState<Trip>(emptyTrip);
  const [hydrated, setHydrated] = useState(false);

  // Load once on mount (client only) to avoid SSR/CSR markup mismatch.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Trip;
        if (parsed && Array.isArray(parsed.items)) setTrip(parsed);
      }
    } catch {
      // Corrupt or unavailable storage — start fresh, no need to surface.
    }
    setHydrated(true);
  }, []);

  // Persist on every change, but only after the initial load.
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trip));
    } catch {
      // Ignore quota / private-mode write failures.
    }
  }, [trip, hydrated]);

  const has = useCallback(
    (kind: TripItemKind, id: string) =>
      trip.items.some((i) => sameItem(i, kind, id)),
    [trip.items]
  );

  const add = useCallback((kind: TripItemKind, id: string) => {
    setTrip((prev) => {
      if (prev.items.some((i) => sameItem(i, kind, id))) return prev;
      const item: TripItem = kind === "stay" ? { kind, id, nights: 1 } : { kind, id };
      return { ...prev, items: [...prev.items, item] };
    });
  }, []);

  const remove = useCallback((kind: TripItemKind, id: string) => {
    setTrip((prev) => ({
      ...prev,
      items: prev.items.filter((i) => !sameItem(i, kind, id)),
      anchorRouteId:
        kind === "route" && prev.anchorRouteId === id
          ? undefined
          : prev.anchorRouteId,
    }));
  }, []);

  const toggle = useCallback((kind: TripItemKind, id: string) => {
    setTrip((prev) => {
      const exists = prev.items.some((i) => sameItem(i, kind, id));
      if (exists) {
        return {
          ...prev,
          items: prev.items.filter((i) => !sameItem(i, kind, id)),
          anchorRouteId:
            kind === "route" && prev.anchorRouteId === id
              ? undefined
              : prev.anchorRouteId,
        };
      }
      const item: TripItem = kind === "stay" ? { kind, id, nights: 1 } : { kind, id };
      return { ...prev, items: [...prev.items, item] };
    });
  }, []);

  const move = useCallback((index: number, direction: -1 | 1) => {
    setTrip((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.items.length) return prev;
      const items = [...prev.items];
      [items[index], items[target]] = [items[target], items[index]];
      return { ...prev, items };
    });
  }, []);

  const setNights = useCallback((id: string, nights: number) => {
    setTrip((prev) => ({
      ...prev,
      items: prev.items.map((i) =>
        sameItem(i, "stay", id) ? { ...i, nights: Math.max(1, nights) } : i
      ),
    }));
  }, []);

  const setAnchorRoute = useCallback((id: string) => {
    setTrip((prev) => {
      const items = prev.items.some((i) => sameItem(i, "route", id))
        ? prev.items
        : [{ kind: "route" as const, id }, ...prev.items];
      return { ...prev, anchorRouteId: id, items };
    });
  }, []);

  const clear = useCallback(() => setTrip(emptyTrip), []);

  const value = useMemo<TripContextValue>(
    () => ({
      trip,
      hydrated,
      count: trip.items.length,
      has,
      add,
      remove,
      toggle,
      move,
      setNights,
      setAnchorRoute,
      clear,
    }),
    [trip, hydrated, has, add, remove, toggle, move, setNights, setAnchorRoute, clear]
  );

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export function useTrip() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error("useTrip must be used within a TripProvider");
  return ctx;
}
