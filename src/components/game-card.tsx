"use client";

import type { Game } from "@/data/tournament";
import { useNow } from "@/hooks/use-now";
import { findTeam, gamePhase, isFinal, isRoundRobin } from "@/lib/schedule";
import { TeamLogo } from "./team-logo";

function Side({
  label,
  role,
  score,
  won,
}: {
  label: string;
  role: "Home" | "Visitor";
  score?: number;
  won: boolean;
}) {
  const team = findTeam(label);

  return (
    <div className="flex items-center gap-3">
      {team ? (
        <TeamLogo team={team} small className="size-9 shrink-0 rounded-md p-0.5" />
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
      <span className="shrink-0 text-xs text-ice-300">{role}</span>
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

export function GameCard({ game, day }: { game: Game; day?: string }) {
  const done = isFinal(game);
  const phase = gamePhase(game, useNow());
  const homeWon = done && game.homeScore! > game.awayScore!;
  const awayWon = done && game.awayScore! > game.homeScore!;

  return (
    <article className={`panel p-4 ${phase === "live" ? "border-bronze-300/70" : ""}`}>
      <header className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-ice-200">
          {day && <span className="text-white">{day}, </span>}
          {game.time}
        </span>
        {phase === "live" ? (
          <span className="flex shrink-0 items-center gap-1.5 font-semibold text-bronze-300">
            <span aria-hidden className="size-2 rounded-full bg-bronze-300 motion-safe:animate-pulse" />
            {game.stage && !isRoundRobin(game) ? `${game.stage}, on now` : "On now"}
          </span>
        ) : (
          <span className={`shrink-0 ${done ? "font-medium text-bronze-300" : "text-ice-300"}`}>
            {done && isRoundRobin(game)
              ? "Final"
              : phase === "over"
                ? "Score to come"
                : (game.stage ?? "Round robin")}
          </span>
        )}
      </header>
      <div className="mt-3.5 grid gap-2.5">
        <Side label={game.home} role="Home" score={game.homeScore} won={homeWon} />
        <Side label={game.away} role="Visitor" score={game.awayScore} won={awayWon} />
      </div>
      {game.note && <p className="mt-3 text-sm text-ice-300">{game.note}</p>}
    </article>
  );
}
