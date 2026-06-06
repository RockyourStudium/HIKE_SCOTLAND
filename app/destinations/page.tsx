import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import CinematicHero from "@/components/CinematicHero";
import Container from "@/components/Container";
import { destinations } from "@/data/destinations";
import { getRoutes } from "@/lib/catalog";
import { heroImage } from "@/lib/heroImage";

// ISR: DB-Änderungen erscheinen ohne Deploy (alle 5 Min revalidiert).
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Destinations — Hike Scotland",
  description:
    "Explore Scotland's best hiking regions: the Highlands, Cairngorms, Isle of Skye, Glencoe, Loch Lomond & The Trossachs and the Scottish Borders.",
};

export default async function DestinationsPage() {
  const routes = await getRoutes();
  return (
    <div className="bg-forest-darkest text-fog">
      <CinematicHero
        image={heroImage("loch-lomond-trossachs")}
        size="md"
        eyebrow="Where to wander"
        title="Destinations"
        subtitle="Six of Scotland's greatest hiking regions — from arctic plateaus to rolling Border hills. Pick a corner of the country and start exploring."
      />

      <Container as="section" py="standard">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((d) => {
            const routeCount = routes.filter((r) => r.region === d.region).length;
            return (
              <Link
                key={d.slug}
                href={`/destinations/${d.slug}`}
                className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl"
              >
                <Image
                  src={heroImage(d.slug)}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-darkest via-forest-darkest/40 to-transparent" />
                <span className="absolute right-4 top-4 font-display text-3xl font-bold text-fog/50">
                  {d.number}
                </span>
                <div className="relative p-6">
                  <h2 className="font-display text-2xl font-bold text-fog">{d.name}</h2>
                  <p className="mt-1 text-sm text-fog/80">{d.tagline}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-4">
                    <span className="text-sm font-semibold text-fog/80">
                      {routeCount} route{routeCount !== 1 ? "s" : ""}
                    </span>
                    <span className="text-sm font-semibold text-mint transition-transform group-hover:translate-x-1">
                      Explore →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
