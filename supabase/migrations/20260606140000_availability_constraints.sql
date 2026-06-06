-- =============================================================================
-- Verfügbarkeits-Constraints: Stay-Kapazität + Anbieter-Begleitungs-Kapazität
-- =============================================================================
-- 1) stays.max_guests: geteilte Personen-Kapazität je Unterkunft.
-- 2) check_booking_availability(): prüft, ob eine Buchung im gewählten Zeitraum
--    möglich ist:
--      a) GLOBAL max. 5 gleichzeitig laufende Buchungen mit Route-/Tour-Posten
--         (Anbieter-Begleitkapazität; gezählt werden Buchungen, nicht Personen).
--      b) je Stay: Summe der Personen überlappender Buchungen + neue Personenzahl
--         darf max_guests nicht überschreiten.
--    Liefert nur { ok, reasons } — keine fremden Buchungsdaten (PII-sicher).
-- =============================================================================

-- 1) Stay-Kapazität --------------------------------------------------------------
alter table public.stays
  add column if not exists max_guests integer not null default 2 check (max_guests >= 1);

update public.stays set max_guests = v.cap from (values
  ('glen-nevis-lodge', 12),
  ('portree-harbour-bnb', 6),
  ('cairngorm-bunkhouse', 24),
  ('rannoch-bothy', 8),
  ('glencoe-campsite', 40),
  ('trossachs-country-hotel', 30),
  ('borders-farmhouse', 6),
  ('skye-glamping-pods', 8)
) as v(id, cap) where public.stays.id = v.id;

-- 2) Verfügbarkeitsprüfung -------------------------------------------------------
create or replace function public.check_booking_availability(
  p_items      jsonb,     -- [{"item_type":"tour","item_id":"skye-explorer"}, ...]
  p_start      date,
  p_end        date,
  p_party_size integer
)
returns jsonb
language plpgsql
security definer            -- darf alle Buchungen zählen (umgeht RLS); gibt nur {ok,reasons} zurück
set search_path = ''
as $$
declare
  v_reasons        jsonb := '[]'::jsonb;
  v_max_concurrent constant integer := 5;  -- Anbieter-Begleitkapazität
  v_has_guided     boolean;
  v_concurrent     integer;
  v_occupied       integer;
  v_cap            integer;
  r                record;
begin
  if p_start is null or p_end is null or p_end < p_start then
    return jsonb_build_object('ok', false, 'reasons',
      jsonb_build_array(jsonb_build_object('code','invalid_dates','message','Bitte einen gültigen Zeitraum wählen.')));
  end if;
  if coalesce(p_party_size, 0) < 1 then
    return jsonb_build_object('ok', false, 'reasons',
      jsonb_build_array(jsonb_build_object('code','invalid_party','message','Bitte mindestens eine Person angeben.')));
  end if;

  -- a) globale Begleitkapazität (nur wenn die Buchung Route/Tour enthält)
  v_has_guided := exists (
    select 1 from jsonb_to_recordset(p_items) as x(item_type text, item_id text)
    where x.item_type in ('route','tour')
  );
  if v_has_guided then
    select count(distinct b.id) into v_concurrent
    from public.bookings b
    where b.status in ('pending','confirmed')
      and b.start_date is not null and b.end_date is not null
      and daterange(b.start_date, b.end_date, '[]') && daterange(p_start, p_end, '[]')
      and exists (
        select 1 from public.booking_items bi
        where bi.booking_id = b.id and bi.item_type in ('route','tour')
      );
    if v_concurrent >= v_max_concurrent then
      v_reasons := v_reasons || jsonb_build_object(
        'code','guides_full',
        'message','In diesem Zeitraum sind bereits die maximal begleitbaren Touren gebucht.');
    end if;
  end if;

  -- b) Stay-Kapazität je angefragter Unterkunft
  for r in
    select distinct x.item_id
    from jsonb_to_recordset(p_items) as x(item_type text, item_id text)
    where x.item_type = 'stay'
  loop
    select max_guests into v_cap from public.stays where id = r.item_id;
    if v_cap is null then
      v_reasons := v_reasons || jsonb_build_object(
        'code','stay_unknown','item_id',r.item_id,'message','Unterkunft nicht gefunden.');
      continue;
    end if;

    select coalesce(sum(b.party_size), 0) into v_occupied
    from public.bookings b
    join public.booking_items bi on bi.booking_id = b.id
    where bi.item_type = 'stay' and bi.item_id = r.item_id
      and b.status in ('pending','confirmed')
      and b.start_date is not null and b.end_date is not null
      and daterange(b.start_date, b.end_date, '[]') && daterange(p_start, p_end, '[]');

    if v_occupied + p_party_size > v_cap then
      v_reasons := v_reasons || jsonb_build_object(
        'code','stay_full','item_id',r.item_id,
        'message','Diese Unterkunft hat im gewählten Zeitraum nicht genug freie Plätze.');
    end if;
  end loop;

  return jsonb_build_object('ok', jsonb_array_length(v_reasons) = 0, 'reasons', v_reasons);
end;
$$;

grant execute on function public.check_booking_availability(jsonb, date, date, integer) to anon, authenticated;
