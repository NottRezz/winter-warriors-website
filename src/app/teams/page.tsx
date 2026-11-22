import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { TeamCard } from "@/components/team-card";
import { teams } from "@/data/tournament";

export const metadata: Metadata = { title: "Teams & Rosters" };

export default function TeamsPage() {
  return (
    <>
      <PageHeader eyebrow="On the ice" title="Teams & Rosters">
        Welcome and best of luck to all four teams. Pick a team to see its roster and
        games.
      </PageHeader>
      <div className="section grid grid-cols-2 gap-4 py-7 sm:gap-6 sm:py-16 lg:grid-cols-4">
        {teams.map((team, index) => (
          <Reveal key={team.slug} delay={index * 0.07}>
            <TeamCard team={team} />
          </Reveal>
        ))}
      </div>
    </>
  );
}
