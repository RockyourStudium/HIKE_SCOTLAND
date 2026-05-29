import type { Stay } from "@/data/types";
import { Tag } from "./Badge";

export default function StayCard({ stay }: { stay: Stay }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      <div className={`flex h-28 items-end justify-between bg-gradient-to-br p-4 ${stay.gradient}`}>
        <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-forest-darkest">
          {stay.type}
        </span>
        <span className="flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-forest-darkest">
          <span aria-hidden className="text-mist">★</span>
          {stay.rating.toFixed(1)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold text-forest-darkest">{stay.name}</h3>
        <p className="mt-1 text-sm text-neutralgray">{stay.region}</p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-neutralgray">{stay.summary}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {stay.amenities.slice(0, 3).map((a) => (
            <Tag key={a}>{a}</Tag>
          ))}
        </div>

        <div className="mt-5 border-t border-softgray/40 pt-4">
          <p className="text-lg font-bold text-forest-darkest">
            {stay.pricePerNight === 0 ? (
              "Free"
            ) : (
              <>
                £{stay.pricePerNight}
                <span className="text-sm font-normal text-neutralgray"> / night</span>
              </>
            )}
          </p>
        </div>
      </div>
    </article>
  );
}
