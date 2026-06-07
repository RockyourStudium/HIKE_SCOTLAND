import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import type { Tables } from "@/types/database.types";

// Server-only Admin-Lesezugriff. Läuft ausschließlich in Server Components /
// Server Actions über den service_role-Key (umgeht RLS). NIE clientseitig
// importieren — `server-only` lässt einen solchen Build sofort scheitern.

export type Subscriber = Tables<"subscribers">;
export type Booking = Tables<"bookings">;
export type BookingItem = Tables<"booking_items">;
export type Profile = Tables<"profiles">;

export const ROLES = ["user", "admin"] as const;
export type RoleValue = (typeof ROLES)[number];

export type SubscriberStatus = "pending" | "subscribed" | "unsubscribed";
export const SUBSCRIBER_STATUSES: SubscriberStatus[] = [
  "subscribed",
  "pending",
  "unsubscribed",
];

export const BOOKING_STATUSES = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
  "no_show",
] as const;
export const PAYMENT_STATUSES = [
  "unpaid",
  "paid",
  "failed",
  "refunded",
  "partially_refunded",
] as const;

const DAY_MS = 86_400_000;

// --- Übersicht / Kennzahlen --------------------------------------------------

export interface Overview {
  subscribers: {
    total: number;
    byStatus: Record<string, number>;
    last30d: number;
  };
  bookings: {
    total: number;
    byStatus: Record<string, number>;
    revenue: number; // Σ total, ohne stornierte
    currency: string;
    upcoming: number; // start_date >= heute, nicht storniert
    last30d: number;
  };
  topItems: { item_type: string; item_id: string; title: string; count: number }[];
}

export async function getOverview(): Promise<Overview> {
  const admin = getSupabaseAdmin();
  const since = new Date(Date.now() - 30 * DAY_MS).toISOString();
  const today = new Date().toISOString().slice(0, 10);

  const [subs, books, items] = await Promise.all([
    admin.from("subscribers").select("status, created_at"),
    admin
      .from("bookings")
      .select("status, total, currency, start_date, created_at"),
    admin.from("booking_items").select("item_type, item_id, title, quantity"),
  ]);

  if (subs.error) throw subs.error;
  if (books.error) throw books.error;
  if (items.error) throw items.error;

  const subRows = subs.data ?? [];
  const subByStatus: Record<string, number> = {};
  for (const s of subRows) subByStatus[s.status] = (subByStatus[s.status] ?? 0) + 1;

  const bookRows = books.data ?? [];
  const bookByStatus: Record<string, number> = {};
  let revenue = 0;
  let upcoming = 0;
  let bookLast30 = 0;
  for (const b of bookRows) {
    bookByStatus[b.status] = (bookByStatus[b.status] ?? 0) + 1;
    if (b.status !== "cancelled") revenue += Number(b.total ?? 0);
    if (b.status !== "cancelled" && b.start_date && b.start_date >= today)
      upcoming += 1;
    if (b.created_at >= since) bookLast30 += 1;
  }

  // Top-Items nach Personen/Nächten (quantity), absteigend.
  const itemMap = new Map<
    string,
    { item_type: string; item_id: string; title: string; count: number }
  >();
  for (const it of items.data ?? []) {
    const key = `${it.item_type}:${it.item_id}`;
    const cur =
      itemMap.get(key) ??
      { item_type: it.item_type, item_id: it.item_id, title: it.title, count: 0 };
    cur.count += Number(it.quantity ?? 0);
    cur.title = it.title; // jüngster Titel-Snapshot
    itemMap.set(key, cur);
  }
  const topItems = Array.from(itemMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  return {
    subscribers: {
      total: subRows.length,
      byStatus: subByStatus,
      last30d: subRows.filter((s) => s.created_at >= since).length,
    },
    bookings: {
      total: bookRows.length,
      byStatus: bookByStatus,
      revenue,
      currency: bookRows[0]?.currency ?? "GBP",
      upcoming,
      last30d: bookLast30,
    },
    topItems,
  };
}

// --- Newsletter --------------------------------------------------------------

export async function listSubscribers(opts: {
  q?: string;
  status?: string;
}): Promise<Subscriber[]> {
  const admin = getSupabaseAdmin();
  let query = admin
    .from("subscribers")
    .select("*")
    .order("created_at", { ascending: false });

  if (opts.status && opts.status !== "all") query = query.eq("status", opts.status);
  if (opts.q) query = query.ilike("email", `%${opts.q}%`);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

// --- Buchungen ---------------------------------------------------------------

export interface BookingWithMeta extends Booking {
  items: BookingItem[];
  overlapCount: number; // wie viele andere (nicht-stornierte) Buchungen das Datumsfenster schneiden
}

function overlaps(a: Booking, b: Booking): boolean {
  if (!a.start_date || !a.end_date || !b.start_date || !b.end_date) return false;
  return a.start_date <= b.end_date && a.end_date >= b.start_date;
}

export async function listBookings(): Promise<BookingWithMeta[]> {
  const admin = getSupabaseAdmin();
  const [books, items] = await Promise.all([
    admin.from("bookings").select("*").order("created_at", { ascending: false }),
    admin.from("booking_items").select("*"),
  ]);
  if (books.error) throw books.error;
  if (items.error) throw items.error;

  const rows = books.data ?? [];
  const itemsByBooking = new Map<string, BookingItem[]>();
  for (const it of items.data ?? []) {
    const list = itemsByBooking.get(it.booking_id) ?? [];
    list.push(it);
    itemsByBooking.set(it.booking_id, list);
  }

  const active = rows.filter((b) => b.status !== "cancelled");
  return rows.map((b) => {
    const overlapCount =
      b.status === "cancelled"
        ? 0
        : active.filter((o) => o.id !== b.id && overlaps(b, o)).length;
    const its = (itemsByBooking.get(b.id) ?? []).sort(
      (x, y) => (x.position ?? 0) - (y.position ?? 0),
    );
    return { ...b, items: its, overlapCount };
  });
}

// --- Profile / Nutzer --------------------------------------------------------

export interface ProfileWithMeta extends Profile {
  bookingCount: number;
}

export async function listProfiles(opts: {
  q?: string;
  role?: string;
}): Promise<ProfileWithMeta[]> {
  const admin = getSupabaseAdmin();
  let query = admin
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (opts.role && opts.role !== "all") query = query.eq("role", opts.role);
  if (opts.q) {
    const like = `%${opts.q}%`;
    query = query.or(`name.ilike.${like},email.ilike.${like}`);
  }

  const { data, error } = await query;
  if (error) throw error;
  const rows = data ?? [];

  // Buchungen pro Nutzer zählen.
  const { data: books } = await admin.from("bookings").select("user_id");
  const counts = new Map<string, number>();
  for (const b of books ?? []) {
    if (b.user_id) counts.set(b.user_id, (counts.get(b.user_id) ?? 0) + 1);
  }

  return rows.map((p) => ({ ...p, bookingCount: counts.get(p.id) ?? 0 }));
}

export async function getProfile(id: string): Promise<ProfileWithMeta | null> {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;

  const { count } = await admin
    .from("bookings")
    .select("id", { count: "exact", head: true })
    .eq("user_id", id);

  return { ...data, bookingCount: count ?? 0 };
}

export async function getBooking(
  id: string,
): Promise<{ booking: BookingWithMeta; overlapping: Booking[] } | null> {
  const all = await listBookings();
  const booking = all.find((b) => b.id === id);
  if (!booking) return null;
  const overlapping = all.filter(
    (o) => o.id !== id && o.status !== "cancelled" && overlaps(booking, o),
  );
  return { booking, overlapping };
}
