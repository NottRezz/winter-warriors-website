import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { GameDay } from "@/components/game-day";
import { Hero } from "@/components/hero";
import { IceBackdrop } from "@/components/ice-backdrop";
import { Reveal } from "@/components/reveal";
import { TeamCard } from "@/components/team-card";
import { teams, tournament } from "@/data/tournament";

const guide = [
  {
    href: "/schedule",
    title: "Schedule & scores",
    text: "Every game, every final and the live standings.",
  },
  {
    href: "/rules",
    title: "Rules",
    text: "How games run and how the standings are decided.",
  },
  {
    href: "/awards",
    title: "Awards",
    text: "The honours up for grabs this weekend.",
  },
  {
    href: "/raffle",
    title: "Raffle & 50/50",
    text: "Prizes to win and the online 50/50.",
  },
  {
    href: "/sponsors",
    title: "Sponsors",
    text: "The people and businesses making it happen.",
  },
];

export default function Home() {
  const { venue } = tournament;

  return (
    <>
      <Hero />
      <GameDay />

      {/* The pale ice from the crest's background */}
      <section className="relative isolate overflow-hidden bg-ice-200 py-10 text-plum-900 sm:py-24">
        <IceBackdrop rink={false} className="text-plum-700/20" />
        <div className="section relative">
          <Reveal>
            <h2 className="display text-3xl sm:text-5xl">
              Four teams. One weekend.
            </h2>
          </Reveal>
          <div className="mt-6 grid grid-cols-2 sm:mt-10 gap-x-4 gap-y-7 sm:gap-x-6 lg:grid-cols-4">
            {teams.map((team, index) => (
              <Reveal key={team.slug} delay={index * 0.06}>
                <TeamCard team={team} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section py-10 sm:py-24">
        <Reveal>
          <h2 className="display text-3xl sm:text-5xl">Tournament guide</h2>
        </Reveal>

        <ul className="mt-8 border-t border-white/10">
          {guide.map(({ href, title, text }) => (
            <li key={href} className="border-b border-white/10">
              <Link
                href={href}
                className="group flex items-center gap-4 py-5 sm:py-6"
              >
                <span className="grid flex-1 gap-1 md:grid-cols-[18rem_1fr] md:items-baseline md:gap-6">
                  <span className="font-display text-xl font-bold tracking-tight transition-colors group-hover:text-bronze-300">
                    {title}
                  </span>
                  <span className="text-ice-300">{text}</span>
                </span>
                <ArrowUpRight
                  aria-hidden
                  className="size-5 shrink-0 text-ice-300 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-white/[0.08] bg-plum-900">
        <div className="section grid items-center gap-10 py-10 sm:py-20 lg:grid-cols-[1fr_1.35fr]">
          <Reveal>
            <h2 className="display text-3xl sm:text-5xl">{venue.name}</h2>
            <address className="mt-4 text-lg text-ice-300 not-italic">
              {venue.street}
              <br />
              {venue.city}
            </address>
            <a
              href={venue.directions}
              target="_blank"
              rel="noreferrer"
              className="btn mt-6 h-12 max-lg:w-full"
            >
              Get directions
              <ArrowRight aria-hidden className="size-4" />
            </a>
          </Reveal>
          {/* Left out on phones, where a map traps the scroll. Directions opens the maps app. */}
          <Reveal delay={0.1} className="max-lg:hidden">
            <iframe
              title={`Map showing ${venue.name}`}
              src={venue.mapEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="aspect-[4/3] w-full rounded-2xl sm:aspect-[16/9]"
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
