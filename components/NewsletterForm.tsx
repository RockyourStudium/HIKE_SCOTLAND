"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, Mountain, X } from "lucide-react";
import AnimatedCTA from "@/components/AnimatedCTA";

// A simple, pragmatic email check — good enough for client-side UX while the
// real validation would happen on whatever backend we wire up later.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Keep in sync with the .toast-progress animation duration in globals.css.
const TOAST_MS = 5000;

type Errors = { firstName?: string; email?: string };

export default function NewsletterForm() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Only portal the toast once mounted in the browser (document.body exists).
  useEffect(() => setMounted(true), []);

  // Auto-dismiss the toast a few seconds after it appears.
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(false), TOAST_MS);
    return () => clearTimeout(t);
  }, [toast]);

  function validate(): Errors {
    const next: Errors = {};
    if (!firstName.trim()) next.firstName = "Please enter your first name.";
    if (!email.trim()) next.email = "Please enter your email address.";
    else if (!EMAIL_RE.test(email.trim()))
      next.email = "Please enter a valid email address.";
    return next;
  }

  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setPending(true);
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          firstName: firstName.trim(),
          source: "newsletter",
        }),
      });
      if (!res.ok) throw new Error("subscribe failed");
      setSubmitted(true);
      setToast(true);
    } catch {
      setErrors({ email: "Something went wrong. Please try again." });
    } finally {
      setPending(false);
    }
  }

  const toastEl =
    mounted && toast
      ? createPortal(
          <div
            role="status"
            aria-live="polite"
            className="toast-in fixed right-4 top-4 z-[60] w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-2xl bg-forest-darkest/95 p-4 pr-3 shadow-card-hover ring-1 ring-mint/40 backdrop-blur"
          >
      <div className="flex items-start gap-3">
        <CheckCircle2 aria-hidden className="mt-0.5 h-6 w-6 shrink-0 text-mint" strokeWidth={2} />
        <div className="min-w-0 flex-1">
          <p className="font-display text-sm font-bold text-fog">You&apos;re on your way!</p>
          <p className="mt-0.5 text-sm leading-snug text-fog/75">
            Fresh routes and seasonal highlights are on their way.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setToast(false)}
          aria-label="Dismiss notification"
          className="-mr-1 -mt-1 rounded-lg p-1.5 text-fog/60 transition-colors hover:bg-white/10 hover:text-fog"
        >
          <X aria-hidden className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
      <span
        aria-hidden
        className="toast-progress absolute inset-x-0 bottom-0 h-0.5 origin-left bg-mint/70"
      />
          </div>,
          document.body
        )
      : null;

  if (submitted) {
    return (
      <>
        {toastEl}
        <div className="rounded-2xl bg-forest-darkest/55 p-8 text-center ring-1 ring-mint/40 backdrop-blur-sm">
          <CheckCircle2 aria-hidden className="mx-auto h-12 w-12 text-mint" strokeWidth={1.75} />
          <h2 className="mt-4 font-display text-2xl font-bold text-fog">
            You&apos;re on the trail, {firstName.trim()}!
          </h2>
          <p className="mx-auto mt-3 max-w-md text-fog/80">
            Thanks for subscribing. Keep an eye on your inbox — fresh routes,
            guided tours and seasonal highlights are heading your way.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      {toastEl}
      <form
        noValidate
        onSubmit={handleSubmit}
        className="rounded-2xl bg-forest-darkest/55 p-6 ring-1 ring-white/10 backdrop-blur-sm sm:p-8"
      >
        <div className="flex items-center gap-2 text-mint">
          <Mountain aria-hidden className="h-6 w-6" strokeWidth={2} />
          <span className="font-display text-lg font-semibold">Join the newsletter</span>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <label htmlFor="firstName" className="block text-sm font-semibold text-fog">
              First name <span className="text-mint">*</span>
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              aria-required="true"
              aria-invalid={errors.firstName ? "true" : undefined}
              aria-describedby={errors.firstName ? "firstName-error" : undefined}
              className="mt-2 w-full rounded-xl border-0 bg-white/10 px-4 py-3 text-fog placeholder:text-fog/40 ring-1 ring-white/15 transition-colors focus:bg-white/15 focus:ring-mint/60"
              placeholder="Your first name"
            />
            {errors.firstName && (
              <p id="firstName-error" className="mt-2 text-sm font-medium text-danger-light">
                {errors.firstName}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-fog">
              Email address <span className="text-mint">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-required="true"
              aria-invalid={errors.email ? "true" : undefined}
              aria-describedby={errors.email ? "email-error" : undefined}
              className="mt-2 w-full rounded-xl border-0 bg-white/10 px-4 py-3 text-fog placeholder:text-fog/40 ring-1 ring-white/15 transition-colors focus:bg-white/15 focus:ring-mint/60"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p id="email-error" className="mt-2 text-sm font-medium text-danger-light">
                {errors.email}
              </p>
            )}
          </div>
        </div>

        <AnimatedCTA type="submit" block className="mt-7 text-base" disabled={pending}>
          {pending ? "Signing you up …" : "Fetch latest news"}
        </AnimatedCTA>

        <p className="mt-4 text-center text-xs leading-relaxed text-fog/60">
          No spam, just trails. Unsubscribe any time.
        </p>
      </form>
    </>
  );
}
