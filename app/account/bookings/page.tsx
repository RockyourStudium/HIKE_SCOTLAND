import Link from "next/link";
import { redirect } from "next/navigation";
import Container from "@/components/Container";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatMoney, StatusBadge } from "@/components/admin/ui";
import type { Tables } from "@/types/database.types";

export const dynamic = "force-dynamic";

type BookingItem = Tables<"booking_items">;

export default async function MyBookingsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/?auth_required=1");

  // RLS „read own" filtert serverseitig auf eigene Buchungen.
  const { data: bookings } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  const ids = (bookings ?? []).map((b) => b.id);
  const itemsByBooking = new Map<string, BookingItem[]>();
  if (ids.length > 0) {
    const { data: items } = await supabase
      .from("booking_items")
      .select("*")
      .in("booking_id", ids);
    for (const it of items ?? []) {
      const list = itemsByBooking.get(it.booking_id) ?? [];
      list.push(it);
      itemsByBooking.set(it.booking_id, list);
    }
  }

  return (
    <Container size="3xl" py="compact">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-forest-darkest">
            My Bookings
          </h1>
          <p className="mt-1 text-sm text-neutralgray">
            All the trips linked to your account.
          </p>
        </div>
        <Link
          href="/account"
          className="text-sm font-medium text-forest-highland hover:underline"
        >
          ← My Account
        </Link>
      </div>

      {(bookings ?? []).length === 0 ? (
        <div className="mt-10 rounded-2xl bg-white p-10 text-center shadow-card">
          <p className="text-neutralgray">No bookings yet.</p>
          <Link
            href="/plan"
            className="mt-4 inline-block font-medium text-forest-highland hover:underline"
          >
            Plan a trip →
          </Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {(bookings ?? []).map((b) => {
            const items = (itemsByBooking.get(b.id) ?? []).sort(
              (x, y) => (x.position ?? 0) - (y.position ?? 0),
            );
            return (
              <li key={b.id} className="rounded-2xl bg-white p-5 shadow-card">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-sm text-neutralgray">
                    {formatDate(b.start_date)} → {formatDate(b.end_date)}
                    <span className="mx-2">·</span>
                    {b.party_size} {b.party_size === 1 ? "guest" : "guests"}
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={b.status} />
                    <StatusBadge status={b.payment_status} />
                  </div>
                </div>

                {items.length > 0 && (
                  <ul className="mt-3 space-y-0.5 text-sm text-forest-dark">
                    {items.map((it) => (
                      <li key={it.id}>
                        <span className="text-neutralgray">[{it.item_type}]</span>{" "}
                        {it.title}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-3 border-t border-mint/30 pt-3 text-right text-sm font-medium text-forest-dark">
                  {formatMoney(Number(b.total), b.currency)}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Container>
  );
}
