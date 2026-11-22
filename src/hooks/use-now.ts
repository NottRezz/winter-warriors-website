"use client";

import { useSyncExternalStore } from "react";

const TICK_MS = 30_000;

function subscribe(onTick: () => void) {
  const timer = setInterval(onTick, TICK_MS);
  // Timers pause while a phone is locked.
  document.addEventListener("visibilitychange", onTick);
  return () => {
    clearInterval(timer);
    document.removeEventListener("visibilitychange", onTick);
  };
}

// Rounded, so it reads the same until there's something new to show.
const currentTime = () => Math.floor(Date.now() / TICK_MS) * TICK_MS;

/** The time to the half minute, or null before the page has loaded in the browser. */
export function useNow() {
  return useSyncExternalStore(subscribe, currentTime, () => null);
}
