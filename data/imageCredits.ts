// ---------------------------------------------------------------------------
// IMAGE CREDITS
//
// All photography comes from Envato Elements (Professional License), carried
// over from a previous project. CREDITS_BY_ORIGINAL is the source-of-truth
// reference: original filename -> photographer/author.
//
// USED_IMAGES lists the images ACTUALLY used on this site. Whenever a picture
// is brought in and renamed, add an entry here pointing `original` at its
// previous-project filename — the author is then looked up automatically, so
// the public /credits page stays in sync. Only entries with a known author
// are shown publicly (see getImageCredits).
// ---------------------------------------------------------------------------

export const IMAGE_LICENSE = "Envato Elements — Professional License";

/** Source of truth: original filename (previous project) → author. */
export const CREDITS_BY_ORIGINAL: Record<string, string> = {
  "argyll_hero.jpg": "NaturesCharm",
  "argyll_intro.jpg": "Flotsom",
  "argyll_1.jpg": "Mavaligursky",
  "argyll_2.jpg": "Zambezi",
  "argyll_3.jpg": "Flotsom",
  "argyll_4.jpg": "Joaquincorbalan",
  "argyll_5.jpg": "Flotsom",
  "argyll_6.jpg": "Mint_Images",
  "borders_hero.jpg": "Flotsom",
  "borders_intro.jpg": "Flotsom",
  "borders_1.jpg": "Mstrandret",
  "borders_2.jpg": "Ivankmit",
  "borders_3.jpg": "Fokkebok",
  "borders_4.jpg": "Pawopa3336",
  "borders_5.jpg": "Halfpoint",
  "borders_6.jpg": "Flotsom",
  "excursion_01.jpg": "Wirestock",
  "excursion_02.jpg": "Shaiith",
  "excursion_03.jpg": "Shaiith",
  "excursion_04.jpg": "Goinyk",
  "excursion_05.jpg": "Wirestock",
  "excursion_06.jpg": "Mumemories",
  "excursion_07.jpg": "FlaMash",
  "excursion_08.jpg": "Flotsom",
  "excursion_09.jpg": "GreensandBlues",
  "excursion_10.jpg": "Mavaligursky",
  "excursion_11.jpg": "Crew_street",
  "excursion_12.jpg": "MatthewWilliamsEllis",
  "guide_1.jpg": "Gilitukha",
  "guide_2.jpg": "Krisprahl",
  "guide_3.jpg": "Vadymvdrobot",
  "hero.jpg": "Flotsom",
  "highlands_hero.jpg": "Flotsom",
  "highlands_intro.jpg": "Shaiith",
  "highlands_1.jpg": "Elxeneize",
  "highlands_2.jpg": "Flotsom",
  "highlands_3.jpg": "POCSTOCK",
  "highlands_4.jpg": "Karlocuki",
  "highlands_5.jpg": "Goinyk",
  "highlands_6.jpg": "Halfpoint",
  "intro.jpg": "Pilat666",
  "teaser_1.jpg": "Flotsom",
  "teaser_2.jpg": "Flotsom",
  "teaser_3.jpg": "Flotsom",
  "cta.jpg": "Flotsom",
};

export interface UsedImage {
  /** Path under /public as used on this site. */
  file: string;
  /** Human-readable description of where it's used. */
  label: string;
  /** The original filename in the previous project (keys CREDITS_BY_ORIGINAL). */
  original: string;
}

/**
 * Images currently in use on this site, mapped to their original source file.
 * The author is looked up from CREDITS_BY_ORIGINAL, so keeping `original`
 * accurate is all that's needed to keep the /credits page correct.
 */
export const USED_IMAGES: UsedImage[] = [
  { file: "/heroes/landing.jpg", label: "Homepage hero", original: "hero.jpg" },
  { file: "/heroes/highlands.jpg", label: "The Highlands — hero", original: "highlands_hero.jpg" },
  { file: "/heroes/cairngorms.jpg", label: "The Cairngorms — hero", original: "borders_5.jpg" },
  { file: "/heroes/isle-of-skye.jpg", label: "Isle of Skye — hero", original: "excursion_01.jpg" },
  { file: "/heroes/glencoe.jpg", label: "Glencoe — hero", original: "excursion_08.jpg" },
  { file: "/heroes/loch-lomond-trossachs.jpg", label: "Loch Lomond & The Trossachs — hero", original: "highlands_6.jpg" },
  { file: "/heroes/scottish-borders.jpg", label: "The Scottish Borders — hero", original: "borders_hero.jpg" },

  // Route cards
  { file: "/cards/old-man-of-storr.jpg", label: "Route: The Old Man of Storr", original: "highlands_2.jpg" },
  { file: "/cards/ben-nevis-mountain-track.jpg", label: "Route: Ben Nevis — Mountain Track", original: "highlands_3.jpg" },
  { file: "/cards/loch-an-eilein.jpg", label: "Route: Loch an Eilein Circuit", original: "highlands_4.jpg" },
  { file: "/cards/glencoe-lost-valley.jpg", label: "Route: The Lost Valley (Coire Gabhail)", original: "highlands_intro.jpg" },
  { file: "/cards/west-highland-way.jpg", label: "Route: The West Highland Way", original: "excursion_07.jpg" },
  { file: "/cards/quiraing-loop.jpg", label: "Route: The Quiraing Loop", original: "highlands_5.jpg" },
  { file: "/cards/cairngorm-plateau.jpg", label: "Route: Cairn Gorm Plateau", original: "excursion_06.jpg" },
  { file: "/cards/falls-of-bruar.jpg", label: "Route: Falls of Bruar", original: "excursion_03.jpg" },
  { file: "/cards/ben-lomond.jpg", label: "Route: Ben Lomond", original: "argyll_4.jpg" },
  { file: "/cards/st-cuthberts-way.jpg", label: "Route: St Cuthbert's Way", original: "borders_3.jpg" },

  // Tour cards
  { file: "/cards/skye-explorer.jpg", label: "Tour: Isle of Skye Explorer", original: "highlands_1.jpg" },
  { file: "/cards/west-highland-way-supported.jpg", label: "Tour: West Highland Way — Supported", original: "teaser_1.jpg" },
  { file: "/cards/cairngorms-wild-weekend.jpg", label: "Tour: Cairngorms Wild Weekend", original: "excursion_11.jpg" },
  { file: "/cards/glencoe-photography.jpg", label: "Tour: Glencoe Photography Trek", original: "excursion_02.jpg" },
  { file: "/cards/highlands-grand-tour.jpg", label: "Tour: Highlands Grand Tour", original: "teaser_2.jpg" },
  { file: "/cards/borders-gentle-rambles.jpg", label: "Tour: Borders Gentle Rambles", original: "borders_4.jpg" },
];

export interface ResolvedCredit extends UsedImage {
  author: string;
}

/** Used images with a known author, ready to render on the credits page. */
export function getImageCredits(): ResolvedCredit[] {
  return USED_IMAGES.map((u) => ({
    ...u,
    author: CREDITS_BY_ORIGINAL[u.original] ?? "",
  })).filter((c) => c.author !== "");
}
