import { ArrowLeft, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { ComingSoon } from "@/components/coming-soon";
import { FollowButton } from "@/components/follow-button";
import { IceBackdrop } from "@/components/ice-backdrop";
import { LiveStatus } from "@/components/live-status";
import { TeamGames } from "@/components/team-games";
import { TeamLogo } from "@/components/team-logo";
import { TeamRoster } from "@/components/team-roster";
import { TeamStaff } from "@/components/team-staff";
import { TeamSwitcher } from "@/components/team-switcher";
import { ViewTabs } from "@/components/view-tabs";
import { teams } from "@/data/tournament";

export const dynamicParams = false;

export function generateStaticParams() {
  return teams.map((team) => ({ slug: team.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/teams/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: teams.find((team) => team.slug === slug)?.name };
}

export default async function TeamPage({ params }: PageProps<"/teams/[slug]">) {
  const { slug } = await params;
  const team = teams.find((candidate) => candidate.slug === slug);
  if (!team) notFound();

  const colours = {
    "--team": team.colours.main,
    "--team-trim": team.colours.trim,
  } as CSSProperties;

  return (
    <div style={colours}>
      <div className="relative isolate overflow-hidden bg-[linear-gradient(115deg,var(--team),color-mix(in_srgb,var(--team)_35%,var(--color-ink))_65%,var(--color-ink))]">
        <IceBackdrop className="text-white/[0.07]" />
        <div className="section relative pt-2 pb-5 sm:pt-5 sm:pb-9">
          <div className="flex items-center justify-between gap-3">
            <Link href="/teams" className="text-link min-h-11 text-sm text-ice-200">
              <ArrowLeft aria-hidden className="size-4" />
              All teams
            </Link>
            <FollowButton team={{ slug: team.slug, shortName: team.shortName }} />
          </div>
          <div className="mt-3 flex items-center gap-5 sm:gap-8">
            <TeamLogo
              team={team}
              className="size-20 shrink-0 rounded-2xl p-2 shadow-2xl shadow-black/40 sm:size-40 sm:p-2.5"
            />
            <div className="min-w-0">
              <h1 className="display text-[clamp(1.875rem,8vw,4.5rem)] text-white">
                {team.shortName}
              </h1>
              <p className="mt-1.5 text-ice-200 sm:text-xl">{team.name}</p>
            </div>
          </div>
        </div>
        <TeamSwitcher current={team.slug} />
      </div>

      <ViewTabs
        // Keyed so every team opens on its games.
        key={team.slug}
        label="Show games, roster or coaches"
        order={team.staff.length > 0 ? ["games", "roster", "staff"] : ["games", "roster"]}
        views={[
          {
            id: "roster",
            label: "Roster",
            content: (
            <section aria-labelledby="roster-heading" className="section py-6 sm:py-14">
              {team.roster.length === 0 ? (
                <>
                  <h2 id="roster-heading" className="display mb-6 text-3xl sm:text-4xl">
                    Roster
                  </h2>
                  <ComingSoon icon={Users} title="Roster coming soon">
                    This team&apos;s players will be listed here before the tournament.
                  </ComingSoon>
                </>
              ) : (
                // Keyed so every team opens on the default sort.
                <TeamRoster key={team.slug} players={team.roster} />
              )}
            </section>
            ),
          },
          ...(team.staff.length > 0
            ? [
                {
                  id: "staff",
                  label: "Coaches",
                  content: (
                  <section
                    aria-labelledby="staff-heading"
                    className="border-y border-white/[0.08] bg-plum-900"
                  >
                    <div className="section py-6 sm:py-14">
                      <h2 id="staff-heading" className="display text-3xl sm:text-4xl">
                        Coaches &amp; staff
                      </h2>
                      <TeamStaff staff={team.staff} />
                    </div>
                  </section>
                  ),
                },
              ]
            : []),
          {
            id: "games",
            label: "Games",
            content: (
            <section aria-labelledby="team-games-heading" className="section py-6 sm:py-14">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 id="team-games-heading" className="display text-3xl max-lg:sr-only sm:text-4xl">
                  Games
                </h2>
                <LiveStatus />
              </div>
              <TeamGames slug={team.slug} />
            </section>
            ),
          },
        ]}
      />
    </div>
  );
}
