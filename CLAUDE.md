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

**Supabase** (PostgreSQL) als Backend — Details in `supabase/README.md`. In der
DB liegen: Katalog (`tours`/`routes`/`stays`, jedes Item mit `coords {lat,lng}`),
Buchungen (`bookings`/`booking_items`/`tour_departures`) und Newsletter
(`subscribers`). Server liest über `lib/catalog.ts` (anon-Key, RLS); Schreib-/
Admin-Zugriff **nur** server-seitig über `lib/supabase-admin.ts` (`service_role`).
In `data/*.ts` bleiben nur noch `destinations`, `imageCredits` und `types`
(App-Typen). Trip-State lebt im React Context + localStorage (`lib/trip.tsx`).

**Auth:** Google OAuth über Supabase Auth (`@supabase/ssr`). Cookie-bewusste
Clients in `lib/supabase/{server,client,middleware}.ts`; Rolle/Schutz server-seitig
(`middleware.ts` + `lib/auth/roles.ts`, DB-Spalte `profiles.role`), Login-Status
client-seitig im `AuthProvider` (`lib/auth/AuthProvider.tsx`, `useAuth`). UI:
`components/UserMenu.tsx` (Nav), Self-Service unter `app/account/*`, Nutzer-/
Rollenverwaltung unter `app/admin/profiles/*`. Details in `supabase/README.md`.

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
  Detailseiten, `/credits`, `/admin`) bleiben hell — wegen Lesbarkeit von
  Formularen, Karten und Cards.
- **`<Suspense>` im Planner nicht entfernen.** `useSearchParams` in
  `app/plan/page.tsx` braucht in Next 14 eine Suspense-Grenze beim statischen
  Prerender, sonst bricht der Build.
- **Karten-`fitPoints` ≠ `points`.** Auf Browse-Seiten alle Items als
  `fitPoints` übergeben, sonst liegen ferne Hover-Pins außerhalb des sichtbaren
  Ausschnitts.
- **Hydration:** Trip-Inhalte werden erst clientseitig aus localStorage geladen
  (`hydrated`-Flag). Komponenten dürfen vor `hydrated` nichts Abweichendes
  rendern — sonst SSR/CSR-Mismatch.
- **`/admin` ist echt geschützt** (Google-Login + `profiles.role='admin'`). Die
  Middleware frischt die Session auf und antwortet auf `/admin*` mit 404, wenn
  kein Admin (kein Info-Leak); `/account*` verlangt Login. Das alte
  `ADMIN_ENABLED`-Gate ist **entfernt** — die Variable wird nicht mehr gelesen
  (kann aus `.env*` raus). Reads/Writes im Admin weiterhin über `service_role`
  (`lib/admin/*`); zusätzlich prüft `app/admin/layout.tsx` die Rolle noch einmal.
- **Admin-Selbstsperre vermeiden:** In `app/admin/profiles/*` kann sich der
  eingeloggte Admin **nicht selbst** die Admin-Rolle entziehen (Guard in den
  Server Actions) — sonst Aussperr-Risiko.
- **Prod-OAuth-Config nicht vergessen:** Google-Login braucht pro Umgebung die
  Redirect-URLs in Supabase (Auth → URL Configuration) **und** den Google-OAuth-
  Client. Lokal = `http://localhost:3000/auth/callback`; für Production die echte
  Domain ergänzen, sonst schlägt der Login nach dem Deploy fehl.
- **Auth-Hydration:** Login-Status kommt **client-seitig** über den `AuthProvider`
  (kein Cookie-Read im Root-Layout) — so bleiben die Marketing-Seiten statisch.
  `UserMenu` rendert für eingeloggte User erst nach Auflösen des Status, sonst
  SSR/CSR-Flash.

## Konventionen

- Tokens: Josefin Sans (`font-display`, Headings) + Lato (Body), forest-Palette
  aus `tailwind.config.ts`. Keine Hardcoded-Hex-Werte, wo ein Token existiert.
- Dekorative Icons/Bilder bekommen `aria-hidden` bzw. `alt=""`; bedeutungstragende
  Bilder einen echten `alt`-Text.
- Surgical Changes: nur anfassen, was die Aufgabe verlangt; bestehenden Stil
  spiegeln.
