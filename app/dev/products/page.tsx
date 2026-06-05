import { getAllProducts } from "@/lib/products";

// Immer frisch aus der DB laden (kein statisches Caching während des Tests).
export const dynamic = "force-dynamic";

export default async function DevProductsPage() {
  const products = await getAllProducts();

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-3xl text-forest-darkest">
        DB-Test: Produkte
      </h1>
      <p className="mt-2 text-sm text-forest-dark">
        {products.length} Produkt(e) live aus Supabase geladen.
      </p>

      <ul className="mt-8 space-y-4">
        {products.map((p) => (
          <li
            key={p.id}
            className="rounded-lg border border-mist/40 p-4 shadow-sm"
          >
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="font-display text-lg text-forest-darkest">
                {p.name}
              </h2>
              <span className="whitespace-nowrap font-medium text-forest-highland">
                {new Intl.NumberFormat("de-DE", {
                  style: "currency",
                  currency: "EUR",
                }).format(p.price)}
              </span>
            </div>
            {p.description && (
              <p className="mt-1 text-sm text-forest-dark">{p.description}</p>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
