import { CalendarClock, ExternalLink, Gift, Star } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { ComingSoon } from "@/components/coming-soon";
import { IceBackdrop } from "@/components/ice-backdrop";
import { PrizeIcon } from "@/components/prize-icon";
import { Reveal } from "@/components/reveal";
import { type FeatureDraw, type Prize, raffle, sponsors } from "@/data/tournament";
import { asset } from "@/lib/asset";

export const metadata: Metadata = { title: "Raffle & 50/50" };

// The cyan and violet from the badge, alternating across the cash raffles.
const GLOWS = [
  "bg-[radial-gradient(closest-side,rgb(34_211_238/0.22),transparent)]",
  "bg-[radial-gradient(closest-side,rgb(168_85_247/0.3),transparent)]",
];

function FeatureCard({ draw }: { draw: FeatureDraw }) {
  const sponsor = sponsors.find(({ name }) => name === draw.donor);

  return (
    <section
      aria-labelledby="feature-heading"
      className="grid overflow-hidden rounded-2xl bg-ink/70 ring-2 ring-bronze-300 md:grid-cols-2"
    >
      {sponsor?.logo && (
        <div className="flex items-center overflow-hidden bg-white py-4 md:py-8">
          <Image
            src={asset(sponsor.logo)}
            alt={sponsor.name}
            width={1792}
            height={448}
            loading="eager"
            className="h-auto w-full scale-115"
          />
        </div>
      )}
      <div className="p-6 text-center sm:p-9 md:text-left">
        <p className="eyebrow inline-flex items-center gap-2">
          <Star aria-hidden className="size-4 fill-current" />
          Feature draw
        </p>
        <h2 id="feature-heading" className="display mt-3 text-white">
          <span className="block text-5xl text-bronze-300 sm:text-6xl">{draw.value}</span>{" "}
          <span className="mt-1.5 block text-2xl sm:text-3xl">{draw.name}</span>
        </h2>
        <p className="mt-3 text-pretty text-ice-200 sm:text-lg">{draw.description}</p>
      </div>
    </section>
  );
}

function CashCard({ prize, glow }: { prize: Prize; glow: string }) {
  return (
    <article className="relative isolate flex h-full flex-col items-center overflow-hidden rounded-2xl border border-white/10 bg-ink/55 px-6 py-6 text-center sm:py-10">
      <div aria-hidden className={`absolute -top-24 -z-10 size-80 ${glow}`} />
      <span className="grid size-16 place-items-center sm:size-24 rounded-full border-2 border-bronze-300/70 bg-ink/60 text-bronze-300">
        <PrizeIcon icon={prize.icon} className="size-8 sm:size-11" />
      </span>
      <h3 className="display mt-3 text-2xl text-white sm:text-4xl">{prize.name}</h3>
      <p className="mt-3 max-w-sm text-pretty text-ice-200 sm:text-lg">{prize.description}</p>
      {prize.fiftyFifty && raffle.fiftyFiftyUrl && (
        <a href={raffle.fiftyFiftyUrl} target="_blank" rel="noreferrer" className="btn mt-6">
          Buy tickets
          <ExternalLink aria-hidden className="size-4" />
        </a>
      )}
    </article>
  );
}

function PrizeTicket({ prize }: { prize: Prize }) {
  return (
    <article className="ticket flex h-full">
      <div className="flex w-(--stub) shrink-0 items-center justify-center bg-plum-800 text-bronze-300">
        <PrizeIcon icon={prize.icon} className="size-8 sm:size-11" />
      </div>
      <div className="flex min-w-0 sm:min-h-36 flex-1 flex-col justify-center border-l-2 border-dashed border-plum-900/25 bg-white p-4 sm:p-5 sm:px-6">
        <h3 className="display text-xl text-plum-900 sm:text-2xl">{prize.name}</h3>
        <p className="mt-2 text-pretty leading-snug text-plum-700">{prize.description}</p>
        {prize.donor && <p className="mt-2 text-sm text-plum-700">Donated by {prize.donor}</p>}
      </div>
    </article>
  );
}

export default function RafflePage() {
  const { feature, cash, draws, drawNotice, drawNote } = raffle;
  const isEmpty = !feature && cash.length === 0 && draws.length === 0;

  return (
    <>
      <div className="relative isolate overflow-hidden bg-[radial-gradient(80%_65%_at_30%_30%,var(--color-plum-800),var(--color-plum-950)_100%)]">
        <IceBackdrop rink={false} className="text-ice-100/[0.07]" />
        <div className="section relative pt-4 pb-7 sm:pt-12 sm:pb-16">
          <header className="grid items-center gap-3 text-center md:grid-cols-2 md:gap-10 md:text-left">
            <div className="relative isolate mx-auto w-44 max-w-[26rem] md:w-[85%]">
              <div aria-hidden className={`absolute -inset-[18%] -z-10 ${GLOWS[0]}`} />
              {/* The heading beside it says the same, so the badge is decorative. */}
              <Image
                src={asset("/raffle/badge.webp")}
                alt=""
                width={1256}
                height={1162}
                loading="eager"
                className="h-auto w-full"
              />
            </div>
            <div>
              <p className="eyebrow max-md:hidden">Win big</p>
              <h1 className="display text-3xl text-white sm:text-6xl md:mt-3">Raffle & 50/50</h1>
              <p className="mx-auto mt-2 max-w-md text-pretty sm:mt-4 sm:text-lg text-ice-300 md:mx-0">
                Support the tournament and take home cash, gear and great prizes.
              </p>
              {drawNotice && (
                <p className="mx-auto mt-4 flex max-w-md items-start gap-3 rounded-xl border border-bronze-300/40 bg-ink/50 p-4 text-left text-ice-100 md:mx-0">
                  <CalendarClock aria-hidden className="mt-0.5 size-5 shrink-0 text-bronze-300" />
                  <span className="text-pretty">
                    {drawNotice}
                    {drawNote && (
                      <strong className="mt-2 block font-semibold text-bronze-300">{drawNote}</strong>
                    )}
                  </span>
                </p>
              )}
            </div>
          </header>

          {feature && (
            <div className="mt-5 sm:mt-14">
              <FeatureCard draw={feature} />
            </div>
          )}
          {isEmpty && (
            <div className="mt-10">
              <ComingSoon icon={Gift} title="Prizes coming soon">
                Check back to see what&apos;s up for grabs.
              </ComingSoon>
            </div>
          )}
        </div>
      </div>

      {cash.length > 0 && (
        <section
          aria-labelledby="cash-heading"
          className="border-t border-white/[0.08] bg-plum-900"
        >
          <div className="section py-8 sm:py-16">
            <div className="text-center">
              <h2 id="cash-heading" className="display text-3xl text-white sm:text-5xl">
                Cash raffles
              </h2>
              <p className="mt-3 text-lg text-bronze-300">You win money</p>
            </div>
            <div className="mt-8 grid gap-4 sm:gap-6 md:grid-cols-2">
              {cash.map((prize, index) => (
                <Reveal key={prize.name} delay={index * 0.1}>
                  <CashCard prize={prize} glow={GLOWS[index % GLOWS.length]} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {draws.length > 0 && (
        <section
          aria-labelledby="draws-heading"
          className="relative isolate overflow-hidden bg-ice-200 py-8 text-plum-900 sm:py-16"
        >
          <IceBackdrop rink={false} className="text-plum-700/20" />
          <div className="section relative">
            <h2 id="draws-heading" className="display text-center text-3xl sm:text-5xl">
              Raffle draws
            </h2>
            <ul className="mt-5 flex flex-wrap justify-center gap-3 md:gap-4 sm:mt-10 lg:gap-5">
              {draws.map((prize) => (
                <li key={prize.name} className="w-full md:w-[calc(50%-0.625rem)]">
                  <PrizeTicket prize={prize} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Wider than the screen on phones, so the tickets and coins stay a good size. */}
      <div
        aria-hidden
        className="flex justify-center overflow-hidden bg-linear-to-b from-plum-950 to-ink pt-10 pb-6 sm:px-6 sm:pt-14 sm:pb-8"
      >
        <Image
          src={asset("/raffle/banner.webp")}
          alt=""
          width={1991}
          height={450}
          className="h-auto w-[135%] max-w-none shrink-0 sm:w-full sm:max-w-6xl"
        />
      </div>
    </>
  );
}
