import Link from "next/link";
import { listRoutes } from "@/lib/admin/catalog";
import { PageHeading } from "@/components/admin/ui";
import CatalogTable from "@/components/admin/CatalogTable";
import { toggleRoute, deleteRoute } from "./actions";

export const dynamic = "force-dynamic";

const BANNERS: Record<string, { tone: string; text: string }> = {
  saved: { tone: "ok", text: "Route saved." },
  deleted: { tone: "ok", text: "Route deleted." },
  db: { tone: "err", text: "Database error — please try again." },
};

export default async function RoutesListPage({
  searchParams,
}: {
  searchParams: { ok?: string; err?: string };
}) {
  const routes = await listRoutes();
  const banner = BANNERS[searchParams.ok ?? ""] ?? BANNERS[searchParams.err ?? ""];

  return (
    <>
      <PageHeading
        title="Routes"
        subtitle={`${routes.length} route${routes.length === 1 ? "" : "s"}`}
        action={
          <Link
            href="/admin/catalog/routes/new"
            className="rounded-full bg-forest-highland px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-forest-dark"
          >
            + New route
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
        basePath="/admin/catalog/routes"
        toggleAction={toggleRoute}
        deleteAction={deleteRoute}
        items={routes.map((r) => ({
          id: r.id,
          name: r.name,
          active: r.active,
          meta: `${r.region} · ${r.difficulty} · ${r.distance_km} km · ${r.days}d`,
        }))}
      />
    </>
  );
}
