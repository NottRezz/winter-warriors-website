import { teams, tournament, type Game, type Team } from "@/data/tournament";

export function findTeam(value: string): Team | undefined {
  const text = value.toLowerCase();
  return teams.find((team) => text.includes(team.slug));
}

export function isFinal(game: Game) {
  return game.homeScore !== undefined && game.awayScore !== undefined;
}

function isRoundRobin(game: Game) {
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

/** Reads CSV text, including quoted cells, into rows of cells. */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (char === '"') {
        quoted = false;
      } else {
        cell += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (char !== "\r") {
      cell += char;
    }
  }
  row.push(cell);
  rows.push(row);
  return rows;
}

function toNumber(value: string | undefined) {
  if (!value?.trim()) return undefined;
  const number = Number(value);
  return Number.isNaN(number) ? undefined : number;
}

/** Turns the schedule sheet into games, matching columns by their header. */
export function gamesFromCsv(text: string): Game[] {
  const [header, ...rows] = parseCsv(text);
  const columns = header.map((name) => name.trim().toLowerCase().replace(/\s+/g, "_"));

  return rows
    .map((cells) => {
      const read = (name: string) =>
        cells[columns.indexOf(name)]?.trim() ?? "";
      return {
        day: read("day"),
        time: read("time"),
        home: read("home"),
        away: read("away"),
        homeScore: toNumber(read("home_score")),
        awayScore: toNumber(read("away_score")),
        homePim: toNumber(read("home_pim")),
        awayPim: toNumber(read("away_pim")),
        stage: read("stage") || undefined,
        note: read("note") || undefined,
      };
    })
    .filter((game) => game.home && game.away);
}
