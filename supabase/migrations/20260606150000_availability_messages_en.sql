-- Verfügbarkeits-Meldungen auf Englisch (Site ist englischsprachig).
-- Reine Text-Änderung der reasons[].message; Logik unverändert.
create or replace function public.check_booking_availability(
  p_items      jsonb,
  p_start      date,
  p_end        date,
  p_party_size integer
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_reasons        jsonb := '[]'::jsonb;
  v_max_concurrent constant integer := 5;
  v_has_guided     boolean;
  v_concurrent     integer;
  v_occupied       integer;
  v_cap            integer;
  r                record;
begin
  if p_start is null or p_end is null or p_end < p_start then
    return jsonb_build_object('ok', false, 'reasons',
      jsonb_build_array(jsonb_build_object('code','invalid_dates','message','Please choose a valid date range.')));
  end if;
  if coalesce(p_party_size, 0) < 1 then
    return jsonb_build_object('ok', false, 'reasons',
      jsonb_build_array(jsonb_build_object('code','invalid_party','message','Please enter at least one person.')));
  end if;

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
        'message','All guided slots are already booked for these dates.');
    end if;
  end if;

  for r in
    select distinct x.item_id
    from jsonb_to_recordset(p_items) as x(item_type text, item_id text)
    where x.item_type = 'stay'
  loop
    select max_guests into v_cap from public.stays where id = r.item_id;
    if v_cap is null then
      v_reasons := v_reasons || jsonb_build_object(
        'code','stay_unknown','item_id',r.item_id,'message','Accommodation not found.');
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
        'message','This stay does not have enough space for the selected dates.');
    end if;
  end loop;

  return jsonb_build_object('ok', jsonb_array_length(v_reasons) = 0, 'reasons', v_reasons);
end;
$$;
