-- =============================================================================
-- Buchungs-Anlage (Gastbuchung) + race-sichere Durchsetzung der Constraints
-- =============================================================================
-- Login kommt später; bis dahin Gastbuchung mit Name + E-Mail.
-- create_booking(): advisory lock -> Verfügbarkeit erneut prüfen -> Buchung +
-- Posten (Preis-Snapshot) einfügen, alles in EINER Transaktion. Nur serverseitig
-- aufrufbar (grant nur an service_role) — Aufruf über /api/bookings.
-- =============================================================================

-- 1) Gast-Buchung ermöglichen ---------------------------------------------------
alter table public.bookings alter column user_id drop not null;
alter table public.bookings add column if not exists guest_name  text;
alter table public.bookings add column if not exists guest_email text;

-- 2) Buchungs-Funktion ----------------------------------------------------------
create or replace function public.create_booking(
  p_items      jsonb,   -- [{"item_type":"tour","item_id":"skye-explorer","nights":0,"position":1}, ...]
  p_start      date,
  p_end        date,
  p_party_size integer,
  p_guest_name  text,
  p_guest_email text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_avail   jsonb;
  v_unknown integer;
  v_id      uuid;
  v_total   numeric;
begin
  if coalesce(btrim(p_guest_name), '') = '' or coalesce(btrim(p_guest_email), '') = '' then
    return jsonb_build_object('ok', false, 'reasons',
      jsonb_build_array(jsonb_build_object('code','missing_contact','message','Please provide your name and email.')));
  end if;
  if jsonb_typeof(p_items) is distinct from 'array' or jsonb_array_length(p_items) = 0 then
    return jsonb_build_object('ok', false, 'reasons',
      jsonb_build_array(jsonb_build_object('code','empty_trip','message','Your trip is empty.')));
  end if;

  -- Race-sicher: serialisiert gleichzeitige Buchungsanlagen (bis Transaktionsende)
  perform pg_advisory_xact_lock(987654321);

  -- Verfügbarkeit erneut prüfen (gleiche Logik wie Vorab-Check)
  v_avail := public.check_booking_availability(p_items, p_start, p_end, p_party_size);
  if not coalesce((v_avail->>'ok')::boolean, false) then
    return jsonb_build_object('ok', false, 'reasons', v_avail->'reasons');
  end if;

  -- Unbekannte Katalog-IDs abfangen
  select count(*) into v_unknown
  from jsonb_to_recordset(p_items) as x(item_type text, item_id text)
  left join public.tours  t on x.item_type='tour'  and t.id = x.item_id
  left join public.routes r on x.item_type='route' and r.id = x.item_id
  left join public.stays  s on x.item_type='stay'  and s.id = x.item_id
  where coalesce(t.id, r.id, s.id) is null;
  if v_unknown > 0 then
    return jsonb_build_object('ok', false, 'reasons',
      jsonb_build_array(jsonb_build_object('code','item_unknown','message','One or more items are no longer available.')));
  end if;

  insert into public.bookings (user_id, guest_name, guest_email, start_date, end_date, party_size, status, payment_status, total, currency)
  values (null, btrim(p_guest_name), btrim(p_guest_email), p_start, p_end, p_party_size, 'pending', 'unpaid', 0, 'GBP')
  returning id into v_id;

  -- Posten mit eingefrorenem Preis-Snapshot
  insert into public.booking_items (booking_id, item_type, item_id, title, quantity, unit_price, line_total, position)
  select
    v_id,
    x.item_type,
    x.item_id,
    case x.item_type when 'tour' then t.name when 'stay' then s.name else r.name end,
    case x.item_type when 'stay' then greatest(coalesce(x.nights,1),1) else p_party_size end,
    case x.item_type when 'tour' then t.price_per_person when 'stay' then s.price_per_night else 0 end,
    case x.item_type
      when 'tour' then t.price_per_person * p_party_size
      when 'stay' then s.price_per_night * greatest(coalesce(x.nights,1),1)
      else 0
    end,
    x.position
  from jsonb_to_recordset(p_items) as x(item_type text, item_id text, nights integer, position integer)
  left join public.tours  t on x.item_type='tour'  and t.id = x.item_id
  left join public.routes r on x.item_type='route' and r.id = x.item_id
  left join public.stays  s on x.item_type='stay'  and s.id = x.item_id;

  select coalesce(sum(line_total), 0) into v_total from public.booking_items where booking_id = v_id;
  update public.bookings set total = v_total where id = v_id;

  return jsonb_build_object('ok', true, 'booking_id', v_id, 'total', v_total);
end;
$$;

-- Nur serverseitig (service_role) aufrufbar — nicht für anon/authenticated.
revoke all on function public.create_booking(jsonb,date,date,integer,text,text) from public;
grant execute on function public.create_booking(jsonb,date,date,integer,text,text) to service_role;
