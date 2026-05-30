import type { Tour } from "./types";

const baseTours: Tour[] = [
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

// Each tour has a matching card photo at /public/cards/<id>.jpg.
export const tours: Tour[] = baseTours.map((t) => ({
  ...t,
  image: `/cards/${t.id}.jpg`,
}));

export const getTourById = (id: string) => tours.find((t) => t.id === id);
