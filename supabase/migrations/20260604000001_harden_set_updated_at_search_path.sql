-- =============================================================================
-- set_updated_at() härten: leeres search_path
-- =============================================================================
-- Diese Migration war in der Live-DB bereits angewendet, fehlte aber als Datei
-- im Repo (Nachzug, damit Repo und DB übereinstimmen — auch nach einem
-- db reset). Setzt search_path der Trigger-Funktion bewusst auf '' (kein
-- Schema-Hijacking via search_path), alle Objekte werden voll qualifiziert.
-- =============================================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
