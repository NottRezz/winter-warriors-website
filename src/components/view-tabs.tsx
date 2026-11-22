"use client";

import { type ReactNode, useRef, useState } from "react";

type View = { id: string; label: string; content: ReactNode };

/**
 * On phones, shows one view at a time behind a switcher that sticks under the header.
 * From the large breakpoint up the switcher goes away and every view shows.
 *
 * `views` sets the order on desktop, `order` the order of the tabs. The first tab is open.
 */
export function ViewTabs({
  label,
  views,
  order,
  className = "",
}: {
  label: string;
  views: View[];
  order: string[];
  className?: string;
}) {
  const [active, setActive] = useState(order[0]);
  const top = useRef<HTMLDivElement>(null);

  function show(id: string) {
    setActive(id);
    // A new view should start at its beginning, not halfway down.
    const anchor = top.current;
    if (anchor && anchor.getBoundingClientRect().top < 0) {
      anchor.scrollIntoView({ block: "start", behavior: "instant" });
    }
  }

  return (
    <>
      <div ref={top} className="scroll-mt-(--header)" />
      <div className="sticky top-(--header) z-30 border-b border-white/[0.08] bg-plum-950 lg:hidden">
        <div role="group" aria-label={label} className="section flex gap-1 py-2">
          {order.map((id) => (
            <button
              key={id}
              type="button"
              aria-pressed={active === id}
              onClick={() => show(id)}
              className={`min-h-11 flex-1 rounded-lg text-sm font-semibold transition-colors ${
                active === id ? "bg-bronze-300 text-ink" : "bg-white/[0.05] text-ice-200"
              }`}
            >
              {views.find((view) => view.id === id)?.label}
            </button>
          ))}
        </div>
      </div>
      <div className={className}>
        {views.map((view) => (
          <div
            key={view.id}
            className={`min-w-0 ${active === view.id ? "view-in" : "max-lg:hidden"}`}
          >
            {view.content}
          </div>
        ))}
      </div>
    </>
  );
}
