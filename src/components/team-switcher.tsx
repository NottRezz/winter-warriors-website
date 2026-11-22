import Link from "next/link";
import { teams } from "@/data/tournament";
import { TeamLogo } from "./team-logo";

/** Jumps straight from one team's page to another. */
export function TeamSwitcher({ current }: { current: string }) {
  return (
    <nav aria-label="Choose a team" className="relative border-t border-white/10 bg-ink/45">
      <ul className="section grid grid-cols-4">
        {teams.map((team) => (
          <li key={team.slug} className="min-w-0">
            <Link
              href={`/teams/${team.slug}`}
              aria-current={team.slug === current ? "page" : undefined}
              className={`flex h-full flex-col items-center justify-center gap-1.5 border-b-[3px] py-2.5 text-xs font-semibold transition-colors sm:flex-row sm:gap-3 sm:py-3 sm:text-base ${
                team.slug === current
                  ? "border-(--team-trim) bg-white/[0.07] text-white"
                  : "border-transparent text-ice-300 hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              {/* The team's name follows, so the logo needn't be read out as well. */}
              <span aria-hidden>
                <TeamLogo team={team} small className="size-9 rounded-md p-0.5 sm:size-10" />
              </span>
              <span className="max-w-full truncate">{team.shortName}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
