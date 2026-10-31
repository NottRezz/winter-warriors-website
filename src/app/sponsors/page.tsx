import { Handshake } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { ComingSoon } from "@/components/coming-soon";
import { PageHeader } from "@/components/page-header";
import { sponsors } from "@/data/tournament";
import { asset } from "@/lib/asset";

export const metadata: Metadata = { title: "Sponsors & Donors" };

export default function SponsorsPage() {
  return (
    <>
      <PageHeader eyebrow="With thanks" title="Sponsors & Donors">
        Thank you to everyone supporting the tournament.
      </PageHeader>
      <div className="section py-12 sm:py-16">
        {sponsors.length === 0 ? (
          <ComingSoon icon={Handshake} title="Sponsors coming soon">
            Our sponsors and donors will be recognized here.
          </ComingSoon>
        ) : (
          <ul className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {sponsors.map((sponsor) => {
              const content = sponsor.logo ? (
                <Image
                  src={asset(sponsor.logo)}
                  alt={sponsor.name}
                  width={320}
                  height={180}
                  className="max-h-24 w-auto object-contain"
                />
              ) : (
                <span className="display text-center text-lg text-plum-900">
                  {sponsor.name}
                </span>
              );
              const tile =
                "flex aspect-[16/9] items-center justify-center rounded-xl bg-ice-100 p-5";

              return (
                <li key={sponsor.name}>
                  {sponsor.url ? (
                    <a
                      href={sponsor.url}
                      target="_blank"
                      rel="noreferrer"
                      className={`${tile} transition-transform hover:-translate-y-1`}
                    >
                      {content}
                    </a>
                  ) : (
                    <div className={tile}>{content}</div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}
