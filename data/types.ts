export type Difficulty = "Easy" | "Moderate" | "Challenging" | "Expert";

export type Region =
  | "Highlands"
  | "Isle of Skye"
  | "Cairngorms"
  | "Loch Lomond & Trossachs"
  | "Glencoe"
  | "Borders";

export type Terrain = "Coastal" | "Mountain" | "Forest" | "Loch" | "Glen" | "Moorland";

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
  highlights: string[];
  /** Tailwind gradient classes used for the card hero. */
  gradient: string;
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
  includes: string[];
  gradient: string;
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
}
