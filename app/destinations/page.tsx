import Link from "next/link";
import type { Metadata } from "next";
import { destinations } from "@/data/destinations";
import { routes } from "@/data/routes";

export const metadata: Metadata = {
  title: "Destinations — Hike Scotland",
  description:
    "Explore Scotland's best hiking regions: the Highlands, Cairngorms, Isle of Skye, Glencoe, Loch Lomond & The Trossachs and the Scottish Borders.",
};

export default function DestinationsPage() {
  return (
    <>
      <header className="bg-forest-gradient text-fog">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-mint">
            Where to wander
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
            Destinations
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-fog/85">
            Six of Scotland's greatest hiking regions — from arctic plateaus to
            rolling Border hills. Pick a corner of the country and start exploring.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((d) => {
            const routeCount = routes.filter((r) => r.region === d.region).length;
            return (
              <Link
                key={d.slug}
                href={`/destinations/${d.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
              >
                <div
                  className={`relative flex h-44 items-end bg-gradient-to-br p-5 ${d.heroGradient}`}
                >
                  <span className="absolute right-4 top-4 font-display text-3xl font-bold text-fog/40">
                    {d.number}
                  </span>
                  <div>
                    <h2 className="font-display text-2xl font-bold text-fog">{d.name}</h2>
                    <p className="mt-1 text-sm text-fog/85">{d.tagline}</p>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="flex-1 text-sm leading-relaxed text-neutralgray">
                    {d.introParagraphs[0]}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-softgray/40 pt-4">
                    <span className="text-sm font-semibold text-forest-dark">
                      {routeCount} route{routeCount !== 1 ? "s" : ""}
                    </span>
                    <span className="text-sm font-semibold text-forest-highland transition-transform group-hover:translate-x-1">
                      Explore →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
