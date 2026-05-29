import type { Route } from "@/data/types";
import { DifficultyBadge, Tag } from "./Badge";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-neutralgray">{label}</dt>
      <dd className="text-sm font-semibold text-forest-dark">{value}</dd>
    </div>
  );
}

export default function RouteCard({ route }: { route: Route }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      <div
        className={`relative flex h-40 items-end bg-gradient-to-br p-4 ${route.gradient}`}
      >
        <span className="absolute right-3 top-3">
          <DifficultyBadge level={route.difficulty} />
        </span>
        <p className="text-sm font-medium text-fog/90">{route.region}</p>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl font-bold text-forest-darkest">
          {route.name}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-neutralgray">
          {route.summary}
        </p>

        <dl className="mt-4 grid grid-cols-3 gap-3 border-t border-softgray/40 pt-4">
          <Stat label="Distance" value={`${route.distanceKm} km`} />
          <Stat label="Ascent" value={`${route.ascentM} m`} />
          <Stat
            label={route.days > 1 ? "Duration" : "Time"}
            value={route.days > 1 ? `${route.days} days` : `${route.durationHours} h`}
          />
        </dl>

        <div className="mt-4 flex flex-wrap gap-2">
          {route.terrain.slice(0, 3).map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
          {route.dogFriendly && <Tag>🐾 Dog friendly</Tag>}
        </div>
      </div>
    </article>
  );
}
