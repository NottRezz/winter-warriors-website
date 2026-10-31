"use client";

import { useSyncExternalStore } from "react";
import { tournament } from "@/data/tournament";

function subscribe(onTick: () => void) {
  const timer = setInterval(onTick, 1000);
  return () => clearInterval(timer);
}

const currentSecond = () => Math.floor(Date.now() / 1000);
const beforeHydration = () => null;

export function Countdown() {
  const now = useSyncExternalStore(subscribe, currentSecond, beforeHydration);
  const start = Math.floor(new Date(tournament.startsAt).getTime() / 1000);
  const end = Math.floor(new Date(tournament.endsAt).getTime() / 1000);

  if (now !== null && now >= start) {
    return (
      <p className="display text-center text-xl sm:text-left">
        {now < end ? "Game on at Crowfoot Arena" : "Thanks for a great weekend"}
      </p>
    );
  }

  const left = now === null ? null : start - now;
  const units = [
    { label: "days", value: left === null ? null : Math.floor(left / 86400) },
    { label: "hours", value: left === null ? null : Math.floor(left / 3600) % 24 },
    { label: "min", value: left === null ? null : Math.floor(left / 60) % 60 },
    { label: "sec", value: left === null ? null : left % 60 },
  ];

  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between sm:gap-8">
      <p className="text-ice-300">Opening day countdown</p>
      <dl
        role="timer"
        aria-label="Time until the tournament starts"
        className="flex gap-7 sm:gap-9"
      >
        {units.map((unit) => (
          <div key={unit.label} className="flex items-baseline gap-1.5">
            <dd className="font-display text-2xl font-bold text-white tabular-nums">
              {unit.value === null ? "--" : String(unit.value).padStart(2, "0")}
            </dd>
            <dt className="order-last text-sm text-ice-300">{unit.label}</dt>
          </div>
        ))}
      </dl>
    </div>
  );
}
