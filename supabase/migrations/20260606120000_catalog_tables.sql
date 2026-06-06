-- =============================================================================
-- Katalog in die DB: tours / routes / stays (Phase C — volle Tabellen)
-- =============================================================================
-- IDs sind Slugs (text PK), identisch zu den bisherigen statischen data/*.ts-IDs
-- -> bestehende URLs (/tours/[id], /routes/[id]) und Referenzen
-- (tour_departures.tour_id, booking_items.item_id, reviews.subject_id) bleiben gültig.
-- Arrays als jsonb, coords als lat/lng. `active` für Soft-Hide (CMS-tauglich).
-- =============================================================================

-- 1) tours ---------------------------------------------------------------------
create table public.tours (
  id               text primary key,
  name             text not null,
  region           text not null,
  difficulty       text not null check (difficulty in ('Easy','Moderate','Challenging','Expert')),
  days             integer not null,
  group_size       text not null,
  price_per_person numeric(10,2) not null check (price_per_person >= 0),
  guided           boolean not null,
  summary          text not null,
  description      jsonb not null default '[]'::jsonb,
  includes         jsonb not null default '[]'::jsonb,
  gradient         text,
  lat              double precision not null,
  lng              double precision not null,
  image            text,
  active           boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index tours_region_idx     on public.tours (region);
create index tours_difficulty_idx on public.tours (difficulty);
create index tours_active_idx     on public.tours (active) where active = true;
create trigger tours_set_updated_at before update on public.tours
  for each row execute function public.set_updated_at();

-- 2) routes --------------------------------------------------------------------
create table public.routes (
  id             text primary key,
  name           text not null,
  region         text not null,
  difficulty     text not null check (difficulty in ('Easy','Moderate','Challenging','Expert')),
  distance_km    numeric(6,1) not null,
  ascent_m       integer not null,
  duration_hours numeric(4,1) not null,
  days           integer not null,
  terrain        jsonb not null default '[]'::jsonb,
  seasons        jsonb not null default '[]'::jsonb,
  dog_friendly   boolean not null,
  summary        text not null,
  description    jsonb not null default '[]'::jsonb,
  highlights     jsonb not null default '[]'::jsonb,
  gradient       text,
  lat            double precision not null,
  lng            double precision not null,
  image          text,
  active         boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index routes_region_idx     on public.routes (region);
create index routes_difficulty_idx on public.routes (difficulty);
create index routes_active_idx     on public.routes (active) where active = true;
create trigger routes_set_updated_at before update on public.routes
  for each row execute function public.set_updated_at();

-- 3) stays ---------------------------------------------------------------------
create table public.stays (
  id              text primary key,
  name            text not null,
  type            text not null check (type in ('Bothy','Hostel','B&B','Lodge','Campsite','Hotel')),
  region          text not null,
  price_per_night numeric(10,2) not null check (price_per_night >= 0),
  rating          numeric(2,1) not null check (rating >= 0 and rating <= 5),
  amenities       jsonb not null default '[]'::jsonb,
  summary         text not null,
  gradient        text,
  lat             double precision not null,
  lng             double precision not null,
  active          boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index stays_region_idx on public.stays (region);
create index stays_type_idx   on public.stays (type);
create index stays_active_idx on public.stays (active) where active = true;
create trigger stays_set_updated_at before update on public.stays
  for each row execute function public.set_updated_at();

-- 4) RLS: Katalog ist öffentlich lesbar; Schreiben nur via service_role --------
alter table public.tours  enable row level security;
alter table public.routes enable row level security;
alter table public.stays  enable row level security;
create policy "tours: public read"  on public.tours  for select using (true);
create policy "routes: public read" on public.routes for select using (true);
create policy "stays: public read"  on public.stays  for select using (true);

-- 5) Seed: Touren -------------------------------------------------------------
insert into public.tours (id, name, region, difficulty, days, group_size, price_per_person, guided, summary, description, includes, gradient, lat, lng, image)
select id, name, region, difficulty, days, group_size, price_per_person, guided, summary, description, includes, gradient, lat, lng, image
from jsonb_to_recordset($json$
[
 {"id":"skye-explorer","name":"Isle of Skye Explorer","region":"Isle of Skye","difficulty":"Moderate","days":4,"group_size":"6–12 people","price_per_person":720,"guided":true,
  "summary":"A small-group guided adventure across Skye's most dramatic landscapes, from the Quiraing to the Fairy Pools.",
  "includes":["Expert local guide","3 nights accommodation","Transport on island","Daily packed lunch"],
  "gradient":"from-forest-darkest to-forest-highland","lat":57.4125,"lng":-6.1956,"image":"/cards/skye-explorer.jpg",
  "description":["Our Isle of Skye Explorer is a four-day, small-group guided adventure across the island's most spectacular landscapes. From the otherworldly Quiraing and the Old Man of Storr to the crystal-clear Fairy Pools, your local guide leads you to the highlights while sharing Skye's geology, history and hidden corners.","With transport on the island, three nights' accommodation and daily packed lunches included, all you need to do is walk and take it in. The pace suits anyone with reasonable fitness and a love of dramatic scenery."]},
 {"id":"west-highland-way-supported","name":"West Highland Way — Supported","region":"Loch Lomond & Trossachs","difficulty":"Challenging","days":8,"group_size":"Self-guided","price_per_person":950,"guided":false,
  "summary":"Walk Scotland's flagship trail with luggage transfers, pre-booked stays and a detailed route pack — no guide needed.",
  "includes":["Daily luggage transfer","7 nights accommodation","Route maps & app","24/7 support line"],
  "gradient":"from-forest-dark to-forest-highland","lat":56.2715,"lng":-4.65,"image":"/cards/west-highland-way-supported.jpg",
  "description":["Walk Scotland's flagship trail end to end without the logistics. This eight-day self-guided package covers the full 154 km West Highland Way with your luggage transferred between stops, accommodation pre-booked and a detailed route pack and app provided.","You walk at your own pace each day while we handle the planning, with a 24/7 support line should you need it. It's the freedom of an independent thru-hike with none of the organisational headache."]},
 {"id":"cairngorms-wild-weekend","name":"Cairngorms Wild Weekend","region":"Cairngorms","difficulty":"Moderate","days":3,"group_size":"4–10 people","price_per_person":480,"guided":true,
  "summary":"A weekend immersion in the Cairngorms National Park with wildlife spotting, forest trails and a Munro attempt.",
  "includes":["Mountain leader","2 nights lodge stay","Wildlife guide","All breakfasts"],
  "gradient":"from-forest-highland to-mist","lat":57.19,"lng":-3.825,"image":"/cards/cairngorms-wild-weekend.jpg",
  "description":["A three-day immersion in the Cairngorms National Park, blending forest trails, wildlife spotting and a guided Munro attempt. Led by a qualified mountain leader and a wildlife guide, you'll look for ospreys, red squirrels and reindeer among the ancient pine forest.","Two nights' lodge accommodation and all breakfasts are included. The weekend suits walkers with reasonable fitness who want a richer understanding of this unique landscape — not just the views."]},
 {"id":"glencoe-photography","name":"Glencoe Photography Trek","region":"Glencoe","difficulty":"Easy","days":2,"group_size":"4–8 people","price_per_person":340,"guided":true,
  "summary":"A relaxed-pace trek built around golden-hour photography in one of Scotland's most cinematic glens.",
  "includes":["Photography coach","1 night accommodation","Sunrise & sunset shoots","Transport"],
  "gradient":"from-forest-darkest to-forest-dark","lat":56.676,"lng":-5.101,"image":"/cards/glencoe-photography.jpg",
  "description":["A relaxed-pace, two-day trek built entirely around capturing Glencoe at its most atmospheric. With a photography coach guiding both your walking and your shooting, you'll work the glen through the golden hours of sunrise and sunset.","One night's accommodation, transport within the glen and expert tuition are included. Suitable for all abilities and camera levels — from smartphones to full kit — it's as much about slowing down and seeing as it is about hiking."]},
 {"id":"highlands-grand-tour","name":"Highlands Grand Tour","region":"Highlands","difficulty":"Challenging","days":7,"group_size":"8–14 people","price_per_person":1280,"guided":true,
  "summary":"The ultimate week in the Highlands — bagging Munros, crossing remote glens and finishing beneath Ben Nevis.",
  "includes":["Two mountain leaders","6 nights accommodation","All transport","Most meals"],
  "gradient":"from-forest-darkest to-forest-highland","lat":56.8198,"lng":-5.1052,"image":"/cards/highlands-grand-tour.jpg",
  "description":["The Highlands Grand Tour is our flagship week-long expedition — bagging Munros, crossing remote glens and finishing beneath the slopes of Ben Nevis. Two experienced mountain leaders accompany the group throughout, adapting the itinerary to the conditions.","With six nights' accommodation, all transport and most meals included, it's a comprehensive Highland adventure for fit, experienced walkers seeking big days in wild country. Expect serious ascents and unforgettable summits."]},
 {"id":"borders-gentle-rambles","name":"Borders Gentle Rambles","region":"Borders","difficulty":"Easy","days":3,"group_size":"6–12 people","price_per_person":410,"guided":true,
  "summary":"An easygoing trio of days through the rolling Scottish Borders, ideal for first-timers and slower paces.",
  "includes":["Friendly guide","2 nights B&B","Tea-room stops","Luggage transfer"],
  "gradient":"from-forest-highland to-mist","lat":55.599,"lng":-2.7268,"image":"/cards/borders-gentle-rambles.jpg",
  "description":["An easygoing three-day exploration of the rolling Scottish Borders, designed for first-timers and those who prefer a gentler pace. Each day links charming villages, river valleys and historic abbeys, with plenty of stops for tea and cake.","Two nights in comfortable B&Bs and luggage transfers are included, so you carry only a day pack. It's the perfect introduction to multi-day walking in beautiful, unhurried countryside."]}
]
$json$::jsonb) as x(
  id text, name text, region text, difficulty text, days integer, group_size text,
  price_per_person numeric, guided boolean, summary text, description jsonb,
  includes jsonb, gradient text, lat double precision, lng double precision, image text
)
on conflict (id) do nothing;

-- 6) Seed: Routen -------------------------------------------------------------
insert into public.routes (id, name, region, difficulty, distance_km, ascent_m, duration_hours, days, terrain, seasons, dog_friendly, summary, description, highlights, gradient, lat, lng, image)
select id, name, region, difficulty, distance_km, ascent_m, duration_hours, days, terrain, seasons, dog_friendly, summary, description, highlights, gradient, lat, lng, image
from jsonb_to_recordset($json$
[
 {"id":"old-man-of-storr","name":"The Old Man of Storr","region":"Isle of Skye","difficulty":"Moderate","distance_km":3.8,"ascent_m":320,"duration_hours":2,"days":1,
  "terrain":["Mountain","Moorland"],"seasons":["Spring","Summer","Autumn"],"dog_friendly":true,
  "summary":"An iconic, otherworldly pinnacle rising above the Trotternish ridge with sweeping views over the Sound of Raasay.",
  "highlights":["Dramatic rock pinnacles","Panoramic sea views","Great for photography"],
  "gradient":"from-forest-darkest to-forest-highland","lat":57.5072,"lng":-6.1846,"image":"/cards/old-man-of-storr.jpg",
  "description":["The Old Man of Storr is one of Scotland's most photographed landmarks — a 50-metre basalt pinnacle towering over the Trotternish peninsula on the Isle of Skye. A well-maintained path climbs steadily to a natural amphitheatre of jagged rock spires, with the Sound of Raasay and the mainland mountains unfolding behind you.","It's a short but rewarding outing suitable for most fitness levels, though the upper section is steep and can be slippery after rain. Early morning or golden hour offers the most atmospheric light and the quietest trails."]},
 {"id":"ben-nevis-mountain-track","name":"Ben Nevis — Mountain Track","region":"Highlands","difficulty":"Challenging","distance_km":17,"ascent_m":1352,"duration_hours":8,"days":1,
  "terrain":["Mountain"],"seasons":["Summer","Autumn"],"dog_friendly":false,
  "summary":"Summit the highest mountain in the British Isles via the well-trodden Mountain Track from Glen Nevis.",
  "highlights":["Britain's highest peak","Big-day adventure","Summit plateau views"],
  "gradient":"from-forest-darkest to-forest-dark","lat":56.7969,"lng":-5.0036,"image":"/cards/ben-nevis-mountain-track.jpg",
  "description":["Standing 1,345 metres above Glen Nevis, Ben Nevis is the highest mountain in the British Isles and a bucket-list ascent. The Mountain Track is the most popular route to the summit — a long but non-technical zig-zag that gains over 1,300 metres of height across the day.","This is a serious mountain day requiring good fitness, navigation skills and proper kit. The summit plateau is exposed, often cloud-covered and can hold snow well into summer. On a clear day the panorama stretches across the Highlands and out to the islands."]},
 {"id":"loch-an-eilein","name":"Loch an Eilein Circuit","region":"Cairngorms","difficulty":"Easy","distance_km":5.5,"ascent_m":60,"duration_hours":1.5,"days":1,
  "terrain":["Loch","Forest"],"seasons":["Spring","Summer","Autumn","Winter"],"dog_friendly":true,
  "summary":"A gentle, family-friendly loop around a tranquil loch with an island castle, framed by ancient Caledonian pine forest.",
  "highlights":["Ruined island castle","Ancient pine forest","Mostly flat & accessible"],
  "gradient":"from-forest-highland to-mist","lat":57.1486,"lng":-3.823,"image":"/cards/loch-an-eilein.jpg",
  "description":["The circuit of Loch an Eilein is one of the gentlest and most beautiful walks in the Cairngorms, looping around a tranquil loch crowned by a ruined island castle. The flat, well-surfaced path winds through ancient Caledonian pine forest, home to red squirrels, crossbills and the occasional osprey.","Suitable for families and all abilities, it's an easy outing in any season — peaceful under winter snow and dappled with light in summer. Allow extra time to linger at the viewpoints over the castle."]},
 {"id":"glencoe-lost-valley","name":"The Lost Valley (Coire Gabhail)","region":"Glencoe","difficulty":"Moderate","distance_km":4.5,"ascent_m":340,"duration_hours":3,"days":1,
  "terrain":["Glen","Mountain"],"seasons":["Spring","Summer","Autumn"],"dog_friendly":true,
  "summary":"A hidden hanging valley once used by the MacDonalds to conceal cattle, reached through a dramatic gorge.",
  "highlights":["Hidden hanging valley","River gorge crossing","Towering Three Sisters peaks"],
  "gradient":"from-forest-dark to-forest-highland","lat":56.6685,"lng":-4.9667,"image":"/cards/glencoe-lost-valley.jpg",
  "description":["Hidden between the towering Three Sisters of Glencoe, the Lost Valley (Coire Gabhail) is a dramatic hanging valley once used by the MacDonalds to conceal stolen cattle. The path drops to cross the River Coe before climbing through a wooded gorge into a wide, silent bowl ringed by peaks.","The route involves a river crossing on stepping stones and some rocky, uneven ground, so it's best tackled in dry conditions with sturdy footwear. It packs an enormous sense of wilderness and history into a relatively short walk."]},
 {"id":"west-highland-way","name":"The West Highland Way","region":"Loch Lomond & Trossachs","difficulty":"Challenging","distance_km":154,"ascent_m":3155,"duration_hours":0,"days":7,
  "terrain":["Loch","Glen","Moorland","Mountain"],"seasons":["Spring","Summer","Autumn"],"dog_friendly":true,
  "summary":"Scotland's most famous long-distance trail, running from Milngavie to Fort William through lochs, glens and moorland.",
  "highlights":["154 km flagship trail","Loch Lomond shoreline","Rannoch Moor wilderness"],
  "gradient":"from-forest-darkest to-forest-highland","lat":56.2715,"lng":-4.65,"image":"/cards/west-highland-way.jpg",
  "description":["Scotland's most famous long-distance trail runs 154 kilometres from Milngavie on the edge of Glasgow to Fort William beneath Ben Nevis. Over roughly a week it threads along the bonnie banks of Loch Lomond, across the wild expanse of Rannoch Moor and through the heart of the Highlands.","Most walkers complete it over six to eight days, staying in villages, inns and bunkhouses along the way. It's a committing but achievable multi-day adventure — our supported tour handles luggage transfers and accommodation so you can simply walk."]},
 {"id":"quiraing-loop","name":"The Quiraing Loop","region":"Isle of Skye","difficulty":"Moderate","distance_km":6.8,"ascent_m":370,"duration_hours":3,"days":1,
  "terrain":["Mountain","Coastal"],"seasons":["Spring","Summer","Autumn"],"dog_friendly":true,
  "summary":"A surreal landscape of landslips, hidden plateaus and jagged pinnacles on the northern Trotternish peninsula.",
  "highlights":["Cinematic landscapes","The Table & The Needle","Coast-to-ridge views"],
  "gradient":"from-forest-highland to-mist","lat":57.6436,"lng":-6.2718,"image":"/cards/quiraing-loop.jpg",
  "description":["The Quiraing is a surreal landscape of landslips, hidden plateaus and jagged pinnacles on the northern Trotternish ridge of Skye. This circular route traverses beneath dramatic rock formations with names like the Table, the Needle and the Prison, offering some of the most cinematic scenery in Scotland.","The path is narrow and exposed in places, with a few steep, eroded sections, so a head for heights and careful footing help. The light here is extraordinary at dawn and dusk."]},
 {"id":"cairngorm-plateau","name":"Cairn Gorm Plateau","region":"Cairngorms","difficulty":"Expert","distance_km":18,"ascent_m":900,"duration_hours":9,"days":1,
  "terrain":["Mountain","Moorland"],"seasons":["Summer"],"dog_friendly":false,
  "summary":"A high, exposed arctic plateau crossing for experienced hill-walkers with serious navigation skills.",
  "highlights":["Sub-arctic plateau","Remote & exposed","Multiple Munros"],
  "gradient":"from-forest-darkest to-forest-dark","lat":57.1175,"lng":-3.6783,"image":"/cards/cairngorm-plateau.jpg",
  "description":["A crossing of the Cairn Gorm plateau is a true mountain expedition across one of the few sub-arctic environments in Britain. High, remote and exposed, the plateau links several Munros over rough, featureless terrain where the weather can turn in minutes.","This route is for experienced hill-walkers with solid navigation skills and full mountain kit — in poor visibility, map-and-compass competence is essential. The reward is a vast, otherworldly wilderness unlike anywhere else in the country."]},
 {"id":"falls-of-bruar","name":"Falls of Bruar","region":"Highlands","difficulty":"Easy","distance_km":2.5,"ascent_m":110,"duration_hours":1,"days":1,
  "terrain":["Forest"],"seasons":["Spring","Summer","Autumn","Winter"],"dog_friendly":true,
  "summary":"A short, rewarding woodland walk to a series of tumbling waterfalls and stone bridges near Blair Atholl.",
  "highlights":["Cascading waterfalls","Stone arch bridges","Quick & scenic"],
  "gradient":"from-forest-highland to-mist","lat":56.7815,"lng":-3.9175,"image":"/cards/falls-of-bruar.jpg",
  "description":["A short, rewarding woodland walk near Blair Atholl leads to the spectacular Falls of Bruar, a series of cascades tumbling through a rocky gorge. Stone bridges and viewing points — laid out after Robert Burns petitioned for the woods to be planted — frame the falls beautifully.","The path is well-made but climbs steadily, with steps in places. It's an ideal leg-stretcher for all ages and especially impressive after rain when the falls are in full flow."]},
 {"id":"ben-lomond","name":"Ben Lomond","region":"Loch Lomond & Trossachs","difficulty":"Challenging","distance_km":12,"ascent_m":974,"duration_hours":5,"days":1,
  "terrain":["Mountain","Loch"],"seasons":["Spring","Summer","Autumn"],"dog_friendly":true,
  "summary":"The most southerly Munro, offering a satisfying ascent and superb views over the length of Loch Lomond.",
  "highlights":["Accessible first Munro","Loch Lomond panoramas","Well-maintained path"],
  "gradient":"from-forest-dark to-forest-highland","lat":56.19,"lng":-4.633,"image":"/cards/ben-lomond.jpg",
  "description":["Ben Lomond is the most southerly of Scotland's Munros and one of the most popular, rising 974 metres directly above the eastern shore of Loch Lomond. The well-trodden Tourist Path climbs steadily to a fine summit ridge with sweeping views down the length of the loch and across the Trossachs.","A good first Munro for fit walkers, it's a half- to full-day outing on a clear path, though the upper slopes are exposed to the weather. Its proximity to Glasgow makes it busy on summer weekends."]},
 {"id":"st-cuthberts-way","name":"St Cuthbert's Way (Scottish Section)","region":"Borders","difficulty":"Moderate","distance_km":45,"ascent_m":1100,"duration_hours":0,"days":3,
  "terrain":["Moorland","Forest","Glen"],"seasons":["Spring","Summer","Autumn"],"dog_friendly":true,
  "summary":"A gentle multi-day pilgrim trail through the rolling Scottish Borders, rich in history and quiet countryside.",
  "highlights":["Historic pilgrim route","Rolling Borders scenery","Charming villages"],
  "gradient":"from-forest-highland to-mist","lat":55.58,"lng":-2.5,"image":"/cards/st-cuthberts-way.jpg",
  "description":["St Cuthbert's Way is a gentle long-distance pilgrim trail winding through the rolling Scottish Borders, following in the footsteps of the 7th-century saint. The Scottish section passes quiet farmland, river valleys and historic villages, with welcoming tea rooms and inns en route.","Spread comfortably over three days, it's ideal for walkers who prefer mileage and history over mountains. The terrain is mostly easy underfoot, making it a relaxed introduction to multi-day walking."]}
]
$json$::jsonb) as x(
  id text, name text, region text, difficulty text, distance_km numeric, ascent_m integer,
  duration_hours numeric, days integer, terrain jsonb, seasons jsonb, dog_friendly boolean,
  summary text, description jsonb, highlights jsonb, gradient text,
  lat double precision, lng double precision, image text
)
on conflict (id) do nothing;

-- 7) Seed: Unterkünfte --------------------------------------------------------
insert into public.stays (id, name, type, region, price_per_night, rating, amenities, summary, gradient, lat, lng)
select id, name, type, region, price_per_night, rating, amenities, summary, gradient, lat, lng
from jsonb_to_recordset($json$
[
 {"id":"glen-nevis-lodge","name":"Glen Nevis Lodge","type":"Lodge","region":"Highlands","price_per_night":140,"rating":4.8,"amenities":["Mountain views","Drying room","Breakfast included","Parking"],"summary":"A cosy timber lodge at the foot of Ben Nevis, perfect for an early summit start.","gradient":"from-forest-darkest to-forest-highland","lat":56.796,"lng":-5.068},
 {"id":"portree-harbour-bnb","name":"Portree Harbour B&B","type":"B&B","region":"Isle of Skye","price_per_night":110,"rating":4.7,"amenities":["Harbour views","Home-cooked breakfast","Packed lunches","WiFi"],"summary":"A warm, family-run B&B overlooking Portree's colourful harbour, central for Skye's trails.","gradient":"from-forest-highland to-mist","lat":57.4118,"lng":-6.1934},
 {"id":"cairngorm-bunkhouse","name":"Cairngorm Bunkhouse","type":"Hostel","region":"Cairngorms","price_per_night":38,"rating":4.5,"amenities":["Shared kitchen","Drying room","Bike storage","Communal lounge"],"summary":"A friendly, budget-friendly hostel close to Aviemore and the Cairngorm trailheads.","gradient":"from-forest-dark to-forest-highland","lat":57.1955,"lng":-3.8265},
 {"id":"rannoch-bothy","name":"Rannoch Moor Bothy","type":"Bothy","region":"Loch Lomond & Trossachs","price_per_night":0,"rating":4.2,"amenities":["Wild & remote","Wood stove","No booking needed","Off-grid"],"summary":"A simple, free mountain shelter on the edge of Rannoch Moor for true wilderness nights.","gradient":"from-forest-darkest to-forest-dark","lat":56.61,"lng":-4.72},
 {"id":"glencoe-campsite","name":"Glencoe Riverside Campsite","type":"Campsite","region":"Glencoe","price_per_night":22,"rating":4.6,"amenities":["Riverside pitches","Hot showers","Camp shop","Pet friendly"],"summary":"Pitch beside a Highland river surrounded by Glencoe's towering peaks.","gradient":"from-forest-highland to-mist","lat":56.685,"lng":-5.098},
 {"id":"trossachs-country-hotel","name":"Trossachs Country Hotel","type":"Hotel","region":"Loch Lomond & Trossachs","price_per_night":195,"rating":4.9,"amenities":["Spa & sauna","Restaurant","Loch views","Free parking"],"summary":"A refined country hotel for those who like to soak away the miles in comfort.","gradient":"from-forest-darkest to-forest-highland","lat":56.2447,"lng":-4.2155},
 {"id":"borders-farmhouse","name":"Borders Farmhouse Stay","type":"B&B","region":"Borders","price_per_night":95,"rating":4.6,"amenities":["Working farm","Hearty breakfast","Quiet countryside","Dog friendly"],"summary":"A peaceful farmhouse in the rolling Borders, ideal for gentle multi-day rambles.","gradient":"from-forest-highland to-mist","lat":55.58,"lng":-2.6},
 {"id":"skye-glamping-pods","name":"Skye Glamping Pods","type":"Lodge","region":"Isle of Skye","price_per_night":130,"rating":4.7,"amenities":["Heated pods","Dark-sky views","Private deck","Kitchenette"],"summary":"Snug insulated pods under Skye's famous dark skies, a step up from camping.","gradient":"from-forest-dark to-forest-highland","lat":57.3,"lng":-6.2}
]
$json$::jsonb) as x(
  id text, name text, type text, region text, price_per_night numeric, rating numeric,
  amenities jsonb, summary text, gradient text, lat double precision, lng double precision
)
on conflict (id) do nothing;

-- 8) FK: tour_departures.tour_id -> tours.id (jetzt, da Touren existieren) -----
alter table public.tour_departures
  add constraint tour_departures_tour_id_fkey
  foreign key (tour_id) references public.tours (id) on delete cascade;
