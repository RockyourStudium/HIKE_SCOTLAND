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
- **Accessible by default** — skip link, visible focus rings, reduced-motion
  support, semantic landmarks, labelled forms.

## Tech stack

- [Next.js 14](https://nextjs.org/) (App Router) · React 18 · TypeScript
- [Tailwind CSS 3](https://tailwindcss.com/) · [lucide-react](https://lucide.dev/) icons
- [Leaflet](https://leafletjs.com/) + react-leaflet (OpenStreetMap tiles, no API key)
- [sharp](https://sharp.pixelplumbing.com/) for build-time image optimisation

No backend or database — all content is static and typed in `data/*.ts`.

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
              /destinations, /stays, /credits …
components/   UI: CinematicHero, Navbar, cards, carousels, maps, forms
data/         Static, typed content (routes, tours, stays, destinations)
lib/          recommend (quiz scoring), trip (context + localStorage),
              heroImage, mapPoints
public/       Optimised imagery (heroes, cards, gallery)
```

## Deployment

Hosted on Vercel — pushing to `main` triggers an automatic production deploy.
