-- =============================================================================
-- Newsletter-Abonnenten
-- =============================================================================
-- Unabhängig von Auth (kein Login nötig). Die Tabelle enthält PII (E-Mails),
-- daher KEIN öffentlicher Lesezugriff: RLS ist aktiv, aber bewusst ohne
-- anon/authenticated-Policies. Anmelden, Bestätigen (Double Opt-in) und
-- Abmelden laufen serverseitig über Route Handlers mit dem service_role-Key,
-- der RLS umgeht.
--
-- Unsubscribe-/Confirm-Flow ohne Login: pro Abonnent ein geheimer `token`,
-- der in den Links steckt (…/unsubscribe?token=…  bzw.  …/confirm?token=…).
-- =============================================================================

create table if not exists public.subscribers (
  id              uuid primary key default gen_random_uuid(),
  email           text not null,
  first_name      text,
  status          text not null default 'pending'
                    check (status in ('pending','subscribed','unsubscribed')),
  token           uuid not null default gen_random_uuid(),
  source          text,                                     -- z.B. 'footer', 'newsletter-page'
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  confirmed_at    timestamptz,
  unsubscribed_at timestamptz
);

-- Eindeutigkeit case-insensitive (Foo@x.de == foo@x.de)
create unique index if not exists subscribers_email_lower_idx on public.subscribers (lower(email));
create unique index if not exists subscribers_token_idx       on public.subscribers (token);
create index        if not exists subscribers_status_idx      on public.subscribers (status);

create trigger subscribers_set_updated_at
  before update on public.subscribers
  for each row execute function public.set_updated_at();

alter table public.subscribers enable row level security;
-- Bewusst KEINE Policies: Zugriff ausschließlich serverseitig via service_role.
