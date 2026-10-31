import { ArrowLeft, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ComingSoon } from "@/components/coming-soon";
import { TeamGames } from "@/components/team-games";
import { TeamLogo } from "@/components/team-logo";
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

  return (
    <>
      <section className="bg-[radial-gradient(70%_130%_at_85%_0%,var(--color-plum-800),var(--color-plum-950)_100%)]">
        <div className="section py-10 sm:py-14">
          <Link
            href="/teams"
            className="text-link text-sm text-ice-300"
          >
            <ArrowLeft aria-hidden className="size-4" />
            All teams
          </Link>
          <div className="mt-7 flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-9">
            <TeamLogo
              team={team}
              className="size-36 shrink-0 rounded-2xl p-2.5 sm:size-44"
            />
            <div>
              <h1 className="display text-4xl text-white sm:text-6xl">
                {team.shortName}
              </h1>
              <p className="mt-2 text-lg text-ice-300">
                {team.name}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="section grid gap-12 py-12 sm:py-16 lg:grid-cols-[1.35fr_1fr]">
        <section aria-labelledby="roster-heading">
          <h2 id="roster-heading" className="display text-2xl sm:text-3xl">
            Roster
          </h2>
          <div className="mt-5">
            {team.roster.length === 0 ? (
              <ComingSoon icon={Users} title="Roster coming soon">
                This team&apos;s players will be listed here before the tournament.
              </ComingSoon>
            ) : (
              <div className="panel overflow-hidden">
                <table className="w-full text-left">
                  <caption className="sr-only">{team.name} roster</caption>
                  <thead className="border-b border-white/[0.08] text-sm text-ice-300">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-medium">#</th>
                      <th scope="col" className="px-2 py-3 font-medium">Player</th>
                      <th scope="col" className="px-4 py-3 font-medium">Pos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {team.roster.map((player) => (
                      <tr
                        key={`${player.number}-${player.name}`}
                        className="border-b border-white/[0.06] last:border-0"
                      >
                        <td className="px-4 py-3 font-semibold text-white tabular-nums">
                          {player.number}
                        </td>
                        <th scope="row" className="px-2 py-3 font-medium text-ice-100">
                          {player.name}
                        </th>
                        <td className="px-4 py-3 text-ice-200">{player.position}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {team.staff.length > 0 && (
            <dl className="mt-6 grid gap-3 sm:grid-cols-2">
              {team.staff.map((person) => (
                <div key={person.name} className="panel p-4">
                  <dt className="text-sm text-ice-300">{person.role}</dt>
                  <dd className="mt-1 font-medium text-ice-100">{person.name}</dd>
                </div>
              ))}
            </dl>
          )}
        </section>

        <section aria-labelledby="team-games-heading">
          <h2 id="team-games-heading" className="display text-2xl sm:text-3xl">
            Games
          </h2>
          <TeamGames slug={team.slug} />
        </section>
      </div>
    </>
  );
}
