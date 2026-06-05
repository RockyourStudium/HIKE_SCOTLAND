import type { Metadata } from "next";
import UnsubscribeClient from "@/components/UnsubscribeClient";

export const metadata: Metadata = {
  title: "Newsletter abmelden",
  robots: { index: false, follow: false },
};

export default function UnsubscribePage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl items-center px-4 py-16">
      <div className="w-full rounded-2xl border border-mist/40 p-8 shadow-sm">
        <UnsubscribeClient token={searchParams.token ?? ""} />
      </div>
    </main>
  );
}
