import type { Tour } from "./types";

const baseTours: Omit<Tour, "image" | "description">[] = [
  {
    id: "skye-explorer",
    name: "Isle of Skye Explorer",
    region: "Isle of Skye",
    difficulty: "Moderate",
    days: 4,
    groupSize: "6–12 people",
    pricePerPerson: 720,
    guided: true,
    summary:
      "A small-group guided adventure across Skye's most dramatic landscapes, from the Quiraing to the Fairy Pools.",
    includes: ["Expert local guide", "3 nights accommodation", "Transport on island", "Daily packed lunch"],
    gradient: "from-forest-darkest to-forest-highland",
  },
  {
    id: "west-highland-way-supported",
    name: "West Highland Way — Supported",
    region: "Loch Lomond & Trossachs",
    difficulty: "Challenging",
    days: 8,
    groupSize: "Self-guided",
    pricePerPerson: 950,
    guided: false,
    summary:
      "Walk Scotland's flagship trail with luggage transfers, pre-booked stays and a detailed route pack — no guide needed.",
    includes: ["Daily luggage transfer", "7 nights accommodation", "Route maps & app", "24/7 support line"],
    gradient: "from-forest-dark to-forest-highland",
  },
  {
    id: "cairngorms-wild-weekend",
    name: "Cairngorms Wild Weekend",
    region: "Cairngorms",
    difficulty: "Moderate",
    days: 3,
    groupSize: "4–10 people",
    pricePerPerson: 480,
    guided: true,
    summary:
      "A weekend immersion in the Cairngorms National Park with wildlife spotting, forest trails and a Munro attempt.",
    includes: ["Mountain leader", "2 nights lodge stay", "Wildlife guide", "All breakfasts"],
    gradient: "from-forest-highland to-mist",
  },
  {
    id: "glencoe-photography",
    name: "Glencoe Photography Trek",
    region: "Glencoe",
    difficulty: "Easy",
    days: 2,
    groupSize: "4–8 people",
    pricePerPerson: 340,
    guided: true,
    summary:
      "A relaxed-pace trek built around golden-hour photography in one of Scotland's most cinematic glens.",
    includes: ["Photography coach", "1 night accommodation", "Sunrise & sunset shoots", "Transport"],
    gradient: "from-forest-darkest to-forest-dark",
  },
  {
    id: "highlands-grand-tour",
    name: "Highlands Grand Tour",
    region: "Highlands",
    difficulty: "Challenging",
    days: 7,
    groupSize: "8–14 people",
    pricePerPerson: 1280,
    guided: true,
    summary:
      "The ultimate week in the Highlands — bagging Munros, crossing remote glens and finishing beneath Ben Nevis.",
    includes: ["Two mountain leaders", "6 nights accommodation", "All transport", "Most meals"],
    gradient: "from-forest-darkest to-forest-highland",
  },
  {
    id: "borders-gentle-rambles",
    name: "Borders Gentle Rambles",
    region: "Borders",
    difficulty: "Easy",
    days: 3,
    groupSize: "6–12 people",
    pricePerPerson: 410,
    guided: true,
    summary:
      "An easygoing trio of days through the rolling Scottish Borders, ideal for first-timers and slower paces.",
    includes: ["Friendly guide", "2 nights B&B", "Tea-room stops", "Luggage transfer"],
    gradient: "from-forest-highland to-mist",
  },
];

const tourDescriptions: Record<string, string[]> = {
  "skye-explorer": [
    "Our Isle of Skye Explorer is a four-day, small-group guided adventure across the island's most spectacular landscapes. From the otherworldly Quiraing and the Old Man of Storr to the crystal-clear Fairy Pools, your local guide leads you to the highlights while sharing Skye's geology, history and hidden corners.",
    "With transport on the island, three nights' accommodation and daily packed lunches included, all you need to do is walk and take it in. The pace suits anyone with reasonable fitness and a love of dramatic scenery.",
  ],
  "west-highland-way-supported": [
    "Walk Scotland's flagship trail end to end without the logistics. This eight-day self-guided package covers the full 154 km West Highland Way with your luggage transferred between stops, accommodation pre-booked and a detailed route pack and app provided.",
    "You walk at your own pace each day while we handle the planning, with a 24/7 support line should you need it. It's the freedom of an independent thru-hike with none of the organisational headache.",
  ],
  "cairngorms-wild-weekend": [
    "A three-day immersion in the Cairngorms National Park, blending forest trails, wildlife spotting and a guided Munro attempt. Led by a qualified mountain leader and a wildlife guide, you'll look for ospreys, red squirrels and reindeer among the ancient pine forest.",
    "Two nights' lodge accommodation and all breakfasts are included. The weekend suits walkers with reasonable fitness who want a richer understanding of this unique landscape — not just the views.",
  ],
  "glencoe-photography": [
    "A relaxed-pace, two-day trek built entirely around capturing Glencoe at its most atmospheric. With a photography coach guiding both your walking and your shooting, you'll work the glen through the golden hours of sunrise and sunset.",
    "One night's accommodation, transport within the glen and expert tuition are included. Suitable for all abilities and camera levels — from smartphones to full kit — it's as much about slowing down and seeing as it is about hiking.",
  ],
  "highlands-grand-tour": [
    "The Highlands Grand Tour is our flagship week-long expedition — bagging Munros, crossing remote glens and finishing beneath the slopes of Ben Nevis. Two experienced mountain leaders accompany the group throughout, adapting the itinerary to the conditions.",
    "With six nights' accommodation, all transport and most meals included, it's a comprehensive Highland adventure for fit, experienced walkers seeking big days in wild country. Expect serious ascents and unforgettable summits.",
  ],
  "borders-gentle-rambles": [
    "An easygoing three-day exploration of the rolling Scottish Borders, designed for first-timers and those who prefer a gentler pace. Each day links charming villages, river valleys and historic abbeys, with plenty of stops for tea and cake.",
    "Two nights in comfortable B&Bs and luggage transfers are included, so you carry only a day pack. It's the perfect introduction to multi-day walking in beautiful, unhurried countryside.",
  ],
};

// Each tour has a matching card photo at /public/cards/<id>.jpg.
export const tours: Tour[] = baseTours.map((t) => ({
  ...t,
  image: `/cards/${t.id}.jpg`,
  description: tourDescriptions[t.id] ?? [t.summary],
}));

export const getTourById = (id: string) => tours.find((t) => t.id === id);
