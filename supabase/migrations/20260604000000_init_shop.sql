-- =============================================================================
-- HIKE_SCOTLAND — Shop-Schema (Supabase / PostgreSQL)
-- =============================================================================
-- Auth-Modell: Supabase Auth (auth.users) + öffentliche `profiles`-Tabelle.
--   -> Passwörter verwaltet Supabase selbst (auth.users). KEIN eigenes
--      password_hash. profiles.id == auth.uid(), dadurch greifen die
--      RLS-Policies sauber über auth.uid().
--
-- Cascade-Entscheidungen (bewusst getroffen):
--   profiles      -> auth.users : CASCADE  (Account weg => Profil weg)
--   orders        -> profiles   : CASCADE  (Account weg => Bestellungen weg)
--                                  ⚠ Für Produktion eher anonymisieren statt
--                                    löschen (Finanz-/Buchhaltungspflicht).
--   order_items   -> orders     : CASCADE  (Bestellung weg => Positionen weg)
--   order_items   -> products   : RESTRICT (Produkt in Bestellung => nicht löschbar)
--   reviews       -> profiles   : CASCADE
--   reviews       -> products   : CASCADE
--
-- Geld immer numeric(10,2), niemals float. IDs als uuid (keine Row-Counts leaken).
-- =============================================================================

-- gen_random_uuid() steckt in pgcrypto (in Supabase i.d.R. schon aktiv).
create extension if not exists pgcrypto;

-- -----------------------------------------------------------------------------
-- updated_at-Trigger (hält updated_at bei jedem UPDATE aktuell)
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =============================================================================
-- 1. profiles  (ersetzt die "Users"-Tabelle; password_hash lebt in auth.users)
-- =============================================================================
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  name       text,
  email      text unique,
  phone      text,
  address    text,
  created_at timestamptz not null default now()
);

-- =============================================================================
-- 2. products
-- =============================================================================
create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  name        text        not null,
  price       numeric(10,2) not null check (price >= 0),
  description text,
  image_url   text,
  variants    jsonb       not null default '[]'::jsonb,  -- z.B. [{"label":"M","sku":"...","stock":12}]
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- =============================================================================
-- 3. orders
-- =============================================================================
create table if not exists public.orders (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.profiles (id) on delete cascade,
  total          numeric(10,2) not null check (total >= 0),
  status         text not null default 'pending'
                   check (status in ('pending','processing','completed','cancelled','refunded')),
  payment_status text not null default 'unpaid'
                   check (payment_status in ('unpaid','paid','failed','refunded')),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- =============================================================================
-- 4. order_items
-- =============================================================================
create table if not exists public.order_items (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references public.orders (id)   on delete cascade,
  product_id uuid not null references public.products (id) on delete restrict,
  quantity   integer not null check (quantity > 0),
  unit_price numeric(10,2) not null check (unit_price >= 0)  -- Preis zum Kaufzeitpunkt einfrieren
);

-- =============================================================================
-- 5. reviews
-- =============================================================================
create table if not exists public.reviews (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  rating     integer not null check (rating between 1 and 5),
  body       text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, product_id)  -- eine Bewertung pro Nutzer & Produkt
);

create trigger reviews_set_updated_at
  before update on public.reviews
  for each row execute function public.set_updated_at();

-- =============================================================================
-- INDIZES  (jeder Foreign Key + häufig gefilterte/sortierte Spalten)
-- =============================================================================
create index if not exists orders_user_id_idx        on public.orders (user_id);
create index if not exists orders_status_idx          on public.orders (status);
create index if not exists orders_payment_status_idx  on public.orders (payment_status);
create index if not exists orders_created_at_idx      on public.orders (created_at desc);

create index if not exists order_items_order_id_idx   on public.order_items (order_id);
create index if not exists order_items_product_id_idx on public.order_items (product_id);

create index if not exists reviews_user_id_idx        on public.reviews (user_id);
create index if not exists reviews_product_id_idx     on public.reviews (product_id);
create index if not exists reviews_rating_idx         on public.reviews (rating);

create index if not exists products_created_at_idx    on public.products (created_at desc);
-- Volltext-/Teilstringsuche auf Produktnamen (trigram); pg_trgm in Supabase verfügbar.
create extension if not exists pg_trgm;
create index if not exists products_name_trgm_idx     on public.products using gin (name gin_trgm_ops);

-- =============================================================================
-- ROW LEVEL SECURITY
-- Hinweis: Der service_role-Key umgeht RLS komplett (für Seeds/Admin/Backend).
-- =============================================================================
alter table public.profiles    enable row level security;
alter table public.products    enable row level security;
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;
alter table public.reviews     enable row level security;

-- --- profiles: jeder sieht/ändert nur sein eigenes Profil ---------------------
create policy "profiles: read own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles: insert own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles: update own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- --- products: öffentlich lesbar; Schreiben nur via service_role -------------
create policy "products: public read"
  on public.products for select
  using (true);

-- --- orders: Nutzer sieht/erstellt nur eigene Bestellungen -------------------
create policy "orders: read own"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "orders: insert own"
  on public.orders for insert
  with check (auth.uid() = user_id);

create policy "orders: update own"
  on public.orders for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- --- order_items: sichtbar/anlegbar, wenn die Bestellung dem Nutzer gehört ---
create policy "order_items: read via own order"
  on public.order_items for select
  using (exists (
    select 1 from public.orders o
    where o.id = order_items.order_id and o.user_id = auth.uid()
  ));

create policy "order_items: insert via own order"
  on public.order_items for insert
  with check (exists (
    select 1 from public.orders o
    where o.id = order_items.order_id and o.user_id = auth.uid()
  ));

-- --- reviews: öffentlich lesbar; nur eigene anlegen/ändern/löschen -----------
create policy "reviews: public read"
  on public.reviews for select
  using (true);

create policy "reviews: insert own"
  on public.reviews for insert
  with check (auth.uid() = user_id);

create policy "reviews: update own"
  on public.reviews for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "reviews: delete own"
  on public.reviews for delete
  using (auth.uid() = user_id);

-- =============================================================================
-- SEED — 5 Produkte (feste UUIDs => idempotent re-runnable)
-- Thematisch passend zur Wander-Website (Merch/Gear/Gutscheine).
-- =============================================================================
insert into public.products (id, name, price, description, image_url, variants) values
  ('11111111-1111-1111-1111-111111111111',
   'West Highland Way — Routenpaket',
   24.00,
   'Wasserfeste Kartenmappe, Etappenplan und GPX-Tracks für Schottlands Flaggschiff-Fernwanderweg.',
   '/images/products/whw-route-pack.jpg',
   '[{"label":"Print + GPX","sku":"WHW-PRINT","stock":120},{"label":"Nur GPX (Download)","sku":"WHW-GPX","stock":9999}]'::jsonb),

  ('22222222-2222-2222-2222-222222222222',
   'Merino-Wandersocken',
   18.50,
   'Schottische Merinowolle, gepolsterte Ferse — warm und blasenfrei auf langen Etappen.',
   '/images/products/merino-socks.jpg',
   '[{"label":"S (36-39)","sku":"SOCK-S","stock":40},{"label":"M (40-43)","sku":"SOCK-M","stock":65},{"label":"L (44-47)","sku":"SOCK-L","stock":30}]'::jsonb),

  ('33333333-3333-3333-3333-333333333333',
   'Highlands-Kartenbundle (3er-Set)',
   39.90,
   'OS-Explorer-Karten für Skye, Cairngorms und Glencoe im Set — wetterfest gefaltet.',
   '/images/products/highlands-maps.jpg',
   '[{"label":"Standard","sku":"MAP-SET-STD","stock":75}]'::jsonb),

  ('44444444-4444-4444-4444-444444444444',
   'Bothy-Übernachtung — Gutschein',
   45.00,
   'Gutschein für eine Nacht in einer ausgewählten Bothy/Lodge im Trip-Netzwerk.',
   '/images/products/bothy-voucher.jpg',
   '[{"label":"1 Nacht","sku":"BOTHY-1N","stock":200}]'::jsonb),

  ('55555555-5555-5555-5555-555555555555',
   'Geführter Munro-Tag',
   95.00,
   'Tagestour mit lizenziertem Mountain Leader inkl. Sicherheitsausrüstung — ein Munro-Gipfel.',
   '/images/products/guided-munro.jpg',
   '[{"label":"Einzelperson","sku":"MUNRO-1","stock":12},{"label":"Paar (2 Pers.)","sku":"MUNRO-2","stock":12}]'::jsonb)
on conflict (id) do nothing;
