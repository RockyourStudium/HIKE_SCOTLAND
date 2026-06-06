import Link from "next/link";
import { getOverview } from "@/lib/admin/queries";
import {
  StatCard,
  PageHeading,
  formatMoney,
  StatusBadge,
} from "@/components/admin/ui";

// Liest zur Laufzeit per service_role — nie statisch prerendern.
export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const o = await getOverview();

  return (
    <>
      <PageHeading
        title="Overview"
        subtitle="Live metrics — newsletter & bookings."
      />

      <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-neutralgray">
        Newsletter
      </h2>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total subscribers" value={o.subscribers.total} />
        <StatCard
          label="Active (subscribed)"
          value={o.subscribers.byStatus.subscribed ?? 0}
        />
        <StatCard
          label="Pending"
          value={o.subscribers.byStatus.pending ?? 0}
        />
        <StatCard
          label="New (30 days)"
          value={o.subscribers.last30d}
          hint="Sign-ups in the last month"
        />
      </div>

      <div className="mt-4 text-right">
        <Link
          href="/admin/subscribers"
          className="text-sm font-medium text-forest-highland hover:underline"
        >
          Manage newsletter →
        </Link>
      </div>

      <h2 className="mb-3 mt-8 font-display text-sm font-bold uppercase tracking-wide text-neutralgray">
        Bookings
      </h2>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total bookings" value={o.bookings.total} />
        <StatCard
          label="Revenue"
          value={formatMoney(o.bookings.revenue, o.bookings.currency)}
          hint="excluding cancelled"
        />
        <StatCard
          label="Upcoming trips"
          value={o.bookings.upcoming}
          hint="arrival from today"
        />
        <StatCard label="New (30 days)" value={o.bookings.last30d} />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-card">
          <h3 className="mb-3 text-sm font-bold text-forest-darkest">
            Bookings by status
          </h3>
          {Object.keys(o.bookings.byStatus).length === 0 ? (
            <p className="text-sm text-neutralgray">No bookings yet.</p>
          ) : (
            <ul className="space-y-2">
              {Object.entries(o.bookings.byStatus).map(([status, count]) => (
                <li
                  key={status}
                  className="flex items-center justify-between text-sm"
                >
                  <StatusBadge status={status} />
                  <span className="font-medium text-forest-dark">{count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-card">
          <h3 className="mb-3 text-sm font-bold text-forest-darkest">
            Top content
          </h3>
          {o.topItems.length === 0 ? (
            <p className="text-sm text-neutralgray">No items yet.</p>
          ) : (
            <ul className="space-y-2">
              {o.topItems.map((it) => (
                <li
                  key={`${it.item_type}:${it.item_id}`}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <span className="truncate text-forest-dark">
                    <span className="text-neutralgray">[{it.item_type}]</span>{" "}
                    {it.title}
                  </span>
                  <span className="font-medium text-forest-dark">{it.count}×</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-4 text-right">
        <Link
          href="/admin/bookings"
          className="text-sm font-medium text-forest-highland hover:underline"
        >
          Manage bookings →
        </Link>
      </div>
    </>
  );
}
