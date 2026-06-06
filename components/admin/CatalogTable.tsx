import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface CatalogRow {
  id: string;
  name: string;
  active: boolean;
  /** Kompakte entity-spezifische Infozeile, z.B. "Highlands · Moderate · £450". */
  meta: string;
}

/**
 * Einheitliche Katalog-Liste für Tours/Routes/Stays. Name verlinkt aufs
 * Bearbeiten-Formular; pro Zeile Aktiv-Umschalter und Löschen.
 */
export default function CatalogTable({
  basePath,
  items,
  toggleAction,
  deleteAction,
}: {
  basePath: string;
  items: CatalogRow[];
  toggleAction: (formData: FormData) => void | Promise<void>;
  deleteAction: (formData: FormData) => void | Promise<void>;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-card">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-mint/40 text-xs uppercase tracking-wide text-neutralgray">
          <tr>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Details</th>
            <th className="px-4 py-3 font-medium">Active</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-mint/20">
          {items.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-4 py-8 text-center text-neutralgray">
                Nothing here yet.
              </td>
            </tr>
          ) : (
            items.map((it) => (
              <tr key={it.id} className="align-top hover:bg-fog/40">
                <td className="px-4 py-3">
                  <Link
                    href={`${basePath}/${it.id}`}
                    className="group inline-flex items-center gap-1 font-medium text-forest-highland underline decoration-mint decoration-2 underline-offset-2 hover:decoration-forest-highland"
                  >
                    {it.name}
                    <ChevronRight
                      className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </Link>
                  <div className="text-xs text-neutralgray">{it.id}</div>
                </td>
                <td className="px-4 py-3 text-forest-dark">{it.meta}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      it.active
                        ? "bg-fog text-forest-dark"
                        : "bg-neutral-100 text-neutralgray"
                    }`}
                  >
                    {it.active ? "active" : "inactive"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`${basePath}/${it.id}`}
                      className="text-xs font-medium text-forest-highland hover:underline"
                    >
                      Edit
                    </Link>
                    <form action={toggleAction}>
                      <input type="hidden" name="id" value={it.id} />
                      <input
                        type="hidden"
                        name="active"
                        value={it.active ? "false" : "true"}
                      />
                      <button
                        type="submit"
                        className="text-xs font-medium text-neutralgray hover:underline"
                      >
                        {it.active ? "Deactivate" : "Activate"}
                      </button>
                    </form>
                    <form action={deleteAction}>
                      <input type="hidden" name="id" value={it.id} />
                      <button
                        type="submit"
                        className="text-xs font-medium text-danger hover:underline"
                        aria-label={`Delete ${it.name}`}
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
