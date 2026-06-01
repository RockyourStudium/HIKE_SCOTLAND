import type { Coords, Stay } from "./types";

const baseStays: Omit<Stay, "coords">[] = [
  {
    id: "glen-nevis-lodge",
    name: "Glen Nevis Lodge",
    type: "Lodge",
    region: "Highlands",
    pricePerNight: 140,
    rating: 4.8,
    amenities: ["Mountain views", "Drying room", "Breakfast included", "Parking"],
    summary: "A cosy timber lodge at the foot of Ben Nevis, perfect for an early summit start.",
    gradient: "from-forest-darkest to-forest-highland",
  },
  {
    id: "portree-harbour-bnb",
    name: "Portree Harbour B&B",
    type: "B&B",
    region: "Isle of Skye",
    pricePerNight: 110,
    rating: 4.7,
    amenities: ["Harbour views", "Home-cooked breakfast", "Packed lunches", "WiFi"],
    summary: "A warm, family-run B&B overlooking Portree's colourful harbour, central for Skye's trails.",
    gradient: "from-forest-highland to-mist",
  },
  {
    id: "cairngorm-bunkhouse",
    name: "Cairngorm Bunkhouse",
    type: "Hostel",
    region: "Cairngorms",
    pricePerNight: 38,
    rating: 4.5,
    amenities: ["Shared kitchen", "Drying room", "Bike storage", "Communal lounge"],
    summary: "A friendly, budget-friendly hostel close to Aviemore and the Cairngorm trailheads.",
    gradient: "from-forest-dark to-forest-highland",
  },
  {
    id: "rannoch-bothy",
    name: "Rannoch Moor Bothy",
    type: "Bothy",
    region: "Loch Lomond & Trossachs",
    pricePerNight: 0,
    rating: 4.2,
    amenities: ["Wild & remote", "Wood stove", "No booking needed", "Off-grid"],
    summary: "A simple, free mountain shelter on the edge of Rannoch Moor for true wilderness nights.",
    gradient: "from-forest-darkest to-forest-dark",
  },
  {
    id: "glencoe-campsite",
    name: "Glencoe Riverside Campsite",
    type: "Campsite",
    region: "Glencoe",
    pricePerNight: 22,
    rating: 4.6,
    amenities: ["Riverside pitches", "Hot showers", "Camp shop", "Pet friendly"],
    summary: "Pitch beside a Highland river surrounded by Glencoe's towering peaks.",
    gradient: "from-forest-highland to-mist",
  },
  {
    id: "trossachs-country-hotel",
    name: "Trossachs Country Hotel",
    type: "Hotel",
    region: "Loch Lomond & Trossachs",
    pricePerNight: 195,
    rating: 4.9,
    amenities: ["Spa & sauna", "Restaurant", "Loch views", "Free parking"],
    summary: "A refined country hotel for those who like to soak away the miles in comfort.",
    gradient: "from-forest-darkest to-forest-highland",
  },
  {
    id: "borders-farmhouse",
    name: "Borders Farmhouse Stay",
    type: "B&B",
    region: "Borders",
    pricePerNight: 95,
    rating: 4.6,
    amenities: ["Working farm", "Hearty breakfast", "Quiet countryside", "Dog friendly"],
    summary: "A peaceful farmhouse in the rolling Borders, ideal for gentle multi-day rambles.",
    gradient: "from-forest-highland to-mist",
  },
  {
    id: "skye-glamping-pods",
    name: "Skye Glamping Pods",
    type: "Lodge",
    region: "Isle of Skye",
    pricePerNight: 130,
    rating: 4.7,
    amenities: ["Heated pods", "Dark-sky views", "Private deck", "Kitchenette"],
    summary: "Snug insulated pods under Skye's famous dark skies, a step up from camping.",
    gradient: "from-forest-dark to-forest-highland",
  },
];

// Map location for each stay.
const stayCoords: Record<string, Coords> = {
  "glen-nevis-lodge": { lat: 56.796, lng: -5.068 },
  "portree-harbour-bnb": { lat: 57.4118, lng: -6.1934 },
  "cairngorm-bunkhouse": { lat: 57.1955, lng: -3.8265 },
  "rannoch-bothy": { lat: 56.61, lng: -4.72 },
  "glencoe-campsite": { lat: 56.685, lng: -5.098 },
  "trossachs-country-hotel": { lat: 56.2447, lng: -4.2155 }, // Callander
  "borders-farmhouse": { lat: 55.58, lng: -2.6 },
  "skye-glamping-pods": { lat: 57.3, lng: -6.2 },
};

export const stays: Stay[] = baseStays.map((s) => ({
  ...s,
  coords: stayCoords[s.id] ?? { lat: 56.8, lng: -4.5 },
}));

export const getStayById = (id: string) => stays.find((s) => s.id === id);
