// Turns the client's logo files in assets/logos into web-ready images in public/.
// Run with `npm run logos` after swapping in a higher resolution source file.
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const source = (file) => path.join(root, "assets/logos", file);
const output = (file) => path.join(root, "public/logos", file);

const SCALE = 3;
const BORDER = 8;

/** Lifts the crest off its ice tile by flood-filling inward from the edges. */
async function cutOutCrest() {
  const meta = await sharp(source("tournament.png")).metadata();
  const crop = {
    left: BORDER,
    top: BORDER,
    width: meta.width - BORDER * 2,
    height: meta.height - BORDER * 2,
  };

  const { data, info } = await sharp(source("tournament.png"))
    .flatten({ background: "#dce4ec" })
    .extract(crop)
    .resize({
      width: crop.width * SCALE,
      height: crop.height * SCALE,
      kernel: "lanczos3",
    })
    .sharpen({ sigma: 1.1 })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const pixel = (x, y) => (y * width + x) * channels;

  // The ice is bright and cool; everything in the crest is warmer or darker.
  const isIce = (i) => {
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
    return Math.min(r, g, b) > 150 && b >= r - 8;
  };

  const removed = new Uint8Array(width * height);
  const stack = [];
  const visit = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const at = y * width + x;
    if (removed[at] || !isIce(pixel(x, y))) return;
    removed[at] = 1;
    stack.push(at);
  };

  for (let x = 0; x < width; x++) {
    visit(x, 0);
    visit(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    visit(0, y);
    visit(width - 1, y);
  }
  while (stack.length) {
    const at = stack.pop();
    const x = at % width;
    const y = (at - x) / width;
    visit(x + 1, y);
    visit(x - 1, y);
    visit(x, y + 1);
    visit(x, y - 1);
  }

  // Eat slightly into the edge so no pale fringe shows on dark backgrounds.
  const mask = Buffer.alloc(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let keep = 255;
      for (let dy = -2; dy <= 2 && keep; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          const inside = nx >= 0 && ny >= 0 && nx < width && ny < height;
          if (!inside || removed[ny * width + nx]) {
            keep = 0;
            break;
          }
        }
      }
      mask[y * width + x] = keep;
    }
  }

  const alpha = await sharp(mask, { raw: { width, height, channels: 1 } })
    .blur(0.9)
    .extractChannel(0)
    .raw()
    .toBuffer();

  const rgba = Buffer.alloc(width * height * 4);
  for (let at = 0; at < width * height; at++) {
    const i = at * channels;
    rgba[at * 4] = data[i];
    rgba[at * 4 + 1] = data[i + 1];
    rgba[at * 4 + 2] = data[i + 2];
    rgba[at * 4 + 3] = alpha[at];
  }

  const crest = await sharp(rgba, { raw: { width, height, channels: 4 } })
    .trim({ threshold: 1 })
    .png()
    .toBuffer();

  await sharp(crest)
    .resize({ width: 1064 })
    .webp({ quality: 82, alphaQuality: 90 })
    .toFile(output("crest.webp"));
  await sharp(crest)
    .resize({ width: 192 })
    .webp({ quality: 88 })
    .toFile(output("crest-sm.webp"));
  await sharp(crest)
    .resize({
      width: 72,
      height: 72,
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(path.join(root, "src/app/icon.png"));
  return crest;
}

/** Fits a team logo into a square so every card lines up. */
async function squareLogo(file, name, background) {
  await sharp(source(file))
    .trim({ threshold: 12 })
    .resize({
      width: 640,
      height: 640,
      fit: "contain",
      background,
      kernel: "lanczos3",
      withoutEnlargement: false,
    })
    .webp({ quality: 88 })
    .toFile(output(`${name}.webp`));
  // For game cards and other small spots.
  await sharp(output(`${name}.webp`))
    .resize({ width: 160 })
    .webp({ quality: 86 })
    .toFile(output(`${name}-sm.webp`));
}

/** Clears stray specks around an award badge and centres it, so the badges line up. */
async function awardBadge(name) {
  const { data, info } = await sharp(path.join(root, "assets/awards", `${name}.webp`))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // The leftover smudges are almost invisible, but they would throw the centring off.
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] < 16) data[i] = 0;
  }

  const badge = await sharp(data, { raw: info })
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 1 })
    .png()
    .toBuffer();

  const centred = await sharp(badge)
    .resize({
      width: 1280,
      height: 1180,
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      withoutEnlargement: true,
    })
    .png()
    .toBuffer();

  // A second resize has to be its own step, or it replaces the first.
  await sharp(centred)
    .resize({ width: 832 })
    .webp({ quality: 80, alphaQuality: 90 })
    .toFile(path.join(root, "public/awards", `${name}.webp`));
}

/** Icons for when someone adds the site to their home screen. */
async function appIcons(crest) {
  const icon = async (size, file) => {
    const badge = await sharp(crest)
      .resize({ width: Math.round(size * 0.84) })
      .toBuffer();
    await sharp({ create: { width: size, height: size, channels: 4, background: "#1c1226" } })
      .composite([{ input: badge, gravity: "centre" }])
      .png()
      .toFile(path.join(root, file));
  };
  await icon(192, "public/logos/app-192.png");
  await icon(512, "public/logos/app-512.png");
  await icon(180, "src/app/apple-icon.png");
}

async function socialCard(crest) {
  const badge = await sharp(crest).resize({ height: 540 }).toBuffer();
  await sharp({
    create: { width: 1200, height: 630, channels: 4, background: "#1c1424" },
  })
    .composite([{ input: badge, gravity: "centre" }])
    .png()
    .toFile(path.join(root, "src/app/opengraph-image.png"));
}

await mkdir(path.join(root, "public/logos"), { recursive: true });
const crest = await cutOutCrest();
await socialCard(crest);
await appIcons(crest);
await squareLogo("knights.jpg", "knights", "#000000");
await squareLogo("pirates.webp", "pirates", "#000000");
await squareLogo("raiders.jpg", "raiders", "#ffffff");
await squareLogo("wolverines.png", "wolverines", "#ffffff");
await mkdir(path.join(root, "public/awards"), { recursive: true });
await awardBadge("mvp");
await awardBadge("heart-and-hustle");

// The raffle artwork is already cut out, so it only needs compressing.
await mkdir(path.join(root, "public/raffle"), { recursive: true });
for (const [name, width] of [["badge", 832], ["banner", 1600]]) {
  await sharp(path.join(root, "assets/raffle", `${name}.png`))
    .resize({ width })
    .webp({ quality: 80, alphaQuality: 90 })
    .toFile(path.join(root, "public/raffle", `${name}.webp`));
}
