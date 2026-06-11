import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import type { Tour } from "@/data/types";
import type { RatingSummary } from "@/lib/reviews";
import { DifficultyBadge } from "./Badge";
import Button from "./Button";

export default function TourCard({
  tour,
  rating,
}: {
  tour: Tour;
  /** Aggregierte Reviews (Browse-Seiten); ohne Wert erscheint kein Badge. */
  rating?: RatingSummary;
}) {
  return (
    <Link
      href={`/tours/${tour.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
    >
      <div className="relative flex h-52 items-end overflow-hidden p-4">
        {tour.image ? (
          <Image
            src={tour.image}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${tour.gradient}`} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-forest-darkest/85 via-forest-darkest/20 to-forest-darkest/10" />
        <div className="relative z-10 flex items-center gap-2">
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-forest-darkest">
            {tour.guided ? "Guided" : "Self-guided"}
          </span>
          <span className="text-sm font-semibold text-fog drop-shadow">
            {tour.days} {tour.days === 1 ? "day" : "days"}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="shimmer-title font-display text-xl font-bold">
            {tour.name}
          </h3>
          <DifficultyBadge level={tour.difficulty} />
        </div>
        <div className="mt-1 flex items-center justify-between gap-3">
          <p className="text-sm text-neutralgray">{tour.region}</p>
          {rating && (
            <span className="flex items-center gap-1 text-sm font-semibold text-forest-dark">
              <Star aria-hidden className="h-4 w-4 fill-mist text-mist" />
              {rating.avg.toFixed(1)}
              <span className="font-normal text-neutralgray">({rating.count})</span>
            </span>
          )}
        </div>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-neutralgray">
          {tour.summary}
        </p>

        <ul className="mt-4 space-y-1.5 border-t border-softgray/40 pt-4">
          {tour.includes.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-forest-dark">
              <span aria-hidden className="mt-0.5 text-mist">✓</span>
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-neutralgray">{tour.groupSize}</p>
            <p className="text-lg font-bold text-forest-darkest">
              £{tour.pricePerPerson}
              <span className="text-sm font-normal text-neutralgray"> / person</span>
            </p>
          </div>
          <Button as="span" variant="secondary" className="group-hover:bg-forest-dark">
            View details
          </Button>
        </div>
      </div>
    </Link>
  );
}
