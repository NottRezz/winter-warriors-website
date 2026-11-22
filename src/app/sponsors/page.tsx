import { Handshake } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { ComingSoon } from "@/components/coming-soon";
import { PageHeader } from "@/components/page-header";
import { type Sponsor, sponsors } from "@/data/tournament";
import { asset } from "@/lib/asset";

export const metadata: Metadata = { title: "Sponsors & Donors" };

/*
 * The rows of sponsors, biggest first. `width` and `height` match the canvases in
 * scripts/prepare-sponsors.mjs. Each tier's tiles are smaller than the one above at
 * every screen size, and an incomplete row stays centred.
 */
const TIERS = [
  {
    tier: 1,
    label: "Top sponsors",
    width: 1792,
    height: 448,
    list: "max-w-4xl",
    item: "w-full",
    tile: "aspect-[2/1] ring-4 ring-bronze-300 sm:aspect-[4/1] max-sm:[&_img]:scale-125",
  },
  {
    tier: 2,
    label: "Second tier sponsors",
    width: 736,
    height: 414,
    list: "max-w-[70%] sm:max-w-none",
    item: "w-full sm:w-[calc((100%-2*var(--gap))/3)]",
    tile: "aspect-[16/9]",
  },
  {
    tier: 3,
    label: "Third tier sponsors",
    width: 640,
    height: 360,
    list: "sm:max-w-[87%]",
    item: "w-[calc((100%-var(--gap))/2)] sm:w-[calc((100%-2*var(--gap))/3)]",
    tile: "aspect-[16/9]",
  },
  {
    tier: 4,
    label: "Fourth tier sponsors",
    width: 448,
    height: 280,
    list: "max-w-[84%] sm:max-w-[82%]",
    item: "w-[calc((100%-var(--gap))/2)] sm:w-[calc((100%-3*var(--gap))/4)]",
    tile: "aspect-[8/5]",
  },
  {
    tier: "community",
    label: "Community donors",
    width: 1008,
    height: 336,
    list: "max-w-[80%] sm:max-w-[38%] border-t border-white/10 pt-10 sm:pt-14",
    item: "w-full",
    tile: "aspect-[3/1]",
  },
] as const;

function SponsorTile({
  sponsor: { name, logo, url, background = "#ffffff" },
  layout,
}: {
  sponsor: Sponsor;
  layout: (typeof TIERS)[number];
}) {
  const className = `flex items-center justify-center overflow-hidden rounded-xl ${layout.tile}`;
  const content = logo ? (
    <Image
      src={asset(logo)}
      alt={name}
      width={layout.width}
      height={layout.height}
      loading={layout.tier === 1 ? "eager" : "lazy"}
      className="size-full object-contain"
    />
  ) : (
    <span className="display p-3 text-center text-lg text-plum-900">{name}</span>
  );

  return url ? (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className={`${className} transition-transform hover:-translate-y-1`}
      style={{ backgroundColor: background }}
    >
      {content}
    </a>
  ) : (
    <div className={className} style={{ backgroundColor: background }}>
      {content}
    </div>
  );
}

export default function SponsorsPage() {
  const rows = TIERS.map((layout) => ({
    layout,
    members: sponsors.filter((sponsor) => sponsor.tier === layout.tier),
  })).filter((row) => row.members.length > 0);

  return (
    <>
      <PageHeader eyebrow="With thanks" title="Sponsors & Donors">
        Thank you to everyone supporting the tournament.
      </PageHeader>
      <div className="section py-7 sm:py-16">
        {rows.length === 0 ? (
          <ComingSoon icon={Handshake} title="Sponsors coming soon">
            Our sponsors and donors will be recognized here.
          </ComingSoon>
        ) : (
          <div className="space-y-10 sm:space-y-12">
            {rows.map(({ layout, members }) => (
              <section key={layout.tier} aria-label={layout.label}>
                <ul
                  className={`mx-auto flex flex-wrap justify-center gap-(--gap) [--gap:0.75rem] lg:[--gap:1.5rem] ${layout.list}`}
                >
                  {members.map((sponsor) => (
                    <li key={sponsor.name} className={layout.item}>
                      <SponsorTile sponsor={sponsor} layout={layout} />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
