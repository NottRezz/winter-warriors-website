"use client";

import { tournament } from "@/data/tournament";
import { useGames } from "@/hooks/use-games";
import { dayOf, findTeam } from "@/lib/schedule";
import { GameCard } from "./game-card";

export function TeamGames({ slug }: { slug: string }) {
  const { games, loading } = useGames();
  const teamGames = games.filter(
    (game) =>
      findTeam(game.home)?.slug === slug || findTeam(game.away)?.slug === slug,
  );

  if (loading) return null;

  if (teamGames.length === 0) {
    return (
      <p className="panel mt-5 p-6 text-ice-300">
        This team&apos;s games will appear here once the schedule is posted.
      </p>
    );
  }

  return (
    <div className="mt-5 grid gap-4">
      {teamGames.map((game, index) => (
        <div key={`${game.time}-${index}`}>
          <p className="mb-2 text-sm font-medium text-ice-300">
            {dayOf(game)?.label ?? tournament.dateLabel}
          </p>
          <GameCard game={game} />
        </div>
      ))}
    </div>
  );
}
