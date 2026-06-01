export type Difficulty = "Easy" | "Moderate" | "Challenging" | "Expert";

export type Region =
  | "Highlands"
  | "Isle of Skye"
  | "Cairngorms"
  | "Loch Lomond & Trossachs"
  | "Glencoe"
  | "Borders";

export type Terrain = "Coastal" | "Mountain" | "Forest" | "Loch" | "Glen" | "Moorland";

/** WGS84 latitude / longitude for plotting an item on the map. */
export interface Coords {
  lat: number;
  lng: number;
}

export interface Route {
  id: string;
  name: string;
  region: Region;
  difficulty: Difficulty;
  distanceKm: number;
  ascentM: number;
  durationHours: number;
  /** Number of days for the trip; 1 for a day walk. */
  days: number;
  terrain: Terrain[];
  /** Best suited season tags. */
  seasons: ("Spring" | "Summer" | "Autumn" | "Winter")[];
  dogFriendly: boolean;
  summary: string;
  /** Longer, booking-oriented description (one entry per paragraph). */
  description: string[];
  highlights: string[];
  /** Tailwind gradient classes used as the card header fallback. */
  gradient: string;
  /** Map location of the trailhead / representative point. */
  coords: Coords;
  /** Optional photo for the card header (path under /public). */
  image?: string;
}

export interface Tour {
  id: string;
  name: string;
  region: Region;
  difficulty: Difficulty;
  days: number;
  groupSize: string;
  pricePerPerson: number;
  guided: boolean;
  summary: string;
  /** Longer, booking-oriented description (one entry per paragraph). */
  description: string[];
  includes: string[];
  gradient: string;
  /** Map location of the tour's base / start. */
  coords: Coords;
  /** Optional photo for the card header (path under /public). */
  image?: string;
}

export interface Stay {
  id: string;
  name: string;
  type: "Bothy" | "Hostel" | "B&B" | "Lodge" | "Campsite" | "Hotel";
  region: Region;
  pricePerNight: number;
  rating: number;
  amenities: string[];
  summary: string;
  gradient: string;
  /** Map location of the accommodation. */
  coords: Coords;
}
