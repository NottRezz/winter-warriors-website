import { type NextRequest, NextResponse } from "next/server";
import { games as startingGames, type Game } from "@/data/tournament";
import { SESSION_COOKIE, isValidSession } from "@/lib/auth";
import { StoreUnavailable, readGames, writeGames } from "@/lib/store";

/**
 * The games with their latest scores. Vercel's CDN holds each answer for a few seconds,
 * so a full arena of phones checking at once only reaches the database a few times.
 */
export async function GET(request: NextRequest) {
  const fresh = request.nextUrl.searchParams.has("fresh");
  try {
    const saved = await readGames();
    return NextResponse.json(saved, {
      headers: {
        "Cache-Control": fresh
          ? "private, no-store"
          : "public, max-age=0, s-maxage=5, stale-while-revalidate=10",
      },
    });
  } catch (error) {
    const message = error instanceof StoreUnavailable ? error.message : "Couldn't read scores.";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}

const text = (value: unknown, max = 60) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

/** A whole number from 0 to 999, or nothing when the box is left blank. */
function count(value: unknown) {
  if (value === null || value === undefined || value === "") return undefined;
  const number = Number(value);
  if (!Number.isInteger(number) || number < 0 || number > 999) {
    throw new RangeError("Scores and penalty minutes must be whole numbers.");
  }
  return number;
}

/** Keeps only the fields a game has, in the shapes the site expects. */
function clean(input: Record<string, unknown>, id: string): Game {
  const game: Game = {
    id,
    day: text(input.day, 20),
    time: text(input.time, 40),
    home: text(input.home),
    away: text(input.away),
    homeScore: count(input.homeScore),
    awayScore: count(input.awayScore),
    homePim: count(input.homePim),
    awayPim: count(input.awayPim),
    stage: text(input.stage) || undefined,
    note: text(input.note, 200) || undefined,
    status: ["upcoming", "live", "final"].includes(input.status as string)
      ? (input.status as Game["status"])
      : undefined,
  };
  if (!game.day || !game.time || !game.home || !game.away) {
    throw new RangeError("Every game needs a day, a time and both teams.");
  }
  if (game.status === "final" && (game.homeScore === undefined || game.awayScore === undefined)) {
    throw new RangeError("Enter both scores before marking a game final.");
  }
  // Undefined fields are left out of the saved copy.
  return JSON.parse(JSON.stringify(game)) as Game;
}

type Change =
  | { action: "update"; game: Record<string, unknown> & { id: string } }
  | { action: "add"; game: Record<string, unknown> }
  | { action: "remove"; id: string }
  | { action: "reset" };

/** Scorekeeper changes. One game at a time, so two scorekeepers don't undo each other. */
export async function POST(request: NextRequest) {
  if (!isValidSession(request.cookies.get(SESSION_COOKIE)?.value)) {
    return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
  }

  const change = (await request.json().catch(() => null)) as Change | null;

  try {
    const { games } = await readGames();
    let next: Game[];

    switch (change?.action) {
      case "update": {
        const index = games.findIndex((game) => game.id === change.game?.id);
        if (index === -1) throw new RangeError("That game no longer exists. Reload the page.");
        next = games.with(index, clean(change.game, games[index].id));
        break;
      }
      case "add":
        next = [...games, clean(change.game ?? {}, `g-${Date.now().toString(36)}`)];
        break;
      case "remove":
        next = games.filter((game) => game.id !== change.id);
        break;
      case "reset":
        next = startingGames;
        break;
      default:
        throw new RangeError("Unknown change.");
    }

    return NextResponse.json(await writeGames(next));
  } catch (error) {
    if (error instanceof RangeError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    const message =
      error instanceof StoreUnavailable ? error.message : "Couldn't save. Try again in a moment.";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
