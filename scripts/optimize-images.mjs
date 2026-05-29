#!/usr/bin/env node
/**
 * Source-image optimizer for everything under /public.
 *
 * next/image already optimizes what the *browser* downloads (resizing,
 * WebP/AVIF, responsive srcset). This script's job is different: keep the
 * *source* files committed to git from getting huge. Drop a 20MB Envato
 * download into /public, run `npm run optimize-images`, and it caps the
 * dimensions and re-encodes so the repo stays lean.
 *
 * It only touches files that exceed the thresholds, so re-running is safe
 * and won't slowly degrade already-optimized images.
 */
import { readdir, stat, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const MAX_WIDTH = 2560; // plenty for a full-bleed retina hero
const SIZE_LIMIT = 2 * 1024 * 1024; // 2 MB — re-encode anything bigger
const EXTENSIONS = new Set([".jpg", ".jpeg", ".png"]);

const mb = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)}MB`;

async function walk(dir) {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...(await walk(full)));
    else if (EXTENSIONS.has(path.extname(entry.name).toLowerCase())) found.push(full);
  }
  return found;
}

const files = await walk(PUBLIC_DIR).catch(() => []);
let changed = 0;
let saved = 0;

for (const file of files) {
  const before = (await stat(file)).size;
  // Read into a buffer first so we can safely overwrite the same path.
  const input = await readFile(file);
  const meta = await sharp(input).metadata();

  const tooWide = (meta.width ?? 0) > MAX_WIDTH;
  const tooBig = before > SIZE_LIMIT;
  if (!tooWide && !tooBig) continue;

  let pipeline = sharp(input, { failOn: "none" }).rotate(); // honour EXIF orientation
  if (tooWide) pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });

  const ext = path.extname(file).toLowerCase();
  pipeline =
    ext === ".png"
      ? pipeline.png({ compressionLevel: 9, palette: true })
      : pipeline.jpeg({ quality: 82, mozjpeg: true });

  const output = await pipeline.toBuffer();
  if (output.length < before) {
    await writeFile(file, output);
    const rel = path.relative(process.cwd(), file);
    console.log(`✓ ${rel}: ${mb(before)} → ${mb(output.length)}`);
    changed++;
    saved += before - output.length;
  }
}

console.log(
  changed
    ? `\nOptimized ${changed} file(s), saved ${mb(saved)}.`
    : "\nNothing to do — all images are already within limits."
);
