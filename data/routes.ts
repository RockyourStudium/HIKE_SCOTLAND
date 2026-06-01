import type { Coords, Route } from "./types";

const baseRoutes: Omit<Route, "image" | "description" | "coords">[] = [
  {
    id: "old-man-of-storr",
    name: "The Old Man of Storr",
    region: "Isle of Skye",
    difficulty: "Moderate",
    distanceKm: 3.8,
    ascentM: 320,
    durationHours: 2,
    days: 1,
    terrain: ["Mountain", "Moorland"],
    seasons: ["Spring", "Summer", "Autumn"],
    dogFriendly: true,
    summary:
      "An iconic, otherworldly pinnacle rising above the Trotternish ridge with sweeping views over the Sound of Raasay.",
    highlights: ["Dramatic rock pinnacles", "Panoramic sea views", "Great for photography"],
    gradient: "from-forest-darkest to-forest-highland",
  },
  {
    id: "ben-nevis-mountain-track",
    name: "Ben Nevis — Mountain Track",
    region: "Highlands",
    difficulty: "Challenging",
    distanceKm: 17,
    ascentM: 1352,
    durationHours: 8,
    days: 1,
    terrain: ["Mountain"],
    seasons: ["Summer", "Autumn"],
    dogFriendly: false,
    summary:
      "Summit the highest mountain in the British Isles via the well-trodden Mountain Track from Glen Nevis.",
    highlights: ["Britain's highest peak", "Big-day adventure", "Summit plateau views"],
    gradient: "from-forest-darkest to-forest-dark",
  },
  {
    id: "loch-an-eilein",
    name: "Loch an Eilein Circuit",
    region: "Cairngorms",
    difficulty: "Easy",
    distanceKm: 5.5,
    ascentM: 60,
    durationHours: 1.5,
    days: 1,
    terrain: ["Loch", "Forest"],
    seasons: ["Spring", "Summer", "Autumn", "Winter"],
    dogFriendly: true,
    summary:
      "A gentle, family-friendly loop around a tranquil loch with an island castle, framed by ancient Caledonian pine forest.",
    highlights: ["Ruined island castle", "Ancient pine forest", "Mostly flat & accessible"],
    gradient: "from-forest-highland to-mist",
  },
  {
    id: "glencoe-lost-valley",
    name: "The Lost Valley (Coire Gabhail)",
    region: "Glencoe",
    difficulty: "Moderate",
    distanceKm: 4.5,
    ascentM: 340,
    durationHours: 3,
    days: 1,
    terrain: ["Glen", "Mountain"],
    seasons: ["Spring", "Summer", "Autumn"],
    dogFriendly: true,
    summary:
      "A hidden hanging valley once used by the MacDonalds to conceal cattle, reached through a dramatic gorge.",
    highlights: ["Hidden hanging valley", "River gorge crossing", "Towering Three Sisters peaks"],
    gradient: "from-forest-dark to-forest-highland",
  },
  {
    id: "west-highland-way",
    name: "The West Highland Way",
    region: "Loch Lomond & Trossachs",
    difficulty: "Challenging",
    distanceKm: 154,
    ascentM: 3155,
    durationHours: 0,
    days: 7,
    terrain: ["Loch", "Glen", "Moorland", "Mountain"],
    seasons: ["Spring", "Summer", "Autumn"],
    dogFriendly: true,
    summary:
      "Scotland's most famous long-distance trail, running from Milngavie to Fort William through lochs, glens and moorland.",
    highlights: ["154 km flagship trail", "Loch Lomond shoreline", "Rannoch Moor wilderness"],
    gradient: "from-forest-darkest to-forest-highland",
  },
  {
    id: "quiraing-loop",
    name: "The Quiraing Loop",
    region: "Isle of Skye",
    difficulty: "Moderate",
    distanceKm: 6.8,
    ascentM: 370,
    durationHours: 3,
    days: 1,
    terrain: ["Mountain", "Coastal"],
    seasons: ["Spring", "Summer", "Autumn"],
    dogFriendly: true,
    summary:
      "A surreal landscape of landslips, hidden plateaus and jagged pinnacles on the northern Trotternish peninsula.",
    highlights: ["Cinematic landscapes", "The Table & The Needle", "Coast-to-ridge views"],
    gradient: "from-forest-highland to-mist",
  },
  {
    id: "cairngorm-plateau",
    name: "Cairn Gorm Plateau",
    region: "Cairngorms",
    difficulty: "Expert",
    distanceKm: 18,
    ascentM: 900,
    durationHours: 9,
    days: 1,
    terrain: ["Mountain", "Moorland"],
    seasons: ["Summer"],
    dogFriendly: false,
    summary:
      "A high, exposed arctic plateau crossing for experienced hill-walkers with serious navigation skills.",
    highlights: ["Sub-arctic plateau", "Remote & exposed", "Multiple Munros"],
    gradient: "from-forest-darkest to-forest-dark",
  },
  {
    id: "falls-of-bruar",
    name: "Falls of Bruar",
    region: "Highlands",
    difficulty: "Easy",
    distanceKm: 2.5,
    ascentM: 110,
    durationHours: 1,
    days: 1,
    terrain: ["Forest"],
    seasons: ["Spring", "Summer", "Autumn", "Winter"],
    dogFriendly: true,
    summary:
      "A short, rewarding woodland walk to a series of tumbling waterfalls and stone bridges near Blair Atholl.",
    highlights: ["Cascading waterfalls", "Stone arch bridges", "Quick & scenic"],
    gradient: "from-forest-highland to-mist",
  },
  {
    id: "ben-lomond",
    name: "Ben Lomond",
    region: "Loch Lomond & Trossachs",
    difficulty: "Challenging",
    distanceKm: 12,
    ascentM: 974,
    durationHours: 5,
    days: 1,
    terrain: ["Mountain", "Loch"],
    seasons: ["Spring", "Summer", "Autumn"],
    dogFriendly: true,
    summary:
      "The most southerly Munro, offering a satisfying ascent and superb views over the length of Loch Lomond.",
    highlights: ["Accessible first Munro", "Loch Lomond panoramas", "Well-maintained path"],
    gradient: "from-forest-dark to-forest-highland",
  },
  {
    id: "st-cuthberts-way",
    name: "St Cuthbert's Way (Scottish Section)",
    region: "Borders",
    difficulty: "Moderate",
    distanceKm: 45,
    ascentM: 1100,
    durationHours: 0,
    days: 3,
    terrain: ["Moorland", "Forest", "Glen"],
    seasons: ["Spring", "Summer", "Autumn"],
    dogFriendly: true,
    summary:
      "A gentle multi-day pilgrim trail through the rolling Scottish Borders, rich in history and quiet countryside.",
    highlights: ["Historic pilgrim route", "Rolling Borders scenery", "Charming villages"],
    gradient: "from-forest-highland to-mist",
  },
];

const routeDescriptions: Record<string, string[]> = {
  "old-man-of-storr": [
    "The Old Man of Storr is one of Scotland's most photographed landmarks — a 50-metre basalt pinnacle towering over the Trotternish peninsula on the Isle of Skye. A well-maintained path climbs steadily to a natural amphitheatre of jagged rock spires, with the Sound of Raasay and the mainland mountains unfolding behind you.",
    "It's a short but rewarding outing suitable for most fitness levels, though the upper section is steep and can be slippery after rain. Early morning or golden hour offers the most atmospheric light and the quietest trails.",
  ],
  "ben-nevis-mountain-track": [
    "Standing 1,345 metres above Glen Nevis, Ben Nevis is the highest mountain in the British Isles and a bucket-list ascent. The Mountain Track is the most popular route to the summit — a long but non-technical zig-zag that gains over 1,300 metres of height across the day.",
    "This is a serious mountain day requiring good fitness, navigation skills and proper kit. The summit plateau is exposed, often cloud-covered and can hold snow well into summer. On a clear day the panorama stretches across the Highlands and out to the islands.",
  ],
  "loch-an-eilein": [
    "The circuit of Loch an Eilein is one of the gentlest and most beautiful walks in the Cairngorms, looping around a tranquil loch crowned by a ruined island castle. The flat, well-surfaced path winds through ancient Caledonian pine forest, home to red squirrels, crossbills and the occasional osprey.",
    "Suitable for families and all abilities, it's an easy outing in any season — peaceful under winter snow and dappled with light in summer. Allow extra time to linger at the viewpoints over the castle.",
  ],
  "glencoe-lost-valley": [
    "Hidden between the towering Three Sisters of Glencoe, the Lost Valley (Coire Gabhail) is a dramatic hanging valley once used by the MacDonalds to conceal stolen cattle. The path drops to cross the River Coe before climbing through a wooded gorge into a wide, silent bowl ringed by peaks.",
    "The route involves a river crossing on stepping stones and some rocky, uneven ground, so it's best tackled in dry conditions with sturdy footwear. It packs an enormous sense of wilderness and history into a relatively short walk.",
  ],
  "west-highland-way": [
    "Scotland's most famous long-distance trail runs 154 kilometres from Milngavie on the edge of Glasgow to Fort William beneath Ben Nevis. Over roughly a week it threads along the bonnie banks of Loch Lomond, across the wild expanse of Rannoch Moor and through the heart of the Highlands.",
    "Most walkers complete it over six to eight days, staying in villages, inns and bunkhouses along the way. It's a committing but achievable multi-day adventure — our supported tour handles luggage transfers and accommodation so you can simply walk.",
  ],
  "quiraing-loop": [
    "The Quiraing is a surreal landscape of landslips, hidden plateaus and jagged pinnacles on the northern Trotternish ridge of Skye. This circular route traverses beneath dramatic rock formations with names like the Table, the Needle and the Prison, offering some of the most cinematic scenery in Scotland.",
    "The path is narrow and exposed in places, with a few steep, eroded sections, so a head for heights and careful footing help. The light here is extraordinary at dawn and dusk.",
  ],
  "cairngorm-plateau": [
    "A crossing of the Cairn Gorm plateau is a true mountain expedition across one of the few sub-arctic environments in Britain. High, remote and exposed, the plateau links several Munros over rough, featureless terrain where the weather can turn in minutes.",
    "This route is for experienced hill-walkers with solid navigation skills and full mountain kit — in poor visibility, map-and-compass competence is essential. The reward is a vast, otherworldly wilderness unlike anywhere else in the country.",
  ],
  "falls-of-bruar": [
    "A short, rewarding woodland walk near Blair Atholl leads to the spectacular Falls of Bruar, a series of cascades tumbling through a rocky gorge. Stone bridges and viewing points — laid out after Robert Burns petitioned for the woods to be planted — frame the falls beautifully.",
    "The path is well-made but climbs steadily, with steps in places. It's an ideal leg-stretcher for all ages and especially impressive after rain when the falls are in full flow.",
  ],
  "ben-lomond": [
    "Ben Lomond is the most southerly of Scotland's Munros and one of the most popular, rising 974 metres directly above the eastern shore of Loch Lomond. The well-trodden Tourist Path climbs steadily to a fine summit ridge with sweeping views down the length of the loch and across the Trossachs.",
    "A good first Munro for fit walkers, it's a half- to full-day outing on a clear path, though the upper slopes are exposed to the weather. Its proximity to Glasgow makes it busy on summer weekends.",
  ],
  "st-cuthberts-way": [
    "St Cuthbert's Way is a gentle long-distance pilgrim trail winding through the rolling Scottish Borders, following in the footsteps of the 7th-century saint. The Scottish section passes quiet farmland, river valleys and historic villages, with welcoming tea rooms and inns en route.",
    "Spread comfortably over three days, it's ideal for walkers who prefer mileage and history over mountains. The terrain is mostly easy underfoot, making it a relaxed introduction to multi-day walking.",
  ],
};

// Representative map points (trailhead, or midpoint for long-distance trails).
const routeCoords: Record<string, Coords> = {
  "old-man-of-storr": { lat: 57.5072, lng: -6.1846 },
  "ben-nevis-mountain-track": { lat: 56.7969, lng: -5.0036 },
  "loch-an-eilein": { lat: 57.1486, lng: -3.823 },
  "glencoe-lost-valley": { lat: 56.6685, lng: -4.9667 },
  "west-highland-way": { lat: 56.2715, lng: -4.65 }, // Loch Lomond stretch (midpoint of a 154 km trail)
  "quiraing-loop": { lat: 57.6436, lng: -6.2718 },
  "cairngorm-plateau": { lat: 57.1175, lng: -3.6783 },
  "falls-of-bruar": { lat: 56.7815, lng: -3.9175 },
  "ben-lomond": { lat: 56.19, lng: -4.633 },
  "st-cuthberts-way": { lat: 55.58, lng: -2.5 }, // Borders midpoint (Melrose → Kirk Yetholm)
};

// Each route has a matching card photo at /public/cards/<id>.jpg.
export const routes: Route[] = baseRoutes.map((r) => ({
  ...r,
  image: `/cards/${r.id}.jpg`,
  description: routeDescriptions[r.id] ?? [r.summary],
  coords: routeCoords[r.id] ?? { lat: 56.8, lng: -4.5 },
}));

export const getRouteById = (id: string) => routes.find((r) => r.id === id);
