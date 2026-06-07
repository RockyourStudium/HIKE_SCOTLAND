import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { listProfiles, ROLES } from "@/lib/admin/queries";
import { PageHeading, formatDate } from "@/components/admin/ui";
import { updateProfileRole } from "./actions";

export const dynamic = "force-dynamic";

const BANNERS: Record<string, { tone: string; text: string }> = {
  role: { tone: "ok", text: "Role updated." },
  saved: { tone: "ok", text: "Profile saved." },
  self: { tone: "err", text: "You can’t remove your own admin role." },
  db: { tone: "err", text: "Database error — please try again." },
};

function RoleBadge({ role }: { role: string }) {
  const admin = role === "admin";
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${
        admin ? "bg-forest-highland text-white" : "bg-neutral-100 text-neutralgray"
      }`}
    >
      {role}
    </span>
  );
}

export default async function ProfilesPage({
  searchParams,
}: {
  searchParams: { q?: string; role?: string; ok?: string; err?: string };
}) {
  const q = (searchParams.q ?? "").trim();
  const role = searchParams.role ?? "all";
  const profiles = await listProfiles({ q, role });
  const filtered = q !== "" || role !== "all";

  const banner =
    BANNERS[searchParams.ok ?? ""] ?? BANNERS[searchParams.err ?? ""];

  return (
    <>
      <PageHeading
        title="Profiles"
        subtitle={`${profiles.length} user${profiles.length === 1 ? "" : "s"} shown`}
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

      {/* Filter / Suche (GET) */}
      <form method="get" className="mb-4 flex flex-wrap items-center gap-2">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search name or email…"
          className="w-56 rounded-lg border border-mint/60 px-3 py-1.5 text-sm text-forest-dark focus:border-forest-highland focus:outline-none focus:ring-1 focus:ring-forest-highland"
        />
        <select
          name="role"
          defaultValue={role}
          className="rounded-lg border border-mint/60 bg-white px-3 py-1.5 text-sm text-forest-dark focus:border-forest-highland focus:outline-none focus:ring-1 focus:ring-forest-highland"
        >
          <option value="all">All roles</option>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
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
            href="/admin/profiles"
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
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Bookings</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium">Change role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mint/20">
            {profiles.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-neutralgray">
                  {filtered ? "No profiles match the filter." : "No profiles yet."}
                </td>
              </tr>
            ) : (
              profiles.map((p) => (
                <tr key={p.id} className="hover:bg-fog/40">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/profiles/${p.id}`}
                      className="group inline-flex items-center gap-1 font-medium text-forest-highland underline decoration-mint decoration-2 underline-offset-2 hover:decoration-forest-highland"
                    >
                      {p.name ?? "—"}
                      <ChevronRight
                        className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-forest-dark">{p.email ?? "—"}</td>
                  <td className="px-4 py-3 text-neutralgray">{p.phone ?? "—"}</td>
                  <td className="px-4 py-3">
                    <RoleBadge role={p.role} />
                  </td>
                  <td className="px-4 py-3 text-forest-dark">{p.bookingCount}</td>
                  <td className="px-4 py-3 text-neutralgray">
                    {formatDate(p.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <form action={updateProfileRole}>
                      <input type="hidden" name="id" value={p.id} />
                      <input
                        type="hidden"
                        name="role"
                        value={p.role === "admin" ? "user" : "admin"}
                      />
                      <button
                        type="submit"
                        className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                          p.role === "admin"
                            ? "border border-mint/60 text-forest-dark hover:bg-fog"
                            : "bg-forest-highland text-white hover:bg-forest-dark"
                        }`}
                      >
                        {p.role === "admin" ? "Make user" : "Make admin"}
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
