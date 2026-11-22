// Turns the files in assets/sponsors into evenly sized logos in public/sponsors.
// Run with `npm run sponsors` after adding a sponsor, changing a tier or swapping a file.
//
// Logos that share a height or width don't look the same size: banners shrink and solid
// badges shout. So each one is trimmed, then given a similar visual weight from its area
// and how much ink it has, on a canvas that is identical for everyone in its tier.
import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { sponsors } from "../src/data/tournament.ts";

const root = path.resolve(import.meta.dirname, "..");

// Canvases are about twice the largest size shown on the page, for high-density screens.
// `area` is the share of the canvas a logo of average ink fills.
const TIERS = {
  1: { width: 1792, height: 448, area: 0.2, maxWidth: 0.8, maxHeight: 0.7 },
  2: { width: 736, height: 414, area: 0.34, maxWidth: 0.84, maxHeight: 0.8 },
  3: { width: 640, height: 360, area: 0.34, maxWidth: 0.88, maxHeight: 0.8 },
  4: { width: 448, height: 280, area: 0.39, maxWidth: 0.88, maxHeight: 0.84 },
  community: { width: 1008, height: 336, area: 0.9, maxWidth: 0.92, maxHeight: 0.86 },
};
const AVERAGE_INK = 0.3;
const INK_INFLUENCE = 0.25;
/** How far a pixel must be from the background to count as part of the logo. */
const EDGE = 24;

/** Flattens a logo onto its tile colour, tidies that background and crops to the artwork. */
async function readArtwork(file, background) {
  const { data, info } = await sharp(file)
    .flatten({ background })
    .toColourspace("srgb")
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const base = [1, 3, 5].map((at) => parseInt(background.slice(at, at + 2), 16));
  const isWhite = base.every((value) => value === 255);
  let [left, top, right, bottom] = [width, height, -1, -1];
  let ink = 0;

  for (let i = 0; i < data.length; i += channels) {
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
    const low = Math.min(r, g, b);
    const high = Math.max(r, g, b);
    const difference = Math.max(
      Math.abs(r - base[0]),
      Math.abs(g - base[1]),
      Math.abs(b - base[2]),
    );

    // Clears JPEG noise, off-white paper and baked-in "transparency" checkerboards.
    const isBackground = isWhite ? low >= 228 && high - low <= 10 : difference <= 7;
    if (isBackground) {
      data[i] = base[0];
      data[i + 1] = base[1];
      data[i + 2] = base[2];
      continue;
    }

    ink += difference / 255;
    if (difference <= EDGE) continue;
    const x = (i / channels) % width;
    const y = Math.floor(i / channels / width);
    left = Math.min(left, x);
    top = Math.min(top, y);
    right = Math.max(right, x);
    bottom = Math.max(bottom, y);
  }

  if (right < 0) throw new Error(`${file} is blank on ${background}. Set a different background.`);

  const crop = { left, top, width: right - left + 1, height: bottom - top + 1 };
  const image = await sharp(data, { raw: { width, height, channels } })
    .extract(crop)
    .png()
    .toBuffer();

  return { image, ...crop, ink: ink / (crop.width * crop.height) };
}

function fitToTier(art, tier, scale) {
  const weight = (AVERAGE_INK / art.ink) ** INK_INFLUENCE;
  const area = tier.width * tier.height * tier.area * weight;
  const ideal = Math.sqrt(area / (art.width * art.height)) * scale;
  const factor = Math.min(
    ideal,
    (tier.width * tier.maxWidth) / art.width,
    (tier.height * tier.maxHeight) / art.height,
  );
  return { width: Math.round(art.width * factor), height: Math.round(art.height * factor) };
}

const sourceFolder = path.join(root, "assets/sponsors");
const sources = await readdir(sourceFolder);
await mkdir(path.join(root, "public/sponsors"), { recursive: true });

for (const { name, logo, tier: level, background = "#ffffff", scale = 1 } of sponsors) {
  if (!logo) continue;
  const id = path.parse(logo).name;
  const file = sources.find((source) => path.parse(source).name === id);
  if (!file) throw new Error(`No file named "${id}" in assets/sponsors for ${name}.`);

  const tier = TIERS[level];
  const art = await readArtwork(path.join(sourceFolder, file), background);
  const size = fitToTier(art, tier, scale);
  const resized = await sharp(art.image)
    .resize({ ...size, fit: "fill", kernel: "lanczos3" })
    .toBuffer();

  await sharp({
    create: { width: tier.width, height: tier.height, channels: 3, background },
  })
    .composite([{ input: resized, gravity: "centre" }])
    // Lossless, so the edges of the image match the colour of the tile exactly.
    .webp({ lossless: true })
    .toFile(path.join(root, "public", logo));

  console.log(`${name}: ${art.width}x${art.height} to ${size.width}x${size.height}`);
}
