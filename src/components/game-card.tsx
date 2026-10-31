import type { Game } from "@/data/tournament";
import { findTeam, isFinal } from "@/lib/schedule";
import { TeamLogo } from "./team-logo";

function Side({
  label,
  score,
  won,
}: {
  label: string;
  score?: number;
  won: boolean;
}) {
  const team = findTeam(label);

  return (
    <div className="flex items-center gap-3">
      {team ? (
        <TeamLogo team={team} className="size-9 shrink-0 rounded-md p-0.5" />
      ) : (
        <span aria-hidden className="size-9 shrink-0 rounded-md bg-white/[0.06]" />
      )}
      <span
        className={`min-w-0 flex-1 truncate font-medium ${
          won ? "text-white" : "text-ice-200"
        }`}
      >
        {team?.shortName ?? label}
      </span>
      {score !== undefined && (
        <span
          className={`font-display text-2xl font-bold tabular-nums ${
            won ? "text-white" : "text-ice-300"
          }`}
        >
          {score}
        </span>
      )}
    </div>
  );
}

export function GameCard({ game }: { game: Game }) {
  const done = isFinal(game);
  const homeWon = done && game.homeScore! > game.awayScore!;
  const awayWon = done && game.awayScore! > game.homeScore!;

  return (
    <article className="panel p-4">
      <header className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-ice-200">{game.time}</span>
        <span className={done ? "font-medium text-bronze-300" : "text-ice-300"}>
          {done ? "Final" : (game.stage ?? "Round robin")}
        </span>
      </header>
      <div className="mt-3.5 grid gap-2.5">
        <Side label={game.home} score={game.homeScore} won={homeWon} />
        <Side label={game.away} score={game.awayScore} won={awayWon} />
      </div>
      {game.note && <p className="mt-3 text-sm text-ice-300">{game.note}</p>}
    </article>
  );
}
