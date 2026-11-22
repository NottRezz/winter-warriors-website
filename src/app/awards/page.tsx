import { Trophy } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { ComingSoon } from "@/components/coming-soon";
import { IceBackdrop } from "@/components/ice-backdrop";
import { PageHeader } from "@/components/page-header";
import { type Award, awards } from "@/data/tournament";
import { asset } from "@/lib/asset";

export const metadata: Metadata = { title: "Awards" };

// Picked up from the cyan and violet in the badges.
const GLOWS = {
  ice: "bg-[radial-gradient(closest-side,rgb(34_211_238/0.26),transparent)]",
  violet: "bg-[radial-gradient(closest-side,rgb(168_85_247/0.34),transparent)]",
};

function AwardFeature({ award }: { award: Award }) {
  const { series, name, description, logo, glow = "ice" } = award;

  return (
    <article className="flex h-full flex-col text-center">
      {logo && (
        <div className="relative z-10 mx-auto w-[72%] max-w-[26rem] md:w-[88%]">
          <div aria-hidden className={`absolute -inset-[18%] -z-10 ${GLOWS[glow]}`} />
          {/* The heading below names the award, so the badge is decorative. */}
          <Image
            src={asset(logo)}
            alt=""
            width={1280}
            height={1180}
            loading="eager"
            className="h-auto w-full"
          />
        </div>
      )}
      {/* Tucks up behind the badge, like a plinth under a trophy. */}
      <div
        className={`flex-1 rounded-2xl border border-white/10 bg-ink/55 px-6 pb-8 lg:px-10 lg:pb-10 ${
          logo ? "-mt-14 pt-18 md:-mt-20 md:pt-26" : "pt-8"
        }`}
      >
        <h2>
          <span className="eyebrow block">{series}</span>{" "}
          <span className="display mt-2 block text-4xl text-white lg:text-5xl">{name}</span>
        </h2>
        <div aria-hidden className="mx-auto mt-5 h-0.5 w-12 bg-bronze-300" />
        <p className="mx-auto mt-5 max-w-md text-pretty leading-relaxed text-ice-200 lg:text-lg lg:leading-relaxed">
          {description}
        </p>
      </div>
    </article>
  );
}

export default function AwardsPage() {
  if (awards.length === 0) {
    return (
      <>
        <PageHeader eyebrow="Honours" title="Awards">
          Celebrating the players who bring it every shift.
        </PageHeader>
        <div className="section py-12 sm:py-16">
          <ComingSoon icon={Trophy} title="Awards coming soon">
            This year&apos;s awards and how they&apos;re chosen will be announced here.
          </ComingSoon>
        </div>
      </>
    );
  }

  return (
    <div className="relative isolate overflow-hidden bg-[radial-gradient(80%_55%_at_50%_30%,var(--color-plum-800),var(--color-plum-950)_100%)]">
      <IceBackdrop rink={false} className="text-ice-100/[0.07]" />
      <div className="section relative pt-6 pb-8 sm:pt-14 sm:pb-20">
        <header className="text-center">
          <p className="eyebrow">Honours</p>
          <h1 className="display mt-2 text-3xl text-white sm:text-6xl">Awards</h1>
          <p className="mx-auto mt-2 max-w-xl text-pretty sm:text-lg text-ice-300">
            Celebrating the players who bring it every shift.
          </p>
        </header>

        {/* Side by side from tablets up. On phones it swipes, with the next award peeking in. */}
        <ul className="-mx-4 mt-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pt-3 [scrollbar-width:none] md:mx-0 md:mt-10 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 lg:gap-10">
          {awards.map((award) => (
            <li key={award.name} className="w-[86%] shrink-0 snap-start md:w-auto">
              <AwardFeature award={award} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
