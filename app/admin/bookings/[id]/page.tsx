import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getBooking,
  BOOKING_STATUSES,
  PAYMENT_STATUSES,
} from "@/lib/admin/queries";
import {
  PageHeading,
  StatusBadge,
  BackLink,
  formatDate,
  formatMoney,
} from "@/components/admin/ui";
import AutoSubmitSelect from "@/components/admin/AutoSubmitSelect";
import QuickStatusButton from "@/components/admin/QuickStatusButton";
import {
  updateBookingField,
  updateBookingItem,
  deleteBookingItem,
} from "../actions";

export const dynamic = "force-dynamic";

const ITEM_BANNERS: Record<string, { tone: string; text: string }> = {
  item_saved: { tone: "ok", text: "Item saved." },
  item_deleted: { tone: "ok", text: "Item deleted." },
  db: { tone: "err", text: "Database error — please try again." },
};

export default async function BookingDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { ok?: string; err?: string };
}) {
  const result = await getBooking(params.id);
  if (!result) notFound();
  const { booking: b, overlapping } = result;
  const banner =
    ITEM_BANNERS[searchParams.ok ?? ""] ?? ITEM_BANNERS[searchParams.err ?? ""];

  return (
    <>
      <div className="mb-4">
        <BackLink href="/admin/bookings" label="Back to bookings" />
      </div>
      <PageHeading
        title={b.guest_name ?? "Booking"}
        subtitle={b.guest_email ?? undefined}
      />

      {banner ? (
        <div
          className={`mb-4 rounded-lg px-4 py-2 text-sm ${
            banner.tone === "ok"
              ? "bg-fog text-forest-dark"
              : "bg-danger/10 text-danger"
          }`}
        >
          {banner.text}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        {/* Eckdaten */}
        <div className="rounded-2xl bg-white p-5 shadow-card md:col-span-1">
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-xs text-neutralgray">Dates</dt>
              <dd className="text-forest-dark">
                {formatDate(b.start_date)} → {formatDate(b.end_date)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-neutralgray">Party size</dt>
              <dd className="text-forest-dark">{b.party_size}</dd>
            </div>
            <div>
              <dt className="text-xs text-neutralgray">Total</dt>
              <dd className="font-medium text-forest-dark">
                {formatMoney(Number(b.total), b.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-neutralgray">Created</dt>
              <dd className="text-forest-dark">{formatDate(b.created_at)}</dd>
            </div>
            {b.notes ? (
              <div>
                <dt className="text-xs text-neutralgray">Note</dt>
                <dd className="text-forest-dark">{b.notes}</dd>
              </div>
            ) : null}
          </dl>

          <div className="mt-5 space-y-3 border-t border-mint/30 pt-4">
            {/* Schnellaktionen: Confirm (nur wenn pending) / Reject (= cancelled). */}
            <div className="flex gap-2">
              {b.status === "pending" ? (
                <QuickStatusButton
                  action={updateBookingField}
                  id={b.id}
                  field="status"
                  value="confirmed"
                  label="Confirm"
                  variant="primary"
                  ariaLabel="Confirm booking"
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
                  ariaLabel="Reject booking"
                />
              ) : null}
            </div>
            <div>
              <span className="mb-1 block text-xs text-neutralgray">Status</span>
              <AutoSubmitSelect
                action={updateBookingField}
                id={b.id}
                field="status"
                value={b.status}
                options={BOOKING_STATUSES}
                ariaLabel="Change booking status"
              />
            </div>
            <div>
              <span className="mb-1 block text-xs text-neutralgray">Payment</span>
              <AutoSubmitSelect
                action={updateBookingField}
                id={b.id}
                field="payment_status"
                value={b.payment_status}
                options={PAYMENT_STATUSES}
                ariaLabel="Change payment status"
              />
            </div>
          </div>
        </div>

        {/* Posten — editierbar / löschbar */}
        <div className="rounded-2xl bg-white p-5 shadow-card md:col-span-2">
          <h2 className="mb-3 text-sm font-bold text-forest-darkest">Items</h2>
          {b.items.length === 0 ? (
            <p className="text-sm text-neutralgray">No items.</p>
          ) : (
            <div className="space-y-3">
              {b.items.map((it) => (
                <div
                  key={it.id}
                  className="rounded-xl border border-mint/30 p-3"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="text-xs text-neutralgray">
                      [{it.item_type}] {it.item_id} · line{" "}
                      <span className="font-medium text-forest-dark">
                        {formatMoney(Number(it.line_total), b.currency)}
                      </span>
                    </span>
                    {/* Eigenes Form fürs Löschen (kann nicht im Edit-Form liegen). */}
                    <form action={deleteBookingItem}>
                      <input type="hidden" name="id" value={it.id} />
                      <input type="hidden" name="booking_id" value={b.id} />
                      <button
                        type="submit"
                        className="text-xs font-medium text-danger hover:underline"
                        aria-label={`Delete item ${it.title}`}
                      >
                        Delete
                      </button>
                    </form>
                  </div>

                  <form
                    action={updateBookingItem}
                    className="flex flex-wrap items-end gap-3"
                  >
                    <input type="hidden" name="id" value={it.id} />
                    <input type="hidden" name="booking_id" value={b.id} />
                    <label className="flex flex-1 flex-col text-xs font-medium text-neutralgray">
                      Title
                      <input
                        type="text"
                        name="title"
                        required
                        defaultValue={it.title}
                        className="mt-1 min-w-[12rem] rounded-lg border border-mint/60 px-3 py-1.5 text-sm text-forest-dark focus:border-forest-highland focus:outline-none focus:ring-1 focus:ring-forest-highland"
                      />
                    </label>
                    <label className="flex flex-col text-xs font-medium text-neutralgray">
                      Qty
                      <input
                        type="number"
                        name="quantity"
                        min={1}
                        step={1}
                        defaultValue={it.quantity}
                        className="mt-1 w-20 rounded-lg border border-mint/60 px-3 py-1.5 text-sm text-forest-dark focus:border-forest-highland focus:outline-none focus:ring-1 focus:ring-forest-highland"
                      />
                    </label>
                    <label className="flex flex-col text-xs font-medium text-neutralgray">
                      Unit price ({b.currency})
                      <input
                        type="number"
                        name="unit_price"
                        min={0}
                        step="0.01"
                        defaultValue={Number(it.unit_price)}
                        className="mt-1 w-28 rounded-lg border border-mint/60 px-3 py-1.5 text-sm text-forest-dark focus:border-forest-highland focus:outline-none focus:ring-1 focus:ring-forest-highland"
                      />
                    </label>
                    <button
                      type="submit"
                      className="rounded-full bg-forest-highland px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-forest-dark"
                    >
                      Save
                    </button>
                  </form>
                </div>
              ))}
              <p className="text-xs text-neutralgray">
                Line total = qty × unit price; the booking total updates
                automatically on save or delete.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Überschneidungen */}
      <div className="mt-4 rounded-2xl bg-white p-5 shadow-card">
        <h2 className="mb-3 text-sm font-bold text-forest-darkest">
          Overlaps ({overlapping.length})
        </h2>
        {overlapping.length === 0 ? (
          <p className="text-sm text-neutralgray">
            No other active bookings in this date range.
          </p>
        ) : (
          <ul className="divide-y divide-mint/20">
            {overlapping.map((o) => (
              <li
                key={o.id}
                className="flex items-center justify-between gap-3 py-2 text-sm"
              >
                <Link
                  href={`/admin/bookings/${o.id}`}
                  className="font-medium text-forest-highland hover:underline"
                >
                  {o.guest_name ?? "—"}
                </Link>
                <span className="text-neutralgray">
                  {formatDate(o.start_date)} → {formatDate(o.end_date)}
                </span>
                <span className="text-forest-dark">{o.party_size} pax</span>
                <StatusBadge status={o.status} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
