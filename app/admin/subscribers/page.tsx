import {
  listSubscribers,
  SUBSCRIBER_STATUSES,
} from "@/lib/admin/queries";
import {
  PageHeading,
  StatusBadge,
  formatDate,
} from "@/components/admin/ui";
import AutoSubmitSelect from "@/components/admin/AutoSubmitSelect";
import {
  addSubscriber,
  updateSubscriberStatus,
  deleteSubscriber,
} from "./actions";

export const dynamic = "force-dynamic";

const BANNERS: Record<string, { tone: string; text: string }> = {
  added: { tone: "ok", text: "Subscriber added." },
  deleted: { tone: "ok", text: "Subscriber deleted." },
  email: { tone: "err", text: "Invalid email address." },
  dup: { tone: "err", text: "This email is already on the list." },
  db: { tone: "err", text: "Database error — please try again." },
};

export default async function SubscribersPage({
  searchParams,
}: {
  searchParams: { q?: string; status?: string; ok?: string; err?: string };
}) {
  const q = searchParams.q ?? "";
  const status = searchParams.status ?? "all";
  const subs = await listSubscribers({ q, status });

  const banner =
    BANNERS[searchParams.ok ?? ""] ?? BANNERS[searchParams.err ?? ""];

  return (
    <>
      <PageHeading
        title="Newsletter"
        subtitle={`${subs.length} subscriber${subs.length === 1 ? "" : "s"} shown`}
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

      {/* Anlegen */}
      <form
        action={addSubscriber}
        className="mb-6 flex flex-wrap items-end gap-3 rounded-2xl bg-white p-4 shadow-card"
      >
        <label className="flex flex-col text-xs font-medium text-neutralgray">
          Email *
          <input
            type="email"
            name="email"
            required
            placeholder="name@example.com"
            className="mt-1 w-56 rounded-lg border border-mint/60 px-3 py-1.5 text-sm text-forest-dark focus:border-forest-highland focus:outline-none focus:ring-1 focus:ring-forest-highland"
          />
        </label>
        <label className="flex flex-col text-xs font-medium text-neutralgray">
          First name
          <input
            type="text"
            name="first_name"
            className="mt-1 w-40 rounded-lg border border-mint/60 px-3 py-1.5 text-sm text-forest-dark focus:border-forest-highland focus:outline-none focus:ring-1 focus:ring-forest-highland"
          />
        </label>
        <label className="flex flex-col text-xs font-medium text-neutralgray">
          Status
          <select
            name="status"
            defaultValue="subscribed"
            className="mt-1 rounded-lg border border-mint/60 bg-white px-3 py-1.5 text-sm text-forest-dark focus:border-forest-highland focus:outline-none focus:ring-1 focus:ring-forest-highland"
          >
            {SUBSCRIBER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="rounded-full bg-forest-highland px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-forest-dark"
        >
          Add
        </button>
      </form>

      {/* Filter / Suche (GET) */}
      <form method="get" className="mb-4 flex flex-wrap items-center gap-2">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search email…"
          className="w-56 rounded-lg border border-mint/60 px-3 py-1.5 text-sm text-forest-dark focus:border-forest-highland focus:outline-none focus:ring-1 focus:ring-forest-highland"
        />
        <select
          name="status"
          defaultValue={status}
          className="rounded-lg border border-mint/60 bg-white px-3 py-1.5 text-sm text-forest-dark focus:border-forest-highland focus:outline-none focus:ring-1 focus:ring-forest-highland"
        >
          <option value="all">All statuses</option>
          {SUBSCRIBER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-full border border-forest-highland px-4 py-1.5 text-sm font-medium text-forest-highland hover:bg-fog"
        >
          Filter
        </button>
      </form>

      {/* Tabelle */}
      <div className="overflow-x-auto rounded-2xl bg-white shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-mint/40 text-xs uppercase tracking-wide text-neutralgray">
            <tr>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">First name</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Source</th>
              <th className="px-4 py-3 font-medium">Signed up</th>
              <th className="px-4 py-3 font-medium">Change</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-mint/20">
            {subs.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-neutralgray">
                  No subscribers found.
                </td>
              </tr>
            ) : (
              subs.map((s) => (
                <tr key={s.id} className="hover:bg-fog/40">
                  <td className="px-4 py-3 font-medium text-forest-darkest">
                    {s.email}
                  </td>
                  <td className="px-4 py-3 text-forest-dark">
                    {s.first_name ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={s.status} />
                  </td>
                  <td className="px-4 py-3 text-neutralgray">{s.source ?? "—"}</td>
                  <td className="px-4 py-3 text-neutralgray">
                    {formatDate(s.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <AutoSubmitSelect
                      action={updateSubscriberStatus}
                      id={s.id}
                      value={s.status}
                      options={SUBSCRIBER_STATUSES}
                      ariaLabel={`Change status for ${s.email}`}
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <form action={deleteSubscriber}>
                      <input type="hidden" name="id" value={s.id} />
                      <button
                        type="submit"
                        className="text-xs font-medium text-danger hover:underline"
                        aria-label={`Delete ${s.email}`}
                      >
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
