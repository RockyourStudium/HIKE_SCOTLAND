# Hike Scotland

Discover and plan hiking adventures across Scotland — browse routes, guided
tours and places to stay, then build a personalised, ordered itinerary. A
cinematic marketing front paired with a hands-on trip planner.

🔗 **Live:** https://hike-scotland-claude.vercel.app

## Features

- **Trip planner** — a short quiz scores your experience, time, scenery,
  region, comfort and more into matched routes, tours and stays.
- **My Trip** — a site-wide itinerary builder: add anything as you browse,
  reorder stops, set nights for stays, see live totals (stops, regions,
  walking days, cost). Persisted in `localStorage`.
- **Interactive maps** — Leaflet maps with numbered, connected pins that follow
  your itinerary order; hover a card to locate it on the map.
- **Cinematic destination pages** — full-bleed photography, large display
  typography, scroll reveals.
- **Booking** — book a self-assembled trip as a guest; a race-safe SQL function
  re-checks availability and freezes prices server-side.
- **Newsletter** — email signup with token-based unsubscribe.
- **Admin dashboard** (`/admin`) — internal tooling to manage subscribers,
  bookings and the catalog (tours/routes/stays + tour departures). Gated by an
  `ADMIN_ENABLED` env flag; no public auth yet.
- **Accessible by default** — skip link, visible focus rings, reduced-motion
  support, semantic landmarks, labelled forms.

## Tech stack

- [Next.js 14](https://nextjs.org/) (App Router) · React 18 · TypeScript
- [Tailwind CSS 3](https://tailwindcss.com/) · [lucide-react](https://lucide.dev/) icons
- [Leaflet](https://leafletjs.com/) + react-leaflet (OpenStreetMap tiles, no API key)
- [sharp](https://sharp.pixelplumbing.com/) for build-time image optimisation
- [Supabase](https://supabase.com/) (PostgreSQL) — catalog, bookings & newsletter

The catalog (routes, tours, stays), bookings and newsletter subscribers live in
Supabase; public pages read it server-side with ISR (`revalidate`). `data/*.ts`
keeps only destinations, image credits and shared types. Schema, setup and
maintenance: see [`supabase/README.md`](supabase/README.md).

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run optimize-images` | Optimise source images via sharp |

## Project structure

```
app/          Routes (App Router): /, /plan, /my-trip, /routes, /tours,
              /destinations, /stays, /credits, /newsletter, /unsubscribe …
app/admin/    Internal dashboard: overview, subscribers, bookings, catalog CRUD
app/api/      Route handlers: /api/bookings, /api/newsletter/*
components/    UI: CinematicHero, Navbar, cards, carousels, maps, forms; admin/*
data/         Static, typed content (destinations, image credits, shared types)
lib/          catalog + supabase (DB access), admin/* (service_role reads),
              recommend (quiz scoring), trip (context + localStorage), mapPoints
supabase/     SQL migrations + database README (schema, setup, maintenance)
public/       Optimised imagery (heroes, cards, gallery)
```

## Deployment

Hosted on Vercel — pushing to `main` triggers an automatic production deploy.
