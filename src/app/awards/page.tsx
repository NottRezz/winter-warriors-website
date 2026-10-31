import { Trophy } from "lucide-react";
import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { awards } from "@/data/tournament";

export const metadata: Metadata = { title: "Awards" };

export default function AwardsPage() {
  return (
    <>
      <PageHeader eyebrow="Honours" title="Awards">
        Celebrating the players who bring it every shift.
      </PageHeader>
      <div className="section py-12 sm:py-16">
        {awards.length === 0 ? (
          <ComingSoon icon={Trophy} title="Awards coming soon">
            This year&apos;s awards and how they&apos;re chosen will be announced here.
          </ComingSoon>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {awards.map((award, index) => (
              <Reveal key={award.name} delay={index * 0.05}>
                <article className="panel h-full p-6">
                  <h2 className="display text-xl">{award.name}</h2>
                  <p className="mt-2 text-ice-300">{award.description}</p>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
