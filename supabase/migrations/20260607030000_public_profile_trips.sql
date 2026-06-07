-- =============================================================================
-- Geteilte Touren auf dem öffentlichen Profil
-- =============================================================================
-- Erlaubt Nutzern, ihre gebuchten Posten (Touren/Routen/Stays) auf dem
-- öffentlichen Profil zu zeigen — als eigenes Opt-in (show_trips). Der anonyme
-- Lesezugriff läuft wie bei public_profiles über eine schmale View, die NUR
-- Typ/ID/Titel der opt-in-freigegebenen Profile exponiert — keine Daten, Preise,
-- Personenzahl oder Buchungsstatus.
-- =============================================================================

-- 1) Opt-in-Flag
alter table public.profiles
  add column if not exists show_trips boolean not null default false;

-- 2) Öffentliche View: gebuchte Posten freigegebener Profile.
-- security_invoker = false: läuft mit Owner-Rechten, umgeht damit die RLS auf
-- bookings/booking_items. Sichtbar nur, wenn das Profil öffentlich UND show_trips
-- aktiv ist; ausgenommen sind stornierte/nicht-erschienene Buchungen.
create or replace view public.public_profile_trips
with (security_invoker = false) as
  select distinct
    p.username,
    bi.item_type,
    bi.item_id,
    bi.title
  from public.profiles p
  join public.bookings b       on b.user_id = p.id
  join public.booking_items bi on bi.booking_id = b.id
  where p.is_public
    and p.show_trips
    and p.username is not null
    and b.status not in ('cancelled', 'no_show');

grant select on public.public_profile_trips to anon, authenticated;
