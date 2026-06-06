"use client";

import { useState } from "react";
import { CalendarDays, CheckCircle2, Loader2, PartyPopper, XCircle } from "lucide-react";
import { checkBookingAvailability, type AvailabilityResult } from "@/lib/availability";
import { createBooking, type BookingItemInput, type CreateBookingResult } from "@/lib/bookings";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Zeitraum + Personen + Kontaktdaten -> Verfügbarkeit prüfen und (Gast-)Buchung
 * anlegen. Login wird später erzwungen; bis dahin Gastbuchung mit Name + E-Mail.
 */
export default function BookingPanel({
  items,
  onBooked,
}: {
  items: BookingItemInput[];
  onBooked?: () => void;
}) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [party, setParty] = useState(2);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [checkState, setCheckState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [avail, setAvail] = useState<AvailabilityResult | null>(null);

  const [bookState, setBookState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [booking, setBooking] = useState<CreateBookingResult | null>(null);

  const datesValid = !!start && !!end && party >= 1;
  const contactValid = name.trim().length > 0 && EMAIL_RE.test(email.trim());

  async function onCheck() {
    setCheckState("loading");
    setAvail(null);
    try {
      const r = await checkBookingAvailability({ items, startDate: start, endDate: end, partySize: party });
      setAvail(r);
      setCheckState("done");
    } catch {
      setCheckState("error");
    }
  }

  async function onBook() {
    setBookState("loading");
    setBooking(null);
    const r = await createBooking({
      items,
      startDate: start,
      endDate: end,
      partySize: party,
      name: name.trim(),
      email: email.trim(),
    });
    setBooking(r);
    setBookState(r.ok ? "done" : "error");
    if (r.ok) onBooked?.();
  }

  // Erfolgsansicht nach Buchung
  if (bookState === "done" && booking?.ok) {
    return (
      <section className="mt-10 rounded-2xl bg-forest-gradient p-8 text-center text-fog">
        <PartyPopper aria-hidden className="mx-auto h-12 w-12 text-mint" strokeWidth={1.75} />
        <h2 className="mt-4 font-display text-2xl font-bold">Booking requested!</h2>
        <p className="mx-auto mt-2 max-w-md text-fog/85">
          Thanks, {name.trim()} — your trip is reserved
          {typeof booking.total === "number" && booking.total > 0 && ` (from £${booking.total})`}.
          We&apos;ve got your request and will be in touch at {email.trim()}.
        </p>
        {booking.booking_id && (
          <p className="mx-auto mt-4 inline-block rounded-lg bg-white/10 px-4 py-2 text-sm text-fog ring-1 ring-inset ring-white/20">
            Reference: <span className="font-mono font-semibold">{booking.booking_id.slice(0, 8).toUpperCase()}</span>
          </p>
        )}
      </section>
    );
  }

  return (
    <section className="mt-10 rounded-2xl bg-white p-6 shadow-card sm:p-8">
      <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-forest-darkest">
        <CalendarDays aria-hidden className="h-6 w-6" color="url(#hike-gradient)" />
        Check &amp; book
      </h2>
      <p className="mt-1 text-sm text-neutralgray">
        Pick your dates and party size, then request your trip. No account needed —
        we&apos;ll confirm by email.
      </p>

      {/* Dates + party */}
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <Field label="From" htmlFor="bk-start">
          <input id="bk-start" type="date" value={start} onChange={(e) => setStart(e.target.value)} className={inputCls} />
        </Field>
        <Field label="To" htmlFor="bk-end">
          <input id="bk-end" type="date" value={end} min={start || undefined} onChange={(e) => setEnd(e.target.value)} className={inputCls} />
        </Field>
        <Field label="People" htmlFor="bk-party">
          <input id="bk-party" type="number" min={1} value={party} onChange={(e) => setParty(Math.max(1, Number(e.target.value) || 1))} className={inputCls} />
        </Field>
      </div>

      <button
        type="button"
        onClick={onCheck}
        disabled={!datesValid || checkState === "loading"}
        className="mt-4 inline-flex items-center gap-2 rounded-xl border border-forest-highland px-5 py-2.5 text-sm font-semibold text-forest-highland transition-colors hover:bg-fog disabled:opacity-50"
      >
        {checkState === "loading" && <Loader2 aria-hidden className="h-4 w-4 animate-spin" />}
        {checkState === "loading" ? "Checking …" : "Check availability"}
      </button>

      {checkState === "done" && avail?.ok && (
        <Note tone="ok">Available for these dates for {party} {party === 1 ? "person" : "people"}.</Note>
      )}
      {checkState === "done" && avail && !avail.ok && (
        <Note tone="bad" title="Not available for the selected dates.">
          {avail.reasons.map((r, i) => <li key={i}>{r.message}</li>)}
        </Note>
      )}
      {checkState === "error" && <p className="mt-3 text-sm font-medium text-danger">Couldn&apos;t check availability. Please try again.</p>}

      {/* Contact + book */}
      <div className="mt-6 border-t border-softgray/50 pt-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Your name" htmlFor="bk-name">
            <input id="bk-name" type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={inputCls} />
          </Field>
          <Field label="Email" htmlFor="bk-email">
            <input id="bk-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputCls} />
          </Field>
        </div>

        <button
          type="button"
          onClick={onBook}
          disabled={!datesValid || !contactValid || bookState === "loading"}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-forest-highland px-6 py-3 font-semibold text-white transition-colors hover:bg-forest-dark disabled:opacity-50"
        >
          {bookState === "loading" && <Loader2 aria-hidden className="h-4 w-4 animate-spin" />}
          {bookState === "loading" ? "Requesting …" : "Request booking"}
        </button>

        {bookState === "error" && booking && (
          <Note tone="bad" title="This trip can't be booked.">
            {(booking.reasons ?? [{ code: "x", message: "Please try again." }]).map((r, i) => (
              <li key={i}>{r.message}</li>
            ))}
          </Note>
        )}
      </div>
    </section>
  );
}

const inputCls =
  "mt-2 w-full rounded-xl border border-softgray bg-fog/40 px-4 py-2.5 text-sm text-forest-dark focus:border-forest-highland";

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-semibold text-forest-dark">
        {label}
      </label>
      {children}
    </div>
  );
}

function Note({ tone, title, children }: { tone: "ok" | "bad"; title?: string; children: React.ReactNode }) {
  if (tone === "ok") {
    return (
      <div className="mt-4 flex items-start gap-3 rounded-xl bg-mint/15 p-4 ring-1 ring-inset ring-forest-highland/30">
        <CheckCircle2 aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-forest-highland" />
        <p className="text-sm font-medium text-forest-dark">{children}</p>
      </div>
    );
  }
  return (
    <div className="mt-4 flex items-start gap-3 rounded-xl bg-danger/10 p-4 ring-1 ring-inset ring-danger/30">
      <XCircle aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-danger" />
      <div className="text-sm">
        {title && <p className="font-semibold text-danger">{title}</p>}
        <ul className="mt-1 list-disc space-y-0.5 pl-5 text-forest-dark">{children}</ul>
      </div>
    </div>
  );
}
