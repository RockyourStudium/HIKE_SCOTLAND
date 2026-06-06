import type { Metadata } from "next";
import AdminNav from "@/components/admin/AdminNav";

export const metadata: Metadata = {
  title: "Admin — Hike Scotland",
  robots: { index: false, follow: false },
};

// Funktionale (helle) Oberfläche — bewusst getrennt vom dunklen Marketing-Look.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-fog">
      <header className="border-b border-mint/40 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <span className="font-display text-lg font-bold text-forest-darkest">
            Hike Scotland · Admin
          </span>
          <AdminNav />
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</div>
    </div>
  );
}
