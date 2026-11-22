"use client";

import { Navigation } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation, tournament } from "@/data/tournament";
import { asset } from "@/lib/asset";

/** On phones the pages live in the tab bar, leaving room here for directions. */
export function Header() {
  const pathname = usePathname().replace(/\/$/, "");

  const isCurrent = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 h-(--header) border-b border-white/[0.08] bg-plum-950 pt-[env(safe-area-inset-top)] lg:bg-plum-950/85 lg:backdrop-blur-lg">
      <div className="section flex h-full items-center justify-between gap-4">
        <Link href="/" className="flex min-h-11 items-center gap-2.5">
          <Image
            src={asset("/logos/crest-sm.webp")}
            alt=""
            width={1330}
            height={907}
            loading="eager"
            className="h-9 w-auto"
          />
          <span className="font-display text-[0.95rem] font-bold tracking-tight">
            {tournament.shortName}
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isCurrent(item.href) ? "page" : undefined}
              className={`text-[0.95rem] font-medium transition-colors ${
                isCurrent(item.href) ? "text-white" : "text-ice-300 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <a
          href={tournament.venue.directions}
          target="_blank"
          rel="noreferrer"
          aria-label={`Directions to ${tournament.venue.name}`}
          className="flex min-h-11 items-center gap-1.5 text-sm font-semibold text-bronze-300 lg:hidden"
        >
          <Navigation aria-hidden className="size-4" />
          Arena
        </a>
      </div>
    </header>
  );
}
