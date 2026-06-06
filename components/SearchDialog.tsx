"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useCatalog } from "@/lib/catalog-client";
import { searchCatalog, type SearchResult } from "@/lib/search";

function Thumb({ result }: { result: SearchResult }) {
  return (
    <div className="relative h-12 w-16 flex-shrink-0 overflow-hidden rounded-lg">
      {result.image ? (
        <Image
          src={result.image}
          alt=""
          fill
          sizes="64px"
          className="object-cover"
        />
      ) : (
        <div className={`h-full w-full bg-gradient-to-br ${result.gradient}`} />
      )}
    </div>
  );
}

export default function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const catalog = useCatalog();

  const results = useMemo(
    () => (open ? searchCatalog(query, catalog) : []),
    [open, query, catalog],
  );

  // Auswahl zurücksetzen, sobald sich die Trefferliste ändert.
  useEffect(() => {
    setActive(0);
  }, [query]);

  // Fokus auf das Eingabefeld beim Öffnen.
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Escape schließt den Dialog; Hintergrund-Scroll sperren.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  function close() {
    setOpen(false);
    setQuery("");
  }

  function go(result: SearchResult) {
    close();
    router.push(result.href);
  }

  function onInputKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const pick = results[active];
      if (pick) go(pick);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search"
        className="inline-flex items-center justify-center rounded-full p-2 text-fog/90 transition-colors hover:bg-forest-highland/40"
      >
        <Search aria-hidden className="h-5 w-5" strokeWidth={2} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center bg-forest-darkest/70 p-4 backdrop-blur-sm sm:pt-24"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Search routes, tours and stays"
            className="w-full max-w-xl overflow-hidden rounded-2xl bg-white text-forest-dark shadow-card-hover"
          >
            <div className="flex items-center gap-3 border-b border-softgray/40 px-4 py-3">
              <Search aria-hidden className="h-5 w-5 flex-shrink-0 text-neutralgray" strokeWidth={2} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKey}
                placeholder="Search regions, tours, stays…"
                className="w-full bg-transparent text-base outline-none placeholder:text-neutralgray"
              />
              <button
                type="button"
                onClick={close}
                aria-label="Close search"
                className="flex-shrink-0 rounded-full p-1 text-neutralgray transition-colors hover:bg-fog hover:text-forest-dark"
              >
                <X aria-hidden className="h-5 w-5" strokeWidth={2} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {query.trim() === "" ? (
                <p className="px-4 py-6 text-sm text-neutralgray">
                  Try a region, a kind of stay, the terrain or a place — e.g.
                  “Skye”, “bothy”, “coastal” or “Ben Nevis”.
                </p>
              ) : results.length === 0 ? (
                <p className="px-4 py-6 text-sm text-neutralgray">
                  No matches for “{query.trim()}”.
                </p>
              ) : (
                <ul className="py-2">
                  {results.map((r, i) => (
                    <li key={`${r.kind}-${r.id}`}>
                      <button
                        type="button"
                        onClick={() => go(r)}
                        onMouseEnter={() => setActive(i)}
                        className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                          i === active ? "bg-fog" : ""
                        }`}
                      >
                        <Thumb result={r} />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-display text-base font-semibold text-forest-darkest">
                            {r.title}
                          </span>
                          <span className="block truncate text-xs text-neutralgray">
                            {r.subtitle}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
