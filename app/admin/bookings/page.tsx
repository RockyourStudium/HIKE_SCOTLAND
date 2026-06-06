import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  listBookings,
  BOOKING_STATUSES,
  PAYMENT_STATUSES,
} from "@/lib/admin/queries";
import {
  PageHeading,
  StatusBadge,
  formatDate,
  formatMoney,
} from "@/components/admin/ui";
import QuickStatusButton from "@/components/admin/QuickStatusButton";
import { updateBookingField } from "./actions";

export const dynamic = "force-dynamic";

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: { q?: string; status?: string; payment?: string };
}) {
  const q = (searchParams.q ?? "").trim();
  const status = searchParams.status ?? "all";
  const payment = searchParams.payment ?? "all";

  // Overlap-Zahlen werden in listBookings über ALLE aktiven Buchungen berechnet
  // — daher erst danach filtern, sonst stimmten die Werte nicht mehr.
  const all = await listBookings();
  const qLower = q.toLowerCase();
  const bookings = all.filter((b) => {
    if (status !== "all" && b.status !== status) return false;
    if (payment !== "all" && b.payment_status !== payment) return false;
    if (q) {
      const hay = `${b.guest_name ?? ""} ${b.guest_email ?? ""}`.toLowerCase();
      if (!hay.includes(qLower)) return false;
    }
    return true;
  });
  const withOverlap = bookings.filter((b) => b.overlapCount > 0).length;
  const filtered = status !== "all" || payment !== "all" || q !== "";

  return (
    <>
      <PageHeading
        title="Bookings"
        subtitle={`${bookings.length}${filtered ? ` of ${all.length}` : ""} booking${
          bookings.length === 1 ? "" : "s"
        }${withOverlap > 0 ? ` · ${withOverlap} with overlap` : ""}`}
      />

      {/* Filter / search (GET) */}
      <form method="get" className="mb-4 flex flex-wrap items-center gap-2">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search guest…"
          className="w-56 rounded-lg border border-mint/60 px-3 py-1.5 text-sm text-forest-dark focus:border-forest-highland focus:outline-none focus:ring-1 focus:ring-forest-highland"
        />
        <select
          name="status"
          defaultValue={status}
          className="rounded-lg border border-mint/60 bg-white px-3 py-1.5 text-sm text-forest-dark focus:border-forest-highland focus:outline-none focus:ring-1 focus:ring-forest-highland"
        >
          <option value="all">All statuses</option>
          {BOOKING_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, " ")}
            </option>
          ))}
        </select>
        <select
          name="payment"
          defaultValue={payment}
          className="rounded-lg border border-mint/60 bg-white px-3 py-1.5 text-sm text-forest-dark focus:border-forest-highland focus:outline-none focus:ring-1 focus:ring-forest-highland"
        >
          <option value="all">All payments</option>
          {PAYMENT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, " ")}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-full border border-forest-highland px-4 py-1.5 text-sm font-medium text-forest-highland hover:bg-fog"
        >
          Filter
        </button>
        {filtered ? (
          <Link
            href="/admin/bookings"
            className="text-sm font-medium text-neutralgray hover:underline"
          >
            Reset
          </Link>
        ) : null}
      </form>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-mint/40 text-xs uppercase tracking-wide text-neutralgray">
            <tr>
              <th className="px-4 py-3 font-medium">Guest</th>
              <th className="px-4 py-3 font-medium">Dates</th>
              <th className="px-4 py-3 font-medium">Party</th>
              <th className="px-4 py-3 font-medium">Content</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Payment</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Overlap</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mint/20">
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-neutralgray">
                  {filtered ? "No bookings match the filter." : "No bookings yet."}
                </td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr key={b.id} className="align-top hover:bg-fog/40">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/bookings/${b.id}`}
                      className="group inline-flex items-center gap-1 font-medium text-forest-highland underline decoration-mint decoration-2 underline-offset-2 hover:decoration-forest-highland"
                    >
                      {b.guest_name ?? "—"}
                      <ChevronRight
                        className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </Link>
                    <div className="text-xs text-neutralgray">
                      {b.guest_email ?? "—"}
                    </div>
                  </td>
                  {/* Start- und End-Datum untereinander spart Spaltenbreite. */}
                  <td className="px-4 py-3 whitespace-nowrap text-forest-dark">
                    <div>{formatDate(b.start_date)}</div>
                    <div className="text-neutralgray">
                      → {formatDate(b.end_date)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-forest-dark">{b.party_size}</td>
                  <td className="px-4 py-3 text-forest-dark">
                    {b.items.length === 0 ? (
                      <span className="text-neutralgray">—</span>
                    ) : (
                      <ul className="space-y-0.5">
                        {b.items.map((it) => (
                          <li key={it.id} className="truncate">
                            <span className="text-neutralgray">[{it.item_type}]</span>{" "}
                            {it.title}
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={b.payment_status} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-medium text-forest-dark">
                    {formatMoney(Number(b.total), b.currency)}
                  </td>
                  <td className="px-4 py-3">
                    {b.overlapCount > 0 ? (
                      <span className="inline-block rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                        {b.overlapCount}
                      </span>
                    ) : (
                      <span className="text-neutralgray">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1.5">
                      {b.status === "pending" ? (
                        <QuickStatusButton
                          action={updateBookingField}
                          id={b.id}
                          field="status"
                          value="confirmed"
                          label="Confirm"
                          variant="primary"
                          ariaLabel={`Confirm booking for ${b.guest_name ?? b.id}`}
                        />
                      ) : null}
                      {b.status !== "cancelled" ? (
                        <QuickStatusButton
                          action={updateBookingField}
                          id={b.id}
                          field="status"
                          value="cancelled"
                          label="Reject"
                          variant="danger"
                          ariaLabel={`Reject booking for ${b.guest_name ?? b.id}`}
                        />
                      ) : (
                        <span className="text-xs text-neutralgray">—</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-neutralgray">
        “Overlap” = number of other active bookings whose travel dates overlap
        with this one (relevant for guide and stay capacity).
      </p>
    </>
  );
}
