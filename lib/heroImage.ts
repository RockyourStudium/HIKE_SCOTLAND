import fs from "node:fs";
import path from "node:path";

// Photo formats take priority; the hand-drawn SVG is the fallback.
const EXTENSIONS = ["jpg", "jpeg", "png", "webp", "avif"];
const heroesDir = path.join(process.cwd(), "public", "heroes");

/**
 * Resolves the hero image URL for a given name (e.g. "landing" or a
 * destination slug). Drop a real photo into /public/heroes/<name>.jpg
 * (or .png/.webp/.avif) and it will automatically replace the SVG —
 * no code changes required. Runs at build/SSR time in server components.
 */
export function heroImage(name: string): string {
  for (const ext of EXTENSIONS) {
    if (fs.existsSync(path.join(heroesDir, `${name}.${ext}`))) {
      return `/heroes/${name}.${ext}`;
    }
  }
  return `/heroes/${name}.svg`;
}
