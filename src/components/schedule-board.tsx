"use client";

import { CalendarClock } from "lucide-react";
import { useMemo, useState } from "react";
import { teams, tournament } from "@/data/tournament";
import { useGames } from "@/hooks/use-games";
import { computeStandings, dayOf, findTeam } from "@/lib/schedule";
import { ComingSoon } from "./coming-soon";
import { GameCard } from "./game-card";
import { TeamLogo } from "./team-logo";

function Standings({ rows }: { rows: ReturnType<typeof computeStandings> }) {
  const heading = "px-2 py-3 text-center text-sm font-medium text-ice-300";
  const cell = "px-2 py-3 text-center tabular-nums text-ice-200";
  const wide = "hidden sm:table-cell";

  return (
    <div className="panel overflow-hidden">
      <table className="w-full">
        <caption className="sr-only">Round robin standings</caption>
        <thead className="border-b border-white/[0.08]">
          <tr>
            <th scope="col" className={`${heading} pl-4 text-left`}>
              Team
            </th>
            <th scope="col" className={heading}>GP</th>
            <th scope="col" className={heading}>W</th>
            <th scope="col" className={heading}>L</th>
            <th scope="col" className={heading}>T</th>
            <th scope="col" className={`${heading} ${wide}`}>GF</th>
            <th scope="col" className={`${heading} ${wide}`}>GA</th>
            <th scope="col" className={`${heading} ${wide}`}>PIM</th>
            <th scope="col" className={`${heading} pr-4`}>Pts</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.team.slug} className="border-b border-white/[0.06] last:border-0">
              <th scope="row" className="py-2.5 pr-2 pl-4 text-left">
                <span className="flex items-center gap-2.5">
                  <TeamLogo team={row.team} className="size-8 shrink-0 rounded p-0.5" />
                  <span className="font-medium text-ice-100">{row.team.shortName}</span>
                </span>
              </th>
              <td className={cell}>{row.played}</td>
              <td className={cell}>{row.wins}</td>
              <td className={cell}>{row.losses}</td>
              <td className={cell}>{row.ties}</td>
              <td className={`${cell} ${wide}`}>{row.goalsFor}</td>
              <td className={`${cell} ${wide}`}>{row.goalsAgainst}</td>
              <td className={`${cell} ${wide}`}>{row.penaltyMinutes}</td>
              <td className="py-3 pr-4 pl-2 text-center font-semibold text-white tabular-nums">
                {row.points}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ScheduleBoard() {
  const { games, updatedAt, failed, isLive, loading } = useGames();
  const [filter, setFilter] = useState("all");

  const standings = useMemo(() => computeStandings(games), [games]);
  const visible = useMemo(
    () =>
      filter === "all"
        ? games
        : games.filter(
            (game) =>
              findTeam(game.home)?.slug === filter ||
              findTeam(game.away)?.slug === filter,
          ),
    [games, filter],
  );

  const options = [
    { value: "all", label: "All teams" },
    ...teams.map((team) => ({ value: team.slug, label: team.shortName })),
  ];

  return (
    <div className="grid gap-12 lg:grid-cols-[1.35fr_1fr] lg:items-start">
      <section aria-labelledby="games-heading" className="min-w-0">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="games-heading" className="display text-2xl sm:text-3xl">
            Games
          </h2>
          {isLive && (
            <p aria-live="polite" className="text-sm text-ice-300">
              {failed
                ? "Reconnecting to live scores…"
                : updatedAt
                  ? `Live scores, checked ${updatedAt.toLocaleTimeString("en-CA", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}`
                  : "Loading live scores…"}
            </p>
          )}
        </div>

        {loading ? null : games.length === 0 ? (
          <div className="mt-6">
            <ComingSoon icon={CalendarClock} title="Schedule coming soon">
              Game times will be posted here before the tournament, and scores will
              update throughout the weekend.
            </ComingSoon>
          </div>
        ) : (
          <>
            <div
              role="group"
              aria-label="Filter games by team"
              className="mt-4 flex gap-5 overflow-x-auto sm:gap-6 shadow-[inset_0_-1px_0_rgb(255_255_255/0.1)] [scrollbar-width:none]"
            >
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={filter === option.value}
                  onClick={() => setFilter(option.value)}
                  className={`shrink-0 border-b-2 py-2.5 text-[0.95rem] font-medium transition-colors ${
                    filter === option.value
                      ? "border-bronze-300 text-white"
                      : "border-transparent text-ice-300 hover:text-white"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {tournament.days.map((day) => {
              const dayGames = visible.filter((game) => dayOf(game)?.date === day.date);
              if (dayGames.length === 0) return null;
              return (
                <div key={day.date} className="mt-8">
                  <h3 className="font-semibold text-white">{day.label}</h3>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {dayGames.map((game, index) => (
                      <GameCard key={`${game.time}-${game.home}-${index}`} game={game} />
                    ))}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </section>

      <section aria-labelledby="standings-heading" className="min-w-0 lg:sticky lg:top-24">
        <h2 id="standings-heading" className="display text-2xl sm:text-3xl">
          Standings
        </h2>
        <div className="mt-5">
          <Standings rows={standings} />
        </div>
        <p className="mt-3 text-sm text-ice-300">
          Round robin games only. Unofficial until confirmed from the game sheets.
        </p>
      </section>
    </div>
  );
}
