-- =============================================================================
-- Öffentliche Review-Ansicht
-- =============================================================================
-- reviews ist public-read, aber die Autorendaten liegen in profiles (RLS:
-- read own). Wie bei public_profiles exponiert eine Owner-Rights-View nur die
-- unbedenklichen Spalten: Anzeigename (Fallback: Vorname aus dem Google-Namen,
-- sonst "Hiker"), Avatar und — nur bei öffentlichem Profil — den Username für
-- die Verlinkung auf /profiles/[username]. E-Mail/Rolle etc. bleiben privat.
-- =============================================================================

create or replace view public.public_reviews
with (security_invoker = false) as
  select
    r.id,
    r.subject_type,
    r.subject_id,
    r.rating,
    r.body,
    r.created_at,
    coalesce(
      nullif(p.display_name, ''),
      nullif(split_part(coalesce(p.name, ''), ' ', 1), ''),
      'Hiker'
    ) as author_name,
    p.avatar_url as author_avatar_url,
    case when p.is_public then p.username else null end as author_username
  from public.reviews r
  join public.profiles p on p.id = r.user_id;

grant select on public.public_reviews to anon, authenticated;
