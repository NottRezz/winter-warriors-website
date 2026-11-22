"use client";

import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import { teams } from "@/data/tournament";
import { useFollowedTeam } from "@/hooks/use-followed-team";
import { useGames } from "@/hooks/use-games";
import { useNow } from "@/hooks/use-now";
import { dayOf, findTeam, gamePhase, isOpenFinal } from "@/lib/schedule";
import { GameCard } from "./game-card";
import { TeamLogo } from "./team-logo";

/** What a phone visitor came for: the game that's on or up next, for their team if they picked one. */
export function GameDay() {
  const { games } = useGames();
  const { followed, follow } = useFollowedTeam();
  const now = useNow();

  const ahead = games.filter((game) => {
    const phase = gamePhase(game, now);
    return phase === "upcoming" || phase === "live";
  });
  const theirs = followed
    ? ahead.find(
        (game) =>
          findTeam(game.home)?.slug === followed.slug ||
          findTeam(game.away)?.slug === followed.slug,
      )
    : undefined;
  const game = followed ? theirs : ahead[0];
  const awaitingFinal = followed && !game && ahead.some(isOpenFinal);

  const isOn = game && gamePhase(game, now) === "live";
  const heading = isOn
    ? "On the ice now"
    : !game && !awaitingFinal
      ? "That's a wrap"
      : followed
        ? `${followed.shortName}: next game`
        : "Up next";

  return (
    <section
      aria-labelledby="game-day-heading"
      className="border-b border-white/[0.08] bg-plum-900 lg:hidden"
    >
      <div className="section max-w-xl py-5">
        <div className="flex min-h-11 items-center justify-between gap-3">
          <h2 id="game-day-heading" className="display text-xl text-white">
            {heading}
          </h2>
          <Link
            href={followed ? `/teams/${followed.slug}` : "/schedule"}
            className="text-link min-h-11 shrink-0 text-sm text-bronze-300"
          >
            {followed ? "Team page" : "All games"}
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>

        <div aria-live="polite" className="mt-1">
          {game ? (
            <GameCard game={game} day={dayOf(game)?.weekday} />
          ) : (
            <p className="panel p-4 text-ice-200">
              {awaitingFinal
                ? `The ${followed.shortName} play in a final on Sunday afternoon. It will show here once the matchups are set.`
                : "No more games to play. See the schedule for the results."}
            </p>
          )}
        </div>

        <p id="follow-label" className="mt-4 flex items-center gap-2 text-sm text-ice-300">
          <Star aria-hidden className={`size-4 text-bronze-300 ${followed ? "fill-current" : ""}`} />
          {followed ? `Following the ${followed.shortName}` : "Tap your team to follow its games"}
        </p>
        <div role="group" aria-labelledby="follow-label" className="mt-2 grid grid-cols-4 gap-2">
          {teams.map((team) => {
            const active = followed?.slug === team.slug;
            return (
              <button
                key={team.slug}
                type="button"
                aria-pressed={active}
                onClick={() => follow(active ? null : team.slug)}
                className={`flex min-w-0 flex-col items-center gap-1.5 rounded-xl border-2 py-2 text-[0.6875rem] font-semibold transition-colors ${
                  active
                    ? "border-bronze-300 bg-bronze-300/10 text-white"
                    : "border-white/10 text-ice-300"
                }`}
              >
                <span aria-hidden>
                  <TeamLogo team={team} small className="size-11 rounded-lg p-0.5" />
                </span>
                <span className="max-w-full truncate">{team.shortName}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
