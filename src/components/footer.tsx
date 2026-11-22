import Image from "next/image";
import Link from "next/link";
import { navigation, tournament } from "@/data/tournament";
import { asset } from "@/lib/asset";

export function Footer() {
  const { venue, contactEmail } = tournament;

  return (
    <footer className="border-t border-white/[0.08] bg-ink max-lg:pb-[calc(var(--tab-bar)+env(safe-area-inset-bottom))]">
      <div className="section grid gap-4 py-7 lg:gap-10 lg:py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="flex items-center gap-4">
          <Image
            src={asset("/logos/crest-sm.webp")}
            alt=""
            width={1330}
            height={907}
            className="h-16 w-auto"
          />
          <div>
            <p className="font-display font-bold tracking-tight">{tournament.name}</p>
            <p className="mt-1 text-sm text-ice-300">{tournament.dateLabel}</p>
          </div>
        </div>

        <nav aria-label="Footer" className="max-lg:hidden">
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-ice-300 hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="text-sm text-ice-300">
          <a
            href={venue.directions}
            target="_blank"
            rel="noreferrer"
            className="block py-2 hover:text-white lg:py-0"
          >
            {venue.name}
            <br />
            {venue.street}, {venue.city}
          </a>
          {contactEmail && (
            <a
              href={`mailto:${contactEmail}`}
              className="mt-2 block break-all hover:text-white"
            >
              {contactEmail}
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
