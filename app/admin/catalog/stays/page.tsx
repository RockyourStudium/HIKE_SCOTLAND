import Link from "next/link";
import { listStays } from "@/lib/admin/catalog";
import { PageHeading, formatMoney } from "@/components/admin/ui";
import CatalogTable from "@/components/admin/CatalogTable";
import { toggleStay, deleteStay } from "./actions";

export const dynamic = "force-dynamic";

const BANNERS: Record<string, { tone: string; text: string }> = {
  saved: { tone: "ok", text: "Stay saved." },
  deleted: { tone: "ok", text: "Stay deleted." },
  db: { tone: "err", text: "Database error — please try again." },
};

export default async function StaysListPage({
  searchParams,
}: {
  searchParams: { ok?: string; err?: string };
}) {
  const stays = await listStays();
  const banner = BANNERS[searchParams.ok ?? ""] ?? BANNERS[searchParams.err ?? ""];

  return (
    <>
      <PageHeading
        title="Stays"
        subtitle={`${stays.length} stay${stays.length === 1 ? "" : "s"}`}
        action={
          <Link
            href="/admin/catalog/stays/new"
            className="rounded-full bg-forest-highland px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-forest-dark"
          >
            + New stay
          </Link>
        }
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

      <CatalogTable
        basePath="/admin/catalog/stays"
        toggleAction={toggleStay}
        deleteAction={deleteStay}
        items={stays.map((s) => ({
          id: s.id,
          name: s.name,
          active: s.active,
          meta: `${s.type} · ${s.region} · ${formatMoney(
            Number(s.price_per_night),
          )}/night · ★${s.rating}`,
        }))}
      />
    </>
  );
}
