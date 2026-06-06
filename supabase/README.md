# Datenbank — Setup & Pflege

Supabase (PostgreSQL) für HIKE_SCOTLAND. Diese Datei beschreibt **einmaliges
Setup**, **laufende Pflege** und **Notfälle** (Backup/Restore).

> Schema-Quelle der Wahrheit: die SQL-Dateien in `supabase/migrations/`.
> **Nie** das Schema im Dashboard von Hand ändern — immer über eine Migration
> (siehe „Schema ändern").

> Live-Projekt: `hike-scotland` · Ref `bmcukaibgfvmvfqlmzwv` · Region eu-central-1

---

## 0. ER-Diagramm

```mermaid
erDiagram
    auth_users      ||--||  profiles      : "1:1 (id = auth.uid)"
    profiles        ||--o{  bookings      : "bucht"
    profiles        ||--o{  reviews       : "schreibt"
    bookings        ||--o{  booking_items : "enthält"
    tours           ||--o{  tour_departures : "hat Termine"
    tour_departures ||--o{  booking_items : "Termin für (optional)"

    auth_users {
        uuid id PK "von Supabase verwaltet"
    }

    profiles {
        uuid        id          PK "= auth.users.id"
        text        name
        text        email          "unique"
        text        phone
        text        address
        timestamptz created_at
    }

    tour_departures {
        uuid          id               PK
        text          tour_id          FK "-> tours (CASCADE)"
        date          departure_date
        integer       capacity
        integer       seats_remaining
        numeric       price_per_person "optionaler Override"
        text          status           "scheduled|weather_hold|cancelled|completed"
        timestamptz   created_at
        timestamptz   updated_at
    }

    bookings {
        uuid          id             PK
        uuid          user_id        FK "-> profiles (CASCADE)"
        text          status         "pending|confirmed|completed|cancelled|no_show"
        text          payment_status "unpaid|paid|failed|refunded|partially_refunded"
        date          start_date
        date          end_date
        integer       party_size
        numeric       total
        text          currency       "default GBP"
        text          notes
        timestamptz   created_at
        timestamptz   updated_at
    }

    booking_items {
        uuid          id                PK
        uuid          booking_id        FK "-> bookings (CASCADE)"
        text          item_type         "tour|stay|route"
        text          item_id           "statische Katalog-ID"
        text          title             "Name-Snapshot"
        uuid          tour_departure_id FK "-> tour_departures (SET NULL)"
        integer       quantity          "Personen / Nächte"
        numeric       unit_price        "eingefroren"
        numeric       line_total
        integer       position
        timestamptz   created_at
    }

    reviews {
        uuid          id           PK
        uuid          user_id      FK "-> profiles (CASCADE)"
        text          subject_type "tour|stay|route"
        text          subject_id   "statische Katalog-ID"
        integer       rating       "1-5"
        text          body
        timestamptz   created_at
        timestamptz   updated_at
    }

    subscribers {
        uuid          id              PK
        text          email           "unique(lower(email))"
        text          first_name
        text          status          "pending|subscribed|unsubscribed"
        uuid          token           "für Confirm-/Unsubscribe-Links"
        text          source
        timestamptz   created_at
        timestamptz   updated_at
        timestamptz   confirmed_at
        timestamptz   unsubscribed_at
    }

    tours {
        text          id          PK "Slug"
        text          name
        text          region
        text          difficulty  "Easy|Moderate|Challenging|Expert"
        integer       days
        text          group_size
        numeric       price_per_person
        boolean       guided
        text          summary
        jsonb         description "Absätze"
        jsonb         includes
        double        lat
        double        lng
        boolean       active
    }

    routes {
        text          id          PK "Slug"
        text          name
        text          region
        text          difficulty
        numeric       distance_km
        integer       ascent_m
        numeric       duration_hours
        integer       days
        jsonb         terrain
        jsonb         seasons
        boolean       dog_friendly
        jsonb         highlights
        double        lat
        double        lng
        boolean       active
    }

    stays {
        text          id          PK "Slug"
        text          name
        text          type        "Bothy|Hostel|B&B|Lodge|Campsite|Hotel"
        text          region
        numeric       price_per_night
        numeric       rating
        jsonb         amenities
        double        lat
        double        lng
        boolean       active
    }
```

> Lesehilfe: `||--o{` = „eins zu null-oder-viele". `auth_users` ist die von
> Supabase verwaltete Login-Tabelle (`auth.users`); `profiles` hängt 1:1 daran.
> `subscribers` steht bewusst **ohne** Beziehung — Newsletter braucht kein Login.
>
> **Katalog (`tours`/`routes`/`stays`) liegt in der DB** (Slug-`id` = bisherige
> data/*.ts-IDs, daher URL-stabil). `tour_departures.tour_id` ist ein echter FK
> auf `tours`. `booking_items.item_id` und `reviews.subject_id` bleiben **polymorphe
> Text-IDs ohne FK** (sie zeigen je nach `item_type`/`subject_type` auf tours, stays
> **oder** routes — ein einzelner FK ist da nicht möglich).

---

## Buchungsmodell (Touren)

Eine **selbst zusammengestellte Tour** wird beim Buchen als **Snapshot**
gespeichert (der „My Trip"-Planer bleibt clientseitig in localStorage):

- **`bookings`** — eine Buchung: Bucher (`user_id`), Zeitraum, `party_size`,
  `total`, Status-Maschinen (`status`, `payment_status`).
- **`booking_items`** — die Posten der Tour, **eingefroren**: `item_type`
  (tour|stay|route) + `item_id` (Katalog-ID) + `title`/`unit_price`/`line_total`
  zum Buchungszeitpunkt. Tour-Posten zeigen optional auf eine `tour_departure`.
- **`tour_departures`** — konkrete Abreisetermine je Tour (FK auf `tours`) mit
  `capacity` / `seats_remaining` (+ `weather_hold`-Status fürs schottische Wetter).
  Öffentlich lesbar; Schreiben nur via `service_role`.
- **`reviews`** — polymorph über `subject_type`/`subject_id` (Tour, Stay **oder**
  Route), eine Review pro Nutzer & Objekt.

> ⚠️ **Noch offen:** Buchungs-Route (serverseitig, mit Sitzplatz-Abzug auf
> `tour_departures.seats_remaining` in einer Transaktion) und Zahlungsanbindung.
> Aktuell existiert das Datenmodell; die Checkout-Logik folgt.

---

## Katalog (`tours` / `routes` / `stays`)

Der Inhalts-Katalog liegt vollständig in der DB (früher statisch in `data/*.ts`).
`id` ist ein Slug (= bisherige IDs → URLs bleiben stabil), Arrays als `jsonb`,
`coords` als `lat`/`lng`, `active` für Soft-Hide. RLS: **public read**, Schreiben
nur via `service_role`.

**Zugriff im Code:**
- **Server** (Browse-/Detail-/Home-/Destination-Seiten): `lib/catalog.ts`
  (`getTours/getRoutes/getStays` + `*ById`) — mappt DB-Zeilen auf die App-Typen
  (`data/types.ts`). Seiten sind ISR (`revalidate = 300`) → Edits erscheinen ohne
  Deploy nach ≤5 Min.
- **Client** (Karten, `/plan`-Quiz, `/my-trip`): `lib/catalog-client.tsx`
  (`CatalogProvider` + `useCatalog`) lädt den Katalog einmal über den anon-Key und
  stellt id-Lookups bereit. `lib/mapPoints.ts` und `lib/recommend.ts` sind reine
  Funktionen über diese Daten.

> `data/types.ts` (App-Typen), `data/destinations.ts` und `data/imageCredits.ts`
> bleiben bewusst statisch — nur tours/routes/stays sind in die DB gewandert.

---

## Newsletter — Abonnenten (`subscribers`)

Eigene, **auth-unabhängige** Tabelle für Newsletter-Anmeldungen (kein Login).
Enthält PII (E-Mails) → **kein öffentlicher Lesezugriff**: RLS ist aktiv, aber
bewusst **ohne** anon/authenticated-Policies. Aller Zugriff läuft serverseitig
über den `service_role`-Key.

- **Spalten:** `id · email · first_name · status (pending|subscribed|unsubscribed) · token · source · created_at · updated_at · confirmed_at · unsubscribed_at`. E-Mail case-insensitive eindeutig (`unique index on lower(email)`); jeder Abonnent hat einen geheimen `token` für Confirm-/Unsubscribe-Links.
- **Aktueller Modus:** *ohne* Double Opt-in — Anmeldung setzt direkt `status='subscribed'`. Schema unterstützt Double Opt-in über `pending` + Confirm-Route; für DE/EU-Marketing **vor echtem Versand nachrüsten**.

**Routen (App):**

| Route | Zweck |
|---|---|
| `POST /api/newsletter/subscribe` | Anmeldung (`{email, firstName?, source?}`); reaktiviert Abgemeldete, idempotent |
| `POST /api/newsletter/unsubscribe` | Abmeldung per `{token}` |
| `/unsubscribe?token=…` | Abmelde-Seite mit Bestätigungs-Button (schützt vor Link-Prefetch) |

**Unsubscribe-Link im Newsletter:**
`https://hike-scotland-claude.vercel.app/unsubscribe?token=<token-des-abonnenten>`

**Dateien:** Migration `supabase/migrations/20260605000000_newsletter_subscribers.sql` ·
`lib/supabase-admin.ts` (service_role-Client) · `app/api/newsletter/*` ·
`app/unsubscribe/` · Anbindung in `components/NewsletterForm.tsx`.

> ⚠️ **Mailversand ist noch nicht angebunden** — aktuell wird nur gespeichert.

---

## 1. Voraussetzungen (einmalig)

| Was | Befehl / Quelle |
|---|---|
| Supabase-Account | <https://supabase.com> (Free-Tier reicht) |
| Supabase CLI | `npm install -g supabase` (oder `npx supabase ...`) |
| Login der CLI | `npx supabase login` |

Lokal ist kein Docker nötig, solange du gegen die Cloud-DB arbeitest.

---

## 2. Erst-Setup (einmal pro Projekt)

### 2.1 Supabase-Projekt anlegen
Im Dashboard ein Projekt erstellen → **Region EU** (z. B. Frankfurt) wegen DSGVO.
Das **Datenbank-Passwort** sicher ablegen (z. B. im Passwortmanager) — es wird
für Restores gebraucht.

### 2.2 CLI mit dem Projekt verbinden
```bash
cd <projekt-root>
npx supabase link --project-ref <project-ref>   # ref steht im Dashboard-URL
```

### 2.3 Migrationen einspielen
```bash
npx supabase db push      # spielt alle Dateien aus supabase/migrations/ ein
```
Damit entstehen die Tabellen `tours, routes, stays` (Katalog), `profiles,
tour_departures, bookings, booking_items, reviews` (Buchungsmodell) und
`subscribers` (Newsletter) — inkl. RLS, Indizes und Seed-Daten. Siehe die
eigenen Abschnitte oben.

### 2.4 Umgebungsvariablen für Next.js
Im Dashboard unter **Project Settings → API** holen und in `.env.local` legen
(diese Datei ist gitignored und gehört **nicht** ins Repo):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>      # öffentlich, nur mit RLS sicher
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>  # GEHEIM, nur serverseitig!
```

> ⚠️ Der **service_role**-Key umgeht RLS komplett. Niemals in Client-Code, nie
> mit `NEXT_PUBLIC_` prefixen, nie committen. Nur in Server Components / Route
> Handlers / Server Actions verwenden.

---

## 3. Schema ändern (laufende Entwicklung)

Immer als **neue** Migration, nie bestehende Dateien editieren (die sind schon
eingespielt).

```bash
# 1. Neue, leere Migrationsdatei anlegen
npx supabase migration new <beschreibender_name>   # z.B. add_bookings

# 2. SQL in die erzeugte Datei in supabase/migrations/ schreiben

# 3. Lokal/Cloud einspielen
npx supabase db push

# 4. Committen (Migrationen IMMER ins Git)
git add supabase/migrations/ && git commit -m "db: <was geändert wurde>"
```

Regeln:
- Jede Änderung = eigene Migration mit Zeitstempel-Präfix (chronologisch).
- Migrationen sind **additiv**: keine alte Datei nachträglich ändern.
- Nach Schemaänderung TypeScript-Typen neu generieren (siehe 4).

---

## 4. TypeScript-Typen generieren

Nach jeder Schemaänderung, damit der App-Code typsicher bleibt:

```bash
npx supabase gen types typescript --project-id <ref> > types/database.types.ts
```

Verwendung im Code: `createClient<Database>(...)` (Stack-B-Muster, ohne ORM).

---

## 5. Seed-Daten

- Aktuell stehen ein paar Beispiel-**Abreisetermine** (`tour_departures`) direkt
  in der Umbau-Migration (`ON CONFLICT (tour_id, departure_date) DO NOTHING` →
  mehrfaches Einspielen schadet nicht). `tour_id` verweist auf die statischen
  Touren in `data/tours.ts`.
- Für umfangreichere Testdaten: `supabase/seed.sql` anlegen — die wird bei
  `supabase db reset` automatisch nach den Migrationen ausgeführt.

```bash
npx supabase db reset   # ⚠️ LÖSCHT alle Daten, spielt Migrationen + seed.sql neu ein
```
`db reset` nur in Entwicklung/Staging — **nie** gegen Produktion.

---

## 6. Backup & Restore

### Backup
- **Automatisch:** Supabase macht tägliche Backups (Free-Tier: begrenzte
  Aufbewahrung; bezahlte Pläne: Point-in-Time-Recovery).
- **Manuell (empfohlen vor größeren Migrationen):**
```bash
npx supabase db dump -f backup_$(date +%F).sql            # Schema + Daten
npx supabase db dump --data-only -f data_$(date +%F).sql  # nur Daten
```
Den Dump außerhalb des Repos sichern (enthält ggf. echte Nutzerdaten → DSGVO).

### Restore
```bash
psql "<connection-string>" < backup_2026-06-05.sql
```
Connection-String steht im Dashboard unter **Project Settings → Database**.

---

## 7. Laufende Pflege / Monitoring

| Aufgabe | Wie | Rhythmus |
|---|---|---|
| Security-Check (RLS-Lücken etc.) | Dashboard → **Advisors → Security** | nach jeder Migration |
| Performance-Check (fehlende Indizes, langsame Queries) | Dashboard → **Advisors → Performance** | monatlich |
| Logs ansehen | Dashboard → **Logs** | bei Fehlern |
| DB-Größe / Auslastung | Dashboard → **Reports** | monatlich |
| Backup-Test (Restore probeweise) | siehe 6 | quartalsweise |

**RLS-Grundsatz:** Jede neue Tabelle bekommt sofort `ENABLE ROW LEVEL SECURITY`
+ mindestens eine Policy. Ohne Policy ist eine RLS-Tabelle für normale Nutzer
komplett gesperrt (nur service_role kommt rein) — das ist sicher, aber bewusst
zu prüfen.

---

## 8. Sicherheits-Checkliste

- [ ] RLS auf **allen** Tabellen aktiv
- [ ] `SUPABASE_SERVICE_ROLE_KEY` nur serverseitig, nie im Client/Repo
- [ ] `.env.local` in `.gitignore`
- [ ] Datenbank-Passwort im Passwortmanager
- [ ] Region EU (DSGVO)
- [ ] Advisors → Security nach jeder Migration grün

---

## 9. Troubleshooting

| Symptom | Ursache / Lösung |
|---|---|
| `permission denied for table ...` | RLS aktiv, aber keine passende Policy → Policy ergänzen oder serverseitig service_role nutzen |
| Query liefert leeres Ergebnis trotz Daten | RLS filtert weg (`auth.uid()` passt nicht) → eingeloggt? richtige user_id? |
| `db push` meldet „migration already applied" | normal — nur neue Migrationen werden eingespielt |
| Typfehler im App-Code nach Schemaänderung | Typen neu generieren (siehe 4) |
| Seed schlägt fehl mit „duplicate key" | bereits vorhanden — `ON CONFLICT DO NOTHING` greift, kein echter Fehler |

---

## 10. Verweise

- Schema-Detail (Tabellen, Spalten, Relationen): `supabase/migrations/20260604000000_init_shop.sql` (Kommentar-Header)
- Supabase Docs: <https://supabase.com/docs>
- RLS-Guide: <https://supabase.com/docs/guides/auth/row-level-security>
