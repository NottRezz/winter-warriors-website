"use client";

import {
  CalendarDays,
  ChevronRight,
  Handshake,
  House,
  Medal,
  Menu,
  Navigation,
  ScrollText,
  Ticket,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { tournament } from "@/data/tournament";

const TABS = [
  { href: "/", label: "Home", icon: House },
  { href: "/schedule", label: "Schedule", icon: CalendarDays },
  { href: "/teams", label: "Teams", icon: Users },
  { href: "/raffle", label: "Raffle", icon: Ticket },
];

const MORE = [
  { href: "/rules", label: "Rules", icon: ScrollText },
  { href: "/awards", label: "Awards", icon: Medal },
  { href: "/sponsors", label: "Sponsors", icon: Handshake },
];

/** The app-style bar along the bottom on phones and tablets, within reach of a thumb. */
export function TabBar() {
  const pathname = usePathname().replace(/\/$/, "");
  const sheet = useRef<HTMLDialogElement>(null);

  const isCurrent = (href: string) =>
    href === "/" ? pathname === "" : pathname === href || pathname.startsWith(`${href}/`);
  const inMore = MORE.some((item) => isCurrent(item.href));
  const close = () => sheet.current?.close();

  const tab = (active: boolean) =>
    `flex h-full w-full flex-col items-center justify-center gap-1 text-[0.6875rem] font-semibold ${
      active ? "text-bronze-300" : "text-ice-300"
    }`;
  const pill = (active: boolean) =>
    `grid h-7 w-12 place-items-center rounded-full transition-colors ${
      active ? "bg-bronze-300/15" : ""
    }`;

  return (
    <>
      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        <ul className="mx-auto grid h-(--tab-bar) max-w-xl grid-cols-5">
          {TABS.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                aria-current={isCurrent(href) ? "page" : undefined}
                className={tab(isCurrent(href))}
              >
                <span className={pill(isCurrent(href))}>
                  <Icon aria-hidden className="size-[1.375rem]" />
                </span>
                {label}
              </Link>
            </li>
          ))}
          <li>
            <button
              type="button"
              aria-haspopup="dialog"
              onClick={() => sheet.current?.showModal()}
              className={tab(inMore)}
            >
              <span className={pill(inMore)}>
                <Menu aria-hidden className="size-[1.375rem]" />
              </span>
              More
            </button>
          </li>
        </ul>
      </nav>

      <dialog
        ref={sheet}
        aria-label="More"
        // A tap that lands on the dialog itself is a tap on the dimmed backdrop.
        onClick={(event) => event.target === event.currentTarget && close()}
        className="sheet"
      >
        <div className="px-4 pt-3 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <div className="flex items-center justify-between">
            <p className="display pl-2 text-xl text-white">More</p>
            <button
              type="button"
              aria-label="Close"
              onClick={close}
              className="grid size-12 place-items-center rounded-full text-ice-200"
            >
              <X aria-hidden />
            </button>
          </div>
          <ul className="mt-1">
            {MORE.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={close}
                  aria-current={isCurrent(href) ? "page" : undefined}
                  className="flex min-h-14 items-center gap-4 rounded-xl px-2 text-lg font-semibold text-white aria-[current=page]:text-bronze-300"
                >
                  <Icon aria-hidden className="size-5 text-bronze-300" />
                  <span className="flex-1">{label}</span>
                  <ChevronRight aria-hidden className="size-5 text-ice-300" />
                </Link>
              </li>
            ))}
          </ul>
          <a
            href={tournament.venue.directions}
            target="_blank"
            rel="noreferrer"
            onClick={close}
            className="btn mt-3 h-12 w-full"
          >
            <Navigation aria-hidden className="size-4" />
            Directions to {tournament.venue.name}
          </a>
        </div>
      </dialog>
    </>
  );
}
