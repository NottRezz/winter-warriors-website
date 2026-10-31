import { ExternalLink, Gift, Ticket } from "lucide-react";
import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";
import { PageHeader } from "@/components/page-header";
import { raffle } from "@/data/tournament";

export const metadata: Metadata = { title: "Raffle & 50/50" };

export default function RafflePage() {
  return (
    <>
      <PageHeader eyebrow="Win big" title="Raffle & 50/50">
        Support the tournament and take home a prize.
      </PageHeader>
      <div className="section grid gap-12 py-12 sm:py-16 lg:grid-cols-2">
        <section aria-labelledby="fifty-heading">
          <h2 id="fifty-heading" className="display text-2xl sm:text-3xl">
            50/50 raffle
          </h2>
          <div className="mt-5">
            {raffle.fiftyFiftyUrl ? (
              <div className="panel p-6 sm:p-8">
                <Ticket aria-hidden className="size-6 text-bronze-300" />
                <p className="mt-4 text-ice-300">
                  Tickets for the 50/50 are sold online.
                </p>
                <a
                  href={raffle.fiftyFiftyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn mt-6"
                >
                  Buy tickets
                  <ExternalLink aria-hidden className="size-4" />
                </a>
              </div>
            ) : (
              <ComingSoon icon={Ticket} title="Tickets coming soon">
                The link to buy 50/50 tickets will be posted here.
              </ComingSoon>
            )}
          </div>
        </section>

        <section aria-labelledby="items-heading">
          <h2 id="items-heading" className="display text-2xl sm:text-3xl">
            Raffle items
          </h2>
          <div className="mt-5">
            {raffle.items.length === 0 ? (
              <ComingSoon icon={Gift} title="Prizes coming soon">
                Check back to see what&apos;s up for grabs.
              </ComingSoon>
            ) : (
              <ul className="grid gap-3">
                {raffle.items.map((item) => (
                  <li key={item.name} className="panel p-5">
                    <p className="font-semibold text-white">{item.name}</p>
                    {item.description && (
                      <p className="mt-1 text-ice-300">{item.description}</p>
                    )}
                    {item.donor && (
                      <p className="mt-1 text-sm text-ice-300">
                        Donated by {item.donor}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
