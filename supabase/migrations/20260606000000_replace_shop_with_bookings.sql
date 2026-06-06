-- =============================================================================
-- Umbau: generisches Shop-Modell -> Buchung selbst zusammengestellter Touren
-- =============================================================================
-- Katalog (Tours/Stays/Routes) liegt statisch in data/*.ts (NICHT in der DB).
-- Buchungsposten & Reviews verweisen daher per Text-ID (item_id/subject_id) auf
-- diese statischen Einträge — kein FK auf eine Katalog-Tabelle.
--
-- Entscheidungen: Snapshot beim Buchen (booking + booking_items mit
-- eingefrorenen Preisen) · Tours+Stays+Routes als Posten · Shop-Tabellen ersetzt
-- · reviews polymorph · tour_departures mit Terminen/Kapazität.
-- =============================================================================

-- 1) Altes Shop-Schema entfernen (nur Seed-Daten enthalten) -------------------
drop table if exists public.order_items cascade;
drop table if exists public.orders      cascade;
drop table if exists public.reviews     cascade;  -- wird polymorph neu gebaut
drop table if exists public.products    cascade;

-- 2) tour_departures: konkrete Abreisetermine je Tour mit Kapazität -----------
create table public.tour_departures (
  id               uuid primary key default gen_random_uuid(),
  tour_id          text not null,                 -- statische Katalog-ID (data/tours.ts)
  departure_date   date not null,
  capacity         integer not null check (capacity >= 0),
  seats_remaining  integer not null check (seats_remaining >= 0),
  price_per_person numeric(10,2),                 -- optionaler Override (sonst Katalogpreis)
  status           text not null default 'scheduled'
                     check (status in ('scheduled','weather_hold','cancelled','completed')),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (tour_id, departure_date),
  check (seats_remaining <= capacity)
);
create index tour_departures_tour_id_idx on public.tour_departures (tour_id);
create index tour_departures_date_idx    on public.tour_departures (departure_date);
create index tour_departures_status_idx  on public.tour_departures (status);
create trigger tour_departures_set_updated_at
  before update on public.tour_departures
  for each row execute function public.set_updated_at();

-- 3) bookings: eine gebuchte, selbst zusammengestellte Tour -------------------
create table public.bookings (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.profiles (id) on delete cascade,
  status         text not null default 'pending'
                   check (status in ('pending','confirmed','completed','cancelled','no_show')),
  payment_status text not null default 'unpaid'
                   check (payment_status in ('unpaid','paid','failed','refunded','partially_refunded')),
  start_date     date,
  end_date       date,
  party_size     integer not null default 1 check (party_size > 0),
  total          numeric(10,2) not null default 0 check (total >= 0),
  currency       text not null default 'GBP',
  notes          text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index bookings_user_id_idx        on public.bookings (user_id);
create index bookings_status_idx         on public.bookings (status);
create index bookings_payment_status_idx on public.bookings (payment_status);
create index bookings_created_at_idx     on public.bookings (created_at desc);
create trigger bookings_set_updated_at
  before update on public.bookings
  for each row execute function public.set_updated_at();

-- 4) booking_items: eingefrorener Snapshot der Posten zum Buchungszeitpunkt ---
create table public.booking_items (
  id                uuid primary key default gen_random_uuid(),
  booking_id        uuid not null references public.bookings (id) on delete cascade,
  item_type         text not null check (item_type in ('tour','stay','route')),
  item_id           text not null,                 -- statische Katalog-ID
  title             text not null,                 -- Name-Snapshot
  tour_departure_id uuid references public.tour_departures (id) on delete set null,
  quantity          integer not null default 1 check (quantity > 0),  -- z.B. Personen / Nächte
  unit_price        numeric(10,2) not null check (unit_price >= 0),   -- Preis eingefroren
  line_total        numeric(10,2) not null check (line_total >= 0),
  position          integer,                       -- Reihenfolge im Itinerary
  created_at        timestamptz not null default now()
);
create index booking_items_booking_id_idx on public.booking_items (booking_id);
create index booking_items_item_idx       on public.booking_items (item_type, item_id);
create index booking_items_departure_idx  on public.booking_items (tour_departure_id);

-- 5) reviews: polymorph (tour|stay|route) statt produktbezogen ----------------
create table public.reviews (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles (id) on delete cascade,
  subject_type text not null check (subject_type in ('tour','stay','route')),
  subject_id   text not null,                      -- statische Katalog-ID
  rating       integer not null check (rating between 1 and 5),
  body         text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (user_id, subject_type, subject_id)       -- eine Review pro Nutzer & Objekt
);
create index reviews_subject_idx on public.reviews (subject_type, subject_id);
create index reviews_rating_idx  on public.reviews (rating);
create trigger reviews_set_updated_at
  before update on public.reviews
  for each row execute function public.set_updated_at();

-- 6) Row Level Security -------------------------------------------------------
alter table public.tour_departures enable row level security;
alter table public.bookings        enable row level security;
alter table public.booking_items   enable row level security;
alter table public.reviews         enable row level security;

-- tour_departures: öffentlich lesbar (Verfügbarkeit anzeigen); Schreiben nur service_role
create policy "tour_departures: public read"
  on public.tour_departures for select using (true);

-- bookings: nur eigene
create policy "bookings: read own"   on public.bookings for select using (auth.uid() = user_id);
create policy "bookings: insert own" on public.bookings for insert with check (auth.uid() = user_id);
create policy "bookings: update own" on public.bookings for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- booking_items: sichtbar/anlegbar, wenn die Buchung dem Nutzer gehört
create policy "booking_items: read via own booking"
  on public.booking_items for select
  using (exists (select 1 from public.bookings b where b.id = booking_items.booking_id and b.user_id = auth.uid()));
create policy "booking_items: insert via own booking"
  on public.booking_items for insert
  with check (exists (select 1 from public.bookings b where b.id = booking_items.booking_id and b.user_id = auth.uid()));

-- reviews: öffentlich lesbar; nur eigene schreiben
create policy "reviews: public read"  on public.reviews for select using (true);
create policy "reviews: insert own"   on public.reviews for insert with check (auth.uid() = user_id);
create policy "reviews: update own"   on public.reviews for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "reviews: delete own"   on public.reviews for delete using (auth.uid() = user_id);

-- 7) Seed: ein paar Abreisetermine für bestehende Touren ----------------------
insert into public.tour_departures (tour_id, departure_date, capacity, seats_remaining, price_per_person) values
  ('skye-explorer',               '2026-07-13', 12, 12, 720.00),
  ('skye-explorer',               '2026-08-10', 12,  8, 720.00),
  ('cairngorms-wild-weekend',     '2026-07-04', 10, 10, 480.00),
  ('cairngorms-wild-weekend',     '2026-09-05', 10,  6, 480.00),
  ('glencoe-photography',         '2026-07-18',  8,  8, 340.00),
  ('west-highland-way-supported', '2026-08-01', 16, 16, 950.00)
on conflict (tour_id, departure_date) do nothing;
