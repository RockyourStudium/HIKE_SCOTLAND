import Image from "next/image";
import Link from "next/link";
import { PawPrint } from "lucide-react";
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
    <Link
      href={`/routes/${route.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
    >
      <div className="relative flex h-56 items-end overflow-hidden p-4">
        {route.image ? (
          <Image
            src={route.image}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${route.gradient}`} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-forest-darkest/85 via-forest-darkest/20 to-forest-darkest/10" />
        <span className="absolute right-3 top-3 z-10">
          <DifficultyBadge level={route.difficulty} />
        </span>
        <p className="relative z-10 text-sm font-semibold text-fog drop-shadow">
          {route.region}
        </p>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="shimmer-title font-display text-xl font-bold">
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
          {route.dogFriendly && (
            <Tag>
              <PawPrint aria-hidden className="mr-1 h-3.5 w-3.5" /> Dog friendly
            </Tag>
          )}
        </div>
      </div>
    </Link>
  );
}
