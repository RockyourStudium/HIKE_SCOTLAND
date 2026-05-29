import type { Tour } from "@/data/types";
import { DifficultyBadge } from "./Badge";

export default function TourCard({ tour }: { tour: Tour }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      <div className={`flex h-32 items-end bg-gradient-to-br p-4 ${tour.gradient}`}>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-forest-darkest">
            {tour.guided ? "Guided" : "Self-guided"}
          </span>
          <span className="text-sm font-medium text-fog/90">{tour.days} days</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl font-bold text-forest-darkest">
            {tour.name}
          </h3>
          <DifficultyBadge level={tour.difficulty} />
        </div>
        <p className="mt-1 text-sm text-neutralgray">{tour.region}</p>
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
          <button
            type="button"
            className="rounded-full bg-forest-highland px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-forest-dark"
          >
            Enquire
          </button>
        </div>
      </div>
    </article>
  );
}
