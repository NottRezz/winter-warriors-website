import Link from "next/link";
import type { Team } from "@/data/tournament";
import { TeamLogo } from "./team-logo";

export function TeamCard({ team }: { team: Team }) {
  return (
    <Link href={`/teams/${team.slug}`} className="group block">
      <TeamLogo
        team={team}
        className="aspect-square rounded-2xl p-5 transition-transform duration-300 group-hover:scale-[1.02]"
      />
      <p className="mt-3 font-semibold">{team.name}</p>
    </Link>
  );
}
