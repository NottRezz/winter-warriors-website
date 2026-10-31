// The static export nests prefetch files (schedule/__next.schedule/__PAGE__.txt)
// but the client requests them flat (schedule/__next.schedule.__PAGE__.txt).
// Moving them to the requested path keeps link prefetching working on any host.
import { readdir, rename, rm } from "node:fs/promises";
import path from "node:path";

const out = path.resolve(import.meta.dirname, "../out");

/** Lists the files under a folder, relative to it. */
async function filesIn(folder) {
  const entries = await readdir(folder, { withFileTypes: true, recursive: true });
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => path.relative(folder, path.join(entry.parentPath, entry.name)));
}

async function flatten(folder) {
  const entries = await readdir(folder, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name === "_next") continue;
    const target = path.join(folder, entry.name);

    if (!entry.name.startsWith("__next.")) {
      await flatten(target);
      continue;
    }

    for (const file of await filesIn(target)) {
      const flat = [entry.name, ...file.split(path.sep)].join(".");
      await rename(path.join(target, file), path.join(folder, flat));
    }
    await rm(target, { recursive: true });
  }
}

await flatten(out);
