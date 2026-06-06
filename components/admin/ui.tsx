import Link from "next/link";

// Reine Präsentations-Helfer fürs Admin-Dashboard (Server-safe, kein State).

export function formatMoney(amount: number, currency = "GBP"): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(iso: string | null): string {
  if (!iso) return "—";
  // Datum-only (YYYY-MM-DD) und Timestamps gleichermaßen verarbeiten.
  const d = new Date(iso.length <= 10 ? `${iso}T00:00:00` : iso);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-card">
      <div className="text-sm font-medium text-neutralgray">{label}</div>
      <div className="mt-1 font-display text-3xl font-bold text-forest-darkest">
        {value}
      </div>
      {hint ? <div className="mt-1 text-xs text-neutralgray">{hint}</div> : null}
    </div>
  );
}

// Farbgebung pro Status. Default = neutral, damit unbekannte Werte nicht crashen.
const TONES: Record<string, string> = {
  // Subscriber
  subscribed: "bg-fog text-forest-dark",
  pending: "bg-amber-100 text-amber-800",
  unsubscribed: "bg-neutral-100 text-neutralgray",
  // Booking
  confirmed: "bg-fog text-forest-dark",
  completed: "bg-mint/40 text-forest-dark",
  cancelled: "bg-danger/10 text-danger",
  no_show: "bg-danger/10 text-danger",
  // Payment
  paid: "bg-fog text-forest-dark",
  unpaid: "bg-amber-100 text-amber-800",
  failed: "bg-danger/10 text-danger",
  refunded: "bg-neutral-100 text-neutralgray",
  partially_refunded: "bg-amber-100 text-amber-800",
};

export function StatusBadge({ status }: { status: string }) {
  const tone = TONES[status] ?? "bg-neutral-100 text-neutralgray";
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${tone}`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}

export function PageHeading({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-display text-2xl font-bold text-forest-darkest">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1 text-sm text-neutralgray">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 text-sm font-medium text-forest-highland hover:underline"
    >
      ← {label}
    </Link>
  );
}
