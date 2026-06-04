# CLAUDE.md

Technische Leitplanken für die Arbeit an diesem Repo. Wird von Claude Code
automatisch in jede Session geladen.

> Ausführlicher Projekt-/Architektur-Kontext liegt lokal in
> `CLAUDE_CODE_BRIEF.md` (gitignored) — dort zuerst nachschlagen, wenn vorhanden.

## Antwort-Sprache

Deutsch.

## Stack

Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS 3 ·
`lucide-react` · Leaflet + `react-leaflet@4` (an React 18 gepinnt — **v5 will
React 19, nicht upgraden**) · `sharp` für Bildoptimierung.

Kein Backend, keine DB: alle Inhalte statisch in `data/*.ts`
(routes/tours/stays/destinations/types), jedes Item mit `coords {lat,lng}`.
Trip-State lebt im React Context + localStorage (`lib/trip.tsx`).

## Dev-Workflow

```bash
npm run dev      # localhost:3000
npm run build    # Produktions-Build (Absicherung vor dem Push)
npm run lint
npm run optimize-images
```

Push auf `main` löst einen automatischen Production-Deploy aus — also erst
bauen/prüfen, dann pushen.

## Kritische Stolpersteine

- **NIE `npm run build` laufen lassen, während `npm run dev` läuft.** Beide
  schreiben in dasselbe `.next` und korrumpieren die Dev-Chunks (Browser wirft
  dann Laufzeitfehler). Fix: dev stoppen → `rm -rf .next` → dev neu starten.
- **Hell/Dunkel-Teilung nicht ohne Ansage brechen.** Marketing-Seiten (`/`,
  `/destinations`, `/destinations/[slug]`) sind bewusst dunkel/cineastisch;
  funktionale Seiten (`/plan`, `/my-trip`, `/routes`, `/tours`, `/stays`,
  Detailseiten, `/credits`) bleiben hell — wegen Lesbarkeit von Formularen,
  Karten und Cards.
- **`<Suspense>` im Planner nicht entfernen.** `useSearchParams` in
  `app/plan/page.tsx` braucht in Next 14 eine Suspense-Grenze beim statischen
  Prerender, sonst bricht der Build.
- **Karten-`fitPoints` ≠ `points`.** Auf Browse-Seiten alle Items als
  `fitPoints` übergeben, sonst liegen ferne Hover-Pins außerhalb des sichtbaren
  Ausschnitts.
- **Hydration:** Trip-Inhalte werden erst clientseitig aus localStorage geladen
  (`hydrated`-Flag). Komponenten dürfen vor `hydrated` nichts Abweichendes
  rendern — sonst SSR/CSR-Mismatch.

## Konventionen

- Tokens: Josefin Sans (`font-display`, Headings) + Lato (Body), forest-Palette
  aus `tailwind.config.ts`. Keine Hardcoded-Hex-Werte, wo ein Token existiert.
- Dekorative Icons/Bilder bekommen `aria-hidden` bzw. `alt=""`; bedeutungstragende
  Bilder einen echten `alt`-Text.
- Surgical Changes: nur anfassen, was die Aufgabe verlangt; bestehenden Stil
  spiegeln.
