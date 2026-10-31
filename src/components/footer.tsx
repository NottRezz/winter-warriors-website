import Image from "next/image";
import Link from "next/link";
import { navigation, tournament } from "@/data/tournament";
import { asset } from "@/lib/asset";

export function Footer() {
  const { venue, contactEmail } = tournament;

  return (
    <footer className="border-t border-white/[0.08] bg-ink">
      <div className="section grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="flex items-center gap-4">
          <Image
            src={asset("/logos/crest.webp")}
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

        <nav aria-label="Footer">
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
            className="block hover:text-white"
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
