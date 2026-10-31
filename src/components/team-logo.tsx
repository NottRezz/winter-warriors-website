import Image from "next/image";
import type { Team } from "@/data/tournament";
import { asset } from "@/lib/asset";

/** A team logo on the background it was designed for. */
export function TeamLogo({
  team,
  className = "",
}: {
  team: Team;
  className?: string;
}) {
  return (
    <span
      className={`block overflow-hidden ${
        team.logoSurface === "light" ? "bg-white" : "bg-black"
      } ${className}`}
    >
      <Image
        src={asset(team.logo)}
        alt={`${team.name} logo`}
        width={640}
        height={640}
        className="size-full object-contain"
      />
    </span>
  );
}
