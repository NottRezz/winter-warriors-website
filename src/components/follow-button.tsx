"use client";

import { Star } from "lucide-react";
import type { Team } from "@/data/tournament";
import { useFollowedTeam } from "@/hooks/use-followed-team";

export function FollowButton({ team }: { team: Pick<Team, "slug" | "shortName"> }) {
  const { followed, follow } = useFollowedTeam();
  const active = followed?.slug === team.slug;

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={`Follow the ${team.shortName}`}
      onClick={() => follow(active ? null : team.slug)}
      className={`flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors lg:hidden ${
        active ? "border-bronze-300 bg-bronze-300 text-ink" : "border-white/30 text-white"
      }`}
    >
      <Star aria-hidden className={`size-4 ${active ? "fill-current" : ""}`} />
      {active ? "Following" : "Follow"}
    </button>
  );
}
