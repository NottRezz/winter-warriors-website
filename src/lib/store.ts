import { games as startingGames, type Game } from "@/data/tournament";

/**
 * Where the live scores are kept: an Upstash Redis database, connected to the Vercel
 * project from its Storage tab. The integration adds these variables by itself.
 */
const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
const KEY = "winter-warriors:games";

export type Saved = { games: Game[]; updatedAt: string | null };

export class StoreUnavailable extends Error {}

async function redis(command: string[]) {
  if (!url || !token) throw new StoreUnavailable("No database is connected.");
  const response = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Database answered ${response.status}`);
  const { result } = (await response.json()) as { result: unknown };
  return result;
}

// Without a database, `next dev` keeps scores in memory so the panel can be tried locally.
const memory = globalThis as typeof globalThis & { __wwGames?: string };
const useMemory = !url && process.env.NODE_ENV !== "production";

async function readRaw() {
  if (useMemory) return memory.__wwGames ?? null;
  return (await redis(["GET", KEY])) as string | null;
}

async function writeRaw(value: string) {
  if (useMemory) memory.__wwGames = value;
  else await redis(["SET", KEY, value]);
}

/** The saved games, or the starting schedule if nothing has been saved yet. */
export async function readGames(): Promise<Saved> {
  const raw = await readRaw();
  if (!raw) return { games: startingGames, updatedAt: null };
  return JSON.parse(raw) as Saved;
}

export async function writeGames(games: Game[]): Promise<Saved> {
  const saved = { games, updatedAt: new Date().toISOString() };
  await writeRaw(JSON.stringify(saved));
  return saved;
}

export const storeConnected = Boolean(url && token) || useMemory;
