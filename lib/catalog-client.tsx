"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getRoutes, getStays, getTours } from "@/lib/catalog";
import type { Route, Stay, Tour } from "@/data/types";

export interface Catalog {
  routes: Route[];
  tours: Tour[];
  stays: Stay[];
  routeById: Map<string, Route>;
  tourById: Map<string, Tour>;
  stayById: Map<string, Stay>;
  loading: boolean;
}

const CatalogContext = createContext<Catalog | null>(null);

/**
 * Lädt den Katalog (Tours/Routes/Stays) einmal clientseitig über den anon-Key
 * (public-read) und stellt ihn samt id-Lookups bereit. Für Client-Features, die
 * localStorage-Trip-IDs oder Quiz-Ergebnisse auflösen müssen (Karten, /plan,
 * /my-trip) — Server-Seiten lesen direkt über lib/catalog.
 */
export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [stays, setStays] = useState<Stay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([getRoutes(), getTours(), getStays()])
      .then(([r, t, s]) => {
        if (!active) return;
        setRoutes(r);
        setTours(t);
        setStays(s);
      })
      .catch(() => {
        /* leise: Features funktionieren dann ohne Auflösung weiter */
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo<Catalog>(
    () => ({
      routes,
      tours,
      stays,
      routeById: new Map(routes.map((r) => [r.id, r])),
      tourById: new Map(tours.map((t) => [t.id, t])),
      stayById: new Map(stays.map((s) => [s.id, s])),
      loading,
    }),
    [routes, tours, stays, loading],
  );

  return (
    <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
  );
}

export function useCatalog(): Catalog {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog must be used within a CatalogProvider");
  return ctx;
}
