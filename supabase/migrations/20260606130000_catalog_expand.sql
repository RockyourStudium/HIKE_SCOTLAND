-- =============================================================================
-- Katalog erweitern: zusätzliche tours / routes / stays
-- =============================================================================
-- Additive Migration (Phase 4): bringt den Katalog auf >= 20 Einträge je Typ.
-- Inhalte sind eigenständig formuliert (von Walkhighlands inspiriert, nicht
-- übernommen). Card-Bilder unter /cards/<id>.jpg sind Remixe vorhandener Fotos.
-- Stays bleiben bewusst ohne Bild (nur gradient) — Fotos folgen separat.
-- IDs = Slugs (text PK), `on conflict do nothing` macht das Re-Run sicher.
-- =============================================================================

-- 1) Touren (+14, Ziel 20) ----------------------------------------------------
insert into public.tours (id, name, region, difficulty, days, group_size, price_per_person, guided, summary, description, includes, gradient, lat, lng, image)
select id, name, region, difficulty, days, group_size, price_per_person, guided, summary, description, includes, gradient, lat, lng, image
from jsonb_to_recordset($json$
[
 {"id":"torridon-munro-masterclass","name":"Torridon Munro Masterclass","region":"Highlands","difficulty":"Challenging","days":5,"group_size":"4–8 people","price_per_person":890,"guided":true,
  "summary":"Five days bagging the great sandstone giants of Torridon with a qualified mountain leader honing your hill skills.",
  "includes":["Qualified mountain leader","4 nights accommodation","Navigation coaching","Most evening meals"],
  "gradient":"from-forest-darkest to-forest-highland","lat":57.55,"lng":-5.5,"image":"/cards/torridon-munro-masterclass.jpg",
  "description":["Torridon holds some of the oldest and most dramatic mountains in Britain, their terraced sandstone walls rising straight from sea-level lochs. Over five days you'll tackle classic peaks such as Liathach and Beinn Eighe under the eye of a qualified mountain leader who treats every summit as a chance to sharpen your hill craft.","This is as much a skills course as a tour: pacing, navigation, route choice and confidence on steep, rocky ground. Four nights' accommodation and most evening meals are included. Fit, regular hill-walkers will come away ready for bigger, wilder days."]},
 {"id":"knoydart-wilderness-expedition","name":"Knoydart Wilderness Expedition","region":"Highlands","difficulty":"Expert","days":4,"group_size":"4–6 people","price_per_person":960,"guided":true,
  "summary":"A committing expedition into Britain's last great wilderness, reached only by boat or a long walk-in over the hills.",
  "includes":["Expedition leader","Boat transfer to Inverie","3 nights remote lodge","All meals on the hill"],
  "gradient":"from-forest-darkest to-forest-dark","lat":57.05,"lng":-5.65,"image":"/cards/knoydart-wilderness-expedition.jpg",
  "description":["The Knoydart peninsula has no through-road — you arrive by boat across Loch Nevis or on foot over remote passes. That isolation is exactly the point. Over four days our small group crosses rough, trackless country between two of the most coveted Munros in Scotland, Ladhar Bheinn and Luinne Bheinn.","With an experienced expedition leader, a boat transfer, three nights in a remote lodge and all meals carried on the hill, this is a serious undertaking for experienced, very fit walkers who are comfortable with long days and changeable weather far from help."]},
 {"id":"great-glen-way-supported","name":"Great Glen Way — Supported","region":"Highlands","difficulty":"Moderate","days":6,"group_size":"Self-guided","price_per_person":830,"guided":false,
  "summary":"Follow the geological fault line from Fort William to Inverness with luggage transfers and pre-booked stays.",
  "includes":["Daily luggage transfer","5 nights accommodation","Route maps & app","24/7 support line"],
  "gradient":"from-forest-dark to-forest-highland","lat":57.144,"lng":-4.679,"image":"/cards/great-glen-way-supported.jpg",
  "description":["The Great Glen Way traces the dead-straight geological fault that splits the Highlands from coast to coast, linking Fort William and Inverness along towpaths, forest tracks and the shores of Loch Ness. At a gentler grade than the West Highland Way, it's an ideal first long-distance trail.","This six-day self-guided package handles the logistics — luggage moved ahead each day, accommodation pre-booked and a detailed route pack and app provided — so you simply walk from one lochside village to the next at your own pace."]},
 {"id":"skye-trotternish-traverse","name":"Skye Trotternish Traverse","region":"Isle of Skye","difficulty":"Challenging","days":3,"group_size":"6–10 people","price_per_person":540,"guided":true,
  "summary":"Walk the full switchback spine of the Trotternish ridge, from the Storr to the Quiraing, over three guided days.",
  "includes":["Local guide","2 nights accommodation","Daily transport to start points","Packed lunches"],
  "gradient":"from-forest-highland to-mist","lat":57.55,"lng":-6.23,"image":"/cards/skye-trotternish-traverse.jpg",
  "description":["The Trotternish ridge is the longest continuous escarpment in Britain, a 30-kilometre rollercoaster of grassy summits and crumbling cliffs created by the largest landslip in the country. Over three days we link its finest sections, from the pinnacles of the Storr to the chaos of the Quiraing.","A local guide handles route choice and daily transport between start and finish points, so you walk the ridge unencumbered. Two nights' accommodation and packed lunches are included. Reasonable fitness and a head for exposed ground are essential."]},
 {"id":"skye-coastal-wildlife-walk","name":"Skye Coastal Wildlife Walk","region":"Isle of Skye","difficulty":"Easy","days":2,"group_size":"4–10 people","price_per_person":300,"guided":true,
  "summary":"A gentle two days along Skye's western shores watching for sea eagles, otters, seals and whales.",
  "includes":["Wildlife guide","1 night accommodation","Binoculars provided","Coastal transport"],
  "gradient":"from-forest-dark to-forest-highland","lat":57.423,"lng":-6.786,"image":"/cards/skye-coastal-wildlife-walk.jpg",
  "description":["Skye's indented western coastline is one of the best places in Britain to see wildlife from the path. Over two relaxed days we walk the low cliffs and headlands around Neist Point and Waternish, scanning for white-tailed sea eagles, otters working the tideline, seals hauled out on the skerries and, in season, minke whales offshore.","With a knowledgeable wildlife guide, binoculars provided and short, easy walking each day, it suits all abilities. One night's accommodation and coastal transport are included — bring a camera and patience."]},
 {"id":"cairngorms-munro-bagging","name":"Cairngorms Munro Bagging","region":"Cairngorms","difficulty":"Challenging","days":4,"group_size":"4–8 people","price_per_person":720,"guided":true,
  "summary":"Bag a clutch of the high Cairngorm Munros, including Ben Macdui, the second-highest peak in Britain.",
  "includes":["Mountain leader","3 nights accommodation","All hill transport","Most breakfasts & dinners"],
  "gradient":"from-forest-darkest to-forest-dark","lat":57.07,"lng":-3.67,"image":"/cards/cairngorms-munro-bagging.jpg",
  "description":["The Cairngorms hold the largest area of high ground in Britain — a rolling arctic plateau studded with Munros that can be linked into big, satisfying rounds. Over four days, led by a mountain leader, you'll climb several of them, including Ben Macdui, the second-highest summit in the land.","This is wild, exposed terrain where navigation matters, so the days are properly led and the pace honest. Three nights' accommodation, all hill transport and most meals are included. Aimed at fit walkers looking to grow a Munro tally efficiently and safely."]},
 {"id":"speyside-whisky-trail-walk","name":"Speyside Whisky Trail Walk","region":"Cairngorms","difficulty":"Easy","days":3,"group_size":"6–12 people","price_per_person":520,"guided":true,
  "summary":"An easygoing amble along the River Spey linking riverside paths, old railway lines and a distillery or two.",
  "includes":["Friendly guide","2 nights accommodation","Distillery tour & tasting","Luggage transfer"],
  "gradient":"from-forest-highland to-mist","lat":57.47,"lng":-3.23,"image":"/cards/speyside-whisky-trail-walk.jpg",
  "description":["This gentle three-day walk follows the River Spey through the heart of malt-whisky country, linking riverside paths and the green corridor of a disused railway. The walking is flat and forgiving, threading between distilleries, old stone bridges and salmon pools.","Each day ends in a comfortable inn, with a guided distillery tour and tasting built into the itinerary. Two nights' accommodation and luggage transfers are included. It's a relaxed, sociable trip for those who like their miles seasoned with a dram."]},
 {"id":"glencoe-ridge-scramble","name":"Glencoe Ridge Scramble","region":"Glencoe","difficulty":"Expert","days":2,"group_size":"2–4 people","price_per_person":420,"guided":true,
  "summary":"Tackle the notorious Aonach Eagach, mainland Britain's narrowest ridge, roped up with a mountain guide.",
  "includes":["Qualified mountain guide","Ropes & helmets","1 night accommodation","Safety briefing"],
  "gradient":"from-forest-darkest to-forest-highland","lat":56.68,"lng":-5.05,"image":"/cards/glencoe-ridge-scramble.jpg",
  "description":["The Aonach Eagach is the finest and most serious ridge scramble on the British mainland — a knife-edge traverse of pinnacles and exposed steps high above Glencoe, with no easy escape once committed. Roped up with a qualified mountain guide, you'll move across it safely while soaking up some of the most heart-stopping situations in the country.","Technical equipment, a thorough safety briefing and one night's accommodation are included. This is strictly for confident scramblers with a strong head for heights — the guide keeps the margins safe, but the exposure is real."]},
 {"id":"glencoe-family-adventure","name":"Glencoe Family Adventure","region":"Glencoe","difficulty":"Easy","days":2,"group_size":"Families","price_per_person":260,"guided":true,
  "summary":"Two relaxed, story-filled days in Glencoe built for families, mixing short walks with history and wildlife.",
  "includes":["Family guide","1 night accommodation","Kids' activity pack","Visitor centre entry"],
  "gradient":"from-forest-highland to-mist","lat":56.69,"lng":-5.1,"image":"/cards/glencoe-family-adventure.jpg",
  "description":["Glencoe's wild beauty and dark history make it a brilliant place to spark a child's love of the outdoors. These two gentle days mix short, achievable walks with tales of the MacDonalds, hidden waterfalls and minibeast hunts, all paced for young legs and short attention spans.","A friendly family guide keeps everyone engaged, with an activity pack for the kids and entry to the visitor centre included, plus one night's accommodation. No experience needed — just wellies and a sense of adventure."]},
 {"id":"loch-lomond-islands-kayak-hike","name":"Loch Lomond Islands Kayak & Hike","region":"Loch Lomond & Trossachs","difficulty":"Moderate","days":2,"group_size":"4–8 people","price_per_person":380,"guided":true,
  "summary":"Combine paddling to the wooded islands of Loch Lomond with a hill walk above the bonnie banks.",
  "includes":["Kayak guide & gear","1 night accommodation","Hill-walk day","Packed lunches"],
  "gradient":"from-forest-dark to-forest-highland","lat":56.103,"lng":-4.638,"image":"/cards/loch-lomond-islands-kayak-hike.jpg",
  "description":["Loch Lomond is dotted with wooded islands that are best reached under your own steam. Day one we paddle out among them by kayak, landing on quiet shingle beaches and looking for the loch's herons and ospreys. Day two swaps the water for the hills, climbing for a high view back over the whole island-studded loch.","All kayaking equipment and guiding, one night's accommodation and packed lunches are included. A little fitness and a willingness to get wet go a long way — no paddling experience required."]},
 {"id":"trossachs-three-lochs-tour","name":"Trossachs Three Lochs Tour","region":"Loch Lomond & Trossachs","difficulty":"Moderate","days":4,"group_size":"Self-guided","price_per_person":560,"guided":false,
  "summary":"A self-guided loop through the Trossachs linking Loch Katrine, Loch Achray and Loch Venachar.",
  "includes":["Daily luggage transfer","3 nights accommodation","Route maps & app","Steamship cruise ticket"],
  "gradient":"from-forest-highland to-mist","lat":56.246,"lng":-4.382,"image":"/cards/trossachs-three-lochs-tour.jpg",
  "description":["The Trossachs packed so much beauty into a small area that the Victorians called it the Highlands in miniature. This four-day self-guided loop links three of its loveliest lochs on forest tracks and old drove roads, with a heritage steamship cruise on Loch Katrine breaking up the walking.","Luggage is moved between comfortable stays each day and a full route pack and app keep you on track. It's an unhurried introduction to multi-day walking, with big scenery and gentle logistics."]},
 {"id":"ben-lomond-guided-ascent","name":"Ben Lomond Guided Ascent","region":"Loch Lomond & Trossachs","difficulty":"Moderate","days":1,"group_size":"4–10 people","price_per_person":110,"guided":true,
  "summary":"A guided day up the most southerly Munro — the perfect first big hill with expert support.",
  "includes":["Mountain leader","Transport from Glasgow","Safety equipment","Summit coaching"],
  "gradient":"from-forest-dark to-forest-highland","lat":56.19,"lng":-4.633,"image":"/cards/ben-lomond-guided-ascent.jpg",
  "description":["Ben Lomond is the classic introduction to Munro-bagging: a clear path, a fine ridge and a summit view down the length of Loch Lomond. On this guided day, a mountain leader looks after navigation, pacing and safety so you can focus on the climb and learn the ropes for future hills.","Transport from Glasgow, safety equipment and on-the-hill coaching are included. It suits anyone with reasonable fitness who wants to bag their first Munro in good company and confidence."]},
 {"id":"borders-abbeys-pilgrim-tour","name":"Borders Abbeys Pilgrim Tour","region":"Borders","difficulty":"Easy","days":4,"group_size":"Self-guided","price_per_person":490,"guided":false,
  "summary":"A self-guided walk between the four great ruined abbeys of the Scottish Borders along quiet riverside ways.",
  "includes":["Daily luggage transfer","3 nights B&B","Route maps & app","Abbey guidebook"],
  "gradient":"from-forest-highland to-mist","lat":55.6,"lng":-2.72,"image":"/cards/borders-abbeys-pilgrim-tour.jpg",
  "description":["The Borders Abbeys Way links the romantic ruins of Melrose, Dryburgh, Kelso and Jedburgh, founded by King David I in the 12th century and shattered by centuries of border warfare. This gentle four-day self-guided walk connects them on riverside paths and old railway lines through soft, rolling countryside.","Luggage is transferred between welcoming B&Bs, and a route pack, app and abbey guidebook are provided. With easy terrain and history at every turn, it's ideal for walkers who like their days steady and steeped in story."]},
 {"id":"southern-upland-borders-trek","name":"Southern Upland Borders Trek","region":"Borders","difficulty":"Challenging","days":5,"group_size":"6–10 people","price_per_person":880,"guided":true,
  "summary":"A guided trek across the wild, empty hills of the Southern Uplands, Scotland's least-walked range.",
  "includes":["Mountain leader","4 nights accommodation","All transport","Most meals"],
  "gradient":"from-forest-darkest to-forest-dark","lat":55.33,"lng":-3.44,"image":"/cards/southern-upland-borders-trek.jpg",
  "description":["The Southern Uplands are Scotland's forgotten hills — vast, rounded, grassy ranges crossed by few paths and even fewer people. Over five guided days we trek through their heart around Moffat and the Ettrick hills, taking in tumbling waterfalls, remote bothies and huge, lonely skies.","With a mountain leader, four nights' accommodation, all transport and most meals included, this is a trek for fit walkers who value solitude over crowds. Expect pathless ground, big mileage and the rare pleasure of having a whole range to yourself."]}
]
$json$::jsonb) as x(
  id text, name text, region text, difficulty text, days integer, group_size text,
  price_per_person numeric, guided boolean, summary text, description jsonb,
  includes jsonb, gradient text, lat double precision, lng double precision, image text
)
on conflict (id) do nothing;

-- 2) Routen (+10, Ziel 20) ----------------------------------------------------
insert into public.routes (id, name, region, difficulty, distance_km, ascent_m, duration_hours, days, terrain, seasons, dog_friendly, summary, description, highlights, gradient, lat, lng, image)
select id, name, region, difficulty, distance_km, ascent_m, duration_hours, days, terrain, seasons, dog_friendly, summary, description, highlights, gradient, lat, lng, image
from jsonb_to_recordset($json$
[
 {"id":"fairy-pools-glen-brittle","name":"The Fairy Pools","region":"Isle of Skye","difficulty":"Easy","distance_km":4.4,"ascent_m":140,"duration_hours":1.5,"days":1,
  "terrain":["Glen","Mountain"],"seasons":["Spring","Summer","Autumn"],"dog_friendly":true,
  "summary":"A short, magical walk to a string of crystal-clear plunge pools and waterfalls beneath the Black Cuillin.",
  "highlights":["Crystal-clear pools","Waterfall after waterfall","Black Cuillin backdrop"],
  "gradient":"from-forest-highland to-mist","lat":57.25,"lng":-6.26,"image":"/cards/fairy-pools-glen-brittle.jpg",
  "description":["The Fairy Pools are a famous sequence of vivid blue-green plunge pools and waterfalls tumbling down Glen Brittle beneath the jagged ramparts of the Black Cuillin. A clear path follows the river upstream, passing pool after pool, each more photogenic than the last.","The walking is easy but the path can be muddy and involves a couple of stream crossings that swell after rain. Brave swimmers take a bracing dip in the pools. Arrive early to beat the crowds and catch the water at its clearest."]},
 {"id":"sgurr-na-stri","name":"Sgùrr na Strì","region":"Isle of Skye","difficulty":"Challenging","distance_km":21,"ascent_m":580,"duration_hours":8,"days":1,
  "terrain":["Mountain","Coastal"],"seasons":["Summer","Autumn"],"dog_friendly":true,
  "summary":"A long walk to a modest summit widely held to offer the finest mountain view in all of Scotland.",
  "highlights":["The best view in Scotland","Loch Coruisk wilderness","Heart of the Cuillin"],
  "gradient":"from-forest-darkest to-forest-highland","lat":57.2,"lng":-6.15,"image":"/cards/sgurr-na-stri.jpg",
  "description":["Sgùrr na Strì is barely 500 metres high, yet from its rocky top unfolds what many consider the greatest view in Scotland: the entire Black Cuillin ridge rising in a savage wall above the hidden waters of Loch Coruisk. Getting there is the price — a long, rough walk in from Sligachan or Elgol.","The route is pathless and boggy in places with some rocky ground, making for a committing full day. Pick settled weather and long daylight. The reward, sitting alone above Coruisk as the light moves across the Cuillin, is unforgettable."]},
 {"id":"meall-a-bhuachaille","name":"Meall a' Bhuachaille","region":"Cairngorms","difficulty":"Moderate","distance_km":10,"ascent_m":540,"duration_hours":4,"days":1,
  "terrain":["Mountain","Forest"],"seasons":["Spring","Summer","Autumn","Winter"],"dog_friendly":true,
  "summary":"A shapely hill above Glenmore giving a huge Cairngorm panorama for a fraction of the effort of the high tops.",
  "highlights":["Big plateau views","Green Lochan en route","An Lochan Uaine"],
  "gradient":"from-forest-dark to-forest-highland","lat":57.17,"lng":-3.69,"image":"/cards/meall-a-bhuachaille.jpg",
  "description":["Meall a' Bhuachaille, the shepherd's hill, stands above the pines of Glenmore and rewards a modest climb with one of the finest viewpoints in the Cairngorms — the whole high plateau laid out across the valley. The usual round passes the jewel-like An Lochan Uaine, the green lochan, on the way.","A good path leads through forest then open hillside to a wind-shelter cairn on top. It's a manageable half-day for most fit walkers and works in winter with the right kit, when the surrounding tops gleam under snow."]},
 {"id":"ryvoan-pass","name":"Ryvoan Pass & the Green Lochan","region":"Cairngorms","difficulty":"Easy","distance_km":7,"ascent_m":120,"duration_hours":2,"days":1,
  "terrain":["Forest","Glen"],"seasons":["Spring","Summer","Autumn","Winter"],"dog_friendly":true,
  "summary":"An easy through-pass walk past the famously emerald An Lochan Uaine, framed by ancient pinewood.",
  "highlights":["Emerald green lochan","Ancient Caledonian pines","Easy & family-friendly"],
  "gradient":"from-forest-highland to-mist","lat":57.17,"lng":-3.66,"image":"/cards/ryvoan-pass.jpg",
  "description":["The Ryvoan Pass is a gentle highland gateway leading out of Glenmore through old Caledonian pinewood and into wilder country beyond. Its star is An Lochan Uaine, the green lochan, whose startling emerald colour is said by locals to come from fairies washing their clothes in it.","The walking is flat and easy on good tracks, making it ideal for families and an excellent low-level option when the high tops are out of condition. Look for crested tits and crossbills among the pines."]},
 {"id":"aonach-eagach-ridge","name":"Aonach Eagach Ridge","region":"Glencoe","difficulty":"Expert","distance_km":9.5,"ascent_m":1100,"duration_hours":8,"days":1,
  "terrain":["Mountain"],"seasons":["Summer","Autumn"],"dog_friendly":false,
  "summary":"Mainland Britain's narrowest ridge — a sustained, exposed scramble high above Glencoe with no escape.",
  "highlights":["Knife-edge ridge","Sustained scrambling","Two Munros"],
  "gradient":"from-forest-darkest to-forest-dark","lat":56.685,"lng":-5.04,"image":"/cards/aonach-eagach-ridge.jpg",
  "description":["The Aonach Eagach is the most celebrated ridge scramble on the British mainland, a notched crest of pinnacles linking the Munros Meall Dearg and Sgorr nam Fiannaidh high above Glencoe. Once on the ridge proper there is no safe way off until the far end — it is a serious, committing day.","Sustained grade-2 scrambling with severe exposure makes this strictly for experienced, confident scramblers with a strong head for heights, or those going with a guide. In the wrong conditions it is genuinely dangerous; in the right ones it is the trip of a lifetime."]},
 {"id":"buachaille-etive-mor","name":"Buachaille Etive Mòr — Stob Dearg","region":"Glencoe","difficulty":"Challenging","distance_km":9,"ascent_m":1000,"duration_hours":6,"days":1,
  "terrain":["Mountain","Glen"],"seasons":["Summer","Autumn"],"dog_friendly":false,
  "summary":"Climb the great pyramid that guards the entrance to Glencoe, one of the most photographed mountains in Scotland.",
  "highlights":["Iconic mountain pyramid","Coire na Tulaich ascent","Rannoch Moor panorama"],
  "gradient":"from-forest-darkest to-forest-highland","lat":56.642,"lng":-4.901,"image":"/cards/buachaille-etive-mor.jpg",
  "description":["The Buachaille — the herdsman of Etive — is the perfect mountain pyramid standing guard where Rannoch Moor meets Glencoe, and few sights in Scotland are more iconic. The walkers' route climbs steeply into the hidden bowl of Coire na Tulaich before a final pull to the summit of Stob Dearg.","This is a proper mountain day with a steep, loose upper section and an airy top, demanding good fitness and sure footing. From the summit the view across the vast emptiness of Rannoch Moor is immense."]},
 {"id":"conic-hill","name":"Conic Hill","region":"Loch Lomond & Trossachs","difficulty":"Easy","distance_km":5,"ascent_m":270,"duration_hours":2.5,"days":1,
  "terrain":["Mountain","Loch"],"seasons":["Spring","Summer","Autumn","Winter"],"dog_friendly":true,
  "summary":"A short climb on the Highland Boundary Fault for a classic view over the islands of Loch Lomond.",
  "highlights":["Island-studded loch view","Stands on the Highland fault","Quick big reward"],
  "gradient":"from-forest-highland to-mist","lat":56.077,"lng":-4.566,"image":"/cards/conic-hill.jpg",
  "description":["Conic Hill rises straight from the village of Balmaha on the very line of the Highland Boundary Fault — the geological seam between Lowland and Highland Scotland. The chain of islands marching across Loch Lomond below follows the same fault, and from the top the view of them is simply superb.","A clear path on the West Highland Way climbs steadily to the airy summit ridge in under an hour of effort. It's a short outing with an outsized reward, and a brilliant first hill for families and newcomers."]},
 {"id":"ben-aan","name":"Ben A'an","region":"Loch Lomond & Trossachs","difficulty":"Moderate","distance_km":3.8,"ascent_m":340,"duration_hours":2.5,"days":1,
  "terrain":["Mountain","Forest","Loch"],"seasons":["Spring","Summer","Autumn","Winter"],"dog_friendly":true,
  "summary":"A miniature mountain with an outsized view over Loch Katrine and the heart of the Trossachs.",
  "highlights":["Big view, small hill","Loch Katrine panorama","Trossachs classic"],
  "gradient":"from-forest-dark to-forest-highland","lat":56.246,"lng":-4.41,"image":"/cards/ben-aan.jpg",
  "description":["Ben A'an is the little mountain that punches far above its weight. Though barely 450 metres high, its rocky summit cone surveys the length of Loch Katrine and the wooded hills of the Trossachs in a view that has drawn walkers and painters for two centuries.","A good but steep path climbs through forest and onto open hillside, with a short rocky finish to the top. It's a steady couple of hours up and the perfect introduction to hill-walking, rewarding modest effort with a truly memorable panorama."]},
 {"id":"eildon-hills","name":"The Eildon Hills","region":"Borders","difficulty":"Moderate","distance_km":9,"ascent_m":420,"duration_hours":3.5,"days":1,
  "terrain":["Moorland","Forest"],"seasons":["Spring","Summer","Autumn","Winter"],"dog_friendly":true,
  "summary":"The three distinctive peaks above Melrose, steeped in Roman history and Borders legend.",
  "highlights":["Three shapely summits","Roman & Arthurian lore","Sweeping Tweed valley views"],
  "gradient":"from-forest-highland to-mist","lat":55.585,"lng":-2.7,"image":"/cards/eildon-hills.jpg",
  "description":["The triple summits of the Eildon Hills loom over the abbey town of Melrose and dominate the central Borders. The Romans built a great signal station and fort on their slopes, and local legend has King Arthur and his knights sleeping beneath them awaiting a call to arms.","A circular walk climbs over two of the three peaks on grassy paths, with the silver thread of the River Tweed winding through the patchwork country below. It's a rewarding half-day with history, legend and a genuinely panoramic view."]},
 {"id":"grey-mares-tail","name":"Grey Mare's Tail","region":"Borders","difficulty":"Moderate","distance_km":4,"ascent_m":350,"duration_hours":2.5,"days":1,
  "terrain":["Moorland","Mountain"],"seasons":["Spring","Summer","Autumn"],"dog_friendly":true,
  "summary":"A steep path beside one of Britain's highest waterfalls to a hidden upland loch in the Moffat hills.",
  "highlights":["200 ft waterfall","Hanging valley loch","Wild goats & peregrines"],
  "gradient":"from-forest-dark to-forest-highland","lat":55.41,"lng":-3.31,"image":"/cards/grey-mares-tail.jpg",
  "description":["The Grey Mare's Tail is a spectacular 60-metre waterfall plunging from a hanging valley in the wild Moffat hills, one of the highest falls in Britain. A steep but rewarding path climbs alongside it to the lonely Loch Skeen cradled in the hills above.","The lower path is dramatic and the upper section rougher and boggier, so good footwear helps. Wild goats graze the slopes and peregrine falcons nest on the crags. Take care near the unfenced drops, especially with children or dogs."]}
]
$json$::jsonb) as x(
  id text, name text, region text, difficulty text, distance_km numeric, ascent_m integer,
  duration_hours numeric, days integer, terrain jsonb, seasons jsonb, dog_friendly boolean,
  summary text, description jsonb, highlights jsonb, gradient text,
  lat double precision, lng double precision, image text
)
on conflict (id) do nothing;

-- 3) Unterkünfte (+12, Ziel 20) ----------------------------------------------
insert into public.stays (id, name, type, region, price_per_night, rating, amenities, summary, gradient, lat, lng)
select id, name, type, region, price_per_night, rating, amenities, summary, gradient, lat, lng
from jsonb_to_recordset($json$
[
 {"id":"fort-william-station-hotel","name":"Fort William Station Hotel","type":"Hotel","region":"Highlands","price_per_night":165,"rating":4.6,"amenities":["Town-centre location","Restaurant & bar","Drying room","Free parking"],"summary":"A comfortable base in the Outdoor Capital of the UK, steps from the West Highland Way finish.","gradient":"from-forest-darkest to-forest-highland","lat":56.82,"lng":-5.105},
 {"id":"torridon-youth-hostel","name":"Torridon Youth Hostel","type":"Hostel","region":"Highlands","price_per_night":32,"rating":4.4,"amenities":["Under the Torridon giants","Self-catering kitchen","Drying room","Bike store"],"summary":"A simple, well-placed hostel right beneath the great sandstone mountains of Torridon.","gradient":"from-forest-dark to-forest-highland","lat":57.545,"lng":-5.5},
 {"id":"shieldaig-coastal-bnb","name":"Shieldaig Coastal B&B","type":"B&B","region":"Highlands","price_per_night":120,"rating":4.8,"amenities":["Sea-loch views","Home-cooked breakfast","Packed lunches","WiFi"],"summary":"A welcoming B&B on a quiet sea loch in the heart of Wester Ross.","gradient":"from-forest-highland to-mist","lat":57.52,"lng":-5.65},
 {"id":"sligachan-bunkhouse","name":"Sligachan Bunkhouse","type":"Hostel","region":"Isle of Skye","price_per_night":42,"rating":4.5,"amenities":["Foot of the Cuillin","Adjacent inn & bar","Drying room","Self-catering kitchen"],"summary":"A climbers' and walkers' bunkhouse at the legendary crossroads beneath the Cuillin.","gradient":"from-forest-darkest to-forest-dark","lat":57.29,"lng":-6.17},
 {"id":"dunvegan-sea-view-lodge","name":"Dunvegan Sea View Lodge","type":"Lodge","region":"Isle of Skye","price_per_night":150,"rating":4.7,"amenities":["Loch-front deck","Self-catering","Wood-burning stove","Dark-sky views"],"summary":"A snug self-catering lodge overlooking Loch Dunvegan on Skye's quieter west side.","gradient":"from-forest-dark to-forest-highland","lat":57.44,"lng":-6.59},
 {"id":"aviemore-pine-lodge","name":"Aviemore Pine Lodge","type":"Lodge","region":"Cairngorms","price_per_night":135,"rating":4.6,"amenities":["Forest setting","Hot tub","Drying room","Ski & bike storage"],"summary":"A timber lodge among the pines, perfectly placed for the Cairngorm trailheads.","gradient":"from-forest-highland to-mist","lat":57.19,"lng":-3.83},
 {"id":"glenmore-campsite","name":"Glenmore Lochside Campsite","type":"Campsite","region":"Cairngorms","price_per_night":24,"rating":4.7,"amenities":["Loch Morlich shore","Beach & watersports","Hot showers","Camp shop"],"summary":"Pitch beside the sandy shore of Loch Morlich with the high Cairngorms behind.","gradient":"from-forest-dark to-forest-highland","lat":57.17,"lng":-3.7},
 {"id":"braemar-coaching-inn","name":"Braemar Coaching Inn","type":"Hotel","region":"Cairngorms","price_per_night":175,"rating":4.8,"amenities":["Historic inn","Restaurant","Whisky bar","Log fires"],"summary":"A characterful old coaching inn in the royal-Deeside village of Braemar.","gradient":"from-forest-darkest to-forest-highland","lat":57.006,"lng":-3.397},
 {"id":"glencoe-mountain-bothy","name":"Glencoe Mountain Bothy","type":"Bothy","region":"Glencoe","price_per_night":0,"rating":4.1,"amenities":["Wild & remote","Sleeping platform","No booking needed","Off-grid"],"summary":"A basic free shelter high in Glencoe for self-sufficient nights in wild country.","gradient":"from-forest-darkest to-forest-dark","lat":56.67,"lng":-4.97},
 {"id":"ballachulish-loch-hotel","name":"Ballachulish Loch Hotel","type":"Hotel","region":"Glencoe","price_per_night":155,"rating":4.7,"amenities":["Loch Leven views","Restaurant","Spa","Free parking"],"summary":"A relaxed lochside hotel at the mouth of Glencoe, ideal for soaking away big hill days.","gradient":"from-forest-highland to-mist","lat":56.686,"lng":-5.18},
 {"id":"balmaha-bunkhouse","name":"Balmaha Bunkhouse","type":"Hostel","region":"Loch Lomond & Trossachs","price_per_night":36,"rating":4.5,"amenities":["On the West Highland Way","Loch Lomond nearby","Drying room","Shared kitchen"],"summary":"A handy walkers' bunkhouse in Balmaha, right on the shore of Loch Lomond.","gradient":"from-forest-dark to-forest-highland","lat":56.09,"lng":-4.49},
 {"id":"melrose-abbey-bnb","name":"Melrose Abbey B&B","type":"B&B","region":"Borders","price_per_night":100,"rating":4.7,"amenities":["Beside the abbey","Hearty breakfast","Walled garden","Dog friendly"],"summary":"A genteel B&B beneath the rose-pink ruins of Melrose Abbey in the central Borders.","gradient":"from-forest-highland to-mist","lat":55.599,"lng":-2.726}
]
$json$::jsonb) as x(
  id text, name text, type text, region text, price_per_night numeric, rating numeric,
  amenities jsonb, summary text, gradient text, lat double precision, lng double precision
)
on conflict (id) do nothing;
