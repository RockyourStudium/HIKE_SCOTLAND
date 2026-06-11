"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Star } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { submitReview } from "@/lib/reviews-actions";
import { buttonClasses } from "@/components/Button";
import type { ReviewSubject } from "@/lib/reviews";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={buttonClasses({ size: "sm" })}>
      {pending ? "Saving …" : "Submit review"}
    </button>
  );
}

/**
 * Review-Abgabe (Client): Login-Status kommt aus dem AuthProvider, damit die
 * Detailseiten statisch (ISR) bleiben. Pro User & Objekt gibt es genau eine
 * Review — erneutes Absenden überschreibt die eigene (Upsert in der Action).
 */
export default function ReviewForm({
  subjectType,
  subjectId,
  path,
}: {
  subjectType: ReviewSubject;
  subjectId: string;
  path: string;
}) {
  const { user, signInWithGoogle } = useAuth();
  const [rating, setRating] = useState(0);

  if (!user) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-card">
        <p className="text-sm text-neutralgray">
          Been here?{" "}
          <button
            type="button"
            onClick={signInWithGoogle}
            className="font-semibold text-forest-highland underline-offset-2 hover:underline"
          >
            Sign in with Google
          </button>{" "}
          to share your experience.
        </p>
      </div>
    );
  }

  return (
    <form action={submitReview} className="rounded-2xl bg-white p-6 shadow-card">
      <input type="hidden" name="subject_type" value={subjectType} />
      <input type="hidden" name="subject_id" value={subjectId} />
      <input type="hidden" name="path" value={path} />

      <fieldset>
        <legend className="text-sm font-semibold text-forest-dark">Your rating</legend>
        <div className="mt-2 flex gap-1">
          {[1, 2, 3, 4, 5].map((v) => (
            <label key={v} className="cursor-pointer">
              <input
                type="radio"
                name="rating"
                value={v}
                required
                checked={rating === v}
                onChange={() => setRating(v)}
                className="sr-only"
              />
              <Star
                aria-hidden
                className={`h-7 w-7 transition-colors ${
                  v <= rating ? "fill-mist text-mist" : "text-softgray hover:text-mist"
                }`}
              />
              <span className="sr-only">
                {v} {v === 1 ? "star" : "stars"}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="mt-4 block">
        <span className="text-sm font-semibold text-forest-dark">Your experience (optional)</span>
        <textarea
          name="body"
          rows={4}
          maxLength={2000}
          placeholder="What made it memorable? Anything others should know?"
          className="mt-2 w-full rounded-xl border border-softgray/60 p-3 text-sm text-forest-dark placeholder:text-neutralgray/70 focus:border-forest-highland focus:outline-none"
        />
      </label>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-xs text-neutralgray">
          One review per person — submitting again updates yours.
        </p>
        <SubmitButton />
      </div>
    </form>
  );
}
