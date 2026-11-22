"use client";

import { tournament } from "@/data/tournament";
import { useGames } from "@/hooks/use-games";
import { dayOf, findTeam } from "@/lib/schedule";
import { GameCard } from "./game-card";

export function TeamGames({ slug }: { slug: string }) {
  const { games } = useGames();
  const teamGames = games.filter(
    (game) =>
      findTeam(game.home)?.slug === slug || findTeam(game.away)?.slug === slug,
  );

  // Finals have no teams until the standings are in, so they're listed underneath.
  const openFinals = games.filter(
    (game) => game.stage?.match(/final/i) && !findTeam(game.home) && !findTeam(game.away),
  );

  if (teamGames.length === 0) {
    return (
      <p className="panel mt-5 p-6 text-ice-300">
        This team&apos;s games will appear here once the schedule is posted.
      </p>
    );
  }

  return (
    <>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {teamGames.map((game, index) => (
          <div key={`${game.time}-${index}`}>
            <p className="mb-2 text-sm font-medium text-ice-300">
              {dayOf(game)?.label ?? tournament.dateLabel}
            </p>
            <GameCard game={game} />
          </div>
        ))}
      </div>

      {openFinals.length > 0 && (
        <div className="panel mt-4 flex flex-col gap-x-8 gap-y-2 p-4 sm:flex-row sm:flex-wrap sm:items-center">
          <p className="text-ice-300 sm:mr-auto">Finals, teams to be decided</p>
          {openFinals.map((game, index) => (
            <p key={`${game.time}-${index}`} className="text-ice-200">
              <span className="font-semibold text-white">{game.stage}</span>{" "}
              {dayOf(game)?.weekday} {game.time}
            </p>
          ))}
        </div>
      )}
    </>
  );
}
