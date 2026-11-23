"use client";

import { useSyncExternalStore } from "react";
import { games as localGames, type Game } from "@/data/tournament";
import { asset } from "@/lib/asset";

const REFRESH_MS = 15_000;
const TIMEOUT_MS = 15_000;

type State = { games: Game[]; updatedAt: Date | null; failed: boolean };

// Shared by every component, so the Schedule and team pages always agree and scores
// don't disappear while moving between pages.
const initial: State = { games: localGames, updatedAt: null, failed: false };
let state = initial;
let refreshing = false;
const listeners = new Set<() => void>();

function publish(next: State) {
  state = next;
  listeners.forEach((listener) => listener());
}

async function refresh() {
  if (refreshing) return;
  refreshing = true;

  // Arena wifi can hang, and one stuck request mustn't stop every later one.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(asset("/api/games"), { signal: controller.signal });
    if (!response.ok) throw new Error(`Scores answered ${response.status}`);
    const { games } = (await response.json()) as { games: Game[] };
    if (!Array.isArray(games)) throw new Error("No games in the answer");
    publish({ games, updatedAt: new Date(), failed: false });
  } catch {
    // Keep showing the last good copy; the next refresh may recover.
    publish({ ...state, failed: true });
  } finally {
    clearTimeout(timeout);
    refreshing = false;
  }
}

// Phones pause timers while locked, so check again as soon as someone looks.
function refreshIfVisible() {
  if (document.visibilityState === "visible") refresh();
}

let timer: ReturnType<typeof setInterval> | undefined;

function subscribe(listener: () => void) {
  listeners.add(listener);

  if (listeners.size === 1) {
    refresh();
    timer = setInterval(refresh, REFRESH_MS);
    document.addEventListener("visibilitychange", refreshIfVisible);
    window.addEventListener("online", refresh);
  }

  return () => {
    listeners.delete(listener);
    if (listeners.size > 0) return;
    clearInterval(timer);
    document.removeEventListener("visibilitychange", refreshIfVisible);
    window.removeEventListener("online", refresh);
  };
}

/**
 * Games with the scorekeepers' latest scores. The data file's schedule shows until the
 * scores first load, or if they can't be reached.
 */
export function useGames() {
  const current = useSyncExternalStore(subscribe, () => state, () => initial);
  return { ...current, isLive: true };
}
