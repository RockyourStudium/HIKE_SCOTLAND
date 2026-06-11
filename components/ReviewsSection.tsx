import Link from "next/link";
import { Star } from "lucide-react";
import type { PublicReview, ReviewSubject } from "@/lib/reviews";
import ReviewForm from "@/components/ReviewForm";

function Stars({ value, label }: { value: number; label?: string }) {
  return (
    <span
      className="flex items-center gap-0.5"
      role="img"
      aria-label={label ?? `${value} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((v) => (
        <Star
          key={v}
          aria-hidden
          className={`h-4 w-4 ${
            v <= Math.round(value) ? "fill-mist text-mist" : "text-softgray"
          }`}
        />
      ))}
    </span>
  );
}

function initial(name: string) {
  return name.trim().charAt(0).toUpperCase() || "H";
}

/**
 * Reviews einer Tour/Route (+ Abgabe-Formular für eingeloggte User).
 * Die Seite fetcht die Reviews (lib/reviews) und reicht sie durch — so teilen
 * sich Hero-Badge und Sektion dieselben Daten; der Login-Status fürs Formular
 * kommt client-seitig (ISR-kompatibel).
 */
export default function ReviewsSection({
  subjectType,
  subjectId,
  path,
  reviews,
}: {
  subjectType: ReviewSubject;
  subjectId: string;
  path: string;
  reviews: PublicReview[];
}) {
  const avg = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : null;

  return (
    <section id="reviews">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <h2 className="font-display text-2xl font-bold text-forest-darkest">Reviews</h2>
        {avg !== null && (
          <span className="flex items-center gap-2 text-sm text-neutralgray">
            <Stars value={avg} label={`Average rating ${avg.toFixed(1)} out of 5`} />
            <span className="font-semibold text-forest-dark">{avg.toFixed(1)}</span>·
            {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
          </span>
        )}
      </div>

      {reviews.length === 0 ? (
        <p className="mt-4 text-sm text-neutralgray">
          No reviews yet — be the first to share your experience.
        </p>
      ) : (
        <ul className="mt-4 space-y-4">
          {reviews.map((r) => (
            <li key={r.id} className="rounded-2xl bg-white p-6 shadow-card">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-forest-highland text-sm font-semibold text-white">
                  {r.authorAvatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={r.authorAvatarUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    initial(r.authorName)
                  )}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-forest-dark">
                    {r.authorUsername ? (
                      <Link
                        href={`/profiles/${r.authorUsername}`}
                        className="hover:underline"
                      >
                        {r.authorName}
                      </Link>
                    ) : (
                      r.authorName
                    )}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-neutralgray">
                    <Stars value={r.rating} />
                    {r.createdAt && (
                      <span>
                        {new Date(r.createdAt).toLocaleDateString("en-GB", {
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {r.body && (
                <p className="mt-3 text-sm leading-relaxed text-neutralgray">{r.body}</p>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6">
        <ReviewForm subjectType={subjectType} subjectId={subjectId} path={path} />
      </div>
    </section>
  );
}
