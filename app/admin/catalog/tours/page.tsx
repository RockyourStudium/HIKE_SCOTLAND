import Link from "next/link";
import { listTours } from "@/lib/admin/catalog";
import { PageHeading, formatMoney } from "@/components/admin/ui";
import CatalogTable from "@/components/admin/CatalogTable";
import { toggleTour, deleteTour } from "./actions";

export const dynamic = "force-dynamic";

const BANNERS: Record<string, { tone: string; text: string }> = {
  saved: { tone: "ok", text: "Tour saved." },
  deleted: { tone: "ok", text: "Tour deleted." },
  db: { tone: "err", text: "Database error — please try again." },
};

export default async function ToursListPage({
  searchParams,
}: {
  searchParams: { ok?: string; err?: string };
}) {
  const tours = await listTours();
  const banner = BANNERS[searchParams.ok ?? ""] ?? BANNERS[searchParams.err ?? ""];

  return (
    <>
      <PageHeading
        title="Tours"
        subtitle={`${tours.length} tour${tours.length === 1 ? "" : "s"}`}
        action={
          <Link
            href="/admin/catalog/tours/new"
            className="rounded-full bg-forest-highland px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-forest-dark"
          >
            + New tour
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
        basePath="/admin/catalog/tours"
        toggleAction={toggleTour}
        deleteAction={deleteTour}
        items={tours.map((t) => ({
          id: t.id,
          name: t.name,
          active: t.active,
          meta: `${t.region} · ${t.difficulty} · ${t.days}d · ${formatMoney(
            Number(t.price_per_person),
          )}${t.guided ? " · guided" : ""}`,
        }))}
      />
    </>
  );
}
