-- =============================================================================
-- Auth: Rollen + Auto-Profil bei Signup
-- =============================================================================
-- Ergänzt das bestehende Auth-Modell (Supabase Auth + public.profiles) um:
--   1) profiles.role  -> Admin-Gate (Zugriff auf /admin)
--   2) profiles.updated_at + Trigger
--   3) handle_new_user-Trigger -> legt bei jedem neuen auth.users-Eintrag
--      (z.B. Google-Login) automatisch eine profiles-Zeile an.
-- RLS bleibt unverändert: "read own"/"update own" decken Rollen-Lesen und
-- Profil-Bearbeitung ab.
-- =============================================================================

-- 1) Rollen-Spalte
alter table public.profiles
  add column if not exists role text not null default 'user'
    check (role in ('user', 'admin'));

-- 2) updated_at + Trigger (set_updated_at existiert bereits aus init_shop)
alter table public.profiles
  add column if not exists updated_at timestamptz not null default now();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- 3) Auto-Profil bei Signup ---------------------------------------------------
-- security definer: läuft mit Owner-Rechten, darf also in public.profiles
-- schreiben, obwohl der Trigger im Auth-Kontext feuert.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name'
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Trigger-Funktion NICHT als RPC exponieren. Trigger laufen unabhängig von
-- EXECUTE-Rechten, daher ist der Entzug gefahrlos und schließt den RPC-Endpunkt.
revoke all on function public.handle_new_user() from public, anon, authenticated;
