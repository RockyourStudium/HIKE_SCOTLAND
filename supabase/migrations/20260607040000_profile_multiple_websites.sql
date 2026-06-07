-- =============================================================================
-- Mehrere Websites pro Profil
-- =============================================================================
-- Ersetzt die einzelne `website`-Spalte (für die Anzeige) durch ein Array
-- `websites` (jsonb, Liste von URLs). Die alte Spalte bleibt additiv erhalten,
-- wird aber nicht mehr von der App/View genutzt; ihr Wert wird migriert.
-- =============================================================================

-- 1) Array-Spalte
alter table public.profiles
  add column if not exists websites jsonb not null default '[]'::jsonb;

-- 2) Bestehende Einzel-Website übernehmen
update public.profiles
  set websites = jsonb_build_array(website)
  where website is not null and websites = '[]'::jsonb;

-- 3) Öffentliche View neu aufbauen: `website` -> `websites`.
-- (create or replace kann eine Spalte nicht ersetzen -> drop + create.)
drop view if exists public.public_profiles;
create view public.public_profiles
with (security_invoker = false) as
  select
    id,
    username,
    display_name,
    bio,
    websites,
    location,
    avatar_url,
    socials,
    created_at
  from public.profiles
  where is_public = true
    and username is not null;

grant select on public.public_profiles to anon, authenticated;
