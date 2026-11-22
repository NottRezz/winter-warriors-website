import { ChevronDown, ScrollText } from "lucide-react";
import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";
import { PageHeader } from "@/components/page-header";
import { rules } from "@/data/tournament";

export const metadata: Metadata = { title: "Rules" };

export default function RulesPage() {
  return (
    <>
      <PageHeader eyebrow="Fair play" title="Game Play & Rules">
        How games run, how points are awarded and how ties are broken.
      </PageHeader>
      <div className="section max-w-4xl py-7 sm:py-16">
        {rules.length === 0 ? (
          <ComingSoon icon={ScrollText} title="Rules coming soon">
            The tournament rules, points system and tiebreakers will be posted here
            before the first game.
          </ComingSoon>
        ) : (
          <div className="grid gap-3">
            {rules.map((section, index) => (
              <details key={section.title} open={index === 0} className="panel group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 [&::-webkit-details-marker]:hidden">
                  <h2 className="text-lg font-semibold text-white">{section.title}</h2>
                  <ChevronDown
                    aria-hidden
                    className="size-5 shrink-0 text-ice-300 transition-transform group-open:rotate-180"
                  />
                </summary>
                <ul className="grid gap-2 px-5 pb-5 text-ice-300">
                  {section.items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span
                        aria-hidden
                        className="mt-2.5 size-1.5 shrink-0 rounded-full bg-bronze-300"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
