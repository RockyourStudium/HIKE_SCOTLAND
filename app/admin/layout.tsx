import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import AdminNav from "@/components/admin/AdminNav";
import SignOutButton from "@/components/SignOutButton";
import { getUserWithRole } from "@/lib/auth/roles";

export const metadata: Metadata = {
  title: "Admin — Hike Scotland",
  robots: { index: false, follow: false },
};

// Funktionale (helle) Oberfläche — bewusst getrennt vom dunklen Marketing-Look.
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Defense-in-Depth: Die Middleware gated /admin bereits, hier wird die
  // Admin-Rolle server-seitig erneut geprüft (404 statt Datenleck).
  const { user, role } = await getUserWithRole();
  if (!user || role !== "admin") notFound();

  return (
    <div className="min-h-screen bg-fog">
      <header className="border-b border-mint/40 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="font-display text-lg font-bold text-forest-darkest transition-colors hover:text-forest-highland"
          >
            Hike Scotland · Admin
          </Link>
          <div className="flex flex-wrap items-center gap-4">
            <AdminNav />
            <div className="flex items-center gap-3 border-l border-mint/40 pl-4">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-forest-highland hover:underline"
              >
                <ExternalLink aria-hidden className="h-4 w-4" strokeWidth={2} />
                View site
              </Link>
              <span className="hidden text-sm text-neutralgray sm:inline">
                {user.email}
              </span>
              <SignOutButton />
            </div>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</div>
    </div>
  );
}
