import { teams, tournament, type Game, type Team } from "@/data/tournament";

export function findTeam(value: string): Team | undefined {
  const text = value.toLowerCase();
  return teams.find((team) => text.includes(team.slug));
}

export function isFinal(game: Game) {
  if (game.status) return game.status === "final";
  return game.homeScore !== undefined && game.awayScore !== undefined;
}

export function isRoundRobin(game: Game) {
  return !game.stage || /round|robin|^rr$/i.test(game.stage);
}

export function dayOf(game: Game) {
  return tournament.days.find(
    (day) =>
      game.day.includes(day.date) ||
      new RegExp(`\\b${day.dayOfMonth}\\b`).test(game.day) ||
      game.day.toLowerCase().startsWith(day.weekday.slice(0, 3).toLowerCase()),
  );
}

/** A final that's still waiting for its teams. */
export function isOpenFinal(game: Game) {
  return !isRoundRobin(game) && !findTeam(game.home) && !findTeam(game.away);
}

/** How long a game runs when the schedule only gives its start. */
const GAME_MS = 75 * 60_000;

/** Start and end of a game from times like "8:15 – 9:15 AM" or "11:30 AM". */
function gameWindow(game: Game) {
  const day = dayOf(game);
  const parts = [...game.time.matchAll(/(\d{1,2}):(\d{2})\s*([ap]m)?/gi)];
  if (!day || parts.length === 0) return null;

  const last = parts[parts.length - 1];
  const endIsPm = last[3]?.toLowerCase() === "pm";
  // In a range like "11:30 – 12:45 PM" only the end says AM or PM.
  const startIsPm = parts[0][3]
    ? parts[0][3].toLowerCase() === "pm"
    : Number(parts[0][1]) % 12 > Number(last[1]) % 12
      ? !endIsPm
      : endIsPm;

  const at = ([, hour, minute]: RegExpMatchArray, pm: boolean) => {
    const hours = String((Number(hour) % 12) + (pm ? 12 : 0)).padStart(2, "0");
    return Date.parse(`${day.date}T${hours}:${minute}:00${tournament.utcOffset}`);
  };

  const start = at(parts[0], startIsPm);
  return { start, end: parts.length > 1 ? at(last, endIsPm) : start + GAME_MS };
}

export type GamePhase = "upcoming" | "live" | "over" | "final";

/** Where a game is at, from its score and the clock. Before the clock is known, it's upcoming. */
export function gamePhase(game: Game, now: number | null): GamePhase {
  if (isFinal(game)) return "final";
  if (game.status === "live") return "live";
  const times = gameWindow(game);
  if (now === null || !times || now < times.start) return "upcoming";
  return now < times.end ? "live" : "over";
}

export type StandingRow = {
  team: Team;
  played: number;
  wins: number;
  losses: number;
  ties: number;
  goalsFor: number;
  goalsAgainst: number;
  penaltyMinutes: number;
  points: number;
};

export function computeStandings(games: Game[]): StandingRow[] {
  const { win, tie, loss, disciplineBonus } = tournament.scoring;
  const rows = new Map(
    teams.map((team) => [
      team.slug,
      {
        team,
        played: 0,
        wins: 0,
        losses: 0,
        ties: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        penaltyMinutes: 0,
        points: 0,
      },
    ]),
  );

  for (const game of games) {
    if (!isFinal(game) || !isRoundRobin(game)) continue;
    const home = rows.get(findTeam(game.home)?.slug ?? "");
    const away = rows.get(findTeam(game.away)?.slug ?? "");
    if (!home || !away) continue;

    const homeGoals = game.homeScore!;
    const awayGoals = game.awayScore!;
    home.played += 1;
    away.played += 1;
    home.goalsFor += homeGoals;
    home.goalsAgainst += awayGoals;
    away.goalsFor += awayGoals;
    away.goalsAgainst += homeGoals;

    if (homeGoals === awayGoals) {
      home.ties += 1;
      away.ties += 1;
      home.points += tie;
      away.points += tie;
    } else {
      const [winner, loser] = homeGoals > awayGoals ? [home, away] : [away, home];
      winner.wins += 1;
      loser.losses += 1;
      winner.points += win;
      loser.points += loss;
    }

    if (game.homePim !== undefined && game.awayPim !== undefined) {
      home.penaltyMinutes += game.homePim;
      away.penaltyMinutes += game.awayPim;
      if (game.homePim < game.awayPim) home.points += disciplineBonus;
      else if (game.awayPim < game.homePim) away.points += disciplineBonus;
      else {
        home.points += disciplineBonus / 2;
        away.points += disciplineBonus / 2;
      }
    }
  }

  return [...rows.values()].sort(
    (a, b) =>
      b.points - a.points ||
      b.goalsFor - b.goalsAgainst - (a.goalsFor - a.goalsAgainst) ||
      a.penaltyMinutes - b.penaltyMinutes,
  );
}
