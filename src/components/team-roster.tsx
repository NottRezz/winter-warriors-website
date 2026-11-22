"use client";

import { useMemo, useState } from "react";
import type { Player } from "@/data/tournament";

const byName = (a: Player, b: Player) => a.name.localeCompare(b.name, "en");

/** Players without a number go last. */
const byNumber = (a: Player, b: Player) =>
  Number(!a.number) - Number(!b.number) ||
  Number(a.number) - Number(b.number) ||
  byName(a, b);

// The first one is the default.
const SORTS = [
  { value: "number", label: "Jersey number", compare: byNumber },
  { value: "name", label: "Name", compare: byName },
] as const;

export function TeamRoster({ players }: { players: Player[] }) {
  const [sort, setSort] = useState<(typeof SORTS)[number]>(SORTS[0]);
  const sorted = useMemo(() => [...players].sort(sort.compare), [players, sort]);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="roster-heading" className="display text-3xl sm:text-4xl">
            Roster
          </h2>
          <p className="mt-1.5 text-ice-300">{players.length} players</p>
        </div>

        <div role="group" aria-label="Sort roster" className="flex items-center gap-3">
          <span aria-hidden className="shrink-0 text-sm text-ice-300">
            Sort by
          </span>
          <div className="flex rounded-xl border border-white/10 bg-ink/50 p-1">
            {SORTS.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={sort.value === option.value}
                onClick={() => setSort(option)}
                className={`min-h-11 cursor-pointer rounded-lg px-3 text-sm font-semibold whitespace-nowrap transition-colors sm:px-4 ${
                  sort.value === option.value
                    ? "bg-bronze-300 text-ink"
                    : "text-ice-300 hover:text-white"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="panel mt-6 overflow-hidden">
        <table className="w-full table-fixed text-left">
          <caption className="sr-only">Players</caption>
          <thead className="border-b border-white/[0.08] text-sm text-ice-300">
            <tr>
              <th
                scope="col"
                aria-sort={sort.value === "number" ? "ascending" : undefined}
                className="w-16 px-4 py-3 font-medium sm:w-20 sm:px-5"
              >
                <span aria-hidden>#</span>
                <span className="sr-only">Jersey number</span>
              </th>
              <th
                scope="col"
                aria-sort={sort.value === "name" ? "ascending" : undefined}
                className="px-2 py-3 font-medium"
              >
                Player
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((player) => (
              <tr
                key={`${player.number}-${player.name}`}
                className="border-b border-white/[0.06] last:border-0 even:bg-white/[0.025]"
              >
                <td className="px-4 py-2.5 font-semibold text-white tabular-nums sm:px-5">
                  {player.number || (
                    <>
                      <span aria-hidden className="text-ice-300">
                        –
                      </span>
                      <span className="sr-only">No number listed</span>
                    </>
                  )}
                </td>
                <th scope="row" className="px-2 py-2.5 font-medium break-words text-ice-100">
                  {player.name}
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
