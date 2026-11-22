import Image from "next/image";
import type { Team } from "@/data/tournament";
import { asset } from "@/lib/asset";

/** A team logo on the background it was designed for. */
export function TeamLogo({
  team,
  small = false,
  className = "",
}: {
  team: Team;
  /** Uses the light 160px file, for logos up to about 56px. */
  small?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`relative block overflow-hidden ${
        team.logoSurface === "light" ? "bg-white" : "bg-black"
      } ${className}`}
    >
      {/* Positioned, as Safari miscounts a percentage height inside a padded aspect-ratio box. */}
      <Image
        src={asset(small ? team.logo.replace(".webp", "-sm.webp") : team.logo)}
        alt={`${team.name} logo`}
        width={640}
        height={640}
        className="absolute inset-0 size-full p-[inherit] object-contain"
      />
    </span>
  );
}
