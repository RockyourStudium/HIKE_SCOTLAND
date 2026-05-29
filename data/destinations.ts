import type { Region } from "./types";

export interface FieldNote {
  caption: string;
  location: string;
  gradient: string;
}

export interface Destination {
  slug: string;
  /** Matches the Region used across routes/tours/stays so we can cross-reference. */
  region: Region;
  name: string;
  /** Display order, e.g. "01". */
  number: string;
  /** Short hero tagline. */
  tagline: string;
  heroGradient: string;
  introHeading: string;
  introParagraphs: string[];
  highlights: { title: string; body: string }[];
  bestTime: string;
  gettingThere: string;
  fieldNotes: FieldNote[];
}

export const destinations: Destination[] = [
  {
    slug: "highlands",
    region: "Highlands",
    name: "The Highlands",
    number: "01",
    tagline: "Wild skies, wild ridges, deep glens.",
    heroGradient: "from-forest-darkest via-forest-dark to-forest-highland",
    introHeading: "The icon of wild Scotland",
    introParagraphs: [
      "The Scottish Highlands are the beating heart of the country's hiking culture — a vast, mountainous expanse where Munros pierce the clouds and glens stretch to the horizon. From the foot of Ben Nevis, Britain's highest peak, to the remote bothies of the far north, this is wilderness on a grand scale.",
      "Whether you're chasing your first summit or a seasoned hill-walker after a serious day out, the Highlands reward every level of ambition with raw, unforgettable landscapes.",
    ],
    highlights: [
      { title: "282 Munros", body: "Scotland's mountains over 3,000 ft — most of them right here." },
      { title: "Ben Nevis", body: "Summit the highest point in the British Isles at 1,345 m." },
      { title: "Endless glens", body: "Deep valleys carved by ice, threaded with rivers and trails." },
    ],
    bestTime:
      "May to September offers the longest days and most stable weather. Late spring brings fewer midges; autumn paints the glens gold.",
    gettingThere:
      "Fort William and Inverness are the main hubs, both reachable by train and road. The scenic A82 links Glasgow to the western Highlands.",
    fieldNotes: [
      { caption: "First light on the ridge", location: "Glen Nevis", gradient: "from-forest-darkest to-forest-highland" },
      { caption: "Mist over the moor", location: "Rannoch", gradient: "from-forest-dark to-mist" },
      { caption: "The long glen", location: "Glen Affric", gradient: "from-forest-highland to-mint" },
      { caption: "Summit cairn", location: "Ben Nevis", gradient: "from-forest-darkest to-forest-dark" },
    ],
  },
  {
    slug: "cairngorms",
    region: "Cairngorms",
    name: "The Cairngorms",
    number: "02",
    tagline: "Ancient forests, arctic plateaus, hidden lochs.",
    heroGradient: "from-forest-dark via-forest-highland to-mist",
    introHeading: "Britain's largest national park",
    introParagraphs: [
      "The Cairngorms hold a sub-arctic plateau unlike anywhere else in Britain — a high, wild tableland ringed by ancient Caledonian pine forest, glittering lochs and some of the country's most important wildlife habitats.",
      "Gentle loch loops and forest trails make it perfect for families, while the high tops offer serious mountain days for those with the skills to take them on.",
    ],
    highlights: [
      { title: "Caledonian forest", body: "Walk among the remnants of Scotland's ancient wild woodland." },
      { title: "Arctic plateau", body: "A unique high-altitude environment found nowhere else in the UK." },
      { title: "Rare wildlife", body: "Look for ospreys, red squirrels, capercaillie and reindeer." },
    ],
    bestTime:
      "Summer for the high plateau; spring and autumn for the forests and lochs. Winter turns the tops into a serious mountaineering environment.",
    gettingThere:
      "Aviemore is the gateway town, served by direct trains from the central belt. The funicular and ski roads give quick access to the high ground.",
    fieldNotes: [
      { caption: "Pines and still water", location: "Loch an Eilein", gradient: "from-forest-highland to-mist" },
      { caption: "Onto the plateau", location: "Cairn Gorm", gradient: "from-forest-dark to-forest-highland" },
      { caption: "Reindeer country", location: "Glenmore", gradient: "from-mist to-mint" },
      { caption: "Frosted heather", location: "Rothiemurchus", gradient: "from-forest-darkest to-forest-highland" },
    ],
  },
  {
    slug: "isle-of-skye",
    region: "Isle of Skye",
    name: "Isle of Skye",
    number: "03",
    tagline: "Jagged pinnacles, sea cliffs, fairy pools.",
    heroGradient: "from-forest-darkest via-forest-highland to-mist",
    introHeading: "The misty isle",
    introParagraphs: [
      "Skye is Scotland at its most cinematic — a island of surreal rock formations, plunging sea cliffs and the saw-toothed Cuillin ridge that draws climbers and walkers from across the world.",
      "The Trotternish peninsula alone holds the Old Man of Storr and the otherworldly Quiraing, while crystal-clear Fairy Pools tempt the brave for a cold-water swim.",
    ],
    highlights: [
      { title: "The Quiraing", body: "A landslip landscape of hidden plateaus and towering pinnacles." },
      { title: "Old Man of Storr", body: "Skye's most photographed rock spire, above the Sound of Raasay." },
      { title: "The Cuillin", body: "Britain's most challenging mountain ridge for experienced scramblers." },
    ],
    bestTime:
      "May, June and September dodge both the peak crowds and the worst of the midges. The light in early summer is extraordinary.",
    gettingThere:
      "Cross the Skye Bridge from the mainland near Kyle of Lochalsh, or take the ferry from Mallaig to Armadale. Portree is the island's main base.",
    fieldNotes: [
      { caption: "Pinnacles at dawn", location: "The Quiraing", gradient: "from-forest-darkest to-forest-highland" },
      { caption: "The lone spire", location: "Old Man of Storr", gradient: "from-forest-dark to-mist" },
      { caption: "Clear blue water", location: "Fairy Pools", gradient: "from-mist to-mint" },
      { caption: "Harbour evening", location: "Portree", gradient: "from-forest-highland to-mint" },
    ],
  },
  {
    slug: "glencoe",
    region: "Glencoe",
    name: "Glencoe",
    number: "04",
    tagline: "Towering peaks, hidden valleys, dark history.",
    heroGradient: "from-forest-darkest via-forest-dark to-forest-highland",
    introHeading: "Scotland's most dramatic glen",
    introParagraphs: [
      "Few places stir the imagination like Glencoe. Carved by ancient volcanoes and glaciers, its steep-sided peaks — the Three Sisters and the Aonach Eagach ridge — close in around a glen steeped in Highland history.",
      "From the gentle approach to the hidden Lost Valley to the airy ridge scrambles above, Glencoe packs a lifetime of adventure into a few spectacular miles.",
    ],
    highlights: [
      { title: "The Three Sisters", body: "Three soaring buttresses that define the glen's southern wall." },
      { title: "The Lost Valley", body: "A hidden hanging valley reached through a dramatic gorge." },
      { title: "Aonach Eagach", body: "One of Britain's finest — and most exposed — ridge traverses." },
    ],
    bestTime:
      "Late spring to early autumn for the walking; the glen is at its most atmospheric when low cloud drifts between the peaks.",
    gettingThere:
      "Glencoe sits on the A82 between Glasgow and Fort William, around two hours from Glasgow. The visitor centre is a useful starting point.",
    fieldNotes: [
      { caption: "Cloud between the peaks", location: "Three Sisters", gradient: "from-forest-darkest to-forest-dark" },
      { caption: "Into the gorge", location: "Lost Valley", gradient: "from-forest-dark to-forest-highland" },
      { caption: "Ridge in the sky", location: "Aonach Eagach", gradient: "from-forest-highland to-mist" },
      { caption: "River and stone", location: "River Coe", gradient: "from-mist to-mint" },
    ],
  },
  {
    slug: "loch-lomond-trossachs",
    region: "Loch Lomond & Trossachs",
    name: "Loch Lomond & The Trossachs",
    number: "05",
    tagline: "Bonnie banks, gentle hills, island lochs.",
    heroGradient: "from-forest-highland via-mist to-mint",
    introHeading: "Where the Highlands begin",
    introParagraphs: [
      "Just an hour from Glasgow, Loch Lomond & The Trossachs National Park is the perfect introduction to the Scottish Highlands — a softer landscape of island-studded lochs, wooded hills and the famous bonnie banks.",
      "It's home to Ben Lomond, the most southerly Munro, and the start of the West Highland Way, making it a favourite first step for new hikers and long-distance walkers alike.",
    ],
    highlights: [
      { title: "Ben Lomond", body: "An accessible, rewarding Munro with views the length of the loch." },
      { title: "West Highland Way", body: "The start of Scotland's flagship long-distance trail." },
      { title: "Island lochs", body: "Loch Lomond's wooded islands make for idyllic shoreline walks." },
    ],
    bestTime:
      "Spring through autumn. Being close to Glasgow, it's busiest on summer weekends — go midweek or early for quiet trails.",
    gettingThere:
      "Balloch is reachable by direct train from Glasgow in under an hour. The A82 runs along the loch's western shore.",
    fieldNotes: [
      { caption: "The bonnie banks", location: "Loch Lomond", gradient: "from-forest-highland to-mist" },
      { caption: "First Munro views", location: "Ben Lomond", gradient: "from-forest-dark to-forest-highland" },
      { caption: "Wooded shoreline", location: "The Trossachs", gradient: "from-mist to-mint" },
      { caption: "Trailhead morning", location: "Milngavie", gradient: "from-forest-highland to-mint" },
    ],
  },
  {
    slug: "scottish-borders",
    region: "Borders",
    name: "The Scottish Borders",
    number: "06",
    tagline: "Rolling hills, quiet trails, gentle history.",
    heroGradient: "from-forest-highland via-mist to-mint",
    introHeading: "Scotland's gentle south",
    introParagraphs: [
      "The Scottish Borders are a world away from the rugged north — a softer, rolling country of green hills, river valleys and historic abbeys, perfect for walkers who prefer mileage over mountains.",
      "Long-distance pilgrim routes like St Cuthbert's Way thread through charming villages and tea rooms, making this the ideal region for relaxed multi-day rambles.",
    ],
    highlights: [
      { title: "St Cuthbert's Way", body: "A gentle, historic pilgrim trail through rolling countryside." },
      { title: "River valleys", body: "Follow the Tweed and its tributaries through peaceful farmland." },
      { title: "Historic towns", body: "Ruined abbeys and welcoming villages punctuate every walk." },
    ],
    bestTime:
      "Spring to autumn is ideal, with the lower hills staying walkable far later into the year than the Highlands.",
    gettingThere:
      "The Borders Railway runs from Edinburgh to Tweedbank, opening up the region for car-free walking. Melrose is a central base.",
    fieldNotes: [
      { caption: "Rolling green hills", location: "The Eildons", gradient: "from-forest-highland to-mist" },
      { caption: "Along the Tweed", location: "Melrose", gradient: "from-mist to-mint" },
      { caption: "Pilgrim's path", location: "St Cuthbert's Way", gradient: "from-forest-highland to-mint" },
      { caption: "Abbey ruins", location: "Dryburgh", gradient: "from-forest-dark to-forest-highland" },
    ],
  },
];

export const getDestinationBySlug = (slug: string) =>
  destinations.find((d) => d.slug === slug);
