-- =============================================================================
-- Öffentliche User-Profile
-- =============================================================================
-- Erweitert public.profiles um die Felder eines öffentlichen Profils
-- (Username, Anzeigename, Bio, Website, Ort, Avatar, Social-Links) und einen
-- Opt-in-Schalter (is_public). Der öffentliche Lesezugriff läuft NICHT über eine
-- gelockerte Tabellen-RLS, sondern über eine schmale View (public_profiles), die
-- nur die unbedenklichen Spalten exponiert — E-Mail/Telefon/Adresse/Rolle bleiben
-- privat. Avatare liegen im public-read Storage-Bucket `avatars` (Schreiben nur
-- via service_role).
-- =============================================================================

-- 1) Profil-Spalten -----------------------------------------------------------
alter table public.profiles
  add column if not exists username     text,
  add column if not exists display_name text,
  add column if not exists is_public    boolean not null default false,
  add column if not exists bio          text,
  add column if not exists website      text,
  add column if not exists location     text,
  add column if not exists avatar_url   text,
  add column if not exists socials      jsonb not null default '{}'::jsonb;

-- Username-Format: 3–30 Zeichen, Kleinbuchstaben/Ziffern/_-. (case-insensitiv
-- eindeutig über den Index unten; gespeichert wird bereits normalisiert.)
alter table public.profiles
  drop constraint if exists profiles_username_format;
alter table public.profiles
  add constraint profiles_username_format
    check (username is null or username ~ '^[a-z0-9_-]{3,30}$');

create unique index if not exists profiles_username_lower_key
  on public.profiles (lower(username))
  where username is not null;

-- 2) Auto-Profil-Trigger erweitern -------------------------------------------
-- Übernimmt zusätzlich den Google-Avatar (avatar_url / picture) beim Signup.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name'
    ),
    coalesce(
      new.raw_user_meta_data ->> 'avatar_url',
      new.raw_user_meta_data ->> 'picture'
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;

-- 3) Öffentliche View ---------------------------------------------------------
-- security_invoker = false (PG-Default): läuft mit Owner-Rechten, umgeht damit
-- die strikte "read own"-RLS der Tabelle und liefert alle öffentlichen Profile —
-- aber NUR die hier gelisteten, unbedenklichen Spalten.
create or replace view public.public_profiles
with (security_invoker = false) as
  select
    id,
    username,
    display_name,
    bio,
    website,
    location,
    avatar_url,
    socials,
    created_at
  from public.profiles
  where is_public = true
    and username is not null;

grant select on public.public_profiles to anon, authenticated;

-- 4) Avatar-Storage-Bucket ----------------------------------------------------
-- public-read; Schreiben ausschließlich serverseitig über service_role (umgeht
-- RLS), daher sind keine object-Policies nötig.
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;
