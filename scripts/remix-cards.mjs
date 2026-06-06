#!/usr/bin/env node
/**
 * One-off: erzeugt Card-Bilder für die neuen Katalog-Einträge, indem es
 * vorhandene Fotos „remixt" — Crop auf 3:2, optionaler Horizontal-Flip und eine
 * dezente Farb-/Helligkeitsabstimmung. So entsteht aus dem bestehenden Bestand
 * ein eigenständiges Bild, keine 1:1-Kopie. Quellen liegen unter /public und
 * /image-library; Ziel ist /public/cards/<id>.jpg.
 */
import path from "node:path";
import { existsSync } from "node:fs";
import sharp from "sharp";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "public", "cards");
const W = 1600;
const H = 1067; // 3:2

// id -> { src, flip, mod } — mod = leichte Anpassung gegen 1:1-Wirkung
const MAP = [
  // --- Tours ---
  ["torridon-munro-masterclass",      "image-library/highlands_2.jpg",      true,  { saturation: 1.05, brightness: 0.97 }],
  ["knoydart-wilderness-expedition",  "image-library/highlands_4.jpg",      false, { saturation: 0.92, brightness: 0.94 }],
  ["great-glen-way-supported",        "image-library/highlands_5.jpg",      true,  { saturation: 1.08, brightness: 1.02 }],
  ["skye-trotternish-traverse",       "public/cards/quiraing-loop.jpg",     true,  { saturation: 1.03, hue: 8 }],
  ["skye-coastal-wildlife-walk",      "public/gallery/sea-cliffs.jpg",      false, { saturation: 1.06, brightness: 1.03 }],
  ["cairngorms-munro-bagging",        "public/cards/cairngorm-plateau.jpg", true,  { saturation: 0.95, brightness: 0.98 }],
  ["speyside-whisky-trail-walk",      "public/gallery/heather-in-bloom.jpg", true, { saturation: 1.1, brightness: 1.02 }],
  ["glencoe-ridge-scramble",          "public/cards/glencoe-lost-valley.jpg", true,{ saturation: 0.9, brightness: 0.95 }],
  ["glencoe-family-adventure",        "image-library/excursion_03.jpg",     false, { saturation: 1.08, brightness: 1.04 }],
  ["loch-lomond-islands-kayak-hike",  "public/gallery/island-studded-loch.jpg", false, { saturation: 1.06, brightness: 1.02 }],
  ["trossachs-three-lochs-tour",      "public/gallery/highland-loch.jpg",   true,  { saturation: 1.05, hue: -6 }],
  ["ben-lomond-guided-ascent",        "public/cards/ben-lomond.jpg",        true,  { saturation: 1.0, brightness: 1.02 }],
  ["borders-abbeys-pilgrim-tour",     "image-library/borders_2.jpg",        false, { saturation: 1.06, brightness: 1.03 }],
  ["southern-upland-borders-trek",    "image-library/borders_4.jpg",        true,  { saturation: 0.96, brightness: 0.98 }],
  // --- Routes ---
  ["fairy-pools-glen-brittle",        "public/gallery/hidden-glen.jpg",     false, { saturation: 1.08, hue: 6 }],
  ["sgurr-na-stri",                   "public/cards/skye-explorer.jpg",     true,  { saturation: 0.95, brightness: 0.97 }],
  ["meall-a-bhuachaille",             "image-library/highlands_3.jpg",      false, { saturation: 1.04, brightness: 1.0 }],
  ["ryvoan-pass",                     "public/cards/loch-an-eilein.jpg",    true,  { saturation: 1.05, brightness: 1.02 }],
  ["aonach-eagach-ridge",             "image-library/highlands_6.jpg",      true,  { saturation: 0.9, brightness: 0.94 }],
  ["buachaille-etive-mor",            "public/cards/glencoe-photography.jpg", true, { saturation: 0.96, brightness: 0.97 }],
  ["conic-hill",                      "public/gallery/island-studded-loch.jpg", true, { saturation: 1.07, brightness: 1.03 }],
  ["ben-aan",                         "public/cards/west-highland-way.jpg", true,  { saturation: 1.04, hue: -5 }],
  ["eildon-hills",                    "image-library/borders_1.jpg",        false, { saturation: 1.05, brightness: 1.02 }],
  ["grey-mares-tail",                 "image-library/excursion_09.jpg",     true,  { saturation: 1.02, brightness: 0.98 }],
];

let ok = 0;
for (const [id, src, flip, mod] of MAP) {
  const srcPath = path.join(ROOT, src);
  if (!existsSync(srcPath)) {
    console.error(`✗ ${id}: Quelle fehlt — ${src}`);
    continue;
  }
  let pipe = sharp(srcPath, { failOn: "none" }).rotate();
  if (flip) pipe = pipe.flop();
  pipe = pipe
    .resize({ width: W, height: H, fit: "cover", position: "attention" })
    .modulate(mod)
    .jpeg({ quality: 82, mozjpeg: true });
  const out = path.join(OUT, `${id}.jpg`);
  await pipe.toFile(out);
  console.log(`✓ ${id}.jpg  ←  ${src}${flip ? " (flipped)" : ""}`);
  ok++;
}
console.log(`\n${ok}/${MAP.length} Card-Bilder erzeugt.`);
